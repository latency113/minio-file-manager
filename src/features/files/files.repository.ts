import prisma from "../../providers/database/database.provider";
import { FileSchema } from "./files.schema";

export namespace FilesRepository {
  export async function create(
    file: Pick<FileSchema, "filename" | "filetype" | "fileSize">
  ) {
    return await prisma.file.create({
      data: {
        ...file,
      },
    });
  }

  export async function findAll(options: { skip: number; take: number; search?: string }) {
    const where = options.search?
      {
          filename: {
            contains: options.search,
          },
        }
      : {};

    return prisma.file.findMany({
      where,
      take: options.take,
      skip: options.skip,
      orderBy: { createdAt: "desc" },
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
    file: Partial<Pick<FileSchema, "filename" | "filetype" | "fileSize">>
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

  export async function countAll(search?: string) {
    const where = search
      ?
      {
          filename: {
            contains: search,
          },
        }
      : {};
    return await prisma.file.count({ where });
  }
}
