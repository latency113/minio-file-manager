import "dotenv/config";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { app as appRoutes } from "./features/app";
import { corsMiddleware } from "./shared/middleware/cors";
import { errorHandler } from "./shared/middleware/error-handler";
import { loggerMiddleware } from "./shared/middleware/logger";
import { env } from "./shared/config/env";
import { appConfig } from "./shared/config/app.config";
import { FilesController } from "./features/files/files.controller";

const app = new Elysia()
	.use(errorHandler)
	.use(corsMiddleware)
	.use(loggerMiddleware)
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: appConfig.name,
					version: appConfig.version,
				},
			},
		}),
	)
	.use(FilesController.filesController)
	.get("/", () => "Hello Elysia")
	.use(appRoutes())
	.listen(env.APP_PORT);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs successfully`,
);
