module.exports = (schema = {}) =>
  Object.assign(schema.statics, {
    searchBuilder(term) {
      if (!term) return {};

      const arr = [];
      const statement = String(term || '')
        .split(' ')
        .map((i) => i.trim())
        .filter(Boolean);

      const iterateSchema = (s, prevpath) =>
        s.eachPath((path, obj) => {
          const join = [prevpath, path]
            .filter((i = '') => i.trim())
            .join('.');

          if (obj.options.searchable) arr.push(join);
          if (obj.schema) iterateSchema(obj.schema, join);
        });

      const constructOr = (a) => (part) => ({
        $or: a.map((field) => ({
          [field]: new RegExp(part, 'gi'),
        })),
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
