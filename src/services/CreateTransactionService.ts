/* eslint-disable @typescript-eslint/camelcase */
import { getRepository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

export interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (!title || !value || !type || !category) {
      throw new AppError('Invalid transaction fields');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Invalid balance type for transaction');
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Not enough balance');
    }

    let existingCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!existingCategory) {
      existingCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(existingCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: existingCategory.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
