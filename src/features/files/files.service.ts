import { FilesRepository } from "./files.repository";
import { FileSchema } from "./files.schema";
import { minio } from "../../providers/minio/minio.provider";
import { env } from "../../shared/config/env";

export namespace FilesService {
	export async function create(
		file: Pick<FileSchema, "filename" | "filetype" | "fileSize" | "minioKey">,
	) {
		const newFilename = Bun.randomUUIDv7();
		const isLargerThan50Mb = file.fileSize > 50 * 1024 * 1024;
		if (isLargerThan50Mb) {
			throw new Error("File size cannot be larger than 50MB");
		}

		return FilesRepository.create({
			...file,
			filename: newFilename,
		});
	}

	export function findAll(options?: { page: number; itemsPerPage: number }) {
		return FilesRepository.findAll(options);
	}

	export function findById(fileId: string) {
		return FilesRepository.findById(fileId);
	}

	export function update(
		fileId: string,
		file: Partial<Pick<FileSchema, "filename" | "filetype" | "fileSize">>,
	) {
		return FilesRepository.update(fileId, file);
	}

	export async function deleteById(fileId: string) {
		const file = await FilesRepository.findById(fileId);
		if (!file) {
			throw new Error("File not found");
		}
		await minio.removeObject(env.MINIO_BUCKET_NAME, file.minioKey);
		return FilesRepository.deleteById(fileId);
	}
}
