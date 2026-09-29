/* トップの入口：「ハロカ」だけの画面を押すと、入口が消えて選択画面のロゴが降ってくる。
   カードが貼られる3回のタイミングで「ド・ミ・ソ」（木琴・鉄琴のような音）を鳴らす。
   音はファイルを使わず、ここで作る。押したこと自体が音を出す許可になるので、同じページの中で切り替える */
(() => {
  const root = document.documentElement;
  const gate = document.getElementById("harokaGate");
  if (!gate || !root.classList.contains("haroka-gate-open")) {
    return;
  }

  let audio = null;
  function getAudio() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    audio = audio || new Ctor();
    if (audio.state === "suspended") {
      audio.resume();
    }
    return audio;
  }

  /* 木琴・鉄琴のような音（三角波＋少し高い倍音を短く） */
  function chime(ac, time, frequency) {
    [[1, "triangle", 0.28, 0.7], [2.76, "sine", 0.06, 0.35]].forEach(([ratio, type, peak, length]) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = frequency * ratio;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(peak, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(gain).connect(ac.destination);
      osc.start(time);
      osc.stop(time + length + 0.05);
    });
  }

  let opened = false;
  function open() {
    if (opened) {
      return;
    }
    opened = true;
    try {
      sessionStorage.setItem("haroka_gate_seen", "1");
    } catch (e) {}

    /* 押した操作の中で、歌を流す準備をしておく（ドミソが鳴り終わって3秒後に「小さな出会い」） */
    if (window.__harokaBgm) {
      window.__harokaBgm.unlock();
      window.__harokaBgm.startSong(5300);
    }
    const ac = getAudio();
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gate.classList.add("is-leaving");
    /* 入口が薄くなり始めたところで選択画面のロゴを降らせる（CSSのカードの待ち時間 0.15s / 0.55s / 0.95s に合わせて鳴らす） */
    const startDelay = 0.25;
    setTimeout(() => root.classList.remove("haroka-gate-open"), startDelay * 1000);
    if (ac && !reduced) {
      const base = ac.currentTime + startDelay;
      [[0.15, 1047], [0.55, 1319], [0.95, 1568]].forEach(([delay, frequency]) => {
        chime(ac, base + delay + 0.42, frequency);
      });
    }
    setTimeout(() => gate.remove(), 800);
  }

  gate.addEventListener("click", open);
  gate.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  gate.focus();
})();
