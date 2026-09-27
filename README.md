This is my personal website that will be found at bodenretherford.com

## Photography setup

The photography page uses Sanity for photo uploads, tags, captions, and the editable page blurb.

1. Create a Sanity project and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
3. Start the app and open `/studio`.
4. Create a `Site Settings` document and write the photography blurb.
5. Create `Photo` documents, upload an image, and add searchable tags.

Photos are delivered through Sanity's image CDN with responsive sizing and automatic format selection. The public archive can search photo titles, captions, and tags.
