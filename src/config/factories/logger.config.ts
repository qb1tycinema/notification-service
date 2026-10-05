import type { ConfigService } from "@nestjs/config"
import type { Params } from "nestjs-pino"

export function getPinoConfig(service: ConfigService): Params {
	return {
		pinoHttp: {
			level: service.get("logger.level"),
			transport: {
				target: "pino/file",
				options: {
					destination:
						"/var/log/services/notification/notification.log",
					mkdir: true
				}
			},
			messageKey: "msg",
			customProps: () => ({
				service: "notification-service"
			})
		}
	}
}
