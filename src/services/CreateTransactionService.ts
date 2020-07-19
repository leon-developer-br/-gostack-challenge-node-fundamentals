import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!value || !type) {
      throw Error('Invalid transaction fields');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw Error('Invalid balance type for transaction');
    }

    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new Error('Not enough balance');
    }

    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
