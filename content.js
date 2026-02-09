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

async function fillFields() {
  const { profile } = await chrome.storage.sync.get("profile");
  if (!profile) {
    return;
  }

  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    const key = guessFieldKey(input);
    if (!key) {
      return;
    }
    const value = profile[key];
    if (!value) {
      return;
    }
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
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fillFields);
} else {
  fillFields();
}
