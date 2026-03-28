// Google Apps Script — paste this into Extensions > Apps Script in your Google Sheet
// Then Deploy > New deployment > Web app > Anyone can access > Deploy
// Copy the URL and paste it into SCRIPT_URL in index.html

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = ["Timestamp", "Nombre", "Comentarios"];
    data.features.forEach(function(f) { headers.push(f.name); });
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }

  var row = [data.timestamp, data.name, data.comments];
  data.features.forEach(function(f) { row.push(f.rating); });
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
