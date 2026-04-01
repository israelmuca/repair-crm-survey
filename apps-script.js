// Google Apps Script — v2 survey backend
// Paste this into Extensions > Apps Script in your Google Sheet
// Then Deploy > Manage deployments > Edit > New version > Deploy
// IMPORTANT: You must create a NEW version when updating, or the old code runs

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Route v1 vs v2 payloads
  if (data.version === "v2") {
    return handleV2(data);
  }
  return handleV1(data);
}

function handleV2(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("v2") || ss.insertSheet("v2");

  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "Response ID",
      "Nombre",
      "Email",
      "Dolor 1",
      "Dolor 2",
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
      "Feature 5",
      "Sistema actual",
      "Reparaciones/mes",
      "Empleados",
      "CFDIs/mes",
      "Comentarios"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var pains = data.pains || [];
  var features = data.features || [];

  var row = [
    data.timestamp || new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
    data.responseId || "",
    data.name || "Anónimo",
    data.email || "",
    pains[0] || "",
    pains[1] || "",
    features[0] || "",
    features[1] || "",
    features[2] || "",
    features[3] || "",
    features[4] || "",
    data.system || "",
    data.repairs || "",
    data.employees || "",
    data.cfdi || "",
    data.comments || ""
  ];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", version: "v2" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleV1(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("v1")
    || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

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
    .createTextOutput(JSON.stringify({ status: "ok", version: "v1" }))
    .setMimeType(ContentService.MimeType.JSON);
}
