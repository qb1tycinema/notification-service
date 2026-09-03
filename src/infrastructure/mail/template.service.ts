import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as Handlebars from "handlebars"
import * as path from "path"

@Injectable()
export class TemplateService {
	private cache = new Map<string, Handlebars.TemplateDelegate>()

	public async render(template: string, context?: Record<string, any>) {
		if (!this.cache.has(template)) {
			const templatePath = path.join(
				process.cwd(),
				"src/infrastructure/mail/templates",
				`${template}.hbs`
			)

			const file = fs.readFileSync(templatePath, "utf-8")

			this.cache.set(template, Handlebars.compile(file))
		}

		const templateName = this.cache.get(template)

		return templateName!(context)
	}
}
