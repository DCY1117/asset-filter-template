# HF‑Style AI Model Metadata Template (EDC + JSON‑LD)

This document provides a **simple, professional template** for describing AI model assets in EDC using JSON‑LD, aligned with an **HF‑style catalog**.

The goal is to keep metadata **consistent, filterable, and extensible**.

## 1) Vocabulary Strategy (Recommended)

Use a **custom namespace** so you can evolve your metadata without breaking other tooling.

Example namespace:
```
https://pionera.ai/edc/hf#
```

Use it in JSON‑LD like this:

```json
"@context": {
  "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  "hf": "https://pionera.ai/edc/hf#"
}
```

That lets you define HF‑style metadata fields under `properties`:

- `hf:pipeline_tag`
- `hf:license`
- `hf:tags`
- `hf:library_name`
- `hf:datasets`
- `hf:language`
- `hf:base_model`

## 2) Core Fields (HF‑Style Facets)

These are the most useful filters in AI model catalogs:

- `hf:pipeline_tag` — task (text‑classification, feature‑extraction, etc.)
- `hf:license` — SPDX‑style license string
- `hf:tags` — list of keywords
- `hf:library_name` — pytorch / tensorflow / sklearn / xgboost
- `hf:datasets` — dataset names
- `hf:language` — language codes
- `hf:base_model` — base model reference

## 3) Performance Metadata (Optional)

You can attach metrics for visibility or ranking:

- `hf:metrics` — key/value metrics
- `hf:benchmark` — benchmark name

Example:
```json
"hf:metrics": {
  "accuracy": 0.93,
  "f1_macro": 0.91
}
```

## 4) Input/Output Contracts (Optional)

If you want richer documentation, add:

- `hf:inputSchema`
- `hf:outputSchema`
- `hf:inputFormat`
- `hf:outputFormat`
- `hf:inference_path` — relative path on the HTTP endpoint (default `/infer`)

## 5) Governance & Risk (Optional)

- `hf:trainingData`
- `hf:biasRisk`
- `hf:privacyRisk`
- `hf:securityNotes`

## 6) Example Asset (Template)

```json
{
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    "hf": "https://pionera.ai/edc/hf#"
  },
  "@id": "model-<your-id>",
  "properties": {
    "name": "<display name>",
    "contenttype": "application/octet-stream",

    "hf:pipeline_tag": "text-classification",
    "hf:license": "Apache-2.0",
    "hf:tags": ["example", "demo"],
    "hf:library_name": "pytorch",
    "hf:datasets": ["your-dataset"],
    "hf:language": ["en"],
    "hf:base_model": "org/base-model",

    "hf:metrics": {
      "accuracy": 0.9,
      "f1": 0.88
    }
  },
  "dataAddress": {
    "type": "HttpData",
    "baseUrl": "https://example.com/path/to/model.bin",
    "proxyPath": "true"
  }
}
```

## 7) Filtering Fields (HF Profile)

Our filtering extension supports HF‑style facets when `profile=hf`:

- `task` → `hf:pipeline_tag`
- `license` → `hf:license`
- `tag` → `hf:tags`
- `library` → `hf:library_name`
- `dataset` → `hf:datasets`
- `language` → `hf:language`
- `base_model` → `hf:base_model`

Example:
```bash
curl -X POST "http://localhost:29191/api/filter/catalog?profile=hf&task=text-classification" \
  -H 'Content-Type: application/json' \
  -d @/home/yayu/Projects/PIONERA/asset-filter-template/resources/requests/fetch-catalog.json -s | jq
```

Note: in catalog responses, JSON‑LD may **expand** `hf:` fields into full IRIs
like `https://pionera.ai/edc/hf#pipeline_tag`. The filter supports **both**
compact and expanded forms.

## 8) Generic Filters (Any Asset)

The filter endpoint also supports **generic filters** for any asset:

```
?filter=field=value
?filter=properties.hf:license=MIT
?filter=properties.hf:tags~demo
```

Supported operators:
- `=` equals (case‑insensitive)
- `~` contains (case‑insensitive)
- `>`, `>=`, `<`, `<=` for numeric values

## 9) When to Adopt External Ontologies

If you need interoperability with external tools, you can map fields later to:

- DCAT / Dublin Core (general catalog)
- ML Schema (model metadata)
- Schema.org

You can still **keep your own namespace** and map later.
