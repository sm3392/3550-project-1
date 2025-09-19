// ====== server.js ======
const express = require("express");
const jwt = require("jsonwebtoken");
const { generateKeyPairSync } = require("crypto");

let keys = [];

// ---------- 1. Key Generation ----------
function generateKey() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const kid = Date.now().toString(); // unique ID
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  // build a JWK (simplified)
  const jwk = {
    kty: "RSA",
    kid,
    use: "sig",
    alg: "RS256",
    n: Buffer.from(
      publicKey.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").replace(/\n/g, ""),
      "base64"
    ).toString("base64"),
    e: "AQAB",
  };

  keys.push({ kid, publicKey, privateKey, jwk, expiresAt });
}

// generate initial key at startup
generateKey();

// ---------- 2. Express App ----------
const app = express();
app.use(express.json());

// JWKS endpoint: only return unexpired keys
app.get("/.well-known/jwks.json", (req, res) => {
  const activeKeys = keys.filter((k) => k.expiresAt > Date.now());
  res.json({ keys: activeKeys.map((k) => k.jwk) });
});

// Auth endpoint: return a JWT
app.post("/auth", (req, res) => {
  const expired = req.query.expired !== undefined;
  const key = expired ? keys[0] : keys.find((k) => k.expiresAt > Date.now());

  if (!key) return res.status(500).send("No valid signing keys");

  const token = jwt.sign(
    { user: "fake-user" },
    key.privateKey,
    {
      algorithm: "RS256",
      expiresIn: expired ? "-1s" : "5m", // expired instantly if ?expired
      keyid: key.kid,
    }
  );

  res.json({ token });
});

// ---------- 3. Run server ----------
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`JWKS server running on http://localhost:${PORT}`);
});
