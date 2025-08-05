# Tilos Maraton 2025 - Festival Program App

A React-based Progressive Web App serving as the digital program guide for the Tilos Radio marathon festival 2025.

## 📱 About the Project

**Tilos Maraton 2025** is the official mobile program guide for the annual Tilos Radio fundraising festival, running from **June 6-14, 2025** at **Dürer Kert, Budapest**. This PWA provides festival-goers with:

- 📅 Complete festival timetable with performances and events
- 🎤 Artist information and descriptions
- 🗺️ Interactive venue map
- ⭐ Personal favorites system
- 🔍 Search functionality across artists and performances
- 📱 Offline-first PWA experience
- 📅 Google Calendar integration

The app serves as both an online and offline companion for the 9-day fundraising festival supporting Tilos Radio (FM 90.3).

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, React Router DOM v7
- **Styling:** Tailwind CSS, Material-UI (MUI), PostCSS
- **Build Tool:** Vite 4
- **PWA:** Vite PWA Plugin with Workbox
- **Code Quality:** Biome (linting & formatting)
- **Package Manager:** Yarn
- **Data:** JSON-based festival program data
- **Deployment:** GitHub Pages

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delanni/tilos-maraton.git
   cd tilos-maraton
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start development server:**
   ```bash
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🧑‍💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build production bundle |
| `yarn preview` | Preview production build locally |
| `yarn lint` | Run Biome linter |
| `yarn format` | Format code with Biome |
| `yarn deploy-gh` | Deploy to GitHub Pages |
| `yarn bundle-tilos` | Create Tilos-specific deployment bundle |

### Development Workflow

1. **Start the dev server:**
   ```bash
   yarn dev
   ```

2. **Make your changes** in the `/src` directory

3. **Lint your code:**
   ```bash
   yarn lint
   ```

4. **Format code:**
   ```bash
   yarn format
   ```

5. **Test the build:**
   ```bash
   yarn build
   yarn preview
   ```

### Code Quality

The project uses **Biome** for both linting and code formatting:
- Configuration: `biome.json`
- Automatically formats on save (if configured in your editor)
- Enforces consistent code style and catches common issues

## 🏗️ Project Structure

```
tilos-maraton/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Route components (Timetable, Artist, etc.)
│   ├── services/           # Data services and API calls
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   ├── router.tsx          # Route configuration
│   ├── types.ts            # TypeScript type definitions
│   └── service-worker.ts   # PWA service worker
├── programme/              # Festival data (JSON files)
│   ├── artists.json        # Artist information
│   ├── performances.json   # Performance/event data
│   ├── stages.json         # Venue stage information
│   ├── days.json           # Festival day information
│   ├── festivalInfo.json   # General festival info
│   └── *.cjs               # Data processing scripts
├── resources/              # Static assets
├── scripts/                # Build and deployment scripts
├── public/                 # Static public assets
└── dist/                   # Production build output
```

## 📊 Data Management

Festival data is stored in JSON files in the `/programme` directory:

### Core Data Files

- **`artists.json`** - Artist profiles with names, descriptions, genres, images
- **`performances.json`** - Individual performances with times, stages, artists
- **`stages.json`** - Venue stages with locations and descriptions
- **`days.json`** - Festival days with themes and special information
- **`festivalInfo.json`** - General festival metadata and links

### Data Processing Scripts

Located in `/programme/`:
- **`updateArtistImages.cjs`** - Updates artist image URLs
- **`updateArtistPages.cjs`** - Generates artist page data
- **`tests.cjs`** - Validates data integrity

### Updating Festival Data

1. Edit the appropriate JSON file in `/programme/`
2. Run data validation: `node programme/tests.cjs`
3. Test the changes: `yarn dev`
4. Build and deploy: `yarn build`

## 🚀 Deployment

### GitHub Pages Deployment

The project includes an automated deployment script for GitHub Pages:

```bash
yarn deploy-gh
```

This script:
1. Builds the production bundle with base path `/tilos-maraton`
2. Creates a `gh-pages` branch
3. Optimizes assets and updates resource links
4. Prepares for GitHub Pages deployment

**Manual deployment steps:**
1. Ensure you're on the `master` branch with no uncommitted changes
2. Run `yarn deploy-gh`
3. Follow the final instruction to push: `git push --set-upstream origin gh-pages --force`

### Custom Deployment

For other hosting platforms:

1. **Build the project:**
   ```bash
   yarn build
   ```

2. **Configure base path** (if needed):
   ```bash
   export BASE_NAME="/your-path"
   yarn build
   ```

3. **Deploy the `dist/` folder** to your hosting service

## 🎨 Customization

### Theming

The app uses Tailwind CSS with custom theme colors defined in:
- `tailwind.config.js` - Main theme configuration
- `src/index.css` - CSS custom properties
- Individual day themes in `programme/days.json`

### PWA Configuration

PWA settings are configured in `vite.config.ts`:
- App name and short name
- Theme colors
- Icon configuration
- Service worker strategy

## 🧪 Testing

Currently, the project uses custom data validation scripts:
- Run data tests: `node programme/tests.cjs`
- Validates JSON data integrity
- Checks for duplicates and missing references

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding standards
4. **Lint and format your code:**
   ```bash
   yarn lint
   yarn format
   ```
5. **Test your changes:**
   ```bash
   yarn build
   yarn preview
   ```
6. **Commit your changes:**
   ```bash
   git commit -m "Add your descriptive commit message"
   ```
7. **Push to your fork and create a Pull Request**

### Coding Standards

- Use TypeScript for type safety
- Follow Biome linting rules
- Write descriptive commit messages
- Test changes with both dev server and production build
- Ensure PWA functionality remains intact

## 📱 PWA Features

This app is built as a Progressive Web App with:

- **Offline functionality** - Works without internet connection
- **Install prompt** - Can be installed on devices like a native app
- **Background sync** - Updates data when connection is restored
- **Responsive design** - Works on all device sizes
- **Fast loading** - Optimized performance with service worker caching

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration and PWA settings |
| `tailwind.config.js` | Tailwind CSS theme and utility configuration |
| `tsconfig.json` | TypeScript compiler configuration |
| `biome.json` | Code linting and formatting rules |
| `postcss.config.cjs` | PostCSS plugins configuration |
| `package.json` | Dependencies and scripts |

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
- Check TypeScript version compatibility
- Ensure all types are properly defined
- Run `yarn install` to update dependencies

**PWA not working locally:**
- PWA features only work in production builds
- Test with `yarn build && yarn preview`
- Use HTTPS in production

**Lint errors on build:**
- Run `yarn lint` to see specific issues
- Use `yarn format` to auto-fix formatting
- Check Biome configuration in `biome.json`

**Data validation fails:**
- Run `node programme/tests.cjs` to see specific errors
- Check JSON syntax and data relationships
- Ensure all referenced IDs exist across files

## 📞 Contact & Support

- **Project Maintainer:** Szabó Alex
- **Email:** delanni.alex@gmail.com
- **Organization:** Tilos Rádió
- **Website:** [tilos.hu](https://tilos.hu)
- **Festival Info:** [tilos.hu/maraton](https://tilos.hu/maraton)

## 📄 License

This project is created for Tilos Rádió. Please contact the maintainers for licensing information.

---

**Tilos Rádió** - Budapest's independent community radio station since 1991 🎙️