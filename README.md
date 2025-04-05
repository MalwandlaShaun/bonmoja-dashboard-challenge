# Bonmoja Wallet Dashboard

A responsive wallet transaction dashboard for Bonmoja's iGaming platform, focused on trust, speed, polish, and mobile-first design.

![Bonmoja Wallet Dashboard Screenshot](https://drive.google.com/file/d/1SdXrne_gro3Je9cxen9W24Cz2DSS2eU3/view?usp=sharing)

## Demo

View the demo video: [Bonmoja Wallet Dashboard Demo](https://youtu.be/gdYHDKzvtz8)

## Features

### Core Features
- 💰 Real-time wallet balance display
- 📊 Transaction history with filtering
- 💳 Deposit funds functionality
- 📤 Withdraw funds functionality
- 📱 Fully responsive design (mobile-first)

### User Experience
- ⚡ Elegant loading states
- 🔄 Smooth transitions
- ❌ Comprehensive error handling
- 🎯 Form validation
- 📄 Empty state handling

## Tech Stack

- **Framework**: Vue 3 / Nuxt 3
- **Styling**: TailwindCSS
- **State Management**: Vue Composition API
- **Mock API**: Static JSON

## Project Structure

```
bonmoja-wallet-dashboard/
├── components/
│   ├── DepositModal.vue       # Modal for depositing funds
│   ├── WithdrawModal.vue      # Modal for withdrawing funds
│   ├── TransactionList.vue    # List of transactions with filtering
│   └── WalletBalance.vue      # Display of current wallet balance
├── pages/
│   └── index.vue              # Main dashboard page
├── public/
│   └── api/                   # Mock API data
│       ├── wallet.json        # Wallet balance data
│       └── transactions.json  # Transaction history data
└── assets/
    └── css/                   # Global styles
```

## Implementation Details

### Dashboard
The main dashboard displays the wallet balance prominently with action buttons for deposits and withdrawals. Transactions are listed below with options to filter by type and status.

### Modals
Both deposit and withdrawal flows follow a consistent pattern:
1. Form validation with helpful error messages
2. Loading state during simulated API call
3. Success/error feedback
4. Proper state management

### Responsive Design
The dashboard is designed with a mobile-first approach:
- Stack layout on mobile devices
- Grid layout on tablets and desktops
- Buttons and interactive elements sized appropriately for touch
- Modals that work well on all screen sizes

### Mock API
The application uses static JSON files to simulate API responses:
- `/api/wallet.json` - Contains wallet balance and currency
- `/api/transactions.json` - Contains transaction history

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- NPM or Yarn

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/MalwandlaShaun/bonmoja-dashboard-challenge.git
   cd bonmoja-dashboard-challenge
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Design Decisions

### Component Architecture
I opted for a modular component structure where each component has a single responsibility. This makes the code more maintainable and easier to test.

### State Management
For this relatively small application, I used Vue's Composition API with `ref` and `reactive` instead of Vuex/Pinia. This provides sufficient reactivity while keeping the codebase simpler.

### Form Validation
I implemented client-side form validation with detailed error messages to provide immediate feedback to users, enhancing the user experience.

### Error Handling
All API calls are wrapped in try/catch blocks with appropriate error states displayed to users, ensuring they always know what's happening.

### Mobile-First Approach
All components were designed for mobile first, then expanded for larger screens using TailwindCSS's responsive utilities.

## Trade-offs and Future Improvements

### Trade-offs
- **Mock API**: Using static JSON files instead of a real API simplifies development but doesn't fully simulate network conditions.
- **Client-side state**: For demonstration purposes, updates to balance after transactions are handled client-side rather than re-fetching data.

### Future Improvements
- Implement proper authentication flow
- Add transaction search functionality
- Create detailed transaction view
- Add pagination for large transaction lists
- Implement proper backend integration
- Add unit and integration tests
- Add dark mode support
- Implement i18n for internationalization

## License
MIT
