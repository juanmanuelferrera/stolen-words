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
