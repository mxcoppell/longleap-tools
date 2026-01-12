#!/usr/bin/env node

/**
 * CLI utility for downloading historical stock data from Yahoo Finance
 * Supports multiple symbols and flexible date range specifications
 */

import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { getHistoricalData, getDividends, getStockSplits } from '../yahooFinance';

/**
 * Valid data types for download
 */
export type DataType = 'prices' | 'dividends' | 'splits';

/**
 * Command line arguments interface
 */
interface CLIArguments {
    symbols: string[];
    range: string;
    output: string;
    dataType?: DataType;
}

/**
 * CSV row data interface for price data
 */
interface PriceCSVRow {
    Date: string;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
    AdjClose: number;
}

/**
 * CSV row data interface for dividend data
 */
interface DividendCSVRow {
    Date: string;
    Amount: number;
}

/**
 * CSV row data interface for stock split data
 */
interface SplitCSVRow {
    Date: string;
    SplitRatio: string;
}

/**
 * Parse command line arguments
 */
function parseArguments(): CLIArguments {
    const args = process.argv.slice(2);
    const result: CLIArguments = {
        symbols: [],
        range: 'YTD',
        output: './data',
        dataType: 'prices', // Default to prices for backward compatibility
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if ((arg === '--symbols' || arg === '-s') && i + 1 < args.length) {
            result.symbols = args[i + 1].split(',').map(s => s.trim()).filter(s => s.length > 0);
            i++;
        } else if ((arg === '--range' || arg === '-r') && i + 1 < args.length) {
            result.range = args[i + 1];
            i++;
        } else if ((arg === '--output' || arg === '-o') && i + 1 < args.length) {
            result.output = args[i + 1];
            i++;
        } else if ((arg === '--data-type' || arg === '-d') && i + 1 < args.length) {
            const dataType = args[i + 1].toLowerCase();
            if (dataType === 'prices' || dataType === 'dividends' || dataType === 'splits') {
                result.dataType = dataType;
            } else {
                throw new Error(`Invalid data type: ${args[i + 1]}. Expected: prices, dividends, or splits`);
            }
            i++;
        }
    }

    return result;
}

/**
 * Parse date range and return start and end dates
 * @param rangeStr Range string (YTD, 1Y, 3Y, 5Y, 10Y, 20Y, MAX, or YYYYMMDD-YYYYMMDD)
 * @returns Object with startDate and endDate
 */
function parseDateRange(rangeStr: string): { startDate: Date; endDate: Date } {
    const today = new Date();
    const endDate = new Date(today); // Default to today
    let startDate: Date;

    // Normalize to uppercase for case-insensitive comparison
    const range = rangeStr.toUpperCase();

    if (range === 'YTD') {
        // Year to date: Jan 1 of current year to today
        startDate = new Date(today.getFullYear(), 0, 1);
    } else if (range === 'MAX') {
        // All available data from 2000-01-01
        startDate = new Date(2000, 0, 1);
    } else if (range.match(/^\d+Y$/)) {
        // N years back (1Y, 3Y, 5Y, etc.)
        const years = parseInt(range.replace('Y', ''));
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - years);
    } else if (range.match(/^\d{8}-\d{8}$/)) {
        // Custom date range: YYYYMMDD-YYYYMMDD
        const [startStr, endStr] = range.split('-');
        startDate = parseYYYYMMDD(startStr);
        const parsedEndDate = parseYYYYMMDD(endStr);

        // Validate dates are >= 2000
        if (startDate.getFullYear() < 2000 || parsedEndDate.getFullYear() < 2000) {
            throw new Error('Dates must be >= 2000-01-01');
        }

        return { startDate, endDate: parsedEndDate };
    } else {
        throw new Error(`Invalid range format: ${rangeStr}. Expected: YTD, 1Y, 3Y, 5Y, 10Y, 20Y, MAX, or YYYYMMDD-YYYYMMDD`);
    }

    // Validate start date is >= 2000
    if (startDate.getFullYear() < 2000) {
        startDate = new Date(2000, 0, 1);
    }

    return { startDate, endDate };
}

/**
 * Parse YYYYMMDD string to Date object
 */
function parseYYYYMMDD(dateStr: string): Date {
    if (dateStr.length !== 8 || !/^\d{8}$/.test(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYYMMDD`);
    }

    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8));

    const date = new Date(year, month, day);

    // Validate the date
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(`Invalid date: ${dateStr}`);
    }

    return date;
}

/**
 * Format Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Download historical data for a single symbol
 */
async function downloadSymbolData(
    symbol: string,
    startDate: Date,
    endDate: Date,
    outputFolder: string,
    dataType: DataType
): Promise<void> {
    console.log(`Processing ${symbol}...`);

    try {
        // Create output folder if it doesn't exist
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        let outputFile: string;
        let csvWriter: any;
        let recordCount: number;

        switch (dataType) {
            case 'prices': {
                // Fetch historical price data
                const data = await getHistoricalData(symbol, startDate, endDate);

                if (data.length === 0) {
                    console.warn(`⚠️  No data found for ${symbol}`);
                    return;
                }

                // Convert to CSV row format
                const csvRows: PriceCSVRow[] = data.map(item => ({
                    Date: formatDate(item.date),
                    Open: item.open,
                    High: item.high,
                    Low: item.low,
                    Close: item.close,
                    Volume: item.volume,
                    AdjClose: item.adjClose,
                }));

                // Write to CSV file
                outputFile = path.join(outputFolder, `${symbol}_historical.csv`);
                csvWriter = createObjectCsvWriter({
                    path: outputFile,
                    header: [
                        { id: 'Date', title: 'Date' },
                        { id: 'Open', title: 'Open' },
                        { id: 'High', title: 'High' },
                        { id: 'Low', title: 'Low' },
                        { id: 'Close', title: 'Close' },
                        { id: 'Volume', title: 'Volume' },
                        { id: 'AdjClose', title: 'AdjClose' },
                    ],
                });

                await csvWriter.writeRecords(csvRows);
                recordCount = data.length;
                break;
            }

            case 'dividends': {
                // Fetch dividend data
                const data = await getDividends(symbol, startDate, endDate);

                if (data.length === 0) {
                    console.warn(`⚠️  No dividend data found for ${symbol}`);
                    return;
                }

                // Convert to CSV row format
                const csvRows: DividendCSVRow[] = data.map(item => ({
                    Date: formatDate(item.date),
                    Amount: item.amount,
                }));

                // Write to CSV file
                outputFile = path.join(outputFolder, `${symbol}_dividends.csv`);
                csvWriter = createObjectCsvWriter({
                    path: outputFile,
                    header: [
                        { id: 'Date', title: 'Date' },
                        { id: 'Amount', title: 'Amount' },
                    ],
                });

                await csvWriter.writeRecords(csvRows);
                recordCount = data.length;
                break;
            }

            case 'splits': {
                // Fetch stock split data
                const data = await getStockSplits(symbol, startDate, endDate);

                if (data.length === 0) {
                    console.warn(`⚠️  No stock split data found for ${symbol}`);
                    return;
                }

                // Convert to CSV row format
                const csvRows: SplitCSVRow[] = data.map(item => ({
                    Date: formatDate(item.date),
                    SplitRatio: item.splitRatio,
                }));

                // Write to CSV file
                outputFile = path.join(outputFolder, `${symbol}_splits.csv`);
                csvWriter = createObjectCsvWriter({
                    path: outputFile,
                    header: [
                        { id: 'Date', title: 'Date' },
                        { id: 'SplitRatio', title: 'SplitRatio' },
                    ],
                });

                await csvWriter.writeRecords(csvRows);
                recordCount = data.length;
                break;
            }

            default:
                throw new Error(`Unsupported data type: ${dataType}`);
        }

        console.log(`✓ Successfully downloaded ${recordCount} records for ${symbol} to ${outputFile}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error downloading ${symbol}: ${errorMessage}`);
    }
}

/**
 * Main CLI function
 */
export async function downloadHistoricalData(args?: CLIArguments): Promise<void> {
    try {
        // Parse arguments (or use provided args for programmatic use)
        const cliArgs = args || parseArguments();

        // Validate symbols
        if (cliArgs.symbols.length === 0) {
            throw new Error('No symbols provided. Use --symbols or -s flag with comma-separated symbols.');
        }

        // Parse date range
        const { startDate, endDate } = parseDateRange(cliArgs.range);

        // Default to 'prices' if dataType is not provided (backward compatibility)
        const dataType = cliArgs.dataType || 'prices';

        console.log('='.repeat(60));
        console.log('Historical Data Download Utility');
        console.log('='.repeat(60));
        console.log(`Symbols: ${cliArgs.symbols.join(', ')}`);
        console.log(`Data Type: ${dataType}`);
        console.log(`Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`);
        console.log(`Output Folder: ${cliArgs.output}`);
        console.log('='.repeat(60));
        console.log('');

        // Download data for each symbol
        for (const symbol of cliArgs.symbols) {
            await downloadSymbolData(symbol, startDate, endDate, cliArgs.output, dataType);
        }

        console.log('');
        console.log('='.repeat(60));
        console.log('Download complete!');
        console.log('='.repeat(60));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error: ${errorMessage}`);
        console.error('');
        console.error('Usage:');
        console.error('  download-historical-data --symbols SPY,QQQ,NVDA --range YTD --data-type prices --output ./data');
        console.error('');
        console.error('Options:');
        console.error('  --symbols, -s    Comma-separated list of symbols (required)');
        console.error('  --range, -r      Date range: YTD, 1Y, 3Y, 5Y, 10Y, 20Y, MAX, or YYYYMMDD-YYYYMMDD (default: YTD)');
        console.error('  --data-type, -d  Data type: prices, dividends, splits (default: prices)');
        console.error('  --output, -o     Output folder path (default: ./data)');
        console.error('');
        console.error('Examples:');
        console.error('  # Download prices (default)');
        console.error('  download-historical-data -s SPY -r YTD');
        console.error('');
        console.error('  # Download dividends only');
        console.error('  download-historical-data -s SPY -r 1Y -d dividends');
        console.error('');
        console.error('  # Download stock splits');
        console.error('  download-historical-data -s AAPL -r 5Y -d splits');
        console.error('');
        console.error('  # Custom date range');
        console.error('  download-historical-data -s NVDA -r 20240101-20241231 -o ./output');
        console.error('');
        console.error('Note: Capital gains data is not supported by Yahoo Finance API.');
        process.exit(1);
    }
}

// Run CLI if executed directly
if (require.main === module) {
    downloadHistoricalData();
}
