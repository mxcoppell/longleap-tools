import { downloadHistoricalData } from '../src/utilities/downloadHistoricalData';
import * as fs from 'fs';
import * as path from 'path';

// Store original process.argv
const originalArgv = process.argv;

// Test output directory
const TEST_OUTPUT_DIR = './test-output';

// Helper function to read and parse CSV file
function parseCSVFile(filePath: string): Array<Record<string, string>> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        return row;
    });
}

// Helper function to clean up test output directory
function cleanupTestOutput(): void {
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
        const files = fs.readdirSync(TEST_OUTPUT_DIR);
        files.forEach(file => {
            fs.unlinkSync(path.join(TEST_OUTPUT_DIR, file));
        });
        fs.rmdirSync(TEST_OUTPUT_DIR);
    }
}

describe('downloadHistoricalData', () => {
    jest.setTimeout(30000); // Increase timeout for API calls

    // Clean up before and after all tests
    beforeAll(() => {
        cleanupTestOutput();
    });

    afterAll(() => {
        cleanupTestOutput();
    });

    describe('Date Range Parsing', () => {
        it('should handle YTD (Year-To-Date) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: YTD range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: 'YTD',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            console.log(`First date: ${data[0].Date}`);
            console.log(`Last date: ${data[data.length - 1].Date}`);

            // First date should be Jan 1 of current year
            const currentYear = new Date().getFullYear();
            expect(data[0].Date).toMatch(new RegExp(`^${currentYear}-01-`));
            expect(data.length).toBeGreaterThan(0);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 1Y (1 Year) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 1Y range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '1Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            console.log(`First date: ${data[0].Date}`);
            console.log(`Last date: ${data[data.length - 1].Date}`);

            // Should have approximately 250 trading days (1 year)
            expect(data.length).toBeGreaterThan(200);
            expect(data.length).toBeLessThan(300);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 3Y (3 Years) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 3Y range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '3Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);

            // Should have approximately 750 trading days (3 years)
            expect(data.length).toBeGreaterThan(600);
            expect(data.length).toBeLessThan(900);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 5Y (5 Years) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 5Y range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '5Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);

            // Should have approximately 1250 trading days (5 years)
            expect(data.length).toBeGreaterThan(1000);
            expect(data.length).toBeLessThan(1500);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 10Y (10 Years) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 10Y range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '10Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);

            // Should have approximately 2500 trading days (10 years)
            expect(data.length).toBeGreaterThan(2000);
            expect(data.length).toBeLessThan(3000);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 20Y (20 Years) range', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 20Y range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);

            // Should have approximately 5000 trading days (20 years)
            expect(data.length).toBeGreaterThan(4000);
            expect(data.length).toBeLessThan(6000);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle MAX range (starts from 2000-01-01)', async () => {
            const symbol = 'SPY';
            console.log('\nTest: MAX range for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: 'MAX',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            console.log(`First date: ${data[0].Date}`);
            console.log(`Last date: ${data[data.length - 1].Date}`);

            // First date should be 2000-01-03 or close (first trading day of 2000)
            expect(data[0].Date).toMatch(/^2000-01-/);

            // Should have data from 2000 to now (approximately 6000+ trading days)
            expect(data.length).toBeGreaterThan(5000);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle custom YYYYMMDD-YYYYMMDD format', async () => {
            const symbol = 'SPY';
            const startDate = '20240101';
            const endDate = '20240131';
            console.log(`\nTest: Custom range ${startDate}-${endDate} for`, symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: `${startDate}-${endDate}`,
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            console.log(`First date: ${data[0].Date}`);
            console.log(`Last date: ${data[data.length - 1].Date}`);

            // Should have approximately 21 trading days in January 2024
            expect(data.length).toBeGreaterThan(15);
            expect(data.length).toBeLessThan(25);

            // All dates should be in January 2024
            data.forEach(row => {
                expect(row.Date).toMatch(/^2024-01-/);
            });

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle case-insensitive range strings', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Case-insensitive range (ytd) for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: 'ytd', // lowercase
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);
            expect(parseCSVFile(outputFile).length).toBeGreaterThan(0);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should throw error for invalid date format', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Invalid date format');

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                throw new Error('process.exit called');
            }) as any);

            try {
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '2024-01-01', // Invalid format (should be YYYYMMDD)
                    output: TEST_OUTPUT_DIR,
                });
                fail('Should have thrown an error');
            } catch (error) {
                expect((error as Error).message).toContain('process.exit called');
            } finally {
                mockExit.mockRestore();
            }
        });

        it('should throw error for invalid YYYYMMDD date', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Invalid YYYYMMDD date');

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                throw new Error('process.exit called');
            }) as any);

            try {
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '20241332-20241231', // Invalid month
                    output: TEST_OUTPUT_DIR,
                });
                fail('Should have thrown an error');
            } catch (error) {
                expect((error as Error).message).toContain('process.exit called');
            } finally {
                mockExit.mockRestore();
            }
        });

        it('should throw error for dates before 2000', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Date before 2000');

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                throw new Error('process.exit called');
            }) as any);

            try {
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '19990101-20000101', // 1999 is before 2000
                    output: TEST_OUTPUT_DIR,
                });
                fail('Should have thrown an error');
            } catch (error) {
                expect((error as Error).message).toContain('process.exit called');
            } finally {
                mockExit.mockRestore();
            }
        });
    });

    describe('Symbol Processing', () => {
        it('should download data for a single symbol', async () => {
            const symbol = 'AAPL';
            console.log('\nTest: Single symbol download for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            expect(data.length).toBeGreaterThan(0);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should download data for multiple symbols', async () => {
            const symbols = ['SPY', 'QQQ', 'AAPL'];
            console.log('\nTest: Multiple symbols download for', symbols.join(', '));

            await downloadHistoricalData({
                symbols: symbols,
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            // Check that all files were created
            symbols.forEach(symbol => {
                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                console.log(`${symbol}: ${data.length} records`);
                expect(data.length).toBeGreaterThan(0);

                // Clean up
                fs.unlinkSync(outputFile);
            });
        });

        it('should handle invalid symbols gracefully', async () => {
            const symbol = 'INVALID_SYMBOL_XYZ123';
            console.log('\nTest: Invalid symbol', symbol);

            // Should not throw, but should log error
            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            // File should not be created for invalid symbol
            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(false);
        });

        it('should handle mix of valid and invalid symbols', async () => {
            const symbols = ['SPY', 'INVALID_XYZ', 'AAPL'];
            console.log('\nTest: Mixed valid/invalid symbols');

            await downloadHistoricalData({
                symbols: symbols,
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            // Valid symbols should have files
            const spyFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            const aaplFile = path.join(TEST_OUTPUT_DIR, 'AAPL_historical.csv');
            const invalidFile = path.join(TEST_OUTPUT_DIR, 'INVALID_XYZ_historical.csv');

            expect(fs.existsSync(spyFile)).toBe(true);
            expect(fs.existsSync(aaplFile)).toBe(true);
            expect(fs.existsSync(invalidFile)).toBe(false);

            // Clean up
            fs.unlinkSync(spyFile);
            fs.unlinkSync(aaplFile);
        });

        it('should throw error for empty symbol list', async () => {
            console.log('\nTest: Empty symbol list');

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                throw new Error('process.exit called');
            }) as any);

            try {
                await downloadHistoricalData({
                    symbols: [],
                    range: '20240101-20240131',
                    output: TEST_OUTPUT_DIR,
                });
                fail('Should have thrown an error');
            } catch (error) {
                expect((error as Error).message).toContain('process.exit called');
            } finally {
                mockExit.mockRestore();
            }
        });
    });

    describe('CSV Output', () => {
        it('should create CSV file with correct headers', async () => {
            const symbol = 'SPY';
            console.log('\nTest: CSV headers for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            const content = fs.readFileSync(outputFile, 'utf-8');
            const headers = content.split('\n')[0];

            console.log('Headers:', headers);
            expect(headers).toBe('Date,Open,High,Low,Close,Volume,AdjClose');

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should format dates as YYYY-MM-DD', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Date format for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            const data = parseCSVFile(outputFile);

            // Check all dates match YYYY-MM-DD format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            data.forEach(row => {
                expect(row.Date).toMatch(dateRegex);
            });

            console.log('Sample dates:', data.slice(0, 3).map(r => r.Date));

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should sort data by date ascending', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Date sorting for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            const data = parseCSVFile(outputFile);

            // Check that dates are in ascending order
            for (let i = 1; i < data.length; i++) {
                const prevDate = new Date(data[i - 1].Date);
                const currDate = new Date(data[i].Date);
                expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
            }

            console.log('First date:', data[0].Date);
            console.log('Last date:', data[data.length - 1].Date);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should include all required columns with correct data types', async () => {
            const symbol = 'AAPL';
            console.log('\nTest: Data types for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            const data = parseCSVFile(outputFile);

            // Check first row has all columns
            const firstRow = data[0];
            expect(firstRow).toHaveProperty('Date');
            expect(firstRow).toHaveProperty('Open');
            expect(firstRow).toHaveProperty('High');
            expect(firstRow).toHaveProperty('Low');
            expect(firstRow).toHaveProperty('Close');
            expect(firstRow).toHaveProperty('Volume');
            expect(firstRow).toHaveProperty('AdjClose');

            // Check that numeric values are valid numbers
            expect(parseFloat(firstRow.Open)).toBeGreaterThan(0);
            expect(parseFloat(firstRow.High)).toBeGreaterThan(0);
            expect(parseFloat(firstRow.Low)).toBeGreaterThan(0);
            expect(parseFloat(firstRow.Close)).toBeGreaterThan(0);
            expect(parseFloat(firstRow.Volume)).toBeGreaterThan(0);
            expect(parseFloat(firstRow.AdjClose)).toBeGreaterThan(0);

            // High should be >= Low
            expect(parseFloat(firstRow.High)).toBeGreaterThanOrEqual(parseFloat(firstRow.Low));

            console.log('Sample row:', firstRow);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should create output folder if it does not exist', async () => {
            const symbol = 'SPY';
            const nestedDir = path.join(TEST_OUTPUT_DIR, 'nested', 'folder');
            console.log('\nTest: Create nested output folder');

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: nestedDir,
            });

            expect(fs.existsSync(nestedDir)).toBe(true);

            const outputFile = path.join(nestedDir, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            // Clean up
            fs.unlinkSync(outputFile);
            fs.rmdirSync(path.join(nestedDir));
            fs.rmdirSync(path.join(TEST_OUTPUT_DIR, 'nested'));
        });

        it('should create file with symbol in filename', async () => {
            const symbol = 'NVDA';
            console.log('\nTest: Filename format for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            const expectedFilename = `${symbol}_historical.csv`;
            const outputFile = path.join(TEST_OUTPUT_DIR, expectedFilename);

            expect(fs.existsSync(outputFile)).toBe(true);
            console.log('Created file:', expectedFilename);

            // Clean up
            fs.unlinkSync(outputFile);
        });
    });

    describe('Error Handling', () => {
        it('should handle network/API failures gracefully', async () => {
            const symbol = 'UNKNOWN_TICKER_12345';
            console.log('\nTest: API error handling for', symbol);

            // Should not throw, but should log error
            await expect(
                downloadHistoricalData({
                    symbols: [symbol],
                    range: '20240101-20240131',
                    output: TEST_OUTPUT_DIR,
                })
            ).resolves.not.toThrow();

            // File should not be created
            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(false);
        });

        it('should continue processing remaining symbols after an error', async () => {
            const symbols = ['SPY', 'INVALID_XYZ', 'AAPL', 'BAD_SYMBOL'];
            console.log('\nTest: Continue after errors');

            await downloadHistoricalData({
                symbols: symbols,
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            // Valid symbols should have files
            const spyFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            const aaplFile = path.join(TEST_OUTPUT_DIR, 'AAPL_historical.csv');

            expect(fs.existsSync(spyFile)).toBe(true);
            expect(fs.existsSync(aaplFile)).toBe(true);

            // Clean up
            fs.unlinkSync(spyFile);
            fs.unlinkSync(aaplFile);
        });

        it('should throw error for completely invalid range format', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Invalid range format');

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                throw new Error('process.exit called');
            }) as any);

            try {
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: 'invalid-range',
                    output: TEST_OUTPUT_DIR,
                });
                fail('Should have thrown an error');
            } catch (error) {
                expect((error as Error).message).toContain('process.exit called');
            } finally {
                mockExit.mockRestore();
            }
        });
    });

    describe('Integration Tests', () => {
        it('should complete full workflow for single symbol', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Full workflow for', symbol);
            console.log('='.repeat(60));

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            console.log('='.repeat(60));

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            expect(data.length).toBeGreaterThan(0);

            // Validate structure
            expect(data[0]).toHaveProperty('Date');
            expect(data[0]).toHaveProperty('Open');
            expect(data[0]).toHaveProperty('High');
            expect(data[0]).toHaveProperty('Low');
            expect(data[0]).toHaveProperty('Close');
            expect(data[0]).toHaveProperty('Volume');
            expect(data[0]).toHaveProperty('AdjClose');

            console.log(`✓ Downloaded ${data.length} records`);
            console.log(`✓ File created: ${outputFile}`);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should complete full workflow for multiple symbols', async () => {
            const symbols = ['SPY', 'QQQ', 'AAPL'];
            console.log('\nTest: Full workflow for multiple symbols');
            console.log('='.repeat(60));

            await downloadHistoricalData({
                symbols: symbols,
                range: '20240101-20240131',
                output: TEST_OUTPUT_DIR,
            });

            console.log('='.repeat(60));

            symbols.forEach(symbol => {
                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                expect(data.length).toBeGreaterThan(0);

                console.log(`✓ ${symbol}: Downloaded ${data.length} records`);

                // Clean up
                fs.unlinkSync(outputFile);
            });
        });

        it('should download recent data with YTD range', async () => {
            const symbol = 'AAPL';
            console.log('\nTest: Recent YTD data for', symbol);

            await downloadHistoricalData({
                symbols: [symbol],
                range: 'YTD',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            expect(data.length).toBeGreaterThan(0);

            // Last date should be recent (within last 5 days of market data)
            const lastDate = new Date(data[data.length - 1].Date);
            const today = new Date();
            const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            console.log(`Last data date: ${data[data.length - 1].Date}`);
            console.log(`Days since last data: ${daysDiff}`);

            // Should be within 5 days (accounting for weekends and holidays)
            expect(daysDiff).toBeLessThan(5);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle small date range efficiently', async () => {
            const symbol = 'SPY';
            const startTime = Date.now();
            console.log('\nTest: Efficient small date range download');

            await downloadHistoricalData({
                symbols: [symbol],
                range: '20240115-20240119', // 1 week
                output: TEST_OUTPUT_DIR,
            });

            const elapsed = Date.now() - startTime;
            console.log(`Download completed in ${elapsed}ms`);

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);

            // Should have approximately 5 trading days
            expect(data.length).toBeGreaterThanOrEqual(3);
            expect(data.length).toBeLessThanOrEqual(7);

            console.log(`Downloaded ${data.length} records`);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle 30Y range and adjust if before 2000', async () => {
            const symbol = 'SPY';
            console.log('\nTest: 30Y range (edge case for year 2000 adjustment)');

            await downloadHistoricalData({
                symbols: [symbol],
                range: '30Y',
                output: TEST_OUTPUT_DIR,
            });

            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            console.log(`Records downloaded: ${data.length}`);
            console.log(`First date: ${data[0].Date}`);

            // Should have data starting from 2000 or later (not before)
            const firstYear = parseInt(data[0].Date.split('-')[0]);
            expect(firstYear).toBeGreaterThanOrEqual(2000);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should handle symbol with no data in range gracefully', async () => {
            const symbol = 'SPY';
            console.log('\nTest: Symbol with no data (future date range)');

            // Use a future date range where no data exists
            await downloadHistoricalData({
                symbols: [symbol],
                range: '21000101-21000131', // Year 2100
                output: TEST_OUTPUT_DIR,
            });

            // File should not be created when no data is available
            const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
            expect(fs.existsSync(outputFile)).toBe(false);
        });
    });

    describe('CLI Argument Parsing', () => {
        afterEach(() => {
            // Restore original process.argv
            process.argv = originalArgv;
        });

        it('should parse --symbols flag', async () => {
            console.log('\nTest: CLI argument parsing with --symbols');

            // Mock process.argv
            process.argv = ['node', 'script.js', '--symbols', 'SPY,AAPL', '--range', '20240101-20240110', '--output', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            const spyFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            const aaplFile = path.join(TEST_OUTPUT_DIR, 'AAPL_historical.csv');

            expect(fs.existsSync(spyFile)).toBe(true);
            expect(fs.existsSync(aaplFile)).toBe(true);

            // Clean up
            fs.unlinkSync(spyFile);
            fs.unlinkSync(aaplFile);
        });

        it('should parse -s short flag', async () => {
            console.log('\nTest: CLI argument parsing with -s');

            // Mock process.argv
            process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should parse --range flag', async () => {
            console.log('\nTest: CLI argument parsing with --range');

            // Mock process.argv
            process.argv = ['node', 'script.js', '--symbols', 'SPY', '--range', '1Y', '--output', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            const data = parseCSVFile(outputFile);
            // Should have approximately 250 trading days
            expect(data.length).toBeGreaterThan(200);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should parse -r short flag', async () => {
            console.log('\nTest: CLI argument parsing with -r');

            // Mock process.argv
            process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            // Clean up
            fs.unlinkSync(outputFile);
        });

        it('should parse --output flag', async () => {
            const customOutput = path.join(TEST_OUTPUT_DIR, 'custom');
            console.log('\nTest: CLI argument parsing with --output');

            // Mock process.argv
            process.argv = ['node', 'script.js', '--symbols', 'SPY', '--range', '20240101-20240110', '--output', customOutput];

            await downloadHistoricalData();

            const outputFile = path.join(customOutput, 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            // Clean up
            fs.unlinkSync(outputFile);
            fs.rmdirSync(customOutput);
        });

        it('should parse -o short flag', async () => {
            const customOutput = path.join(TEST_OUTPUT_DIR, 'short-flag');
            console.log('\nTest: CLI argument parsing with -o');

            // Mock process.argv
            process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', customOutput];

            await downloadHistoricalData();

            const outputFile = path.join(customOutput, 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            // Clean up
            fs.unlinkSync(outputFile);
            fs.rmdirSync(customOutput);
        });

        it('should use default values when flags not provided', async () => {
            console.log('\nTest: CLI default values');

            // Mock process.argv with only symbols (required)
            process.argv = ['node', 'script.js', '-s', 'SPY'];

            await downloadHistoricalData();

            // Should use default output folder './data'
            const outputFile = path.join('./data', 'SPY_historical.csv');
            expect(fs.existsSync(outputFile)).toBe(true);

            // Default range is YTD, so check first date
            const data = parseCSVFile(outputFile);
            const currentYear = new Date().getFullYear();
            expect(data[0].Date).toMatch(new RegExp(`^${currentYear}-01-`));

            // Clean up
            fs.unlinkSync(outputFile);
            fs.rmdirSync('./data');
        });

        it('should handle multiple symbols with spaces in comma-separated list', async () => {
            console.log('\nTest: CLI multiple symbols with spaces');

            // Mock process.argv with spaces after commas
            process.argv = ['node', 'script.js', '-s', 'SPY, QQQ, AAPL', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            const spyFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            const qqqFile = path.join(TEST_OUTPUT_DIR, 'QQQ_historical.csv');
            const aaplFile = path.join(TEST_OUTPUT_DIR, 'AAPL_historical.csv');

            expect(fs.existsSync(spyFile)).toBe(true);
            expect(fs.existsSync(qqqFile)).toBe(true);
            expect(fs.existsSync(aaplFile)).toBe(true);

            // Clean up
            fs.unlinkSync(spyFile);
            fs.unlinkSync(qqqFile);
            fs.unlinkSync(aaplFile);
        });

        it('should filter out empty symbols from comma-separated list', async () => {
            console.log('\nTest: CLI filter empty symbols');

            // Mock process.argv with extra commas
            process.argv = ['node', 'script.js', '-s', 'SPY,,AAPL,', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR];

            await downloadHistoricalData();

            // Only SPY and AAPL files should be created
            const spyFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
            const aaplFile = path.join(TEST_OUTPUT_DIR, 'AAPL_historical.csv');

            expect(fs.existsSync(spyFile)).toBe(true);
            expect(fs.existsSync(aaplFile)).toBe(true);

            // Clean up
            fs.unlinkSync(spyFile);
            fs.unlinkSync(aaplFile);
        });
    });

    describe('Data Type Support', () => {
        describe('Argument Parsing', () => {
            afterEach(() => {
                // Restore original process.argv
                process.argv = originalArgv;
            });

            it('should parse --data-type prices', async () => {
                console.log('\nTest: --data-type prices');

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR, '--data-type', 'prices'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should parse -d prices (short flag)', async () => {
                console.log('\nTest: -d prices (short flag)');

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR, '-d', 'prices'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should parse --data-type dividends', async () => {
                console.log('\nTest: --data-type dividends');

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '5Y', '-o', TEST_OUTPUT_DIR, '--data-type', 'dividends'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_dividends.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should parse -d dividends (short flag)', async () => {
                console.log('\nTest: -d dividends (short flag)');

                process.argv = ['node', 'script.js', '-s', 'AAPL', '-r', '3Y', '-o', TEST_OUTPUT_DIR, '-d', 'dividends'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'AAPL_dividends.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should parse --data-type splits', async () => {
                console.log('\nTest: --data-type splits');

                process.argv = ['node', 'script.js', '-s', 'TSLA', '-r', '5Y', '-o', TEST_OUTPUT_DIR, '--data-type', 'splits'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'TSLA_splits.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should parse -d splits (short flag)', async () => {
                console.log('\nTest: -d splits (short flag)');

                process.argv = ['node', 'script.js', '-s', 'NVDA', '-r', '5Y', '-o', TEST_OUTPUT_DIR, '-d', 'splits'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'NVDA_splits.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should handle case-insensitive data type values', async () => {
                console.log('\nTest: Case-insensitive data type (DIVIDENDS)');

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '3Y', '-o', TEST_OUTPUT_DIR, '-d', 'DIVIDENDS'];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_dividends.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should throw error for invalid data type', async () => {
                console.log('\nTest: Invalid data type');

                // Mock process.exit to prevent test termination
                const mockExit = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
                    throw new Error('process.exit called');
                }) as any);

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '1Y', '-o', TEST_OUTPUT_DIR, '-d', 'invalid'];

                try {
                    await downloadHistoricalData();
                    fail('Should have thrown an error');
                } catch (error) {
                    expect((error as Error).message).toContain('process.exit called');
                }

                mockExit.mockRestore();
            });

            it('should default to prices when data type not specified', async () => {
                console.log('\nTest: Default to prices data type');

                process.argv = ['node', 'script.js', '-s', 'SPY', '-r', '20240101-20240110', '-o', TEST_OUTPUT_DIR];

                await downloadHistoricalData();

                const outputFile = path.join(TEST_OUTPUT_DIR, 'SPY_historical.csv');
                expect(fs.existsSync(outputFile)).toBe(true);

                // Should have price data headers
                const content = fs.readFileSync(outputFile, 'utf-8');
                expect(content.split('\n')[0]).toBe('Date,Open,High,Low,Close,Volume,AdjClose');

                // Clean up
                fs.unlinkSync(outputFile);
            });
        });

        describe('Dividends Download', () => {
            it('should download dividend data for single symbol', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Single symbol dividend download for', symbol);

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                console.log(`Dividend records downloaded: ${data.length}`);
                expect(data.length).toBeGreaterThan(0);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should download dividend data for multiple symbols', async () => {
                const symbols = ['SPY', 'AAPL', 'JNJ'];
                console.log('\nTest: Multiple symbols dividend download');

                await downloadHistoricalData({
                    symbols: symbols,
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                symbols.forEach(symbol => {
                    const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                    expect(fs.existsSync(outputFile)).toBe(true);

                    const data = parseCSVFile(outputFile);
                    console.log(`${symbol}: ${data.length} dividend records`);
                    expect(data.length).toBeGreaterThan(0);

                    // Clean up
                    fs.unlinkSync(outputFile);
                });
            });

            it('should handle stock without dividends gracefully', async () => {
                const symbol = 'BRK.A';
                console.log('\nTest: Stock without dividends (BRK.A)');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                // File should not be created when no dividend data exists
                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                expect(fs.existsSync(outputFile)).toBe(false);
            });

            it('should validate dividend CSV format has Date and Amount columns', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Dividend CSV format validation');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const content = fs.readFileSync(outputFile, 'utf-8');
                const headers = content.split('\n')[0];

                console.log('Dividend headers:', headers);
                expect(headers).toBe('Date,Amount');

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate dividend dates are in YYYY-MM-DD format', async () => {
                const symbol = 'AAPL';
                console.log('\nTest: Dividend date format');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const data = parseCSVFile(outputFile);

                // Check all dates match YYYY-MM-DD format
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                data.forEach(row => {
                    expect(row.Date).toMatch(dateRegex);
                });

                console.log('Sample dividend dates:', data.slice(0, 3).map(r => r.Date));

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate dividend data is sorted by date ascending', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Dividend date sorting');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const data = parseCSVFile(outputFile);

                // Check that dates are in ascending order
                for (let i = 1; i < data.length; i++) {
                    const prevDate = new Date(data[i - 1].Date);
                    const currDate = new Date(data[i].Date);
                    expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
                }

                console.log('First dividend date:', data[0].Date);
                console.log('Last dividend date:', data[data.length - 1].Date);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate dividend amounts are numeric', async () => {
                const symbol = 'AAPL';
                console.log('\nTest: Dividend amounts are numeric');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const data = parseCSVFile(outputFile);

                // Check all amounts are valid numbers > 0
                data.forEach(row => {
                    const amount = parseFloat(row.Amount);
                    expect(amount).toBeGreaterThan(0);
                    expect(isNaN(amount)).toBe(false);
                });

                console.log('Sample dividend amounts:', data.slice(0, 3).map(r => r.Amount));

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should use correct filename format for dividends', async () => {
                const symbol = 'JNJ';
                console.log('\nTest: Dividend filename format');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const expectedFilename = `${symbol}_dividends.csv`;
                const outputFile = path.join(TEST_OUTPUT_DIR, expectedFilename);

                expect(fs.existsSync(outputFile)).toBe(true);
                console.log('Created dividend file:', expectedFilename);

                // Clean up
                fs.unlinkSync(outputFile);
            });
        });

        describe('Splits Download', () => {
            it('should download split data for single symbol', async () => {
                const symbol = 'TSLA';
                console.log('\nTest: Single symbol split download for', symbol);

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                console.log(`Split records downloaded: ${data.length}`);
                expect(data.length).toBeGreaterThan(0);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should download split data for multiple symbols', async () => {
                const symbols = ['TSLA', 'NVDA'];
                console.log('\nTest: Multiple symbols split download');

                await downloadHistoricalData({
                    symbols: symbols,
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                symbols.forEach(symbol => {
                    const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                    expect(fs.existsSync(outputFile)).toBe(true);

                    const data = parseCSVFile(outputFile);
                    console.log(`${symbol}: ${data.length} split records`);
                    expect(data.length).toBeGreaterThan(0);

                    // Clean up
                    fs.unlinkSync(outputFile);
                });
            });

            it('should handle stock without splits gracefully', async () => {
                const symbol = 'BRK.A';
                console.log('\nTest: Stock without splits (BRK.A)');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                // File should not be created when no split data exists
                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                expect(fs.existsSync(outputFile)).toBe(false);
            });

            it('should validate split CSV format has Date and SplitRatio columns', async () => {
                const symbol = 'TSLA';
                console.log('\nTest: Split CSV format validation');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                const content = fs.readFileSync(outputFile, 'utf-8');
                const headers = content.split('\n')[0];

                console.log('Split headers:', headers);
                expect(headers).toBe('Date,SplitRatio');

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate split dates are in YYYY-MM-DD format', async () => {
                const symbol = 'NVDA';
                console.log('\nTest: Split date format');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                const data = parseCSVFile(outputFile);

                // Check all dates match YYYY-MM-DD format
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                data.forEach(row => {
                    expect(row.Date).toMatch(dateRegex);
                });

                console.log('Sample split dates:', data.slice(0, 3).map(r => r.Date));

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate split data is sorted by date ascending', async () => {
                const symbol = 'NVDA';
                console.log('\nTest: Split date sorting');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                const data = parseCSVFile(outputFile);

                // Check that dates are in ascending order
                for (let i = 1; i < data.length; i++) {
                    const prevDate = new Date(data[i - 1].Date);
                    const currDate = new Date(data[i].Date);
                    expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
                }

                console.log('First split date:', data[0].Date);
                console.log('Last split date:', data[data.length - 1].Date);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should validate split ratios are strings in correct format', async () => {
                const symbol = 'TSLA';
                console.log('\nTest: Split ratio format');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                const data = parseCSVFile(outputFile);

                // Check all split ratios match expected format (e.g., "3:1", "2:1", "5:1")
                const splitRatioRegex = /^\d+:\d+$/;
                data.forEach(row => {
                    expect(row.SplitRatio).toMatch(splitRatioRegex);
                });

                console.log('Sample split ratios:', data.slice(0, 3).map(r => r.SplitRatio));

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should use correct filename format for splits', async () => {
                const symbol = 'NVDA';
                console.log('\nTest: Split filename format');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const expectedFilename = `${symbol}_splits.csv`;
                const outputFile = path.join(TEST_OUTPUT_DIR, expectedFilename);

                expect(fs.existsSync(outputFile)).toBe(true);
                console.log('Created split file:', expectedFilename);

                // Clean up
                fs.unlinkSync(outputFile);
            });
        });

        describe('Data Type Combinations', () => {
            it('should download different data types for same symbol without interference', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Multiple data types for same symbol');

                // Download prices
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '20240101-20240131',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'prices',
                });

                // Download dividends
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                // All files should exist
                const priceFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                const dividendFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);

                expect(fs.existsSync(priceFile)).toBe(true);
                expect(fs.existsSync(dividendFile)).toBe(true);

                // Verify correct headers for each
                const priceContent = fs.readFileSync(priceFile, 'utf-8');
                expect(priceContent.split('\n')[0]).toBe('Date,Open,High,Low,Close,Volume,AdjClose');

                const dividendContent = fs.readFileSync(dividendFile, 'utf-8');
                expect(dividendContent.split('\n')[0]).toBe('Date,Amount');

                // Clean up
                fs.unlinkSync(priceFile);
                fs.unlinkSync(dividendFile);
            });

            it('should download all three data types for a symbol', async () => {
                const symbol = 'NVDA';
                console.log('\nTest: All three data types for NVDA');

                // Download prices
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '20240101-20240131',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'prices',
                });

                // Download dividends
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                // Download splits
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                // All files should exist
                const priceFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                const dividendFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const splitFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);

                expect(fs.existsSync(priceFile)).toBe(true);
                expect(fs.existsSync(dividendFile)).toBe(true);
                expect(fs.existsSync(splitFile)).toBe(true);

                console.log('✓ All three data types downloaded successfully');

                // Clean up
                fs.unlinkSync(priceFile);
                fs.unlinkSync(dividendFile);
                fs.unlinkSync(splitFile);
            });

            it('should verify correct CSV filenames for each data type', async () => {
                const symbol = 'NVDA';
                console.log('\nTest: Verify CSV filenames for each data type');

                // Download each type
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '20240101-20240131',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'prices',
                });

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                // Check filenames
                const priceFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                const dividendFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                const splitFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);

                expect(fs.existsSync(priceFile)).toBe(true);
                expect(fs.existsSync(dividendFile)).toBe(true);
                expect(fs.existsSync(splitFile)).toBe(true);

                console.log(`✓ Price file: ${symbol}_historical.csv`);
                console.log(`✓ Dividend file: ${symbol}_dividends.csv`);
                console.log(`✓ Split file: ${symbol}_splits.csv`);

                // Clean up
                fs.unlinkSync(priceFile);
                fs.unlinkSync(dividendFile);
                fs.unlinkSync(splitFile);
            });
        });

        describe('Integration Tests with Real Data', () => {
            it('should complete full workflow for dividend download', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Full dividend download workflow');
                console.log('='.repeat(60));

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                console.log('='.repeat(60));

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                expect(data.length).toBeGreaterThan(0);

                // Validate structure
                expect(data[0]).toHaveProperty('Date');
                expect(data[0]).toHaveProperty('Amount');

                // Validate data quality
                const amount = parseFloat(data[0].Amount);
                expect(amount).toBeGreaterThan(0);

                console.log(`✓ Downloaded ${data.length} dividend records`);
                console.log(`✓ File created: ${outputFile}`);
                console.log(`✓ Sample: ${data[0].Date} - $${data[0].Amount}`);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should complete full workflow for split download', async () => {
                const symbol = 'TSLA';
                console.log('\nTest: Full split download workflow');
                console.log('='.repeat(60));

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                console.log('='.repeat(60));

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);
                expect(data.length).toBeGreaterThan(0);

                // Validate structure
                expect(data[0]).toHaveProperty('Date');
                expect(data[0]).toHaveProperty('SplitRatio');

                // Validate split ratio format
                expect(data[0].SplitRatio).toMatch(/^\d+:\d+$/);

                console.log(`✓ Downloaded ${data.length} split records`);
                console.log(`✓ File created: ${outputFile}`);
                console.log(`✓ Sample: ${data[0].Date} - ${data[0].SplitRatio}`);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should download dividends for multiple symbols with real data', async () => {
                const symbols = ['SPY', 'AAPL', 'JNJ'];
                console.log('\nTest: Multiple symbols dividend integration test');
                console.log('='.repeat(60));

                await downloadHistoricalData({
                    symbols: symbols,
                    range: '3Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                console.log('='.repeat(60));

                symbols.forEach(symbol => {
                    const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                    expect(fs.existsSync(outputFile)).toBe(true);

                    const data = parseCSVFile(outputFile);
                    expect(data.length).toBeGreaterThan(0);

                    console.log(`✓ ${symbol}: ${data.length} dividend records`);

                    // Clean up
                    fs.unlinkSync(outputFile);
                });
            });

            it('should download splits for multiple symbols with real data', async () => {
                const symbols = ['TSLA', 'NVDA'];
                console.log('\nTest: Multiple symbols split integration test');
                console.log('='.repeat(60));

                await downloadHistoricalData({
                    symbols: symbols,
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                console.log('='.repeat(60));

                symbols.forEach(symbol => {
                    const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                    expect(fs.existsSync(outputFile)).toBe(true);

                    const data = parseCSVFile(outputFile);
                    expect(data.length).toBeGreaterThan(0);

                    console.log(`✓ ${symbol}: ${data.length} split records`);

                    // Clean up
                    fs.unlinkSync(outputFile);
                });
            });

            it('should handle date ranges ensuring dividend data exists', async () => {
                const symbol = 'SPY';
                console.log('\nTest: 5Y date range for dividends (ensures data exists)');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'dividends',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_dividends.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);

                // SPY pays quarterly dividends, so 5 years should have ~20 payments
                expect(data.length).toBeGreaterThan(15);
                expect(data.length).toBeLessThan(25);

                console.log(`✓ Downloaded ${data.length} dividend payments (expected ~20 for 5Y)`);

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should handle date ranges ensuring split data exists', async () => {
                const symbol = 'TSLA';
                console.log('\nTest: 5Y date range for splits (ensures data exists)');

                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '5Y',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'splits',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_splits.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                const data = parseCSVFile(outputFile);

                // TSLA had a split in 2022 within the 5Y range
                expect(data.length).toBeGreaterThanOrEqual(1);

                console.log(`✓ Downloaded ${data.length} split records`);
                console.log('Split history:', data.map(r => `${r.Date}: ${r.SplitRatio}`).join(', '));

                // Clean up
                fs.unlinkSync(outputFile);
            });

            it('should clean up test output files after tests', async () => {
                const symbol = 'SPY';
                console.log('\nTest: Verify cleanup of test files');

                // Create test files
                await downloadHistoricalData({
                    symbols: [symbol],
                    range: '20240101-20240110',
                    output: TEST_OUTPUT_DIR,
                    dataType: 'prices',
                });

                const outputFile = path.join(TEST_OUTPUT_DIR, `${symbol}_historical.csv`);
                expect(fs.existsSync(outputFile)).toBe(true);

                // Clean up
                fs.unlinkSync(outputFile);

                // Verify file is deleted
                expect(fs.existsSync(outputFile)).toBe(false);
                console.log('✓ Test cleanup verified');
            });
        });
    });
});
