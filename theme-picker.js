/* 背景テーマ欄：
   ・ワンタップ配色（4種）… 押すと地色・地色2・アクセント・アクセント2をまとめてその色の組み合わせに変える。
     あとからプレビュー欄で1色ずつ変えられる。背景のイラストの選択はそのまま残す
   ・背景のイラスト（なし＋12種）… 実際の値は元の <select id="themePreset"> に入れ、change を送ってページ側の処理に任せる */
(() => {
  const select = document.getElementById("themePreset");
  if (!select) {
    return;
  }

  const PALETTES = [
    { key: "sunrise", name: "朝焼け", colors: { accentColor: "#ec7b46", accentColorEnd: "#f2a46f", surfaceColor: "#fff7ef", surfaceColorEnd: "#fffdf9" } },
    { key: "lagoon", name: "ラグーン", colors: { accentColor: "#2f8f90", accentColorEnd: "#7cc3be", surfaceColor: "#f2faf8", surfaceColorEnd: "#fbfffe" } },
    { key: "forest", name: "フォレスト", colors: { accentColor: "#5c8a57", accentColorEnd: "#a3c48a", surfaceColor: "#f6f8ee", surfaceColorEnd: "#fdfdf7" } },
    { key: "paper", name: "ペーパー", colors: { accentColor: "#bb8553", accentColorEnd: "#dcb285", surfaceColor: "#fbf6ec", surfaceColorEnd: "#fffdf8" } }
  ];
  /* 「なし」を押した時の値（イラストを使わない時の地。カードの地は画像いっぱいに敷くので、ほぼ見えない） */
  const PLAIN_VALUE = "paper";

  function colorInput(name) {
    return document.getElementById(name);
  }

  function paletteMatches(palette) {
    return Object.entries(palette.colors).every(([name, value]) => {
      const input = colorInput(name);
      return input && input.value.toLowerCase() === value;
    });
  }

  function applyPalette(palette) {
    Object.entries(palette.colors).forEach(([name, value]) => {
      const input = colorInput(name);
      if (!input) {
        return;
      }
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    sync();
  }

  function setTheme(value) {
    if (select.value === value) {
      return;
    }
    select.value = value;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
  }

  function makeButton(kind, value, name, swatch) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-option";
    button.dataset.kind = kind;
    button.dataset.value = value;
    button.innerHTML = `<span class="theme-swatch" style='${swatch}'></span><span class="theme-name">${name}</span>`;
    return button;
  }

  function addGroup(title, note) {
    const heading = document.createElement("p");
    heading.className = "theme-picker-heading";
    heading.innerHTML = note ? `${title}<small>${note}</small>` : title;
    wrap.appendChild(heading);
    const grid = document.createElement("div");
    grid.className = "theme-picker-grid";
    wrap.appendChild(grid);
    return grid;
  }

  const wrap = document.createElement("div");
  wrap.className = "theme-picker";
  const buttons = [];

  const paletteGrid = addGroup("ワンタップ配色", "押すと地色・アクセントの色がまとめて変わります");
  PALETTES.forEach((palette) => {
    const c = palette.colors;
    const swatch = `background-image:linear-gradient(135deg, ${c.surfaceColor} 0 46%, ${c.accentColorEnd} 46% 70%, ${c.accentColor} 70%)`;
    const button = makeButton("palette", palette.key, palette.name, swatch);
    button.addEventListener("click", () => applyPalette(palette));
    paletteGrid.appendChild(button);
    buttons.push(button);
  });

  const illustGrid = addGroup("背景のイラスト", "文字の下の地が半透明になり、絵が見えます");
  const plainButton = document.createElement("button");
  plainButton.type = "button";
  plainButton.className = "theme-plain-button";
  plainButton.dataset.kind = "illust";
  plainButton.dataset.value = PLAIN_VALUE;
  plainButton.textContent = "イラストなし";
  plainButton.addEventListener("click", () => setTheme(PLAIN_VALUE));
  illustGrid.previousElementSibling.appendChild(plainButton);
  buttons.push(plainButton);
  Array.from(select.options).filter((o) => o.value.startsWith("illust-")).forEach((option) => {
    const swatch = `background-image:url("./images/themes/${option.value.slice(7)}-thumb.webp")`;
    const button = makeButton("illust", option.value, option.textContent, swatch);
    button.addEventListener("click", () => setTheme(option.value));
    illustGrid.appendChild(button);
    buttons.push(button);
  });

  function sync() {
    const isIllust = select.value.startsWith("illust-");
    buttons.forEach((button) => {
      let on;
      if (button.dataset.kind === "palette") {
        on = paletteMatches(PALETTES.find((p) => p.key === button.dataset.value));
      } else if (button === plainButton) {
        on = !isIllust;
      } else {
        on = button.dataset.value === select.value;
      }
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", String(on));
    });
  }

  select.insertAdjacentElement("afterend", wrap);
  select.addEventListener("change", sync);
  /* 入力例の読み込み、保存内容の復元、プレビュー欄での色変更などにも表示を合わせる */
  document.addEventListener("input", () => setTimeout(sync, 0));
  setInterval(sync, 700);
  window.addEventListener("load", sync);
  sync();
})();
