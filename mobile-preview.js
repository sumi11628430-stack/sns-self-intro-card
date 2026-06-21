(() => {
  const MOBILE_BREAKPOINT = 760;
  const preview = document.querySelector(".preview");
  if (!preview) {
    return;
  }

  const previewHeader = preview.querySelector(".preview-header");
  const previewHeading = preview.querySelector(".preview-heading") || previewHeader?.firstElementChild;
  if (!previewHeader || !previewHeading) {
    return;
  }

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "mobile-preview-toggle";
  toggleButton.setAttribute("aria-pressed", "false");
  toggleButton.textContent = "全画面で見る";
  previewHeading.appendChild(toggleButton);

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function setOpenState(isOpen) {
    preview.classList.toggle("is-mobile-preview-open", isOpen);
    document.body.classList.toggle("mobile-preview-lock", isOpen);
    toggleButton.setAttribute("aria-pressed", String(isOpen));
    toggleButton.textContent = isOpen ? "全画面を閉じる" : "全画面で見る";
  }

  function closePreview() {
    setOpenState(false);
  }

  toggleButton.addEventListener("click", () => {
    if (!isMobileViewport()) {
      return;
    }
    setOpenState(!preview.classList.contains("is-mobile-preview-open"));
  });

  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      closePreview();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePreview();
    }
  });
})();
