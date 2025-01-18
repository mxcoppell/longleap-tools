import {
    getHistoricalData,
    getDividends,
    getStockSplits,
    YahooFinanceData,
    Dividend,
    StockSplit
} from '../src/yahooFinance';

describe('Yahoo Finance Functions', () => {
    jest.setTimeout(30000); // Increase timeout for API calls

    describe('getHistoricalData', () => {
        it('should fetch historical data for SPY for at least the past 10 trading days and return sorted results', async () => {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 20); // Go back 20 calendar days to ensure we get at least 10 trading days

            const result = await getHistoricalData('SPY', startDate, endDate);

            console.log('Historical Data (showing first 5 entries):');
            console.table(result.slice(0, 5).map(item => ({
                ...item,
                date: item.date.toISOString().split('T')[0],
                open: item.open.toFixed(2),
                high: item.high.toFixed(2),
                low: item.low.toFixed(2),
                close: item.close.toFixed(2),
                adjClose: item.adjClose.toFixed(2),
            })));

            expect(result.length).toBeGreaterThanOrEqual(10);
            expect(result[0]).toHaveProperty('date');
            expect(result[0]).toHaveProperty('open');
            expect(result[0]).toHaveProperty('high');
            expect(result[0]).toHaveProperty('low');
            expect(result[0]).toHaveProperty('close');
            expect(result[0]).toHaveProperty('volume');
            expect(result[0]).toHaveProperty('adjClose');

            // Verify that the dates are within the expected range
            const resultStartDate = new Date(result[0].date);
            const resultEndDate = new Date(result[result.length - 1].date);
            expect(resultEndDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
            expect(resultStartDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());

            // Verify that the results are sorted in ascending order
            for (let i = 1; i < result.length; i++) {
                expect(result[i].date.getTime()).toBeGreaterThan(result[i - 1].date.getTime());
            }
        });
    });

    describe('getDividends', () => {
        it('should fetch dividend data for SPY and return sorted results', async () => {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setFullYear(startDate.getFullYear() - 5); // Request 5 years of data

            const result = await getDividends('SPY', startDate, endDate);

            console.log('Dividend Data (showing first 5 entries):');
            console.table(result.slice(0, 5).map(item => ({
                ...item,
                date: item.date.toISOString().split('T')[0]
            })));

            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('date');
            expect(result[0]).toHaveProperty('amount');

            // Verify that we're getting a reasonable amount of data
            expect(result.length).toBeGreaterThanOrEqual(4); // Expecting at least 4 dividends in 5 years

            // Verify that the results are sorted in ascending order
            for (let i = 1; i < result.length; i++) {
                expect(result[i].date.getTime()).toBeGreaterThan(result[i - 1].date.getTime());
            }
        });
    });

    describe('getStockSplits', () => {
        it('should fetch stock split data for AAPL and return sorted results', async () => {
            const startDate = new Date('2000-01-01');
            const endDate = new Date();

            const result = await getStockSplits('AAPL', startDate, endDate);

            console.log('Stock Split Data:');
            console.table(result.map(item => ({
                ...item,
                date: item.date.toISOString().split('T')[0]
            })));

            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('date');
            expect(result[0]).toHaveProperty('splitRatio');

            // Verify that we're getting a reasonable amount of data
            expect(result.length).toBeGreaterThanOrEqual(2); // Expecting at least 2 splits for AAPL since 2000

            // Verify that the results are sorted in ascending order
            for (let i = 1; i < result.length; i++) {
                expect(result[i].date.getTime()).toBeGreaterThan(result[i - 1].date.getTime());
            }
        });
    });
});
