# LongLeap Tools

Calculate monthly stock options expiration dates with market holiday handling and fetch historical stock data from Yahoo Finance.

## Features

- Calculate monthly option expiration dates (third Friday of each month)
- Handle market holidays and weekend adjustments
- Support for special market closures
- Historical data available from year 2000 onwards
- Fetch historical stock data, dividends, and stock splits from Yahoo Finance
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
