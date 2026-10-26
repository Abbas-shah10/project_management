import app from "../backend/src/app.js";
import connectDb from "../backend/src/db/connectDb.js";

export default async function handler(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const originalPath = requestUrl.searchParams.get("__vercel_path");

  if (originalPath) {
    requestUrl.searchParams.delete("__vercel_path");
    req.url = `${originalPath}${requestUrl.search}`;
  }

  await connectDb();
  return app(req, res);
}
