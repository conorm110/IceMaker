/** 
 * Copyright (c) 2022 Conor Mika
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 */

 const vscode = require('vscode');
 var path = require("path");
 const fs = require('fs');
 

 function copy_template(icemaker_folder) {
     // Check if pcf directory exists
     var startPath = path.join(require('path').dirname(__dirname), 'template', 'nand2tetris');
     if (!fs.existsSync(startPath)) {
         return false; 
     }
 
     // Read and go through template/pcf folder in extension data, copy all .pcf files
     var files = fs.readdirSync(startPath);
     for (var i = 0; i < files.length; i++) {
         var filename = path.join(startPath, files[i]);
         if (filename.endsWith(".v")) {
             fs.copyFile(filename, path.join(icemaker_folder, files[i]), (err) => {
                 if (err) {
                     return false;
                 }
             });
         };
     };
     return true;
 }

 
 module.exports = { copy_template };