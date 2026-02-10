const FIELD_MAP = [
  { key: "firstName", match: ["first name", "given name"] },
  { key: "lastName", match: ["last name", "surname", "family name"] },
  { key: "email", match: ["email", "e-mail"] },
  { key: "phone", match: ["phone", "mobile", "telephone", "cell"] },
  { key: "address", match: ["address", "street"] },
  { key: "city", match: ["city", "town"] },
  { key: "state", match: ["state", "province", "region"] },
  { key: "postalCode", match: ["zip", "postal"] },
  { key: "country", match: ["country"] },
  { key: "currentTitle", match: ["current title", "job title", "role"] },
  { key: "currentCompany", match: ["current company", "employer", "company"] },
  { key: "experienceYears", match: ["years of experience", "experience"] },
  { key: "educationLevel", match: ["education", "degree", "highest education"] },
  { key: "portfolioUrl", match: ["portfolio", "linkedin", "website"] },
  { key: "skills", match: ["skills", "skill set"] },
  { key: "gender", match: ["gender"] },
  { key: "race", match: ["race"] },
  { key: "ethnicity", match: ["ethnicity"] },
  { key: "disabilityStatus", match: ["disability", "disability status"] },
  { key: "veteranStatus", match: ["veteran", "veteran status", "military"] }
];

const PANEL_ID = "jobapp-helper-panel";
const PANEL_STYLE_ID = "jobapp-helper-style";

function normalize(value) {
  return value.toLowerCase().trim();
}

function getLabelText(input) {
  if (input.labels && input.labels.length > 0) {
    return Array.from(input.labels)
      .map((label) => label.textContent)
      .join(" ");
  }
  const ariaLabel = input.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel;
  }
  const id = input.getAttribute("id");
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      return label.textContent;
    }
  }
  return "";
}

function guessFieldKey(input) {
  const labelText = normalize(getLabelText(input));
  const name = normalize(input.getAttribute("name") || "");
  const id = normalize(input.getAttribute("id") || "");
  const placeholder = normalize(input.getAttribute("placeholder") || "");

  return FIELD_MAP.find(({ match }) =>
    match.some((term) =>
      [labelText, name, id, placeholder].some((value) => value.includes(term))
    )
  )?.key;
}

function buildStyleTag() {
  if (document.getElementById(PANEL_STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = PANEL_STYLE_ID;
  style.textContent = `
    #${PANEL_ID} {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: min(360px, 92vw);
      max-height: 70vh;
      overflow: auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
      font-family: "Inter", system-ui, -apple-system, sans-serif;
      color: #111827;
      z-index: 999999;
      padding: 16px;
    }
    #${PANEL_ID} h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }
    #${PANEL_ID} p {
      margin: 0 0 12px;
      font-size: 12px;
      color: #6b7280;
    }
    #${PANEL_ID} label {
      display: block;
      font-size: 12px;
      margin-bottom: 6px;
    }
    #${PANEL_ID} input {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 13px;
    }
    #${PANEL_ID} .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    #${PANEL_ID} button {
      flex: 1;
      padding: 8px 10px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 13px;
    }
    #${PANEL_ID} .save {
      background: #2563eb;
      color: #fff;
    }
    #${PANEL_ID} .dismiss {
      background: #e5e7eb;
      color: #111827;
    }
  `;
  document.head.appendChild(style);
}

function buildMissingPanel(missingFields, onSave) {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
  }
  buildStyleTag();

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <h3>Missing info detected</h3>
    <p>Provide values you want saved for this site. They will be reused next time.</p>
  `;

  const form = document.createElement("form");
  missingFields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    const input = document.createElement("input");
    input.name = field.storageKey;
    input.type = "text";
    if (field.placeholder) {
      input.placeholder = field.placeholder;
    }
    label.appendChild(input);
    form.appendChild(label);
  });

  const actions = document.createElement("div");
  actions.className = "actions";

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "save";
  saveButton.textContent = "Save & fill";

  const dismissButton = document.createElement("button");
  dismissButton.type = "button";
  dismissButton.className = "dismiss";
  dismissButton.textContent = "Dismiss";

  actions.appendChild(saveButton);
  actions.appendChild(dismissButton);
  form.appendChild(actions);
  panel.appendChild(form);

  dismissButton.addEventListener("click", () => {
    panel.remove();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    onSave(Object.fromEntries(data.entries()));
  });

  document.body.appendChild(panel);
}

function getSelectPlaceholder(input) {
  if (!input || input.tagName.toLowerCase() !== "select") {
    return "";
  }
  const options = Array.from(input.options)
    .map((option) => option.textContent.trim())
    .filter(Boolean)
    .slice(0, 5);
  if (options.length === 0) {
    return "";
  }
  return `Examples: ${options.join(", ")}`;
}

function setInputValue(input, value) {
  if (input.tagName.toLowerCase() === "select") {
    const option = Array.from(input.options).find((opt) =>
      normalize(opt.textContent).includes(normalize(String(value)))
    );
    if (option) {
      input.value = option.value;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return;
  }
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

async function fillFields() {
  const { profile } = await chrome.storage.sync.get("profile");
  if (!profile) {
    return;
  }

  const customFields = profile.customFields ?? {};
  const inputs = document.querySelectorAll("input, textarea, select");
  const missing = [];

  inputs.forEach((input) => {
    const key = guessFieldKey(input);
    const labelText = getLabelText(input).trim();
    const normalizedLabel = normalize(labelText);

    if (key) {
      const value = profile[key];
      if (value) {
        setInputValue(input, value);
      } else if (labelText) {
        missing.push({
          storageKey: key,
          label: labelText,
          placeholder: getSelectPlaceholder(input)
        });
      }
      return;
    }

    if (normalizedLabel && customFields[normalizedLabel]) {
      setInputValue(input, customFields[normalizedLabel]);
      return;
    }

    if (normalizedLabel) {
      missing.push({
        storageKey: `custom:${normalizedLabel}`,
        label: labelText,
        placeholder: getSelectPlaceholder(input)
      });
    }
  });

  if (missing.length > 0) {
    buildMissingPanel(missing, async (data) => {
      const updatedProfile = { ...profile, customFields: { ...customFields } };
      Object.entries(data).forEach(([storageKey, value]) => {
        if (!value) {
          return;
        }
        if (storageKey.startsWith("custom:")) {
          const customKey = storageKey.replace("custom:", "");
          updatedProfile.customFields[customKey] = value;
        } else {
          updatedProfile[storageKey] = value;
        }
      });
      await chrome.storage.sync.set({ profile: updatedProfile });
      fillFields();
      const panel = document.getElementById(PANEL_ID);
      if (panel) {
        panel.remove();
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fillFields);
} else {
  fillFields();
}
