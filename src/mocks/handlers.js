import { rest } from "msw";
import { mockTags } from "./mockData";

export const handlers = [
    rest.get("http://127.0.0.1:8000/api/tags/", (req, res, ctx) => {
  return res(ctx.json(mockTags));
})
]

