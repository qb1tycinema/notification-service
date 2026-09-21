import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor
} from "@nestjs/common"
import type { RmqContext } from "@nestjs/microservices"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter, Histogram } from "prom-client"
import { catchError, finalize, type Observable, tap, throwError } from "rxjs"

import { RmqService } from "@/infrastructure/rmq/rmq.service"

@Injectable()
export class RmqMetricsInterceptor implements NestInterceptor {
	private readonly serviceName!: string
	private readonly logger = new Logger(RmqMetricsInterceptor.name)

	public constructor(
		@InjectMetric("rmq_event_processing_duration_seconds")
		private readonly processingDuration: Histogram<string>,
		@InjectMetric("rmq_events_total")
		private readonly eventsTotal: Counter<string>,
		private readonly rmqService: RmqService
	) {
		this.serviceName = "notification-service"
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

		const endTimer = this.processingDuration.startTimer({
			service: this.serviceName,
			event
		})

		return next.handle().pipe(
			tap(() => {
				this.logger.log(`Success processing event [${event}]:`)

				this.eventsTotal.inc({
					service: this.serviceName,
					event,
					status: "success"
				})

				this.rmqService.ack(ctx, event)
			}),
			catchError(error => {
				this.logger.error(`Error processing event [${event}]:`, error)

				this.eventsTotal.inc({
					service: this.serviceName,
					event,
					status: "error"
				})

				this.rmqService.nack(ctx, event)

				return throwError(() => error)
			}),
			finalize(() => {
				endTimer()
			})
		)
	}
}
