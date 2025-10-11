# How to Upload Your Profile Images

## Where to Upload

You can upload your **logo** and **profile image** directly from your **Admin Dashboard**:

1. **Login** to your admin account at `/admin/login`
2. Navigate to the **Profile** tab in your dashboard
3. Scroll down to the **Customization** section

## Upload Options

### Logo Upload

- **Location shown**: Navigation bar (top of page)
- **Recommended size**: 200x200px or similar square/rectangular dimensions
- **Use case**: Your brand/company logo
- **File types**: JPEG, PNG, WebP, or GIF
- **Max size**: 5MB

### Profile Image Upload

- **Location shown**: Contact section (at the bottom of the page)
- **Recommended size**: 400x400px or larger (will be displayed in a circle)
- **Use case**: Your headshot or avatar
- **File types**: JPEG, PNG, WebP, or GIF
- **Max size**: 5MB
- **Optional**: If not uploaded, no image is shown

## How to Upload

1. Click the **"Upload Logo"** or **"Upload Profile Image"** button
2. Select your image file from your computer
3. The image will automatically upload and update
4. You'll see a preview immediately
5. A success message confirms the upload

## Managing Images

- **Preview**: See your current images in the upload section
- **Change**: Click the upload button again to replace an image
- **Remove**: Click the "Remove" button to delete an image
- **View Live**: Visit your public portfolio at `/{your-username}` to see the images

## Image Best Practices

### Logo

- Use a transparent PNG for best results
- Keep it simple and recognizable
- Ensure good contrast against light/dark backgrounds
- Square or horizontal rectangular format works best

### Profile Image

- Use a high-quality, well-lit photo
- Center your face in the frame
- Use a professional or friendly expression
- The image will be cropped to a circle, so avoid important details in corners

## Technical Details

- Images are stored on **Vercel Blob Storage** (secure cloud storage)
- Each upload generates a unique URL
- Old images are automatically replaced when you upload new ones
- Images are optimized by Next.js for fast loading
- Supports dark/light mode (images display properly in both)

## Troubleshooting

**Upload fails?**

- Check file size (must be under 5MB)
- Verify file type (JPEG, PNG, WebP, or GIF only)
- Ensure you're logged in to your admin account

**Image not showing?**

- Clear your browser cache and refresh
- Check that the upload showed a success message
- Visit your profile tab to verify the image URL is saved

**Image looks blurry?**

- Upload a higher resolution image (at least 400x400px)
- Avoid heavily compressed images

## Next Steps

After uploading your images:

1. Visit your public portfolio to preview: `/{your-username}`
2. Upload your resume in the **Resume** tab
3. Customize your profile data (coming soon: social links, theme colors)
4. Share your portfolio link with others!

---

Need help? Check the main README.md or contact support.
