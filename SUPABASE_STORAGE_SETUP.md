# Supabase Storage Setup for Production

## Critical Steps to Fix Image Issues

### 1. Verify Storage Bucket is Public

1. Go to Supabase Dashboard → **Storage**
2. Click on **blog-images** bucket
3. Check **Public bucket** setting:
   - ✅ Must be **enabled** (checked)
   - If not enabled, click **Edit bucket** → Enable **Public bucket** → Save

### 2. Set Up Storage Policies

Go to **Storage** → **Policies** → **blog-images** → **New Policy**

#### Policy 1: Public Read Access (CRITICAL)

```sql
-- Policy Name: Public read access
-- Allowed Operations: SELECT
-- Target Roles: anon, authenticated

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');
```

**This is the most important policy** - without it, images won't load for visitors!

#### Policy 2: Authenticated Upload

```sql
-- Policy Name: Authenticated users can upload
-- Allowed Operations: INSERT
-- Target Roles: authenticated

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Authenticated Update

```sql
-- Policy Name: Authenticated users can update
-- Allowed Operations: UPDATE
-- Target Roles: authenticated

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 4: Authenticated Delete

```sql
-- Policy Name: Authenticated users can delete
-- Allowed Operations: DELETE
-- Target Roles: authenticated

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

### 3. Verify CORS Settings

1. Go to **Storage** → **Settings**
2. Check **CORS configuration**
3. Make sure your Vercel domain is allowed, or use:
   ```
   * (allow all origins for public bucket)
   ```

### 4. Test Image Access

After setting up policies, test by:

1. Upload an image through your admin panel
2. Copy the image URL from the database
3. Open the URL directly in a new browser tab (incognito/private mode)
4. Image should load without authentication

### 5. Fix Old Blogs with Base64 Images

If you have existing blogs with base64 cover images:

1. Go to admin panel
2. Edit each blog
3. Re-upload the cover image (it will now save to Supabase Storage)
4. Save the blog

## Quick Checklist

- [ ] `blog-images` bucket exists
- [ ] Bucket is set to **Public**
- [ ] **Public read access** policy is created (SELECT for anon role)
- [ ] Upload policy is created (INSERT for authenticated role)
- [ ] CORS is configured (or allow all)
- [ ] Test image upload works
- [ ] Test image URL loads in incognito browser
- [ ] Old blogs have been updated with new image uploads

## Troubleshooting

### Images still not showing?

1. **Check browser console** (F12):
   - Look for 403 Forbidden errors
   - Look for CORS errors

2. **Check image URL format**:
   - Should be: `https://xxxxx.supabase.co/storage/v1/object/public/blog-images/...`
   - If you see `data:image/...` (base64), the image wasn't uploaded

3. **Verify policies**:
   - Go to Storage → Policies → blog-images
   - Make sure "Public read access" policy exists
   - Check it's enabled for `anon` role

4. **Test direct URL access**:
   - Copy an image URL from your database
   - Open in incognito browser
   - Should load without login

### Common Issues

**Issue**: 403 Forbidden when accessing images
- **Fix**: Make sure "Public read access" policy exists and is enabled

**Issue**: CORS error
- **Fix**: Update CORS settings in Storage → Settings

**Issue**: Images work locally but not on Vercel
- **Fix**: Check environment variables are set in Vercel and redeploy

