// /app/api/uploadthing/delete/route.ts
import { UTApi } from "uploadthing/server";
const utapi = new UTApi();

export async function DELETE(req: Request) {
  const { fileKey } = await req.json();
  if (!fileKey) return new Response("Missing fileKey", { status: 400 });

  try {
    await utapi.deleteFiles(fileKey);
    return new Response("File deleted");
  } catch (err) {
    console.error("Failed to delete file", err);
    return new Response("Delete failed", { status: 500 });
  }
}
