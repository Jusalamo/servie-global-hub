

## Fix: Sign-in should redirect to the correct role-specific dashboard

### Problem
When a seller (or any role) signs in, they aren't reliably redirected to their role-specific dashboard. Two root causes:

1. **The Sign-In page has a misleading "role selector"** that does absolutely nothing -- it's never sent to the backend. Users think they need to pick "seller" to get to the seller dashboard, but the system already knows their role from the `user_roles` table.

2. **Race condition in redirect logic**: After sign-in succeeds, `SignIn.tsx` redirects to `/dashboard`, but the `useAuthRedirect` hook may not have fetched the role yet, causing the user to see a loading spinner or land on the wrong page.

### Solution

**1. Remove the fake role selector from Sign-In page** (`src/pages/SignIn.tsx`)
- Delete the `UserRoleSelector` component and "Change Role" button from the sign-in form
- Users sign in with email + password only -- the system routes them based on their actual role in the database

**2. Fix the redirect after sign-in** (`src/hooks/useAuthRedirect.ts`)
- Add a retry/wait mechanism: when `userRole` is null but user is authenticated, wait briefly for role to load before giving up
- This handles the timing gap between `signIn` completing and `fetchUserRole` resolving

**3. Make `ProtectedRoute` on `/dashboard` do role-based redirect** (`src/components/ProtectedRoute.tsx`)
- When accessing `/dashboard` (no specific role), redirect to the user's role-specific dashboard based on `userRole` from AuthContext
- This is a safety net so even if `useAuthRedirect` doesn't fire, the user still lands correctly

### Files to change

| File | Change |
|------|--------|
| `src/pages/SignIn.tsx` | Remove role selector UI, keep simple email/password sign-in |
| `src/hooks/useAuthRedirect.ts` | Add retry logic when role is loading; ensure redirect fires reliably |
| `src/pages/dashboard/UserDashboard.tsx` | Add direct role-based redirect as fallback |

### Technical Details

In `useAuthRedirect.ts`, the current code checks `if (isAuthenticated && user && userRole)` but `userRole` is loaded asynchronously via `setTimeout(..., 0)` in AuthContext. The fix adds a polling interval that retries for up to 3 seconds, ensuring the role has time to load before redirecting.

In `UserDashboard.tsx`, add a `useEffect` that watches `userRole` and navigates as soon as it's available, as a second safety net.

The sign-in page will become simpler and less confusing -- users just enter credentials and the system handles routing automatically.
