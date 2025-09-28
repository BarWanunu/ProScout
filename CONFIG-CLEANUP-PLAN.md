# 🗑️ CONFIGURATION FILES CLEANUP PLAN

## Files to DELETE immediately (100% safe):

### 1. Environment files not in use:

```bash
rm frontend/.env.development
```

**Reason:** Contains unused Google API and Sanity tokens (0 references in code)

### 2. TypeScript configuration (project uses JSX, not TSX):

```bash
rm frontend/tsconfig.json
```

**Reason:** Only 1 .ts file exists, rest of project is pure JavaScript/JSX

### 3. Testing configuration (no tests exist):

```bash
rm frontend/jest.config.cjs
rm frontend/jest.setup.js
rm frontend/babel.config.cjs
```

**Reason:** No test files exist in project, Jest setup is unused

### 4. TypeScript UI Components (unused):

```bash
rm -rf frontend/src/layout/ui/
```

**Reason:** All .tsx files in this directory are not imported anywhere

## Files to KEEP (essential):

- `.env` - Contains VITE_API_BASE_URL (used in 17+ places)
- `package.json` - Project dependencies
- `vite.config.js` - Build configuration
- `eslint.config.js` - Code linting
- `index.html` - Main HTML template
- `.gitignore` - Git exclusions

## Expected benefits:

- **~15 files removed**
- **~50KB saved**
- **Cleaner project structure**
- **Faster build times**
- **Less confusion for developers**

## Verification commands:

```bash
# Check if project still builds after cleanup
npm run build

# Check if linting still works
npm run lint

# Check if dev server starts
npm run dev
```
