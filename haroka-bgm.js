/* ハロカの音楽（トップ＋カード作成の6ページで共通）
   ・トップの入口「タップしてはじめる」→ ロゴが降ってドミソ（haroka-gate.js）→ 鳴り終わって3秒後に歌「小さな出会い」
   ・「基本情報を入力する」やカードを選んだら、BGM「Haroka Haroka」に切り替える（歌の半分くらいの音量）
   ・歌が最後まで流れた時も、BGMに切り替える
   ・カードを選んだ後は、トップを「土台」にしたまま、カード作成のページを全画面で重ねて表示する。
   　音は土台で流し続けるので、ページを移っても途切れない（アドレス欄・戻る/進むも対応）
   ・カード作成のページを直接開いた時（再読み込み・URLの共有）は、そのページ単体でBGMを続きから流す。
   　自動で流せない時は、最初に画面を押した時に流す
   ・左下の「♪」ボタンで、いつでも止めたり流したりできる（設定は訪問中ずっと保持） */
(() => {
  const KEY_ENTERED = "haroka_bgm_entered";
  const KEY_MUTED = "haroka_bgm_muted";
  const KEY_POS = "haroka_bgm_pos";

  const SRC_SONG = "./audio/chiisana-deai.m4a";
  const SRC_BGM = "./audio/haroka-haroka.m4a";
  const VOL_SONG = 0.7;
  /* BGMは、歌の「半分くらいに聞こえる」大きさにする。
     ・「Haroka Haroka」は曲そのものが歌より約1.8dB大きく録音されている（実測：音のある部分の平均 −18.1dB と −19.9dB）
     ・耳で「半分」に聞こえるのは、音の強さで約−10dB（約1/3）
     → 0.7 × 0.316 × 0.82 ≒ 0.18 で試し、聞いた上でさらに小さく 0.1 → 0.08 に（2026-09-29 ご指定） */
  const VOL_BGM = 0.08;

  const getItem = (key) => { try { return sessionStorage.getItem(key); } catch (e) { return null; } };
  const setItem = (key, value) => { try { sessionStorage.setItem(key, value); } catch (e) {} };

  /* ---- 土台の上に重ねて開かれたページ：音は土台に任せる。「トップへ戻る」は重ねた画面を閉じる ---- */
  let shell = null;
  try {
    if (window.parent !== window && window.parent.__harokaShell) {
      shell = window.parent.__harokaShell;
    }
  } catch (e) {}
  if (shell) {
    document.addEventListener("click", (event) => {
      const toTop = event.target.closest && event.target.closest('button[onclick*="index.html"], a[href="./index.html"], a[href="index.html"], a[href="./"]');
      if (toTop) {
        event.preventDefault();
        event.stopPropagation();
        shell.close();
      }
    }, true);
    return;
  }

  const root = document.documentElement;
  const isTop = document.body.classList.contains("hub-page");
  let audio = null;
  let kind = null; // "song" | "bgm"
  let fadeTimer = null;
  let waitingGesture = false;
  let songTimer = null;

  const isMuted = () => getItem(KEY_MUTED) === "1";

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener("play", updateButton);
      audio.addEventListener("pause", updateButton);
      audio.addEventListener("ended", () => {
        /* 歌が最後まで流れたら、BGMへ */
        if (kind === "song") {
          play("bgm");
        }
      });
    }
    return audio;
  }

  function setSource(nextKind) {
    const a = getAudio();
    if (kind === nextKind && a.src) {
      return a;
    }
    kind = nextKind;
    a.src = nextKind === "song" ? SRC_SONG : SRC_BGM;
    a.loop = nextKind === "bgm";
    if (nextKind === "bgm") {
      const pos = parseFloat(getItem(KEY_POS));
      if (pos > 0) {
        a.addEventListener("loadedmetadata", () => {
          if (pos < a.duration) {
            a.currentTime = pos;
          }
        }, { once: true });
      }
    }
    return a;
  }

  const targetVolume = () => (kind === "song" ? VOL_SONG : VOL_BGM);

  function fadeTo(target, ms, done) {
    if (!audio) {
      if (done) done();
      return;
    }
    clearInterval(fadeTimer);
    const start = audio.volume;
    const steps = Math.max(Math.round(ms / 50), 1);
    let i = 0;
    fadeTimer = setInterval(() => {
      i += 1;
      audio.volume = Math.min(Math.max(start + (target - start) * (i / steps), 0), 1);
      if (i >= steps) {
        clearInterval(fadeTimer);
        if (done) done();
      }
    }, 50);
  }

  function play(nextKind) {
    if (isMuted()) {
      updateButton();
      return;
    }
    const a = setSource(nextKind || kind || "bgm");
    const p = a.play();
    if (p && p.then) {
      p.then(() => fadeTo(targetVolume(), 1200)).catch(() => waitForGesture());
    } else {
      fadeTo(targetVolume(), 1200);
    }
  }

  function stop() {
    if (!audio) return;
    fadeTo(0, 400, () => audio.pause());
  }

  /* 歌 → BGM へ静かに切り替える */
  function switchToBgm() {
    clearTimeout(songTimer);
    setItem(KEY_ENTERED, "1");
    if (kind === "bgm" && audio && !audio.paused) {
      return;
    }
    if (!audio || audio.paused) {
      kind = null;
      play("bgm");
      return;
    }
    fadeTo(0, 900, () => play("bgm"));
  }

  function waitForGesture() {
    if (waitingGesture) return;
    waitingGesture = true;
    const handler = (event) => {
      if (event.target && event.target.closest && event.target.closest(".bgm-toggle")) return;
      window.removeEventListener("pointerdown", handler, true);
      window.removeEventListener("keydown", handler, true);
      waitingGesture = false;
      play();
    };
    window.addEventListener("pointerdown", handler, true);
    window.addEventListener("keydown", handler, true);
  }

  function savePos() {
    if (audio && kind === "bgm") {
      setItem(KEY_POS, String(audio.currentTime || 0));
    }
  }
  window.addEventListener("pagehide", savePos);
  setInterval(savePos, 2000);

  /* 左下の♪ボタン */
  const button = document.createElement("button");
  button.type = "button";
  button.className = "bgm-toggle";
  button.textContent = "♪";
  button.hidden = true;
  button.addEventListener("click", () => {
    if (audio && !audio.paused) {
      setItem(KEY_MUTED, "1");
      clearTimeout(songTimer);
      stop();
    } else {
      setItem(KEY_MUTED, "0");
      setItem(KEY_ENTERED, "1");
      play(kind || "bgm");
    }
  });
  document.body.appendChild(button);

  function updateButton() {
    const playing = !!audio && !audio.paused;
    button.hidden = root.classList.contains("haroka-gate-open");
    button.classList.toggle("is-off", !playing);
    button.setAttribute("aria-label", playing ? "音楽を止める" : "音楽を流す");
    button.title = playing ? "音楽を止める" : "音楽を流す";
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && getItem(KEY_ENTERED) === "1" && !isMuted() && audio && audio.paused) {
      play();
    }
    updateButton();
  });

  /* ---- カード作成のページを単体で開いた時：BGMを続きから ---- */
  if (!isTop) {
    if (getItem(KEY_ENTERED) === "1") {
      play("bgm");
    }
    updateButton();
    return;
  }

  /* ---- トップ：土台として、カード作成のページを重ねて表示する ---- */
  const topUrl = location.pathname + location.search;
  const topTitle = document.title;
  let frame = null;

  function syncFromFrame() {
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      const loc = frame.contentWindow.location;
      if (doc && doc.title) {
        document.title = doc.title;
      }
      history.replaceState({ harokaShell: true }, "", loc.pathname + loc.search + loc.hash);
    } catch (e) {}
  }

  function openFrame(href, fromHistory) {
    if (frame) {
      frame.src = href;
      return;
    }
    frame = document.createElement("iframe");
    frame.className = "haroka-shell-frame";
    frame.setAttribute("title", "ハロカ");
    frame.setAttribute("allow", "web-share; clipboard-write; fullscreen");
    frame.addEventListener("load", syncFromFrame);
    frame.src = href;
    document.body.appendChild(frame);
    root.classList.add("haroka-shell-open");
    if (!fromHistory) {
      history.pushState({ harokaShell: true }, "", href);
    }
    switchToBgm();
  }

  function closeFrame(fromHistory) {
    if (!frame) return;
    frame.parentNode.removeChild(frame);
    frame = null;
    root.classList.remove("haroka-shell-open");
    document.title = topTitle;
    if (!fromHistory) {
      history.replaceState(null, "", topUrl);
    }
  }

  window.__harokaShell = { open: openFrame, close: () => closeFrame(false) };

  window.addEventListener("popstate", (event) => {
    const inShell = !!(event.state && event.state.harokaShell);
    if (frame && !inShell) {
      closeFrame(true);
    }
    if (!frame && inShell) {
      openFrame(location.pathname.split("/").pop() || "daily-format.html", true);
    }
  });

  /* カードを選んだら、ページを移らずに重ねて開く（Ctrl＋クリックなどは今まで通り新しいタブ） */
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1) {
      return;
    }
    const href = link.getAttribute("href") || "";
    if (/^(\.\/)?(daily|medical|oshi)-(format|print)\.html$/.test(href)) {
      event.preventDefault();
      openFrame(href.replace(/^\.\//, ""));
    }
  });

  /* 「基本情報を入力する」でもBGMへ */
  const commonOpen = document.getElementById("heroCommonOpen");
  if (commonOpen) {
    commonOpen.addEventListener("click", switchToBgm);
  }

  window.__harokaBgm = {
    /* 入口を押した瞬間（押した操作の中）に呼ぶ：スマホで後から音を出せるよう、再生部品の準備だけする */
    unlock() {
      const a = setSource("song");
      a.muted = true;
      const p = a.play();
      const reset = () => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      };
      if (p && p.then) {
        p.then(reset).catch(() => { a.muted = false; });
      } else {
        reset();
      }
    },
    /* ms 後に歌を流す（その前にBGMへ切り替わっていたら流さない） */
    startSong(ms) {
      setItem(KEY_ENTERED, "1");
      clearTimeout(songTimer);
      songTimer = setTimeout(() => {
        if (kind === "bgm" && audio && !audio.paused) {
          return;
        }
        play("song");
      }, ms);
    }
  };

  /* 2回目以降（入口を出さない時）はBGMを流す */
  if (!root.classList.contains("haroka-gate-open") && getItem(KEY_ENTERED) === "1") {
    play("bgm");
  }
  updateButton();
  new MutationObserver(updateButton).observe(root, { attributes: true, attributeFilter: ["class"] });
})();
