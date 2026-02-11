# Create IA Asset

This section documents asset creation from the UI.

---

## Route
`/assets/create`

## Purpose
- Create provider assets using a guided form.
- Support HttpData assets and surface future storage options.

## Components and Files
- `ui/ml-browser-app/src/app/pages/asset-create/asset-create.component.ts`
- `ui/ml-browser-app/src/app/shared/services/asset.service.ts`
- `ui/ml-browser-app/src/app/shared/services/vocabulary.service.ts`

## API Calls
- `POST {managementApiUrl}/v3/assets` (create asset).
- `POST {managementApiUrl}/s3assets/init-upload` (not implemented in this repo).
- `POST {managementApiUrl}/s3assets/upload-chunk` (not implemented in this repo).
- `POST {managementApiUrl}/s3assets/finalize-upload` (not implemented in this repo).

## Functionality
- Collects basic fields and ML metadata.
- Builds an EDC asset payload and submits it to the provider.
- Loads ML vocabulary options from `/assets/vocabularies/js-pionera-ontology.json`.
- Supports HttpData and shows S3 and DataSpacePrototypeStore options in the UI.

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
