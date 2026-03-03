# Create IA Asset

This section documents asset creation from the UI.

---

## Route
`/assets/create`

## Purpose
- Create provider assets using a guided form.
- Support HttpData assets and surface future storage options.
- Auto-generate a stable asset ID from the logged-in connector and model name.

## Components and Files
- `ui/ml-browser-app/src/app/pages/asset-create/asset-create.component.ts`
- `ui/ml-browser-app/src/app/shared/services/asset.service.ts`
- `ui/ml-browser-app/src/app/shared/services/vocabulary.service.ts`

## API Calls
- `POST {activeManagementUrl}/v3/assets` (create asset).
- `POST {activeManagementUrl}/s3assets/init-upload` (not implemented in this repo).
- `POST {activeManagementUrl}/s3assets/upload-chunk` (not implemented in this repo).
- `POST {activeManagementUrl}/s3assets/finalize-upload` (not implemented in this repo).

## Functionality
- Collects model fields and ML metadata.
- Builds an EDC asset payload and submits it to the active connector.
- Loads ML vocabulary options from `/assets/vocabularies/js-pionera-ontology.json`.
- Supports HttpData and shows S3 and DataSpacePrototypeStore options in the UI.
- Generates the asset ID automatically. Users do not type the ID manually.
- Prevents duplicate model names inside the current logged-in connector scope.

## Asset ID Rules
- ID format: `<connector-id>~<model-name-slug>`
- Connector ID comes from login context:
  - consumer user -> `consumer`
  - provider user -> `provider`
- Model name is slugified to lowercase with `-` separators.

## Character Rules (Technical IDs)
- EDC path lookup endpoint `/v3/assets/{id}` is path-segment based.
- IDs containing `/` are problematic in this runtime because encoded slash (`%2F`) can be rejected as ambiguous path separator.
- Avoid these characters in technical asset IDs:
  - `/` and `\`
  - `%`
  - `?`, `#`, `&`, `=`
  - whitespace
  - URI-reserved delimiters such as `:`, `;`, `@`
- Safe character set for technical IDs:
  - `a-z`
  - `0-9`
  - `-`, `_`, `.`, `~`

## Recommended Delimiters for `user` + `model`
- Preferred: `~` (example: `consumer~simple-text-classifier-v1`)
- Also valid: `--` (example: `consumer--simple-text-classifier-v1`)
- Also valid: `_` (example: `consumer_simple-text-classifier-v1`)
- Avoid: `/` for technical IDs (keep slash style only as display metadata if needed).
- Note: current UI implementation uses `~` as delimiter.

Example:
- Name: `Iris Multiclass v1`
- Logged in as provider
- Generated ID: `provider~iris-multiclass-v1`

## Name Uniqueness Rule
- On create, UI checks local assets in the active connector.
- If another asset in that connector already has the same normalized name, creation is blocked.
- This is case-insensitive and whitespace-normalized.

## Status
HttpData creation works. S3 and DataSpacePrototypeStore uploads are not wired.

## Known Gaps
- S3 and DataSpacePrototypeStore endpoints do not exist in this repo.
- Daimo fields are mapped from ML metadata, but the UI does not expose all Daimo fields (license, base_model, language).
- Inference-specific fields like `daimo:inference_path` must be added manually if needed.
- ML metadata selects do not have a clear option, so values feel required once chosen (they are optional in validation).

## Change Ideas
- Align the form with `docs/extensions/asset-templates.md` and Daimo fields.
- Remove unsupported storage types or hide them behind a feature flag.
- Add validation for `baseUrl` and required inference fields.
- Add post-create actions: create policy and contract definition.
