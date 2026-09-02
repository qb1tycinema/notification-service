import { Module } from "@nestjs/common"

import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"
import { MailService } from "@/infrastructure/mail/mail.service"

@Module({
	controllers: [NotificationsController],
	providers: [NotificationsService, MailService]
})
export class NotificationsModule {}
