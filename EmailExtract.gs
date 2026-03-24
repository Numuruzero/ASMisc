// Takes a regexp search term and email search term and will output results to a connected spreadsheet
function extractFromEmails(pat, search) {
  const results = GmailApp.search(search);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); // Replace with your spreadsheet name
  results.forEach((email) => {
    const firstMessage = email.getMessages()[0].getPlainBody().replaceAll(/[\r\n]/g,' ').replaceAll(/ {2,}/g,' ');
    const thisSub = email.getFirstMessageSubject();
    const extract = pat.exec(firstMessage);
    console.log(`Finding ${extract} in ${thisSub}`)
    console.log(firstMessage)
    if (extract !== null) {
      const range = sheet.getRange(sheet.getLastRow()+1, 1).setValue(extract[0]);
    }
  })
}
