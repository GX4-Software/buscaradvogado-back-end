import { EnvModule } from "src/commons/env/env.module"
import { EnvService } from "src/commons/env/env.service"
import { S3Client } from "@aws-sdk/client-s3"
import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { S3Service } from "./s3.service"

@Module({
	imports: [EnvModule, MulterModule.register({})],
	exports: [S3Service],
	providers: [
		S3Service,
		{
			provide: "S3_CLIENT",
			inject: [EnvService],
			useFactory(env: EnvService) {
				return new S3Client({
					region: env.get("S3_REGION"),
					endpoint: env.get("S3_ENDPOINT"),
					credentials: {
						accessKeyId: env.get("S3_ACCESS_KEY_ID"),
						secretAccessKey: env.get("S3_ACCESS_KEY_SECRET"),
					},
					forcePathStyle: true,
				})
			},
		},
	],
})
export class S3Module {}
