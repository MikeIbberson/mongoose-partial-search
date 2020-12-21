const { isNumber, asRegex } = require('./helpers');

module.exports = (schema = {}) =>
  Object.assign(schema.statics, {
    searchBuilder(term) {
      if (!term) return {};

      const arr = [];
      const statement = [String(term || '').trim()];

      const iterateSchema = (s, prevpath) =>
        s.eachPath((path, obj) => {
          const join = [prevpath, path]
            .filter((i = '') => i.trim())
            .join('.');

          if (obj.options.searchable) arr.push([join, obj]);
          if (obj.schema) iterateSchema(obj.schema, join);
        });

      const constructOr = (a) => (part) => ({
        $or: a
          .map(([field, type]) => {
            const isNum = isNumber(type);
            return isNum && Number.isNaN(Number(part))
              ? null
              : {
                  [field]: isNum ? part : asRegex(part),
                };
          })
          .filter(Boolean),
      });

      iterateSchema(this.schema);

      if (this.schema.discriminators)
        Object.values(this.schema.discriminators).forEach(
          (v) => iterateSchema(v),
        );

      if (!arr.length) return {};
      if (statement.length === 1)
        constructOr(arr)(statement);

      return {
        $and: statement.map(constructOr(arr)),
      };
    },
  });
