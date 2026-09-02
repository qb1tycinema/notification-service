import { MailService } from "@/infrastructure/mail/mail.service";
import { Injectable } from "@nestjs/common"
import type { OtpRequestedEvent } from "@qb1tycinema/contracts";

@Injectable()
export class NotificationsService {
    public constructor(
        private readonly mailService: MailService
    ) {}

    public async sendOtp(data: OtpRequestedEvent) {
        const { identifier, code, type } = data
        
        if (type === "email") {
            await this.mailService.sendOtp(identifier, code)
        }

        if (type === "phone") {
            console.log("SMS")
        }
    }
}
