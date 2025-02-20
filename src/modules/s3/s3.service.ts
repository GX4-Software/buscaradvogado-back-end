import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class S3Service {
	constructor(@Inject("S3_CLIENT") private readonly s3Client: S3Client) {}

	async uploadFile(
		bucket: string,
		key: string,
		body: Buffer | string,
		contentType: string,
	): Promise<string> {
		const formattedKey = key.replace(/\\/g, '/');

		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: formattedKey,
			Body: body,
			ContentType: contentType,
		})
		await this.s3Client.send(command)

		return key;
	}

	async getFile(bucket: string, key: string): Promise<any> {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		})
		return await this.s3Client.send(command)
	}

	async getPresignedUrl(
		bucket: string,
		key: string,
		expiresInSeconds: number = 3600,
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		})

		return await getSignedUrl(this.s3Client, command, {
			expiresIn: expiresInSeconds,
		})
	}

	async getFileStream(
		bucket: string,
		key: string,
	): Promise<NodeJS.ReadableStream> {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		})
		const response = await this.s3Client.send(command)
		return response.Body as NodeJS.ReadableStream
	}

	async getUrl(bucket: string, key: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		})

		return await getSignedUrl(this.s3Client, command)
	}

	async deleteFile(bucket: string, key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		})
		await this.s3Client.send(command)
	}
}
