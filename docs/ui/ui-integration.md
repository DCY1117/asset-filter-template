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

## 2) How filtering works in the UI

Code path:
- `ml-browser.service.ts` builds the catalog request body
- `ml-assets-browser.component.ts` calls the filter API
- Filters are applied server-side in `/api/filter/catalog`

Important behavior:
- The UI keeps an unfiltered baseline list so filter options do not disappear.
- Filter options are derived from `allAssets` while results are from `filteredAssets`.

## 3) How inference works in the UI

The execution page calls `/api/infer` with:
- `assetId`
- `payload`
- optional `path` (auto-detected from `daimo:inference_path`)

Executable assets are determined by heuristics:
- `contenttype` includes `application/json`
- or tags include `inference` or `endpoint`

The UI does not ask for transfer IDs. The extension resolves EDRs internally.

## 4) Dev auth simulation

The UI uses a local dev-auth mode when:
```text
environment.runtime.devAuth.enabled = true
```

Valid dev credentials:
- `user-conn-user1-demo` / `user1123`
- `user-conn-user2-demo` / `user2123`

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

Quick check (consumer):
```bash
curl -X POST "http://localhost:29193/management/v3/catalog/request" \
  -H 'Content-Type: application/json' \
  -d @/home/yayu/Projects/PIONERA/asset-filter-template/resources/requests/fetch-catalog.json -s | jq
```
