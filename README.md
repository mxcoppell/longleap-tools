# LongLeap Tools

Calculate monthly stock options expiration dates with market holiday handling.

## Features

- Calculate monthly option expiration dates (third Friday of each month)
- Handle market holidays and weekend adjustments
- Support for special market closures
- Historical data available from year 2000 onwards
- TypeScript support with type definitions
- Comprehensive test coverage

## Installation

```bash
npm install longleap-tools
```

## Usage

```typescript
import { getMonthlyOptionExpirationDates, isMarketHoliday, generateHolidays, getEarliestSupportedYear } from 'longleap-tools';

// Get the earliest supported year
const earliestYear = getEarliestSupportedYear();
console.log(earliestYear); // 2000

// Get monthly option expiration dates for 2024
const dates = getMonthlyOptionExpirationDates(2024, 2024);
console.log(dates);
// ['2024-01-19', '2024-02-16', '2024-03-15', ...]

// Check if a date is a market holiday
const isHoliday = isMarketHoliday(new Date('2024-01-01'));
console.log(isHoliday); // true

// Generate list of market holidays for a year range
const holidays = generateHolidays(2024, 2024);
console.log(holidays);
// ['2024-01-01', '2024-01-15', '2024-02-19', ...]
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

### getEarliestSupportedYear(): number
Returns the earliest year (2000) for which holiday data is available.

### getMonthlyOptionExpirationDates(startYear: number, endYear: number): string[]
Returns an array of monthly option expiration dates between the specified years (inclusive).
- Dates are in YYYY-MM-DD format
- Throws error if years are before 2000
- Throws error if start year is greater than end year

### isMarketHoliday(date: Date): boolean
Checks if a given date is a market holiday.
- Returns true if the date is a holiday, false otherwise
- Throws error if date is before year 2000

### generateHolidays(startYear: number, endYear: number): string[]
Generates a list of market holidays between the specified years.
- Returns array of dates in YYYY-MM-DD format
- Includes special market closures if within range
- Throws error if years are before 2000

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 