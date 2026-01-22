# Gerenciamento Financeiro

A comprehensive personal finance management application built with Angular 19, designed to help you track expenses, manage cards, and visualize your financial health.

## Features

- 📊 **Interactive Dashboards**: Visualize your income and expenses with powerful, interactive charts powered by AmCharts and ECharts.
- 💸 **Transaction Management**:
    - Detailed extract (Extrato) of all your transactions.
    - Support for multiple transaction types (Pix, Boleto, Cartão, etc.).
    - Categorization with icons for easy recognition.
- 🔍 **Advanced Filtering**:
    - **Multi-dimensional Filtering**: Filter transactions by Card, Payment Status, Transaction Type, and Text Description simultaneously.
    - **Real-time Search**: instantly find transactions as you type.
- 💳 **Card Management**: Manage multiple credit/debit cards and filter views by specific cards.
- 📱 **Responsive Design**: Fully responsive layout that adapts seamlessly to desktop and mobile devices.
    - **Desktop**: Full table views with advanced filtering columns.
    - **Mobile**: Simplified card-based views optimized for touch.
- 💾 **PWA Support**: Installable as a Progressive Web App for a native-like experience.

## Tech Stack

- **Framework**: [Angular 19](https://angular.dev/)
- **UI & Styling**:
    - [Bootstrap 5](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
    - Custom CSS with responsive media queries
- **Data Visualization**:
    - [AmCharts 5](https://www.amcharts.com/)
    - [Apache ECharts](https://echarts.apache.org/)
    - [Chart.js](https://www.chartjs.org/)
- **State Management & Async**: [RxJS](https://rxjs.dev/)
- **Build Tooling**: Angular CLI

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chagasduarte/Gerenciamento.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Gerenciamento
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building for Production

To build the project for production, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## License

[MIT](LICENSE)
