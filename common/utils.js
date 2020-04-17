/*
 * @Author: your name
 * @Date: 2020-04-17 14:45:06
 * @LastEditTime: 2020-04-17 16:40:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /friday/common/utils.js
 */
const ECMA_SIZES = {
  STRING: 2,
  BOOLEAN: 4,
  NUMBER: 8,
}

export function sizeof(obj) {
  let objType = typeof obj;

  switch (objType) {
    case "string":
      return ECMA_SIZES.STRING * obj.length;
    case "boolean":
      return ECMA_SIZES.BOOLEAN;
    case "number":
      return ECMA_SIZES.NUMBER;
    case "symbol":
      const isGlobalSymbol = Symbol.keyFor && Symbol.keyFor(obj);
      return isGlobalSymbol ? Symbol.keyFor(obj).length * ECMA_SIZES.STRING : (obj.toString().length - 8) * ECMA_SIZES.STRING;
    case "object":
      if (Array.isArray(obj)) {
        return obj.map((item) => sizeof(item)).reduce((acc, curr) => acc + curr);
      } else {
        return sizeofObject(obj);
      }
    default:
      return 0;
  }
}

export function sizeofObject(obj) {
  if (!obj) return 0;
  const keys = [];
  const bytes = 0;

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key);
    }
  }
  keys.forEach(key => {
    bytes += sizeof(key);
    bytes += sizeof(obj[key]);
  });

  return bytes;
}
