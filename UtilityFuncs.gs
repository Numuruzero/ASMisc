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

// Maybe need a way to do this in reverse as well when working backwards through a list, but might work to just call reverse on the array and all subarrays
/**
 * Collapses an array of numbers down to a 2D array with start-end values
 * @param {Array} list - A 1-dimensional array of numbers in any order (will be sorted small to large)
 * @returns A 2-dimensional array of start-end values, with isolated numbers appearing twice
 */
function collapseRows(list) {
  list.sort((a, b) => a - b);
  console.log(list);
  const ranges = [[list[0]]];
  let j = 0;
  let run = false;
  for (let i = 1, end = list.length; i < end; i++) {
    if (list[i] == list[i - 1] + 1) {
      run = true;
      if (i == end - 1) {
      ranges[j].push(list[i]);
      }
      continue;
    } else {
      run = false;
      ranges[j].push(list[i - 1]);
      ranges.push([]);
      j++;
      ranges[j].push(list[i]);
    }
    if (i == end - 1) {
      ranges[j].push(list[i]);
    }
  }
  return ranges;
}
