/* チェックリスト：同時に選ぶと矛盾する項目（例：病気の話OK／控えめ、同担歓迎／慎重／拒否）は、
   1つを選ぶと、同じ組の他の項目のチェックを外す（data-exclusive が同じもの同士） */
(() => {
  document.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "checkbox" || !input.checked || !input.dataset.exclusive) {
      return;
    }
    document.querySelectorAll(`input[type="checkbox"][data-exclusive="${input.dataset.exclusive}"]`).forEach((other) => {
      if (other !== input && other.checked) {
        other.checked = false;
        other.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
})();
