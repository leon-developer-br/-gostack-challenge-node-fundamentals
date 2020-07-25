import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import upload from '../config/upload';

const transactionRouter = Router();

const createTransactionService = new CreateTransactionService();
const deleteTransactionService = new DeleteTransactionService();
const importTransactionsService = new ImportTransactionsService();

transactionRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const data = {
    transactions: await transactionsRepository.find(),
    balance: await transactionsRepository.getBalance(),
  };
  return response.json(data);
});

transactionRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transaction = await createTransactionService.execute({
    title,
    value: Number(value),
    type,
    category,
  });
  return response.status(201).json(transaction);
});

transactionRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await deleteTransactionService.execute(id);
  return response.status(204).end();
});

const uploadConfig = multer(upload);

transactionRouter.post(
  '/import',
  uploadConfig.single('file'),
  async (request, response) => {
    const { filename } = request.file;

    await importTransactionsService.execute(filename);
    return response.status(201).end();
  },
);

export default transactionRouter;
