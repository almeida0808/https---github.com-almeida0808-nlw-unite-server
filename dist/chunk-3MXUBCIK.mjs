// src/utils/CreateSlug.ts
function createSlug(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export {
  createSlug
};
