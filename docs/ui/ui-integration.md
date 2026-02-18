# UI Integration (ML Browser)

This document explains how the UI connects to the extensions and how to troubleshoot common issues (auth, CORS, empty catalog).

---

## 1) Runtime endpoints used by the UI

Defined in `ui/ml-browser-app/src/environments/environment.ts`.

Consumer-side endpoints:
- Filter extension: `http://localhost:29191/api/filter/catalog`
- Inference extension: `http://localhost:29191/api/infer`
- Consumer management API: `http://localhost:29193/management`
- Consumer DSP endpoint: `http://localhost:29194/protocol`

Provider-side endpoints:
- Provider DSP endpoint: `http://localhost:19194/protocol`
- Provider management API: `http://localhost:19193/management`

Role-aware behavior:
- The UI resolves active management endpoint by logged-in role:
  - consumer -> `consumerManagementUrl` (`29193`)
  - provider -> `providerManagementUrl` (`19193`)
- Catalog counterparty protocol is also role-aware:
  - consumer requests provider DSP (`19194`)
  - provider requests consumer DSP (`29194`)

## 2) How filtering works in the UI

Code path:
- `ml-browser.service.ts` builds the catalog request body
- `ml-assets-browser.component.ts` calls the filter API
- Filters are applied server-side in `/api/filter/catalog` for external assets

Merged asset list behavior:
- External assets: fetched from filter extension (`/api/filter/catalog`).
- Local assets: fetched from active connector management (`/v3/assets/request`).
- UI merges both lists and keeps entries distinct by source (local/external) even with the same asset id.
- `View Details` action routes both local and external assets to `/catalog/view` with state passed through `CatalogStateService`.

Important behavior:
- The UI keeps an unfiltered baseline list so filter options do not disappear.
- Filter options are derived from `allAssets` while results are from `filteredAssets`.
- Owner and storage fields are normalized for both sources.

## 3) How inference works in the UI

The execution page calls `/api/infer` with:
- `assetId`
- `payload`
- optional `path` (auto-detected from `daimo:inference_path`)

Executable assets are determined by heuristics:
- `contenttype` includes `application/json`
- or tags include `inference` or `endpoint`

Execution list visibility:
- Local assets: shown when technically executable.
- External assets: shown only if the current connector already has a contract agreement for that asset.

The UI does not ask for transfer IDs. The extension resolves EDRs internally.

## 3.1) How contract negotiation works in the UI

- `Negotiate` from ML assets browser starts negotiation directly via `POST /v3/contractnegotiations`.
- UI polls `GET /v3/contractnegotiations/{id}` until terminal status.
- When finalized, UI marks the asset/offer as negotiated and disables negotiate buttons.
- UI uses offer ID (`odrl:hasPolicy.@id`, e.g. `MQ==:...`) for negotiation requests.
- Offer policy terms shown in UI come from the offer policy itself:
  - action
  - constraints
  - obligations
  - prohibitions
- Contract offer view does not rely on provider-side policy definition IDs; it reads terms from the offer payload.

## 4) Dev auth simulation

The UI uses a local dev-auth mode when:
```text
environment.runtime.devAuth.enabled = true
```

Valid dev credentials:
- Consumer: `user-conn-user1-demo` / `user1123`
- Provider: `user-conn-user2-demo` / `user2123`

Connector IDs used by the UI after login:
- Consumer user -> `consumer`
- Provider user -> `provider`

Asset creation ID behavior:
- Asset IDs are auto-generated as `<connector-id>~<model-name-slug>`.
- Example: `provider~iris-multiclass-v1`.
- Slash (`/`) is intentionally not used in technical IDs because `/v3/assets/{id}` path lookup can fail with encoded slashes in this runtime.

Contract definition ID behavior:
- Contract definition IDs are auto-generated as `<connector-id>~<index>`.
- UI uses `POST /api/contract-sequences/peek` to preview and display the next ID.
- UI uses `POST /api/contract-sequences/commit` only after successful create.
- Sequence state is persisted by connector extension to `./.state/contract-sequences.json` by default.

Contract definition selector behavior:
- UI sends `assetsSelector` as an array.
- EDC responses can return `assetsSelector` either as an array or as a single `Criterion` object.
- UI normalizes both response shapes.

Auth storage:
- Token stored in `localStorage` key `ml_assets_auth_token`
- User stored in `ml_assets_current_user`

To disable dev-auth, set `devAuth.enabled=false` and wire real OAuth.

## 5) CORS troubleshooting

Symptoms:
- UI shows `Http failure response ... 0 Unknown Error`
- Browser console shows CORS block

Fix in consumer config (`resources/configuration/consumer-configuration.properties`):
- `edc.web.rest.cors.enabled=true`
- `edc.web.rest.cors.origins=http://localhost:4200`
- `edc.web.rest.cors.methods=GET,POST,PUT,DELETE,OPTIONS`
- `edc.web.rest.cors.headers=origin, content-type, accept, authorization`

Important:
- Do not list multiple origins in a single header value. Browsers reject it.
- If you use `127.0.0.1:4200`, set that as the single allowed origin and open UI using 127.0.0.1.

Restart consumer after changes.

## 6) Empty catalog in UI

If the list is empty:
- Provider is not running
- Assets not created
- Policy + contract definition missing

Note:
- External catalog can be empty while local assets are still present in the merged list.
- `catalog/request` returns counterparty offers, not the caller's own local assets.

Quick check (consumer):
```bash
curl -X POST "http://localhost:29193/management/v3/catalog/request" \
  -H 'Content-Type: application/json' \
  -d @./resources/requests/fetch-catalog.json -s | jq
```
