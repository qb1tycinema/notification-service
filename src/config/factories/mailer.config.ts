import type { MailerOptions } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"

export function getMailerConfig(config: ConfigService): MailerOptions {
	return {
		transport: {
			host: config.get("smtp.host"),
			port: config.get("smtp.port"),
			auth: {
				user: config.get("smtp.username"),
				pass: config.get("smtp.password")
			},
			secure: config.get("smtp.secure")
		},
		defaults: {
			from: `Qb1tycinema ${config.get("smtp.fromAddress")}`
		}
	}
}
