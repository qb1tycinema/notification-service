import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"

import { MetricsModule } from "./metrics/metrics.module"
import { RmqMetricsInterceptor } from "./metrics/rmq-metrics.interceptors"
import { RmqModule } from "@/infrastructure/rmq/rmq.module"

@Module({
	imports: [MetricsModule, RmqModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: RmqMetricsInterceptor
		}
	]
})
export class ObservabilityModule {}
