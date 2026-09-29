/* 画像の大きさ・位置を、プレビューのカードの上で直接変える（背景画像・プロフィール画像）。
   ・マウス：画像の上をつかんで動かす／Ctrlを押しながらホイールで大きさ（ノートPCのタッチパッドは2本指でつまむ）
   ・スマホ：プロフィール画像は1本指で動かす／2本指でつまむと大きさ、2本指のまま動かすと位置
   　（背景は1本指だとページのスクロールと区別できないので、2本指で操作する）
   ・ただのクリック・タップは今まで通り（入力欄へ移動）
   ・画像をファイルから選んだら、その画像の「画像編集」の窓を開き、選ぶ欄の下に操作の説明を出す
   値の保存・描き直しは、ページ側の「画像編集」と同じ仕組み（state の拡縮・左右・上下）を使う */
(() => {
  if (typeof state === "undefined" || typeof renderCard !== "function" || typeof socialOverlay === "undefined" || typeof canvas === "undefined") {
    return;
  }
  const overlay = socialOverlay;
  if (!overlay) {
    return;
  }

  const DRAG_THRESHOLD = 5;

  /* どの画像か → 画像本体・描き方（cover/contain）・箱（カード上の位置）を返す */
  function getTargetImage(targetKey) {
    if (targetKey === "avatar") {
      return avatarImage || null;
    }
    if (targetKey === "background") {
      return backgroundImage || null;
    }
    if (targetKey === "backgroundFront") {
      return (typeof backgroundImageFront !== "undefined" && backgroundImageFront) || backgroundImage || null;
    }
    if (targetKey === "backgroundBack") {
      return (typeof backgroundImageBack !== "undefined" && backgroundImageBack) || backgroundImage || null;
    }
    return null;
  }

  function getCanvasScale() {
    return canvas.width / Math.max(overlay.clientWidth, 1);
  }

  /* 画面上の「画像編集」用の当たり枠（page側が作る）から、カード上の箱を求める */
  function findAdjustRects() {
    const rects = [];
    const base = overlay.getBoundingClientRect();
    const scale = getCanvasScale();
    overlay.querySelectorAll("[data-adjust-target]").forEach((el) => {
      const r = el.getBoundingClientRect();
      rects.push({
        key: el.dataset.adjustTarget,
        screen: r,
        box: {
          x: (r.left - base.left) * scale,
          y: (r.top - base.top) * scale,
          w: r.width * scale,
          h: r.height * scale
        }
      });
    });
    return rects;
  }

  /* 指やマウスの位置にある、動かせる画像を選ぶ（プロフィール画像が優先） */
  function pickTarget(clientX, clientY, options = {}) {
    const rects = findAdjustRects().filter((item) => {
      const r = item.screen;
      return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom && getTargetImage(item.key);
    });
    if (options.avatarOnly) {
      return rects.find((item) => item.key === "avatar") || null;
    }
    return rects.find((item) => item.key === "avatar") || rects.find((item) => item.key !== "avatar") || null;
  }

  function getConfig(targetKey) {
    return (typeof previewAdjustTargets !== "undefined" && previewAdjustTargets[targetKey]) || null;
  }

  /* 画像の描き方に合わせて、動かせる幅（左右・上下それぞれ、はみ出し量の半分）を求める */
  function getMovableRange(target, scalePercent) {
    const image = getTargetImage(target.key);
    if (!image) {
      return { x: 0, y: 0 };
    }
    let box = target.box;
    let fitMode = "cover";
    if (target.key === "avatar") {
      box = { x: box.x + 10, y: box.y + 10, w: box.w - 20, h: box.h - 20 };
    } else if (target.key === "backgroundFront" || target.key === "backgroundBack") {
      fitMode = "contain";
    }
    const baseScale = fitMode === "contain"
      ? Math.min(box.w / image.width, box.h / image.height)
      : Math.max(box.w / image.width, box.h / image.height);
    const drawWidth = image.width * baseScale * (scalePercent / 100);
    const drawHeight = image.height * baseScale * (scalePercent / 100);
    return {
      x: Math.abs(box.w - drawWidth) / 2,
      y: Math.abs(box.h - drawHeight) / 2
    };
  }

  function applyUpdates(targetKey, updates) {
    const config = getConfig(targetKey);
    if (!config) {
      return;
    }
    const next = {};
    if (updates.scale !== undefined) {
      next[config.scaleKey] = normalizeTransformScale(updates.scale, 100, config.minScale, config.maxScale);
    }
    if (updates.offsetX !== undefined) {
      next[config.offsetXKey] = normalizeTransformOffset(updates.offsetX);
    }
    if (updates.offsetY !== undefined) {
      next[config.offsetYKey] = normalizeTransformOffset(updates.offsetY);
    }
    state = constrainStateForPage({ ...state, ...next });
    if (typeof syncPreviewAdjustPanel === "function") {
      syncPreviewAdjustPanel();
    }
    renderCard();
  }

  function readTransform(targetKey) {
    const config = getConfig(targetKey);
    return {
      scale: Number(state[config.scaleKey] ?? 100) || 100,
      offsetX: Number(state[config.offsetXKey] ?? 0) || 0,
      offsetY: Number(state[config.offsetYKey] ?? 0) || 0
    };
  }

  let saveTimer = null;
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (typeof saveState === "function") {
        saveState();
      }
    }, 300);
  }

  /* 画面上で動かした量（px）→ 左右・上下の値（-100〜100）に直す */
  function moveBy(target, start, dxScreen, dyScreen) {
    const scale = getCanvasScale();
    const range = getMovableRange(target, start.scale);
    const updates = {};
    if (range.x >= 1) {
      updates.offsetX = start.offsetX + (dxScreen * scale / range.x) * 100;
    }
    if (range.y >= 1) {
      updates.offsetY = start.offsetY + (dyScreen * scale / range.y) * 100;
    }
    if (Object.keys(updates).length) {
      applyUpdates(target.key, updates);
      saveSoon();
    }
  }

  /* ---- マウス：つかんで動かす ---- */
  let mouseDrag = null;
  let suppressClick = false;
  overlay.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }
    const target = pickTarget(event.clientX, event.clientY);
    if (!target) {
      return;
    }
    mouseDrag = { target, x: event.clientX, y: event.clientY, start: readTransform(target.key), moved: false };
    /* 画像の上では、表示倍率を上げた時の「カードを動かす」より、画像を動かす方を優先する */
    event.stopPropagation();
  }, true);
  window.addEventListener("pointermove", (event) => {
    if (!mouseDrag) {
      return;
    }
    const dx = event.clientX - mouseDrag.x;
    const dy = event.clientY - mouseDrag.y;
    if (!mouseDrag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
      return;
    }
    if (!mouseDrag.moved) {
      mouseDrag.moved = true;
      document.documentElement.classList.add("is-image-dragging");
    }
    event.preventDefault();
    event.stopPropagation();
    moveBy(mouseDrag.target, mouseDrag.start, dx, dy);
  }, true);
  window.addEventListener("pointerup", () => {
    if (!mouseDrag) {
      return;
    }
    if (mouseDrag.moved) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    document.documentElement.classList.remove("is-image-dragging");
    mouseDrag = null;
  }, true);
  /* 画像を動かした後のクリックは、入力欄へ移動させない。表示倍率を上げた時の「カードを動かす」より先に処理する */
  window.addEventListener("click", (event) => {
    if (suppressClick && overlay.contains(event.target)) {
      event.stopPropagation();
      event.preventDefault();
      suppressClick = false;
    }
  }, true);

  /* ---- Ctrl＋ホイール（タッチパッドの2本指つまみ）で大きさ ---- */
  overlay.addEventListener("wheel", (event) => {
    if (!event.ctrlKey) {
      return;
    }
    const target = pickTarget(event.clientX, event.clientY);
    if (!target) {
      return;
    }
    event.preventDefault();
    const current = readTransform(target.key);
    const factor = Math.exp(-event.deltaY * 0.004);
    applyUpdates(target.key, { scale: current.scale * factor });
    saveSoon();
  }, { passive: false });

  /* ---- スマホ：1本指（プロフィール画像）・2本指（つまむ＝大きさ、動かす＝位置） ---- */
  let touchState = null;
  const midpoint = (touches) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  });
  const distance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  overlay.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      const mid = midpoint(event.touches);
      const target = pickTarget(mid.x, mid.y);
      if (!target) {
        touchState = null;
        return;
      }
      touchState = { mode: "pinch", target, start: readTransform(target.key), mid, dist: distance(event.touches) };
      event.preventDefault();
    } else if (event.touches.length === 1) {
      const t = event.touches[0];
      const target = pickTarget(t.clientX, t.clientY, { avatarOnly: true });
      touchState = target ? { mode: "drag", target, start: readTransform(target.key), x: t.clientX, y: t.clientY, moved: false } : null;
    }
  }, { passive: false });

  overlay.addEventListener("touchmove", (event) => {
    if (!touchState) {
      return;
    }
    if (touchState.mode === "pinch" && event.touches.length === 2) {
      event.preventDefault();
      const mid = midpoint(event.touches);
      const ratio = distance(event.touches) / Math.max(touchState.dist, 1);
      const newScale = touchState.start.scale * ratio;
      applyUpdates(touchState.target.key, { scale: newScale });
      moveBy(touchState.target, { ...touchState.start, scale: newScale }, mid.x - touchState.mid.x, mid.y - touchState.mid.y);
      saveSoon();
      return;
    }
    if (touchState.mode === "drag" && event.touches.length === 1) {
      const t = event.touches[0];
      const dx = t.clientX - touchState.x;
      const dy = t.clientY - touchState.y;
      if (!touchState.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
        return;
      }
      touchState.moved = true;
      event.preventDefault();
      moveBy(touchState.target, touchState.start, dx, dy);
    }
  }, { passive: false });

  overlay.addEventListener("touchend", (event) => {
    if (touchState && touchState.moved) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 350);
    }
    if (!event.touches.length) {
      touchState = null;
    }
  });

  /* ---- 画像をファイルから選んだら、その画像の「画像編集」の窓を開く（パソコン）。選ぶ欄の下に操作の説明 ---- */
  const FILE_TARGETS = {
    avatarFile: "avatar",
    backgroundImageFile: "background",
    backgroundImageFrontFile: "backgroundFront",
    backgroundImageBackFile: "backgroundBack"
  };
  Object.entries(FILE_TARGETS).forEach(([inputId, targetKey]) => {
    const input = document.getElementById(inputId);
    if (!input) {
      return;
    }
    const field = input.closest(".field") || input.parentElement;
    if (field && !field.querySelector(".image-direct-note")) {
      const note = document.createElement("p");
      note.className = "field-note image-direct-note";
      note.textContent = targetKey === "avatar"
        ? "選んだ画像は、プレビューのカードの上でつかんで動かせます。大きさは「Ctrl＋ホイール」か、スマホは2本指でつまんで変えられます（「画像編集」ボタンからも調整できます）。"
        : "選んだ画像は、プレビューのカードの上でつかんで動かせます。大きさは「Ctrl＋ホイール」か、スマホは2本指でつまんで変えられます（背景をスマホで動かす時は2本指）。";
      field.appendChild(note);
    }
    input.addEventListener("change", () => {
      if (!input.files || !input.files.length || window.innerWidth < 1121) {
        return;
      }
      const button = document.querySelector(`[data-preview-adjust-target="${targetKey}"]`);
      setTimeout(() => {
        if (typeof openPreviewAdjustPanel === "function" && getTargetImage(targetKey)) {
          openPreviewAdjustPanel(targetKey, { button, forceFromAnchor: true });
        }
      }, 600);
    });
  });
})();
