import Elysia, { t } from "elysia";
import { fileSchema } from "./files.schema";
import { FilesService } from "./files.service";

export namespace FilesController {
  export const filesController = new Elysia({ prefix: "/files" })
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const file = await FilesService.create(body);

          set.status = "Created";
          return file;
        } catch (error: any) {
          set.status = "Internal Server Error";
          if ("message" in error) {
            return error.message;
          }
          return "Internal Server Error";
        }
      },
      {
        body: t.Omit(fileSchema, [
          "id",
          "createdAt",
          "updatedAt",
          "uploadStatus",
        ]),
        response: {
          201: fileSchema,
          500: t.String(),
        },
        tags: ["Files"],
      }
    )
    .get(
      "/",
      async ({ query, set }) => {
        const page = query.page ? Number(query.page) : 1;
        const itemsPerPage = query.itemsPerPage ? Number(query.itemsPerPage) : 10;
        const search = query.search;

        const result = await FilesService.findAll({ page, itemsPerPage, search });

        if (result.data.length === 0 && search !== undefined ) {
          set.status = "Not Found";
          return {
            message: "No files found matching your search query."
          };
        }

        return result;
      },
      {
        query: t.Object({
          page: t.Optional(t.Numeric()),
          itemsPerPage: t.Optional(t.Numeric()),
          search: t.Optional(t.String()),
        }),
        response: t.Object({
          data: t.Array(fileSchema),
          meta_data: t.Object({
            page: t.Number(),
            itemsPerPage: t.Number(),
            total: t.Number(),
            totalPages: t.Number(),
            nextPage: t.Boolean(),
            previousPage: t.Boolean(),
          }),
        }),
        tags: ["Files"],
      }
    )

    .get(
      "/:fileId",
      async ({ params }) => {
        const getFileById = await FilesService.findById(params.fileId);
        return getFileById;
      },
      {
        params: t.Object({
          fileId: t.String(),
        }),
        response: {
          200: fileSchema,
          500: t.String(),
        },
        tags: ["Files"],
      }
    )
    .patch(
      "/:fileId",
      async ({ params, body, set }) => {
        try {
          const updateFile = await FilesService.update(params.fileId, body);
          set.status = "OK";
          return updateFile;
        } catch (error: any) {
          set.status = "Internal Server Error";
          if ("message" in error) {
            return error.message;
          }
          return "Internal Server Error";
        }
      },
      {
        body: t.Omit(fileSchema, ["id", "createdAt", "updatedAt"]),
        params: t.Object({
          fileId: t.String(),
        }),
        response: {
          200: fileSchema,
          500: t.String(),
        },
        tags: ["Files"],
      }
    )
    .delete(
      "/:fileId",
      async ({ params, set }) => {
        try {
          const deleteFile = await FilesService.deleteById(params.fileId);
          set.status = "OK";
          return deleteFile;
        } catch (error: any) {
          set.status = "Internal Server Error";
          if ("message" in error) {
            return error.message;
          }
          return "Internal Server Error";
        }
      },
      {
        params: t.Object({
          fileId: t.String(),
        }),
        response: {
          200: fileSchema,
          500: t.String(),
        },
        tags: ["Files"],
      }
    )
    .post(
      "/:id/presigned-url",
      async ({ params, set }) => {
        if (params.id.length !== 36) {
          set.status = "Bad Request";
          return {
            message: "Invalid file id",
          };
        }

        try {
          const res = await FilesService.createPreSignUrl(params.id);

          if (res === null) {
            set.status = "Not Found";
            return {
              message: "File not found",
            };
          }

          const contentType = res.contentType;
          if (contentType === null) {
            set.status = "Bad Request";
            return {
              message: "File type is not supported",
            };
          }

          contentType;

          return {
            ...res,
            contentType: contentType,
          };
        } catch (error) {
          set.status = "Internal Server Error"; // 500
          return {
            message: "MinIO Server or Database is not available",
          };
        }
      },
      {
        tags: ["Files"],
        params: t.Object({
          id: t.String(),
        }),
        response: {
          200: t.Object({
            url: t.String(),
            file: fileSchema,
            contentType: t.String(),
            method: t.String(),
          }),
          400: t.Object({
            message: t.String(),
          }),
          404: t.Object({
            message: t.String(),
          }),
          500: t.Object({
            message: t.String(),
          }),
        },
      }
    );
}
