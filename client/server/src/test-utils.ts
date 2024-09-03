import { Buffer } from "node:buffer";
import http from "node:http";

/**
 * Send an HTTP/1.1 request to `localhost:3000` (Express.js server).
 *
 * This implementation uses the Node.js native `http.request` function to
 * provide a simpler, Promise-based and higher-level API for testing purposes.
 *
 * Some headers are automatically set:
 * - `Content-Length` is set to the length of the payload
 * - `Content-Type` is set to `application/json` when the payload is an object
 * @param requestLine - Request line (HTTP version ignored)
 * @param options - Headers, payload, and port number
 * @returns HTTP response status code, headers, and payload
 * @see https://nodejs.org/docs/latest-v20.x/api/http.html#httprequestoptions-callback
 */
export const request = async (
  requestLine: string,
  options: {
    headers?: Record<string, string>;
    payload?: string | object;
    port?: number;
  } = {},
): Promise<{
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  payload: string;
}> =>
  new Promise((resolve, reject) => {
    const [method, path] = requestLine.split(" ");
    const { headers = {}, port = 3000 } = options;
    let { payload } = options;

    if (payload) {
      if (typeof payload === "object") {
        payload = JSON.stringify(payload);
        headers["Content-Type"] = "application/json";
      }

      headers["Content-Length"] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        method,
        protocol: "http:",
        host: "localhost",
        port,
        path,
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode as number,
            headers: res.headers,
            payload: Buffer.concat(chunks).toString(),
          });
        });

        res.on("error", (e) => {
          reject(e);
        });
      },
    );

    req.on("error", (e) => {
      reject(e);
    });

    if (payload) req.write(payload);
    req.end();
  });