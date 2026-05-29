# Stolen Words — Web Edition

A free, web-native edition of *Stolen Words*, in the spirit of [Writebook](https://once.com/writebook).
Built with [Astro](https://astro.build), deployed free on [Cloudflare Pages](https://pages.cloudflare.com).

## Philosophy
- **Free for everyone.** No paywall, no signup, no tracking.
- **Markdown is the source of truth.** All content lives in `src/content/books/*/`.
- **Permanent links.** Every chapter and every documented edit has its own URL.
- **Bring your own theme.** Reader chooses font, size, and theme; choices are remembered.
- **Multi-book library.** One installation, many books (translations, briefs, compilations).

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

## Add a new chapter

1. Create a new `.mdx` file under `src/content/books/<book-id>/`.
2. Set the frontmatter:
   ```mdx
   ---
   title: "Chapter title"
   order: 5
   book: "stolen-words-en"
   ---
   ```
3. Write in Markdown. Use the `<BeforeAfter />` component for documented edits.
4. `git push` → live in 30 seconds.

## Add a new book / translation

Copy `src/content/books/stolen-words-en/` to `src/content/books/stolen-words-es/`
and edit `book.json` and the chapter files.

## Deploy to Cloudflare Pages

1. Push to GitHub.
2. Cloudflare Dashboard → Pages → Connect to Git → select repo.
3. Build command: `npm run build`. Output: `dist`.
4. Add custom domain (e.g. `stolenwords.live`).

## License

The software (templates, components, styles): MIT.
The book content: see each book's `book.json` for its license.
