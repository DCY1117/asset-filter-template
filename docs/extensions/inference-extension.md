# Inference Extension (Consumer‑Side)

This document explains the **inference extension**: how it is wired, how it retrieves EDRs, how it proxies inference calls, and how the response is returned.

---

## 1) Goal

Provide a consumer‑side API that:

1. Uses an **asset ID** to locate an existing contract agreement
2. Starts a transfer automatically (no transfer ID exposed)
3. Retrieves the EDR (endpoint + token)
4. Sends an inference request to the provider proxy
5. Returns the **raw response** from the model endpoint

Typical flow:
1. Use `/api/filter/catalog` to find assets
2. Negotiate and obtain a **contract agreement** (one‑time)
3. Call `/api/infer` with the **asset ID** (transfer is started internally)

---

## 2) Endpoint

```
POST /api/infer
```

Base URL (consumer default):
```
http://localhost:29191/api/infer
```

Default transfer settings (from `consumer-configuration.properties`):
- `asset.infer.connector.id=provider`
- `asset.infer.counterparty.address=http://localhost:19194/protocol`
- `asset.infer.protocol=dataspace-protocol-http`
- `asset.infer.transfer.type=HttpData-PULL`

---

## 3) Request Format

Recommended request (asset‑based, transfer created internally):

```json
{
  "assetId": "model-mock-infer-v1",
  "method": "POST",
  "path": "/infer",
  "headers": {
    "Content-Type": "application/json"
  },
  "payload": {
    "inputs": "Hello from Pionera"
  }
}
```

Where:
- `assetId` is the model ID returned by catalog filtering
- The transfer ID is created internally and never exposed to the UI
- `path` is optional: if omitted, the client/UI uses `hf:inference_path` or falls back to `/infer`

Note: the extension **does not negotiate**. It will return an error if no existing contract agreement is found for the asset.

Legacy request (uses transfer process ID):

```json
{
  "transferProcessId": "YOUR_TRANSFER_ID",
  "method": "POST",
  "path": "/infer",
  "headers": {
    "Content-Type": "application/json"
  },
  "payload": {
    "inputs": "Hello from Pionera"
  }
}
```

---

## 4) Direct EDR Mode (Optional)

If you already have EDR info, you can skip the management call:

```json
{
  "endpoint": "http://localhost:19291/public",
  "authorization": "EDR_TOKEN_HERE",
  "method": "POST",
  "path": "/infer",
  "payload": { "inputs": "Hello" }
}
```

---

## 5) How It Works Internally

The controller:

1. Reads the request JSON
2. Resolves EDR:
   - If `endpoint` + `authorization` are provided, uses them
   - If `assetId` is provided, it **looks up a matching contract agreement**, starts a transfer internally and waits for the EDR
   - If `contractId` is provided, it starts a transfer directly (legacy)
   - Otherwise, calls:
     ```
     GET {managementBaseUrl}/v3/edrs/{transferProcessId}/dataaddress
     ```
3. Builds a proxy request to the provider endpoint
4. Returns the response body (no processing)

Agreement lookup uses:
```
POST {managementBaseUrl}/v3/contractagreements/request
```
The extension selects the **latest** agreement that matches the requested asset ID.

If the resolved EDR has **no endpoint**, the API returns:
```
{"error":"EDR is missing endpoint (asset is not an HTTP endpoint)"}
```

---

## 6) Files

- `connector/src/main/java/com/pionera/assetfilter/infer/InferenceExtension.java`
- `connector/src/main/java/com/pionera/assetfilter/infer/InferenceController.java`
- `connector/src/main/resources/META-INF/services/org.eclipse.edc.spi.system.ServiceExtension`
- `resources/requests/infer-example.json`
- `tools/mock-inference-server.py`
- `resources/requests/create-asset-infer-mock.json`

---

## 7) Next Improvements (Optional)

- Response summarization (classification/embedding/generation)
- Schema‑driven formatting per task type
- Streaming responses for long generation tasks
- Caching or response persistence

---

## 8) Local Mock Inference Server (For Testing)

To test inference end‑to‑end without a real model, run:

```bash
python3 /home/yayu/Projects/PIONERA/asset-filter-template/tools/mock-inference-server.py
```

Create a mock asset that points to it:

```bash
curl -d @/home/yayu/Projects/PIONERA/asset-filter-template/resources/requests/create-asset-infer-mock.json \
  -H 'content-type: application/json' \
  http://localhost:19193/management/v3/assets -s | jq
```

This asset uses:
```
baseUrl = http://localhost:9000
path    = /infer
```
