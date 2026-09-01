import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { configuration } from "./config"
import { MailModule } from "./infrastructure/mail/mail.module"
import { RmqModule } from "./infrastructure/rmq/rmq.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			expandVariables: true
		}),
		RmqModule,
		NotificationsModule,
		MailModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
