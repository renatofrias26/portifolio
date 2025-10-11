# Quick Start Guide - Multi-User Portfolio System

## 🚀 Getting Started

### 1. Create Your First User Account

Visit the registration page:

```
http://localhost:3000/admin/register
```

Fill in:

- **Name**: Your full name (e.g., "John Doe")
- **Username**: Your unique username (e.g., "johndoe") - this will be your portfolio URL
- **Email**: Your email address
- **Password**: At least 8 characters

Click "Create Account" - you'll be automatically logged in!

### 2. Upload Your Resume

After registration, you'll be on the dashboard:

1. Click the **"Upload Resume"** tab (should be default)
2. Drag and drop your PDF resume or click to select
3. Wait for AI to parse your resume (this may take 30-60 seconds)
4. Your resume data will be extracted automatically!

### 3. Review and Edit

1. Switch to the **"Manage Versions"** tab
2. You'll see your uploaded resume version
3. Click **"Preview"** to see how it looks
4. Click **"Edit"** to make any changes to the parsed data
5. Click **"Publish"** when you're ready to go live!

### 4. View Your Portfolio

Your portfolio is now live at:

```
http://localhost:3000/{your-username}
```

For example: `http://localhost:3000/johndoe`

### 5. Customize Your Profile

1. Go to the **"Profile"** tab in the dashboard
2. Click **"Edit"**
3. Update your name or username
4. Click **"Save Changes"**

Your portfolio URL will update if you change your username!

## 🎯 Key Features

### Multiple Resume Versions

- Upload as many resume versions as you want
- Only one can be published at a time
- Archive old versions to keep things organized

### Version Management

- **Published** (green badge): This version is live on your portfolio
- **Draft** (gray badge): Not published yet
- **Archived** (yellow badge): Hidden from version list

### Actions per Version:

- 👁️ **Preview**: See how it looks
- ✏️ **Edit**: Modify the data
- 🚀 **Publish**: Make it live (unpublishes others)
- 📦 **Archive**: Hide from active versions
- 📤 **Unarchive**: Restore archived version

## 📱 Portfolio Features

Your public portfolio includes:

- **Hero Section**: Name, title, profile image
- **About**: Professional summary
- **Experience**: Work history with highlights
- **Skills**: Categorized technical skills
- **Projects**: Portfolio projects with links
- **Contact**: Email and social links
- **AI Chat**: Visitors can chat about your resume!

## 👥 Multi-User Features

### Data Isolation

- You only see YOUR resume versions
- You can only edit YOUR data
- Other users cannot access your information

### Unique URLs

Each user gets their own URL:

- User 1: `/johndoe`
- User 2: `/janedoe`
- User 3: `/bobsmith`

### Profile Management

- Change your username anytime
- Update your display name
- Portfolio URL automatically updates

## 🔐 Security

- Passwords are hashed (bcrypt)
- Session-based authentication (NextAuth.js)
- All API routes require authentication
- User verification on every database query
- SQL injection protection

## 💡 Tips & Tricks

### Resume Upload Tips

1. **Use a well-formatted PDF** for best AI parsing results
2. **Include clear sections**: Experience, Education, Skills, Projects
3. **Use bullet points** for achievements
4. **List technologies** you've used

### Username Best Practices

- **Keep it professional**: This is your portfolio URL!
- **Short and memorable**: Easy to share
- **Consistent with social media**: Use same username across platforms
- Examples: `johndoe`, `jane-smith`, `bob_developer`

### Version Management

1. Upload new resume → Edit → Preview → Publish
2. Keep 2-3 recent versions (archive old ones)
3. Create different versions for different job types

### Profile Optimization

- Use your full professional name
- Match username to LinkedIn/GitHub
- Keep portfolio data up to date

## 🌐 Sharing Your Portfolio

Share your portfolio URL:

```
https://yourdomain.com/{username}
```

Perfect for:

- ✉️ Email signatures
- 🔗 LinkedIn profile
- 💼 Job applications
- 🐦 Social media bios
- 📧 Cover letters

## 🎨 Customization (Future)

Coming soon:

- Custom themes and colors
- Profile images/avatars
- Social media links in profile
- Custom domains
- Analytics dashboard

## ❓ FAQ

**Q: Can I change my username?**
A: Yes! Go to Profile tab → Edit → Change username. Your portfolio URL will update automatically.

**Q: How many resume versions can I have?**
A: Unlimited! But only one can be published at a time.

**Q: Can other users see my drafts?**
A: No! Only you can see and edit your resume versions.

**Q: What if I forget my password?**
A: Contact your admin or use the password reset feature (coming soon).

**Q: Can I delete my account?**
A: Contact your admin. All your data will be deleted (cascade delete).

**Q: Is my data safe?**
A: Yes! Passwords are hashed, sessions are encrypted, and data is isolated per user.

## 🐛 Troubleshooting

### "Username already taken"

- Try a different username
- Add numbers: `johndoe2`, `johndoe_dev`

### "Resume upload failed"

- Check file is PDF format
- Ensure file is under 10MB
- Try re-uploading

### "Cannot access portfolio"

- Make sure you've published at least one version
- Check username is correct in URL
- Try logging out and back in

### "Changes not showing"

- Click "Publish" on the version you edited
- Wait 60 seconds (ISR cache)
- Hard refresh the page (Cmd+Shift+R)

## 📞 Support

Need help? Check:

1. `/docs/MULTI_USER_ARCHITECTURE.md` - Technical details
2. `/docs/IMPLEMENTATION_SUMMARY.md` - System overview
3. GitHub Issues - Report bugs

---

**Happy Portfolio Building! 🎉**
