# Supreme Autoparts Customer Account System - Changelog and Documentation

This document provides a comprehensive overview of the newly implemented customer account system for the Supreme Autoparts e-commerce platform. It details the enhanced features, architectural modifications, and essential setup instructions.

## 1. Overview

The Supreme Autoparts e-commerce platform, built on an Express/React stack, has undergone significant enhancements to its customer account functionalities. The update introduces advanced authentication mechanisms, substantial improvements to the customer dashboard, and several new, dedicated features including wishlists, notifications, product reviews, and a customer-admin messaging system.

## 2. Key Features Implemented

### 2.1. Enhanced Authentication

The authentication system has been upgraded to provide a more secure and flexible user experience. Key improvements include:

*   **Password Hashing:** The previous SHA-256 hashing algorithm has been replaced with `bcrypt` for superior password security.
*   **Two-Factor Authentication (2FA):** Users can now set up and verify 2FA, adding an extra layer of security to their accounts.
*   **Social Login Integration:** Seamless login and account linking capabilities have been introduced through integration with Google, Facebook, and Microsoft OAuth providers.
*   **Email Verification:** A new flow ensures that user email addresses are verified upon registration or update.
*   **Forgot/Reset Password:** A fully functional system for password recovery has been implemented.
*   **Login History:** The system now tracks user login attempts and sessions, enhancing security monitoring.

### 2.2. Customer Dashboard Improvements

The `/dashboard` page has been refined to offer a more intuitive and accessible user experience. It now features quick links that provide direct access to the newly introduced Wishlist, Notifications, Reviews, and Messages pages. Additionally, the `AuthContext` has been enhanced with comprehensive methods for updating user profiles and managing avatar uploads.

### 2.3. New Standalone Features

Several new features have been integrated, each with dedicated backend modules and frontend pages:

#### Wishlist

*   **Backend:** The `server/wishlist/index.ts` module provides full CRUD (Create, Read, Update, Delete) operations for managing user wishlists.
*   **Frontend:** The `/wishlist` page (`client/src/pages/Wishlist.tsx`) allows users to view, add, and remove products from their wishlist, with an option to move items directly to the shopping cart.

#### Notifications

*   **Backend:** The `server/notifications/index.ts` module manages notification retrieval, marking notifications as read, and configuring user notification settings.
*   **Frontend:** The `/notifications` page (`client/src/pages/Notifications.tsx`) displays all user notifications, enabling easy management.

#### Product Reviews

*   **Backend:** The `server/reviews/index.ts` module supports the creation, retrieval, modification, and deletion of product reviews, including a mechanism to verify purchase status.
*   **Frontend:** The `/reviews` page (`client/src/pages/Reviews.tsx`) provides an interface for users to manage their submitted product reviews.

#### Customer-Admin Messaging

*   **Backend:** The `server/messages/index.ts` module facilitates secure and efficient communication between customers and administrators, managing conversation threads and individual messages.
*   **Frontend:** The `/messages` page (`client/src/pages/Messages.tsx`) offers a user-friendly interface for sending and receiving messages.

### 2.4. Checkout Enhancements

The checkout process has been streamlined with improved address management:

*   **Address Persistence:** The `/checkout` page (`client/src/pages/CheckoutNew.tsx`) now includes a selector for saved addresses, allowing users to quickly choose from previously used shipping or billing addresses. New addresses entered during checkout are automatically saved for future use.

## 3. Technical Changes

### 3.1. Backend (server-side)

Significant modifications were made to the backend architecture:

*   **New Modules:** Five new modular services were introduced to manage specific functionalities:
    *   `server/auth/index.ts`
    *   `server/wishlist/index.ts`
    *   `server/notifications/index.ts`
    *   `server/reviews/index.ts`
    *   `server/messages/index.ts`
*   **Type Definitions:** A new type definition file, `server/types.d.ts`, was created to augment the Express Request object with `userId` and `adminId` properties.
*   **`server/index.ts` Updates:** The main Express server file was updated to:
    *   Import and register all new modules.
    *   Expand the `StoredUser` and `StoredAdmin` interfaces to accommodate new fields.
    *   Integrate new data stores for wishlists, notifications, reviews, conversations, messages, verification tokens, notification settings, and login history.
    *   Implement dedicated save functions for all new data stores.
    *   Update password handling to use `bcrypt` for comparison.
    *   Add the `crypto` import for `randomBytes` functionality.
*   **Dependencies Installed:** The following Node.js packages were installed to support the new features: `bcrypt`, `express-rate-limit`, `passport`, `passport-google-oauth20`, `passport-facebook`, `passport-microsoft`, `express-session`, and `@types/bcrypt`.

### 3.2. Frontend (client-side)

The frontend application saw extensive updates to integrate the new features:

*   **`AuthContext.tsx`:** This core authentication context was rewritten to include comprehensive API methods for all new authentication and account management features.
*   **New Pages:** Dedicated pages were created for `Wishlist.tsx`, `Notifications.tsx`, `Reviews.tsx`, and `Messages.tsx`.
*   **Updated Pages:** Existing pages were modified to support the new functionalities:
    *   `LoginNew.tsx`: Now includes Facebook and Microsoft social login buttons.
    *   `RegisterNew.tsx`: Features a phone field, social login buttons, and a terms and conditions checkbox.
    *   `ForgotPassword.tsx`: Fully wired to the new `/api/auth/forgot-password` API endpoint.
    *   `ResetPassword.tsx`: Rewritten to correctly utilize URL parameters for email and reset codes.
    *   `App.tsx`: The main application router was updated to include routes for `/wishlist`, `/notifications`, `/reviews`, and `/messages`.
    *   `Dashboard.tsx`: Enhanced with quick links to the new feature pages.
    *   `CheckoutNew.tsx`: Integrated the saved addresses selector and automatic address persistence functionality.
*   **TypeScript:** All TypeScript errors have been resolved, and the `pnpm run check` command now passes cleanly, ensuring type safety across the application.

## 4. Setup Notes for Social Login

To enable the social login functionalities (Google, Facebook, Microsoft), the following environment variables must be configured in your `.env` file. These credentials are essential for the OAuth providers to authenticate your application.

| Environment Variable       | Description                                        |
| :------------------------- | :------------------------------------------------- |
| `GOOGLE_CLIENT_ID`         | Client ID for Google OAuth.                        |
| `GOOGLE_CLIENT_SECRET`     | Client Secret for Google OAuth.                    |
| `FACEBOOK_APP_ID`          | App ID for Facebook OAuth.                         |
| `FACEBOOK_APP_SECRET`      | App Secret for Facebook OAuth.                     |
| `MICROSOFT_CLIENT_ID`      | Client ID for Microsoft OAuth.                     |
| `MICROSOFT_CLIENT_SECRET`  | Client Secret for Microsoft OAuth.                 |

Please refer to the respective OAuth provider's documentation for detailed instructions on how to obtain these credentials and properly configure your application for OAuth integration.
