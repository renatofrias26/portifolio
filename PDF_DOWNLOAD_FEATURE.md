# PDF Download Feature

## Overview

Users can now download their uploaded resume PDFs from both the admin dashboard (Manage Versions) and their public portfolio website.

## Implementation Details

### Database Schema

The `resume_data` table includes a `pdf_url` column that stores the Vercel Blob URL for each uploaded PDF:

```sql
pdf_url TEXT
```

### Data Flow

1. **PDF Upload** → `app/api/resume/parse/route.ts`

   - User uploads PDF via resume uploader
   - PDF is stored in Vercel Blob Storage
   - Blob URL is saved to `resume_data.pdf_url`

2. **Public Portfolio** → `app/[username]/page.tsx`

   - Fetches published resume with `getPublishedResumeByUsername()`
   - Extracts `pdf_url` from database
   - Passes as `pdfUrl` to `<Navigation>` component

3. **Admin Dashboard** → `components/admin/resume-versions-list.tsx`
   - Fetches all resume versions with `pdf_url`
   - Displays download buttons for each version

### Components Updated

#### 1. Navigation Component (`components/navigation.tsx`)

**Desktop View:**

```tsx
<a
  href={pdfUrl || "/resume.pdf"}
  download={pdfUrl ? true : undefined}
  target={pdfUrl ? "_blank" : undefined}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
>
  <Download className="w-4 h-4" />
  Resume
</a>
```

**Mobile View:**

- Same download button in mobile menu
- Closes menu on click

**Features:**

- Shows download button in top navigation
- Downloads the published resume PDF
- Works on both desktop and mobile
- Falls back to `/resume.pdf` if no PDF URL available

#### 2. Resume Versions List (`components/admin/resume-versions-list.tsx`)

**For Each Version:**

```tsx
{
  version.pdf_url && (
    <div className="flex items-center gap-2 mt-3">
      <a href={version.pdf_url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-4 h-4" />
        View PDF
      </a>
      <a href={version.pdf_url} download>
        <Download className="w-4 h-4" />
        Download PDF
      </a>
    </div>
  );
}
```

**Features:**

- Two buttons per version: "View PDF" (opens in new tab) and "Download PDF"
- Styled with purple/blue color scheme matching brand
- Only shows if `pdf_url` exists
- Works for both active and archived versions

### User Experience

#### Admin Dashboard - Manage Versions

Users can:

1. **View PDF** - Opens in new browser tab for preview
2. **Download PDF** - Downloads file directly to their device
3. Access both actions for any version (published, draft, or archived)

#### Public Portfolio

Visitors can:

1. Click "Resume" button in navigation
2. Download the published resume PDF
3. Works on mobile and desktop

### Technical Notes

- **Vercel Blob URLs**: Permanent URLs that don't expire
- **Cross-Origin**: PDFs served from Vercel Blob with proper CORS headers
- **Download Attribute**: HTML5 `download` attribute triggers browser download
- **Target Blank**: Opening in new tab allows preview before download
- **Fallback**: Navigation falls back to `/resume.pdf` if no URL exists (for backwards compatibility)

### Security & Privacy

- Only **published** resume PDFs are accessible via public portfolio
- Users viewing private profiles (owners only) can still download their PDFs
- PDF URLs are not guessable (Vercel Blob generates unique tokens)
- All versions are accessible to the owner in admin dashboard

### Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers support download attribute
- Fallback to opening in new tab if download fails

## Testing

### Test Scenarios

1. **Upload New Resume**

   - Upload PDF via admin dashboard
   - Verify PDF URL is saved
   - Check download buttons appear

2. **Public Portfolio Download**

   - Visit `/{username}` as guest
   - Click "Resume" in navigation
   - Verify PDF downloads

3. **Admin Versions Download**

   - Go to admin/profile
   - Find version in list
   - Test both "View PDF" and "Download PDF"

4. **Multiple Versions**

   - Upload multiple PDFs
   - Verify each has correct download link
   - Test downloading different versions

5. **Mobile Experience**
   - Open portfolio on mobile device
   - Open mobile menu
   - Test resume download

### Edge Cases Handled

- ✅ No PDF uploaded (navigation shows fallback)
- ✅ Archived versions (download still works)
- ✅ Private profiles (owner can download)
- ✅ Public profiles (guests can download published version only)

## Future Enhancements

- [ ] Download statistics/analytics per PDF
- [ ] Custom PDF filenames (e.g., "John_Doe_Resume.pdf")
- [ ] PDF version comparison view
- [ ] Bulk download all versions (ZIP)
- [ ] PDF thumbnail previews in versions list

## Related Files

- `components/navigation.tsx` - Public download button
- `components/admin/resume-versions-list.tsx` - Admin download buttons
- `app/[username]/page.tsx` - PDF URL data flow
- `lib/db/queries.ts` - Database queries including `pdf_url`
- `app/api/resume/parse/route.ts` - PDF upload handling
