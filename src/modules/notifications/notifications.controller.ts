import { Controller, Logger } from "@nestjs/common"
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices"
import type {
	EmailChangeEvent,
	OtpRequestedEvent,
	PhoneChangeEvent
} from "@qb1tycinema/contracts"

import { NotificationsService } from "./notifications.service"
import { RmqService } from "@/infrastructure/rmq/rmq.service"

@Controller()
export class NotificationsController {
	private readonly logger = new Logger(NotificationsController.name)

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
			this.logger.error("OTP proccessing error: ", error)

			this.rmqService.nack(ctx)
		}
	}

	@EventPattern("account.phone.change")
	public async phoneChange(
		@Payload() data: PhoneChangeEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.notificationsService.phoneChange(data)

			this.rmqService.ack(ctx)
		} catch (error) {
			this.logger.error("Phone change proccessing error: ", error)

			this.rmqService.nack(ctx)
		}
	}

	@EventPattern("account.email.change")
	public async emailChange(
		@Payload() data: EmailChangeEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.notificationsService.emailChange(data)

			this.rmqService.ack(ctx)
		} catch (error) {
			this.logger.error("Email change proccessing error: ", error)

			this.rmqService.nack(ctx)
		}
	}
}
