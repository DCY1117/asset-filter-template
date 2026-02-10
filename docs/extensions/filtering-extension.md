# Filtering Extension (Consumer‑Side)

This document describes the **server‑side filtering extension** that powers catalog queries and HF‑style facets. The extension sits inside the **consumer connector** and exposes a single API.

---

## 1) Endpoint

```
POST /api/filter/catalog
```

Example:
```bash
curl -X POST "http://localhost:29191/api/filter/catalog?profile=hf&task=text-classification" \
  -H 'Content-Type: application/json' \
  -d @/home/yayu/Projects/PIONERA/asset-filter-template/resources/requests/fetch-catalog.json -s | jq
```

The request body **must** include:
- `counterPartyAddress` (provider DSP endpoint)
- `protocol` (usually `dataspace-protocol-http`)

If missing, the extension returns:
```
{"error":"Invalid catalog request"}
```

---

## 2) What It Does

1. Accepts a catalog request body
2. Calls consumer management API `/v3/catalog/request`
3. Filters the resulting dataset list
4. Returns a catalog with filtered datasets

---

## 3) HF Profile Filters

When `profile=hf`, these query params map to HF metadata:

- `task` → `hf:pipeline_tag`
- `license` → `hf:license`
- `tag` → `hf:tags`
- `library` → `hf:library_name`
- `dataset` → `hf:datasets`
- `language` → `hf:language`
- `base_model` → `hf:base_model`

Multi‑value filters are comma‑separated (OR):
```
?task=text-classification,feature-extraction
```

---

## 4) Generic Filters

You can also pass explicit filters using `filter=`:

```
?filter=properties.hf:license=MIT,Apache-2.0
?filter=properties.hf:tags~demo
?filter=https://pionera.ai/edc/hf#metrics.accuracy>=0.90
```

Operators:
- `=` equals (case‑insensitive)
- `~` contains (case‑insensitive)
- `>`, `>=`, `<`, `<=` numeric ranges

---

## 5) Search Query

```
?q=embedding
```
Search is applied to:
- name
- id
- hf:tags
- hf:pipeline_tag
- hf:base_model
- hf:library_name

---

## 6) Sorting

```
?sort=name
?sort=license&order=desc
?sort=metrics.accuracy&order=desc
```

Sorting is case‑insensitive for strings and numeric for numbers.

---

## 7) Files

- `connector/src/main/java/com/pionera/assetfilter/filter/AssetFilterExtension.java`
- `connector/src/main/java/com/pionera/assetfilter/filter/AssetFilterController.java`

---

## 8) Notes

- JSON‑LD responses may expand `hf:` into full IRIs; the filter supports both forms.
- Filtering happens on the consumer side; provider assets remain unchanged.
