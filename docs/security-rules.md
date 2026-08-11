# Security Rules Documentation – CloudGuard Rule Engine

CloudGuard's Security Engine uses a **deterministic, rule-based static analyser** to evaluate every `InfrastructureResource` record against 6 configurable policy rules. Rules are stored in the `security_rules` table and evaluated on-demand via `POST /api/security/scan`.

---

## Rule Definitions

### RULE-01 – Publicly Accessible Resource
| Field | Value |
|---|---|
| Rule Code | `RULE-01` |
| Type | `NETWORK_SECURITY` |
| Severity | `CRITICAL` |
| Condition | `InfrastructureResource.is_publicly_accessible == True` |
| Risk | Exposes database/server endpoints to the public internet, allowing unauthorized external access without firewall/VPN protection. |
| Remediation | Disable public network access. Restrict inbound rules to trusted CIDR ranges (e.g. `10.0.0.0/16`). |

---

### RULE-02 – Unencrypted Storage / Data
| Field | Value |
|---|---|
| Rule Code | `RULE-02` |
| Type | `DATA_PROTECTION` |
| Severity | `HIGH` |
| Condition | `InfrastructureResource.is_encrypted == False` |
| Risk | Sensitive data stored in plaintext can be read directly from disk in the event of physical compromise or storage snapshot access. |
| Remediation | Enable AES-256 KMS key encryption at rest. Enforce TLS 1.3 in transit. |

---

### RULE-03 – Public SSH Endpoint
| Field | Value |
|---|---|
| Rule Code | `RULE-03` |
| Type | `ACCESS_CONTROL` |
| Severity | `HIGH` |
| Condition | `InfrastructureResource.ssh_public == True` |
| Risk | Open SSH exposes administrative access to brute force attacks and credential stuffing from external networks. |
| Remediation | Restrict SSH to VPN access only. Use SSH key authentication and disable password login. |

---

### RULE-04 – Excessive Administrative Privileges
| Field | Value |
|---|---|
| Rule Code | `RULE-04` |
| Type | `IDENTITY_SECURITY` |
| Severity | `HIGH` |
| Condition | `InfrastructureResource.permission_level == "ADMIN"` |
| Risk | Services running with admin privileges risk privilege escalation attacks; a single compromised service gains full system access. |
| Remediation | Downgrade service accounts to least-privilege roles. Implement IAM policy separation. |

---

### RULE-05 – Missing Backup Configuration
| Field | Value |
|---|---|
| Rule Code | `RULE-05` |
| Type | `RECOVERY_COMPLIANCE` |
| Severity | `MEDIUM` |
| Condition | `InfrastructureResource.is_backup_enabled == False` |
| Risk | Absence of automated backups causes permanent data loss on hardware failure or ransomware events. |
| Remediation | Configure automated daily backups with 30-day retention. Test restore procedures quarterly. |

---

### RULE-06 – Outdated Software Version
| Field | Value |
|---|---|
| Rule Code | `RULE-06` |
| Type | `VULNERABILITY_MGMT` |
| Severity | `MEDIUM` |
| Condition | `InfrastructureResource.software_version < InfrastructureResource.min_supported_version` |
| Risk | Outdated software versions contain known CVEs (Common Vulnerabilities and Exposures) that attackers actively exploit. |
| Remediation | Upgrade to the latest supported patch version. Subscribe to vendor security advisories. |

---

## Security Score Formula

```
score = max(0, 100 - deductions)

where:

deductions = (CRITICAL_count × 40)
           + (HIGH_count × 25)
           + (MEDIUM_count × 15)
           + (LOW_count × 5)
```

**Interpretation:**
- `90–100`: Excellent – Minimal exposure
- `70–89`: Good – Some issues present; attention required
- `50–69`: Moderate – Multiple HIGH/MEDIUM findings active
- `0–49`: Critical – Immediate remediation required

---

## Threat Detection Logic

### Impossible Travel
Condition: Same `user_email` with different `location` values within `≤ 10 minutes`.
```
if (event.location != last_login.location) AND (time_delta <= 10 minutes):
    → INSERT Alert(type=IMPOSSIBLE_TRAVEL, severity=HIGH)
```

### Data Exfiltration Suspicion
Condition: Single event with `data_size_mb >= 5000` (5 GB).
```
if event.data_size_mb >= 5000:
    → INSERT Alert(type=POSSIBLE_DATA_EXFILTRATION, severity=CRITICAL)
```

### Brute Force Suspicion
Condition: 5 or more `LOGIN_FAILURE` events for same `user_email`.
```
if count(LOGIN_FAILURE where user_email=X) >= 5:
    → INSERT Alert(type=BRUTE_FORCE_SUSPICION, severity=HIGH)
```
