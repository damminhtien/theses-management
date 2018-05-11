fn = function(req, res) {
    var dest, fileName, fs, l, tmpPath;
    
    fs = require('fs');
    
    tmpPath = req.files.upload.path;
    l = tmpPath.split('/').length;
    fileName = tmpPath.split('/')[l - 1] + "_" + req.files.upload.name;
    
    dest = __dirname + "/public/upload/" + fileName;
    fs.readFile(req.files.upload.path, function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      
      fs.writeFile(dest, data, function(err) {
        var html;
        if (err) {
          console.log(err);
          return;
        }
        
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += "    var url     = \"/upload/" + fileName + "\";";
        html += "    var message = \"Uploaded file successfully\";";
        html += "";
        html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";
        
        res.send(html);
      });
    });
  };
  
module.exports = fn;