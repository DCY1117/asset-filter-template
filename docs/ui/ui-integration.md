# UI Integration (ML Browser)

This document explains how the UI connects to the EDC extensions in `asset-filter-template`, how filtering works, how the current auth simulation works, and how to troubleshoot CORS.

## 1) What This UI Talks To

**Main entrypoints (consumer-side)**
- Filter extension (server-side filtering): `http://localhost:29191/api/filter/catalog`
- Inference extension (UI wired): `http://localhost:29191/api/infer`
- Consumer Management API (catalog, transfers, negotiations): `http://localhost:29193/management`
- Consumer DSP endpoint (protocol): `http://localhost:29194/protocol`

**Provider-side**
- Provider DSP endpoint (used in catalog requests): `http://localhost:19194/protocol`
- Provider Management API (assets, policies, contract defs): `http://localhost:19193/management`

These defaults live in:
- `ui/ml-browser-app/src/environments/environment.ts`

## 2) How Filtering Works (Server-Side)

**Code path**
- UI service: `ui/ml-browser-app/src/app/shared/services/ml-browser.service.ts`
- Method: `getPaginatedMLAssets()` -> `getFilteredCatalog()`
- The UI calls the filter extension, not the management API, to apply filter params on the server.

**Catalog request body**
The UI always sends the required DSP catalog body:
- `counterPartyAddress` = provider DSP endpoint (`http://localhost:19194/protocol`)
- `protocol` = `dataspace-protocol-http`

This is built in:
- `buildCatalogRequestBody()` inside `ml-browser.service.ts`

**Query params**
The UI passes filter parameters as query params to `/api/filter/catalog`.
- Example: `profile=hf&task=text-classification`
- Multiple filters can be passed using repeated `filter=` query params.

## 3) How the UI Uses Extensions Today

**Filtering extension**
- Used by the ML assets list.
- UI defaults to `profile=hf` when fetching catalog.
- The filter extension returns a DSP catalog, and the UI maps `dcat:dataset` to `MLAsset` cards.

**Inference extension**
- The UI model execution page now calls `environment.runtime.inferApiUrl` (defaults to `http://localhost:29191/api/infer`).  
- The UI only sends **assetId + payload**. The inference extension finds an existing agreement, starts the transfer, and resolves the EDR internally.
- The execution form only asks for the payload. The request path is **auto‑detected** from asset metadata (`hf:inference_path`) and falls back to `/infer`.
- The executable list is built from the catalog and filtered client‑side by heuristics:
  - `contenttype` includes `application/json`, **or**
  - tags include `inference` or `endpoint`.
You still need a **contract agreement** in the system (one‑time). Run the usual **policy → contract definition → negotiation** flow first.

## 4) Dev Auth Simulation

We are **not** using OAuth/Keycloak yet. The UI simulates login locally.

**Where it lives**
- `ui/ml-browser-app/src/app/dev-auth/mock-auth.ts`
- `AuthService` uses dev auth when `environment.runtime.devAuth.enabled = true`

**Behavior**
- A fake token is stored in `localStorage` under `ml_assets_auth_token`.
- User info is stored under `ml_assets_current_user`.
- This is safe to remove later when real OAuth is configured.

## 5) CORS (Why the UI Fails With “Unknown Error”)

When the UI runs at `http://127.0.0.1:4200` and the API runs at `http://localhost:29191`, the browser treats them as **different origins** and blocks requests unless CORS headers are present.

**Symptoms**
- UI shows: `Http failure response ... 0 Unknown Error`
- Browser console shows: `No 'Access-Control-Allow-Origin' header...`

**Fix (consumer config)**
Ensure CORS is enabled in:
- `resources/configuration/consumer-configuration.properties`

This runtime reads CORS from **Jersey** settings, so use these keys:
- `edc.web.rest.cors.enabled=true`
- `edc.web.rest.cors.origins=http://localhost:4200`
- `edc.web.rest.cors.methods=GET,POST,PUT,DELETE,OPTIONS`
- `edc.web.rest.cors.headers=origin, content-type, accept, authorization`

Important: **do not list multiple origins in a single header value** (e.g., `a,b`). Browsers reject it.  
If you want to use `http://127.0.0.1:4200`, set the origin to that **single** value and open the UI at the same host.

**Switching between localhost and 127.0.0.1**
- For `localhost`:
  - `edc.web.rest.cors.origins=http://localhost:4200`
  - Open UI at `http://localhost:4200`
- For `127.0.0.1`:
  - `edc.web.rest.cors.origins=http://127.0.0.1:4200`
  - Open UI at `http://127.0.0.1:4200`

If you want both at once, you’d need a dynamic CORS filter that reflects the request’s `Origin` header from an allowlist. The current runtime config does not support multiple origins in a single header.

Then **restart the consumer** connector.

If the UI also calls provider management endpoints (asset creation, policies, contract definitions), make sure the same CORS settings exist in:
- `resources/configuration/provider-configuration.properties`

**Quick CORS check**
```bash
curl -i -X OPTIONS "http://localhost:29191/api/filter/catalog" \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

## 6) Minimal End‑to‑End Test (UI)

**Backend prerequisites**
- Provider connector running.
- Consumer connector running.
- Assets, policies, and contract definitions created.

**UI**
- Start Angular app with `npm start` (from `ui/ml-browser-app`).
- Open `http://localhost:4200`.

**Expected**
- Assets list is populated.
- Filters apply by query params to `/api/filter/catalog`.

If the list is empty, check:
- Provider DSP endpoint is correct in `environment.runtime.providerProtocolUrl`.
- Catalog request body includes `counterPartyAddress` and `protocol`.
- Provider has published assets + contract definitions.
