# LongLeap Tools

Calculate monthly stock options expiration dates with market holiday handling and fetch historical stock data from Yahoo Finance.

## Features

- Calculate monthly option expiration dates (third Friday of each month)
- Handle market holidays and weekend adjustments
- Support for special market closures
- Historical data available from year 2000 onwards
- Fetch historical stock data, dividends, and stock splits from Yahoo Finance
- **CLI utility for batch downloading historical data to CSV files**
- All data sorted by date in ascending order
- TypeScript support with type definitions
- Comprehensive test coverage

## Installation

```bash
npm install longleap-tools
```

## Usage

```typescript
import { 
  getMonthlyOptionExpirationDates, 
  isMarketHoliday, 
  isTradingDay,
  generateHolidays, 
  getEarliestSupportedYear,
  getHistoricalData,
  getDividends,
  getStockSplits
} from 'longleap-tools';

// Market Holiday and Option Expiration functionality
const earliestYear = getEarliestSupportedYear();
console.log(earliestYear); // 2000

const dates = getMonthlyOptionExpirationDates(2024, 2024);
console.log(dates);
// ['2024-01-19', '2024-02-16', '2024-03-15', ...]

const isHoliday = isMarketHoliday(new Date('2024-01-01'));
console.log(isHoliday); // true

const isTradingDay = isTradingDay(new Date('2024-01-02'));
console.log(isTradingDay); // true

const holidays = generateHolidays(2024, 2024);
console.log(holidays);
// ['2024-01-01', '2024-01-15', '2024-02-19', ...]

// Yahoo Finance functionality
const historicalData = await getHistoricalData('AAPL', new Date('2023-01-01'), new Date('2023-12-31'));
console.log(historicalData);
// [{date: Date, open: number, high: number, low: number, close: number, volume: number, adjClose: number}, ...]

const dividends = await getDividends('AAPL', new Date('2023-01-01'), new Date('2023-12-31'));
console.log(dividends);
// [{date: Date, amount: number}, ...]

const splits = await getStockSplits('AAPL', new Date('2000-01-01'), new Date());
console.log(splits);
// [{date: Date, splitRatio: string}, ...]
```

## CLI Utility: Historical Data Downloader

The package includes a powerful command-line utility for batch downloading historical stock data from Yahoo Finance to CSV files. This is ideal for data analysis, portfolio tracking, backtesting, and research.

### Installation & Setup

To use the CLI utility globally on your system:

```bash
# Clone the repository
git clone https://github.com/yourusername/longleap-tools.git
cd longleap-tools

# Install dependencies
npm install

# Build the project
npm run build

# Link CLI tool globally (optional, for global usage)
npm link
```

After running `npm link`, the `download-historical-data` command will be available globally in your terminal.

### Quick Start

```bash
# Download year-to-date prices for SPY
download-historical-data --symbols SPY --range YTD

# Download last 5 years of dividend data for AAPL and MSFT
download-historical-data -s AAPL,MSFT -r 5Y -d dividends -o ./my-data
```

### Command Line Arguments

| Argument | Short | Description | Required | Default |
|----------|-------|-------------|----------|---------|
| `--symbols` | `-s` | Comma-separated list of stock symbols | ✓ Yes | - |
| `--range` | `-r` | Date range specification | ✓ Yes | - |
| `--data-type` | `-d` | Type of data to download | No | `prices` |
| `--output` | `-o` | Output folder path | No | `./data` |

### Date Range Options

The `--range` argument supports the following formats:

| Range | Description | Example Start Date |
|-------|-------------|-------------------|
| `YTD` | Year to date (Jan 1 to today) | 2026-01-01 |
| `1Y` | Last 1 year | 2025-01-12 |
| `3Y` | Last 3 years | 2023-01-12 |
| `5Y` | Last 5 years | 2021-01-12 |
| `10Y` | Last 10 years | 2016-01-12 |
| `20Y` | Last 20 years | 2006-01-12 |
| `MAX` | Maximum available data | 2000-01-01 |
| `YYYYMMDD-YYYYMMDD` | Custom date range | (your dates) |

**Note:** All data is limited to dates from 2000-01-01 onwards.

**Custom Date Range Examples:**

- `20240101-20241231` - All of 2024
- `20200301-20200331` - March 2020
- `20100101-20231231` - 2010 through 2023

### Data Types

Use the `--data-type` (or `-d`) flag to specify what type of data to download:

#### Prices (default)

Downloads OHLCV (Open, High, Low, Close, Volume) data plus adjusted close.

**CSV Columns:**

- `Date` - Trading date (YYYY-MM-DD)
- `Open` - Opening price
- `High` - Highest price
- `Low` - Lowest price
- `Close` - Closing price
- `Volume` - Trading volume
- `AdjClose` - Adjusted closing price (accounts for splits/dividends)

**Filename:** `{SYMBOL}_historical.csv`

#### Dividends

Downloads dividend payment information.

**CSV Columns:**

- `Date` - Ex-dividend date (YYYY-MM-DD)
- `Amount` - Dividend amount per share

**Filename:** `{SYMBOL}_dividends.csv`

#### Splits

Downloads stock split information.

**CSV Columns:**

- `Date` - Split date (YYYY-MM-DD)
- `SplitRatio` - Split ratio (e.g., "2:1", "3:2")

**Filename:** `{SYMBOL}_splits.csv`

### Usage Examples

#### Basic: Download Prices (Default)

```bash
# Download YTD prices for a single symbol
download-historical-data --symbols SPY --range YTD

# Download 1-year prices for multiple symbols
download-historical-data -s SPY,QQQ,NVDA -r 1Y
```

#### Download Dividends

```bash
# Download 5 years of dividend history
download-historical-data -s AAPL -r 5Y -d dividends

# Download dividends for multiple dividend-paying stocks
download-historical-data -s KO,PEP,JNJ,PG -r 10Y -d dividends -o ./dividends
```

#### Download Stock Splits

```bash
# Download all available split history
download-historical-data -s AAPL,TSLA,NVDA -r MAX -d splits

# Download recent splits
download-historical-data -s GOOGL -r 3Y -d splits
```

#### Custom Date Ranges

```bash
# Download specific date range
download-historical-data -s SPY -r 20240101-20241231

# Download data for a specific quarter
download-historical-data -s QQQ -r 20240401-20240630 -o ./q2-2024

# Download historical period
download-historical-data -s MSFT -r 20100101-20151231
```

#### All Date Range Options

```bash
# Year to date
download-historical-data -s AAPL -r YTD

# 1 year back
download-historical-data -s AAPL -r 1Y

# 3 years back
download-historical-data -s AAPL -r 3Y

# 5 years back
download-historical-data -s AAPL -r 5Y

# 10 years back
download-historical-data -s AAPL -r 10Y

# 20 years back
download-historical-data -s AAPL -r 20Y

# Maximum available (since 2000)
download-historical-data -s AAPL -r MAX
```

#### Specify Output Folder

```bash
# Download to custom folder
download-historical-data -s SPY -r 1Y -o ./my-data

# Organize by data type
download-historical-data -s AAPL -r 5Y -d dividends -o ./income-tracking
download-historical-data -s AAPL -r 5Y -d prices -o ./price-history
download-historical-data -s AAPL -r 5Y -d splits -o ./corporate-actions
```

### Example Workflows

#### Portfolio Tracking

Download complete historical data for all portfolio holdings:

```bash
download-historical-data -s AAPL,MSFT,GOOGL,AMZN,NVDA -r MAX -d prices -o ./portfolio
download-historical-data -s AAPL,MSFT,GOOGL,AMZN,NVDA -r MAX -d dividends -o ./portfolio
download-historical-data -s AAPL,MSFT,GOOGL,AMZN,NVDA -r MAX -d splits -o ./portfolio
```

#### Recent Market Analysis

Download recent price data for sector analysis:

```bash
# Technology sector
download-historical-data -s AAPL,MSFT,GOOGL,META,NVDA -r 1Y -o ./tech-sector

# Financial sector
download-historical-data -s JPM,BAC,WFC,GS,MS -r 1Y -o ./financial-sector
```

#### Dividend Income Tracking

Download dividend history for income portfolio:

```bash
download-historical-data -s JNJ,PG,KO,PEP,MCD,WMT -r 10Y -d dividends -o ./dividend-income
```

#### Historical Adjustments

Download split history for price adjustment calculations:

```bash
download-historical-data -s AAPL,TSLA,NVDA,GOOGL,AMZN -r MAX -d splits -o ./splits-history
```

### Output Format

#### CSV File Structure

All CSV files include a header row followed by data rows. Dates are in `YYYY-MM-DD` format and data is sorted in ascending order by date.

**Example Price Data (`SPY_historical.csv`):**

```csv
Date,Open,High,Low,Close,Volume,AdjClose
2024-01-02,475.12,478.45,474.89,477.32,65234100,477.32
2024-01-03,477.50,479.88,476.23,478.91,72156300,478.91
2024-01-04,479.00,480.12,477.65,479.45,68943200,479.45
```

**Example Dividend Data (`AAPL_dividends.csv`):**

```csv
Date,Amount
2024-02-09,0.24
2024-05-10,0.24
2024-08-12,0.25
2024-11-08,0.25
```

**Example Split Data (`NVDA_splits.csv`):**

```csv
Date,SplitRatio
2021-07-20,4:1
2024-06-07,10:1
```

#### File Naming Convention

- Prices: `{SYMBOL}_historical.csv`
- Dividends: `{SYMBOL}_dividends.csv`
- Splits: `{SYMBOL}_splits.csv`

### Error Handling

The CLI utility provides clear feedback:

```bash
✓ Successfully downloaded 252 records for SPY to ./data/SPY_historical.csv
⚠️  No dividend data found for BRK.B
✗ Error downloading INVALID: Symbol not found
```

- **Success**: Shows record count and output file path
- **Warning**: Indicates when no data is available (e.g., no dividends/splits)
- **Error**: Displays specific error messages for failed downloads

### Notes

- The utility requires an active internet connection to fetch data from Yahoo Finance
- Rate limiting may apply for large batches of symbols
- Data availability depends on Yahoo Finance's data coverage
- Some symbols may not have dividend or split data
- Very old or delisted stocks may have limited data availability

## Market Holidays

The following market holidays are included (from year 2000 onwards):

- New Year's Day
- Martin Luther King Jr. Day (Third Monday in January)
- Presidents Day (Third Monday in February)
- Good Friday
- Memorial Day (Last Monday in May)
- Juneteenth National Independence Day (June 19, since 2021)
- Independence Day (July 4)
- Labor Day (First Monday in September)
- Thanksgiving Day (Fourth Thursday in November)
- Christmas Day (December 25)

### Holiday Observance Rules

- If the holiday falls on a Saturday, it is usually observed on the preceding Friday
- If the holiday falls on a Sunday, it is usually observed on the following Monday

### Special Market Closures

- September 11-14, 2001 (September 11 attacks)
- October 29-30, 2012 (Hurricane Sandy)
- December 5, 2018 (President George H.W. Bush Day of Mourning)
- March 23, 2020 (COVID-19 Trading Floor Closure)
- January 9, 2025 (President Jimmy Carter Day of Mourning)

## API Reference

### Market Holiday and Option Expiration Functions

#### getEarliestSupportedYear(): number

Returns the earliest year (2000) for which holiday data is available.

#### getMonthlyOptionExpirationDates(startYear: number, endYear: number): string[]

Returns an array of monthly option expiration dates between the specified years (inclusive).

- Dates are in YYYY-MM-DD format
- Throws error if years are before 2000
- Throws error if start year is greater than end year

#### isMarketHoliday(date: Date): boolean

Checks if a given date is a market holiday.

- Returns true if the date is a holiday, false otherwise
- Throws error if date is before year 2000

#### generateHolidays(startYear: number, endYear: number): string[]

Generates a list of market holidays between the specified years.

- Returns array of dates in YYYY-MM-DD format
- Includes special market closures if within range
- Throws error if years are before 2000

#### isTradingDay(date: Date): boolean

Checks if a given date is a trading day (not a weekend or market holiday).

- Returns true if the date is a trading day, false otherwise
- Throws error if date is before year 2000

### Yahoo Finance Functions

#### getHistoricalData(symbol: string, startDate: Date, endDate: Date): Promise<YahooFinanceData[]>

Fetches historical stock data for the given symbol and date range.

- Returns an array of objects containing date, open, high, low, close, volume, and adjClose
- Data is sorted by date in ascending order

#### getDividends(symbol: string, startDate: Date, endDate: Date): Promise<Dividend[]>

Retrieves dividend data for the given symbol and date range.

- Returns an array of objects containing date and amount
- Data is sorted by date in ascending order

#### getStockSplits(symbol: string, startDate: Date, endDate: Date): Promise<StockSplit[]>

Obtains stock split information for the given symbol and date range.

- Returns an array of objects containing date and splitRatio
- Data is sorted by date in ascending order

### Data Structures

#### YahooFinanceData

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
```

#### Dividend

```typescript
interface Dividend {
    date: Date;
    amount: number;
}
```

#### StockSplit

```typescript
interface StockSplit {
    date: Date;
    splitRatio: string;
}
```

## Error Handling

All functions that interact with external APIs (Yahoo Finance) use try-catch blocks to handle potential errors. If an error occurs during the API call or data processing, it will be thrown and should be caught and handled by the user of this library.

## Data Accuracy and Limitations

- Historical data, dividends, and stock splits are fetched from Yahoo Finance and are subject to their data accuracy and availability.
- The library does not provide real-time data. There may be a delay in the most recent data points.
- For very old or less frequently traded stocks, data might be limited or less accurate.

## Performance Considerations

- The functions fetching data from Yahoo Finance are asynchronous and return Promises. For large date ranges or multiple symbols, consider the potential impact on performance and rate limiting by the Yahoo Finance API.
- Data is sorted in memory, which could impact performance for very large datasets.

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### Version 1.6.0 (2026-01-12)

- **New Feature:** Added CLI utility for batch downloading historical data to CSV files
- Supports downloading prices, dividends, and stock splits
- Flexible date range options: YTD, 1Y, 3Y, 5Y, 10Y, 20Y, MAX, and custom ranges
- Command: `download-historical-data` with configurable output folders
- Comprehensive documentation and usage examples

### Version 1.5.2 (2026-01-07)

- Fixed Yahoo Finance data download by upgrading yahoo-finance2 from v2.x to v3.11.2
- Added ESLint support for improved code quality and consistency
- Fixed security vulnerabilities in dependencies

### Version 1.4.0

- Added new `isTradingDay` function to check if a given date is a trading day
- Updated documentation and tests to include the new function

### Version 1.3.0

- Refactored code to improve modularity: monthly options functions are now in a separate module
- All existing functionality remains unchanged, but import structure may be affected for users importing specific functions

### Version 1.2.0

- Added sorting of all data (historical, dividends, splits) by date in ascending order
- Improved error handling and data validation
- Updated documentation with more comprehensive details

### Version 1.1.0

- Added support for fetching stock split data
- Improved date parsing for all Yahoo Finance functions

### Version 1.0.0

- Initial release with support for market holidays, option expiration dates, and basic Yahoo Finance data fetching
