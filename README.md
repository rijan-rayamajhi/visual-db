# Visual NoSQL Designer

A modern, intuitive web application for designing NoSQL database schemas visually with a drag-and-drop interface. Built with Next.js, React, and TypeScript.

## ✨ Features

- **Visual Database Design**: Create and manage NoSQL collections with an intuitive drag-and-drop interface
- **Document Management**: Add, edit, and organize documents within collections
- **Field Management**: Define fields with types, values, and descriptions
- **Schema Export/Import**: Export your database schema in a clean JSON format and import existing schemas
- **Dark/Light Theme**: Toggle between light and dark themes with persistent preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: See changes instantly as you design your database

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd visual-db
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and theme variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── DatabaseDesigner.tsx    # Main canvas for database design
│   ├── Header.tsx              # Navigation header with theme toggle
│   ├── Sidebar.tsx             # Collection management sidebar
│   └── ClientThemeProvider.tsx # Client-side theme wrapper
└── contexts/
    └── ThemeContext.tsx   # Theme management context
```

## 🎨 Theme System

The application features a robust theme system with:
- **Light Mode**: Clean, bright interface for daytime use
- **Dark Mode**: Easy-on-the-eyes dark interface for low-light environments
- **Persistent Preferences**: Theme choice is saved in localStorage
- **Smooth Transitions**: Animated theme switching with CSS transitions

## 📊 Schema Export Format

The application exports schemas in a clean, simplified JSON format:

```json
{
  "user": {
    "user_profile": {
      "name": "John Doe",
      "email": "john@example.com",
      "age": "30"
    }
  },
  "products": {
    "product_info": {
      "title": "Laptop",
      "price": "999.99",
      "category": "Electronics"
    }
  }
}
```

This format focuses on the actual data structure without metadata like IDs, positions, or timestamps.

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Geist Font](https://vercel.com/font)** - Modern typography

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **DatabaseDesigner**: Main canvas component for visual database design
- **Header**: Navigation with export/import functionality and theme toggle
- **Sidebar**: Collection management and document organization
- **ThemeContext**: Global theme state management

## 📝 Usage

1. **Create Collections**: Use the sidebar to add new database collections
2. **Add Documents**: Create documents within collections to represent data structures
3. **Define Fields**: Add fields to documents with names, values, and types
4. **Visual Organization**: Drag and drop collections on the canvas to organize your schema
5. **Export Schema**: Use the export button to download your schema in JSON format
6. **Import Schema**: Import existing schemas to continue working on previous designs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
