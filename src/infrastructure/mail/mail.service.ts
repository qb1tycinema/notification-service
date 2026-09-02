import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common"

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService
    ) {}

    public async sendOtp(email: string, code: string) {
        const html = `<h1>Ваш код ${code}</h1>`

        await this.mailerService.sendMail({
            to: email,
            subject: "Ваш код подтверждения",
            html
        })
    }
}
