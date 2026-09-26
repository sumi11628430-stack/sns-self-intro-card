/* プロフィール画像の枠：10種類の形を、見本つきのボタンで選べるようにする。
   実際の値は元の <select id="avatarShape"> に入れ、change を送ってページ側の処理に任せる */
(() => {
  const select = document.getElementById("avatarShape");
  if (!select) {
    return;
  }

  /* 見本の形（100x100 の中のSVGパス）。カードに描く形（beginAvatarPath）と同じ輪郭 */
  function starPath() {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 52 : 26;
      pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(54 + Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${pts.join("L")}Z`;
  }
  function flowerPath() {
    const pts = [];
    for (let i = 0; i <= 120; i += 1) {
      const t = (i / 120) * Math.PI * 2;
      const r = 50 * (0.62 + 0.38 * Math.abs(Math.sin((5 * t) / 2)));
      pts.push(`${(50 + Math.cos(t - Math.PI / 2) * r).toFixed(1)},${(50 + Math.sin(t - Math.PI / 2) * r).toFixed(1)}`);
    }
    return `M${pts.join("L")}Z`;
  }
  const SHAPES = {
    circle: "M50,0A50,50 0 1 1 49.9,0Z",
    rounded: "M22,0H78A22,22 0 0 1 100,22V78A22,22 0 0 1 78,100H22A22,22 0 0 1 0,78V22A22,22 0 0 1 22,0Z",
    diamond: "M50,0L100,50L50,100L0,50Z",
    octagon: "M29.3,0H70.7L100,29.3V70.7L70.7,100H29.3L0,70.7V29.3Z",
    heart: "M50,26C50,20 40,3 24,3C4,3 -2,26 2,40C8,62 34,80 50,98C66,80 92,62 98,40C102,26 96,3 76,3C60,3 50,20 50,26Z",
    star: starPath(),
    flower: flowerPath(),
    cloud: "M16,88L84,88C102,88 104,56 86,52C90,28 66,16 58,32C54,6 24,6 28,36C6,30 -2,56 12,62C-4,70 0,88 16,88Z",
    drop: "M50,0C62,18 92,42 92,64C92,86 73,100 50,100C27,100 8,86 8,64C8,42 38,18 50,0Z",
    arch: "M0,50A50,50 0 0 1 100,50V92Q100,100 92,100H8Q0,100 0,92Z"
  };

  const wrap = document.createElement("div");
  wrap.className = "avatar-shape-picker";
  wrap.setAttribute("role", "radiogroup");
  wrap.setAttribute("aria-label", "プロフィール画像の枠");

  const buttons = Array.from(select.options).map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "avatar-shape-option";
    button.dataset.value = option.value;
    button.setAttribute("role", "radio");
    button.innerHTML =
      `<svg viewBox="-4 -4 108 108" aria-hidden="true"><path d="${SHAPES[option.value] || SHAPES.circle}"/></svg>` +
      `<span>${option.textContent}</span>`;
    button.addEventListener("click", () => {
      if (select.value === option.value) {
        return;
      }
      select.value = option.value;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    });
    wrap.appendChild(button);
    return button;
  });

  function sync() {
    /* 保存済みの値が10種類に無い時（以前の「ふんわり」など）は円形にする */
    if (!Array.from(select.options).some((o) => o.value === select.value)) {
      select.value = "circle";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    buttons.forEach((button) => {
      const on = button.dataset.value === select.value;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-checked", String(on));
    });
  }

  select.insertAdjacentElement("afterend", wrap);
  select.addEventListener("change", sync);
  /* 入力例の読み込みなど、ページ側が値を書き換えた時にも見本の選択を合わせる */
  new MutationObserver(sync).observe(select, { attributes: true, childList: true });
  setInterval(() => {
    const active = buttons.find((b) => b.classList.contains("is-active"));
    if (!active || active.dataset.value !== select.value) {
      sync();
    }
  }, 500);
  window.addEventListener("load", sync);
  sync();
})();
