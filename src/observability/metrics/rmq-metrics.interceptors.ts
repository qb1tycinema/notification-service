import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor
} from "@nestjs/common"
import type { RmqContext } from "@nestjs/microservices"
import {
	context as otelContext,
	propagation,
	SpanStatusCode,
	trace
} from "@opentelemetry/api"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { PinoLogger } from "nestjs-pino"
import { Counter, Histogram } from "prom-client"
import { catchError, finalize, type Observable, tap, throwError } from "rxjs"

import { RmqService } from "@/infrastructure/rmq/rmq.service"

@Injectable()
export class RmqMetricsInterceptor implements NestInterceptor {
	private readonly serviceName!: string

	public constructor(
		private readonly logger: PinoLogger,
		@InjectMetric("rmq_event_processing_duration_seconds")
		private readonly processingDuration: Histogram<string>,
		@InjectMetric("rmq_events_total")
		private readonly eventsTotal: Counter<string>,
		private readonly rmqService: RmqService
	) {
		this.serviceName = "notification-service"
		this.logger.setContext(RmqMetricsInterceptor.name)
	}

	public intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> {
		if (context.getType() !== "rpc") {
			return next.handle()
		}

		const ctx = context.switchToRpc().getContext<RmqContext>()
		const event = ctx.getPattern()
		const message = ctx.getMessage()

		const headers = message?.properties?.headers || {}
		const messageId = message?.properties?.messageId

		const parentContext = propagation.extract(otelContext.active(), headers)
		const tracer = trace.getTracer(this.serviceName)

		return tracer.startActiveSpan(
			`RMQ Consume: ${event}`,
			{},
			parentContext,
			span => {
				this.logger.info(
					{ event, messageId },
					"Received RMQ event for processing"
				)

				const endTimer = this.processingDuration.startTimer({
					service: this.serviceName,
					event
				})

				return next.handle().pipe(
					tap({
						complete: () => {
							this.logger.debug(
								{ event, messageId },
								"Successfully processed and acknowledged RMQ event"
							)

							this.eventsTotal.inc({
								service: this.serviceName,
								event,
								status: "success"
							})

							this.rmqService.ack(ctx, event)

							span.setStatus({ code: SpanStatusCode.OK })
						}
					}),
					catchError(error => {
						this.logger.error(
							{ err: error, event, messageId },
							"Error processing RMQ event, negatively acknowledged"
						)

						this.eventsTotal.inc({
							service: this.serviceName,
							event,
							status: "error"
						})

						this.rmqService.nack(ctx, event)

						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: error.message || "unknown message"
						})
						span.recordException(error)

						return throwError(() => error)
					}),
					finalize(() => {
						endTimer()
						span.end()
					})
				)
			}
		)
	}
}
