export interface SendSmsRequest {
	recipient: string
	text: string
}

export interface MobizonResponse<T = any> {
	code: number
	message?: string
	data?: T
}

export interface SendSmsResponse {
	campaignId: string
	messageId: string
	status: number
}
