import fetchTransactions from '../api/fetchTransactions';

const mockTransactions = [
  {
    transactionId: 'TXN001',
    customerId: 'CUST001',
    firstName: 'Alice',
    lastName: 'Johnson',
    date: '2026-05-05',
    product: 'Winter Jacket',
    amount: 120.0,
  },
  {
    transactionId: 'TXN002',
    customerId: 'CUST002',
    firstName: 'Bob',
    lastName: 'Smith',
    date: '2026-06-12',
    product: 'Backpack',
    amount: 100.49,
  },
];

describe('fetchTransactions', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('fetches transactions from the public data endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTransactions),
    });

    const data = await fetchTransactions();

    expect(global.fetch).toHaveBeenCalledWith('/data/transactions.json');
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual(mockTransactions);
  });

  test('throws when the network response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn(),
    });

    await expect(fetchTransactions()).rejects.toThrow(
      'Failed to load data. HTTP status: 404'
    );
  });

  test('throws when API returns invalid non-array format', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'invalid format' }),
    });

    await expect(fetchTransactions()).rejects.toThrow(
      'Invalid data format received from API'
    );
  });
});
