import * as esbuild from 'esbuild';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcssPostcss from '@tailwindcss/postcss';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const isWatch = process.argv.includes('--watch');
const isDev = process.env.NODE_ENV === 'development';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Cache for processed CSS to avoid unnecessary reprocessing
let cssCache = new Map();

// Ensure directories exist
async function ensureDirectories() {
  await Promise.all([
    mkdir('assets/css', { recursive: true }),
    mkdir('assets/js', { recursive: true })
  ]).catch(error => {
    if (error.code !== 'EEXIST') throw error;
  });
}

// Optimized PostCSS processing function with caching
async function processCSS(cssText, filePath) {
  const cacheKey = `${filePath}:${cssText}`;
  if (cssCache.has(cacheKey)) {
    return cssCache.get(cacheKey);
  }

  const result = await postcss([
    tailwindcssPostcss,
    autoprefixer
  ]).process(cssText, {
    from: filePath,
    to: 'assets/css/main.css',
    map: isDev ? { inline: true } : false
  });
  
  cssCache.set(cacheKey, result.css);
  return result.css;
}

// Build configuration
const buildOptions = {
  entryPoints: ['src/js/main.js', 'src/js/carousel.js'],
  bundle: true,
  outdir: 'assets/js',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: isDev,
  loader: {
    '.js': 'jsx'
  },
  resolveExtensions: ['.js', '.jsx'],
  nodePaths: ['node_modules', 'src/js'],
  metafile: true, // Enable build metadata for better debugging
  plugins: [{
    name: 'css-processor',
    setup(build) {
      // Handle SCSS imports
      build.onResolve({ filter: /\.scss$/ }, args => {
        if (args.path.startsWith('.')) {
          return {
            path: resolve(args.resolveDir, args.path.replace(/\.scss$/, '') + '.scss')
          }
        }
      });

      if (isWatch) {
        let isFirstBuild = true;
        build.onStart(() => {
          if (!isFirstBuild) {
            console.clear(); // Clear console for better readability
          }
          isFirstBuild = false;
          console.log('🔄 Building...');
        });
      }
      
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        try {
          const css = await readFile(args.path, 'utf8');
          const processed = await processCSS(css, args.path);
          await writeFile('assets/css/main.css', processed);
          
          if (!isWatch) {
            console.log('✅ CSS processing complete');
          }
          
          return { contents: processed, loader: 'css' };
        } catch (error) {
          console.error('❌ Error processing SCSS:', error);
          return { 
            errors: [{ 
              text: error.message,
              location: { file: args.path }
            }] 
          };
        }
      });

      // Clean up cache on build end
      build.onEnd(() => {
        if (!isWatch) {
          cssCache.clear();
        }
      });
    },
  }],
};

async function build() {
  try {
    await ensureDirectories();

    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      
      // Log build statistics in production
      if (!isDev && result.metafile) {
        console.log('📊 Build statistics:');
        Object.entries(result.metafile.outputs).forEach(([file, output]) => {
          if (file.endsWith('.js')) {
            console.log(`${file}: ${(output.bytes / 1024).toFixed(2)}kb`);
          }
        });
      }
      
      console.log('✨ Build complete');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();