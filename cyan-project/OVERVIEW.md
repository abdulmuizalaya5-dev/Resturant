# CyanReserve — Premium Fine Dining Reservation Platform

Welcome to **CyanReserve**, a state-of-the-art fine dining reservation and pre-ordering web application. This platform is designed to bridge the gap between luxury culinary establishments and fine dining enthusiasts, offering a seamless, interactive, and premium booking experience.

---

## 🌟 The Core Mission & Role
The primary role of CyanReserve is to **revolutionize the upscale dining reservation workflow**. Unlike generic booking tools, CyanReserve focuses on the exclusive fine-dining segment by offering personalized service details, direct customer-to-kitchen communications, and intelligent resource allocation. 

By allowing patrons to book tables and pre-select high-end courses, and giving owners the tools to assign physical seating layout matches, the website reduces wait times, eliminates resource waste, and elevates the hospitality experience.

---

## 👥 Role-Based Architecture
CyanReserve is structured around four key user personas, each accessing a tailored dashboard interface:

### 1. The Customer (Diner)
*   **Role**: Discover premium restaurants, manage personal dining schedules, and customize dining preferences.
*   **Key Features**:
    *   **Interactive Search**: Browse restaurants filtered by cuisine, price range ($ to $$$$), and location.
    *   **Instant Booking**: Pick date, party sizes, and dining times using high-fidelity calendars and slot pickers.
    *   **Dish Pre-ordering**: Pre-order appetizers, mains, and desserts directly from the booking widget to assure arrival readiness.
    *   **Diner History**: Track upcoming active bookings, review historical visits, and manage a curated favorites list.
    *   **Review Submission**: Leave verified ratings and testimonials to share feedback.

### 2. The Restaurant Owner (Restaurateur)
*   **Role**: Manage their restaurant profiles, control the booking pipeline, design tables, and optimize kitchen preparedness.
*   **Key Features**:
    *   **Reservation Pipeline**: Review incoming `pending` bookings, and accept/decline requests.
    *   **Table Linkage Assignment**: Dynamically allocate reservations to physical restaurant tables (e.g., matching capacity bounds).
    *   **Kitchen Pre-order Board**: View customer-specific dish pre-orders directly from the reservations grid so the culinary team knows what to prepare ahead of time.
    *   **Analytics Board**: Review graphical analytics charts showing revenue, guest throughput, and average ratings.
    *   **Inventory & Tables Configuration**: Add, edit, or delete tables and adjust capacity levels.

### 3. The Staff Worker (Restaurant Staff)
*   **Role**: Manage the specific restaurant department/module they have been assigned to by the administrator.
*   **Key Features**:
    *   **Dashboard Restriction**: Access is guarded dynamically by `DashboardLayout` based on the worker's `assignedComponent` attribute.
    *   **Department Tasks**: Can only view and edit the assigned component page (e.g., table layouts, reservations stream, restaurant profiles, or analytics charts). All other tabs are hidden from the sidebar and blocked with an Access Restricted screen if visited.

### 4. The Administrator (Site Admin)
*   **Role**: Oversee platform security, manage users, provision worker credentials, and preserve community guidelines.
*   **Key Features**:
    *   **Diner & Partner Directory**: View profile names, roles, emails, and contact details of registered accounts.
    *   **Staff Worker Provisioning**: Create new worker profiles and assign them in charge of a specific dashboard component (`reservations`, `tables`, `restaurants`, or `analytics`).
    *   **Platform Health**: Monitor active reservations, user registration counts, and review quality.

---

## 🛠️ Technology Stack
CyanReserve is built with modern, cutting-edge web technologies:
*   **Core Framework**: [Next.js 16 (Turbopack)](https://nextjs.org) using App Router architectures.
*   **User Interface**: [React 19](https://react.dev) with hooks (`useState`, `useEffect`, `useContext`) for real-time reactivity.
*   **Styling System**: [Tailwind CSS 4](https://tailwindcss.com) providing an immersive glassmorphic dark mode theme.
*   **Language**: [TypeScript](https://www.typescriptlang.org) enforcing type safety across data services.
*   **Icons**: [Lucide React](https://lucide.dev) for streamlined modern glyphs.

---

## 🧭 File Navigation Map
*   **Application Routes** in [src/app/](file:///C:/Users/OLATECH%20LIMITED/Desktop/soon/cyan-project/src/app):
    *   `(landing)/`: Main landing portal, restaurant details page, login, and registration.
    *   `(dashboard)/dashboard/`: Customer, owner, and admin dashboard panels.
*   **UI Components** in [src/components/](file:///C:/Users/OLATECH%20LIMITED/Desktop/soon/cyan-project/src/components): Shared components like calendars, inputs, tables, cards, and navigation sidebars.
*   **Application Services** in [src/services/](file:///C:/Users/OLATECH%20LIMITED/Desktop/soon/cyan-project/src/services): Context providers managing the state and local storage configurations.
