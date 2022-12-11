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
 const projects = require(path.join(__dirname, "projects.js"));
 const terminal = require(path.join(__dirname, "terminal.js"));

 /**
  * upload_bitstream()
  * 
  * Entry point for bitstream generation, calls function to upload to fomu after .dfu created
  * 
  */
function upload_bitstream() {
	var bitstream_file = "empty";
	var isErr = false;
	try {
		vscode.window.activeTextEditor.document.fileName;
	} catch(err) {
		isErr = true;
		const options = {
			canSelectMany: false,
			openLabel: 'Select',
			canSelectFiles: true,
			canSelectFolders: false,
			filters: {
				'Bitstream Files': ['bit'],
				'All files': ['*']
			}
		};
	   vscode.window.showOpenDialog(options).then(fileUri => {
		   if (fileUri && fileUri[0]) {
			   console.log('Selected file: ' + fileUri[0].fsPath);
			   bitstream_file = fileUri[0].fsPath;
			   uploading_fomu(bitstream_file);
		   }
	   });
	}
	if (!isErr) {
		bitstream_file = path.join(require('path').dirname(projects.findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName))),'bin','top.bit');
		uploading_fomu(bitstream_file);
	}
	return;
}

/**
 * uploading_fomu (bitstream_file)
 * 
 * Called from upload_bitstream, uploads dfu to fomu
 * @param {string} bitstream_file path to bitstream file
 */
function uploading_fomu (bitstream_file) {
	fs.copyFile(bitstream_file, path.join(require('path').dirname(bitstream_file), 'top.dfu'), () => {});
	terminal.send("dfu-suffix -v 1209 -p 70b1 -a " + path.join(require('path').dirname(bitstream_file), 'bin','top.dfu'));
	terminal.send("dfu-util -D " + path.join(require('path').dirname(bitstream_file), 'top.dfu'));
	return;
}


module.exports = { upload_bitstream };