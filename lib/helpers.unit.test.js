const helpers = require('./helpers');

describe('Helpers', () => {
  describe('"isNumber"', () => {
    it('should return truthy', () => {
      expect(
        [
          Number,
          { instance: 'Number' },
          { name: 'Number' },
        ].every(helpers.isNumber),
      ).toBeTruthy();
    });

    it('should return falsy', () => {
      expect(helpers.isNumber('foo')).toBeFalsy();
    });
  });

  describe('"asRegex"', () => {
    it('should return as a regex', () => {
      expect(helpers.asRegex('foo')).toEqual(/^foo/gi);
    });

    it('should return as converted regex', () => {
      expect(helpers.asRegex('fo*')).toEqual(
        expect.any(RegExp),
      );
    });
  });
});
