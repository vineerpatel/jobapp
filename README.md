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
