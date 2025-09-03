import { FilesRepository } from "./files.repository";
import { FileSchema } from "./files.schema";
import { minio } from "../../providers/minio/minio.provider";
import { env } from "../../shared/config/env";
import { getContentTypeFromFileType } from "@/shared/content-type";
import { getPaginationParams } from "@/shared/utils/pagination";

export namespace FilesService {
  const BUCKET_NAME = "files" as const;

  export async function create(
    file: Pick<FileSchema, "filename" | "filetype" | "fileSize">
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

  export async function findAll(
    options: { page?: number; itemsPerPage?: number; search?: string } = {}
  ) {
    const page = options.page ?? 1;
    const itemsPerPage = options.itemsPerPage ?? 10;
    const search = options.search;

    const { skip, take } = getPaginationParams(page, itemsPerPage);
    const files = await FilesRepository.findAll({ skip, take, search });
    const total = await FilesRepository.countAll(search);

    const totalPages = ((total + itemsPerPage - 1) / itemsPerPage) >> 0;
    const nextPage = page < totalPages;
    const previousPage = page > 1;

    return {
      data: files,
      meta_data: {
        page,
        itemsPerPage,
        total,
        totalPages,
        nextPage,
        previousPage,
      },
    };
  }

  export function findById(fileId: string) {
    return FilesRepository.findById(fileId);
  }

  export function update(
    fileId: string,
    file: Partial<Pick<FileSchema, "filename" | "filetype" | "fileSize">>
  ) {
    return FilesRepository.update(fileId, file);
  }

  export async function deleteById(fileId: string) {
    const file = await FilesRepository.findById(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    await minio.removeObject(env.MINIO_BUCKET_NAME, file.filename);
    return FilesRepository.deleteById(fileId);
  }

  export async function createPreSignUrl(fileId: string) {
    const file = await findById(fileId);
    if (!file) {
      return null;
    }

    const expireInSeconds = 60 * 5;
    const url = await minio.presignedPutObject(
      BUCKET_NAME,
      file.filename,
      expireInSeconds
    );

    return {
      url,
      file,
      contentType: getContentTypeFromFileType(file.filetype),
      method: "PUT",
    };
  }
}
