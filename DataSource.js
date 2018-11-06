function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

function getFullPathById(id, isFile) {
  var parents;
  var folders = [];
  var name = "";
  if(isFile) {
    var file = DriveApp.getFileById(id);
    name = file.getName();
    parents = file.getParents();
  } else {
    var folder = DriveApp.getFolderById(id);
    name = folder.getName();
    parents = folder.getParents();
  }
  
  while (parents.hasNext()) {
    parents = parents.next();
    folders.push(parents.getName());
    parents = parents.getParents();
  }
  
  if (folders.length) {
    return folders.reverse().join("/") + "/" + name;
  } else {
    return name;
  }
}