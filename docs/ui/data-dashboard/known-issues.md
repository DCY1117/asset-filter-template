# Dashboard Known Issues and Notes

This page captures practical issues we hit while integrating the DataDashboard with this template.

## 1) Contract negotiation mismatch from UI

### Symptom
- Negotiation starts but becomes `TERMINATED`.
- Provider log includes:
  - `Policy in the contract agreement is not equal to the one in the contract offer`

### Why this happens
- In upstream DataDashboard logic, negotiation policy is reconstructed from the offer and extra fields are injected (for example `assigner`, `target`, `profiles`).
- Some connectors validate strict equality between the original offer policy and the policy used in agreement flow.
- If the policy object shape differs, provider rejects it.

### Change applied in this workspace
- Dashboard code was patched in:
  - `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
- `getOfferMap(...)` now keeps the received offer policy and only fills missing mandatory fields required by negotiation request validation:
  - `@context` (ODRL)
  - `assigner` (fallback: catalog participant)
  - `target` (fallback: dataset id)

### Impact (before patch)
- Manual negotiation could still work, while dashboard negotiation failed for the same dataset.

### Current behavior after patch
- UI negotiation uses the selected offer policy without full policy reconstruction.
- If catalog payload misses required fields, only minimal mandatory fallbacks are added to pass request validation.
- ML Assets negotiation now reuses the Catalog-style negotiation UI flow and still keeps ML gating rules.

### If issue appears again
- Confirm local dashboard still has the patch in `catalog.service.ts`.
- If DataDashboard dependencies are updated, re-check this behavior first.

## 2) CORS preflight blocked because of `X-Api-Key`

### Symptom
- Browser shows CORS error and request fails before reaching connector.
- Example:
  - `Request header field x-api-key is not allowed by Access-Control-Allow-Headers`

### Why this happens
- Dashboard client sends `X-Api-Key` header in requests.
- Connector CORS config must explicitly allow `x-api-key`.

### Required connector config
- `edc.web.rest.cors.enabled=true`
- `edc.web.rest.cors.origins=http://localhost:4200`
- `edc.web.rest.cors.methods=GET,POST,PUT,DELETE,OPTIONS`
- `edc.web.rest.cors.headers=origin, content-type, accept, authorization, x-api-key`

Apply this to both:
- `resources/configuration/consumer-configuration.properties`
- `resources/configuration/provider-configuration.properties`

Then restart both connectors.

## 3) Angular runtime warnings in contract definition views

### `NG0956` (track by identity)
- Indicates full DOM recreation for repeated lists.
- Usually caused by `@for (...; track item)` where item identity is unstable.
- Often non-fatal but expensive and noisy.

### `NG0100` (Expression changed after checked)
- Dev-mode check caught a value changing inside the same detection cycle.
- Usually non-fatal in local dev, but indicates brittle bindings.

### Recommendation
- Treat as technical debt warnings unless user-visible behavior breaks.
- Fix by using stable track keys and avoiding repeated getter-derived values in templates.

## 4) Optional `APP_BASE_HREF.txt` 404

### Symptom
- `GET /config/APP_BASE_HREF.txt 404`

### Meaning
- Non-blocking when app base path is `/`.
- Wrapper falls back to `/` if file is missing.

### Optional cleanup
- Add `public/config/APP_BASE_HREF.txt` with:
```text
/
```

## 5) Local storage can override config file

### Symptom
- UI keeps using old connector values after editing `public/config/edc-connector-config.json`.

### Reason
- Dashboard keeps user configs in local storage.

### Reset
```js
localStorage.removeItem('edc_local_configs');
localStorage.removeItem('currentConnector');
location.reload();
```

## 6) JSON-LD view can differ between extension payload and management catalog payload

### Symptom
- `Raw Payload` JSON-LD in ML Assets looked different from Catalog view output.

### Why this happens
- `filter/catalog` extension response is profile-oriented and can differ in shape from `management/v3/catalog/request`.
- JSON-LD compaction/expansion output depends on the input graph shape.

### Current handling
- ML Assets details now resolve external dataset payload from catalog request flow first (same source used by catalog module).
- If that request fails, UI falls back to the current ML asset payload.

### Practical note
- Differences can still appear for local assets because they do not come from external catalog datasets.

## 7) Transfer fails with `No Endpoint generator function registered ... HttpData`

### Symptom
- Execution or transfer setup fails after negotiation in one direction.
- Connector log shows:
  - `No Endpoint generator function registered for transfer type destination 'HttpData'`

### Meaning
- The runtime acting as transfer consumer for that flow does not have the endpoint generator for destination type `HttpData`.
- This is a runtime capability/config mismatch, not a dashboard UI bug.

### Typical pattern observed
- One direction works (e.g., consumer executes provider asset).
- Reverse direction fails (e.g., provider executes consumer asset).

### Why
- Both connectors may share code, but active runtime composition/config can still be asymmetric.
- If one side is missing required data-plane transfer support for that destination type, transfer start fails.

### Practical checks
- Confirm both runtimes include equivalent data-plane/HTTP transfer capabilities for both directions.
- Confirm transfer destination type produced by the flow matches supported endpoint generators.
- If using proxy/data-plane modules, verify they are enabled symmetrically in both connector runtimes.
