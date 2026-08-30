import { Module } from "@nestjs/common"
import { RmqModule } from './infrastructure/rmq/rmq.module';
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		RmqModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
