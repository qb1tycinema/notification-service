import { HttpService } from "@nestjs/axios"
import { Inject, Injectable, Logger } from "@nestjs/common"
import {
	catchError,
	delay,
	firstValueFrom,
	retryWhen,
	scan,
	throwError,
	timeout
} from "rxjs"

import { SMS_OPTIONS } from "./constants"
import type {
	MobizonResponse,
	SendSmsRequest,
	SendSmsResponse,
	SmsOptions
} from "./interfaces"

@Injectable()
export class SmsService {
	private readonly logger = new Logger(SmsService.name)
	private readonly BASE_URL!: string

	public constructor(
		private readonly httpService: HttpService,
		@Inject(SMS_OPTIONS) private readonly options: SmsOptions
	) {
		this.BASE_URL = `https://${this.options.domain}`
	}

	public async sendOtp(phone: string, code: string) {
		return this.send({
			recipient: phone,
			text: `Ваш код подтверждения: ${code}`
		})
	}

	public async sendPhoneChange(phone: string, code: string) {
		return this.send({
			recipient: phone,
			text: `Ваш код подтверждения смены номера телефона: ${code}`
		})
	}

	public async send(
		data: SendSmsRequest
	): Promise<MobizonResponse<SendSmsResponse>> {
		const path = `/service/message/sendSmsMessage?output=json&api=v1&apiKey=${this.options.apiKey}`
		const { recipient, text } = data

		const body = new URLSearchParams({
			recipient: recipient.replace("+", ""),
			text: text
		}).toString()

		const response = await this.request<MobizonResponse<SendSmsResponse>>(
			"POST",
			path,
			body
		)

		if (response.code !== 0) {
			throw new Error(
				`Mobizon API Error [${response.code}]: ${response.message}`
			)
		}

		return response
	}

	private async request<T>(
		method: "GET" | "POST",
		path: string,
		body?: any
	): Promise<T> {
		const url = `${this.BASE_URL}${path}`

		try {
			const request = this.httpService
				.request<T>({
					method,
					url,
					data: body,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Cache-Control": "no-cache"
					}
				})
				.pipe(
					timeout(7000),
					retryWhen(errors =>
						errors.pipe(
							scan((retryCount, error) => {
								if (retryCount >= 2) {
									throw error
								}

								this.logger.warn(
									`Retry request ${method} ${path}: ${retryCount + 1}/3`
								)

								return retryCount + 1
							}, 0),
							delay(500)
						)
					),
					catchError(error => {
						const details =
							error.response?.data ?? error.message ?? error

						this.logger.error(
							`Mobizon API error (${method} ${path}) \n${JSON.stringify(details)}`
						)

						return throwError(() => error)
					})
				)

			const response = await firstValueFrom(request)

			return response.data
		} catch (error: any) {
			this.logger.error(
				`Request failed (${method} ${path}): ${error.message ?? "Неизвестная ошибка"}`
			)

			throw error
		}
	}
}
