# Hash String — GitHub Action

![GitHub Action](https://img.shields.io/badge/GitHub%20Action-Hash%20String-green?logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/runtime-Node.js%2024-brightgreen?logo=node.js)
![License](https://img.shields.io/github/license/tuantran0343/string-fingerprint)

Hash any string with a secret salt using **HMAC-SHA256** — returns a deterministic, 64-character hex fingerprint. Use it to anonymise sensitive values, verify data integrity, or generate reproducible identifiers inside your CI/CD pipelines.

---

## Features

- **HMAC-SHA256** — cryptographically strong, not a plain hash
- **Deterministic** — same inputs always produce the same output
- **Salted** — different secrets produce completely different hashes for the same input
- **Zero dependencies at runtime** — bundled into a single `dist/index.js` via `@vercel/ncc`
- **Node.js 24** runtime

---

## Usage

```yaml
- name: Hash a string
  id: fingerprint
  uses: tuantran0343/string-fingerprint@main
  with:
    value: ${{ secrets.MY_SECRET_VALUE }}
    salty: ${{ secrets.HMAC_SECRET }}

- name: Use the hashed output
  run: echo "Fingerprint → ${{ steps.fingerprint.outputs.hashed }}"
```

---

## Inputs

| Name    | Required | Description                          |
|---------|----------|--------------------------------------|
| `value` | ✅ Yes   | The string you want to hash          |
| `salty` | ✅ Yes   | Secret key used as the HMAC salt     |

---

## Outputs

| Name     | Description                              | Example                                                            |
|----------|------------------------------------------|--------------------------------------------------------------------|
| `hashed` | Hex-encoded HMAC-SHA256 result (64 chars) | `b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576...` |

---

## Example Workflow

```yaml
name: Generate User Fingerprint

on:
  push:
    branches: [main]

jobs:
  fingerprint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Hash user email
        id: hash
        uses: tuantran0343/string-fingerprint@main
        with:
          value: "user@example.com"
          salty: ${{ secrets.HMAC_SECRET }}

      - name: Print result
        run: |
          echo "Hashed value: ${{ steps.hash.outputs.hashed }}"
```

---

## How It Works

```
value + salty
     │
     ▼
HMAC-SHA256 (Node.js crypto)
     │
     ▼
64-char hex string  →  output: hashed
```

Internally uses Node.js's built-in `crypto.createHmac('sha256', salty).update(value).digest('hex')` — no external crypto library required.

---

## Security Notes

- Always store `salty` in **GitHub Secrets** — never hardcode it in your workflow file.
- Treat `value` as sensitive if it contains PII; use GitHub Secrets for it too.
- HMAC-SHA256 is a one-way function — the original value **cannot** be recovered from the hash.
- Changing `salty` will produce a completely different hash for the same `value`.

---

## Local Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the distributable bundle
npx ncc build index.js -o dist
```

---

## License

MIT © [Tuan Tran](https://github.com/tuantran0343)
