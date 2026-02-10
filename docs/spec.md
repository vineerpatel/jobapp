# Job Application Helper — Draft Requirements & Plan

## Summary
You want a browser extension or application that helps apply to jobs across multiple sites (LinkedIn, Indeed, Wellfound, etc.) while using the same email/password and auto-filling information. This doc outlines a **safe, compliant** path to achieve that by focusing on form-fill assistance, user-controlled workflows, and policy-safe automation.

> **Important note:** Most job platforms prohibit fully automated submissions, credential sharing, and automated email verification. The plan below avoids bypassing security or CAPTCHA, and it keeps users in control (click-to-fill / review-before-submit). This reduces risk of account bans and security issues.

---

## Goals
1. **Reuse a single profile** (email, resume, contact info, work history) across job applications.
2. **Minimize repetitive typing** with auto-fill and template answers.
3. **Guide users** through application flows with smart detection of common fields.
4. **Maintain compliance** with platform terms and security expectations.

## Non-Goals
1. Bypassing security checks, CAPTCHA, or email verification.
2. Fully autonomous submissions without user review.
3. Storing or reusing passwords across third-party sites in an unsafe way.

---

## Proposed Solution

### 1) Browser Extension (MVP)
**Core features**
- **Profile vault** stored locally (or encrypted sync) with:
  - Name, email, phone, address
  - Work history & education entries
  - Skills, portfolio links, resume file(s)
  - Optional demographic disclosures (gender, race, ethnicity, disability status, veteran status)
- **Smart field matching**:
  - Detect common form labels: `First Name`, `Email`, `Phone`, `Company`, `Role`, `Start Date`, etc.
  - Use heuristics + field attributes (`name`, `id`, `aria-label`, `autocomplete`).
  - Learn custom fields per site by saving user-provided answers to unknown labels.
- **One-click fill**:
  - User clicks the extension icon to fill detected fields on the current page.
  - Optional “review mode” highlights fields before filling.
- **Resume upload helper**:
  - Preselect resume files stored in extension.
  - Trigger upload fields when possible, but require user confirmation.

**Compliance-first behaviors**
- No auto-submit by default.
- No automated email verification.
- No password re-use across platforms without explicit user choice.
- Clear warnings on unsupported sites.

### 2) Companion App (Optional)
**Value**
- Central place to manage profile and versions of resumes.
- Sync across devices.

**Security**
- Use end-to-end encryption for sensitive data.
- Store credentials only via OS-level password managers (macOS Keychain, Windows Credential Manager).

---

## Technical Architecture (MVP)

**Browser Extension**
- **Manifest V3**
  - `content_scripts` for field detection/fill.
  - `background` for profile storage and settings.
  - `storage.sync` or `storage.local` for profile data.
- **Field detection**
  - Use a lightweight classifier:
    - Label text similarity (e.g., “Email Address” -> email)
    - `autocomplete` attribute hints (`email`, `tel`, `given-name`, etc.)
  - Fallback to mapping rules per-site (LinkedIn/Indeed/Wellfound).
- **User controls**
  - Toggle for auto-fill
  - Toggle for “fill only on click”

---

## Compliance & Risk Notes
1. **Terms of Service**: Fully automated applications often violate ToS.
2. **Email verification**: Automating verification is typically restricted and unsafe.
3. **Account security**: Storing passwords in extension storage is risky; use a password manager.
4. **CAPTCHA**: Any CAPTCHA bypass is disallowed.

---

## Roadmap

### Phase 0 — Requirements & Design
- User profile schema
- Target site list and prioritization
- UX flow for fill + review

### Phase 1 — MVP Extension
- Profile creation UI
- Basic field detection and filling
- Resume upload support
- Per-site field overrides

### Phase 2 — Quality & Safety
- Field confidence scoring
- “Review before fill” highlights
- Add checks for sensitive fields

### Phase 3 — Optional App
- Profile management dashboard
- Resume versioning
- Device sync & export/import

---

## Questions to Answer Before Building
1. Which browsers must be supported (Chrome, Edge, Firefox)?
2. Do you want a **local-only** solution or cloud sync?
3. Which platforms are highest priority?
4. What data fields are required beyond the basics (e.g., work authorization, visa)?

---

## Suggested Next Step
If you confirm that a **compliance-first, user-controlled** extension is acceptable, I can:
1. Scaffold a Manifest V3 extension project.
2. Implement profile storage and fill logic.
3. Provide a per-site mapping system for LinkedIn / Indeed / Wellfound.

---

## Readiness Status
This document is a **planning artifact only**. There is no runnable extension or application yet. To get to a usable product, we still need to:
1. Build the extension scaffold and UI.
2. Implement field detection and one-click fill.
3. Add per-site mappings and testing on target platforms.
4. Validate compliance with each site’s policies and adjust behavior accordingly.
