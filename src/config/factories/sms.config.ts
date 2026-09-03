import { ConfigService } from "@nestjs/config"

import type { SmsOptions } from "@/infrastructure/sms/interfaces"

export function getSmsConfig(config: ConfigService): SmsOptions {
	return {
		apiKey: config.get("mobizon.apiKey"),
		domain: config.get("mobizon.domain")
	}
}
