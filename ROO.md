# ROO.md - LongLeap Tools Project Reference

> **Purpose**: This file provides comprehensive context for Roo Code to efficiently understand and work with the longleap-tools project in future sessions.

---

## Project Overview

**longleap-tools** (v1.5.2) is a TypeScript library providing two core functionalities:

1. **Options Expiration Dates**: Calculate monthly stock options expiration dates (third Friday of each month) with proper U.S. market holiday handling
2. **Historical Stock Data**: Fetch historical stock prices, dividends, and splits from Yahoo Finance with guaranteed ascending date sorting

**Key Characteristics**:

- Published to npm as a public package
- TypeScript-first with full type definitions
- Historical data support from year 2000 onwards
- Comprehensive test coverage
- Zero external runtime dependencies except yahoo-finance2 and luxon

---

## Architecture

### Module Structure

The project follows a clean, modular architecture:

```
src/
├── index.ts           # Barrel export - re-exports all public APIs
├── monthlyOptions.ts  # Options expiration & market holiday logic
└── yahooFinance.ts    # Yahoo Finance API integration
```

**Design Pattern**: Barrel export in [`index.ts`](src/index.ts) provides a single entry point for consumers while maintaining internal modularity.

### Key Files

- **[`src/index.ts`](src/index.ts)**: Main entry point, re-exports all public functions and types
- **[`src/monthlyOptions.ts`](src/monthlyOptions.ts)**: Core holiday calculation logic (336 lines)
  - Easter calculation using Meeus/Jones/Butcher algorithm
  - Nth day of month calculations for floating holidays
  - Special market closures database (9/11, Hurricane Sandy, etc.)
- **[`src/yahooFinance.ts`](src/yahooFinance.ts)**: Yahoo Finance wrapper (127 lines)
  - Instantiates yahoo-finance2 client
  - Handles date adjustments and sorting
  - Normalizes API responses into clean interfaces
- **[`package.json`](package.json)**: Project metadata and dependencies
- **[`tsconfig.json`](tsconfig.json)**: TypeScript configuration
- **[`jest.config.js`](jest.config.js)**: Test configuration

---

## Key Components

### Monthly Options & Holidays Module

**Location**: [`src/monthlyOptions.ts`](src/monthlyOptions.ts)

#### Primary Functions

1. **`getMonthlyOptionExpirationDates(startYear, endYear): string[]`**
   - Returns third Friday of each month in YYYY-MM-DD format
   - **Important**: If third Friday is a holiday, moves to Thursday
   - Validates year range (must be ≥ 2000)

2. **`isMarketHoliday(date): boolean`**
   - Checks if a specific date is a U.S. market holiday
   - Handles weekend observances (Saturday → Friday, Sunday → Monday)
   - **Note**: Contains console.log statements for debugging

3. **`isTradingDay(date): boolean`**
   - Returns true if date is not a weekend or holiday
   - Accepts Date object or 'YYYY-MM-DD' string
   - **Note**: Contains console.log statements for debugging

4. **`generateHolidays(startYear, endYear): string[]`**
   - Generates all market holidays for year range
   - Includes special closures (see below)

5. **`getEarliestSupportedYear(): number`**
   - Returns 2000 (the minimum supported year)

#### Holiday Logic

**Standard Holidays** (with observance rules):

- New Year's Day (Jan 1)
- Martin Luther King Jr. Day (3rd Monday in January)
- Presidents Day (3rd Monday in February)
- Good Friday (calculated via Easter algorithm)
- Memorial Day (last Monday in May)
- Juneteenth (June 19, starting 2021)
- Independence Day (July 4)
- Labor Day (1st Monday in September)
- Thanksgiving (4th Thursday in November)
- Christmas (Dec 25)

**Special Market Closures**:

- 2001-09-11 to 2001-09-14 (September 11 attacks)
- 2012-10-29 to 2012-10-30 (Hurricane Sandy)
- 2018-12-05 (President George H.W. Bush mourning)
- 2020-03-23 (COVID-19 trading floor closure)
- 2025-01-09 (President Jimmy Carter mourning)

#### Custom Error Types

- **`YearOutOfRangeError`**: Thrown when year < 2000
- **`InvalidYearRangeError`**: Thrown when startYear > endYear

### Yahoo Finance Module

**Location**: [`src/yahooFinance.ts`](src/yahooFinance.ts)

#### Primary Functions

1. **`getHistoricalData(symbol, startDate, endDate): Promise<YahooFinanceData[]>`**
   - Fetches OHLCV data plus adjusted close
   - **Important**: Adds 1 day to endDate to ensure inclusive range
   - Returns data sorted by date ascending

2. **`getDividends(symbol, startDate, endDate): Promise<Dividend[]>`**
   - Fetches dividend payment history
   - Uses `events: 'div'` parameter
   - Returns sorted by date ascending

3. **`getStockSplits(symbol, startDate, endDate): Promise<StockSplit[]>`**
   - Fetches stock split history
   - Uses `events: 'split'` parameter
   - Returns sorted by date ascending

#### Type Definitions

```typescript
interface YahooFinanceData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjClose: number;
}

interface Dividend {
    date: Date;
    amount: number;
}

interface StockSplit {
    date: Date;
    splitRatio: string;
}
```

---

## Dependencies

### Runtime Dependencies

1. **`yahoo-finance2`** (^3.11.2)
   - **Purpose**: Fetch stock data from Yahoo Finance
   - **Critical**: Must use v3.x (see Known Issues)
   - **Usage**: Instantiated once in yahooFinance.ts, uses `.chart()` method

2. **`luxon`** (^3.4.4)
   - **Purpose**: Date/time handling (though mostly using native Date)
   - **Note**: May be underutilized in current codebase

### Dev Dependencies

- **TypeScript** (^5.3.3): Compilation
- **Jest** (^29.7.0) + **ts-jest** (^29.1.1): Testing
- **ESLint** (^9.39.2) + TypeScript ESLint: Linting
- **@types/jest**, **@types/luxon**: Type definitions

---

## Development

### Build Process

```bash
npm run build    # Compiles TypeScript to dist/
npm run prepare  # Auto-runs build before publish
```

**Build Output**: `dist/` directory with `.js` and `.d.ts` files

### Testing

```bash
npm test  # Runs Jest test suite
```

**Test Files**:

- [`test/monthlyOptions.test.ts`](test/monthlyOptions.test.ts) - Holiday and expiration date tests
- [`test/yahooFinance.test.ts`](test/yahooFinance.test.ts) - Yahoo Finance integration tests
- [`test/setup.js`](test/setup.js) - Jest setup configuration

**Coverage**: Comprehensive test coverage for all public functions

### Linting

```bash
npm run lint      # Check for lint errors
npm run lint:fix  # Auto-fix lint issues
```

**Configuration**: Uses TypeScript ESLint with configuration in [`eslint.config.js`](eslint.config.js)

### Project Structure

```
longleap-tools/
├── src/                 # Source code
│   ├── index.ts         # Main entry point
│   ├── monthlyOptions.ts
│   └── yahooFinance.ts
├── test/                # Test files
│   ├── monthlyOptions.test.ts
│   ├── yahooFinance.test.ts
│   └── setup.js
├── dist/                # Compiled output (git-ignored)
├── docs/                # Documentation
│   └── standard-monthly-option-expiration-rule.md
├── package.json
├── tsconfig.json
├── jest.config.js
└── eslint.config.js
```

---

## Important Patterns

### Date Handling

1. **Date Format Consistency**: All functions return dates as `YYYY-MM-DD` strings or Date objects
2. **UTC vs Local Time**:
   - `isTradingDay()` accepts both Date objects and strings, normalizes to UTC
   - `isMarketHoliday()` uses ISO string splitting to extract date
3. **Inclusive Date Ranges**: Yahoo Finance functions add 1 day to endDate to ensure inclusive behavior
4. **Year Validation**: All functions validate year ≥ 2000 before processing

### Holiday Calculation Pattern

```typescript
// Pattern used throughout monthlyOptions.ts:
1. Calculate base date (e.g., Jan 1 for New Year's)
2. Check if weekend (getDay() === 0 or 6)
3. Apply observance rule (Sat → Fri, Sun → Mon)
4. Return as YYYY-MM-DD string
```

### Third Friday Logic

```typescript
// Core pattern in getMonthlyOptionExpirationDates:
1. Iterate through each day of month
2. Count Fridays (getDay() === 5)
3. When fridayCount === 3, check if holiday
4. If holiday, use Thursday (current - 1 day)
5. Otherwise use Friday
```

### Yahoo Finance Integration

```typescript
// Pattern in all Yahoo Finance functions:
1. Adjust endDate (+1 day for inclusive range)
2. Call yahooFinance.chart() with parameters
3. Map response to clean interface
4. Sort by date ascending (.sort())
5. Return typed array
```

---

## Known Issues & Fixes

### Yahoo Finance v3 Upgrade (v1.5.1)

**Problem**:

- Previous version used `yahoo-finance2` v2.x
- Yahoo Finance implemented stricter rate limiting
- API calls were failing with 429 (Too Many Requests) errors

**Solution**:

- Upgraded to `yahoo-finance2` v3.11.2
- v3.x includes built-in rate limiting and retry logic
- Maintains same API surface, minimal code changes needed

**Implementation Details**:

- Changed import from default to: `import YahooFinance from 'yahoo-finance2'`
- Instantiate with: `const yahooFinance = new YahooFinance()`
- All `.chart()` calls remain the same

**Important**: Any future work with Yahoo Finance must maintain v3.x dependency

### Debug Logging

**Current State**: [`monthlyOptions.ts`](src/monthlyOptions.ts) contains console.log statements in:

- `isMarketHoliday()` (line 238)
- `isTradingDay()` (lines 271, 273, 278)

**Consideration**: These may need removal or migration to proper logging in production

---

## Publishing

### NPM Configuration

**Package Name**: `longleap-tools`  
**Registry**: Public npm registry  
**Access**: Public (configured in package.json)

### Build & Publish Process

1. Update version in [`package.json`](package.json)
2. Run `npm run build` (or automatic via `prepare` script)
3. Run `npm publish`

**Published Files** (defined in package.json `files` field):

- `dist/` - Compiled JavaScript and type definitions
- `LICENSE` - MIT License
- `README.md` - Documentation

**Entry Points**:

- Main: `dist/index.js`
- Types: `dist/index.d.ts`

---

## Quick Reference

### Common Tasks

**Add a new holiday**:

1. Edit [`src/monthlyOptions.ts`](src/monthlyOptions.ts)
2. Add to `generateHolidays()` function
3. Add to `specialClosures` array if one-time event
4. Update tests in [`test/monthlyOptions.test.ts`](test/monthlyOptions.test.ts)

**Add a new Yahoo Finance function**:

1. Edit [`src/yahooFinance.ts`](src/yahooFinance.ts)
2. Create interface for return type
3. Implement function using `yahooFinance.chart()` pattern
4. Export from [`src/index.ts`](src/index.ts)
5. Add tests in [`test/yahooFinance.test.ts`](test/yahooFinance.test.ts)

**Extend year range support**:

1. Update `EARLIEST_SUPPORTED_YEAR` constant in [`src/monthlyOptions.ts`](src/monthlyOptions.ts)
2. Ensure all holiday rules apply to new years
3. Update documentation in [`README.md`](README.md)

### Testing Commands

```bash
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
npm test -- --coverage     # Generate coverage report
```

### Common Patterns to Maintain

✅ **DO**:

- Always validate year ranges
- Return dates sorted in ascending order
- Use TypeScript strict types
- Export all public APIs through [`index.ts`](src/index.ts)
- Maintain backward compatibility

❌ **DON'T**:

- Don't break the barrel export pattern
- Don't change date format conventions (YYYY-MM-DD)
- Don't remove error classes (breaking change)
- Don't downgrade yahoo-finance2 below v3.x

---

## Additional Resources

- **GitHub**: <https://github.com/mxcoppell/longleap-tools>
- **License**: MIT
- **Options Rules**: See [`docs/standard-monthly-option-expiration-rule.md`](docs/standard-monthly-option-expiration-rule.md)

---

*Last Updated: 2026-01-07*  
*Project Version: 1.5.2*
