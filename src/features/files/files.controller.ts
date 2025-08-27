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
					"minioKey",
				]),
				response: {
					201: fileSchema,
					500: t.String(),
				},
				tags: ["Files"],
			},
		)
				.get("/", () => {
			return FilesService.findAll();
		}, 
		{
			response: t.Array(fileSchema),
			tags: ["Files"],
		})		
		.get("/:fileId", 
			async ({params}) => {
				const getFileById = await FilesService.findById(params.fileId);
			return getFileById;
		}, {
			params: t.Object({
				fileId: t.String(),
			}),
			response: {
				200: fileSchema,
				500: t.String(),
			},
			tags: ["Files"],
		})
		.patch("/:fileId", 
			async ({ params, body, set }) => {
				try {
					const updateFile = await FilesService.update(params.fileId ,body);
					set.status = "OK"
					return updateFile
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
						"minioKey",
					]),
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
		.delete("/:fileId", async ({ params, set }) => {
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
		}, {
			params: t.Object({
				fileId: t.String(),
			}),
			response: {
				200: fileSchema,
				500: t.String(),
			},
			tags: ["Files"],
		});
}


