var itemNoDesWidth = 116;

function generateQR(id, withDescription, isSelectFile, repetition, selectedPathId) {
  if(isSelectFile) {
    generateFileQR(id, withDescription, repetition);
  } else {
    generateFolderQR(id, withDescription, repetition);
  }
  
  if(selectedPathId != null) {
    saveDocumentToFolder(selectedPathId);
  }
}

function generateFileQR(fileId, withDescription, repetition) {
  var file = DriveApp.getFileById(fileId);
  
  if(file != null) {
    var url = file.getUrl();
    var qrImageUrl = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + url;
    
    if(withDescription) {
      insertRow(file.getName(), qrImageUrl, repetition);
    } else {
      var doc = DocumentApp.getActiveDocument();
      var body = doc.getBody();
      var table = body.appendTable();
      var fileList = [];
      fileList.push(file);
      
      insertRowNoDes(fileList, table, repetition);
    }
  }
}

function generateFolderQR(folderId, withDescription, repetition) {
  var folder = DriveApp.getFolderById(folderId);
  
  if(folder != null) {
    var list = [];
    var files = folder.getFiles();
    
    if(withDescription) {
      while (files.hasNext()){
        var file = files.next();
        var url = file.getUrl();
        var qrImageUrl = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + url; 
        insertRow(file.getName(), qrImageUrl, repetition);
      }
    } else {
      var doc = DocumentApp.getActiveDocument();
      var body = doc.getBody();
      var table = body.appendTable();
      
      var fileList = [];
      while (files.hasNext()) {
        fileList.push(files.next());
      }
      
      insertRowNoDes(fileList, table, repetition);
    }
  }
}

function insertRow(name, imageUrl, repetition) {
  //Style for the cells
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  cellStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
  
  var horizontalAlignment = {};
  horizontalAlignment[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var table = body.appendTable();
  
  var response = UrlFetchApp.fetch(imageUrl);
  var blob = response.getBlob();
  for(var i = 0; i < repetition; i++) {
    var row = table.appendTableRow();
    var cell = row.appendTableCell();
    var cell2 = row.appendTableCell(name);
    var image = cell.appendImage(blob);
    
    cell.setAttributes(cellStyle);
    image.getParent().setAttributes(horizontalAlignment);
    
    cell2.setAttributes(cellStyle);
  }
  
  table.setBorderWidth(2);
}

function insertRowNoDes(fileList, table, repetition) {
  var row = table.appendTableRow();
  var count = 0;
  
  fileList.forEach(function(element) {
    var url = element.getUrl();
    var qrImageUrl = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + url;
    var response = UrlFetchApp.fetch(qrImageUrl);
    var blob = response.getBlob();
    
    for(var i = 0; i < repetition; i++) {
      if(count >= 4) {
        count = 0;
        row = table.appendTableRow();
      }
      
      insertCell(element.getName(), blob, row);
      count++;
    }
  });
}

function insertCell(name, blob, row) {
  //Style for the cells
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  cellStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.BOTTOM;
  cellStyle[DocumentApp.Attribute.PADDING_LEFT] = 0;
  
  var horizontalAlignment = {};
  horizontalAlignment[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  
  var cell = row.appendTableCell();
  cell.setWidth(itemNoDesWidth);
  
  var image = cell.appendImage(blob);
  cell.setAttributes(cellStyle);
  image.getParent().setAttributes(horizontalAlignment);
  cell.setText("\n" + name);
  cell.setAttributes(horizontalAlignment);
}

function saveDocumentToFolder(pathId) {
  var doc = DocumentApp.create(DocumentApp.getActiveDocument().getName());
  var docFile = DriveApp.getFileById(doc.getId());
  DriveApp.getFolderById(pathId).addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
}