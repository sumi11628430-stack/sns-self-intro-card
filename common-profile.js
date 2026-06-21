const COMMON_PROFILE_STORAGE_KEY = "sns-common-profile-state";
const COMMON_PROFILE_DEFAULT_SELECT_FIELDS = {
  displayNameVisible: "show",
  displayNameLabel: "名前",
  roleVisible: "show",
  roleLabel: "肩書き",
  genderVisible: "show",
  genderLabel: "性",
  bloodVisible: "show",
  bloodLabel: "血液型",
  birthdayVisible: "show",
  birthdayLabel: "誕生日",
  ageVisible: "show",
  ageLabel: "年齢",
  locationVisible: "show",
  locationLabel: "住んでる所",
  socialXLabel: "X",
  socialInstagramLabel: "Instagram",
  socialThreadsLabel: "Threads",
  socialTikTokLabel: "TikTok"
};
const COMMON_PROFILE_FIELDS = [
  "displayNameVisible",
  "displayNameLabel",
  "displayName",
  "roleVisible",
  "roleLabel",
  "role",
  "genderVisible",
  "genderLabel",
  "gender",
  "bloodVisible",
  "bloodLabel",
  "blood",
  "birthdayVisible",
  "birthdayLabel",
  "birthday",
  "ageVisible",
  "ageLabel",
  "age",
  "locationVisible",
  "locationLabel",
  "location",
  "intro",
  "tags",
  "socialXLabel",
  "socialX",
  "socialInstagramLabel",
  "socialInstagram",
  "socialThreadsLabel",
  "socialThreads",
  "socialTikTokLabel",
  "socialTikTok",
];

const COMMON_PROFILE_SOCIAL_FIELDS = [
  { key: "socialX", labelKey: "socialXLabel", defaultLabel: "X" },
  { key: "socialInstagram", labelKey: "socialInstagramLabel", defaultLabel: "Instagram" },
  { key: "socialThreads", labelKey: "socialThreadsLabel", defaultLabel: "Threads" },
  { key: "socialTikTok", labelKey: "socialTikTokLabel", defaultLabel: "TikTok" }
];

const COMMON_PROFILE_LEGACY_SOCIAL_FIELDS = [
  { key: "socialYouTube", label: "YouTube" },
  { key: "socialBluesky", label: "Bluesky" },
  { key: "socialLine", label: "LINE" }
];

function createEmptyCommonProfile() {
  const profile = Object.fromEntries(
    COMMON_PROFILE_FIELDS.map((fieldName) => [fieldName, COMMON_PROFILE_DEFAULT_SELECT_FIELDS[fieldName] || ""])
  );
  COMMON_PROFILE_SOCIAL_FIELDS.forEach((field) => {
    profile[field.labelKey] = field.defaultLabel;
  });
  return profile;
}

function normalizeSocialLabel(value, fallback) {
  const label = value == null ? "" : String(value).trim();
  return label || fallback;
}

function migrateLegacySocialLinks(source, target) {
  COMMON_PROFILE_LEGACY_SOCIAL_FIELDS.forEach((legacyField) => {
    const legacyUrl = source?.[legacyField.key] == null ? "" : String(source[legacyField.key]).trim();
    if (!legacyUrl) {
      return;
    }

    const alreadyUsed = COMMON_PROFILE_SOCIAL_FIELDS.some((field) => target[field.key] === legacyUrl);
    if (alreadyUsed) {
      return;
    }

    const emptyField = COMMON_PROFILE_SOCIAL_FIELDS.find((field) => !target[field.key]);
    if (!emptyField) {
      return;
    }

    target[emptyField.key] = legacyUrl;
    target[emptyField.labelKey] = normalizeSocialLabel(target[emptyField.labelKey], legacyField.label);
  });
}

function normalizeCommonProfile(value) {
  const normalized = createEmptyCommonProfile();
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return normalized;
  }

  COMMON_PROFILE_FIELDS.forEach((fieldName) => {
    const fieldValue = value[fieldName];
    const nextValue = fieldValue == null ? "" : String(fieldValue);
    if (Object.prototype.hasOwnProperty.call(COMMON_PROFILE_DEFAULT_SELECT_FIELDS, fieldName)) {
      normalized[fieldName] = nextValue.trim() || COMMON_PROFILE_DEFAULT_SELECT_FIELDS[fieldName];
      return;
    }
    normalized[fieldName] = nextValue;
  });

  COMMON_PROFILE_SOCIAL_FIELDS.forEach((field) => {
    normalized[field.labelKey] = normalizeSocialLabel(normalized[field.labelKey], field.defaultLabel);
  });
  migrateLegacySocialLinks(value, normalized);

  return normalized;
}

function loadCommonProfile() {
  try {
    const raw = localStorage.getItem(COMMON_PROFILE_STORAGE_KEY);
    if (!raw) {
      return createEmptyCommonProfile();
    }
    return normalizeCommonProfile(JSON.parse(raw));
  } catch {
    return createEmptyCommonProfile();
  }
}

function saveCommonProfile(profile) {
  const normalized = normalizeCommonProfile(profile);
  try {
    localStorage.setItem(COMMON_PROFILE_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore storage errors and keep the normalized data in memory.
  }
  return normalized;
}

window.CommonProfileStore = {
  STORAGE_KEY: COMMON_PROFILE_STORAGE_KEY,
  FIELDS: COMMON_PROFILE_FIELDS,
  createEmpty: createEmptyCommonProfile,
  normalize: normalizeCommonProfile,
  load: loadCommonProfile,
  save: saveCommonProfile
};
