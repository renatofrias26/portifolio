# 🎯 Quick Setup: Vercel Blob Storage

## Step 1: Create Blob Storage

1. **Go to Vercel Dashboard**

   - Visit: [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)

2. **Create Blob Storage**

   - Find **"Blob"** under "Vercel First-Party"
   - Click **"Create"**
   - Name it: `portfolio-files` (or your preference)
   - Click **"Create"**

3. **Copy the Token**
   - After creation, you'll see `BLOB_READ_WRITE_TOKEN`
   - Copy this token

## Step 2: Update .env.local

Add the token to your `.env.local` file:

```bash
# Vercel Blob Storage (for PDF uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
```

## Step 3: Restart Dev Server

```bash
# Stop the server (Ctrl+C if running)
pnpm dev
```

## Step 4: Test Upload

1. Go to: http://localhost:3000/admin/login
2. Login with your credentials
3. Click "Upload Resume" tab
4. Drag & drop a PDF resume OR click to browse
5. Click "Upload & Parse with AI"
6. Wait ~10-30 seconds for AI processing
7. See success message! ✨

## ✅ What You Should See

**Success Message:**

```
✅ Success!
Resume uploaded and parsed successfully

Version: 1
Status: Draft (not published yet)
[View uploaded PDF link]
```

## 🔍 Behind the Scenes

When you upload:

1. PDF → Uploads to Vercel Blob
2. Text extracted from PDF
3. Sent to OpenAI GPT-4o-mini
4. AI structures the data
5. Saved to Neon database

## 📦 Complete .env.local Example

```bash
# OpenAI API Key
OPENAI_API_KEY="sk-proj-xxxxx"

# Neon Database
POSTGRES_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-from-openssl"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
```

## ⚠️ Troubleshooting

### "Blob storage not configured"

- Make sure `BLOB_READ_WRITE_TOKEN` is in `.env.local`
- Restart your dev server

### "OpenAI API error"

- Verify `OPENAI_API_KEY` is correct
- Check you have credits in your OpenAI account

### Upload takes too long

- Normal! AI processing can take 10-30 seconds
- Don't refresh the page

### File too large

- Maximum file size: 10MB
- Compress your PDF if larger

## 🎉 Success!

Once you see the success message, your resume is:

- ✅ Uploaded to Blob storage
- ✅ Parsed by AI
- ✅ Stored in database
- ✅ Ready for the next phase (preview & publish)

---

**Next**: See [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md) for what we built!
