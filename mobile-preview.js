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

  /* スマホでは入力欄の下にプレビューがあり、入力中に完成イメージが見えない。
     プレビューが画面に入っていない間は、画面右下に「プレビューを見る」ボタンを浮かせ、
     押すと全画面プレビューを開く（閉じると入力していた位置に戻る） */
  const floatButton = document.createElement("button");
  floatButton.type = "button";
  floatButton.className = "mobile-preview-float";
  floatButton.textContent = "👁 プレビューを見る";
  floatButton.hidden = true;
  document.body.appendChild(floatButton);

  let previewInView = false;
  let returnScrollY = null;

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function updateFloatButton() {
    const isOpen = preview.classList.contains("is-mobile-preview-open");
    floatButton.hidden = !isMobileViewport() || previewInView || isOpen;
  }

  function setOpenState(isOpen) {
    preview.classList.toggle("is-mobile-preview-open", isOpen);
    document.body.classList.toggle("mobile-preview-lock", isOpen);
    toggleButton.setAttribute("aria-pressed", String(isOpen));
    toggleButton.textContent = isOpen ? "全画面を閉じる" : "全画面で見る";
    if (isOpen) {
      preview.scrollTop = 0;
    } else if (returnScrollY !== null) {
      window.scrollTo(0, returnScrollY);
      returnScrollY = null;
    }
    updateFloatButton();
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

  floatButton.addEventListener("click", () => {
    if (!isMobileViewport()) {
      return;
    }
    returnScrollY = window.scrollY;
    setOpenState(true);
    /* 全画面の中では配色などの設定が上にあるため、完成カード（キャンバス）の位置まで送る */
    const stage = preview.querySelector(".canvas-stage") || preview.querySelector("canvas");
    if (stage) {
      requestAnimationFrame(() => {
        preview.scrollTop += stage.getBoundingClientRect().top - preview.getBoundingClientRect().top - 12;
      });
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        previewInView = entry.isIntersecting;
      });
      updateFloatButton();
    }, { threshold: 0.15 });
    observer.observe(preview);
  }

  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      closePreview();
    }
    updateFloatButton();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePreview();
    }
  });

  updateFloatButton();

  /* パソコン（2列表示）では、プレビューのカードが画面の高さに収まる大きさで表示する。
     カードの縦横比（1080x1080 / 1080x1350 など）から収まる幅を計算して --fit-w に入れる。
     表示倍率（--preview-zoom）はこの幅に掛け算されるので、拡大表示は今まで通り使える */
  const DESKTOP_MIN = 1121;
  const stage = preview.querySelector(".canvas-stage");
  const cardCanvas = stage ? stage.querySelector("canvas") : null;
  let fitting = false;

  function fitPreviewToScreen() {
    if (!stage || !cardCanvas || fitting) {
      return;
    }
    if (window.innerWidth < DESKTOP_MIN || !cardCanvas.width || !cardCanvas.height) {
      stage.style.removeProperty("--fit-w");
      return;
    }
    const stickyTop = parseFloat(getComputedStyle(preview).top) || 0;
    const aboveCard = stage.getBoundingClientRect().top - preview.getBoundingClientRect().top + preview.scrollTop;
    const belowCard = 40;
    const available = window.innerHeight - stickyTop - aboveCard - belowCard;
    const fitWidth = Math.max(320, available * (cardCanvas.width / cardCanvas.height));
    const next = `${Math.round(fitWidth)}px`;
    if (stage.style.getPropertyValue("--fit-w") !== next) {
      stage.style.setProperty("--fit-w", next);
      /* カード上のSNSアイコンの位置を合わせ直してもらうため、ページ側のリサイズ処理を呼ぶ */
      fitting = true;
      window.dispatchEvent(new Event("resize"));
      fitting = false;
    }
  }

  /* 表示倍率を上げた時：カードを見る窓（canvas-scroller）の大きさは等倍の時のままにして、
     窓の中でカードを上下左右に動かせるようにする。
     ・パソコン：カードをつかんで引っ張る／ホイール（縦）／Shift＋ホイール（横）
     ・スマホ：指で上下左右になぞる
     拡大・縮小しても、見ていた場所（窓の真ん中）がずれないようにする */
  if (stage && cardCanvas) {
    const scroller = document.createElement("div");
    scroller.className = "canvas-scroller";
    stage.parentNode.insertBefore(scroller, stage);
    scroller.appendChild(stage);

    let lastZoom = 1;
    let centerX = 0.5;
    let centerY = 0.5;
    const currentZoom = () => parseFloat(stage.style.getPropertyValue("--preview-zoom")) || 1;

    const rememberCenter = () => {
      if (!scroller.classList.contains("is-zoomed")) {
        return;
      }
      centerX = (scroller.scrollLeft + scroller.clientWidth / 2) / Math.max(scroller.scrollWidth, 1);
      centerY = (scroller.scrollTop + scroller.clientHeight / 2) / Math.max(scroller.scrollHeight, 1);
    };

    const updateScroller = () => {
      const zoom = currentZoom();
      const zoomed = zoom > 1.001;
      if (zoomed && lastZoom <= 1.001) {
        centerX = 0.5;
        centerY = 0.5;
      }
      scroller.classList.toggle("is-zoomed", zoomed);
      if (zoomed && cardCanvas.width) {
        const baseWidth = stage.getBoundingClientRect().width / zoom;
        scroller.style.maxHeight = `${Math.round(baseWidth * (cardCanvas.height / cardCanvas.width))}px`;
        scroller.scrollLeft = centerX * scroller.scrollWidth - scroller.clientWidth / 2;
        scroller.scrollTop = centerY * scroller.scrollHeight - scroller.clientHeight / 2;
      } else {
        scroller.style.maxHeight = "";
      }
      lastZoom = zoom;
    };

    scroller.addEventListener("scroll", rememberCenter, { passive: true });
    new MutationObserver(() => requestAnimationFrame(updateScroller)).observe(stage, { attributes: true, attributeFilter: ["style"] });
    new MutationObserver(() => requestAnimationFrame(updateScroller)).observe(cardCanvas, { attributes: true, attributeFilter: ["width", "height"] });
    window.addEventListener("resize", () => requestAnimationFrame(updateScroller));

    /* マウスでつかんで動かす（少し動かした時だけ。ただのクリックは今まで通り入力欄へ移動する） */
    let drag = null;
    let suppressClick = false;
    scroller.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || !scroller.classList.contains("is-zoomed")) {
        return;
      }
      drag = { x: event.clientX, y: event.clientY, left: scroller.scrollLeft, top: scroller.scrollTop, moved: false };
    });
    window.addEventListener("pointermove", (event) => {
      if (!drag) {
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) {
        return;
      }
      if (!drag.moved) {
        drag.moved = true;
        scroller.classList.add("is-dragging");
      }
      scroller.scrollLeft = drag.left - dx;
      scroller.scrollTop = drag.top - dy;
      event.preventDefault();
    });
    window.addEventListener("pointerup", () => {
      if (!drag) {
        return;
      }
      if (drag.moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      }
      scroller.classList.remove("is-dragging");
      drag = null;
    });
    scroller.addEventListener("click", (event) => {
      if (suppressClick) {
        event.stopPropagation();
        event.preventDefault();
        suppressClick = false;
      }
    }, true);
  }

  if (stage && cardCanvas) {
    window.addEventListener("resize", fitPreviewToScreen);
    new MutationObserver(fitPreviewToScreen).observe(cardCanvas, { attributes: true, attributeFilter: ["width", "height"] });
    window.addEventListener("load", fitPreviewToScreen);
    fitPreviewToScreen();
  }
})();
