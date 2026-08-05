# Operations Integrated Limited (OIL) — Corporate Website

This is the production-ready Angular 21 frontend for the OIL corporate website. It is designed as a single-page application (SPA) landing page with smooth scrolling, full bilingual (English/Arabic) support, and a responsive, token-driven design system.

## Project Structure & Configuration

The project is built to be easily maintainable without needing to edit complex component logic.

### 1. Contact Information (`src/app/config/contact-info.ts`)
This file is the **single source of truth** for all contact details.
- Update emails, phone numbers, WhatsApp, and location here.
- The `formEndpoint` is the Formspree URL where contact form submissions will be sent.
- **Important**: To activate the Formspree endpoint, an activation email was sent to `gm@oil-epc.com` (or whichever email was used to create the form). The owner of that inbox **must click the activation link** before the form can accept submissions.

### 2. Company Statistics (`src/app/config/stats-config.ts`)
Update the placeholder stats (Years of Operation, Projects Delivered, etc.) here. The animated stats band will automatically read these values.

### 3. Translations (`src/app/i18n/en.json` & `ar.json`)
All user-facing text is stored in these JSON files.
- To change text, edit both files simultaneously to keep keys in sync.
- Run `npm run i18n:check` to verify that both files have identical keys.

### 4. Images (`public/images/`)
Placeholder images are currently used. To add real photography:
- Place your images in the respective section folders (e.g., `public/images/hero/hero-1.jpg`).
- The components are already configured to look for these paths (see `HeroComponent.ts` or `ServicesComponent.ts` for specific file names).

### 5. Logo
The main logo is located at `public/logo.png`. Replace it with a new file of the same name if needed.

## Development Server

Run `npm start` (or `ng serve`) for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build & Deployment

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Deploying to GitHub Pages
This repository is ready for GitHub Pages deployment using GitHub Actions.

1. Push your code to the `main` or `master` branch.
2. The workflow in `.github/workflows/deploy.yml` will run automatically.
3. It builds the app using `npm run build:ghpages` and deploys the contents of `dist/oil-website/browser`.

> Make sure GitHub Pages is enabled for the repository and set to the "GitHub Actions" source in repository settings.

### Deploying to Vercel
This project includes a `vercel.json` configuration file, making it ready for deployment on Vercel.
1. Connect your repository to Vercel.
2. Ensure the Framework Preset is set to **Angular**.
3. Vercel will automatically run `npm run build` and use the `vercel.json` for proper SPA routing and security headers.
