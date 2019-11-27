const mongoose = require('mongoose');
const plugin = require('.');

const base = new mongoose.Schema({
  name: {
    type: String,
    searchable: true,
  },
  friends: [
    {
      name: {
        type: String,
        searchable: true,
      },
    },
  ],
  pet: {
    name: {
      type: String,
      searchable: true,
    },
  },
});

mongoose.plugin(plugin);

const SearchableModel = mongoose.model(
  'SearchIntegration',
  base,
);

const performSearchQuery = async (
  term,
  expectedResultsLength,
) => {
  const resp = await SearchableModel.find(
    SearchableModel.searchBuilder(term),
  ).exec();

  return expect(resp).toHaveLength(expectedResultsLength);
};

beforeAll(async () => {
  await mongoose.connect(process.env.CONNECTION);
  await SearchableModel.create([
    { name: 'John Katie' },
    { name: 'Mary Anne', pet: { name: 'Sniffles' } },
    { name: 'John Kodie', pet: { name: 'Boots' } },
    {
      name: 'Henry Boyd',
      friends: [{ name: 'Arnold' }, { name: 'Katie' }],
    },
  ]);
});

describe('Search', () => {
  it('should not filter the results', async () =>
    performSearchQuery(null, 4));

  it('should yield all johns', async () =>
    performSearchQuery('John', 2));

  it('should match on pet', async () =>
    performSearchQuery('Boots', 1));

  it('should match on friend and name', async () =>
    performSearchQuery('Katie', 2));

  it('should match on combined string in single field', async () =>
    performSearchQuery('Henry B', 1));

  it('should yield match on combined string on multiple fields', async () =>
    performSearchQuery('John Katie', 1));
});
