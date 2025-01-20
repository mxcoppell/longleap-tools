import { getHistoricalData, getDividends, getStockSplits } from '../src/yahooFinance';

describe('Yahoo Finance Functions', () => {
  jest.setTimeout(30000); // Increase timeout for API calls

  describe('getHistoricalData', () => {
    it('should include the last trading day in the specified range', async () => {
      const startDate = new Date('2025-01-02');
      const endDate = new Date('2025-01-17');
      const symbol = 'SPY';

      console.log('Request Type: getHistoricalData');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getHistoricalData(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0]
      })));

      expect(data.length).toBeGreaterThan(0);
      const lastDataPoint = data[data.length - 1];
      expect(lastDataPoint.date.toISOString().split('T')[0]).toBe('2025-01-17');
    });

    it('should fetch historical data for a recent period', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);
      const symbol = 'AAPL';

      console.log('Request Type: getHistoricalData');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getHistoricalData(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0]
      })));

      expect(data.length).toBeGreaterThan(0);
      expect(data[0].date).toBeInstanceOf(Date);
      expect(typeof data[0].open).toBe('number');
      expect(typeof data[0].high).toBe('number');
      expect(typeof data[0].low).toBe('number');
      expect(typeof data[0].close).toBe('number');
      expect(typeof data[0].volume).toBe('number');
      expect(typeof data[0].adjClose).toBe('number');
    });

    it('should throw an error for invalid symbol', async () => {
      const startDate = new Date('2025-01-02');
      const endDate = new Date('2025-01-17');
      const symbol = 'INVALID_SYMBOL';

      await expect(getHistoricalData(symbol, startDate, endDate)).rejects.toThrow();
    });
  });

  describe('getDividends', () => {
    it('should fetch dividend data for AAPL over at least 10 years', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 10);
      const symbol = 'AAPL';

      console.log('Request Type: getDividends');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getDividends(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0]
      })));

      expect(data.length).toBeGreaterThan(0);
      expect(data[0].date).toBeInstanceOf(Date);
      expect(typeof data[0].amount).toBe('number');
    });

    it('should return an empty array for a stock with no dividends', async () => {
      const startDate = new Date('2020-01-01');
      const endDate = new Date();
      const symbol = 'TSLA'; // Tesla doesn't pay dividends as of 2023

      console.log('Request Type: getDividends');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getDividends(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data);

      expect(data).toEqual([]);
    });
  });

  describe('getStockSplits', () => {
    it('should fetch stock split data for NVDA over at least 10 years', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 10);
      const symbol = 'NVDA';

      console.log('Request Type: getStockSplits');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getStockSplits(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0]
      })));

      expect(data.length).toBeGreaterThan(0);
      expect(data[0].date).toBeInstanceOf(Date);
      expect(typeof data[0].splitRatio).toBe('string');
    });

    it('should return an array for a stock with known splits in the given period', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 10);
      const symbol = 'TSLA'; // Tesla has had splits in recent years

      console.log('Request Type: getStockSplits');
      console.log('Request Parameters:', { symbol, startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      const data = await getStockSplits(symbol, startDate, endDate);
      console.log('Response Data:');
      console.table(data);

      expect(data.length).toBeGreaterThan(0);
      expect(data[0].date).toBeInstanceOf(Date);
      expect(typeof data[0].splitRatio).toBe('string');
    });
  });
});
