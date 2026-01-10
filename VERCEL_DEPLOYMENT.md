# Vercel Deployment Guide

## Environment Variables Setup

After deploying to Vercel, you **must** add your Supabase environment variables:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Important**: After adding variables, you need to **redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

## Image Issues Fix

### Problem
Images were not showing because cover images were being stored as base64 strings instead of uploading to Supabase Storage.

### Solution
✅ **Fixed**: Cover images now upload to Supabase Storage automatically when selected.

### What Changed
- `CoverImageEditor` now uploads images to Supabase Storage
- Images are stored as URLs instead of base64
- Works in both development and production

## Verification Checklist

After deployment, verify:

- [ ] Environment variables are set in Vercel
- [ ] Application has been redeployed after adding variables
- [ ] Cover images upload successfully when creating/editing blogs
- [ ] Images display correctly on blog posts
- [ ] Profile image on homepage displays correctly

## Troubleshooting

### Images still not showing?

1. **Check environment variables**:
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
   - Make sure you redeployed after adding them

2. **Check Supabase Storage**:
   - Go to Supabase dashboard → Storage
   - Verify `blog-images` bucket exists and is public
   - Check if images are being uploaded

3. **Check browser console**:
   - Open browser DevTools (F12)
   - Check Console for any errors
   - Check Network tab to see if image requests are failing

4. **Check image URLs**:
   - Images should be Supabase Storage URLs (e.g., `https://xxxxx.supabase.co/storage/v1/object/public/blog-images/...`)
   - If you see `data:image/...` (base64), the upload didn't work

### Old blogs with base64 images

If you have existing blogs with base64 cover images:
1. Edit each blog in the admin panel
2. Re-upload the cover image (it will now save to Supabase)
3. Save the blog

## Build Configuration

Vercel should automatically detect Vite and build correctly. If you need to customize:

**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

