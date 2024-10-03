function moveEmptyRows() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('Test');
  // Using an example, preset range
  const range = sheet.getRange("A5:A70");
  // lastDataRow will be the index of the final line that isn't empty
  let lastDataRow = 0;
  const emptyArrays= [];
  const rangeData = range.getValues();
  // Iterate backwards through the array; this accounts for blank rows at the beginning of the range and makes it much easier to determine our data boundaries
  for (let i = rangeData.length - 1; i >= 0; i--) {
    if (rangeData[i][0] != "" && lastDataRow == 0) {
      lastDataRow = i;
    }
    if (i < lastDataRow && rangeData[i][0] == "") {
      emptyArrays.push(i);
    }
  }
  // Add 5 to every item to account for the header rows
  lastDataRow += 5;
  const emptyRows = emptyArrays.map((x) => x + 5);
  emptyRows.forEach((row) => {
    let moveRow = sheet.getRange(`A${row}`);
    sheet.moveRows(moveRow, lastDataRow + 1);
  });
}

// Logger.log(rangeData);
// Logger.log(lastDataRow);
// Logger.log(emptyArrays);
// Logger.log(emptyRows);
// Logger.log(activeRange.getHeight());
// Logger.log(activeRange.getRow());
