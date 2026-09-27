import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const previewRoot = join(process.cwd(), "dist/client");
const previewHost = "127.0.0.1";
const previewPort = 4173;

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

async function resolveRequest(pathname) {
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  const candidate = normalize(join(previewRoot, requestedPath));

  if (candidate !== previewRoot && !candidate.startsWith(`${previewRoot}${sep}`)) {
    return null;
  }

  try {
    const details = await stat(candidate);
    if (details.isFile()) return candidate;
  } catch {
    // Client-side routes fall through to the app shell.
  }

  if (extname(pathname)) return null;
  return join(previewRoot, "index.html");
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  try {
    const url = new URL(request.url ?? "/", `http://${previewHost}:${previewPort}`);
    const filePath = await resolveRequest(decodeURIComponent(url.pathname));

    if (!filePath) {
      response.writeHead(404).end("Not found");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
    });

    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end("Preview server error");
  }
});

server.listen(previewPort, previewHost, () => {
  console.log(`Daily Culture preview ready at http://${previewHost}:${previewPort}/`);
});

process.on("SIGTERM", () => server.close());
