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
  // console.log(list);
  const ranges = [[list[0]]];
  let j = 0;
  let run = false;
  // Edge case for if a single number is passed in
  if (list.length == 1) {
    return [[list[0], list[0]]];
  }
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
  // console.log(ranges);
  return ranges;
}

/**
 * Takes a CSV string as input (as formatted by GAS import)
 * @returns A 2-dimensional array indentical to a spreadsheet import
 */
function csv2array(text) {
  // console.log(text);
  // Since this is primarily meant to be used for capturing CSVs from emails, we may want to invoke .replace(/\\\\/g,"\\") on the input so that we can properly escape characters
  // For now leaving this out in case it results in unintended behavior in the future
  const lines = text.split(/\n|\r\n/);
  const result = [];

  // Iterate through each line of the incoming CSV
  for (const line of lines) {
    // console.log(line);
    // If the line is totally blank, ignore it (may be unwanted behavior?)
    if (line.trim() === '') continue;

    const row = [];
    // Current will be the entire line including trailing commas
    let current = line;
    // console.log(current);

    let group = '';
    // isQuote ignores commas while within a double quote ("example") block
    let isQuote = false;
    let doubleQuote = false;

    // Iterate through every character of the incoming line
    for (let i = 0, fin = current.length; i < fin; i++) {
      // We're looking at the current and next character to determine if we're about to reach the end of a cell
      const char = current[i];
      // const lastChar = current?.[i - 1];
      const nextChar = current?.[i + 1];
      
      // If we find a quotation mark, don't log it, but consider this to be the beginning or end of a cell. 
      // This does not account for escaped double quotes ("") but I do not care
      // Update, I care now. Added a clause for double quotes and also to catch if the last character is a quote.
      // When we see a quotation mark, we might be moving into a cell with commas
      if (char == '"' && !doubleQuote) { 
        // If the next character is a quote, we're looking at a double quote and we should include it in the cell
        if (nextChar == '"') {
          doubleQuote = !doubleQuote;
          continue;
        }
        // Otherwise, we're in a quote block and should ignore commas until we see another comma
        isQuote = !isQuote;
        if (i == fin - 1) {
          row.push(group);
          group = '';
          continue;
        }
        continue;
      }
      // If we see a comma, push what we've got into our row, reset the current group, and move on to the next cell
      if (char == ',') {
        // Unless we're in a quote block
        if (isQuote == true) {
          group += char;
          continue;
        } else {
          row.push(group);
          group = '';
          // If the last character of the line is a trailing comma, it means the final cell is blank, so we should add an additional blank cell
          // We shouldn't need to worry about being in a quote block at this point either
          if (i == fin - 1) {
            row.push(group);
          }
          continue;
        }
      }

      // For any other character just add it to our current group
      group += String(char);
      if (doubleQuote) {
        doubleQuote = !doubleQuote;
      }

      // Since the final cell won't have a trailing comma, just log it and reset if it's the end of the row
      if (i == fin - 1) {
        // console.log(group);
        row.push(group);
        group = '';
      }
    }

    result.push(row);
  }
  return result;
}

// Function to get the column letter for a given header string in an array of headers
function getAlpha(header) {
    // Could probably use below function to convert number to letters instead of calling the GAS function for it
    const letter = columnToLetter(headers.indexOf(header) + 1);
    if (letter == "") {
      // console.log(`Header "${header}" not found`);
      return undefined;
    }
    // console.log(`Found header "${header}" at column ${letter}`)
    return letter;
  }

// Filter function stolen from https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

// From https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
function letterToColumn(letter)
{
  let column = 0, length = letter.length;
  for (let i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}
function columnToLetter(column)
{
  let temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

// Retool this to accept numbers for columns too because why not
function getRangeIndices(start, end, ref) {
  let arRef = {};
  const startNum = letterToColumn(start);
  const endNum = letterToColumn(end);
  const length = endNum - startNum;

  for (let i = 0; i <= length; i++) {
    let searchCol = columnToLetter(startNum + i);
    let foundKey = null;
    // console.log(`Searching to the key for value ${searchCol} in ot`)

    for (const key in ref) {
      if (ref[key] === searchCol) {
        foundKey = key;
        // console.log(`Found ${searchCol} at key ${key}`)
          break; // Stop after finding the first match
      }
    }
    if (foundKey != null) {
      arRef[foundKey] = i;
    }
  }

  // console.log(arRef);
  return arRef;
}
