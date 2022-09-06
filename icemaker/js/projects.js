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

function create_new() {
	const options = {
		canSelectMany: false,
		openLabel: 'Select',
		canSelectFiles: false,
		canSelectFolders: true
	};
   vscode.window.showOpenDialog(options).then(fileUri => {
	   if (fileUri && fileUri[0]) {
		   console.log('Selected folder: ' + fileUri[0].fsPath);
		   var icemaker_folder = fileUri[0].fsPath;
		   get_board_rev(icemaker_folder);
	   }
   });
	return;
}

async function get_board_rev(icemaker_folder) {
	console.log(icemaker_folder);
	const options = ['hacker','pvt','evt1','evt2','evt3'];
	var qp_ret = await vscode.window.showQuickPick(options);
	await create_icemaker(icemaker_folder, qp_ret);
	return;
}

function create_icemaker(icemaker_folder, qp_ret) {
	// Create .icemaker project file
	var icemaker_file_name = 'top.icemaker';
	var icemaker_file_contents = 'FOMU_REV=' + qp_ret + ';';

	fs.writeFile(path.join(icemaker_folder, icemaker_file_name), icemaker_file_contents, function (err) {
		if (err) {
			return err; // TODO: handle
		}
	});

	// Create bin directory
	if (!fs.existsSync(path.join(icemaker_folder, 'bin'))){
		fs.mkdirSync(path.join(icemaker_folder, 'bin'));
	}

	// Create PCF directory and copy .pcf files over
	if (!fs.existsSync(path.join(icemaker_folder, 'pcf'))){
		fs.mkdirSync(path.join(icemaker_folder, 'pcf'));
	}
	if (!copy_pcf(icemaker_folder)) {
		return "err"; // TODO: Handle
	}
	

	// Copy template verilog file
	// TODO: Add quick pick selection for template or blank
	fs.copyFile(path.join(require('path').dirname(__dirname), 'template', 'template.v'), path.join(icemaker_folder, 'top.v'), (err) => {
		if (err) {
			return err; // TODO: handle
		}
	});

	return;
}



function copy_pcf(icemaker_folder) {
	// Check if pcf directory exists
	var startPath = path.join(require('path').dirname(__dirname), 'template', 'pcf');
	if (!fs.existsSync(startPath)) {
		return false; 
	}

	// Read and go through template/pcf folder in extension data, copy all .pcf files
	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		if (filename.endsWith(".pcf")) {
			fs.copyFile(filename, path.join(icemaker_folder, 'pcf', files[i]), (err) => {
				if (err) {
					return false;
				}
			});
		};
	};
	return true;
}

/**
 * findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName)) will give the path of the .icemaker file as a string
 */
 function findIcemaker(startPath) {
	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return;
	}
	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		if (filename.endsWith(".icemaker")) {
			return filename;
		};
	};
	return findIcemaker(startPath.slice(0, -1 * startPath.split("\\")[startPath.split("\\").length - 1].length));
};

module.exports = { create_new, findIcemaker };