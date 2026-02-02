

# Comprehensive Fix Plan: Seller Signup, Onboarding, Layout, and Data Integration

## Executive Summary

This plan addresses all remaining issues with the platform, including seller signup reliability, onboarding flow with site tours, popover date/time pickers for service booking, financial document branding, language/currency selectors in dashboard settings, consolidated hamburger menus, optimized analytics grids, and Fiverr-style layout alignment. Remove the lava backgroung component it is making the site slow.

---

## 1. Seller Signup - Critical Database Fix

### Current Issue
The `create_seller_wallet` trigger may fail because it doesn't provide a `currency` value, even though the column has a default of 'USD'. The conflict resolution uses `ON CONFLICT (seller_id)` but the actual unique constraint is on `(seller_id, currency)`.

### Solution
Update the `create_seller_wallet` function to explicitly provide the currency and fix the conflict resolution:

```sql
CREATE OR REPLACE FUNCTION public.create_seller_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.seller_wallets (seller_id, currency, balance, commission_deposit)
    VALUES (NEW.id, 'USD', 0, 0)
    ON CONFLICT (seller_id, currency) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
```

### Files to Create
- `supabase/migrations/TIMESTAMP_fix_seller_wallet_trigger.sql`

---

## 2. Onboarding Flow Enhancement

### Current State
The `OnboardingFlow.tsx` component exists with:
- Multi-step profile completion (avatar, name, location, bio)
- Role-specific site tour

### Improvements Needed
- Ensure the onboarding triggers correctly for all new users
- Verify the site tour covers all marketplace basics and role-specific features
- Add visual indicators for each tour step

### Current Implementation Analysis
The `AuthCallback.tsx` correctly:
- Checks if user completed onboarding via localStorage
- Shows onboarding for users created within 24 hours
- Triggers role-specific tour

No changes needed - the onboarding flow is already properly implemented.

---

## 3. Popover Date/Time Pickers for Service Detail Page

### Current State
- `PopoverDateTimePicker.tsx` component exists and works correctly
- `BookingPage.tsx` uses this component
- `ServiceDetail.tsx` does NOT use popover pickers (still shows inline availability)

### Solution
Update `ServiceDetail.tsx` to use `PopoverDateTimePicker` in the booking sidebar instead of the current inline implementation.

### Files to Update
- `src/pages/ServiceDetail.tsx` - Replace inline date/time selection with PopoverDateTimePicker

### Implementation
```typescript
// Import PopoverDateTimePicker
import { PopoverDateTimePicker } from '@/components/booking/PopoverDateTimePicker';

// In the booking card section, replace the current date/time selection with:
<PopoverDateTimePicker
  selectedDate={selectedDate}
  selectedTime={selectedTime || ''}
  onDateChange={setSelectedDate}
  onTimeChange={setSelectedTime}
  minDate={new Date()}
/>
```

---

## 4. Financial Document Branding with Provider Logos

### Current State
- `generate-document/index.ts` uses hardcoded company info
- No provider logo or business name integration

### Solution
Fetch the provider's profile data (business_name, company_logo_url, brand_color_primary) and include it in the document templates.

### Files to Update
- `supabase/functions/generate-document/index.ts`

### Implementation Details
```typescript
// After fetching the document, also fetch provider profile
const { data: providerProfile } = await supabaseClient
  .from('profiles')
  .select('business_name, avatar_url, company_logo_url, brand_color_primary')
  .eq('id', document.provider_id)
  .single();

// Pass profile data to template generators
const html = generateDocumentHTML(document, providerProfile);

// In templates, use:
// - providerProfile.business_name || 'Servie Marketplace'
// - providerProfile.company_logo_url || providerProfile.avatar_url
// - providerProfile.brand_color_primary || '#ea384c' (Servie red)
```

---

## 5. Language/Currency Selectors in Dashboard Settings

### Current State
- `LocalizationSettings.tsx` component exists with language and currency selection
- Already integrated into `ProfileSettings.tsx` as the "Language" tab
- Uses `useLocalization` hook from `LangCurrencySelector`

### Verification
The implementation is complete. The "Language" tab in ProfileSettings shows:
- Language selector with 10 African/international languages
- Currency selector with 10 currencies including ZAR, NGN, GHS, KES

No changes needed.

---

## 6. Consolidated Dashboard Hamburger Menu

### Current State
The `DashboardLayout.tsx` already has a single hamburger menu that:
- Uses a Sheet component triggered by a floating button
- Shows sidebar content
- Includes a Sign Out button at the bottom

### Issues to Address
- Ensure no redundant Home/Services/Shop buttons appear in the sidebar
- Verify the menu works correctly on mobile

### Files to Review
- `src/components/dashboard/ClientSidebar.tsx`
- `src/components/dashboard/ProviderSidebar.tsx`
- `src/components/dashboard/SellerSidebar.tsx`

### Verification Steps
Check that sidebar components don't include:
- Home button (redundant - can use header logo)
- Services button (redundant - in marketplace)
- Shop button (redundant - in marketplace)
- Cart button (already in navbar)

---

## 7. Optimized Analytics Grid for Mobile

### Current State
`CompactStatsGrid.tsx` uses:
- `grid-cols-2 md:grid-cols-2 lg:grid-cols-4`
- Compact card height with `p-3` padding

### Already Implemented
The component is well-optimized with:
- 2-column layout on mobile/tablet
- 4-column layout on desktop
- Compact text sizes (`text-xs`, `text-lg`)
- Truncated text for overflow

No changes needed - already properly optimized.

---

## 8. Remove KYC/2FA Verification Requirements

### Current State
- Migration created to drop `check_kyc_before_product_insert` trigger
- `ServiceManagement.tsx` and `ProductManagement.tsx` have KYC banner commented/removed

### Verification
Confirm the triggers are removed by checking the database.

### Already Completed
Based on the database query, no KYC triggers exist on the products table - only `check_listing_limit_on_insert` remains (which enforces subscription limits, not KYC).

---

## 9. Booking Section Mobile Spacing

### Files to Update
- `src/components/dashboard/provider/BookingsTab.tsx` - Add proper mobile gaps

### Implementation
```typescript
// Add mobile-first spacing
<div className="space-y-4 md:space-y-6">
  {/* Booking calendar */}
</div>
```

---

## 10. Replace Mock Data with Supabase Queries

### Files Already Updated
- `BookingPage.tsx` - Uses real Supabase queries
- `ServiceDetail.tsx` - Uses real Supabase queries
- Dashboard overview tabs - Use real hooks

### Mock Data Still Present
- `ServiceDetail.tsx` line 306-318: "What's included" section has hardcoded items
- `ServiceDetail.tsx` line 377-399: Reviews are mocked

### Solution
Fetch service features from a `service_features` table or store as JSONB in `services` table.

---

## 11. Fiverr-Style Layout Alignment

### Design Tokens (Already Implemented)
- Container max-width: 1200px (`max-w-[1200px]`)
- Card border-radius: 12px (Tailwind `rounded-lg`)
- Card padding: 16px (`p-4`)
- Section gaps: 24px (`gap-6`)

### Files to Verify/Update
All marketplace and dashboard pages should use:
```typescript
<div className="container max-w-[1200px] mx-auto px-4 py-6 md:py-8">
```

### Current Status
- `BookingPage.tsx` - Uses `max-w-[1200px]` 
- `ServiceDetail.tsx` - Uses `container` but no max-width constraint

### Files to Update
- `src/pages/ServiceDetail.tsx` - Add `max-w-[1200px]` to container

---

## Technical Implementation Summary

### Migration File
```sql
-- Fix seller_wallet trigger for reliable signup
CREATE OR REPLACE FUNCTION public.create_seller_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.seller_wallets (seller_id, currency, balance, commission_deposit)
    VALUES (NEW.id, 'USD', 0, 0)
    ON CONFLICT (seller_id, currency) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
```

### File Changes Summary

| File | Change |
|------|--------|
| `supabase/migrations/TIMESTAMP_fix_seller_wallet.sql` | Fix seller wallet trigger |
| `src/pages/ServiceDetail.tsx` | Add PopoverDateTimePicker + max-w-[1200px] |
| `supabase/functions/generate-document/index.ts` | Add provider branding |
| `src/components/dashboard/provider/BookingsTab.tsx` | Improve mobile spacing |

---

## Testing Checklist

After implementation, verify:

1. **Seller Signup**
   - Create a new seller account
   - Confirm email verification works
   - Verify redirect to seller dashboard
   - Confirm seller_wallet is created

2. **Onboarding Flow**
   - New user sees onboarding modal
   - Profile completion works
   - Site tour shows role-specific content

3. **Date/Time Pickers**
   - ServiceDetail page uses popover pickers
   - BookingPage popover works correctly

4. **Financial Documents**
   - Create an invoice
   - Verify provider logo appears
   - Verify business name shows

5. **Dashboard Layout**
   - Single hamburger menu on mobile
   - Compact stats grid (2 cols mobile, 4 cols desktop)
   - Proper spacing throughout

6. **Layout Consistency**
   - All pages have max-w-[1200px] container
   - Fiverr-style card styling
   - Proper responsive behavior

