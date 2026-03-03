# Custom Dashboard Usage

This explains the upstream `DataDashboard` guidance and what applies in this repository.

## Upstream guidance (publish + consume library)

The official approach says:

1. Publish `projects/dashboard-core` to your package registry.
2. In another Angular app, install dependencies (`daisyui`, `material-symbols`, `ngx-float-ui`, `@think-it-labs/edc-connector-client`).
3. Install `@eclipse-edc/dashboard-core` from that registry.
4. Add required style imports and `@source` so library utility classes are included.

## What we do here

In this workspace we are not building a separate app from scratch. We customize the existing DataDashboard wrapper app directly:

- wrapper app: `DataDashboard/src/app/`
- shared library: `DataDashboard/projects/dashboard-core/`

So publishing to a registry is **not required** for local development in this monorepo.

## When publishing is required

Publish/install is needed only if you want:

- a separate Angular repository to consume `dashboard-core`
- distribution of your customized dashboard library to other teams/projects

## Resulting architecture in this workspace

- `dashboard-core` remains reusable base library
- custom GUI features are implemented in wrapper app routes/components
- this keeps upgrade path closer to upstream DataDashboard
