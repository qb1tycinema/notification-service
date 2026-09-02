import { Controller } from "@nestjs/common"
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices"
import type { OtpRequestedEvent } from "@qb1tycinema/contracts"

import { NotificationsService } from "./notifications.service"
import { RmqService } from "@/infrastructure/rmq/rmq.service"

@Controller()
export class NotificationsController {
	public constructor(
		private readonly notificationsService: NotificationsService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern("auth.otp.requested")
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.notificationsService.sendOtp(data)

			this.rmqService.ack(ctx)
		} catch (error) {
			console.log("OTP proccessing error: ", error)

			this.rmqService.nack(ctx)
		}
	}
}
