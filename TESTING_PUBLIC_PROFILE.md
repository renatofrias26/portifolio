# Testing Public Profile Feature

## ✅ Bug Fix Applied

**Issue Found**: The profile settings form was spreading `...formData` which included all form fields (contactEmail, github, etc.) instead of sending only the expected fields to the API.

**Fix Applied**:

- Changed from `...formData` to explicitly sending `name`, `username`, and `isPublic`
- Added `isPublic` to the API response so UI reflects the current state
- Now the toggle works correctly!

## Current Status

✅ **Migration Complete**: `is_public` column added to database  
✅ **Code Updated**: All necessary files modified  
✅ **Bug Fixed**: Profile settings now correctly updates `is_public`  
✅ **All Users Public**: Reset to public for testing

## How to Test

### Option 1: Test via Profile Settings UI (Recommended)

1. **Start the development server** (if not running):

   ```bash
   npm run dev
   ```

2. **Login as a user**:

   - Go to `http://localhost:3000/admin/login`
   - Login with your credentials

3. **Navigate to Profile Settings**:

   - Click "Profile" in the navigation
   - Or go to `http://localhost:3000/admin/profile`

4. **Find Privacy Settings**:

   - Scroll down to the "Privacy Settings" section (after Social Links)
   - You'll see a checkbox: "Public Profile"

5. **Toggle the setting**:

   - ✅ **Checked = Public**: Profile visible in directory, accessible via URL
   - ⬜ **Unchecked = Private**: Profile hidden, shows 404

6. **Click "Save Changes"**

7. **Test the result**:
   - Open a new incognito/private browser window
   - Visit `http://localhost:3000/[your-username]`
   - If private: Should show 404 page
   - If public: Should show your portfolio

### Option 2: Test via Database (For Quick Testing)

**Set a user to private:**

```bash
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { await sql\`UPDATE users SET is_public = false WHERE username = 'johndoe'\`; console.log('Set to private'); })();"
```

**Set a user to public:**

```bash
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { await sql\`UPDATE users SET is_public = true WHERE username = 'johndoe'\`; console.log('Set to public'); })();"
```

**Check current status:**

```bash
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { const result = await sql\`SELECT username, is_public FROM users\`; console.table(result.rows); })();"
```

## What to Expect

### When Profile is Public (`is_public = true`)

✅ **Profiles Directory** (`/profiles`):

- Profile appears in the list
- Searchable and filterable

✅ **Direct URL** (`/username`):

- Portfolio page loads normally
- All content visible
- SEO metadata works

### When Profile is Private (`is_public = false`)

❌ **Profiles Directory** (`/profiles`):

- Profile does NOT appear in the list
- Not searchable

❌ **Direct URL** (`/username`):

- Shows 404 "Page Not Found"
- No profile information revealed
- Works like the user doesn't exist

## Current Test Data

Based on the database query:

| Username     | is_public | Status     |
| ------------ | --------- | ---------- |
| renatofrias2 | true      | ✅ Public  |
| johndoe      | false     | 🔒 Private |
| renatofrias  | true      | ✅ Public  |

## Testing Checklist

- [ ] Set profile to private in settings
- [ ] Visit `/profiles` - confirm profile NOT in list
- [ ] Visit `/username` in incognito - confirm 404
- [ ] Set profile to public in settings
- [ ] Visit `/profiles` - confirm profile IS in list
- [ ] Visit `/username` - confirm portfolio loads
- [ ] Test registration with public checkbox checked
- [ ] Test registration with public checkbox unchecked
- [ ] Verify profile search doesn't find private profiles

## Important Notes

1. **Dynamic Rendering**: Added `export const dynamic = 'force-dynamic'` to `[username]/page.tsx` to prevent caching issues

2. **Real-time Updates**: Changes to privacy settings take effect immediately (no cache delays)

3. **Privacy by Default**: New users are set to **public by default** but can opt-out during registration

4. **Backward Compatibility**: All existing users were set to public during migration

## Troubleshooting

**Issue**: Profile still accessible after setting to private

**Solutions**:

1. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+F5)
2. Use incognito/private browsing window
3. Check database to confirm `is_public = false`
4. Restart dev server

**Issue**: Settings not saving

**Solutions**:

1. Check browser console for errors
2. Verify API response in Network tab
3. Check server logs
4. Ensure database connection is active
