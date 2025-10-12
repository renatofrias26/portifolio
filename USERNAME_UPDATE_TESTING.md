# Username Update Feature - Testing Guide

## Quick Test Script

Follow these steps to verify both fixes are working:

### Test 1: Username Uniqueness Check

1. **Setup**: Have two users in the system (or create them):

   - User A: `johndoe`
   - User B: `janedoe`

2. **Test Steps**:

   ```
   1. Log in as User A (johndoe)
   2. Go to Profile Settings (/admin/profile)
   3. Click "Edit" button
   4. Try to change username to "janedoe" (User B's username)
   5. Click "Save Changes"
   ```

3. **Expected Result**:

   ```
   ❌ Error message: "Username is already taken"
   ✅ Username remains "johndoe"
   ✅ No database error or crash
   ```

4. **Test with unique username**:

   ```
   1. Still logged in as User A
   2. Change username to "john_doe_2024"
   3. Click "Save Changes"
   ```

5. **Expected Result**:
   ```
   ✅ Success message: "Profile updated successfully!"
   ✅ Username changes to "john_doe_2024"
   ✅ "View Portfolio" button updates immediately
   ```

---

### Test 2: View Portfolio Button Update

1. **Initial State**:

   ```
   - Logged in as any user
   - Current username: "johndoe"
   - "View Portfolio" button shows: /johndoe
   ```

2. **Update Username**:

   ```
   1. Go to Profile Settings
   2. Click "Edit"
   3. Change username to "johnny_d"
   4. Click "Save Changes"
   ```

3. **Expected Result** (Profile Page):

   ```
   ✅ Success message appears
   ✅ "View Portfolio" button updates to: /johnny_d
   ✅ NO PAGE REFRESH NEEDED
   ```

4. **Navigate to Dashboard**:

   ```
   1. Click "Back" or go to /admin/dashboard
   ```

5. **Expected Result** (Dashboard Page):

   ```
   ✅ "View Portfolio" button shows: /johnny_d
   ✅ Button fetches latest username on mount
   ```

6. **Test Button Click**:

   ```
   1. Click "View Portfolio" button
   ```

7. **Expected Result**:
   ```
   ✅ Navigates to: /johnny_d
   ✅ Portfolio page loads correctly
   ✅ URL in browser: /johnny_d
   ✅ NOT /johndoe (old username)
   ```

---

### Test 3: Username Validation

Test these invalid usernames should show error:

```typescript
❌ "AB"           → Too short (min 3 chars)
❌ "JohnDoe"      → Contains uppercase (must be lowercase)
❌ "john doe"     → Contains space
❌ "john@doe"     → Contains special char (@)
❌ "john.doe"     → Contains dot (.)
❌ "a".repeat(31) → Too long (max 30 chars)
```

Test these valid usernames should work:

```typescript
✅ "johndoe"
✅ "john_doe"
✅ "john-doe"
✅ "john123"
✅ "johndoe2024"
✅ "j0hn-d03_2024"
```

---

### Test 4: Edge Cases

#### Case A: Concurrent Username Change

```
User A tries: johndoe → janedoe
User B tries: sarahsmith → janedoe
(Both submit at same time)

Expected:
✅ Only ONE succeeds
❌ The other gets "Username is already taken"
```

#### Case B: Same Username (No Change)

```
Current: johndoe
Update to: johndoe (same)

Expected:
✅ Success (no conflict with self)
✅ No error about "already taken"
```

#### Case C: Case Sensitivity

```
Current: johndoe
Update to: JohnDoe

Expected:
✅ Auto-converts to: johndoe
✅ No error (same username, different case)
```

#### Case D: Rapid Updates

```
1. Update username to: johndoe2
2. Immediately update to: johndoe3
3. Check "View Portfolio" button

Expected:
✅ Button shows: johndoe3
✅ No stale data
✅ Latest value displayed
```

---

## Manual Testing Checklist

- [ ] Username uniqueness check prevents duplicates
- [ ] Clear error message when username taken
- [ ] View Portfolio button updates on profile page
- [ ] View Portfolio button updates on dashboard page
- [ ] Button click navigates to correct URL
- [ ] Portfolio loads at new URL
- [ ] Validation rejects invalid usernames
- [ ] Validation accepts valid usernames
- [ ] Lowercase auto-conversion works
- [ ] No page refresh needed for button update
- [ ] Concurrent updates handled correctly
- [ ] Same username update doesn't error

---

## Debugging Tips

### If "View Portfolio" button doesn't update:

1. **Check browser console**:

   ```javascript
   // Should see API call to /api/admin/profile
   // Response should include updated username
   ```

2. **Check Network tab**:

   ```
   - Look for GET /api/admin/profile
   - Response should have: { user: { username: "new_username" } }
   ```

3. **Check component state**:
   ```javascript
   // In AdminNavbar, add console.log:
   console.log("Current username:", currentUsername);
   ```

### If uniqueness check fails:

1. **Check database**:

   ```sql
   SELECT username, COUNT(*)
   FROM users
   GROUP BY username
   HAVING COUNT(*) > 1;

   -- Should return 0 rows (no duplicates)
   ```

2. **Check API response**:
   ```bash
   # Should return 400 status with error
   curl -X PUT http://localhost:3000/api/admin/profile \
     -H "Content-Type: application/json" \
     -d '{"username": "existing_username"}'
   ```

---

## Success Criteria

All tests pass when:

1. ✅ Cannot set duplicate username
2. ✅ View Portfolio button always shows current username
3. ✅ Username validation works correctly
4. ✅ No database constraint violations
5. ✅ No 404 errors when viewing portfolio
6. ✅ Smooth user experience with immediate feedback

---

## Test Data Setup

### Create test users:

```bash
# User 1
npx tsx -e "
import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });
(async () => {
  console.log('Check if johndoe exists...');
  const result = await sql\`SELECT username FROM users WHERE username = 'johndoe'\`;
  console.log('Existing users:', result.rows);
})();
"
```

### Reset username if needed:

```bash
# Reset to original username
npx tsx -e "
import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });
(async () => {
  await sql\`UPDATE users SET username = 'johndoe' WHERE email = 'john@example.com'\`;
  console.log('Username reset to johndoe');
})();
"
```

---

## Automated Test (Future)

```typescript
// Example Playwright test
describe("Username Update", () => {
  test("prevents duplicate usernames", async ({ page }) => {
    await page.goto("/admin/profile");
    await page.click('[data-testid="edit-profile"]');
    await page.fill('[name="username"]', "existing_username");
    await page.click('[type="submit"]');

    await expect(page.locator(".error")).toContainText(
      "Username is already taken",
    );
  });

  test("updates view portfolio button", async ({ page }) => {
    await page.goto("/admin/profile");
    await page.click('[data-testid="edit-profile"]');
    await page.fill('[name="username"]', "new_unique_username");
    await page.click('[type="submit"]');

    await expect(
      page.locator('[data-testid="view-portfolio"]'),
    ).toHaveAttribute("href", "/new_unique_username");
  });
});
```

---

Happy Testing! 🧪
