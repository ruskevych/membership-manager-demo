import fs from 'fs/promises';
import path from 'path';

export class FileUtils {
    private static dataDir = path.join(__dirname, '../../../src/data');

    static async readJsonFile<T>(filename: string): Promise<T> {
        try {
            const filePath = path.join(this.dataDir, filename);
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as T;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                // If file doesn't exist, return empty array
                return [] as unknown as T;
            }
            throw error;
        }
    }

    static async writeJsonFile<T>(filename: string, data: T): Promise<void> {
        try {
            const filePath = path.join(this.dataDir, filename);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error writing to file ${filename}:`, error);
            throw new Error(`Failed to write to ${filename}`);
        }
    }

    static async ensureFileExists(filename: string, defaultContent: any = []): Promise<void> {
        const filePath = path.join(this.dataDir, filename);
        try {
            await fs.access(filePath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                await this.writeJsonFile(filename, defaultContent);
            }
        }
    }
} 