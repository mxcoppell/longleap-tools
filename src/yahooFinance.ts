import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

/**
 * Represents historical stock data for a single day.
 */
export interface YahooFinanceData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjClose: number;
}

/**
 * Represents a dividend payment.
 */
export interface Dividend {
    date: Date;
    amount: number;
}

/**
 * Represents a stock split.
 */
export interface StockSplit {
    date: Date;
    splitRatio: string;
}

/**
 * Fetches historical stock data for the given symbol and date range.
 * @param symbol The stock symbol (e.g., 'AAPL' for Apple Inc.)
 * @param startDate The start date for the data range
 * @param endDate The end date for the data range
 * @returns A Promise resolving to an array of YahooFinanceData objects, sorted by date in ascending order
 */
export async function getHistoricalData(
    symbol: string,
    startDate: Date,
    endDate: Date
): Promise<YahooFinanceData[]> {
    // Add one day to endDate to ensure we include the last day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    const result = await yahooFinance.chart(symbol, {
        period1: startDate,
        period2: adjustedEndDate,
        interval: '1d',
    }) as any;

    return result.quotes.map((item: any) => {
        // Check if the timestamp is in seconds or milliseconds
        const date = new Date(item.date > 10000000000 ? item.date : item.date * 1000);
        return {
            date: isNaN(date.getTime()) ? new Date() : date, // Use current date if invalid
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
            adjClose: item.adjclose, // Note the lowercase 'c' in 'adjclose'
        };
    }).sort((a: YahooFinanceData, b: YahooFinanceData) => a.date.getTime() - b.date.getTime());
}

/**
 * Retrieves dividend data for the given symbol and date range.
 * @param symbol The stock symbol (e.g., 'AAPL' for Apple Inc.)
 * @param startDate The start date for the data range
 * @param endDate The end date for the data range
 * @returns A Promise resolving to an array of Dividend objects, sorted by date in ascending order
 */
export async function getDividends(
    symbol: string,
    startDate: Date,
    endDate: Date
): Promise<Dividend[]> {
    // Add one day to endDate to ensure we include the last day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    const result = await yahooFinance.chart(symbol, {
        period1: startDate,
        period2: adjustedEndDate,
        interval: '1d',
        events: 'div',
    }) as any;

    return (result.events?.dividends || []).map((item: any) => {
        // Yahoo Finance API returns timestamps as numbers (seconds or milliseconds)
        const timestamp = typeof item.date === 'number' ? item.date : new Date(item.date).getTime() / 1000;
        const date = new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000);

        return {
            date: isNaN(date.getTime()) ? new Date() : date,
            amount: item.amount,
        };
    }).sort((a: Dividend, b: Dividend) => a.date.getTime() - b.date.getTime());
}

/**
 * Obtains stock split information for the given symbol and date range.
 * @param symbol The stock symbol (e.g., 'AAPL' for Apple Inc.)
 * @param startDate The start date for the data range
 * @param endDate The end date for the data range
 * @returns A Promise resolving to an array of StockSplit objects, sorted by date in ascending order
 */
export async function getStockSplits(
    symbol: string,
    startDate: Date,
    endDate: Date
): Promise<StockSplit[]> {
    // Add one day to endDate to ensure we include the last day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    const result = await yahooFinance.chart(symbol, {
        period1: startDate,
        period2: adjustedEndDate,
        interval: '1d',
        events: 'split',
    }) as any;

    return (result.events?.splits || []).map((item: any) => {
        // Yahoo Finance API returns timestamps as numbers (seconds or milliseconds)
        const timestamp = typeof item.date === 'number' ? item.date : new Date(item.date).getTime() / 1000;
        const date = new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000);

        return {
            date: isNaN(date.getTime()) ? new Date() : date,
            splitRatio: item.splitRatio,
        };
    }).sort((a: StockSplit, b: StockSplit) => a.date.getTime() - b.date.getTime());
}
