
# ZIONIX APP

This is a React application that compares prices from different data providers and allows users to manage a shopping cart. The app uses Chakra UI for styling.

## Features

- Compare prices of products from different data providers.
- Add items to a shopping cart.
- View and edit items in the cart.
- Responsive sidebar to view cart details.

## Setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the application**

   ```bash
   npm start
   ```

   This will start the development server and open the application in your default browser. The app will be available at `http://localhost:3000`.

## Features Overview

- **Part Number and Volume Inputs**: Enter a part number and volume to fetch comparison data.
- **Table of Results**: Displays the comparison results with an option to add the item with the least total price to the cart.
- **Cart Sidebar**: A sidebar that opens from the right side, displaying the items in the cart with options to change volume and remove items.

## Dependencies

- **React**: Frontend library.
- **Chakra UI**: UI component library for styling.
- **Axios**: HTTP client for making API requests.

### Dev Dependencies

- **Chakra UI**: For UI components and styling.
- **React**: React and its dependencies.

## API

The application sends a POST request to `http://localhost:5000/compare` with the following JSON payload:

```json
{
  "partNumber": "part-number",
  "volume": "volume"
}
```

Replace `http://localhost:5000` with your API server's URL if it's different.

## Components

- **App**: The main component that includes the form for input, the results table, and the cart sidebar.
- **Button**: Various buttons for submitting data and interacting with the cart.
- **Input**: Input fields for part number and volume.
- **Table**: Table for displaying comparison results.
- **Card**: Displays cart items with editable volume and total price.



