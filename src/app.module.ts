import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { LoggerModule } from "nestjs-pino"

import { configuration } from "./config"
import { getPinoConfig } from "./config/factories"
import { MailModule } from "./infrastructure/mail/mail.module"
import { RmqModule } from "./infrastructure/rmq/rmq.module"
import { SmsModule } from "./infrastructure/sms/sms.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { ObservabilityModule } from "./observability/observability.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				`.env`
			],
			load: [configuration],
			expandVariables: true
		}),
		LoggerModule.forRootAsync({
			useFactory: getPinoConfig,
			inject: [ConfigService]
		}),
		RmqModule,
		ObservabilityModule,
		NotificationsModule,
		MailModule,
		SmsModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
