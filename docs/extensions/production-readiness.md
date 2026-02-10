# Production Readiness (What’s Missing)

This project is a **local dev scaffold**. It demonstrates filtering + inference logic but is **not production‑ready**. Below is what’s missing and what must be added before real deployment.

---

## 1) Persistence & State

**Currently**
- In‑memory stores for assets, policies, contracts, and EDRs

**Production**
- Database‑backed stores (Postgres, etc.)
- Backed EDR store
- Durable transfer process state

---

## 2) Security & Identity

**Currently**
- Mock IAM
- No OAuth / Keycloak integration
- Management API has no auth

**Production**
- OAuth2 / OIDC for management + protocol
- Token validation, audience checks
- Secrets in vault (not seeded in code)

---

## 3) Vault & Key Management

**Currently**
- Hard‑coded public/private keys in `SeedVaultExtension`

**Production**
- External vault (Azure Key Vault, HashiCorp, AWS)
- Rotated keys + proper secret injection

---

## 4) Data Plane

**Currently**
- Local proxy HTTP only
- No external storage integrations

**Production**
- Real data plane (S3, Azure, MinIO)
- Scaled data plane instances
- TLS everywhere

---

## 5) Observability

**Currently**
- Console logs only

**Production**
- Centralized logging
- Metrics + tracing
- Alerting on failed transfers

---

## 6) API Contracts

**Currently**
- UI uses dev auth simulation
- Inference extension uses internal contract/transfer flow

**Production**
- Auth on UI endpoints
- Strong schema validation for inference
- Consistent error codes and pagination

---

## 7) Deployment

**Currently**
- Single machine, local ports

**Production**
- Containers + orchestration
- Config per environment
- Load balancing

---

## 8) Summary

The **filtering + inference extensions themselves are compatible** with a production environment, but they depend on:
- secure management endpoints
- persistent stores
- real IAM
- hardened data plane

Once those are in place, the extensions can be deployed without major changes.
