import { Elysia, t } from "elysia";
import { getHealthStatus } from "./health.service";

export const healthRoutes = () => {
  return new Elysia({ prefix: "/health", tags: ["Health"] }).get(
    "/",
    getHealthStatus(),
    {
      response: t.Object({
        status: t.Union([t.Literal("ok"), t.Literal("error")]),
        timestamp: t.String(),
      }),
    },
  );
};
