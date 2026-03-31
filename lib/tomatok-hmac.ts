import { createHash, createHmac, randomBytes } from "node:crypto";

type CreateTomatokHmacHeadersOptions = {
  method: string;
  path: string;
  body: string;
  secret: string;
};

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function createTomatokHmacHeaders({
  method,
  path,
  body,
  secret,
}: CreateTomatokHmacHeadersOptions) {
  const timestamp = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const bodySha256 = sha256Hex(body);
  const signingPayload = [method.toUpperCase(), path, timestamp, nonce, bodySha256].join("\n");
  const signature = createHmac("sha256", secret).update(signingPayload, "utf8").digest("hex");

  return {
    "X-Tomatok-Timestamp": timestamp,
    "X-Tomatok-Nonce": nonce,
    "X-Tomatok-Signature": signature,
  };
}
