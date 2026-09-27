/* トップのロゴ右側「基本情報」の入口。
   ・入力済みかどうかを表示（保存されている基本情報に、文字が1つでも入っていれば入力済み）
   ・ボタンで下の「① 基本情報」の入力欄を開いて、そこまで移動する（閉じている間は入力欄ごと出さない） */
(() => {
  const store = window.CommonProfileStore;
  const status = document.getElementById("heroCommonStatus");
  const button = document.getElementById("heroCommonOpen");
  const details = document.getElementById("commonProfile");
  const form = document.getElementById("commonProfileForm");
  if (!status || !button || !details) {
    return;
  }

  /* 表示／非表示やラベルの選択肢は初期値が入っているため、入力欄（名前・自己紹介・SNSなど）だけを見る */
  function isFilled() {
    if (!store || !form) {
      return false;
    }
    const profile = store.load();
    return Array.from(form.querySelectorAll("input[type=text], input:not([type]), input[type=url], textarea")).some((field) => {
      if (/Label$/.test(field.name)) {
        return false; /* SNSの見出し（X / Instagram など）は初期値が入っているので数えない */
      }
      const value = profile[field.name];
      return typeof value === "string" && value.trim() !== "";
    });
  }

  function updateStatus() {
    const filled = isFilled();
    status.textContent = filled ? "✓ 入力済み（あとから直せます）" : "まだ入力していません";
    status.classList.toggle("is-filled", filled);
    button.textContent = filled ? "基本情報を見る・直す" : "基本情報を入力する";
  }

  button.addEventListener("click", () => {
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* 入力欄の「閉じる」は上（入口）へ、下の「入力できたら」はカード選びへ戻る */
  document.getElementById("commonProfileClose")?.addEventListener("click", () => {
    details.open = false;
    updateStatus();
    document.querySelector(".hub-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("commonProfileDone")?.addEventListener("click", () => {
    details.open = false;
    updateStatus();
    document.getElementById("formatLead")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (form) {
    form.addEventListener("input", () => setTimeout(updateStatus, 0));
    form.addEventListener("change", () => setTimeout(updateStatus, 0));
  }
  document.getElementById("loadCommonProfileSample")?.addEventListener("click", () => setTimeout(updateStatus, 0));
  updateStatus();
})();
