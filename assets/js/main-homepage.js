const intakeForm = document.querySelector("#brandhouse-intake-form");
const thankYou = document.querySelector("#intake-thank-you");
const formError = document.querySelector("#form-error");
const intakeEmailRecipient = "hello@defbrandhouse.com";

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
  const subject = `Definition Brandhouse intake: ${formatValue(payload.name)}`;
  const body = buildIntakeEmail(payload);
  const mailtoUrl = `mailto:${intakeEmailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
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
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.textContent = "";

    const hasRequiredText = intakeForm.checkValidity();
    const hasChannels = validateChoiceGroup(intakeForm, "channels");
    const hasGoals = validateChoiceGroup(intakeForm, "goals");

    intakeForm.classList.toggle("was-validated", true);
    const channelsGroup = setChoiceGroupState(intakeForm, "channels", hasChannels);
    const goalsGroup = setChoiceGroupState(intakeForm, "goals", hasGoals);

    if (!hasRequiredText || !hasChannels || !hasGoals) {
      formError.textContent =
        "Please complete the required fields before submitting.";
      const firstInvalid = intakeForm.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      else if (!hasChannels && channelsGroup) channelsGroup.scrollIntoView({ block: "center" });
      else if (!hasGoals && goalsGroup) goalsGroup.scrollIntoView({ block: "center" });
      return;
    }

    const payload = getPayload(intakeForm);

    // CRM integration point: replace this local persistence with your
    // Squarespace form action, CRM webhook, email automation, or API endpoint.
    console.log("Definition Brandhouse intake payload", payload);
    localStorage.setItem("definitionBrandhouseIntake", JSON.stringify(payload));
    openIntakeEmail(payload);

    intakeForm.hidden = true;
    thankYou.hidden = false;
    thankYou.focus();
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
