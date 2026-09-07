import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"

import { TemplateService } from "./template.service"

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly templateService: TemplateService
	) {}

	public async sendOtp(email: string, code: string) {
		const html = await this.templateService.render("otp", { code })

		await this.mailerService.sendMail({
			to: email,
			subject: "Ваш код подтверждения",
			html
		})
	}

	public async sendEmailChange(email: string, code: string) {
		const html = await this.templateService.render("email-change", { code })

		await this.mailerService.sendMail({
			to: email,
			subject: "Ваш код подтверждения смены почты",
			html
		})
	}
}
