/**
 * Sets any amount of given ranges to their related values.
 * @param {Object} sheet - The intended sheet upon which to operate. Can only operate on a single sheet at a time.
 * @param {Object} defaults - An object with any number of key:value pairs, with ranges in A1 notation as the keys and their intended values as the values.
 */
function setByObject(sheet, defaults) {
  for (const range in defaults) {
    sheet.getRange(range).setValue(defaults[range]);
  }
}
