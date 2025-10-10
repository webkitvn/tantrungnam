# WordPress Theme Packaging

## Quick Start

Create a production-ready zip file of your theme:

```bash
# Using pnpm (recommended)
pnpm run zip

# Or run the script directly
./create-theme-zip.sh
```

## What It Does

1. **Builds production files** - Compiles and minifies CSS/JS
2. **Copies theme files** - Only includes production-ready files
3. **Creates zip file** - Generates `dist/ttn.zip` ready for WordPress installation

## Files Included in ZIP

✅ **Included:**
- `assets/` - Compiled CSS, JS, images
- `blocks/` - Block templates
- `inc/` - PHP includes
- `template-parts/` - Template parts
- `functions.php`, `style.css` - Core theme files
- `screenshot.png` - Theme screenshot

❌ **Excluded (Development Only):**
- `node_modules/` - Dependencies
- `src/` - Source files (SCSS, JS)
- `package.json`, `pnpm-lock.yaml` - Package configs
- `build.mjs`, `tailwind.config.mjs`, etc. - Build configs
- `*.md` - Documentation files
- `.git`, `.gitignore` - Version control
- `*.log`, `*.map` - Debug files

## Output

The script creates:
```
dist/
└── ttn.zip  ← Ready to upload to WordPress
```

## Installation

1. Upload `dist/ttn.zip` to WordPress
2. Go to **Appearance → Themes → Add New → Upload Theme**
3. Choose the zip file and click **Install Now**
4. Activate the theme

## Troubleshooting

**Script not executable?**
```bash
chmod +x create-theme-zip.sh
```

**Missing dependencies?**
```bash
pnpm install
```

**Build fails?**
Check that all dependencies are installed and `pnpm run build` works.

