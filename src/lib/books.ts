import { getCollection } from 'astro:content';

/**
 * Get all books (their metadata).
 */
export async function getBooks() {
  const all = await getCollection('bookMeta');
  return all.map(b => b.data);
}

/**
 * Get metadata for a single book by id.
 */
export async function getBook(id: string) {
  const all = await getCollection('bookMeta');
  return all.find(b => b.data.id === id)?.data;
}

/**
 * Get the ordered list of chapters for a book.
 * Filters out hidden chapters.
 */
export async function getChapters(bookId: string) {
  const all = await getCollection('books');
  return all
    .filter(c => c.data.book === bookId && !c.data.hidden)
    .sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get a single chapter by book + slug.
 * Slug is the file basename without extension.
 */
export async function getChapter(bookId: string, slug: string) {
  const chapters = await getChapters(bookId);
  return chapters.find(c => chapterSlug(c.id) === slug);
}

/**
 * Build neighbouring (prev/next) chapter refs.
 */
export async function getNeighbours(bookId: string, currentSlug: string) {
  const chapters = await getChapters(bookId);
  const i = chapters.findIndex(c => chapterSlug(c.id) === currentSlug);
  return {
    prev: i > 0 ? chapters[i - 1] : null,
    next: i < chapters.length - 1 ? chapters[i + 1] : null,
    index: i,
    total: chapters.length,
  };
}

/**
 * Convert a content id like "stolen-words-en/04-bg-2-13.mdx" -> "04-bg-2-13".
 */
export function chapterSlug(id: string): string {
  const last = id.split('/').pop() ?? id;
  return last.replace(/\.(md|mdx)$/, '');
}

/**
 * Build the language-sibling list for the current book/chapter.
 * Matches sibling books by stripping the `-en|-es|-hi` suffix, then
 * picks the chapter in each sibling that shares the same `order`.
 * If no chapter with that order exists in a sibling, fall back to its cover.
 *
 * Pass `currentOrder = null` for cover pages — every sibling will resolve to its cover.
 */
export async function getLangSiblings(currentBookId: string, currentOrder: number | null) {
  const books = await getBooks();
  const base = currentBookId.replace(/-(en|es|hi)$/, '');
  const order = { en: 1, es: 2, hi: 3 } as Record<string, number>;

  const siblings = [];
  for (const b of books) {
    const otherBase = b.id.replace(/-(en|es|hi)$/, '');
    if (otherBase !== base) continue;
    let href = `/${b.id}`;
    if (currentOrder !== null) {
      const chapters = await getChapters(b.id);
      const match = chapters.find(c => c.data.order === currentOrder);
      if (match) href = `/${b.id}/${chapterSlug(match.id)}`;
    }
    const label = b.lang === 'hi' ? 'हि' : b.lang.toUpperCase();
    siblings.push({
      lang: b.lang,
      label,
      href,
      isCurrent: b.id === currentBookId,
    });
  }
  return siblings.sort((a, c) => (order[a.lang] ?? 99) - (order[c.lang] ?? 99));
}
