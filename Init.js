function onOpen(e) {
  var ui = DocumentApp.getUi();
  var menu = ui.createAddonMenu();
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    menu.addItem('Each Folder Item - With Description', 'showFolderPickerDes');
    menu.addItem('Single Item - With Description', 'showFilePickerDes');
    menu.addItem('Each Folder Item', 'showFolderPicker');
    menu.addItem('Single Item', 'showFilePicker');
  } else {
    menu.addItem('Each Folder Item - With Description', 'showFolderPickerDes');
    menu.addItem('Single Item - With Description', 'showFilePickerDes');
    menu.addItem('Each Folder Item', 'showFolderPicker');
    menu.addItem('Single Item', 'showFilePicker');
  }
  
  menu.addItem('Test', 'showOptions');
  
  menu.addToUi();
  
//  var uP = PropertiesService.getUserProperties();
//  var property = uP.getProperty("hasDraft");
//  if(property == null || property != "true") {
//    var result = ui.alert('Add to drafts', 'Do you want to add our premade templates to your email draft list?', ui.ButtonSet.YES_NO);
//
//    // Process the user's response.
//    if (result == ui.Button.YES) {
//      addTemplates();
//    }
//    
//    uP.setProperty("hasDraft", "true");
//  }
}

function showFolderPicker() {
  showPicker(false, false);
}

function showFilePicker() {
  showPicker(false, true);
}

function showFolderPickerDes() {
  showPicker(true, false);
}

function showFilePickerDes() {
  showPicker(true, true);
}

function showPicker(withDescription, isSelectFile) {
  var title = isSelectFile ? 'Select File' : 'Select Folder';
  var template = HtmlService.createTemplateFromFile('Picker.html');
  template.pickerData = { withDescription: withDescription, isSelectFile: isSelectFile };
  var html = template.evaluate()
      .setWidth(600)
      .setHeight(425)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  DocumentApp.getUi().showModalDialog(html, title);
}

function showOptions() {
  var html = HtmlService
      .createHtmlOutputFromFile('Options.html');
  
  DocumentApp.getUi().showModalDialog(html, 'aaaaaaaaaaaaaaaaaaa');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}