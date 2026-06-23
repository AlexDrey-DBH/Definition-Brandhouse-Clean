const intakeForm = document.querySelector("#brandhouse-intake-form");
const thankYou = document.querySelector("#intake-thank-you");
const thankYouPanel = thankYou?.querySelector(".thank-you-modal__panel");
const thankYouClose = thankYou?.querySelector(".thank-you-modal__close");
const formError = document.querySelector("#form-error");
const intakeEmailRecipient = "hi@defbrandhouse.com";
const intakeBackendUrl = "https://script.google.com/macros/s/AKfycbzuDfqO1c3Kj5qHv85flLhzHhrgH_jP8Fgxj_IwgQYFq_wbJfz5ym5j0EM6MtZaxZYC/exec";

function getCheckedValues(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value,
  );
}

function getPayload(form) {
  const formData = new FormData(form);
  return {
    submittedAt: new Date().toISOString(),
    name: formData.get("name"),
    email: formData.get("email"),
    website: formData.get("website"),
    socialProfile: formData.get("socialProfile"),
    whatYouDo: formData.get("whatYouDo"),
    audience: formData.get("audience"),
    difference: formData.get("difference"),
    channels: getCheckedValues(form, "channels"),
    workingChannels: formData.get("workingChannels"),
    goals: getCheckedValues(form, "goals"),
    success: formData.get("success"),
    obstacle: formData.get("obstacle"),
    referralSource: formData.get("referralSource"),
  };
}

function formatList(values) {
  return values.length ? values.join(", ") : "Not provided";
}

function formatValue(value) {
  return value && String(value).trim() ? String(value).trim() : "Not provided";
}

function buildIntakeEmail(payload) {
  return [
    "New Definition Brandhouse intake submission",
    "",
    `Submitted: ${payload.submittedAt}`,
    "",
    "CONTACT",
    `Name: ${formatValue(payload.name)}`,
    `Email: ${formatValue(payload.email)}`,
    `Website or profile: ${formatValue(payload.website)}`,
    `LinkedIn or social profile: ${formatValue(payload.socialProfile)}`,
    "",
    "YOUR WORK",
    `What they do: ${formatValue(payload.whatYouDo)}`,
    `Who they serve: ${formatValue(payload.audience)}`,
    `What makes the work different: ${formatValue(payload.difference)}`,
    "",
    "CURRENT MARKETING",
    `Channels actively using: ${formatList(payload.channels)}`,
    `Channels working best now: ${formatValue(payload.workingChannels)}`,
    "",
    "GOALS",
    `12-month goals: ${formatList(payload.goals)}`,
    `What success looks like: ${formatValue(payload.success)}`,
    `Biggest obstacle: ${formatValue(payload.obstacle)}`,
    "",
    "SOURCE",
    `How they heard about Definition Brandhouse: ${formatValue(payload.referralSource)}`,
  ].join("\n");
}

function openIntakeEmail(payload) {
  const subject = `Intake - ${formatValue(payload.name)}`;
  const body = buildIntakeEmail(payload);
  const mailtoUrl = `mailto:${intakeEmailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

function isBackendConfigured() {
  return intakeBackendUrl.startsWith("https://script.google.com/");
}

async function submitIntakePayload(payload) {
  if (!isBackendConfigured()) {
    openIntakeEmail(payload);
    return;
  }

  await fetch(intakeBackendUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}

function validateChoiceGroup(form, name) {
  return form.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
}

function setChoiceGroupState(form, name, isValid) {
  const group = form.querySelector(`[data-required-group="${name}"]`);
  if (group) group.classList.toggle("is-invalid", !isValid);
  return group;
}

if (intakeForm) {
  function closeThankYouModal() {
    if (!thankYou) return;
    thankYou.hidden = true;
    document.body.style.overflow = "";
    intakeForm.querySelector(".form-submit")?.focus();
  }

  function openThankYouModal() {
    if (!thankYou) return;
    thankYou.hidden = false;
    document.body.style.overflow = "hidden";
    thankYouPanel?.focus();
  }

  thankYouClose?.addEventListener("click", closeThankYouModal);

  thankYou?.addEventListener("click", (event) => {
    if (event.target === thankYou) closeThankYouModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && thankYou && !thankYou.hidden) {
      closeThankYouModal();
    }
  });

  intakeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.textContent = "";

    const hasRequiredText = intakeForm.checkValidity();
    const hasChannels = validateChoiceGroup(intakeForm, "channels");
    const hasGoals = validateChoiceGroup(intakeForm, "goals");

    intakeForm.classList.toggle("was-validated", true);
    setChoiceGroupState(intakeForm, "channels", hasChannels);
    setChoiceGroupState(intakeForm, "goals", hasGoals);

    if (!hasRequiredText || !hasChannels || !hasGoals) {
      formError.textContent =
        "Please complete the required fields before submitting.";
      formError.scrollIntoView({ behavior: "smooth", block: "start" });
      formError.focus({ preventScroll: true });
      return;
    }

    const payload = getPayload(intakeForm);

    console.log("Definition Brandhouse intake payload", payload);
    localStorage.setItem("definitionBrandhouseIntake", JSON.stringify(payload));

    const submitButton = intakeForm.querySelector(".form-submit");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      await submitIntakePayload(payload);
    } catch (error) {
      console.error("Definition Brandhouse intake submission failed", error);
      formError.textContent =
        "Something went wrong while sending your details. Please try again.";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send your details";
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Send your details";
    }

    openThankYouModal();
  });
}

const lightboxTriggers = document.querySelectorAll(".lightbox-trigger[data-full]");

if (lightboxTriggers.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "site-lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="site-lightbox__inner" role="dialog" aria-modal="true" aria-label="Fullscreen work example">
      <button class="site-lightbox__close" type="button" aria-label="Close fullscreen image">&times;</button>
      <img alt="" />
      <p class="site-lightbox__caption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".site-lightbox__caption");
  const closeButton = lightbox.querySelector(".site-lightbox__close");
  let activeTrigger = null;

  function openLightbox(trigger) {
    activeTrigger = trigger;
    const caption = trigger.dataset.caption || trigger.querySelector("img")?.alt || "";
    lightboxImage.src = trigger.dataset.full;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
    if (activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  }

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}
