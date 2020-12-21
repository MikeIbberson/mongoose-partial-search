const minimatch = require('minimatch');
const isGlob = require('is-glob');

const Num = 'Number';

const escapeRegExp = (string) =>
  typeof string === 'string'
    ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    : string;

const prepend = (string) => `^${string}`;

exports.isNumber = (value) =>
  value === Number ||
  value.name === Num ||
  value.instance === Num;

exports.asRegex = (value) => {
  try {
    return isGlob(value)
      ? minimatch.makeRe(value, {
          nocase: true,
        })
      : new RegExp(prepend(escapeRegExp(value)), 'gi');
  } catch (e) {
    return value;
  }
};
