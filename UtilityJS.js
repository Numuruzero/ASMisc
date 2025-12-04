// Returns a 2D array for all data in a given table element
function captureTableData(tableElement) {
    const rows = tableElement.querySelectorAll("tr");
    const data = [];
    rows.forEach(row => {
        const cols = row.querySelectorAll("td,th");
        const rowData = [];
        cols.forEach(col => {
            rowData.push(col.innerText.trim());
        });
        data.push(rowData);
    });
    return data;
}
