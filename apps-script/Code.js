const spreadsheetId = '1UK3huzFfa3lQnhqWylJU65IeF8z-L39zgj3bSKDMALI';
const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

function doPost(e) {
  // const stores = storeList();
  const postContent = JSON.parse(e.postData.getDataAsString());
  if ('get' === postContent.sub_action) {
    const result = main(postContent);
    return result
  }else{
    main(postContent);
  }
}


function main(json){
  let sheet = spreadsheet.getSheetByName(json.sheetName);
  let headerRowNum = getHeaderRowNum(sheet);
  let headerRow = sheet.getDataRange().getValues()[headerRowNum - 1];


  if(json.action == "insert"){
    insertRows(sheet, headerRow, json)
  }else if(json.action == "stockList"){
    return allData(sheet)
  }else if(json.action == 'processget'){
    return getRowsProcessValue(sheet)
  }else if(json.action == "storeGet"){
    return selectList(sheet, json.select)
  }else if (json.action == 'deadline'){
    return deadlineSeparator()
  }else if (json.action == 'lineopen'){
    return lineopenSeparator()
  }else if (json.action == 'storeOrderGet'){
    return orderGet(sheet,json)
  }
}

function selectList(sheet, columnName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var columnIndex = headers.indexOf(columnName) + 1;
  if (columnIndex === 0) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }
  var lastRow = sheet.getLastRow();
  var columnData = sheet.getRange(2, columnIndex, lastRow - 1).getValues();
  var nonEmptyValues = [];
  for (var i = 0; i < columnData.length; i++) {
    var cellValue = columnData[i][0];
    if (cellValue !== "") {
      nonEmptyValues.push(cellValue);
    }
  }
  return ContentService.createTextOutput(JSON.stringify(nonEmptyValues)).setMimeType(ContentService.MimeType.JSON);
}

function getHeaderRowNum(sheet) {
  let frozen = sheet.getFrozenRows()
  if ( frozen == 0 ){
    return 1
  } else {
    return frozen
  }
}


function insertRows(sheet, headerRow, jsonMessage){
  for (let row of jsonMessage.data){
    let rowArray = []
    for (let colName of headerRow){
      if (colName == "合計金額") {
        let total = row["商品単価"] * row["数量"];
        rowArray.push(total)
      }else if (colName =='商品詳細'){
        rowArray.push(row[colName].value)
      }else{
        rowArray.push(row[colName])
      }
    }
    //作成した空配列とデータの配列を結合し末尾に挿入
    rowArray[0] = getDatenow();
    if (jsonMessage.sheetName === '店舗へ') {
      rowArray[1] = jsonMessage.storeName;
    }
    rowArray.push('pending');//終わったら completed
    sheet.appendRow(rowArray);
  }
}


function getDatenow() {
  //今日の日付をDateオブジェクトで取得
  let today = new Date();
  //日付フォーマットをyyyy年MM月dd日に変更
  today = Utilities.formatDate(today,'JST','yyyy/MM/dd');
  //今日の日付を実行ログに出力
  console.log(today);
  return today;
}

function allData(sheet) {
  // シート内の2行目から最後の行までのデータを取得
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getRowsProcessValue(sheet) {
  const columnToCheck = 11;
  const separator = 'lineopen';
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  const matchingRows = [];

  for (let i = data.length - 1; i > 0; i--) {
    const row = data[i];
    if (row[columnToCheck - 1] === separator) {
      break;
    }
    matchingRows.unshift(row);
  }
  return ContentService.createTextOutput(JSON.stringify(matchingRows)).setMimeType(ContentService.MimeType.JSON);
}

function getSituation(){
  let sheet = spreadsheet.getSheetByName('店舗へ');
  const columnToCheck = 3;
  const separator = 'ProcessSeparator';
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  const matchingRows = [];

  for (let i = data.length - 1; i > 0; i--) {
    const row = data[i];
    if (row[columnToCheck - 1] === separator) {
      matchingRows.push(row);
      break;
    }
  }
  console.log(matchingRows)
  return ContentService.createTextOutput(JSON.stringify(matchingRows)).setMimeType(ContentService.MimeType.JSON);
}


// ProcessSeparator,deadline,lineopen
function deadlineSeparator(){
  let sheet = spreadsheet.getSheetByName('店舗へ');
  const now = getDatenow()
  let insertSepa = [now, '-', 'ProcessSeparator', '-', '-', '-', '-', '-', '-', '-', 'deadline'];
  sheet.appendRow(insertSepa);
}

function lineopenSeparator(){
  let sheet = spreadsheet.getSheetByName('店舗へ');
  const now = getDatenow()
  let insertSepa = [now, '-', 'ProcessSeparator', '-', '-', '-', '-', '-', '-', '-', 'lineopen'];
  sheet.appendRow(insertSepa);
}

function check(){
  let sheet = spreadsheet.getSheetByName('店舗へ');
  const columnToCheck = 11;
  const separator = 'lineopen';
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  const matchingRows = [];

  for (let i = data.length - 1; i > 0; i--) {
    const row = data[i];
    if (row[columnToCheck - 1] === separator) {
      break;
    }
    matchingRows.unshift(row);
  }
  if (matchingRows.length < 1){
    deadlineSeparator()
    console.log('閉じる')
  }else{
    console.log('閉じない')
  }
}

function orderGet(sheet) {
  var lastRow = sheet.getLastRow();
  var allValues = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
  var result = [];
  for (var i = lastRow - 1; i >= 0; i--) {
    if (allValues[i][11] === "lineopen") {
      break;
    }
    result.unshift(allValues[i]);
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}





function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .addMetaTag("viewport", "width=device-width,initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("オーシャン本部サイト");
};