# Upfolio Navigation Guide

## How to Access All Features

### Main Navigation (Top Right User Menu)

Click on your **profile avatar/name** in the top-right corner to access:

1. **Dashboard** - Main hub for resume management

   - Upload Resume tab
   - Versions tab (manage published/draft versions)

2. **Job Assistant** - AI-powered job application tools

   - Paste job URLs or descriptions
   - Generate custom cover letters
   - Tailor your resume for specific roles
   - Track saved applications

3. **Profile Settings** - Customize your portfolio

   - Edit personal information
   - Manage tagline and AI context
   - Update username
   - Toggle public/private visibility
   - Account management (password, email, delete account)

4. **View Portfolio** - See your live public portfolio (top right, purple button)

5. **Sign Out** - Log out of your account

### Quick Actions on Dashboard

When you first upload a resume, you'll see a **Welcome Banner** with quick links to:

- Edit Profile
- Job Assistant

### Navigation from Any Admin Page

The **AdminNavbar** appears on all admin pages with:

- **Back button** (when on Profile or Job Assistant pages)
- **Logo** - Always visible
- **Page title** - Shows current page (Dashboard, Profile Settings, Job Assistant)
- **View Portfolio button** - Purple gradient button to see your live portfolio
- **User menu dropdown** - Access all features

## Page Structure

```
/                          → Landing page (public)
/try-now                   → Guest preview feature
/profiles                  → Browse public portfolios

/admin/login               → Login
/admin/register            → Sign up
/admin/dashboard           → Main dashboard (Upload & Versions)
/admin/profile             → Profile settings & customization
/admin/job-assistant       → AI job application assistant

/{username}                → Your public portfolio (e.g., /johndoe)
```

## Navigation Flow Examples

### Scenario 1: Just signed up

1. Start at: Dashboard
2. Click avatar → "Profile Settings" → Set up your info
3. Click avatar → "Job Assistant" → Start applying to jobs
4. Click "View Portfolio" → See your public page

### Scenario 2: Updating resume

1. Dashboard → Upload Resume tab → Upload new PDF
2. Automatic switch to Versions tab → Manage versions
3. Click avatar → "Profile Settings" → Fine-tune details
4. Click "View Portfolio" → Verify changes

### Scenario 3: Job hunting

1. Click avatar → "Job Assistant"
2. Paste job URL → Generate materials
3. Save applications → Track progress
4. Back button → Return to Dashboard

## Design Philosophy

**Minimal, Context-Aware Navigation:**

- Navigation options adapt based on current page
- User menu shows only relevant links (hides current page)
- Back button only appears on sub-pages (Profile, Job Assistant)
- View Portfolio button always accessible for quick previews

**Mobile-Friendly:**

- Logo and title on mobile
- Back button compact on small screens
- User menu fully responsive

## Tips

- **Quick Preview**: Use "View Portfolio" button to see changes without leaving admin area
- **Username in URL**: Your portfolio URL is `upfolio.com/yourusername`
- **Private Profiles**: You can always view your own portfolio, even if it's set to private
- **Version Management**: Only one version can be published at a time
- **Resume Versions**: Keep drafts private, publish when ready

---

**Navigation is now flash-free! 🚀**  
Server-side authentication eliminates the login page flash completely.
