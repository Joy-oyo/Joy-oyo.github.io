import { readFile } from "node:fs/promises";
import path from "node:path";
import { bookshelf } from "@/content/books";

const files = new Set([
  "index.html",
  ...bookshelf.map((book) => book.href.slice("/reading-collection/".length)),
]);

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from(files, (file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  if (!files.has(params.file)) return new Response("Not found", { status: 404 });

  const html = await readFile(path.join(process.cwd(), "reading-collection", params.file), "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
