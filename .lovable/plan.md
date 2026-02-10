

## Plan: Fix 4 Issues

### 1. Sign-in button stuck in "Redirecting..." state after failed login

**Root cause:** In `SignInForm.tsx`, the button is disabled when `authLoading` is true (line 102). `authLoading` comes from `useAuthRedirect`, which returns `isLoading: true` when `isAuthenticated && user && !userRole`. After a failed sign-in, `setIsLoading(false)` runs correctly in the `finally` block, BUT the `useAuthRedirect` hook's `isLoading` can get stuck as `true` if there's a brief authenticated state before the error is processed, or if `hasRedirected.current` was set but sign-in actually failed.

**Fix:**
- In `SignInForm.tsx`, only use the local `isLoading` state for the button disabled/text state -- remove `authLoading` from the button logic entirely
- The redirect will still happen automatically via the `useAuthRedirect` hook when sign-in succeeds, but a failed sign-in won't lock the button

**File:** `src/components/SignInForm.tsx`

---

### 2. Remove "Services" and "Shop" links from navbar

These links are redundant since both sections are already on the home page.

**Changes:**
- **Header.tsx**: Remove the desktop nav section (lines 72-79) with the Services and Shop buttons
- **MobileNav.tsx**: Remove the Services, Shop, and Cart links (lines 54-79) from the mobile menu. Keep Home, Dashboard (authenticated), Sign in/up, Sign out

**Files:** `src/components/Header.tsx`, `src/components/mobile/MobileNav.tsx`

---

### 3. Footer only on Home page and FAQs page

Currently `ServieLayout` always renders `<Footer />`. We need to make it conditional.

**Changes:**
- Add a `showFooter` prop to `ServieLayout` (default `false`)
- Only pass `showFooter={true}` on the `/` (Home) and `/faqs` (FAQs) routes in `App.tsx`
- All other routes keep the default (no footer)

**Files:** `src/components/layout/ServieLayout.tsx`, `src/App.tsx`

---

### 4. Language selector changes entire site language

Currently the `LocalizationProvider` stores the language but never calls `i18n.changeLanguage()`. Only 3 pages use `useTranslation()` from react-i18next, while most pages use hardcoded English text.

**Changes:**
- In `LangCurrencySelector.tsx`'s `LocalizationProvider`, call `i18n.changeLanguage(lang)` whenever `setLanguage` is called, syncing the localization context with the i18n system
- Add many more translation keys to `src/i18n.ts` covering: Hero section, Header/Footer text, Sign In/Up page text, common UI labels (Welcome back, Email, Password, Remember me, etc.)
- Update key components to use `useTranslation()` with `t()` instead of hardcoded strings:
  - `Header.tsx` (Dashboard, Sign out)
  - `Footer.tsx` (all section headings and links)
  - `SignInForm.tsx` (form labels, button text)
  - `SignIn.tsx` (Welcome back, sign in text)
  - `Hero.tsx` (hero title, subtitle, CTA)
  - `MobileNav.tsx` (menu items)
- Store selected language in localStorage so it persists across refreshes

**Files:** `src/components/LangCurrencySelector.tsx`, `src/i18n.ts`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/SignInForm.tsx`, `src/pages/SignIn.tsx`, `src/components/Hero.tsx`, `src/components/mobile/MobileNav.tsx`

---

## Technical Summary

| Issue | File(s) | Change |
|-------|---------|--------|
| Button stuck after failed sign-in | `SignInForm.tsx` | Remove `authLoading` from button disabled/label logic |
| Remove Services/Shop from navbar | `Header.tsx`, `MobileNav.tsx` | Delete nav links |
| Footer only on Home + FAQs | `ServieLayout.tsx`, `App.tsx` | Add `showFooter` prop, pass only on `/` and `/faqs` |
| Language selector changes site language | `LangCurrencySelector.tsx`, `i18n.ts`, 6+ components | Sync i18n, add translations, use `t()` in components |

