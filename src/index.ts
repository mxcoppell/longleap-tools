/**
 * Calculate monthly stock options expiration dates with market holiday handling
 * and fetch sorted historical stock data, dividends, and splits from Yahoo Finance
 * @packageDocumentation
 */

// Yahoo Finance related imports and exports
import {
    getHistoricalData,
    getDividends,
    getStockSplits,
    YahooFinanceData,
    Dividend,
    StockSplit
} from './yahooFinance';

// Monthly options related imports
import {
    generateHolidays,
    isMarketHoliday,
    isTradingDay,
    getMonthlyOptionExpirationDates,
    getEarliestSupportedYear,
    YearOutOfRangeError,
    InvalidYearRangeError
} from './monthlyOptions';

export {
    getHistoricalData,
    getDividends,
    getStockSplits,
    YahooFinanceData,
    Dividend,
    StockSplit,
    generateHolidays,
    isMarketHoliday,
    isTradingDay,
    getMonthlyOptionExpirationDates,
    getEarliestSupportedYear,
    YearOutOfRangeError,
    InvalidYearRangeError
};
