# Owner Can View Private Profile - Feature Documentation

## Overview

Added functionality so that logged-in users can view their own portfolio even when it's set to private. This allows profile owners to preview how their portfolio looks while keeping it hidden from the public.

## How It Works

### For Public Profiles (`is_public = true`)

- ✅ Visible to everyone
- ✅ Appears in profiles directory
- ✅ No restrictions

### For Private Profiles (`is_public = false`)

**When NOT logged in as owner:**

- ❌ Shows 404 error
- ❌ Not accessible
- ❌ Not listed in directory

**When logged in as owner:**

- ✅ Can view their own private portfolio
- ✅ Shows yellow banner: "🔒 Private Profile - Only you can see this page"
- ✅ Banner includes link to make profile public
- ✅ Full portfolio visible to owner only

## Implementation Details

### New Database Query Function

**File:** `/lib/db/queries.ts`

Added `getPublishedResumeByUsernameForOwner()`:

- Similar to `getPublishedResumeByUsername()`
- Does NOT filter by `is_public`
- Used only when viewing your own profile
- Returns `user_id` to verify ownership

```typescript
export async function getPublishedResumeByUsernameForOwner(username: string) {
  // Returns data regardless of is_public status
  // Only used when logged-in user matches the profile owner
}
```

### Page Logic

**File:** `/app/[username]/page.tsx`

1. **Check Authentication**: Get the current session
2. **Get User Data**: Fetch the profile owner's info
3. **Verify Ownership**: Compare session user ID with profile owner ID
4. **Choose Query**:
   - If owner: Use `getPublishedResumeByUsernameForOwner()` (shows private)
   - If not owner: Use `getPublishedResumeByUsername()` (public only)
5. **Show Banner**: Display privacy banner if viewing own private profile

### Privacy Banner

When viewing your own private profile:

```
🔒 Private Profile - Only you can see this page. Others will see a 404 error. Make it public
```

- Yellow background for visibility
- Clear messaging about privacy status
- Direct link to settings to make public
- Only shows to profile owner

## User Experience

### Scenario 1: Public Profile Owner

1. Set profile to public in settings
2. Visit `/your-username`
3. See normal portfolio (no banner)
4. Anyone can access this URL

### Scenario 2: Private Profile Owner

1. Set profile to private in settings
2. Visit `/your-username` **while logged in**
3. See yellow privacy banner at top
4. See full portfolio below banner
5. Can preview how it looks

### Scenario 3: Private Profile Visitor

1. Another user sets profile to private
2. You try to visit `/their-username`
3. See 404 "Page Not Found"
4. No indication that profile exists

## Benefits

1. **Preview Private Profiles**: Test how your portfolio looks before making it public
2. **No Confusion**: Clear banner explains why you can see it
3. **Quick Toggle**: Link to settings makes it easy to change privacy
4. **Security**: Others still get 404 on private profiles
5. **Seamless UX**: No need to toggle public just to preview

## Testing

### Test as Owner with Private Profile

1. Login to your account
2. Go to Profile Settings (`/admin/profile`)
3. Uncheck "Public Profile"
4. Click "Save Changes"
5. Visit your portfolio (`/your-username`)
6. **Expected**:
   - ✅ Yellow banner appears
   - ✅ Full portfolio visible
   - ✅ "Make it public" link works

### Test as Visitor

1. Open incognito/private browser window
2. Visit the same private profile URL
3. **Expected**:
   - ❌ 404 "Page Not Found"
   - ❌ No portfolio content
   - ❌ No indication profile exists

### Test Public Profile

1. Set profile to public in settings
2. Visit your portfolio while logged in
3. **Expected**:
   - ✅ No banner appears
   - ✅ Portfolio visible
4. Visit in incognito window
5. **Expected**:
   - ✅ Portfolio visible
   - ✅ Same as logged-in view

## Files Modified

1. **`/lib/db/queries.ts`**

   - Added `getPublishedResumeByUsernameForOwner()` function

2. **`/app/[username]/page.tsx`**
   - Added session authentication check
   - Added ownership verification
   - Added conditional query selection
   - Added privacy banner component

## Code Changes Summary

```typescript
// Check if user owns this profile
const session = await getServerSession(authOptions);
const ownerData = await getUserByUsername(username);
const isOwner =
  session?.user?.id && ownerData?.id === parseInt(session.user.id);

// Use appropriate query
const data = isOwner
  ? await getPublishedResumeByUsernameForOwner(username) // Owner can see private
  : await getPublishedResumeByUsername(username); // Others see public only

// Show banner for private profiles
const isPrivateView = isOwner && ownerData?.is_public === false;
```

## Security Considerations

1. **Session Verification**: Uses NextAuth server session, not client-side
2. **ID Comparison**: Compares integer IDs, not usernames
3. **No Data Leakage**: Private profiles still return 404 for non-owners
4. **Query Separation**: Different queries for owner vs public access
5. **Dynamic Rendering**: No caching of private profile states

## Future Enhancements

Potential improvements:

1. **Admin Override**: Allow admins to view any private profile
2. **Share Links**: Generate temporary share links for private profiles
3. **Preview Mode**: Toggle between "public view" and "owner view"
4. **Analytics**: Track when owner views their own private profile
5. **Reminder**: Periodic reminder if profile has been private for X days
