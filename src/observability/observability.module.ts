import { Module } from "@nestjs/common"

import { MetricsModule } from "./metrics/metrics.module"
import { RmqModule } from "@/infrastructure/rmq/rmq.module"

@Module({
	imports: [MetricsModule, RmqModule]
})
export class ObservabilityModule {}
