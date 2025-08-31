# Coin Stack - Money Manager

A mobile-first React web application for managing shared expenses between four players. Perfect for tracking who owes money to whom in group activities like shared meals, trips, or any situation where money changes hands between friends.

## Features

- **Mobile-First Design**: Optimized for smartphones with touch-friendly interface
- **Four Player Support**: Designed specifically for groups of four people
- **Simple Transaction Model**: Select 1-3 people to receive money, others automatically pay
- **Euro Currency**: All amounts displayed in Euros (€)
- **Debt Overview**: Clear view of who owes money to whom with minimum settlement amounts
- **Real-Time Balance Tracking**: See each player's current balance at a glance
- **Transaction History**: Review all past transactions with detailed breakdown
- **Data Persistence**: Automatically saves all data locally in your browser
- **Undo Functionality**: Easily reverse the last transaction if mistakes are made
- **Dark/Light Mode**: Automatically adapts to your device's theme preference
- **PWA Ready**: Can be installed on mobile devices like a native app

## How It Works

1. **Players**: The app starts with 4 default players that you can rename by tapping on them
2. **Transactions**: In each transaction, select 1-3 people who receive money, the remaining people automatically pay for it
3. **Balance Tracking**: The app automatically calculates each player's running balance in Euros
4. **Debt Settlement**: Shows the minimum payments needed between players to settle all debts

## Usage

### Adding a Transaction

1. Tap "Add Transaction"
2. Enter the amount each person will receive (in Euros)
3. Add an optional description (e.g., "Pizza delivery", "Movie tickets")
4. Select 1-3 people who will receive this amount (they will appear in green)
5. The remaining people will automatically pay for it (they will appear in red)
6. Tap "Add Transaction"

### Managing Players

- Tap on any player's name to edit it
- Player balances are automatically calculated and displayed
- Green balances mean the player has received more than they've paid
- Red balances mean the player has paid more than they've received

### Viewing History

- Tap "History" to see all past transactions
- Each transaction shows the date, amount per person, who paid and who received
- Total money moved is displayed at the bottom

### Undoing Mistakes

- Use "Undo Last" to reverse the most recent transaction
- This will restore all player balances to their previous state

## Technology Stack

- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Mobile-First CSS** with custom responsive design
- **Local Storage** for data persistence
- **PWA Manifest** for mobile app installation
- **Euro Currency** support with proper formatting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd coin-stack
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Linting

```bash
npm run lint
```

## Mobile Installation

This app can be installed on mobile devices like a native app:

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" or "Install" option
3. Follow the prompts to install
4. The app will appear on your home screen like a regular app

## Data Storage

All data is stored locally in your browser's localStorage. This means:

- ✅ Your data is private and never sent to any server
- ✅ The app works completely offline
- ⚠️ Data is tied to your specific browser and device
- ⚠️ Clearing browser data will delete all transactions

## Use Cases

Perfect for:

- **Shared meals**: Track who paid for dinner and how much each person owes
- **Group trips**: Manage shared expenses like gas, accommodation, activities
- **Roommate expenses**: Keep track of shared utilities, groceries, etc.
- **Movie nights**: Track ticket costs, snacks, and shared expenses
- **Any group activity** where some people pay and others benefit

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
