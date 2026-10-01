import { Module } from "@nestjs/common"

import { MetricsModule } from "./metrics/metrics.module"
import { TracingModule } from "./tracing/tracing.module"
import { RmqModule } from "@/infrastructure/rmq/rmq.module"

@Module({
	imports: [MetricsModule, RmqModule, TracingModule]
})
export class ObservabilityModule {}
