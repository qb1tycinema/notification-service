import { z } from "zod"

export enum Environemt {
	Development = "development",
	Production = "production",
	Test = "test"
}

export default z.object({
	NODE_ENV: z.enum(Environemt).default(Environemt.Development),
	RMQ_URL: z.string().nonempty(),
	RMQ_QUEUE: z.string().nonempty()
})
