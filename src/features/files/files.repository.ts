import prisma from "../../providers/database/database.provider";
import { FileSchema } from "./files.schema";

export namespace FilesRepository {
	export async function create(
		file: Pick<FileSchema, "filename" | "filetype" | "fileSize" | "minioKey">,
	) {
		return await prisma.file.create({
			data: {
				...file,
			},
		});
	}

	export async function findAll(
		options: { page: number; itemsPerPage: number } = {
			page: 1,
			itemsPerPage: 10,
		},
	) {
		return await prisma.file.findMany({
			take: 10,
			skip: (options.page - 1) * options.itemsPerPage,
		});
	}

	export async function findById(fileId: string) {
		return await prisma.file.findUnique({
			where: {
				id: fileId,
			},
		});
	}

	export async function update(
		fileId: string,
		file: Partial<Pick<FileSchema, "filename" | "filetype" | "fileSize">>,
	) {
		return await prisma.file.update({
			where: {
				id: fileId,
			},
			data: file,
		});
	}

	export async function deleteById(fileId: string) {
		return await prisma.file.delete({
			where: {
				id: fileId,
			},
		});
	}
}
