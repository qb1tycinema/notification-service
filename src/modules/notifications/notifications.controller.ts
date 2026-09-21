import { Controller } from "@nestjs/common"
import { EventPattern, Payload } from "@nestjs/microservices"
import type {
	EmailChangeEvent,
	OtpRequestedEvent,
	PhoneChangeEvent
} from "@qb1tycinema/contracts"

import { NotificationsService } from "./notifications.service"

@Controller()
export class NotificationsController {
	public constructor(
		private readonly notificationsService: NotificationsService,
	) {}

	@EventPattern("auth.otp.requested")
	public async otpRequested(@Payload() data: OtpRequestedEvent) {
		await this.notificationsService.sendOtp(data)
	}

	@EventPattern("account.phone.change")
	public async phoneChange(@Payload() data: PhoneChangeEvent) {
		await this.notificationsService.phoneChange(data)
	}

	@EventPattern("account.email.change")
	public async emailChange(@Payload() data: EmailChangeEvent) {
		await this.notificationsService.emailChange(data)
	}
}
