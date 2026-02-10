# Job Application Automation - Concept & Plan

This repository contains an initial product concept and a prototype browser extension for a job-application helper. The aim is to reduce repetitive data entry while respecting platform policies and user privacy.

See [`docs/spec.md`](docs/spec.md) for a detailed requirements draft, architecture notes, and a phased roadmap.

## Prototype Extension
This repo includes a minimal Manifest V3 extension that stores a profile and auto-fills common fields on job application forms.

### Install (Chrome / Edge)
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Open the extension **Options** page to enter your profile details.

### Notes
- The extension only fills fields; it does not auto-submit forms.
- For sensitive demographic fields, only disclose when you choose to.
- When the extension detects a field that is blank or unknown, it shows a small panel so you can provide the value and save it for future use.

### Troubleshooting (LinkedIn/Indeed/Wellfound)
- Reload the extension after pulling new code (`chrome://extensions` -> **Reload**).
- Open the target application page and refresh once so the latest content script attaches.
- Ensure the form has visible labels; some multi-step forms render fields only after clicking **Next**.
- If a field is unknown, use the in-page **Missing info detected** panel to save it for future auto-fill.
