import { Injectable } from "@nestjs/common"
import type {
	EmailChangeEvent,
	OtpRequestedEvent,
	PhoneChangeEvent
} from "@qb1tycinema/contracts"

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

	public async phoneChange(data: PhoneChangeEvent) {
		const { code, phone } = data

		await this.smsService.sendPhoneChange(phone, code)
	}

	public async emailChange(data: EmailChangeEvent) {
		const { email, code } = data

		await this.mailService.sendEmailChange(email, code)
	}
}
