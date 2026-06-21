const commonProfileStore = window.CommonProfileStore;
const commonProfileForm = document.getElementById("commonProfileForm");
const loadCommonProfileSampleButton = document.getElementById("loadCommonProfileSample");

const COMMON_PROFILE_SAMPLE = {
  displayName: "みなと / @minato_create",
  role: "やさしい配色が好きなWebデザイナー",
  gender: "ひみつ",
  blood: "O型",
  birthday: "4月18日",
  age: "20代",
  location: "東京 / カフェに出没",
  intro: "カフェ巡り、読書、アイコン集めが好きです。デザインの話も日常の話も、気軽に話しかけてもらえるとうれしいです。",
  tags: "デザイン, カフェ巡り, 読書, 猫好き",
  socialXLabel: "X",
  socialX: "https://x.com/minato_create",
  socialInstagramLabel: "Instagram",
  socialInstagram: "https://www.instagram.com/minato_create/",
  socialThreadsLabel: "YouTube",
  socialThreads: "https://www.youtube.com/@minato_create",
  socialTikTokLabel: "LINE",
  socialTikTok: "https://line.me/ti/p/@minato_create"
};

if (commonProfileStore && commonProfileForm) {
  applyCommonProfileForm(commonProfileStore.load());
  commonProfileForm.addEventListener("input", handleCommonProfileChange);
  commonProfileForm.addEventListener("change", handleCommonProfileChange);
}
if (commonProfileStore && commonProfileForm && loadCommonProfileSampleButton) {
  loadCommonProfileSampleButton.addEventListener("click", loadCommonProfileSample);
}

function handleCommonProfileChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return;
  }

  commonProfileStore.save(collectCommonProfileFromForm());
}

function collectCommonProfileFromForm() {
  const profile = commonProfileStore.createEmpty();
  commonProfileStore.FIELDS.forEach((fieldName) => {
    const field = commonProfileForm.elements.namedItem(fieldName);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      profile[fieldName] = field.value;
    }
  });
  return profile;
}

function applyCommonProfileForm(profile) {
  commonProfileStore.FIELDS.forEach((fieldName) => {
    const field = commonProfileForm.elements.namedItem(fieldName);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      field.value = profile[fieldName] || "";
    }
  });
}

function loadCommonProfileSample() {
  const normalized = commonProfileStore.save(COMMON_PROFILE_SAMPLE);
  applyCommonProfileForm(normalized);
}
