# Multi-Sport Booking App — Project Overview

## Getting Started

### 1. Install Dependencies
Run the following in your project root:

```sh
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install axios react-query
npm install react-hook-form zod @hookform/resolvers
npm install @react-native-async-storage/async-storage
npm install react-native-paper react-native-vector-icons
npm install date-fns
npm install victory-native react-native-svg
npm install lottie-react-native
npm install i18next react-i18next react-native-localize
npm install @sentry/react-native
```

For Expo managed workflow, also run:
```sh
npx expo install react-native-screens react-native-safe-area-context expo-device expo-notifications expo-secure-store expo-calendar lottie-react-native react-native-svg
```

### 2. Start the Application

```sh
npx expo start
```

This will launch the Expo Dev Tools and let you run the app on a simulator or physical device.

---

## 1. Project Setup
- **Expo + TypeScript**
- **Dependencies:**
  - `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
  - `axios`, `react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`
  - `@react-native-async-storage/async-storage`, `react-native-paper`, `react-native-vector-icons`, `date-fns`, `victory-native`, `react-native-svg`
- **Navigation:**
  - NativeStack for auth, BottomTabs for user and vendor
- **Env Handling:**
  - `app.config.ts`, EAS secrets

## 2. Authentication & Role-Based Navigation
- Register/Login with role selection (`USER`/`VENDOR`)
- JWT stored in SecureStore (Expo)
- Role-based navigation: User flow vs Vendor flow
- Protected routes: Redirect unauthenticated users to login

## 3. User Features
- Home: Venue list, search, advanced filters, favorites
- Venue Detail: Info, sports, slots, reviews, booking
- Booking: Slot selection, summary, payment (Stripe), confirmation (QR, calendar)
- My Bookings: Upcoming/past bookings, cancel/reschedule, QR
- Wallet: Add/withdraw funds
- Coupons: View/add/remove
- Profile: Edit info, notification toggle, theme switch, language switch (English/Hindi/Telugu)
- Push notifications: Reminders, offers
- Reviews: Write/view, pagination
- Accessibility: Theming, font scaling, VoiceOver
- i18n: English, Hindi, Telugu

## 4. Vendor Features
- **Dashboard:**
  - Today’s bookings, this month’s revenue, upcoming slots, weekly revenue chart
- **Venue Management:**
  - List/add/edit venues (name, address, city, locationUrl, contactNumber, description, image upload, status chip)
- **Sport Management:**
  - List/add sports per venue, price per hour, dropdown
- **Slot Management:**
  - Bulk create slots (date range, days, time, duration, gap, price), list, toggle available, edit price, block date
- **Bookings:**
  - List bookings (filters, columns, payment status), export CSV
- **Earnings & Payouts:**
  - Payments table, period filter, total/commission/net, settlement status, export CSV, earnings chart
- **Policies & Discounts:**
  - Cancellation policy editor, special pricing rules (weekday/time window)
- **Notifications:**
  - Push notification composer
- **Settings:**
  - Profile, bank details, support contact, API key

## 5. Shared Contracts & Validation
- **Types:** User, Venue, Sport, VenueSport, Slot, Booking, Payment, Review
- **Enum → Chip mapping:** Slot, Payment, Venue status
- **Validation:** All forms use zod

## 6. Production Readiness
- **Error Reporting:** Sentry/Bugsnag integration (recommended)
- **Security:** JWT in SecureStore, HTTPS only, CORS restricted (backend)
- **Feature Flags:** Configurable via env or remote
- **OTA Updates:** Expo EAS Update
- **Testing:** @testing-library/react-native, Maestro/Detox for E2E
- **App Store:** Icon, splash, privacy policy, support links

## 7. API Integration (for all features)
- Replace mock data with real API calls
- Use shared types and zod validation for payloads/responses
- Handle errors gracefully and report to Sentry

---

**This document lists all major features, screens, flows, and readiness steps for your multi-sport booking app, from project setup to production launch.**

- For API integration, follow the structure and replace mocks with backend endpoints.
- For deployment, follow Expo EAS and app store guidelines.
- For further enhancements, revisit accessibility, analytics, and performance as needed.
