/** 
 * Copyright (c) 2024 Conor Mika
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

const nand2tetris = require(path.join(__dirname, "nand2tetris.js"));

/**
 * create_new()
 * Entry point to create new project. Creates dialog to select project folder, then calls project_config()
 */
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
			project_config(icemaker_folder);
		}
	});
	return;
}

/**
 * async project_config(icemaker_folder)
 * 
 * Go through the project creation dialog, then call create_icemaker() and pass config values. Called from create_new().
 * 
 * @param {string} icemaker_folder - path to the folder where the icemaker file will be created
 */
async function project_config(icemaker_folder) {
	console.log(icemaker_folder);

	const get_board_options = ['fomu-hacker', 'fomu-pvt', 'fomu-evt1', 'fomu-evt2', 'fomu-evt3', 'baseboard-1k', 'custom-sg48', 'custom-uwg30'];
	var get_board_rev_qp_ret = await vscode.window.showQuickPick(get_board_options);

	const get_template = ['Blank', 'Template', 'Nand2Tetris'];
	var get_template_qp_ret = await vscode.window.showQuickPick(get_template);

	var project_name = await vscode.window.showInputBox(); // TODO: add prompt

	await create_icemaker(icemaker_folder, get_board_rev_qp_ret, get_template_qp_ret, project_name);
	return;
}

/**
 * create_icemaker(icemaker_folder_path, board_rev_quick_pick_selection)
 * 
 * Creates a file [project-name, "default:top"].icemaker that contains "BOARD_REV=[board_rev_qp];", Creates bin
 * directory, creates PCF directory and copies require PCF files
 * 
 * @param {string} icemaker_folder - path to the folder where the icemaker file will be created
 * @param {string} qp_ret - quick pick selection for Fomu revision
 * @param {string} get_template_qp_ret - quick pick selection for template
 * @param {string} project_name - name of the project
 */
function create_icemaker(icemaker_folder, qp_ret, get_template_qp_ret, project_name) {
	// Create .icemaker project file
	var icemaker_file_name = 'project.icemaker';
	var top_file_name = project_name + ".v";
	var icemaker_file_contents = 'BOARD_REV=' + qp_ret + ';\nTOP_MODULE_NAME=' + project_name + ';\nTOP_FILE_NAME=' + top_file_name + ';';
  
	fs.writeFile(path.join(icemaker_folder, icemaker_file_name), icemaker_file_contents, function (err) {
		if (err) {
			vscode.window.showErrorMessage("0x4 (FS): .icemaker file could not be generated. Check if visual studio code has access to reading, writing, and appending files in this directory");
			return;
		}
	});

	// Create bin and pcf directories
	try {
		if (!fs.existsSync(path.join(icemaker_folder, 'bin'))) {
			fs.mkdirSync(path.join(icemaker_folder, 'bin'));
		}
		if (!fs.existsSync(path.join(icemaker_folder, 'pcf'))) {
			fs.mkdirSync(path.join(icemaker_folder, 'pcf'));
		}
	} catch (err) {
		vscode.window.showErrorMessage("0x5 (FS): bin and pcf directories could not be generated. Check if visual studio code has access to reading, writing, and appending files in this directory");
		return;
	}
	if (!copy_pcf(icemaker_folder)) {
		vscode.window.showErrorMessage("0x6 (FS): pcf files could not be copied. Check if visual studio code has access to reading, writing, and appending files in this directory");
		return;
	}

	// Copy template verilog file (default to template.v)
	var top_file_type = "custom";
	if (qp_ret.slice(0, 4) == "fomu") {
		top_file_type = "fomu";
	} else if (qp_ret.slice(0, 9) == "baseboard") {
		top_file_type = "baseboard";
	}
	
	var top_file_template = "template.v";
	if (get_template_qp_ret == 'Blank') {
		top_file_template = "blank.v";
	} else if (get_template_qp_ret == 'Template') {
		top_file_template = "template.v";
	} else if (get_template_qp_ret == 'Nand2Tetris') {
		top_file_template = "nand2tetris.v";
	}
	
	// Copy contents of top file template being used into variable top_template_data
	fs.readFile(path.join(require('path').dirname(__dirname), "template", "top", top_file_type, top_file_template), 'utf8', (err, top_template_data) => {
		if (err) { 
			vscode.window.showErrorMessage("0x7 (FS): top file template could not be read. Check if visual studio code has access to reading files in the extension directory");
			return;
		} else {
			// Copy contents of header template into header_data
			fs.readFile(path.join(require('path').dirname(__dirname), "template", "top", top_file_type, "header.v"), 'utf8', (err, header_data) => {
				if (err) { 
					vscode.window.showErrorMessage("0x8 (FS): header file template could not be read. Check if visual studio code has access to reading files in the extension directory");
					return;
				} else {
					// Replace the top module placeholder in header_data with the real top module name
					header_data = header_data.replace("REPLACE", project_name);
					// Write the contents of header_data followed by top_template_data to a new verilog file in the project folder named [topmodule].v
					fs.writeFile(path.join(icemaker_folder, top_file_name), header_data + top_template_data, function (err) {
						if (err) { 
							vscode.window.showErrorMessage("0x9 (FS): top file could not be generated. Check if visual studio code has access to reading, writing, and appending files in this directory");
							return;
						}
					});
				}
			});
		}
	});

	// if the nand2tetris templace is selected, now copy over resource files (does it now to assist in process of top module creation)
	if (top_file_template == "nand2tetris.v") {
		if (!nand2tetris.copy_template(icemaker_folder)) {
			vscode.window.showErrorMessage("0xA (FS): nand2tetris template files could not be copied. Check if visual studio code has access to reading, writing, and appending files in this directory");
			return;
		}
	}

	return;
}

/**
 * copy_pcf - copies all .pcf files from [extension]/template/pcf to icemaker_folder/pcf
 * @param {string} icemaker_folder directory of icemaker project
 * @returns {boolean} true if successful, false if not
 */
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
 * findIcemaker(startPath)
 * 
 * EX: findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName))
 * 
 * @param {string} startPath directory to start searching for icemaker file
 * @returns {string} path to icemaker file
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
	return findIcemaker(startPath.slice(0, -1 * startPath.split("\\")[startPath.split("\\").length - 1].length)); // TODO: linux combatibility
};

/**
 * get_top_file_name(data)
 * 
 * Finds top file name from .icemaker file contents
 * 
 * @param {string} data .icemaker file data
 * @returns {string} top file name
 */
function get_top_file_name(data) {
	var top_file_name;
	var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].slice(0, 14) == "TOP_FILE_NAME=") {
			top_file_name = lines[i].split('=')[1].split(';')[0];
		}
	}
	return top_file_name;
}

/**
 * get_top_name(data)
 * 
 * Finds top module name from .icemaker file contents
 * 
 * @param {string} data .icemaker file data
 * @returns {string} top module name
 */
function get_top_name(data) {
	var top_name;
	var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].slice(0, 16) == "TOP_MODULE_NAME=") {
			top_name = lines[i].split('=')[1].split(';')[0];
		}
	}
	return top_name;
}

module.exports = { create_new, findIcemaker, get_top_name, get_top_file_name };