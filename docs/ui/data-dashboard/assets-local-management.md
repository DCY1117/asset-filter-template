# Assets (Local Management)

This page documents local asset creation and lookup behavior in DataDashboard `Assets`.

## Scope

- Route/module: built-in `Assets` page from `dashboard-core`
- Covers local asset create, update, delete, and filter

## ML metadata helper in create/edit modal

The asset create/update modal includes an optional **ML Metadata** helper.

- Toggle: `Enable ML metadata helper`
- UI labels are business labels only (no ontology names shown in the form)
- All helper fields write to `daimo:*` properties in the asset `properties`

## Basic fields (always visible)

- Short Description (free text)
- Version (string)
- Task (single select, controlled list)
- Modality (multi select): `tabular`, `text`, `image`, `audio`, `video`, `multimodal`
- Keywords (multi select, example vocabulary)
- License (single select, SPDX-style common values)
- Maturity Status (single select): `experimental`, `validated`, `production`, `deprecated`

## Advanced fields (collapsible)

- Library / Runtime (multi select)
- Languages (multi select, shown when modality includes `text` or `multimodal`)
- Architecture / Family
- Base Model
- Model Size:
  - Parameters
  - Artifact Size (MB)
  - Quantization (single select)
- Performance Claims:
  - Metric (single select)
  - Dataset (single select)
  - Report URL
- Service Integration:
  - Model Format (single select)
  - Inference Path (single select)
- Intended Use (text)
- Limitations (text)
- Safety / Compliance flags (checkboxes):
  - PII-safe
  - Regulated domain
  - Human-in-the-loop required
- Cost & SLO:
  - Latency p95 (ms)
  - Throughput (rps)
  - Rate limits
  - Availability tier

## Daimo mapping used by the helper

- Short Description -> `daimo:short_description`
- Version -> `daimo:model_version`
- Task -> `daimo:pipeline_tag`
- Modality -> `daimo:modality`
- Keywords -> `daimo:tags`
- License -> `daimo:license`
- Maturity Status -> `daimo:maturity_status`
- Library / Runtime -> `daimo:library_name`
- Languages -> `daimo:language`
- Architecture / Family -> `daimo:architecture_family`
- Base Model -> `daimo:base_model`
- Model Format -> `daimo:format`
- Inference Path -> `daimo:inference_path`
- Parameters -> `daimo:parameter_count`
- Artifact Size -> `daimo:artifact_size_mb`
- Quantization -> `daimo:quantization`
- Performance Metric -> `daimo:performance_metric`
- Performance Dataset -> `daimo:performance_dataset` (and compatibility mirror `daimo:datasets`)
- Performance Report -> `daimo:performance_report`
- Intended Use -> `daimo:intended_use`
- Limitations -> `daimo:limitations`
- PII-safe -> `daimo:pii_safe`
- Regulated domain -> `daimo:regulated_domain`
- Human-in-the-loop required -> `daimo:human_in_the_loop_required`
- Latency p95 -> `daimo:latency_p95_ms`
- Throughput -> `daimo:throughput_rps`
- Rate limits -> `daimo:rate_limits`
- Availability tier -> `daimo:availability_tier`

## Filtering local assets

Asset list search now matches:

- ID, Name, Type, Content-Type
- plus the Daimo metadata fields above

This allows local discovery by ML metadata terms (task, runtime, modality, maturity, performance claims, safety flags, and SLO hints).

## Files

- `DataDashboard/projects/dashboard-core/assets/src/asset-create/asset-create.component.ts`
- `DataDashboard/projects/dashboard-core/assets/src/asset-create/asset-create.component.html`
- `DataDashboard/projects/dashboard-core/assets/src/asset-view/asset-view.component.ts`
- `DataDashboard/projects/dashboard-core/assets/src/asset-view/asset-view.component.html`
