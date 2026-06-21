const pageStorageKey = document.body?.dataset.storageKey?.trim();
const forcedLayoutMode = document.body?.dataset.forcedLayoutMode?.trim();
const STORAGE_KEY = pageStorageKey || "sns-medical-self-intro-card-state";

const defaultState = {
  displayName: "みなと / @minato_care",
  displayNameVisible: "show",
  displayNameLabel: "名前",
  roleVisible: "show",
  roleLabel: "肩書き",
  role: "体調優先でゆっくり交流したいです",
  genderVisible: "show",
  gender: "ひみつ",
  genderLabel: "性",
  bloodVisible: "show",
  blood: "ひみつ",
  bloodLabel: "血液型",
  birthdayVisible: "show",
  birthday: "4月18日",
  birthdayLabel: "誕生日",
  ageVisible: "show",
  age: "20代",
  ageLabel: "年齢",
  locationVisible: "show",
  location: "関東 / 通院エリア",
  locationLabel: "住んでる所",
  intro: "体調に波があるので返信はゆっくりめです。同じように無理なく交流できる方とつながれたらうれしいです。",
  tags: "療養中, 通院中, ゆっくり返信, 感覚過敏",
  footerMessage: "体調優先でゆっくり交流できたらうれしいです",
  layoutMode: "standard",
  sizePreset: "portrait",
  themePreset: "lagoon",
  frameStyle: "soft",
  avatarShape: "rounded",
  accentColor: "#5f8896",
  accentColorEnd: "#9dbec8",
  surfaceColor: "#f6fbfb",
  surfaceColorEnd: "#fbfffd",
  labelTextColor: "#1b2326",
  textColor: "#1b2326",
  textStylePreset: "type01",
  diagnosis: "自律神経の不調 / 不安障害",
  careHistory: "心療内科へ通院中 / 通院は月1回",
  treatment: "服薬 / 生活リズム調整 / カウンセリング",
  supportNeeds: "返信はゆっくりです / 体調の話題は日によって難しいです",
  checkOutpatient: true,
  checkHospitalized: false,
  checkHomeCare: false,
  checkLeaveWork: false,
  checkLeaveSchool: false,
  checkMedication: true,
  checkCounseling: true,
  checkSensorySensitive: true,
  checkVisualSensitive: false,
  checkAuditorySensitive: false,
  checkTrauma: false,
  checkFlashback: false,
  checkPhoneHard: true,
  checkSlowReply: true,
  checkOd: false,
  checkDisabilityCard: false,
  checkDisabilityPension: false,
  checkJiritsuShien: false,
  checkVisitingNurse: false,
  checkDayCare: false,
  checkEmploymentTransition: false,
  checkDisabilityEmployment: false,
  checkHelper: false,
  socialX: "",
  socialXLabel: "X",
  socialInstagram: "",
  socialInstagramLabel: "Instagram",
  socialThreads: "",
  socialThreadsLabel: "Threads",
  socialTikTok: "",
  socialTikTokLabel: "TikTok",
  socialYouTube: "",
  socialBluesky: "",
  socialLine: "",
  useCommonProfile: false,
  commonProfileOverrides: {},
  backgroundOverlayOpacity: 55,
  backgroundOverlayOpacityFront: 55,
  backgroundOverlayOpacityBack: 55,
  backgroundFrontScale: 100,
  backgroundFrontOffsetX: 0,
  backgroundFrontOffsetY: 0,
  backgroundBackScale: 100,
  backgroundBackOffsetX: 0,
  backgroundBackOffsetY: 0,
  avatarScale: 100,
  avatarOffsetX: 0,
  avatarOffsetY: 0,
  avatarDataUrl: "",
  backgroundImageDataUrl: "",
  backgroundImageFrontDataUrl: "",
  backgroundImageBackDataUrl: ""
};

const fallbackCommonProfileFields = [
  "displayName",
  "role",
  "gender",
  "blood",
  "birthday",
  "age",
  "location",
  "intro",
  "tags",
  "socialX",
  "socialInstagram",
  "socialThreads",
  "socialTikTok",
  "socialYouTube",
  "socialBluesky",
  "socialLine"
];

const commonProfileStore = window.CommonProfileStore || null;
const commonProfileFields = commonProfileStore?.FIELDS || fallbackCommonProfileFields;

function normalizeCommonProfileOverrides(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const normalized = {};
  commonProfileFields.forEach((fieldName) => {
    if (value[fieldName]) {
      normalized[fieldName] = true;
    }
  });
  return normalized;
}

function applyCommonProfileState(sourceState, options = {}) {
  const nextState = {
    ...sourceState,
    commonProfileOverrides: normalizeCommonProfileOverrides(sourceState.commonProfileOverrides)
  };

  if (!nextState.useCommonProfile || !commonProfileStore) {
    return nextState;
  }

  const profile = commonProfileStore.load();
  commonProfileFields.forEach((fieldName) => {
    if (options.force || !nextState.commonProfileOverrides[fieldName]) {
      nextState[fieldName] = profile[fieldName] ?? "";
    }
  });

  return nextState;
}

const themePalettes = {
  sunrise: {
    top: "#f8d4ad",
    bottom: "#f7eed8",
    glow: "#ec7b46"
  },
  lagoon: {
    top: "#b7ddd8",
    bottom: "#f2f8f6",
    glow: "#2f8f90"
  },
  forest: {
    top: "#c8dbc2",
    bottom: "#f5f1de",
    glow: "#5c8a57"
  },
  paper: {
    top: "#f4eee2",
    bottom: "#fbf8f1",
    glow: "#bb8553"
  }
};

const textStylePresets = {
  type01: {
    fontFamily: "'Yu Gothic', sans-serif",
    labelFontFamily: "'Yu Gothic', sans-serif"
  },
  type02: {
    fontFamily: "'Comic Sans MS', 'Yu Gothic UI', 'Meiryo', sans-serif",
    labelFontFamily: "'Comic Sans MS', 'Yu Gothic UI', 'Meiryo', sans-serif"
  },
  type03: {
    fontFamily: "'Yu Mincho', 'MS PMincho', serif",
    labelFontFamily: "'Yu Mincho', 'MS PMincho', serif"
  },
  type04: {
    fontFamily: "Consolas, 'Meiryo UI', monospace",
    labelFontFamily: "Consolas, 'Meiryo UI', monospace"
  },
  type05: {
    fontFamily: "'Trebuchet MS', 'Yu Gothic UI', sans-serif",
    labelFontFamily: "'Trebuchet MS', 'Yu Gothic UI', sans-serif"
  },
  type06: {
    fontFamily: "Georgia, 'Yu Mincho', serif",
    labelFontFamily: "Georgia, 'Yu Mincho', serif"
  },
  type07: {
    fontFamily: "Verdana, 'Meiryo', sans-serif",
    labelFontFamily: "Verdana, 'Meiryo', sans-serif"
  },
  type08: {
    fontFamily: "'Palatino Linotype', 'Yu Mincho', serif",
    labelFontFamily: "'Palatino Linotype', 'Yu Mincho', serif"
  },
  type09: {
    fontFamily: "'Arial Black', 'Yu Gothic UI', sans-serif",
    labelFontFamily: "'Arial Black', 'Yu Gothic UI', sans-serif"
  },
  type10: {
    fontFamily: "'Courier New', 'Meiryo UI', monospace",
    labelFontFamily: "'Courier New', 'Meiryo UI', monospace"
  },
  type11: {
    fontFamily: "'Century Gothic', 'Yu Gothic UI', sans-serif",
    labelFontFamily: "'Century Gothic', 'Yu Gothic UI', sans-serif"
  },
  type12: {
    fontFamily: "'Times New Roman', 'Yu Mincho', serif",
    labelFontFamily: "'Times New Roman', 'Yu Mincho', serif"
  },
  type13: {
    fontFamily: "'Franklin Gothic Medium', 'Meiryo', sans-serif",
    labelFontFamily: "'Franklin Gothic Medium', 'Meiryo', sans-serif"
  },
  type14: {
    fontFamily: "'Segoe UI', 'Yu Gothic UI', sans-serif",
    labelFontFamily: "'Segoe UI', 'Yu Gothic UI', sans-serif"
  },
  type15: {
    fontFamily: "Impact, 'Arial Black', 'Yu Gothic UI', sans-serif",
    labelFontFamily: "Impact, 'Arial Black', 'Yu Gothic UI', sans-serif"
  }
};

function constrainStateForPage(currentState) {
  if (!forcedLayoutMode) {
    return currentState;
  }

  return {
    ...currentState,
    layoutMode: forcedLayoutMode
  };
}

function normalizeTextStylePreset(value) {
  const legacyPresetMap = {
    standard: "type01",
    cute: "type02",
    spooky: "type03",
    machine: "type04"
  };

  if (legacyPresetMap[value]) {
    return legacyPresetMap[value];
  }

  return textStylePresets[value] ? value : defaultState.textStylePreset;
}

const sizePresets = {
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 }
};

const socialPlatforms = [
  { key: "socialX", label: "X", short: "X", color: "#111111", textColor: "#ffffff" },
  { key: "socialInstagram", label: "Instagram", short: "IG", color: "#e4405f", textColor: "#ffffff" },
  { key: "socialThreads", label: "Threads", short: "TH", color: "#101010", textColor: "#ffffff" },
  { key: "socialTikTok", label: "TikTok", short: "TT", color: "#121212", textColor: "#ffffff" },
  { key: "socialYouTube", label: "YouTube", short: "YT", color: "#ff0033", textColor: "#ffffff" },
  { key: "socialBluesky", label: "Bluesky", short: "BS", color: "#1083fe", textColor: "#ffffff" }
];

const socialInputFields = [
  { key: "socialX", labelKey: "socialXLabel" },
  { key: "socialInstagram", labelKey: "socialInstagramLabel" },
  { key: "socialThreads", labelKey: "socialThreadsLabel" },
  { key: "socialTikTok", labelKey: "socialTikTokLabel" }
];

const socialIconMarkup = {
  socialX: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.63 4.5h3.33l2.86 4.14 3.51-4.14h2.98l-5.12 5.99 5.81 8.01h-3.33l-3.13-4.53-3.86 4.53H6.72l5.46-6.38L6.63 4.5z"/>
    </svg>
  `,
  socialInstagram: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="4.25" fill="none" stroke="currentColor" stroke-width="2.1"/>
      <circle cx="12" cy="12" r="3.45" fill="none" stroke="currentColor" stroke-width="2.1"/>
      <circle cx="17.2" cy="6.85" r="1.2" fill="currentColor"/>
    </svg>
  `,
  socialThreads: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.6 8.8c-1-1.05-2.35-1.58-4.06-1.58-2.94 0-5.06 2.08-5.06 4.92 0 2.97 2.22 5.12 5.28 5.12 1.66 0 2.95-.52 3.97-1.58" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M14.25 10.25c1.95 0 3.35 1.1 3.35 2.8 0 1.45-.88 2.45-2.14 2.45-1 0-1.73-.67-1.73-1.69v-2.53c0-1.23-.78-2.08-2.03-2.08-1.42 0-2.45 1.07-2.45 2.51 0 1.39.96 2.4 2.28 2.4.79 0 1.49-.36 2.01-1.03" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  socialTikTok: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M13.5 4.4c1 1.62 2.42 2.62 4.3 2.9v2.72a8.43 8.43 0 0 1-4.04-1.07v5.34c0 2.76-2.08 4.73-4.95 4.73-2.66 0-4.81-2.03-4.81-4.56 0-2.7 2.26-4.76 4.96-4.76.35 0 .66.02 1 .09v2.66a3.7 3.7 0 0 0-.84-.1c-1.22 0-2.2.89-2.2 2 0 1.16.97 2.03 2.27 2.03 1.48 0 2.13-1.05 2.13-2.46V4.4h2.18z"/>
    </svg>
  `,
  socialYouTube: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.2" y="6.1" width="17.6" height="11.8" rx="3.6" fill="currentColor"/>
      <path fill="#ff0033" d="M3.2 11.98c0-3.4 0-5.1 1.03-6.14C5.26 4.8 6.96 4.8 10.36 4.8h3.28c3.4 0 5.1 0 6.13 1.04 1.03 1.03 1.03 2.74 1.03 6.14v.04c0 3.4 0 5.1-1.03 6.14-1.03 1.04-2.73 1.04-6.13 1.04h-3.28c-3.4 0-5.1 0-6.13-1.04-1.03-1.03-1.03-2.74-1.03-6.14v-.04z"/>
      <path fill="#ffffff" d="M10.2 8.85l5.58 3.15-5.58 3.15V8.85z"/>
    </svg>
  `,
  socialBluesky: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 10.2c1.28-2.43 4-4.02 7.37-4.49-1.03 3.58-3.12 6.02-6.02 7.14 1.74.23 3.44 1.14 4.88 2.75-2.94.87-5.54.37-7.53-1.53-1.99 1.9-4.59 2.4-7.53 1.53 1.44-1.61 3.14-2.52 4.88-2.75-2.9-1.12-4.99-3.56-6.02-7.14C8 6.18 10.72 7.77 12 10.2z"/>
    </svg>
  `
};

const socialPlatformMatchers = [
  { key: "socialX", hostPattern: /(^|\.)x\.com$/i },
  { key: "socialX", hostPattern: /(^|\.)twitter\.com$/i },
  { key: "socialInstagram", hostPattern: /(^|\.)instagram\.com$/i },
  { key: "socialInstagram", hostPattern: /(^|\.)instagr\.am$/i },
  { key: "socialThreads", hostPattern: /(^|\.)threads\.net$/i },
  { key: "socialTikTok", hostPattern: /(^|\.)tiktok\.com$/i },
  { key: "socialYouTube", hostPattern: /(^|\.)youtube\.com$/i },
  { key: "socialYouTube", hostPattern: /(^|\.)youtu\.be$/i },
  { key: "socialBluesky", hostPattern: /(^|\.)bsky\.app$/i },
  { key: "socialBluesky", hostPattern: /(^|\.)bsky\.social$/i }
];

function getSocialLinkIconMarkup(item) {
  return socialIconMarkup[item.key] || "";
}

function findSocialPlatformByKey(key) {
  return socialPlatforms.find((platform) => platform.key === key) || null;
}

function detectSocialPlatformFromUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const { hostname } = new URL(url);
    const match = socialPlatformMatchers.find((candidate) => candidate.hostPattern.test(hostname));
    return match ? findSocialPlatformByKey(match.key) : null;
  } catch {
    return null;
  }
}

function resolveSocialPlatformForUrl(defaultPlatform, url) {
  return detectSocialPlatformFromUrl(url) || defaultPlatform;
}

function createGenericSocialLink(field, url, customLabel = "") {
  const label = customLabel || "SNS";
  return {
    key: field.key,
    label,
    short: label,
    color: "#6f7c88",
    textColor: "#ffffff",
    url,
    fieldName: field.key
  };
}

function getSocialQrLabel(link) {
  return clampText(link.label || link.short || "QR", 10);
}

function migrateLegacySocialFields(currentState) {
  const nextState = { ...currentState };
  const legacyFields = [
    { key: "socialYouTube", label: "YouTube" },
    { key: "socialBluesky", label: "Bluesky" },
    { key: "socialLine", label: "LINE" }
  ];

  legacyFields.forEach((legacyField) => {
    const legacyUrl = normalizeSocialUrl(nextState[legacyField.key]);
    if (!legacyUrl) {
      return;
    }

    const alreadyUsed = socialInputFields.some((field) => normalizeSocialUrl(nextState[field.key]) === legacyUrl);
    if (alreadyUsed) {
      return;
    }

    const emptyField = socialInputFields.find((field) => !normalizeSocialUrl(nextState[field.key]));
    if (!emptyField) {
      return;
    }

    nextState[emptyField.key] = legacyUrl;
    if (!String(nextState[emptyField.labelKey] || "").trim()) {
      nextState[emptyField.labelKey] = legacyField.label;
    }
  });

  return nextState;
}

const qrImageCache = new Map();

const checklistGroups = [
  {
    title: "療養・状態",
    items: [
      { key: "checkOutpatient", label: "通院中" },
      { key: "checkHospitalized", label: "入院中" },
      { key: "checkHomeCare", label: "在宅療養中" },
      { key: "checkLeaveWork", label: "休職中" },
      { key: "checkLeaveSchool", label: "休学中" },
      { key: "checkMedication", label: "服薬中" },
      { key: "checkCounseling", label: "カウンセリング中" }
    ]
  },
  {
    title: "配慮・センシティブ",
    items: [
      { key: "checkSensorySensitive", label: "感覚過敏" },
      { key: "checkVisualSensitive", label: "視覚過敏" },
      { key: "checkAuditorySensitive", label: "聴覚過敏" },
      { key: "checkTrauma", label: "トラウマ" },
      { key: "checkFlashback", label: "フラッシュバック" },
      { key: "checkPhoneHard", label: "通話苦手" },
      { key: "checkSlowReply", label: "返信ゆっくり" },
      { key: "checkOd", label: "OD" }
    ]
  },
  {
    title: "福祉・支援",
    items: [
      { key: "checkDisabilityCard", label: "障害者手帳" },
      { key: "checkDisabilityPension", label: "障害年金" },
      { key: "checkJiritsuShien", label: "自立支援" },
      { key: "checkVisitingNurse", label: "訪問看護" },
      { key: "checkDayCare", label: "デイケア" },
      { key: "checkEmploymentTransition", label: "就労移行支援" },
      { key: "checkDisabilityEmployment", label: "障害者雇用" },
      { key: "checkHelper", label: "要ヘルパー" }
    ]
  }
];

const form = document.getElementById("cardForm");
const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");
const previewSizeLabel = document.getElementById("previewSizeLabel");
const previewFrame = document.getElementById("previewFrame");
const previewAdjustToolbar = document.querySelector(".preview-adjust-toolbar");
const previewCanvasStage = document.querySelector(".canvas-stage");
const previewZoomControl = document.querySelector(".preview-zoom-control");
const previewZoomValue = document.getElementById("previewZoomValue");
const previewZoomButtonsWrap = document.querySelector(".preview-zoom-buttons");
let previewZoomInput = document.getElementById("previewZoomRange");
const previewZoomButtons = Array.from(document.querySelectorAll("[data-preview-zoom-action]"));
const previewAdjustToolbarButtons = Array.from(document.querySelectorAll("[data-preview-adjust-target]"));
const previewAdjustPanel = document.getElementById("previewAdjustPanel");
const previewAdjustCloseMainButton = document.getElementById("previewAdjustCloseMain");
const previewAdjustCloseButtons = Array.from(document.querySelectorAll(".preview-adjust-close"));
const previewAdjustCloseButton = previewAdjustCloseMainButton || previewAdjustCloseButtons[previewAdjustCloseButtons.length - 1] || null;
const previewAdjustTitle = document.getElementById("previewAdjustTitle");
const previewAdjustNote = document.getElementById("previewAdjustNote");
const previewAdjustScaleInput = document.getElementById("previewAdjustScale");
const previewAdjustOffsetXInput = document.getElementById("previewAdjustOffsetX");
const previewAdjustOffsetYInput = document.getElementById("previewAdjustOffsetY");
const previewAdjustScaleValue = document.getElementById("previewAdjustScaleValue");
const previewAdjustOffsetXValue = document.getElementById("previewAdjustOffsetXValue");
const previewAdjustOffsetYValue = document.getElementById("previewAdjustOffsetYValue");
const socialOverlay = document.getElementById("socialOverlay");
const downloadButtons = [
  document.getElementById("downloadCard"),
  document.getElementById("downloadCardBottom")
].filter(Boolean);
const shareButton = document.getElementById("shareCard");
const resetButton = document.getElementById("resetCard");
const loadSampleButton = document.getElementById("loadSample");
const avatarInput = document.getElementById("avatarFile");
const backgroundImageInput = document.getElementById("backgroundImageFile");
const backgroundImageField = document.getElementById("backgroundImageField");
const backgroundImageFrontInput = document.getElementById("backgroundImageFrontFile");
const backgroundImageBackInput = document.getElementById("backgroundImageBackFile");
const backgroundImageFrontField = document.getElementById("backgroundImageFrontField");
const backgroundImageBackField = document.getElementById("backgroundImageBackField");
const backgroundOpacityControl = document.getElementById("backgroundOpacityControl");
const backgroundOverlayOpacityInput = document.getElementById("backgroundOverlayOpacity");
const backgroundOverlayOpacityValue = document.getElementById("backgroundOverlayOpacityValue");
const backgroundOverlayOpacityFrontInput = document.getElementById("backgroundOverlayOpacityFront");
const backgroundOverlayOpacityBackInput = document.getElementById("backgroundOverlayOpacityBack");
const sizePresetSelect = document.getElementById("sizePreset");
const sizePresetNote = document.getElementById("sizePresetNote");
const previewColorInputs = Array.from(document.querySelectorAll("[data-preview-color-control]"));
const rangeValueOutputs = Array.from(document.querySelectorAll("[data-range-output-for]"));
const fileInputButtons = Array.from(document.querySelectorAll("[data-file-input-button]"));
const fileClearButtons = Array.from(document.querySelectorAll("[data-file-clear-target]"));
const managedFileInputs = [
  avatarInput,
  backgroundImageInput,
  backgroundImageFrontInput,
  backgroundImageBackInput
].filter(Boolean);
const fileStateKeyByInputName = {
  avatarFile: "avatarDataUrl",
  backgroundImageFile: "backgroundImageDataUrl",
  backgroundImageFrontFile: "backgroundImageFrontDataUrl",
  backgroundImageBackFile: "backgroundImageBackDataUrl"
};
const PREVIEW_ZOOM_MIN = 1;
const PREVIEW_ZOOM_MAX = 2;
const PREVIEW_ZOOM_STEP = 0.01;
const TRANSFORM_OFFSET_MIN = -100;
const TRANSFORM_OFFSET_MAX = 100;
const previewAdjustTargets = {
  background: {
    title: "画像編集（背景）",
    note: "背景画像の大きさと位置を編集できます。",
    scaleKey: "backgroundFrontScale",
    offsetXKey: "backgroundFrontOffsetX",
    offsetYKey: "backgroundFrontOffsetY",
    minScale: 60,
    maxScale: 180
  },
  backgroundFront: {
    title: "表の背景を編集",
    note: "表面のカード画像をタップすると、この欄で拡縮と位置を編集できます。",
    scaleKey: "backgroundFrontScale",
    offsetXKey: "backgroundFrontOffsetX",
    offsetYKey: "backgroundFrontOffsetY",
    minScale: 60,
    maxScale: 180
  },
  backgroundBack: {
    title: "裏の背景を編集",
    note: "裏面のカード画像をタップすると、この欄で拡縮と位置を編集できます。",
    scaleKey: "backgroundBackScale",
    offsetXKey: "backgroundBackOffsetX",
    offsetYKey: "backgroundBackOffsetY",
    minScale: 60,
    maxScale: 180
  },
  avatar: {
    title: "プロフィール画像を編集",
    note: "プロフィール画像をタップすると、この欄で拡縮と位置を編集できます。",
    scaleKey: "avatarScale",
    offsetXKey: "avatarOffsetX",
    offsetYKey: "avatarOffsetY",
    minScale: 70,
    maxScale: 180
  }
};

previewAdjustTargets.backgroundFront.title = "画像編集（表面）";
previewAdjustTargets.backgroundFront.note = "表面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.backgroundBack.title = "画像編集（裏面）";
previewAdjustTargets.backgroundBack.note = "裏面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.avatar.title = "画像編集（プロフィール）";
previewAdjustTargets.avatar.note = "プロフィール画像の大きさと位置を編集できます。";

previewAdjustTargets.background.title = "画像編集（背景）";
previewAdjustTargets.background.note = "背景画像の大きさと位置を編集できます。";

const previewAdjustButtonLabels = {
  background: "画像編集（背景）",
  backgroundFront: "画像編集（表面）",
  backgroundBack: "画像編集（裏面）",
  avatar: "画像編集（プロフィール）"
};

previewAdjustTargets.backgroundFront.title = "画像編集（表面）";
previewAdjustTargets.backgroundFront.note = "表面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.backgroundBack.title = "画像編集（裏面）";
previewAdjustTargets.backgroundBack.note = "裏面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.avatar.title = "画像編集（プロフィール）";
previewAdjustTargets.avatar.note = "プロフィール画像の大きさと位置を編集できます。";

previewAdjustTargets.background.title = "画像編集（背景）";
previewAdjustTargets.background.note = "背景画像の大きさと位置を編集できます。";
previewAdjustTargets.backgroundFront.title = "画像編集（表面）";
previewAdjustTargets.backgroundFront.note = "表面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.backgroundBack.title = "画像編集（裏面）";
previewAdjustTargets.backgroundBack.note = "裏面の背景画像の大きさと位置を編集できます。";
previewAdjustTargets.avatar.title = "画像編集（プロフィール）";
previewAdjustTargets.avatar.note = "プロフィール画像の大きさと位置を編集できます。";
previewAdjustButtonLabels.background = "画像編集（背景）";
previewAdjustButtonLabels.backgroundFront = "画像編集（表面）";
previewAdjustButtonLabels.backgroundBack = "画像編集（裏面）";
previewAdjustButtonLabels.avatar = "画像編集（プロフィール）";

let state = constrainStateForPage(loadState());
let avatarImage = null;
let backgroundImage = null;
let backgroundImageFront = null;
let backgroundImageBack = null;
let lineQrImage = null;
let lineQrRequestKey = "";
let lineQrFailedKey = "";
let socialOverlayItems = [];
let previewZoom = 1;
let currentPreviewAdjustTarget = "";
let currentPreviewAdjustPosition = null;
let previewAdjustDragState = null;

applyStateToForm(state);
updateLayoutControls();
syncManagedFileInputNames();
restoreAvatar(state.avatarDataUrl);
restoreBackgroundImage(forcedLayoutMode === "business" ? "" : state.backgroundImageDataUrl);
restoreBusinessBackgroundImage("front", state.backgroundImageFrontDataUrl);
restoreBusinessBackgroundImage("back", state.backgroundImageBackDataUrl);
renderCard();
applyPreviewZoom();

if (previewAdjustToolbar) {
  previewAdjustToolbar.setAttribute("aria-label", "画像編集ボタン");
}
previewAdjustToolbarButtons.forEach((button) => {
  const targetKey = button.dataset.previewAdjustTarget || "";
  const label = previewAdjustButtonLabels[targetKey];
  if (label) {
    button.textContent = label;
    button.setAttribute("aria-label", label);
  }
});
if (previewAdjustToolbar && previewZoomControl && previewZoomControl.parentElement !== previewAdjustToolbar) {
  previewAdjustToolbar.appendChild(previewZoomControl);
}
if (!previewZoomInput && previewZoomControl) {
  previewZoomInput = document.createElement("input");
  previewZoomInput.id = "previewZoomRange";
  previewZoomInput.className = "preview-zoom-range";
  previewZoomInput.type = "range";
  previewZoomInput.min = "100";
  previewZoomInput.max = "200";
  previewZoomInput.step = "1";
  previewZoomInput.value = "100";
  previewZoomInput.setAttribute("aria-label", "表示倍率");
  if (previewZoomButtonsWrap?.parentElement) {
    previewZoomButtonsWrap.replaceWith(previewZoomInput);
  } else {
    previewZoomControl.appendChild(previewZoomInput);
  }
}
if (previewZoomInput) {
  previewZoomInput.min = "100";
  previewZoomInput.max = "200";
  previewZoomInput.step = "1";
}

if (form) {
  form.addEventListener("input", handleFieldChange);
  form.addEventListener("change", handleFieldChange);
}
if (avatarInput) {
  avatarInput.addEventListener("change", handleAvatarUpload);
}
if (backgroundImageInput) {
  backgroundImageInput.addEventListener("change", handleBackgroundImageUpload);
}
if (backgroundImageFrontInput) {
  backgroundImageFrontInput.addEventListener("change", (event) => handleBusinessBackgroundImageUpload(event, "front"));
}
if (backgroundImageBackInput) {
  backgroundImageBackInput.addEventListener("change", (event) => handleBusinessBackgroundImageUpload(event, "back"));
}
previewColorInputs.forEach((input) => {
  input.addEventListener("input", handleFieldChange);
  input.addEventListener("change", handleFieldChange);
});
if (backgroundOverlayOpacityInput) {
  backgroundOverlayOpacityInput.addEventListener("input", handleFieldChange);
  backgroundOverlayOpacityInput.addEventListener("change", handleFieldChange);
}
[backgroundOverlayOpacityFrontInput, backgroundOverlayOpacityBackInput].filter(Boolean).forEach((input) => {
  input.addEventListener("input", handleFieldChange);
  input.addEventListener("change", handleFieldChange);
});
fileInputButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.fileInputButton;
    const targetInput = targetId ? document.getElementById(targetId) : null;
    if (targetInput instanceof HTMLInputElement) {
      targetInput.click();
    }
  });
});
fileClearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.fileClearTarget || "";
    clearManagedImage(targetId);
  });
});
previewZoomButtons.forEach((button) => {
  button.addEventListener("click", () => handlePreviewZoomAction(button.dataset.previewZoomAction || "reset"));
});
if (previewZoomInput) {
  const handlePreviewZoomInput = () => {
    const nextZoom = Number(previewZoomInput.value) / 100;
    previewZoom = clamp(nextZoom, PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX);
    applyPreviewZoom();
  };
  previewZoomInput.addEventListener("input", handlePreviewZoomInput);
  previewZoomInput.addEventListener("change", handlePreviewZoomInput);
}
previewAdjustToolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetKey = button.dataset.previewAdjustTarget || "";
    if (!targetKey) {
      return;
    }
    if (currentPreviewAdjustTarget === targetKey && previewAdjustPanel && !previewAdjustPanel.hidden) {
      closePreviewAdjustPanel();
      return;
    }
    openPreviewAdjustPanel(targetKey, { button, forceFromAnchor: true });
  });
});
if (previewAdjustCloseButtons.length > 1) {
  previewAdjustCloseButtons.forEach((button, index) => {
    button.hidden = index !== previewAdjustCloseButtons.length - 1;
  });
}
[previewAdjustScaleInput, previewAdjustOffsetXInput, previewAdjustOffsetYInput].filter(Boolean).forEach((input) => {
  input.addEventListener("input", handlePreviewAdjustInput);
  input.addEventListener("change", handlePreviewAdjustInput);
});
if (previewAdjustCloseButton) {
  previewAdjustCloseButton.addEventListener("click", closePreviewAdjustPanel);
}
if (previewAdjustPanel) {
  previewAdjustPanel.addEventListener("pointerdown", handlePreviewAdjustPanelPointerDown);
  previewAdjustPanel.addEventListener("pointermove", handlePreviewAdjustPanelPointerMove);
  previewAdjustPanel.addEventListener("pointerup", finishPreviewAdjustPanelDrag);
  previewAdjustPanel.addEventListener("pointercancel", finishPreviewAdjustPanelDrag);
}
downloadButtons.forEach((button) => button.addEventListener("click", downloadCard));
if (shareButton) {
  shareButton.addEventListener("click", shareCard);
}
if (resetButton) {
  resetButton.addEventListener("click", resetCard);
}
if (loadSampleButton) {
  loadSampleButton.addEventListener("click", loadSample);
}
window.addEventListener("resize", () => {
  syncSocialOverlay();
  positionPreviewAdjustPanel();
});

function handleFieldChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return;
  }

  if (target.type === "file") {
    return;
  }

  const nextValue = target instanceof HTMLInputElement && target.type === "checkbox"
    ? target.checked
    : target.value;

  const nextState = {
    ...state,
    [target.name]: nextValue
  };

  if (target.name === "useCommonProfile") {
    nextState.commonProfileOverrides = nextValue ? {} : normalizeCommonProfileOverrides(state.commonProfileOverrides);
    state = constrainStateForPage(applyCommonProfileState(nextState, { force: Boolean(nextValue) }));
    applyStateToForm(state);
    updateLayoutControls();
    saveState();
    renderCard();
    return;
  }

  if (state.useCommonProfile && commonProfileFields.includes(target.name)) {
    const profile = commonProfileStore?.load() || {};
    const nextOverrides = normalizeCommonProfileOverrides(state.commonProfileOverrides);
    if (String(nextValue ?? "") === String(profile[target.name] ?? "")) {
      delete nextOverrides[target.name];
    } else {
      nextOverrides[target.name] = true;
    }
    nextState.commonProfileOverrides = nextOverrides;
  }

  state = constrainStateForPage(applyCommonProfileState(nextState));

  updateLayoutControls();
  saveState();
  renderCard();
}
function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    state.avatarDataUrl = "";
    avatarImage = null;
    syncManagedFileInputNames();
    saveState();
    renderCard();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== "string") {
      return;
    }

    state.avatarDataUrl = reader.result;
    syncManagedFileInputNames();
    saveState();
    restoreAvatar(reader.result);
  };
  reader.readAsDataURL(file);
}

function handleBackgroundImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    state.backgroundImageDataUrl = "";
    backgroundImage = null;
    syncManagedFileInputNames();
    saveState();
    renderCard();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== "string") {
      return;
    }

    state.backgroundImageDataUrl = reader.result;
    syncManagedFileInputNames();
    saveState();
    restoreBackgroundImage(reader.result);
  };
  reader.readAsDataURL(file);
}

function handleBusinessBackgroundImageUpload(event, side) {
  const file = event.target.files?.[0];
  const stateKey = side === "back" ? "backgroundImageBackDataUrl" : "backgroundImageFrontDataUrl";

  if (!file) {
    state[stateKey] = "";
    if (side === "back") {
      backgroundImageBack = null;
    } else {
      backgroundImageFront = null;
    }
    syncManagedFileInputNames();
    saveState();
    renderCard();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== "string") {
      return;
    }

    state[stateKey] = reader.result;
    syncManagedFileInputNames();
    saveState();
    restoreBusinessBackgroundImage(side, reader.result);
  };
  reader.readAsDataURL(file);
}

function downloadCard() {
  renderCard();
  const link = document.createElement("a");
  const fileNameBase = sanitizeFileName(state.displayName || "profile-card");
  const suffix = state.layoutMode === "business" ? "推し活用名刺カード" : "推し活用自己紹介カード";
  link.download = `${fileNameBase}-${suffix}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function shareCard() {
  renderCard();

  const shareUrl = getShareUrl();
  const fileNameBase = sanitizeFileName(state.displayName || "profile-card");
  const suffix = state.layoutMode === "business" ? "推し活用名刺カード" : "推し活用自己紹介カード";
  const shareFile = await canvasToShareFile(`${fileNameBase}-${suffix}.png`);
  const shareText = shareUrl
    ? "推し活用自己紹介カードを作成しました。"
    : "推し活用自己紹介カードを作成しました。画像を共有できます。";
  const shareTitle = document.title || "推し活用自己紹介カード";

  if (navigator.share) {
    try {
      if (shareFile && navigator.canShare?.({ files: [shareFile] })) {
        const data = {
          title: shareTitle,
          text: shareText,
          files: [shareFile]
        };

        if (shareUrl) {
          data.url = shareUrl;
        }

        await navigator.share(data);
        return;
      }

      const data = {
        title: shareTitle,
        text: shareUrl ? shareText : `${shareText} 公開後はURLも一緒に共有できます。`
      };

      if (shareUrl) {
        data.url = shareUrl;
      }

      await navigator.share(data);
      return;
    } catch (error) {
      if (error && typeof error === "object" && "name" in error && error.name === "AbortError") {
        return;
      }
    }
  }

  if (shareUrl && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("このブラウザでは画像付き共有に未対応です。ページURLをコピーしました。画像は「画像で保存」から保存できます。");
      return;
    } catch {
      // Fallback to generic notice below.
    }
  }

  window.alert("このブラウザでは共有機能に未対応です。公開後は対応ブラウザで「共有」、それ以外では「画像で保存」を使ってください。");
}

function resetCard() {
  state = constrainStateForPage(structuredClone(defaultState));
  avatarImage = null;
  backgroundImage = null;
  backgroundImageFront = null;
  backgroundImageBack = null;
  if (avatarInput) {
    avatarInput.value = "";
  }
  if (backgroundImageInput) {
    backgroundImageInput.value = "";
  }
  if (backgroundImageFrontInput) {
    backgroundImageFrontInput.value = "";
  }
  if (backgroundImageBackInput) {
    backgroundImageBackInput.value = "";
  }
  applyStateToForm(state);
  updateLayoutControls();
  syncManagedFileInputNames();
  saveState();
  renderCard();
}

function loadSample() {
  state = constrainStateForPage({
    ...structuredClone(defaultState),
    displayName: "すず / @suzu_care",
    displayNameVisible: "show",
    displayNameLabel: "名前",
    roleVisible: "show",
    roleLabel: "肩書き",
    role: "体調優先でゆっくり交流したいです",
    genderVisible: "show",
    gender: "ひみつ",
    genderLabel: "性",
    bloodVisible: "show",
    blood: "A型",
    bloodLabel: "血液型",
    birthdayVisible: "show",
    birthday: "7月7日",
    birthdayLabel: "誕生日",
    ageVisible: "show",
    age: "20代",
    ageLabel: "年齢",
    locationVisible: "show",
    location: "関西 / 通院エリア",
    locationLabel: "住んでる所",
    intro: "体調に波があるので返信はゆっくりです。同じように無理なく交流できる方とつながれたらうれしいです。",
    tags: "療養中, 通院中, ゆっくり返信, 感覚過敏",
    footerMessage: "体調優先でゆっくり交流できたらうれしいです",
    layoutMode: "standard",
    sizePreset: "square",
    themePreset: "lagoon",
    frameStyle: "soft",
    avatarShape: "rounded",
    accentColor: "#5f8896",
    accentColorEnd: "#9dbec8",
    surfaceColor: "#f6fbfb",
    surfaceColorEnd: "#fbfffd",
    textColor: "#1b2326",
    diagnosis: "自律神経の不調 / 不安障害",
    careHistory: "心療内科へ通院中 / 通院は月1回",
    treatment: "服薬 / 生活リズム調整 / カウンセリング",
    supportNeeds: "返信はゆっくりです / 体調の話題は日によって難しいです",
    checkOutpatient: true,
    checkHospitalized: false,
    checkHomeCare: false,
    checkLeaveWork: false,
    checkLeaveSchool: false,
    checkMedication: true,
    checkCounseling: true,
    checkSensorySensitive: true,
    checkVisualSensitive: false,
    checkAuditorySensitive: false,
    checkTrauma: false,
    checkFlashback: false,
    checkPhoneHard: true,
    checkSlowReply: true,
    checkOd: false,
    checkDisabilityCard: true,
    checkDisabilityPension: false,
    checkJiritsuShien: true,
    checkVisitingNurse: false,
    checkDayCare: false,
    checkEmploymentTransition: false,
    checkDisabilityEmployment: false,
    checkHelper: false,
    socialX: "https://x.com/suzu_care",
    socialXLabel: "X",
    socialInstagram: "https://www.instagram.com/suzu_care/",
    socialInstagramLabel: "Instagram",
    socialThreads: "https://line.me/ti/p/@suzu_care",
    socialThreadsLabel: "LINE",
    socialTikTok: "",
    socialTikTokLabel: "TikTok",
    socialYouTube: "",
    socialBluesky: "",
    socialLine: "",
    backgroundOverlayOpacity: 55,
    avatarDataUrl: "",
    backgroundImageDataUrl: "",
    backgroundImageFrontDataUrl: "",
    backgroundImageBackDataUrl: ""
  });

  avatarImage = null;
  backgroundImage = null;
  backgroundImageFront = null;
  backgroundImageBack = null;
  if (avatarInput) {
    avatarInput.value = "";
  }
  if (backgroundImageInput) {
    backgroundImageInput.value = "";
  }
  if (backgroundImageFrontInput) {
    backgroundImageFrontInput.value = "";
  }
  if (backgroundImageBackInput) {
    backgroundImageBackInput.value = "";
  }
  applyStateToForm(state);
  updateLayoutControls();
  syncManagedFileInputNames();
  saveState();
  renderCard();
}

function loadState() {
  try {
    const primaryRaw = localStorage.getItem(STORAGE_KEY);
    const fallbackRaw = pageStorageKey ? localStorage.getItem("sns-medical-self-intro-card-state") : null;
    const raw = primaryRaw || fallbackRaw;
    if (!raw) {
      return constrainStateForPage(applyCommonProfileState(structuredClone(defaultState)));
    }

    const fallbackState = fallbackRaw ? JSON.parse(fallbackRaw) : null;

    const parsedState = migrateLegacySocialFields({
      ...structuredClone(defaultState),
      ...JSON.parse(raw),
      frameStyle: "soft",
      layoutMode: "standard"
    });

    parsedState.labelTextColor = parsedState.labelTextColor || parsedState.textColor || defaultState.labelTextColor;
    parsedState.useCommonProfile = Boolean(parsedState.useCommonProfile);
    parsedState.commonProfileOverrides = normalizeCommonProfileOverrides(parsedState.commonProfileOverrides);
    parsedState.textStylePreset = normalizeTextStylePreset(parsedState.textStylePreset);
    parsedState.backgroundOverlayOpacity = normalizeBackgroundOverlayOpacity(parsedState.backgroundOverlayOpacity);
    parsedState.backgroundOverlayOpacityFront = normalizeBackgroundOverlayOpacity(
      parsedState.backgroundOverlayOpacityFront ?? parsedState.backgroundOverlayOpacity
    );
    parsedState.backgroundOverlayOpacityBack = normalizeBackgroundOverlayOpacity(
      parsedState.backgroundOverlayOpacityBack ?? parsedState.backgroundOverlayOpacity
    );
    parsedState.backgroundFrontScale = normalizeTransformScale(parsedState.backgroundFrontScale, 100, 60, 180);
    parsedState.backgroundBackScale = normalizeTransformScale(parsedState.backgroundBackScale, 100, 60, 180);
    parsedState.avatarScale = normalizeTransformScale(parsedState.avatarScale, 100, 70, 180);
    parsedState.backgroundFrontOffsetX = normalizeTransformOffset(parsedState.backgroundFrontOffsetX);
    parsedState.backgroundFrontOffsetY = normalizeTransformOffset(parsedState.backgroundFrontOffsetY);
    parsedState.backgroundBackOffsetX = normalizeTransformOffset(parsedState.backgroundBackOffsetX);
    parsedState.backgroundBackOffsetY = normalizeTransformOffset(parsedState.backgroundBackOffsetY);
    parsedState.avatarOffsetX = normalizeTransformOffset(parsedState.avatarOffsetX);
    parsedState.avatarOffsetY = normalizeTransformOffset(parsedState.avatarOffsetY);
    if (forcedLayoutMode === "business") {
      const inheritedSharedAvatar = fallbackState?.avatarDataUrl || "";
      if (parsedState.avatarDataUrl === inheritedSharedAvatar) {
        parsedState.avatarDataUrl = "";
      }

      const inheritedSharedBackground = fallbackState?.backgroundImageDataUrl || parsedState.backgroundImageDataUrl || "";
      parsedState.backgroundImageDataUrl = "";
      parsedState.backgroundImageFrontDataUrl =
        parsedState.backgroundImageFrontDataUrl === inheritedSharedBackground
          ? ""
          : (parsedState.backgroundImageFrontDataUrl || "");
      parsedState.backgroundImageBackDataUrl =
        parsedState.backgroundImageBackDataUrl === inheritedSharedBackground
          ? ""
          : (parsedState.backgroundImageBackDataUrl || "");
    } else {
      parsedState.backgroundImageFrontDataUrl = parsedState.backgroundImageFrontDataUrl || parsedState.backgroundImageDataUrl || "";
      parsedState.backgroundImageBackDataUrl = parsedState.backgroundImageBackDataUrl || parsedState.backgroundImageDataUrl || "";
    }
    if (parsedState.bloodLabel === "色") {
      parsedState.bloodLabel = "血の種類";
    }
    return constrainStateForPage(applyCommonProfileState(parsedState));
  } catch {
    return constrainStateForPage(applyCommonProfileState(structuredClone(defaultState)));
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(constrainStateForPage(state)));
  } catch {
    const fallbackState = {
      ...constrainStateForPage(state),
      avatarDataUrl: "",
      backgroundImageDataUrl: "",
      backgroundImageFrontDataUrl: "",
      backgroundImageBackDataUrl: ""
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
  }
}

function applyStateToForm(currentState) {
  Object.entries(currentState).forEach(([key, value]) => {
    const field = form.elements.namedItem(key) || document.querySelector(`[name="${key}"]`);
    if (
      !field
      || key === "avatarDataUrl"
      || key === "backgroundImageDataUrl"
      || key === "backgroundImageFrontDataUrl"
      || key === "backgroundImageBackDataUrl"
    ) {
      return;
    }

    if (field instanceof HTMLInputElement && field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }

    field.value = value;
  });
  syncRangeValueOutputs();
  syncPreviewAdjustPanel();
}

function syncManagedFileInputNames() {
  managedFileInputs.forEach((input) => {
    syncManagedFileInputName(input);
  });
}

function syncManagedFileInputName(input) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const targetId = input.dataset.fileNameTarget;
  const storedStateKey = fileStateKeyByInputName[input.name];
  if (!targetId) {
    syncManagedFileClearButton(input.name, Boolean(storedStateKey && state[storedStateKey]));
    return;
  }

  const output = document.getElementById(targetId);
  if (!output) {
    return;
  }

  const currentFile = input.files?.[0];
  syncManagedFileClearButton(input.name, Boolean(currentFile || (storedStateKey && state[storedStateKey])));
  if (currentFile) {
    output.textContent = currentFile.name;
    return;
  }

  const stateKey = fileStateKeyByInputName[input.name];
  output.textContent = stateKey && state[stateKey] ? "画像を設定済み" : "未選択";
}

function syncManagedFileClearButton(inputName, hasValue) {
  fileClearButtons.forEach((button) => {
    if ((button.dataset.fileClearTarget || "") !== inputName) {
      return;
    }
    button.disabled = !hasValue;
  });
}

function resetManagedImageTransform(targetId) {
  if (targetId === "avatarFile") {
    state.avatarScale = 100;
    state.avatarOffsetX = 0;
    state.avatarOffsetY = 0;
    return;
  }

  if (targetId === "backgroundImageBackFile") {
    state.backgroundBackScale = 100;
    state.backgroundBackOffsetX = 0;
    state.backgroundBackOffsetY = 0;
    return;
  }

  if (targetId === "backgroundImageFile" || targetId === "backgroundImageFrontFile") {
    state.backgroundFrontScale = 100;
    state.backgroundFrontOffsetX = 0;
    state.backgroundFrontOffsetY = 0;
  }
}

function clearManagedImage(targetId) {
  if (!targetId) {
    return;
  }

  const targetInput = document.getElementById(targetId);
  if (targetInput instanceof HTMLInputElement) {
    targetInput.value = "";
  }

  switch (targetId) {
    case "avatarFile":
      state.avatarDataUrl = "";
      avatarImage = null;
      break;
    case "backgroundImageFile":
      state.backgroundImageDataUrl = "";
      backgroundImage = null;
      break;
    case "backgroundImageFrontFile":
      state.backgroundImageFrontDataUrl = "";
      backgroundImageFront = null;
      break;
    case "backgroundImageBackFile":
      state.backgroundImageBackDataUrl = "";
      backgroundImageBack = null;
      break;
    default:
      return;
  }

  resetManagedImageTransform(targetId);
  syncManagedFileInputNames();
  saveState();

  if (currentPreviewAdjustTarget && getPreviewAdjustFieldName(currentPreviewAdjustTarget) === targetId) {
    closePreviewAdjustPanel();
  }

  renderCard();
}

function syncRangeValueOutputs() {
  rangeValueOutputs.forEach((output) => {
    const key = output.dataset.rangeOutputFor;
    if (!key) {
      return;
    }

    const formattedValue = formatRangeValue(state[key], output.dataset.rangeFormat || "raw");
    output.value = formattedValue;
    output.textContent = formattedValue;
  });
}

function formatRangeValue(value, format) {
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? Math.round(numeric) : 0;

  if (format === "percent") {
    return `${safeValue}%`;
  }

  if (format === "signed") {
    return safeValue > 0 ? `+${safeValue}` : `${safeValue}`;
  }

  return String(safeValue);
}

function handlePreviewZoomAction(action) {
  if (action === "in") {
    previewZoom = clamp(previewZoom + PREVIEW_ZOOM_STEP, PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX);
  } else if (action === "out") {
    previewZoom = clamp(previewZoom - PREVIEW_ZOOM_STEP, PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX);
  } else {
    previewZoom = 1;
  }

  applyPreviewZoom();
}

function applyPreviewZoom() {
  if (previewCanvasStage) {
    previewCanvasStage.style.setProperty("--preview-zoom", String(previewZoom));
  }
  if (previewZoomValue) {
    previewZoomValue.textContent = `${Math.round(previewZoom * 100)}%`;
  }
  if (previewZoomInput) {
    previewZoomInput.value = String(Math.round(previewZoom * 100));
  }
  previewZoomButtons.forEach((button) => {
    const action = button.dataset.previewZoomAction || "";
    button.disabled = (action === "out" && previewZoom <= PREVIEW_ZOOM_MIN)
      || (action === "in" && previewZoom >= PREVIEW_ZOOM_MAX);
  });
  requestAnimationFrame(syncSocialOverlay);
}

function handlePreviewAdjustInput(event) {
  if (!currentPreviewAdjustTarget) {
    return;
  }

  const config = previewAdjustTargets[currentPreviewAdjustTarget];
  if (!config) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const updates = {};
  if (target === previewAdjustScaleInput) {
    updates[config.scaleKey] = normalizeTransformScale(target.value, 100, config.minScale, config.maxScale);
  } else if (target === previewAdjustOffsetXInput) {
    updates[config.offsetXKey] = normalizeTransformOffset(target.value);
  } else if (target === previewAdjustOffsetYInput) {
    updates[config.offsetYKey] = normalizeTransformOffset(target.value);
  } else {
    return;
  }

  state = constrainStateForPage({
    ...state,
    ...updates
  });
  syncPreviewAdjustPanel();
  saveState();
  renderCard();
}

function openPreviewAdjustPanel(targetKey, options = {}) {
  if (!previewAdjustTargets[targetKey]) {
    return;
  }

  if (!options.forceFromAnchor) {
    const fieldName = getPreviewAdjustFieldName(targetKey);
    if (fieldName) {
      focusFormField(fieldName);
    }
    return;
  }

  const targetChanged = currentPreviewAdjustTarget !== targetKey;
  currentPreviewAdjustTarget = targetKey;
  if (options.forceFromAnchor || targetChanged || !currentPreviewAdjustPosition) {
    currentPreviewAdjustPosition = resolvePreviewAdjustPosition(options.button || null);
  }
  syncPreviewAdjustPanel();
  requestAnimationFrame(syncSocialOverlay);
}

function closePreviewAdjustPanel() {
  currentPreviewAdjustTarget = "";
  previewAdjustDragState = null;
  if (previewAdjustPanel) {
    previewAdjustPanel.hidden = true;
    previewAdjustPanel.style.display = "none";
  }
  syncPreviewAdjustPanel();
  requestAnimationFrame(syncSocialOverlay);
}

function resolvePreviewAdjustPosition(anchorButton = null) {
  if (!previewFrame) {
    return { left: 16, top: 16 };
  }

  const frameRect = previewFrame.getBoundingClientRect();
  let left = 16;
  let top = 16;

  if (anchorButton instanceof HTMLElement) {
    const buttonRect = anchorButton.getBoundingClientRect();
    left = buttonRect.left - frameRect.left;
    top = buttonRect.bottom - frameRect.top + 8;
  }

  return clampPreviewAdjustPosition({ left, top });
}

function clampPreviewAdjustPosition(position) {
  if (!previewFrame) {
    return position || { left: 16, top: 16 };
  }

  const panelWidth = previewAdjustPanel?.offsetWidth || 320;
  const panelHeight = previewAdjustPanel?.offsetHeight || 236;
  const maxLeft = Math.max(previewFrame.clientWidth - panelWidth - 12, 12);
  const maxTop = Math.max(previewFrame.clientHeight - panelHeight - 12, 12);
  const safePosition = position || { left: 16, top: 16 };

  return {
    left: clamp(safePosition.left, 12, maxLeft),
    top: clamp(safePosition.top, 12, maxTop)
  };
}

function getPreviewAdjustFieldName(targetKey) {
  if (targetKey === "background") {
    return "backgroundImageFile";
  }
  if (targetKey === "backgroundFront") {
    return "backgroundImageFrontFile";
  }
  if (targetKey === "backgroundBack") {
    return "backgroundImageBackFile";
  }
  if (targetKey === "avatar") {
    return "avatarFile";
  }
  return "";
}

function positionPreviewAdjustPanel() {
  if (!previewAdjustPanel || previewAdjustPanel.hidden) {
    return;
  }

  currentPreviewAdjustPosition = clampPreviewAdjustPosition(currentPreviewAdjustPosition);
  previewAdjustPanel.style.left = `${currentPreviewAdjustPosition.left}px`;
  previewAdjustPanel.style.top = `${currentPreviewAdjustPosition.top}px`;
}

function handlePreviewAdjustPanelPointerDown(event) {
  if (!previewAdjustPanel || previewAdjustPanel.hidden) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.closest(".preview-adjust-close, input, select, textarea, output, .range-control")) {
    return;
  }

  event.preventDefault();
  const rect = previewAdjustPanel.getBoundingClientRect();
  previewAdjustDragState = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  previewAdjustPanel.classList.add("is-dragging");
  previewAdjustPanel.setPointerCapture?.(event.pointerId);
}

function handlePreviewAdjustPanelPointerMove(event) {
  if (!previewAdjustDragState || previewAdjustDragState.pointerId !== event.pointerId || !previewFrame) {
    return;
  }

  const frameRect = previewFrame.getBoundingClientRect();
  currentPreviewAdjustPosition = clampPreviewAdjustPosition({
    left: event.clientX - frameRect.left - previewAdjustDragState.offsetX,
    top: event.clientY - frameRect.top - previewAdjustDragState.offsetY
  });
  positionPreviewAdjustPanel();
}

function finishPreviewAdjustPanelDrag(event) {
  if (!previewAdjustDragState) {
    return;
  }

  if (event && previewAdjustDragState.pointerId !== event.pointerId) {
    return;
  }

  previewAdjustPanel?.classList.remove("is-dragging");
  previewAdjustPanel?.releasePointerCapture?.(previewAdjustDragState.pointerId);
  previewAdjustDragState = null;
}

function syncPreviewAdjustButtons() {
  previewAdjustToolbarButtons.forEach((button) => {
    const isActive = Boolean(
      currentPreviewAdjustTarget
      && button.dataset.previewAdjustTarget === currentPreviewAdjustTarget
      && previewAdjustPanel
      && !previewAdjustPanel.hidden
    );
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncPreviewAdjustPanel() {
  if (!previewAdjustPanel) {
    return;
  }

  if (!currentPreviewAdjustTarget || !previewAdjustTargets[currentPreviewAdjustTarget]) {
    previewAdjustPanel.hidden = true;
    previewAdjustPanel.style.display = "none";
    previewAdjustPanel.style.left = "";
    previewAdjustPanel.style.top = "";
    previewAdjustPanel.classList.remove("is-dragging");
    syncPreviewAdjustButtons();
    return;
  }

  const config = previewAdjustTargets[currentPreviewAdjustTarget];
  previewAdjustPanel.hidden = false;
  previewAdjustPanel.style.display = "grid";
  if (previewAdjustTitle) {
    previewAdjustTitle.textContent = config.title;
  }
  if (previewAdjustNote) {
    previewAdjustNote.textContent = config.note;
  }

  if (previewAdjustScaleInput) {
    previewAdjustScaleInput.min = String(config.minScale);
    previewAdjustScaleInput.max = String(config.maxScale);
    previewAdjustScaleInput.value = String(state[config.scaleKey]);
  }
  if (previewAdjustOffsetXInput) {
    previewAdjustOffsetXInput.value = String(state[config.offsetXKey]);
  }
  if (previewAdjustOffsetYInput) {
    previewAdjustOffsetYInput.value = String(state[config.offsetYKey]);
  }
  if (previewAdjustScaleValue) {
    previewAdjustScaleValue.textContent = formatRangeValue(state[config.scaleKey], "percent");
  }
  if (previewAdjustOffsetXValue) {
    previewAdjustOffsetXValue.textContent = formatRangeValue(state[config.offsetXKey], "signed");
  }
  if (previewAdjustOffsetYValue) {
    previewAdjustOffsetYValue.textContent = formatRangeValue(state[config.offsetYKey], "signed");
  }

  syncPreviewAdjustButtons();
  requestAnimationFrame(positionPreviewAdjustPanel);
}

function getLabelTextColor(currentState = state) {
  return currentState.labelTextColor || currentState.textColor || defaultState.labelTextColor;
}

function getTextStylePreset(currentState = state) {
  return textStylePresets[normalizeTextStylePreset(currentState.textStylePreset)]
    || textStylePresets[defaultState.textStylePreset];
}

function getCanvasFontFamily(role = "body", currentState = state) {
  const preset = getTextStylePreset(currentState);
  return role === "label"
    ? preset.labelFontFamily || preset.fontFamily
    : preset.fontFamily;
}

function getCanvasFont(size, weight = 700, role = "body", currentState = state) {
  return `${weight} ${size}px ${getCanvasFontFamily(role, currentState)}`;
}

function restoreAvatar(dataUrl) {
  if (!dataUrl) {
    avatarImage = null;
    renderCard();
    return;
  }

  const image = new Image();
  image.onload = () => {
    avatarImage = image;
    renderCard();
  };
  image.src = dataUrl;
}

function restoreBackgroundImage(dataUrl) {
  if (!dataUrl) {
    backgroundImage = null;
    renderCard();
    return;
  }

  const image = new Image();
  image.onload = () => {
    backgroundImage = image;
    renderCard();
  };
  image.src = dataUrl;
}

function restoreBusinessBackgroundImage(side, dataUrl) {
  if (!dataUrl) {
    if (side === "back") {
      backgroundImageBack = null;
    } else {
      backgroundImageFront = null;
    }
    renderCard();
    return;
  }

  const image = new Image();
  image.onload = () => {
    if (side === "back") {
      backgroundImageBack = image;
    } else {
      backgroundImageFront = image;
    }
    renderCard();
  };
  image.src = dataUrl;
}

function getLineQrSource(lineUrl) {
  return `https://quickchart.io/qr?text=${encodeURIComponent(lineUrl)}&size=320&margin=0&ecLevel=M&format=png`;
}

function getQrSource(url) {
  return `https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=320&margin=0&ecLevel=M&format=png`;
}

function ensureQrImage(url) {
  if (!url) {
    return;
  }

  const current = qrImageCache.get(url);
  if (current?.status === "loaded" || current?.status === "loading") {
    return;
  }

  const record = {
    status: "loading",
    image: null
  };
  qrImageCache.set(url, record);

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    const latest = qrImageCache.get(url);
    if (latest !== record) {
      return;
    }
    record.status = "loaded";
    record.image = image;
    renderCard();
  };
  image.onerror = () => {
    const latest = qrImageCache.get(url);
    if (latest !== record) {
      return;
    }
    record.status = "error";
    record.image = null;
    renderCard();
  };
  image.src = getQrSource(url);
}

function getQrImage(url) {
  const record = qrImageCache.get(url);
  return record?.status === "loaded" ? record.image : null;
}

function ensureLineQrImage(lineUrl) {
  if (!lineUrl) {
    lineQrImage = null;
    lineQrRequestKey = "";
    lineQrFailedKey = "";
    return;
  }

  if (lineQrImage && lineQrRequestKey === lineUrl) {
    return;
  }

  if (lineQrRequestKey === lineUrl || lineQrFailedKey === lineUrl) {
    return;
  }

  lineQrImage = null;
  lineQrRequestKey = lineUrl;

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    if (lineQrRequestKey !== lineUrl) {
      return;
    }
    lineQrImage = image;
    lineQrFailedKey = "";
    renderCard();
  };
  image.onerror = () => {
    if (lineQrRequestKey !== lineUrl) {
      return;
    }
    lineQrImage = null;
    lineQrFailedKey = lineUrl;
    renderCard();
  };
  image.src = getLineQrSource(lineUrl);
}

function updateLayoutControls() {
  const isBusiness = state.layoutMode === "business";
  sizePresetSelect.disabled = isBusiness;
  sizePresetNote.textContent = isBusiness
    ? "名刺タイプでは横長の表・裏カードを上下で固定表示します。"
    : "通常カードではサイズを自由に選べます。";
  if (backgroundImageField) {
    backgroundImageField.hidden = !isImageTheme(state.themePreset) || isBusiness;
  }
  if (backgroundImageFrontField) {
    backgroundImageFrontField.hidden = !isImageTheme(state.themePreset) || !isBusiness;
  }
  if (backgroundImageBackField) {
    backgroundImageBackField.hidden = !isImageTheme(state.themePreset) || !isBusiness;
  }
  if (backgroundOpacityControl) {
    backgroundOpacityControl.hidden = !isImageTheme(state.themePreset);
  }
  syncBackgroundOpacityValue();
  syncBusinessBackgroundOpacityValues();
  syncRangeValueOutputs();
  syncPreviewAdjustPanel();
}

function renderCard() {
  const size = getCanvasSize();
  canvas.width = size.width;
  canvas.height = size.height;
  previewSizeLabel.textContent = size.label;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(ctx, canvas.width, canvas.height, state.themePreset, state.accentColor);

  socialOverlayItems = state.layoutMode === "business"
    ? renderBusinessCard()
    : renderStandardCard();
  syncSocialOverlay();
}

function getCanvasSize() {
  if (state.layoutMode === "business") {
    return {
      width: 1200,
      height: 1540,
      label: "名刺タイプ 1200 x 1540"
    };
  }

  const size = sizePresets[state.sizePreset] || sizePresets.portrait;
  return {
    ...size,
    label: `${size.width} x ${size.height}`
  };
}

function renderStandardCard() {
  const safe = {
    x: canvas.width * 0.07,
    y: canvas.height * 0.06,
    w: canvas.width * 0.86,
    h: canvas.height * 0.88
  };

  drawPanel(ctx, safe, state);

  const inner = {
    x: safe.x + canvas.width * 0.038,
    y: safe.y + canvas.width * 0.038,
    w: safe.w - canvas.width * 0.076,
    h: safe.h - canvas.width * 0.076
  };

  const accent = state.accentColor;
  const text = state.textColor;
  const tags = parseTags(state.tags);
  const metaItems = collectMetaItems();
  const oshiItems = collectOshiItems();
  const checklistItems = collectChecklistItems();
  const socialLinks = collectSocialLinks();
  const avatarSize = clamp(inner.w * 0.255, 178, 248);
  const gap = canvas.width * 0.034;
  const avatarBox = {
    x: inner.x,
    y: inner.y,
    size: avatarSize
  };
  const headerRight = {
    x: avatarBox.x + avatarBox.size + gap,
    y: inner.y,
    w: inner.x + inner.w - (avatarBox.x + avatarBox.size + gap),
    h: avatarBox.size
  };

  const focusItems = [
    makeAdjustItem("background", "背景画像", 0, 0, canvas.width, canvas.height, 0),
    makeAdjustItem(
      "avatar",
      "プロフィール画像",
      avatarBox.x - 10,
      avatarBox.y - 10,
      avatarBox.size + 20,
      avatarBox.size + 20,
      Math.round(avatarBox.size * 0.26)
    )
  ];

  drawAvatar(ctx, avatarBox, state, accent, text);
  drawFrameAccent(ctx, safe, inner, state);

  const roleVisible = isPreviewVisible(state.roleVisible);
  const nameVisible = isPreviewVisible(state.displayNameVisible);
  let headerBottom = headerRight.y;

  if (roleVisible) {
    const roleLayout = drawRoleChip(ctx, state.roleLabel, state.role, headerRight.x, headerRight.y, headerRight.w, accent, text);
    headerBottom = roleLayout.bottom;
    focusItems.push(roleLayout.item);
  }

  if (nameVisible) {
    const nameTop = roleVisible ? headerBottom + 16 : headerRight.y;
    const nameLayout = drawNameBlock(ctx, state.displayNameLabel, headerRight.x, nameTop, headerRight.w, state.displayName, text);
    headerBottom = nameLayout.bottom;
    focusItems.push(nameLayout.item);
  }

  const introTop = roleVisible || nameVisible ? headerBottom + 18 : headerRight.y;
  const introLayout = drawIntroBlock(ctx, headerRight.x, introTop, headerRight.w, clampText(state.intro, 180), text);
  const introBottom = introLayout.bottom;
  focusItems.push(introLayout.item);
  const reservedSocialBottom = socialLinks.length
    ? introBottom + clamp(canvas.width * 0.015, 10, 14) + 38
    : introBottom;
  const sectionStart = Math.max(avatarBox.y + avatarBox.size, reservedSocialBottom) + canvas.width * 0.026;
  let sectionBottom = sectionStart - canvas.width * 0.03;
  let metaHotspots = [];
  if (metaItems.length) {
    const qrColumnGap = socialLinks.length ? 14 : 0;
    const qrColumnWidth = socialLinks.length ? clamp(inner.w * 0.15, 104, 120) : 0;
    const metaWidth = socialLinks.length
      ? Math.max(inner.w - qrColumnWidth - qrColumnGap, inner.w * 0.7)
      : inner.w;
    const metaLayout = drawMetaInfo(ctx, metaItems, inner.x, sectionStart, metaWidth, accent, text);
    sectionBottom = metaLayout.bottom;
    metaHotspots = metaLayout.items;
    if (socialLinks.length) {
      const qrLayout = drawStandardSocialQrGrid(
        ctx,
        socialLinks,
        inner.x + metaWidth + qrColumnGap,
        sectionStart + 2,
        qrColumnWidth,
        accent,
        text
      );
      focusItems.push(...qrLayout.items);
      sectionBottom = Math.max(sectionBottom, qrLayout.bottom);
    }
  } else if (socialLinks.length) {
    const qrColumnWidth = clamp(inner.w * 0.15, 104, 120);
    const qrLayout = drawStandardSocialQrGrid(
      ctx,
      socialLinks,
      inner.x + inner.w - qrColumnWidth,
      sectionStart + 2,
      qrColumnWidth,
      accent,
      text
    );
    focusItems.push(...qrLayout.items);
    sectionBottom = Math.max(sectionBottom, qrLayout.bottom);
  }
  focusItems.push(...metaHotspots);

  const tagsTop = sectionBottom + canvas.width * 0.03;
  const tagsLayout = tags.length
    ? drawTags(ctx, tags, inner.x, tagsTop, inner.w, accent, text)
    : { bottom: tagsTop - 8, items: [] };
  const tagsBottom = tagsLayout.bottom;
  focusItems.push(...tagsLayout.items);

  const checklistTop = tagsBottom + canvas.width * 0.026;
  const checklistFieldName = checklistGroups[0]?.items[0]?.key || "checkSameWelcome";
  const checklistLayout = drawChecklistPanel(ctx, checklistItems, inner.x, checklistTop, inner.w, accent, text, checklistFieldName);
  const checklistBottom = checklistLayout.bottom;
  focusItems.push(...checklistLayout.items);

  const footerHeight = canvas.height * 0.065;
  const footerTop = inner.y + inner.h - footerHeight;
  const gridTop = checklistBottom + canvas.width * 0.026;
  const gridBottomGap = canvas.width * 0.03;
  const gridHeight = Math.max(footerTop - gridBottomGap - gridTop, 0);
  const oshiGridLayout = drawOshiItemGrid(ctx, oshiItems, inner.x, gridTop, inner.w, gridHeight, accent, text);
  focusItems.push(...oshiGridLayout.items);
  const footerLayout = drawFooter(ctx, state.footerMessage, inner.x, footerTop, inner.w, footerHeight, accent, text);
  focusItems.push(footerLayout.item);
  return focusItems;
}

function renderBusinessCard() {
  const accent = state.accentColor;
  const text = state.textColor;
  const metaItems = collectMetaItems();
  const oshiItems = collectOshiItems();
  const checklistItems = collectChecklistItems();
  const frontBackgroundImage = isImageTheme(state.themePreset) ? getBusinessSideBackgroundImage("front") : null;
  const backBackgroundImage = isImageTheme(state.themePreset) ? getBusinessSideBackgroundImage("back") : null;
  const cardWidth = canvas.width * 0.87;
  const cardHeight = cardWidth / 1.82;
  const gap = 72;
  const startX = (canvas.width - cardWidth) / 2;
  const startY = (canvas.height - (cardHeight * 2 + gap)) / 2;
  const frontBox = { x: startX, y: startY, w: cardWidth, h: cardHeight };
  const backBox = { x: startX, y: startY + cardHeight + gap, w: cardWidth, h: cardHeight };

  drawBusinessCardShell(ctx, frontBox, accent, state.surfaceColor, state.frameStyle, frontBackgroundImage, "front");
  drawBusinessCardShell(ctx, backBox, accent, state.surfaceColor, state.frameStyle, backBackgroundImage, "back");
  drawBusinessSideMarker(ctx, "表", frontBox.x + 28, frontBox.y + 24, accent, text);
  drawBusinessSideMarker(ctx, "裏", backBox.x + 28, backBox.y + 24, accent, text);
  const frontFocusItems = drawBusinessFront(ctx, frontBox, metaItems, accent, text);
  const backFocusItems = drawBusinessBack(ctx, backBox, oshiItems, checklistItems, accent, text);
  return [
    makeAdjustItem("backgroundFront", "表の背景", frontBox.x, frontBox.y, frontBox.w, frontBox.h, 36),
    makeAdjustItem("backgroundBack", "裏の背景", backBox.x, backBox.y, backBox.w, backBox.h, 36),
    makePreviewMarkerItem("表", frontBox.x + 8, frontBox.y - 42, 58, 28),
    makePreviewMarkerItem("裏", backBox.x + 8, backBox.y - 42, 58, 28),
    ...frontFocusItems,
    ...backFocusItems
  ];
}

function drawBusinessCardShell(context, box, accent, surfaceColor, frameStyle, backgroundImageForSide = null, side = "front") {
  context.save();
  context.shadowColor = "rgba(78, 51, 28, 0.16)";
  context.shadowBlur = 38;
  context.shadowOffsetY = 18;
  context.fillStyle = getRawSurfaceFill(context, box.x, box.y, box.w, box.h, 0.96);
  roundRect(context, box.x, box.y, box.w, box.h, 36);
  context.fill();
  context.restore();

  if (backgroundImageForSide) {
    drawBusinessCardBackgroundImage(context, box, backgroundImageForSide, getBusinessBackgroundTransformState(side));
    drawBusinessBackgroundOverlay(context, box, side);
  }

  context.save();
  context.strokeStyle = hexToRgba("#ffffff", 0.7);
  context.lineWidth = 2;
  roundRect(context, box.x, box.y, box.w, box.h, 36);
  context.stroke();
  context.restore();

  context.save();
  if (frameStyle === "split") {
    context.fillStyle = hexToRgba(accent, 0.88);
    roundRect(context, box.x, box.y, 24, box.h, 24);
    context.fill();
  }

  if (frameStyle === "stamp") {
    context.strokeStyle = hexToRgba(accent, 0.5);
    context.lineWidth = 3;
    context.setLineDash([12, 10]);
    roundRect(context, box.x + 16, box.y + 16, box.w - 32, box.h - 32, 28);
    context.stroke();
    context.setLineDash([]);
  }

  if (frameStyle === "soft") {
    context.fillStyle = getAccentFill(context, box.x, box.y, box.w, box.h, 0.12, 0.2);
    context.beginPath();
    context.arc(box.x + box.w * 0.88, box.y + box.h * 0.18, box.h * 0.14, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function getBusinessSideBackgroundImage(side) {
  if (side === "back") {
    return backgroundImageBack || backgroundImage || null;
  }

  return backgroundImageFront || backgroundImage || null;
}

function drawBusinessCardBackgroundImage(context, box, image, transformState) {
  context.save();
  roundRect(context, box.x, box.y, box.w, box.h, 36);
  context.clip();
  drawImageToBox(context, image, box, {
    fitMode: "contain",
    scalePercent: transformState.scale,
    offsetX: transformState.offsetX,
    offsetY: transformState.offsetY
  });
  context.restore();
}

function drawBusinessBackgroundOverlay(context, box, side) {
  const overlay = getBusinessBackgroundOverlayAlphas(side);
  context.save();
  roundRect(context, box.x, box.y, box.w, box.h, 36);
  context.clip();
  // Keep print-mode image emphasis neutral so the chosen card color does not tint uploaded photos.
  context.fillStyle = createColorGradientRaw(
    context,
    box.x,
    box.y,
    box.w,
    box.h,
    "#ffffff",
    "#ffffff",
    overlay.start,
    overlay.end
  );
  context.fillRect(box.x, box.y, box.w, box.h);
  context.restore();
}

function drawBusinessSideMarker(context, label, x, y, accent, textColor) {
  void context;
  void label;
  void x;
  void y;
  void accent;
  void textColor;
}

function drawBusinessFront(context, box, metaItems, accent, textColor) {
  const inner = {
    x: box.x + 34,
    y: box.y + 54,
    w: box.w - 68,
    h: box.h - 88
  };
  const frontTags = parseTags(state.tags).slice(0, 6);
  const socialLinks = collectSocialLinks();
  const rightColumnWidth = clamp(inner.w * 0.25, 214, 248);
  const leftColumnWidth = inner.w - rightColumnWidth - 28;
  const rightColumnX = inner.x + leftColumnWidth + 28;
  const avatarSize = clamp(rightColumnWidth - 8, 190, 224);
  const avatarBox = {
    x: rightColumnX + Math.max((rightColumnWidth - avatarSize) / 2, 0),
    y: inner.y + 4,
    size: avatarSize
  };
  const contentX = inner.x;
  const contentW = leftColumnWidth;
  const roleVisible = isPreviewVisible(state.roleVisible);
  const nameVisible = isPreviewVisible(state.displayNameVisible);
  const focusItems = [
    makeAdjustItem(
      "avatar",
      "プロフィール画像",
      avatarBox.x - 10,
      avatarBox.y - 10,
      avatarBox.size + 20,
      avatarBox.size + 20,
      Math.round(avatarBox.size * 0.26)
    )
  ];

  drawAvatar(context, avatarBox, state, accent, textColor);

  let cursorY = inner.y + 2;
  if (roleVisible) {
    const roleLayout = drawBusinessRoleChip(context, state.roleLabel, state.role, contentX, cursorY, contentW, accent, textColor);
    cursorY = roleLayout.bottom;
    focusItems.push(roleLayout.item);
  }

  if (nameVisible) {
    const nameTop = roleVisible ? cursorY + 8 : inner.y + 6;
    const nameLayout = drawBusinessNameBlock(context, state.displayNameLabel, contentX, nameTop, contentW, state.displayName, textColor);
    cursorY = nameLayout.bottom;
    focusItems.push(nameLayout.item);
  }

  const introTop = roleVisible || nameVisible ? cursorY + 8 : inner.y + 8;
  const introLayout = drawBusinessIntroBlock(
    context,
    contentX,
    introTop,
    contentW,
    clampText(state.intro, 120),
    textColor,
    3
  );
  const introBottom = introLayout.bottom;
  focusItems.push(introLayout.item);
  const qrItems = drawBusinessSocialQrGrid(
    context,
    socialLinks,
    rightColumnX,
    avatarBox.y + avatarBox.size + 14,
    rightColumnWidth,
    box.y + box.h - 28,
    accent,
    textColor
  );
  focusItems.push(...qrItems);

  let sectionTop = introBottom + 12;
  if (metaItems.length) {
    const metaLayout = drawBusinessMetaChips(context, metaItems, contentX, sectionTop, contentW, accent, textColor);
    sectionTop = metaLayout.bottom + 12;
    focusItems.push(...metaLayout.items);
  }

  const tagsLayout = frontTags.length
    ? drawBusinessCompactTags(
      context,
      frontTags,
      contentX,
      sectionTop,
      contentW,
      accent,
      textColor
    )
    : { bottom: sectionTop, items: [] };
  focusItems.push(...tagsLayout.items);
  return focusItems;
}

function drawBusinessBack(context, box, oshiItems, checklistItems, accent, textColor) {
  const inner = {
    x: box.x + 30,
    y: box.y + 66,
    w: box.w - 60,
    h: box.h - 100
  };

  const footerTop = box.y + box.h - 68;
  const contentTop = inner.y + 6;
  const contentHeight = Math.max(footerTop - contentTop - 12, 180);
  const splitGap = 16;
  const leftWidth = inner.w * 0.54;
  const rightWidth = inner.w - leftWidth - splitGap;
  const focusItems = [];

  const oshiLayout = drawBusinessOshiGrid(context, oshiItems, inner.x, contentTop, leftWidth, contentHeight, accent, textColor);
  focusItems.push(...oshiLayout.items);
  const checklistLayout = drawBusinessChecklistPanel(
    context,
    checklistItems,
    inner.x + leftWidth + splitGap,
    contentTop,
    rightWidth,
    contentHeight,
    accent,
    textColor,
    checklistGroups[0]?.items[0]?.key || "checkSameWelcome"
  );
  focusItems.push(...checklistLayout.items);
  const footerLayout = drawBusinessFooterBand(context, state.footerMessage, inner.x, footerTop, inner.w, 40, accent, textColor);
  focusItems.push(footerLayout.item);
  return focusItems;
}

function drawBusinessRoleChip(context, labelText, text, x, y, maxWidth, accent, textColor) {
  const roleLabel = clampText(labelText || "肩書き", 12);
  const content = clampText(text || "肩書きを入れてみましょう", 30);
  const chipY = y + 20;

  context.fillStyle = hexToRgba(getLabelTextColor(), 0.74);
  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = getCanvasFont(15, 700, "label");
  context.fillText(roleLabel, x, y);

  const fontSize = fitSingleLineFont(context, content, 21, 13, Math.max(maxWidth - 26, 120));
  context.font = getCanvasFont(fontSize, 700, "body");
  const width = Math.min(context.measureText(content).width + 28, maxWidth);
  context.fillStyle = getAccentFill(context, x, chipY, width, 38, 0.92);
  roundRect(context, x, chipY, width, 38, 16);
  context.fill();
  context.fillStyle = pickReadableText(accent, "#ffffff", textColor);
  context.textBaseline = "middle";
  context.fillText(content, x + 14, chipY + 20);
  return {
    bottom: chipY + 38,
    item: makeFocusItem("role", roleLabel, x, y, width, chipY + 38 - y, 16)
  };
}

function drawBusinessNameBlock(context, labelText, x, y, maxWidth, name, textColor) {
  const nameLabel = clampText(labelText || "名前", 12);
  const displayName = clampText(name || "名前・HN・通名", 26);
  const fontSize = fitSingleLineFont(context, displayName, 34, 22, maxWidth);

  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.74);
  context.font = getCanvasFont(14, 700, "label");
  context.fillText(nameLabel, x, y);

  context.fillStyle = textColor;
  context.font = getCanvasFont(fontSize, 700, "body");
  context.fillText(displayName, x, y + 18);
  return {
    bottom: y + 18 + fontSize,
    item: makeFocusItem("displayName", nameLabel, x, y, maxWidth, 18 + fontSize, 18)
  };
}

function drawBusinessIntroBlock(context, x, y, maxWidth, intro, textColor, maxLines) {
  context.fillStyle = hexToRgba(textColor, 0.84);
  context.textAlign = "left";
  context.textBaseline = "top";
  const layout = fitWrappedTextBlock(
    context,
    intro,
    maxWidth,
    68,
    getAdaptiveTextLayout(intro, {
      maxFontSize: 18,
      minFontSize: 13,
      maxLines,
      maxExpandedFontSize: 23,
      longTextThreshold: 42,
      maxExtraLines: 1,
      fontWeight: "500"
    })
  );
  context.font = getCanvasFont(layout.fontSize, 500, "body");
  const lineHeight = layout.lineHeight;
  const lines = layout.lines;
  lines.forEach((line, index) => {
    context.fillText(line, x, y + lineHeight * index);
  });
  const height = lines.length * lineHeight;
  return {
    bottom: y + height,
    item: makeFocusItem("intro", "自己紹介", x, y, maxWidth, height, 18)
  };
}

function drawBusinessMetaChips(context, items, x, y, maxWidth, accent, textColor) {
  const tagHeight = 40;
  const horizontalGap = 10;
  const verticalGap = 10;
  let cursorX = x;
  let cursorY = y;

  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = getCanvasFont(18, 700, "body");
  const hotspotItems = [];

  items.forEach((item) => {
    const label = `${item.label}：`;
    const value = clampText(item.value, 18);
    const width = Math.min(context.measureText(`${label}${value}`).width + 28, maxWidth);

    if (cursorX + width > x + maxWidth) {
      cursorX = x;
      cursorY += tagHeight + verticalGap;
    }

    context.fillStyle = getAccentFill(context, cursorX, cursorY, width, tagHeight, 0.1, 0.16);
    roundRect(context, cursorX, cursorY, width, tagHeight, 999);
    context.fill();

    const textX = cursorX + 14;
    context.fillStyle = hexToRgba(getLabelTextColor(), 0.82);
    context.fillText(label, textX, cursorY + tagHeight / 2 + 1);
    context.fillStyle = textColor;
    context.fillText(value, textX + context.measureText(label).width, cursorY + tagHeight / 2 + 1);
    hotspotItems.push(makeFocusItem(item.fieldName, item.label, cursorX, cursorY, width, tagHeight, 999));
    cursorX += width + horizontalGap;
  });

  return {
    bottom: cursorY + tagHeight,
    items: hotspotItems
  };
}

function drawBusinessCompactTags(context, tags, x, y, maxWidth, accent, textColor) {
  const tagHeight = 38;
  const horizontalGap = 10;
  const verticalGap = 10;
  let cursorX = x;
  let cursorY = y;

  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = getCanvasFont(17, 700, "body");
  const hotspotItems = [];

  tags.forEach((tag) => {
    const label = `#${clampText(tag, 12)}`;
    const width = Math.min(context.measureText(label).width + 28, maxWidth);

    if (cursorX + width > x + maxWidth) {
      cursorX = x;
      cursorY += tagHeight + verticalGap;
    }

    context.fillStyle = getAccentFill(context, cursorX, cursorY, width, tagHeight, 0.14, 0.22);
    roundRect(context, cursorX, cursorY, width, tagHeight, 999);
    context.fill();

    context.fillStyle = textColor;
    context.fillText(label, cursorX + 14, cursorY + tagHeight / 2 + 1);
    hotspotItems.push(makeFocusItem("tags", "タグ", cursorX, cursorY, width, tagHeight, 999));
    cursorX += width + horizontalGap;
  });

  return {
    bottom: cursorY + tagHeight,
    items: hotspotItems
  };
}

function drawBusinessAddressList(context, links, x, y, width, maxY, accent, textColor) {
  if (!links.length) {
    return [];
  }

  const items = [];
  let cursorY = y;
  const labelFontSize = 12;
  const rowHeight = 28;
  const bottomLimit = maxY - 12;

  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.76);
  context.font = getCanvasFont(13, 700, "label");
  context.fillText("SNS", x, cursorY);
  cursorY += 20;

  links.forEach((link) => {
    if (cursorY + rowHeight > bottomLimit) {
      return;
    }

    context.font = getCanvasFont(labelFontSize, 800, "body");
    const pillWidth = clamp(context.measureText(link.short).width + 20, 40, 58);
    const pillHeight = 22;
    const pillY = cursorY + 2;
    const addressX = x + pillWidth + 10;
    const addressWidth = Math.max(width - pillWidth - 10, 82);
    const addressText = formatSocialAddress(link.url, Math.max(Math.floor(addressWidth / 7.2), 16));
    const addressFontSize = fitSingleLineFont(context, addressText, 13, 10, addressWidth);

    context.fillStyle = getAccentFill(context, x, pillY, pillWidth, pillHeight, 0.84, 0.92);
    roundRect(context, x, pillY, pillWidth, pillHeight, 999);
    context.fill();

    context.fillStyle = pickReadableText(accent, "#ffffff", textColor);
    context.textBaseline = "middle";
    context.font = getCanvasFont(labelFontSize, 800, "body");
    context.fillText(link.short, x + 10, pillY + pillHeight / 2 + 0.5);

    context.textBaseline = "top";
    context.fillStyle = textColor;
    context.font = getCanvasFont(addressFontSize, 600, "body");
    context.fillText(addressText, addressX, cursorY + 4);

    items.push(makeFocusItem(link.fieldName, link.label, x, cursorY, width, rowHeight, 14));
    cursorY += rowHeight + 4;
  });

  return items;
}

function drawBusinessSocialQrGrid(context, links, x, y, width, maxY, accent, textColor) {
  void textColor;
  if (!links.length) {
    return [];
  }

  const visibleLinks = links.slice(0, 4);
  const columns = 2;
  const rows = Math.ceil(visibleLinks.length / columns);
  const labelHeight = 12;
  const gap = 10;
  let tileSize = Math.floor((width - gap) / columns);
  tileSize = clamp(tileSize, 52, 84);
  const totalHeight = rows * (labelHeight + tileSize) + Math.max(rows - 1, 0) * gap;

  if (y + totalHeight > maxY) {
    const availableHeight = Math.max(maxY - y - Math.max(rows - 1, 0) * gap, rows * (labelHeight + 40));
    tileSize = clamp(Math.floor((availableHeight / rows) - labelHeight), 40, tileSize);
  }

  const items = [];

  visibleLinks.forEach((link, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const rowItemCount = Math.min(columns, visibleLinks.length - row * columns);
    const rowWidth = rowItemCount * tileSize + Math.max(rowItemCount - 1, 0) * gap;
    const rowStartX = x + Math.max((width - rowWidth) / 2, 0);
    const tileX = rowStartX + col * (tileSize + gap);
    const labelY = y + row * (labelHeight + tileSize + gap);
    const tileY = labelY + labelHeight;

    drawQrTile(context, link, tileX, tileY, tileSize, accent, getSocialQrLabel(link));
    items.push(makeExternalLinkItem(link.url, link.label, tileX, labelY, tileSize, labelHeight + tileSize, 14));
  });

  return items;
}

function drawBusinessLineQrBlock(context, lineUrl, x, y, width, maxY, accent, textColor) {
  const blockTop = y;
  const availableHeight = maxY - blockTop - 6;
  if (availableHeight < 74) {
    return null;
  }

  const label = "LINE QR";
  const qrSize = clamp(Math.min(availableHeight - 24, 118), 78, 118);
  const qrY = blockTop + 22;
  const qrX = x;
  const infoX = qrX + qrSize + 16;
  const infoWidth = Math.max(width - qrSize - 16, 110);
  const placeholderText = "LINE URLを入力するとQRが表示されます";
  const subtitleText = lineUrl ? "QRからつながれます" : placeholderText;
  const addressText = lineUrl ? formatSocialAddress(lineUrl, Math.max(Math.floor(infoWidth / 6.2), 18)) : "";
  const totalHeight = qrSize + 22;

  if (blockTop + totalHeight > maxY) {
    return null;
  }

  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.76);
  context.font = getCanvasFont(13, 700, "label");
  context.fillText(label, x, blockTop);

  context.fillStyle = getAccentFill(context, qrX, qrY, qrSize, qrSize, 0.12, 0.2);
  roundRect(context, qrX, qrY, qrSize, qrSize, 22);
  context.fill();

  context.strokeStyle = hexToRgba(accent, 0.32);
  context.lineWidth = 2;
  roundRect(context, qrX, qrY, qrSize, qrSize, 22);
  context.stroke();

  if (lineUrl) {
    ensureLineQrImage(lineUrl);
  }

  if (lineUrl && lineQrImage && lineQrRequestKey === lineUrl) {
    const inset = 8;
    context.save();
    roundRect(context, qrX + inset, qrY + inset, qrSize - inset * 2, qrSize - inset * 2, 16);
    context.clip();
    context.drawImage(lineQrImage, qrX + inset, qrY + inset, qrSize - inset * 2, qrSize - inset * 2);
    context.restore();
  } else {
    context.fillStyle = hexToRgba("#ffffff", 0.78);
    roundRect(context, qrX + 8, qrY + 8, qrSize - 16, qrSize - 16, 16);
    context.fill();
    context.fillStyle = hexToRgba(accent, 0.82);
    context.font = getCanvasFont(clamp(Math.floor(qrSize * 0.15), 13, 18), 800, "body");
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("LINE", qrX + qrSize / 2, qrY + qrSize / 2 - 4);
    context.font = getCanvasFont(clamp(Math.floor(qrSize * 0.1), 10, 12), 700, "label");
    context.fillText(lineUrl ? "loading" : "ready", qrX + qrSize / 2, qrY + qrSize / 2 + 16);
    context.textAlign = "left";
    context.textBaseline = "top";
  }

  context.fillStyle = textColor;
  context.font = getCanvasFont(18, 800, "body");
  context.fillText("LINE", infoX, qrY + 6);

  context.fillStyle = hexToRgba(textColor, 0.82);
  const subtitleLayout = fitWrappedTextBlock(
    context,
    subtitleText,
    infoWidth,
    qrSize * 0.42,
    {
      maxFontSize: 14,
      minFontSize: 11,
      maxLines: 3,
      maxExpandedFontSize: 16,
      longTextThreshold: 24,
      maxExtraLines: 1,
      fontWeight: "500"
    }
  );
  context.font = getCanvasFont(subtitleLayout.fontSize, 500, "body");
  subtitleLayout.lines.forEach((line, index) => {
    context.fillText(line, infoX, qrY + 34 + subtitleLayout.lineHeight * index);
  });

  if (addressText) {
    const addressTop = qrY + 34 + subtitleLayout.lines.length * subtitleLayout.lineHeight + 10;
    context.fillStyle = textColor;
    context.font = getCanvasFont(fitSingleLineFont(context, addressText, 13, 10, infoWidth), 600, "body");
    context.fillText(addressText, infoX, addressTop);
  }

  return makeFocusItem("socialLine", "LINE", x, blockTop, width, totalHeight, 20);
}

function drawBusinessSocialTileGrid(context, links, x, y, width, height, accent, textColor) {
  if (!links.length) {
    return [];
  }

  const columns = 3;
  const gap = 8;
  const tileSize = Math.min(Math.floor((width - gap * (columns - 1)) / columns), 44);
  const rows = Math.ceil(Math.min(links.length, 6) / columns);
  const gridHeight = rows * tileSize + Math.max(rows - 1, 0) * gap;
  const startY = y + Math.max((height - gridHeight) / 2, 0);
  const items = [];

  context.textAlign = "center";
  context.textBaseline = "middle";

  links.slice(0, 6).forEach((link, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const tileX = x + col * (tileSize + gap);
    const tileY = startY + row * (tileSize + gap);

    context.fillStyle = link.color;
    roundRect(context, tileX, tileY, tileSize, tileSize, Math.round(tileSize * 0.28));
    context.fill();

    context.strokeStyle = hexToRgba("#ffffff", 0.66);
    context.lineWidth = 1.4;
    roundRect(context, tileX, tileY, tileSize, tileSize, Math.round(tileSize * 0.28));
    context.stroke();

    context.fillStyle = link.textColor;
    context.font = getCanvasFont(Math.max(Math.floor(tileSize * 0.26), 11), 800, "body");
    context.fillText(link.short, tileX + tileSize / 2, tileY + tileSize / 2 + 1);

    items.push(makeFocusItem(link.key, link.label, tileX, tileY, tileSize, tileSize, Math.round(tileSize * 0.28)));
  });

  return items;
}

function drawBusinessOshiGrid(context, items, x, y, width, height, accent, textColor) {
  const gap = 12;
  const columns = 2;
  const rows = 2;
  const cardWidth = (width - gap) / columns;
  const cardHeight = (height - gap) / rows;
  const hotspotItems = [];

  items.slice(0, 4).forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const boxX = x + col * (cardWidth + gap);
    const boxY = y + row * (cardHeight + gap);

    context.fillStyle = getAccentFill(context, boxX, boxY, cardWidth, cardHeight, 0.08, 0.14);
    roundRect(context, boxX, boxY, cardWidth, cardHeight, 22);
    context.fill();

    context.strokeStyle = hexToRgba(accent, 0.18);
    context.lineWidth = 2;
    roundRect(context, boxX, boxY, cardWidth, cardHeight, 22);
    context.stroke();

    const horizontalPadding = 16;
    const textWidth = cardWidth - horizontalPadding * 2;
    const titleText = clampText(item.label || "項目", 14);
    const titleFontSize = fitSingleLineFont(
      context,
      titleText,
      clamp(Math.floor(cardHeight * 0.17), 13, 15),
      10,
      textWidth
    );

    context.fillStyle = hexToRgba(getLabelTextColor(), 0.74);
    context.textAlign = "left";
    context.textBaseline = "top";
    context.font = getCanvasFont(titleFontSize, 700, "label");
    const titleTop = boxY + clamp(cardHeight * 0.11, 12, 15);
    context.fillText(titleText, boxX + horizontalPadding, titleTop);

    const bodyTop = titleTop + titleFontSize + clamp(cardHeight * 0.08, 6, 9);
    const availableBodyHeight = Math.max(boxY + cardHeight - clamp(cardHeight * 0.12, 10, 14) - bodyTop, 14);
    const bodyText = clampText(item.value || "", 48) || "未入力";
    const bodyLayout = fitWrappedTextBlock(
      context,
      bodyText,
      textWidth,
      availableBodyHeight,
      getAdaptiveTextLayout(bodyText, {
        maxFontSize: clamp(Math.floor(cardHeight * 0.23), 17, 22),
        minFontSize: 13,
        maxLines: 4,
        maxExpandedFontSize: clamp(Math.floor(cardHeight * 0.3), 22, 28),
        longTextThreshold: 40
      })
    );

    context.fillStyle = textColor;
    context.font = getCanvasFont(bodyLayout.fontSize, 600, "body");
    bodyLayout.lines.forEach((line, lineIndex) => {
      context.fillText(line, boxX + horizontalPadding, bodyTop + lineIndex * bodyLayout.lineHeight);
    });

    if (item.fieldName) {
      hotspotItems.push(makeFocusItem(item.fieldName, item.label || "項目", boxX, boxY, cardWidth, cardHeight, 22));
    }
  });

  return {
    items: hotspotItems
  };
}

function drawBusinessChecklistPanel(context, groups, x, y, width, height, accent, textColor, focusFieldName = "checkSameWelcome") {
  const paddingX = 14;
  const paddingTop = 14;
  const badgeHeight = 28;
  const horizontalGap = 8;
  const verticalGap = 8;
  const maxY = y + height - 16;
  let cursorY = y + paddingTop + 24;
  let truncated = false;

  context.fillStyle = getAccentFill(context, x, y, width, height, 0.08, 0.14);
  roundRect(context, x, y, width, height, 22);
  context.fill();

  context.strokeStyle = hexToRgba(accent, 0.18);
  context.lineWidth = 2;
  roundRect(context, x, y, width, height, 22);
  context.stroke();

  context.textAlign = "left";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
  context.textBaseline = "top";
  context.font = getCanvasFont(17, 700, "label");
  context.fillText("チェック", x + paddingX, y + paddingTop);

  if (!groups.length) {
    context.fillStyle = hexToRgba(textColor, 0.72);
    context.font = getCanvasFont(14, 500, "body");
    context.fillText("チェックした項目がここに並びます。", x + paddingX, y + paddingTop + 26);
    return {
      items: [makeFocusItem(focusFieldName, "チェックリスト", x, y, width, height, 22)]
    };
  }

  for (const group of groups) {
    if (cursorY + 18 > maxY) {
      truncated = true;
      break;
    }

    context.fillStyle = hexToRgba(getLabelTextColor(), 0.76);
    context.font = getCanvasFont(14, 700, "label");
    context.fillText(group.title, x + paddingX, cursorY);
    cursorY += 22;

    let cursorX = x + paddingX;
    let badgeY = cursorY;

    for (const label of group.items) {
      const badgeWidth = Math.min(context.measureText(label).width + 18, width - paddingX * 2);
      if (cursorX + badgeWidth > x + width - paddingX) {
        cursorX = x + paddingX;
        badgeY += badgeHeight + verticalGap;
      }

      if (badgeY + badgeHeight > maxY) {
        truncated = true;
        break;
      }

      context.fillStyle = hexToRgba(accent, 0.14);
      roundRect(context, cursorX, badgeY, badgeWidth, badgeHeight, 999);
      context.fill();

      context.fillStyle = textColor;
      context.textBaseline = "middle";
      context.font = getCanvasFont(14, 700, "body");
      context.fillText(label, cursorX + 9, badgeY + badgeHeight / 2 + 1);
      context.textBaseline = "top";

      cursorX += badgeWidth + horizontalGap;
    }

    cursorY = badgeY + badgeHeight + 10;
    if (truncated) {
      break;
    }
  }

  if (truncated) {
    context.fillStyle = hexToRgba(textColor, 0.58);
    context.font = getCanvasFont(14, 700, "label");
    context.fillText("...", x + width - 28, maxY - 18);
  }

  return {
    items: [makeFocusItem(focusFieldName, "チェックリスト", x, y, width, height, 22)]
  };
}

function drawBusinessFooterBand(context, footerMessage, x, y, width, height, accent, textColor) {
  const content = clampText(footerMessage || "ここにひとことを入れましょう", 44);
  const fontSize = fitSingleLineFont(context, content, 18, 12, Math.max(width - 32, 120));

  context.fillStyle = getAccentFill(context, x, y, width, height, 0.12, 0.22);
  roundRect(context, x, y, width, height, 999);
  context.fill();

  context.fillStyle = textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = getCanvasFont(fontSize, 700, "body");
  context.fillText(content, x + width / 2, y + height / 2 + 1);
  return {
    item: makeFocusItem("footerMessage", "ひとこと", x, y, width, height, 999)
  };
}

function drawBackground(context, width, height, themePreset, accentColor) {
  if (isImageTheme(themePreset) && backgroundImage) {
    drawImageToBox(
      context,
      backgroundImage,
      { x: 0, y: 0, w: width, h: height },
      {
        fitMode: "cover",
        ...getBusinessBackgroundTransformState("front")
      }
    );
    return;
  }

  const palette = themePalettes[themePreset] || themePalettes.sunrise;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.top);
  gradient.addColorStop(1, palette.bottom);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = hexToRgba(accentColor || palette.glow, 0.18);
  context.beginPath();
  context.arc(width * 0.18, height * 0.12, width * 0.14, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = hexToRgba(palette.glow, 0.12);
  context.beginPath();
  context.arc(width * 0.88, height * 0.84, width * 0.21, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = hexToRgba("#ffffff", 0.36);
  context.lineWidth = Math.max(width * 0.0044, 3);
  for (let i = 0; i < 5; i += 1) {
    context.beginPath();
    context.moveTo(width * (0.04 + i * 0.08), height * 0.86);
    context.quadraticCurveTo(width * (0.28 + i * 0.08), height * 0.72, width * (0.52 + i * 0.08), height * 0.89);
    context.stroke();
  }
}

function drawPanel(context, safe, currentState) {
  const radius = safe.w * 0.05;
  context.save();
  context.shadowColor = "rgba(78, 51, 28, 0.17)";
  context.shadowBlur = 44;
  context.shadowOffsetY = 24;
  context.fillStyle = getSurfaceFill(context, safe.x, safe.y, safe.w, safe.h, 0.94);
  roundRect(context, safe.x, safe.y, safe.w, safe.h, radius);
  context.fill();
  context.restore();

  context.save();
  context.lineWidth = 2;
  context.strokeStyle = hexToRgba("#ffffff", 0.56);
  roundRect(context, safe.x, safe.y, safe.w, safe.h, radius);
  context.stroke();
  context.restore();
}

function drawFrameAccent(context, safe, inner, currentState) {
  const accent = currentState.accentColor;
  context.save();

  if (currentState.frameStyle === "split") {
    context.fillStyle = hexToRgba(accent, 0.88);
    roundRect(context, safe.x, safe.y, safe.w * 0.11, safe.h, safe.w * 0.05);
    context.fill();
  }

  if (currentState.frameStyle === "stamp") {
    context.strokeStyle = hexToRgba(accent, 0.52);
    context.lineWidth = 4;
    context.setLineDash([14, 12]);
    roundRect(context, inner.x, inner.y, inner.w, inner.h, safe.w * 0.038);
    context.stroke();
    context.setLineDash([]);
  }

  if (currentState.frameStyle === "soft") {
    context.fillStyle = getAccentFill(context, safe.x, safe.y, safe.w, safe.h, 0.14, 0.22);
    context.beginPath();
    context.arc(safe.x + safe.w * 0.87, safe.y + safe.h * 0.12, safe.w * 0.095, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawAvatar(context, avatarBox, currentState, accent, textColor) {
  const avatarTransform = getAvatarTransformState(currentState);
  context.save();
  context.fillStyle = getAccentFill(context, avatarBox.x - 10, avatarBox.y - 10, avatarBox.size + 20, avatarBox.size + 20, 0.14, 0.24);
  roundRect(context, avatarBox.x - 10, avatarBox.y - 10, avatarBox.size + 20, avatarBox.size + 20, avatarBox.size * 0.26);
  context.fill();

  beginAvatarPath(context, avatarBox.x, avatarBox.y, avatarBox.size, currentState.avatarShape);
  context.clip();

  if (avatarImage) {
    drawImageToBox(context, avatarImage, {
      x: avatarBox.x,
      y: avatarBox.y,
      w: avatarBox.size,
      h: avatarBox.size
    }, {
      fitMode: "cover",
      scalePercent: avatarTransform.scale,
      offsetX: avatarTransform.offsetX,
      offsetY: avatarTransform.offsetY
    });
  } else {
    const gradient = context.createLinearGradient(avatarBox.x, avatarBox.y, avatarBox.x + avatarBox.size, avatarBox.y + avatarBox.size);
    gradient.addColorStop(0, hexToRgba(currentState.accentColor, 0.94));
    gradient.addColorStop(1, hexToRgba(currentState.accentColorEnd || currentState.accentColor, 0.94));
    context.fillStyle = gradient;
    context.fillRect(avatarBox.x, avatarBox.y, avatarBox.size, avatarBox.size);

    context.fillStyle = hexToRgba("#ffffff", 0.92);
    context.font = getCanvasFont(Math.floor(avatarBox.size * 0.32), 700, "body");
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(getInitials(currentState.displayName), avatarBox.x + avatarBox.size / 2, avatarBox.y + avatarBox.size / 2 + 4);
  }

  context.restore();

  context.save();
  context.strokeStyle = hexToRgba(textColor, 0.08);
  context.lineWidth = 3;
  beginAvatarPath(context, avatarBox.x, avatarBox.y, avatarBox.size, currentState.avatarShape);
  context.stroke();
  context.restore();
}

function drawRoleChip(context, labelText, text, x, y, maxWidth, accent, textColor) {
  const roleLabel = clampText(labelText || "肩書き", 12);
  const content = clampText(text || "肩書きを入れてみましょう", 48);
  const chipY = y + 28;
  const chipHeight = 56;

  context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = getCanvasFont(20, 700, "label");
  context.fillText(roleLabel, x, y);

  const fontSize = fitSingleLineFont(context, content, 28, 18, Math.max(maxWidth - 40, 120));
  context.font = getCanvasFont(fontSize, 700, "body");
  const width = Math.min(context.measureText(content).width + 42, maxWidth);
  context.fillStyle = getAccentFill(context, x, chipY, width, 56, 0.92);
  roundRect(context, x, chipY, width, chipHeight, 20);
  context.fill();
  context.fillStyle = pickReadableText(accent, "#ffffff", textColor);
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText(content, x + 20, chipY + 29);
  return {
    bottom: chipY + chipHeight,
    item: makeFocusItem("role", roleLabel, x, y, width, chipY + chipHeight - y, 20)
  };
}

function isPreviewVisible(value) {
  return value !== "hide";
}

function drawNameBlock(context, labelText, x, y, maxWidth, name, textColor) {
  context.fillStyle = textColor;
  context.textAlign = "left";
  context.textBaseline = "top";

  const nameLabel = clampText(labelText || "名前", 12);
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
  context.font = getCanvasFont(18, 700, "label");
  context.fillText(nameLabel, x, y);

  const displayName = clampText(name || "名前・HN・通名", 40);
  const fontSize = fitSingleLineFont(context, displayName, Math.min(58, maxWidth * 0.09), 32, maxWidth);
  context.fillStyle = textColor;
  context.font = getCanvasFont(fontSize, 700, "body");
  context.fillText(displayName, x, y + 24);

  const height = 24 + fontSize;
  return {
    bottom: y + height,
    item: makeFocusItem("displayName", nameLabel, x, y, maxWidth, height, 18)
  };
}

function drawIntroBlock(context, x, y, maxWidth, intro, textColor) {
  context.fillStyle = hexToRgba(textColor, 0.84);
  const layout = fitWrappedTextBlock(
    context,
    intro,
    maxWidth,
    88,
    getAdaptiveTextLayout(intro, {
      maxFontSize: 22,
      minFontSize: 15,
      maxLines: 4,
      maxExpandedFontSize: 28,
      longTextThreshold: 44,
      maxExtraLines: 1,
      fontWeight: "500"
    })
  );
  context.font = getCanvasFont(layout.fontSize, 500, "body");
  const lineHeight = layout.lineHeight;
  const lines = layout.lines;
  lines.forEach((line, index) => {
    context.fillText(line, x, y + lineHeight * index);
  });
  const height = lines.length * lineHeight;
  return {
    bottom: y + height,
    item: makeFocusItem("intro", "自己紹介", x, y, maxWidth, height, 18)
  };
}

function drawSocialLinks(context, links, x, y, maxWidth, options = {}) {
  if (!links.length) {
    return { bottom: y, items: [] };
  }

  const size = options.size || 38;
  const gap = options.gap || 10;
  const fontSize = options.fontSize || 12;
  let cursorX = x;
  let cursorY = y;
  const items = [];

  context.textAlign = "center";
  context.textBaseline = "middle";

  links.forEach((link) => {
    if (cursorX + size > x + maxWidth) {
      cursorX = x;
      cursorY += size + gap;
    }

    context.fillStyle = link.color;
    roundRect(context, cursorX, cursorY, size, size, Math.round(size * 0.4));
    context.fill();

    context.strokeStyle = "rgba(255, 255, 255, 0.68)";
    context.lineWidth = 1.4;
    roundRect(context, cursorX, cursorY, size, size, Math.round(size * 0.4));
    context.stroke();

    context.fillStyle = link.textColor;
    context.font = getCanvasFont(fontSize, 800, "body");
    context.fillText(link.short, cursorX + size / 2, cursorY + size / 2 + 1);

    items.push(makeFocusItem(link.key, link.label, cursorX, cursorY, size, size, Math.round(size * 0.4)));

    cursorX += size + gap;
  });

  return {
    bottom: cursorY + size,
    items
  };
}

function drawStandardSocialQrGrid(context, links, x, y, width, accent, textColor) {
  void textColor;
  if (!links.length) {
    return { bottom: y, items: [] };
  }

  const visibleLinks = links.slice(0, 4);
  const columns = 2;
  const rows = Math.ceil(visibleLinks.length / columns);
  const labelHeight = 12;
  const gap = 8;
  const tileSize = clamp(Math.floor((width - gap) / columns), 44, 54);
  const items = [];

  visibleLinks.forEach((link, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const labelY = y + row * (labelHeight + tileSize + gap);
    const rowItemCount = Math.min(columns, visibleLinks.length - row * columns);
    const rowWidth = rowItemCount * tileSize + Math.max(rowItemCount - 1, 0) * gap;
    const rowStartX = x + Math.max((width - rowWidth) / 2, 0);
    const tileX = rowStartX + col * (tileSize + gap);
    const tileY = labelY + labelHeight;

    drawQrTile(context, link, tileX, tileY, tileSize, accent, getSocialQrLabel(link));
    items.push(makeExternalLinkItem(link.url, link.label, tileX, labelY, tileSize, labelHeight + tileSize, 12));
  });

  return {
    bottom: y + rows * (labelHeight + tileSize) + Math.max(rows - 1, 0) * gap,
    items
  };
}

function drawStandardLineQrBlock(context, lineUrl, x, y, width, accent, textColor) {
  if (!lineUrl) {
    return { bottom: y, item: null };
  }

  ensureLineQrImage(lineUrl);

  const label = "LINE QR";
  const labelFontSize = 10;
  const labelHeight = 14;
  const qrSize = clamp(Math.round(width * 0.52), 52, 74);
  const blockWidth = Math.max(qrSize, width);
  const qrX = x + Math.max((width - qrSize) / 2, 0);
  const qrY = y + labelHeight;

  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
  context.font = getCanvasFont(labelFontSize, 700, "label");
  const labelX = x + Math.max((blockWidth - context.measureText(label).width) / 2, 0);
  context.fillText(label, labelX, y);

  context.fillStyle = getAccentFill(context, qrX, qrY, qrSize, qrSize, 0.12, 0.2);
  roundRect(context, qrX, qrY, qrSize, qrSize, 14);
  context.fill();

  context.strokeStyle = hexToRgba(accent, 0.26);
  context.lineWidth = 2;
  roundRect(context, qrX, qrY, qrSize, qrSize, 14);
  context.stroke();

  if (lineQrImage && lineQrRequestKey === lineUrl) {
    const inset = 5;
    context.save();
    roundRect(context, qrX + inset, qrY + inset, qrSize - inset * 2, qrSize - inset * 2, 10);
    context.clip();
    context.drawImage(lineQrImage, qrX + inset, qrY + inset, qrSize - inset * 2, qrSize - inset * 2);
    context.restore();
  } else {
    context.fillStyle = hexToRgba("#ffffff", 0.84);
    roundRect(context, qrX + 5, qrY + 5, qrSize - 10, qrSize - 10, 10);
    context.fill();
    context.fillStyle = hexToRgba(accent, 0.82);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = getCanvasFont(clamp(Math.floor(qrSize * 0.14), 9, 12), 800, "body");
    context.fillText("LINE", qrX + qrSize / 2, qrY + qrSize / 2 - 4);
    context.font = getCanvasFont(clamp(Math.floor(qrSize * 0.08), 7, 9), 700, "label");
    context.fillText("loading", qrX + qrSize / 2, qrY + qrSize / 2 + 8);
  }

  return {
    bottom: qrY + qrSize + 6,
    item: makeFocusItem("socialLine", "LINE", x, y, width, qrY + qrSize + 6 - y, 14)
  };
}

function drawQrTile(context, link, x, y, size, accent, labelText) {
  ensureQrImage(link.url);
  const qrImage = getQrImage(link.url);
  const label = clampText(labelText || "QR", 12);
  const labelFontSize = fitSingleLineFont(
    context,
    label,
    clamp(Math.floor(size * 0.24), 9, 12),
    7,
    Math.max(size - 6, 32)
  );

  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = hexToRgba(getLabelTextColor(), 0.76);
  context.font = getCanvasFont(labelFontSize, 700, "label");
  context.fillText(label, x + size / 2, y - labelFontSize - 2);

  context.fillStyle = getAccentFill(context, x, y, size, size, 0.12, 0.2);
  roundRect(context, x, y, size, size, 12);
  context.fill();

  context.strokeStyle = hexToRgba(accent, 0.26);
  context.lineWidth = 1.6;
  roundRect(context, x, y, size, size, 12);
  context.stroke();

  if (qrImage) {
    const inset = 4;
    context.save();
    roundRect(context, x + inset, y + inset, size - inset * 2, size - inset * 2, 8);
    context.clip();
    context.drawImage(qrImage, x + inset, y + inset, size - inset * 2, size - inset * 2);
    context.restore();
  } else {
    context.fillStyle = hexToRgba("#ffffff", 0.84);
    roundRect(context, x + 4, y + 4, size - 8, size - 8, 8);
    context.fill();
    context.fillStyle = hexToRgba(accent, 0.82);
    context.textBaseline = "middle";
    context.font = getCanvasFont(clamp(Math.floor(size * 0.18), 9, 12), 800, "body");
    context.fillText("QR", x + size / 2, y + size / 2 - 4);
  }
}

function drawMetaInfo(context, items, x, y, maxWidth, accent, textColor) {
  const tagHeight = 52;
  const horizontalGap = 12;
  const verticalGap = 12;
  let cursorX = x;
  let cursorY = y;

  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = getCanvasFont(22, 700, "body");

  const hotspotItems = [];

  items.forEach((item) => {
    const label = `${item.label}：`;
    const value = String(item.value || "").trim();
    const width = Math.min(context.measureText(`${label}${value}`).width + 30, maxWidth);

    if (cursorX + width > x + maxWidth) {
      cursorX = x;
      cursorY += tagHeight + verticalGap;
    }

    context.fillStyle = getAccentFill(context, cursorX, cursorY, width, tagHeight, 0.1, 0.16);
    roundRect(context, cursorX, cursorY, width, tagHeight, 18);
    context.fill();

    const textX = cursorX + 15;
    context.fillStyle = hexToRgba(getLabelTextColor(), 0.84);
    context.fillText(label, textX, cursorY + tagHeight / 2 + 1);
    context.fillStyle = textColor;
    context.fillText(value, textX + context.measureText(label).width, cursorY + tagHeight / 2 + 1);

    hotspotItems.push({
      type: "focus",
      fieldName: item.fieldName,
      label: item.label,
      x: cursorX,
      y: cursorY,
      width,
      height: tagHeight,
      radius: 18
    });

    cursorX += width + horizontalGap;
  });

  return {
    bottom: cursorY + tagHeight,
    items: hotspotItems
  };
}

function drawTags(context, tags, x, y, maxWidth, accent, textColor) {
  const tagHeight = 54;
  const horizontalGap = 12;
  const verticalGap = 12;
  let cursorX = x;
  let cursorY = y;

  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = getCanvasFont(24, 700, "body");
  const hotspotItems = [];

  tags.slice(0, 8).forEach((tag) => {
    const label = `#${tag}`;
    const width = context.measureText(label).width + 30;

    if (cursorX + width > x + maxWidth) {
      cursorX = x;
      cursorY += tagHeight + verticalGap;
    }

    context.fillStyle = getAccentFill(context, cursorX, cursorY, width, tagHeight, 0.14, 0.22);
    roundRect(context, cursorX, cursorY, width, tagHeight, 999);
    context.fill();

    context.fillStyle = textColor;
    context.fillText(label, cursorX + 16, cursorY + tagHeight / 2 + 1);

    hotspotItems.push(makeFocusItem("tags", "タグ", cursorX, cursorY, width, tagHeight, 999));
    cursorX += width + horizontalGap;
  });

  return {
    bottom: cursorY + tagHeight,
    items: hotspotItems
  };
}

function drawChecklistPanel(context, groups, x, y, maxWidth, accent, textColor, focusFieldName = "checkSameWelcome") {
  const paddingX = 20;
  const paddingTop = 18;
  const badgeHeight = 42;
  const horizontalGap = 10;
  const verticalGap = 10;
  const preparedGroups = groups.filter((group) => group.items.length);
  const sectionLayouts = [];
  let cursorY = y + paddingTop + 34;

  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = getCanvasFont(18, 700, "body");

  preparedGroups.forEach((group) => {
    const badges = [];
    let cursorX = x + paddingX;
    const headingY = cursorY;
    let badgeY = headingY + 28;

    group.items.forEach((label) => {
      const badgeWidth = Math.min(context.measureText(label).width + 24, maxWidth - paddingX * 2);
      if (cursorX + badgeWidth > x + maxWidth - paddingX) {
        cursorX = x + paddingX;
        badgeY += badgeHeight + verticalGap;
      }

      badges.push({ label, x: cursorX, y: badgeY, width: badgeWidth });
      cursorX += badgeWidth + horizontalGap;
    });

    sectionLayouts.push({ title: group.title, headingY, badges });
    cursorY = badges.length
      ? badges[badges.length - 1].y + badgeHeight + 18
      : headingY + 30;
  });

  const panelHeight = preparedGroups.length ? cursorY - y + 2 : 112;

  context.fillStyle = getAccentFill(context, x, y, maxWidth, panelHeight, 0.08, 0.14);
  roundRect(context, x, y, maxWidth, panelHeight, 24);
  context.fill();

  context.strokeStyle = hexToRgba(accent, 0.18);
  context.lineWidth = 2;
  roundRect(context, x, y, maxWidth, panelHeight, 24);
  context.stroke();

  context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
  context.textBaseline = "top";
  context.font = getCanvasFont(22, 700, "label");
  context.fillText("チェックリスト", x + paddingX, y + paddingTop);

  if (!preparedGroups.length) {
    context.fillStyle = hexToRgba(textColor, 0.72);
    context.font = getCanvasFont(18, 500, "body");
    context.fillText("当てはまる項目を選ぶと、ここに表示されます。", x + paddingX, y + paddingTop + 38);
    return {
      bottom: y + panelHeight,
      items: [makeFocusItem(focusFieldName, "チェックリスト", x, y, maxWidth, panelHeight, 24)]
    };
  }

  sectionLayouts.forEach((group) => {
    context.fillStyle = hexToRgba(getLabelTextColor(), 0.76);
    context.textBaseline = "top";
    context.font = getCanvasFont(18, 700, "label");
    context.fillText(group.title, x + paddingX, group.headingY);

    context.textBaseline = "middle";
    context.font = getCanvasFont(18, 700, "body");
    group.badges.forEach((badge) => {
      context.fillStyle = getAccentFill(context, badge.x, badge.y, badge.width, badgeHeight, 0.15, 0.22);
      roundRect(context, badge.x, badge.y, badge.width, badgeHeight, 999);
      context.fill();

      context.fillStyle = textColor;
      context.fillText(badge.label, badge.x + 12, badge.y + badgeHeight / 2 + 1);
    });
  });

  return {
    bottom: y + panelHeight,
    items: [makeFocusItem(focusFieldName, "チェックリスト", x, y, maxWidth, panelHeight, 24)]
  };
}

function drawOshiItemGrid(context, items, x, y, width, height, accent, textColor) {
  const gap = 14;
  const columns = 2;
  const rows = Math.ceil(items.length / columns);
  const cardWidth = (width - gap * (columns - 1)) / columns;
  const cardHeight = (height - gap * (rows - 1)) / rows;
  const hotspotItems = [];

  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const boxX = x + col * (cardWidth + gap);
    const boxY = y + row * (cardHeight + gap);
    const horizontalPadding = 18;
    const textWidth = cardWidth - horizontalPadding * 2;
    const titleText = clampText(item.label || "項目", 18);
    const titleFontBase = clamp(Math.floor(cardHeight * 0.15), 13, 18);
    const titleFontSize = fitSingleLineFont(context, titleText, titleFontBase, 12, Math.max(textWidth - 8, 84));
    const titleHeight = Math.max(Math.round(titleFontSize * 1.65), 24);
    const titleY = boxY - Math.round(titleHeight * 0.46);

    context.fillStyle = getAccentFill(context, boxX, boxY, cardWidth, cardHeight, 0.08, 0.14);
    roundRect(context, boxX, boxY, cardWidth, cardHeight, 28);
    context.fill();

    context.strokeStyle = hexToRgba(accent, 0.18);
    context.lineWidth = 2;
    roundRect(context, boxX, boxY, cardWidth, cardHeight, 28);
    context.stroke();

    const titleBadgeWidth = Math.min(context.measureText(titleText).width + 28, cardWidth - 36);
    context.fillStyle = getSurfaceFill(context, boxX + 18, titleY, titleBadgeWidth, titleHeight, 0.98);
    roundRect(context, boxX + 18, titleY, titleBadgeWidth, titleHeight, 999);
    context.fill();

    context.strokeStyle = hexToRgba(accent, 0.22);
    context.lineWidth = 2;
    roundRect(context, boxX + 18, titleY, titleBadgeWidth, titleHeight, 999);
    context.stroke();

    context.fillStyle = hexToRgba(getLabelTextColor(), 0.78);
    context.font = getCanvasFont(titleFontSize, 700, "label");
    context.textBaseline = "top";
    context.fillText(titleText, boxX + 32, titleY + Math.max((titleHeight - titleFontSize) / 2 - 1, 4));

    const bodyTop = boxY + clamp(cardHeight * 0.11, 12, 16);
    const bottomPadding = clamp(cardHeight * 0.09, 8, 14);
    const availableBodyHeight = Math.max(boxY + cardHeight - bottomPadding - bodyTop, 14);
    const bodyText = clampText(item.value || "", 90) || "未入力";
    const bodyLayout = fitWrappedTextBlock(
      context,
      bodyText,
      textWidth,
      availableBodyHeight,
      getAdaptiveTextLayout(bodyText, {
        maxFontSize: clamp(Math.floor(cardHeight * 0.27), 20, 30),
        minFontSize: 16,
        maxLines: 5,
        maxExpandedFontSize: clamp(Math.floor(cardHeight * 0.35), 26, 36),
        longTextThreshold: 48,
        maxExtraLines: 1
      })
    );

    context.fillStyle = textColor;
    context.font = getCanvasFont(bodyLayout.fontSize, 600, "body");
    bodyLayout.lines.forEach((line, lineIndex) => {
      context.fillText(line, boxX + horizontalPadding, bodyTop + lineIndex * bodyLayout.lineHeight);
    });

    if (item.fieldName) {
      hotspotItems.push(makeFocusItem(item.fieldName, item.label || "項目", boxX, boxY, cardWidth, cardHeight, 28));
    }
  });

  return {
    items: hotspotItems
  };
}

function drawFooter(context, footerMessage, x, y, width, height, accent, textColor) {
  context.fillStyle = getAccentFill(context, x, y, width, height, 0.12, 0.22);
  roundRect(context, x, y, width, height, 28);
  context.fill();

  const content = clampText(footerMessage || "ここにひとことを入れましょう", 64);
  const fontSize = fitSingleLineFont(context, content, 26, 18, Math.max(width - 48, 140));
  context.fillStyle = textColor;
  context.font = getCanvasFont(fontSize, 700, "body");
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(content, x + width / 2, y + height / 2 + 1);
  return {
    item: makeFocusItem("footerMessage", "ひとこと", x, y, width, height, 28)
  };
}

function collectOshiItems() {
  return [
    { label: "病名・診断名", value: state.diagnosis, fieldName: "diagnosis" },
    { label: "通院・入院歴", value: state.careHistory, fieldName: "careHistory" },
    { label: "薬・治療法", value: state.treatment, fieldName: "treatment" },
    { label: "配慮してほしいこと", value: state.supportNeeds, fieldName: "supportNeeds" }
  ];
}

function collectChecklistItems() {
  return checklistGroups
    .map((group) => ({
      title: group.title,
      items: group.items
        .filter((item) => Boolean(state[item.key]))
        .map((item) => item.label)
    }))
    .filter((group) => group.items.length);
}

function collectMetaItems() {
  return [
    { visible: isPreviewVisible(state.genderVisible), label: state.genderLabel || "性", value: state.gender, fieldName: "gender" },
    { visible: isPreviewVisible(state.bloodVisible), label: state.bloodLabel || "血液型", value: state.blood, fieldName: "blood" },
    { visible: isPreviewVisible(state.birthdayVisible), label: state.birthdayLabel || "誕生日", value: state.birthday, fieldName: "birthday" },
    { visible: isPreviewVisible(state.ageVisible), label: state.ageLabel || "年齢", value: state.age, fieldName: "age" },
    { visible: isPreviewVisible(state.locationVisible), label: state.locationLabel || "住んでる所", value: state.location, fieldName: "location" }
  ].filter((item) => item.visible && String(item.value || "").trim());
}

function parseTags(value) {
  return String(value || "")
    .split(/[,\n、]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function collectSocialLinks() {
  return socialInputFields
    .map((field) => {
      const url = normalizeSocialUrl(state[field.key]);
      if (!url) {
        return null;
      }

      const customLabel = String(state[field.labelKey] || "").trim();
      const resolvedPlatform = detectSocialPlatformFromUrl(url);
      const baseLink = resolvedPlatform || createGenericSocialLink(field, url, customLabel);
      return {
        ...baseLink,
        url,
        label: customLabel || baseLink.label,
        short: customLabel || baseLink.short || baseLink.label,
        fieldName: field.key
      };
    })
    .filter(Boolean);
}

function collectPrintSocialAddresses() {
  const addressLinks = collectSocialLinks().map((link) => ({
    ...link,
    fieldName: link.fieldName || link.key
  }));
  const lineUrl = normalizeSocialUrl(state.socialLine);
  if (lineUrl) {
    addressLinks.push({
      key: "socialLine",
      fieldName: "socialLine",
      label: "LINE",
      short: "LINE",
      url: lineUrl,
      color: "#06c755",
      textColor: "#ffffff"
    });
  }
  return addressLinks;
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function beginAvatarPath(context, x, y, size, avatarShape) {
  context.beginPath();

  if (avatarShape === "rounded") {
    roundRect(context, x, y, size, size, size * 0.22);
    return;
  }

  if (avatarShape === "blob") {
    context.moveTo(x + size * 0.48, y + size * 0.03);
    context.bezierCurveTo(x + size * 0.88, y - size * 0.02, x + size * 1.03, y + size * 0.3, x + size * 0.94, y + size * 0.56);
    context.bezierCurveTo(x + size * 0.9, y + size * 0.92, x + size * 0.56, y + size * 1.05, x + size * 0.28, y + size * 0.94);
    context.bezierCurveTo(x + size * 0.04, y + size * 0.84, x - size * 0.05, y + size * 0.5, x + size * 0.04, y + size * 0.22);
    context.bezierCurveTo(x + size * 0.11, y + size * 0.05, x + size * 0.29, y - size * 0.02, x + size * 0.48, y + size * 0.03);
    context.closePath();
    return;
  }

  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
}

function wrapLines(context, text, maxWidth) {
  const content = String(text || "").trim();
  if (!content) {
    return [""];
  }

  const source = content.split(/\n/);
  const lines = [];

  source.forEach((block) => {
    if (/\s/.test(block.trim())) {
      const words = block.trim().split(/\s+/);
      let current = "";

      words.forEach((word) => {
        const test = current ? `${current} ${word}` : word;
        if (context.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      });

      if (current) {
        lines.push(current);
      }
      return;
    }

    let current = "";
    Array.from(block).forEach((char) => {
      const test = current + char;
      if (context.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = char;
      } else {
        current = test;
      }
    });

    if (current) {
      lines.push(current);
    }
  });

  return lines.length ? lines : [""];
}

function fitSingleLineFont(context, text, maxSize, minSize, maxWidth, role = "body") {
  let size = maxSize;
  while (size > minSize) {
    context.font = getCanvasFont(size, 700, role);
    if (context.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  return minSize;
}

function getAdaptiveTextLayout(text, options = {}) {
  const {
    maxFontSize = 20,
    minFontSize = 10,
    maxLines = 3,
    fontWeight = "600",
    maxExpandedFontSize = maxFontSize + 10,
    longTextThreshold = 48,
    maxExtraLines = 2
  } = options;
  const content = String(text || "").trim();
  const compactLength = Array.from(content.replace(/[ \t]/g, "")).length;
  const lineBreakCount = (content.match(/\n/g) || []).length;
  const length = compactLength + lineBreakCount * 8;
  let fontBoost = 0;
  let extraLines = 0;

  if (length > 0 && length <= 8) {
    fontBoost = 12;
  } else if (length <= 16) {
    fontBoost = 10;
  } else if (length <= 28) {
    fontBoost = 8;
  } else if (length <= 42) {
    fontBoost = 5;
  } else if (length <= 56) {
    fontBoost = 3;
  }

  if (length >= longTextThreshold) {
    extraLines = 1;
  }
  if (length >= longTextThreshold + 28) {
    extraLines = 2;
  }

  const adjustedMaxFontSize = Math.max(
    minFontSize,
    Math.min(maxExpandedFontSize, maxFontSize + fontBoost)
  );
  let adjustedMinFontSize = minFontSize;
  if (length > 0 && length <= 16) {
    adjustedMinFontSize = Math.min(adjustedMaxFontSize, minFontSize + 5);
  } else if (length <= 30) {
    adjustedMinFontSize = Math.min(adjustedMaxFontSize, minFontSize + 4);
  } else if (length <= 48) {
    adjustedMinFontSize = Math.min(adjustedMaxFontSize, minFontSize + 2);
  }

  return {
    maxFontSize: adjustedMaxFontSize,
    minFontSize: adjustedMinFontSize,
    maxLines: maxLines + Math.min(extraLines, maxExtraLines),
    fontWeight
  };
}

function fitWrappedTextBlock(context, text, maxWidth, maxHeight, options = {}) {
  const {
    maxFontSize = 20,
    minFontSize = 10,
    maxLines = 3,
    fontWeight = "600",
    role = "body"
  } = options;

  const safeHeight = Math.max(maxHeight, minFontSize + 4);

  for (let size = maxFontSize; size >= minFontSize; size -= 1) {
    context.font = getCanvasFont(size, fontWeight, role);
    const lineHeight = Math.max(Math.round(size * 1.16), size + 2);
    const allowedLines = Math.max(1, Math.min(maxLines, Math.floor(safeHeight / lineHeight)));
    const wrappedLines = wrapLines(context, text, maxWidth);

    if (wrappedLines.length <= allowedLines) {
      return { fontSize: size, lineHeight, lines: wrappedLines };
    }
  }

  context.font = getCanvasFont(minFontSize, fontWeight, role);
  const lineHeight = Math.max(Math.round(minFontSize * 1.16), minFontSize + 2);
  const allowedLines = Math.max(1, Math.min(maxLines, Math.floor(safeHeight / lineHeight)));
  const wrappedLines = wrapLines(context, text, maxWidth);
  return {
    fontSize: minFontSize,
    lineHeight,
    lines: wrappedLines.slice(0, allowedLines)
  };
}

function syncSocialOverlay() {
  if (!socialOverlay) {
    return;
  }

  socialOverlay.innerHTML = "";

  if (!socialOverlayItems.length) {
    socialOverlay.setAttribute("aria-hidden", "true");
    return;
  }

  socialOverlay.setAttribute("aria-hidden", "false");
  const scaleX = socialOverlay.clientWidth / canvas.width;
  const scaleY = socialOverlay.clientHeight / canvas.height;
  const fragment = document.createDocumentFragment();

  socialOverlayItems.forEach((item) => {
    if (item.type === "adjust") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preview-hotspot";
      button.dataset.adjustTarget = item.targetKey;
      button.title = `${item.label} を編集`;
      button.setAttribute("aria-label", `${item.label} の位置とサイズを編集`);
      button.style.left = `${item.x * scaleX}px`;
      button.style.top = `${item.y * scaleY}px`;
      button.style.width = `${item.width * scaleX}px`;
      button.style.height = `${item.height * scaleY}px`;
      button.style.borderRadius = `${item.radius * Math.min(scaleX, scaleY)}px`;
      button.addEventListener("click", (event) => openPreviewAdjustPanel(item.targetKey, { button, event }));
      fragment.appendChild(button);
      return;
    }

    if (item.type === "focus") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preview-hotspot";
      button.title = `${item.label} を編集`;
      button.setAttribute("aria-label", `${item.label} の入力欄へ移動`);
      button.style.left = `${item.x * scaleX}px`;
      button.style.top = `${item.y * scaleY}px`;
      button.style.width = `${item.width * scaleX}px`;
      button.style.height = `${item.height * scaleY}px`;
      button.style.borderRadius = `${item.radius * Math.min(scaleX, scaleY)}px`;
      button.addEventListener("click", () => focusFormField(item.fieldName));
      fragment.appendChild(button);
      return;
    }

    if (item.type === "marker") {
      const marker = document.createElement("span");
      marker.className = "preview-side-marker";
      marker.textContent = item.label;
      marker.style.left = `${item.x * scaleX}px`;
      marker.style.top = `${item.y * scaleY}px`;
      marker.style.minWidth = `${item.width * scaleX}px`;
      marker.style.minHeight = `${item.height * scaleY}px`;
      marker.style.fontSize = `${Math.max(Math.round(item.height * scaleY * 0.44), 10)}px`;
      fragment.appendChild(marker);
      return;
    }

    const link = document.createElement("a");
    link.className = "social-link";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = item.label;
    link.setAttribute("aria-label", `${item.label} を開く`);
    link.style.left = `${item.x * scaleX}px`;
    link.style.top = `${item.y * scaleY}px`;
    link.style.width = `${item.size * scaleX}px`;
    link.style.height = `${item.size * scaleY}px`;
    link.style.background = item.color;
    link.style.color = item.textColor;
    link.style.fontSize = `${Math.max(Math.round(item.size * Math.min(scaleX, scaleY) * 0.32), 9)}px`;
    const iconMarkup = getSocialLinkIconMarkup(item);
    if (iconMarkup) {
      const icon = document.createElement("span");
      icon.className = "social-link-icon";
      icon.innerHTML = iconMarkup.trim();
      link.appendChild(icon);
    } else {
      link.textContent = item.short;
    }
    fragment.appendChild(link);
  });

  socialOverlay.appendChild(fragment);
  positionPreviewAdjustPanel();
}

function focusFormField(fieldName) {
  const explicitTarget = document.querySelector(`[data-focus-target="${fieldName}"]`);
  if (explicitTarget instanceof HTMLElement) {
    explicitTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    explicitTarget.focus({ preventScroll: true });
    return;
  }

  const field = form.elements.namedItem(fieldName);
  if (!field) {
    return;
  }

  const target = field instanceof RadioNodeList ? field[0] : field;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.focus({ preventScroll: true });
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    target.select?.();
  }
}

function makeFocusItem(fieldName, label, x, y, width, height, radius = 18) {
  return {
    type: "focus",
    fieldName,
    label,
    x,
    y,
    width,
    height,
    radius
  };
}

function makeExternalLinkItem(url, label, x, y, width, height, radius = 18) {
  return {
    type: "external-link",
    url,
    label,
    x,
    y,
    width,
    height,
    radius
  };
}

function makeAdjustItem(targetKey, label, x, y, width, height, radius = 18) {
  return {
    type: "adjust",
    targetKey,
    label,
    x,
    y,
    width,
    height,
    radius
  };
}

function makePreviewMarkerItem(label, x, y, width = 58, height = 28) {
  return {
    type: "marker",
    label,
    x,
    y,
    width,
    height
  };
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const numeric = Number.parseInt(value, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  const adjustedAlpha = themedAlpha(`#${value.toLowerCase()}`, alpha);
  return `rgba(${r}, ${g}, ${b}, ${adjustedAlpha})`;
}

function hexToRgbaRaw(hex, alpha) {
  const normalized = normalizeHexColor(hex).replace("#", "");
  const numeric = Number.parseInt(normalized, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getAccentFill(context, x, y, width, height, startAlpha, endAlpha = startAlpha) {
  return createColorGradient(
    context,
    x,
    y,
    width,
    height,
    state.accentColor,
    state.accentColorEnd || state.accentColor,
    startAlpha,
    endAlpha
  );
}

function getRawSurfaceFill(context, x, y, width, height, startAlpha, endAlpha = startAlpha) {
  return createColorGradientRaw(
    context,
    x,
    y,
    width,
    height,
    state.surfaceColor,
    state.surfaceColorEnd || state.surfaceColor,
    startAlpha,
    endAlpha
  );
}

function getSurfaceFill(context, x, y, width, height, startAlpha, endAlpha = startAlpha) {
  return createColorGradient(
    context,
    x,
    y,
    width,
    height,
    state.surfaceColor,
    state.surfaceColorEnd || state.surfaceColor,
    startAlpha,
    endAlpha
  );
}

function createColorGradient(context, x, y, width, height, startColor, endColor, startAlpha, endAlpha = startAlpha) {
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, hexToRgba(startColor, startAlpha));
  gradient.addColorStop(1, hexToRgba(endColor, endAlpha));
  return gradient;
}

function createColorGradientRaw(context, x, y, width, height, startColor, endColor, startAlpha, endAlpha = startAlpha) {
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, hexToRgbaRaw(startColor, startAlpha));
  gradient.addColorStop(1, hexToRgbaRaw(endColor, endAlpha));
  return gradient;
}

function isImageTheme(themePreset) {
  return themePreset === "custom-image";
}

function themedAlpha(hex, alpha) {
  if (!isImageTheme(state.themePreset)) {
    return alpha;
  }

  if (state.layoutMode === "business") {
    return alpha;
  }

  const normalized = normalizeHexColor(hex);
  const inputTextColor = normalizeHexColor(state.textColor || "#1b2326");
  const labelTextColor = normalizeHexColor(getLabelTextColor());
  if (normalized === inputTextColor || normalized === labelTextColor) {
    return alpha;
  }

  const opacity = normalizeBackgroundOverlayOpacity(state.backgroundOverlayOpacity);
  if (opacity >= 100) {
    return 0;
  }

  if (normalized === "#ffffff" && alpha >= 0.9) {
    return alpha;
  }

  const fade = 1 - opacity / 100;
  const factor = 0.38 + fade * 0.46;
  return alpha * factor;
}

function getBusinessBackgroundOverlayAlphas(side = "front") {
  const emphasis = getBusinessBackgroundOverlayOpacity(side) / 100;
  const start = 0.84 - emphasis * 0.62;
  return {
    start,
    end: Math.max(start - 0.06, 0.08)
  };
}

function getBusinessBackgroundOverlayOpacity(side = "front", currentState = state) {
  const stateKey = side === "back" ? "backgroundOverlayOpacityBack" : "backgroundOverlayOpacityFront";
  return normalizeBackgroundOverlayOpacity(currentState[stateKey] ?? currentState.backgroundOverlayOpacity);
}

function getBusinessBackgroundTransformState(side = "front", currentState = state) {
  const prefix = side === "back" ? "backgroundBack" : "backgroundFront";
  return {
    scale: normalizeTransformScale(currentState[`${prefix}Scale`], 100, 60, 180),
    offsetX: normalizeTransformOffset(currentState[`${prefix}OffsetX`]),
    offsetY: normalizeTransformOffset(currentState[`${prefix}OffsetY`])
  };
}

function getAvatarTransformState(currentState = state) {
  return {
    scale: normalizeTransformScale(currentState.avatarScale, 100, 70, 180),
    offsetX: normalizeTransformOffset(currentState.avatarOffsetX),
    offsetY: normalizeTransformOffset(currentState.avatarOffsetY)
  };
}

function normalizeHexColor(hex) {
  const normalized = String(hex || "").replace("#", "").toLowerCase();
  if (normalized.length === 3) {
    return `#${normalized.split("").map((char) => char + char).join("")}`;
  }
  return `#${normalized}`;
}

function normalizeBackgroundOverlayOpacity(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return defaultState.backgroundOverlayOpacity;
  }
  return clamp(Math.round(numeric), 0, 100);
}

function normalizeTransformScale(value, defaultValue = 100, min = 60, max = 180) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return defaultValue;
  }
  return clamp(Math.round(numeric), min, max);
}

function normalizeTransformOffset(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return clamp(Math.round(numeric), TRANSFORM_OFFSET_MIN, TRANSFORM_OFFSET_MAX);
}

function syncBackgroundOpacityValue() {
  if (!backgroundOverlayOpacityValue || !backgroundOverlayOpacityInput) {
    return;
  }

  const value = normalizeBackgroundOverlayOpacity(state.backgroundOverlayOpacity);
  backgroundOverlayOpacityInput.value = String(value);
  backgroundOverlayOpacityValue.value = `${value}%`;
  backgroundOverlayOpacityValue.textContent = `${value}%`;
}

function syncBusinessBackgroundOpacityValues() {
  if (backgroundOverlayOpacityFrontInput) {
    backgroundOverlayOpacityFrontInput.value = String(getBusinessBackgroundOverlayOpacity("front"));
  }
  if (backgroundOverlayOpacityBackInput) {
    backgroundOverlayOpacityBackInput.value = String(getBusinessBackgroundOverlayOpacity("back"));
  }
}

function containRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  return {
    dx: (targetWidth - dw) / 2,
    dy: (targetHeight - dh) / 2,
    dw,
    dh
  };
}

function coverRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const sw = sourceHeight * targetRatio;
    const sx = (sourceWidth - sw) / 2;
    return { sx, sy: 0, sw, sh: sourceHeight };
  }

  const sh = sourceWidth / targetRatio;
  const sy = (sourceHeight - sh) / 2;
  return { sx: 0, sy, sw: sourceWidth, sh };
}

function drawImageToBox(context, image, box, options = {}) {
  const {
    fitMode = "cover",
    scalePercent = 100,
    offsetX = 0,
    offsetY = 0
  } = options;
  const userScale = normalizeTransformScale(scalePercent, 100, 20, 240) / 100;
  const baseScale = fitMode === "contain"
    ? Math.min(box.w / image.width, box.h / image.height)
    : Math.max(box.w / image.width, box.h / image.height);
  const drawWidth = image.width * baseScale * userScale;
  const drawHeight = image.height * baseScale * userScale;
  const rangeX = Math.max(Math.abs(box.w - drawWidth) / 2, 0);
  const rangeY = Math.max(Math.abs(box.h - drawHeight) / 2, 0);
  const normalizedOffsetX = normalizeTransformOffset(offsetX) / 100;
  const normalizedOffsetY = normalizeTransformOffset(offsetY) / 100;
  const drawX = box.x + (box.w - drawWidth) / 2 + rangeX * normalizedOffsetX;
  const drawY = box.y + (box.h - drawHeight) / 2 + rangeY * normalizedOffsetY;

  context.drawImage(image, 0, 0, image.width, image.height, drawX, drawY, drawWidth, drawHeight);
}

function getInitials(name) {
  const compact = String(name || "SNS").replace(/\s+/g, "");
  return Array.from(compact).slice(0, 2).join("").toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampText(value, maxLength) {
  const text = String(value || "");
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}...`;
}

function normalizeSocialUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const normalized = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(normalized);
    return /^https?:$/i.test(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function formatSocialAddress(url, maxLength = 28) {
  const compact = String(url || "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/g, "");

  return clampText(compact, maxLength);
}

function sanitizeFileName(value) {
  return String(value || "profile-card")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-");
}

function getShareUrl() {
  return /^https?:$/i.test(location.protocol) ? location.href : "";
}

function canvasToShareFile(fileName) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }

      resolve(new File([blob], fileName, { type: "image/png" }));
    }, "image/png");
  });
}

function pickReadableText(backgroundHex, lightText, darkText) {
  const normalized = backgroundHex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const numeric = Number.parseInt(value, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 155 ? lightText : darkText;
}
