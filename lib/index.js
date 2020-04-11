const Num = 'Number';

const escapeRegExp = (string) =>
  typeof string === 'string'
    ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    : string;

const isNumber = (value) =>
  value === Number ||
  value.name === Num ||
  value.instance === Num;

const asRegex = (truthy, value) =>
  truthy ? new RegExp(escapeRegExp(value), 'gi') : value;

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
                  [field]: asRegex(!isNum, part),
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
