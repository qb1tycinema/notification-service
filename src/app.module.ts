import { Module } from "@nestjs/common"
import { RmqModule } from './infrastructure/rmq/rmq.module';
import { ConfigModule } from "@nestjs/config";
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { configuration } from "./config";

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
