/* 書式：プレビュー上部のボタン列に「書式：丸ゴシック ▾」を1つ置き、押すと10種類の見本を小さな窓で開く。
   見本のボタン（#textStyleChips の中身）はページ側の処理がそのまま作るので、入れ物ごと窓の中へ移すだけにする */
(() => {
  const toolbar = document.querySelector(".preview-adjust-toolbar");
  const strip = document.getElementById("textStyleChips");
  const select = document.getElementById("textStylePreset");
  if (!toolbar || !strip || !select) {
    return;
  }
  const oldRow = strip.closest(".style-chip-row");

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "preview-adjust-toggle style-popover-toggle";
  toggle.setAttribute("aria-haspopup", "true");
  toggle.setAttribute("aria-expanded", "false");

  const popover = document.createElement("div");
  popover.className = "style-popover";
  popover.hidden = true;
  popover.setAttribute("role", "dialog");
  popover.setAttribute("aria-label", "書式を選ぶ");
  const head = document.createElement("div");
  head.className = "style-popover-head";
  head.innerHTML = '<span>書式を選ぶ</span><button type="button" class="style-popover-close" aria-label="閉じる">×</button>';
  popover.append(head, strip);

  toolbar.insertBefore(toggle, toolbar.firstChild);
  toolbar.appendChild(popover);
  if (oldRow) {
    oldRow.remove();
  }

  function currentName() {
    const active = strip.querySelector(".style-chip.is-active .style-chip-name");
    return active ? active.textContent : "";
  }

  function updateLabel() {
    const name = currentName();
    toggle.textContent = name ? `書式：${name} ▾` : "書式を選ぶ ▾";
  }

  function setOpen(open) {
    popover.hidden = !open;
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(popover.hidden);
  });
  head.querySelector(".style-popover-close").addEventListener("click", () => setOpen(false));
  /* 見本を押したら（ページ側で書式が切り替わった後に）名前を更新して窓を閉じる */
  strip.addEventListener("click", (event) => {
    if (event.target.closest(".style-chip")) {
      setTimeout(() => {
        updateLabel();
        setOpen(false);
      }, 0);
    }
  });
  document.addEventListener("click", (event) => {
    if (!popover.hidden && !popover.contains(event.target) && event.target !== toggle) {
      setOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  /* 入力例の読み込みや保存内容の復元で書式が変わった時にも、ボタンの名前を合わせる */
  select.addEventListener("change", () => setTimeout(updateLabel, 0));
  new MutationObserver(updateLabel).observe(strip, { subtree: true, attributes: true, attributeFilter: ["class"], childList: true });
  updateLabel();
})();
