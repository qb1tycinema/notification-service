import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"
import { getSmsConfig } from "@/config/factories"
import { MailModule } from "@/infrastructure/mail/mail.module"
import { SmsModule } from "@/infrastructure/sms/sms.module"

@Module({
	imports: [
		MailModule,
		SmsModule.registerAsync({
			useFactory: getSmsConfig,
			inject: [ConfigService]
		})
	],
	controllers: [NotificationsController],
	providers: [NotificationsService]
})
export class NotificationsModule {}
