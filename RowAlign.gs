function rowAlign() {
    // Created with the assumption that Sub should match Dom
    const ss = SpreadsheetApp.getActive();
    const shDom = ss.getSheetByName('Dom');
    const shSub = ss.getSheetByName('Sub');
    // Using an example, preset range accounting for headers
    const arrDom = shDom.getRange("A5:A20").getValues();
    const arrSub = shSub.getRange("A5:A20").getValues();
    const hedct = 5;
    // Turn these into 1-dimensional arrays for ease of use
    const idDom = arrDom.flat();
    const idSub = arrSub.flat();
    const valDiffs = [];
    // Creating a new array with each index containing: [0]. the row on Dom [1]. the row on Sub [2]. the numerical distance between them (all shifted up 5 to account for headers)
    // Positive difference means it will be moved downwards (higher numbers) and negative difference means it will be moved upwards (lower numbers)
    idDom.forEach((id, index) => {
        if (index !== idSub.indexOf(id)) {
            valDiffs.push([index + hedct, idSub.indexOf(id) + hedct, (index + hedct) - (idSub.indexOf(id) + hedct)]);
        }
    });
    // Sort in descending order based on the absolute value of the numerical difference
    valDiffs.sort((a, b) => {
        if (Math.abs(a[2]) > Math.abs(b[2])) {
            return -1;
        }
    })
    // Iterate through each element and move the rows on Sub to match Dom, adjusting the differences each time
    let attempts = 3;
    let curDiff;
    // While loop to iterate up to 3 times
    while (attempts > 0) {
        // Loop through each row that needs to be changed
        for (let i = 0; i < valDiffs.length; i++) {
            if (curDiff == 0) {
                break;
            }
            if (valDiffs[i][2] !== 0 && valDiffs[i][1] !== valDiffs[i][0]) {
                let moveRow = shSub.getRange(`A${valDiffs[i][1]}`);
                // Due to odd nature of moveRows, must first determine if row will be moved up or down and adjust
                if (valDiffs[i][1] < valDiffs[i][0]) { // If the moving row is moving downward (incrementing) we must adjust the target row to capture the behavior we want
                    shSub.moveRows(moveRow, valDiffs[i][0] + 1); // comment out to manually adjust rows for testing
                } else if (valDiffs[i][1] > valDiffs[i][0]) { // If the moving row is moving upward (decrementing) the intended behavior is default
                    shSub.moveRows(moveRow, valDiffs[i][0]); // comment out to manually adjust rows for testing
                }
                valDiffs[i][2] = 0;
                // Separately iterate through each row to adjust row locations based on the last movement
                for (let j = 0; j < valDiffs.length; j++) {
                    if (valDiffs[i][1] < valDiffs[j][1] && valDiffs[i][0] >= valDiffs[j][1]) { // If the current start is lower than the current entry and the current endpoint is higher or equivalent, the current entry's start will be moved upward (decremented)
                        valDiffs[j][1]--;
                        valDiffs[j][2] = valDiffs[j][0] - valDiffs[j][1];
                    } else if (valDiffs[i][1] > valDiffs[j][1] && valDiffs[i][0] <= valDiffs[j][1]) { // If the current start is higher than the current entry and the current endpoint is lower or equivalent, the current entry's start will be moved downward (incremented)
                        valDiffs[j][1]++;
                        valDiffs[j][2] = valDiffs[j][0] - valDiffs[j][1];
                    };
                };
                valDiffs[i][1] = valDiffs[i][0];
                curDiff = valDiffs.reduce((acc, curr) => acc + Math.abs(curr[2]),
                    0,
                );
            };
        };
        if (curDiff == 0) {
            attempts = 0;
        } else {
            attempts--;
        }
    };
}
/* 
When moving rows, the script will move to a LITERAL index which is in fact the space before the row as read (eg move 6 to 9 moves 6 to row 8)
Moving a row upwards (decrementing) will move to the actual intended row as read and will result in target row moving up as expected
Moving a row downwards (incrementing) will move to the indicated index, which is actually the row as read before the intended target
Therefore, a determination needs to made in advance if the target row is higher or lower than the moving row and adjusted accordingly
*/

// Can condense this and the time it takes so it checks after every move if it needs to continue
function rowAlignCopy() {
    // Created with the assumption that Sub should match Dom
    const ss = SpreadsheetApp.getActive();
    const shDom = ss.getSheetByName('Dom');
    const shSub = ss.getSheetByName('Sub');
    // Using an example, preset range accounting for headers
    const arrDom = shDom.getRange("A5:A20").getValues();
    const arrSub = shSub.getRange("A5:A20").getValues();
    const hedct = 5; // Number of header rows
    // Turn these into 1-dimensional arrays for ease of use
    // const idDom = arrDom.map((x) => x = x[0]);
    // const idSub = arrSub.map((x) => x = x[0]);
    const idDom = arrDom.flat();
    const idSub = arrSub.flat();
    const valDiffs = [];
    // Creating a new array with each index containing: [0]. the row on Dom [1]. the row on Sub [2]. the numerical distance between them (all shifted up to account for headers)
    // Positive difference means it will be moved downwards (higher numbers) and negative difference means it will be moved upwards (lower numbers)
    idDom.forEach((id, index) => {
        if (index !== idSub.indexOf(id)) {
            valDiffs.push([index + hedct, idSub.indexOf(id) + hedct, (index + hedct) - (idSub.indexOf(id) + hedct)]);
        }
    });
    // Sort in descending order based on the absolute value of the numerical difference
    // Maybe re-sort after every attempt?
    valDiffs.sort((a, b) => {
        // Testing without abs
        // if (a[2] > b[2]) {
        //   return -1;
        // }
        if (Math.abs(a[2]) > Math.abs(b[2])) {
            return -1;
        }
        // Testing with sorting by smallest destination instead (no, diff is the way to go)
        // if (Math.abs(a[0]) < Math.abs(b[0])) {
        //     return -1;
        // }
    })
    console.log(valDiffs);
    // Iterate through each element and move the rows on Sub to match Dom, adjusting the differences each time
    let moves = 0;
    const moveLog = [];
    let attempts = 3;
    let curDiff;
    // While loop to iterate up to 3 times
    while (attempts > 0) {
        // Loop through each row that needs to be changed
        for (let i = 0; i < valDiffs.length; i++) {
            if (curDiff == 0) {
                break;
            }
            if (valDiffs[i][2] !== 0 && valDiffs[i][1] !== valDiffs[i][0]) {
                moveLog.push(`Move ${moves + 1}: ${valDiffs[i][1]} to ${valDiffs[i][0]}`)
                console.log(`Move ${moves + 1}`)
                let moveRow = shSub.getRange(`A${valDiffs[i][1]}`);
                // Due to odd nature of moveRows, must first determine if row will be moved up or down and adjust
                if (valDiffs[i][1] < valDiffs[i][0]) { // If the moving row is moving downward (incrementing) we must adjust the target row to capture the behavior we want
                    shSub.moveRows(moveRow, valDiffs[i][0] + 1); // comment out to manually adjust rows for testing
                } else if (valDiffs[i][1] > valDiffs[i][0]) { // If the moving row is moving upward (decrementing) the intended behavior is default
                    shSub.moveRows(moveRow, valDiffs[i][0]); // comment out to manually adjust rows for testing
                }
                valDiffs[i][2] = 0;
                console.log(`Sub row ${valDiffs[i][1]} was moved to row ${valDiffs[i][0]} and the difference will be adjusted to 0`);
                // Separately iterate through each row to adjust row locations based on the last movement
                for (let j = 0; j < valDiffs.length; j++) {
                    if (valDiffs[i][1] < valDiffs[j][1] && valDiffs[i][0] >= valDiffs[j][1]) { // If the current start is lower than the current entry and the current endpoint is higher or equivalent, the current entry's start will be moved upward (decremented)
                        valDiffs[j][1]--;
                        // console.log(`Recorded sub row ${valDiffs[j][1] + 1} was adjusted to ${valDiffs[j][1]}`);
                        // console.log(`Recorded row difference ${valDiffs[j][2]} will be adjusted to ${valDiffs[j][0] - valDiffs[j][1]} with objective ${valDiffs[j][0]}`);
                        valDiffs[j][2] = valDiffs[j][0] - valDiffs[j][1];
                    } else if (valDiffs[i][1] > valDiffs[j][1] && valDiffs[i][0] <= valDiffs[j][1]) { // If the current start is higher than the current entry and the current endpoint is lower or equivalent, the current entry's start will be moved downward (incremented)
                        valDiffs[j][1]++;
                        // console.log(`Recorded sub row ${valDiffs[j][1] - 1} was adjusted to ${valDiffs[j][1]}`);
                        // console.log(`Recorded row difference ${valDiffs[j][2]} will be adjusted to ${valDiffs[j][0] - valDiffs[j][1]} with objective ${valDiffs[j][0]}`);
                        valDiffs[j][2] = valDiffs[j][0] - valDiffs[j][1];
                    };
                };
                valDiffs[i][1] = valDiffs[i][0];
                moves++;
                console.log(valDiffs);
                curDiff = valDiffs.reduce((acc, curr) => acc + Math.abs(curr[2]),
                    0,
                );
            };
        };
        console.log(curDiff);
        console.log(`Attempt number ${Math.abs(attempts - 4)} complete`);
        if (curDiff == 0) {
            attempts = 0;
        } else {
            attempts--;
        }
    };
    console.log(`Alignment completed in ${moves} moves`);
    console.log(moveLog);
}


function moveTest() {
  const ss = SpreadsheetApp.getActive();
  const shSub = ss.getSheetByName('Sub');
  const moveRow = shSub.getRange(`A9`);
  shSub.moveRows(moveRow, 6);
}
