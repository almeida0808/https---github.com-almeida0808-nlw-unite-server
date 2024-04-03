export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove caracteres especiais
    .replace(/\s+/g, "-") // substitui espaços por hífens
    .replace(/-+/g, "-") // remove múltiplos hífens por apenas um
    .trim(); // remove espaços em branco do início e do fim
}
