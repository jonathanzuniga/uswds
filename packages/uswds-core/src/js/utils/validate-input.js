const { prefix: PREFIX } = require("../config");

const CHECKED = "aria-checked";
const CHECKED_CLASS = `${PREFIX}-checklist__item--checked`;

module.exports = function validate(el) {
  const id = el.dataset.validationElement;
  const checkList =
    id.charAt(0) === "#"
      ? document.querySelector(id)
      : document.getElementById(id);

  if (!checkList) {
    throw new Error(`No validation element found with id: "${id}"`);
  }

  const span_selector = ".usa-hidden-span";
  const hidden_span = document.querySelector(span_selector);
  const checklistItems = document.querySelectorAll(".usa-checklist__item");

  function createSpan() {
    if (!hidden_span) {
      for (const item of checklistItems) {
        const newSpan = document.createElement("SPAN");
        newSpan.classList.add("usa-sr-only", "usa-hidden-span");
        item.append(newSpan);
      }
    }
  }

  createSpan();

  Object.entries(el.dataset).forEach(([key, value]) => {
    if (key.startsWith("validate")) {
      const validatorName = key.substr("validate".length).toLowerCase();
      const validatorPattern = new RegExp(value);
      const validatorSelector = `[data-validator="${validatorName}"]`;
      const validatorCheckbox = checkList.querySelector(validatorSelector);

      if (!validatorCheckbox) {
        throw new Error(`No validator checkbox found for: "${validatorName}"`);
      }

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);

      if (validatorCheckbox.classList.contains(CHECKED_CLASS)) {
        validatorCheckbox.lastChild.textContent = "Complete";
      } else {
        validatorCheckbox.lastChild.textContent = "";
      }
    }
  });
};
