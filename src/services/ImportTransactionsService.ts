/* eslint-disable no-restricted-syntax */
import path from 'path';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import CreateTransactionService from './CreateTransactionService';

const createTransactionService = new CreateTransactionService();

class ImportTransactionsService {
  async execute(filename: string): Promise<void> {
    const filepath = path.resolve(process.cwd(), `tmp/${filename}`);
    const csv = fs.readFileSync(filepath);
    const transactions: string[][] = parse(csv);

    let index = 0;

    for (const transaction of transactions) {
      if (index > 0) {
        const [title, type, value, category] = transaction;

        // eslint-disable-next-line no-await-in-loop
        await createTransactionService.execute({
          title: title.trim(),
          type: type.trim() as 'income' | 'outcome',
          value: Number(value),
          category: category.trim(),
        });
      }
      index += 1;
    }

    await fs.promises.unlink(filepath);
  }
}

export default ImportTransactionsService;
