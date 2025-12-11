# Project Media Files

Place your project images and videos here.

## Expected files (from seed data):

### Images (thumbnails)
- `portfolio.png`
- `ecommerce.png`
- `taskmanager.png`

### Videos (hover previews)
- `portfolio.mp4`
- `ecommerce.mp4`
- `taskmanager.mp4`

## How to use:

1. Add your image/video files to this folder
2. Update the database paths in `server/db/seed.ts` if using different filenames
3. Run `npm run db:push` to update the database schema
4. Run `npm run db:seed` to populate with your data
5. Videos will automatically play on hover in the Projects page

## Notes:

- Images show as static thumbnails
- Videos play muted/looping on card hover
- Keep video files reasonably sized (<10MB recommended)
- Supported formats: MP4, WebM
