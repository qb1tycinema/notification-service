import { Injectable } from "@nestjs/common"
import type { OtpRequestedEvent } from "@qb1tycinema/contracts"

import { MailService } from "@/infrastructure/mail/mail.service"
import { SmsService } from "@/infrastructure/sms/sms.service"

@Injectable()
export class NotificationsService {
	public constructor(
		private readonly mailService: MailService,
		private readonly smsService: SmsService
	) {}

	public async sendOtp(data: OtpRequestedEvent) {
		const { identifier, code, type } = data

		if (type === "email") {
			await this.mailService.sendOtp(identifier, code)
		}

		if (type === "phone") {
			await this.smsService.sendOtp(identifier, code)
		}
	}
}
