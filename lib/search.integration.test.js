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

const performSearchQuery = (
  term,
  expectedResultsLength,
) => (done) =>
  SearchableModel.find(SearchableModel.searchBuilder(term))
    .then((resp) => {
      return expect(resp).toHaveLength(
        expectedResultsLength,
      );
    })
    .then(() => {
      done();
    });

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

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Search', () => {
  it(
    'should not filter the results',
    performSearchQuery(null, 4),
  );

  it(
    'should yield all johns',
    performSearchQuery('John', 2),
  );

  it('should match on pet', performSearchQuery('Boots', 1));

  it(
    'should match on friend and name',
    performSearchQuery('Katie', 2),
  );

  it(
    'should match on combined string in single field',
    performSearchQuery('Henry B', 1),
  );

  it(
    'should yield match on combined string on multiple fields',
    performSearchQuery('John Katie', 1),
  );
});
