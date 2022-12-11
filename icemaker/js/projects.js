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

const nand2tetris = require(path.join(__dirname, "nand2tetris.js"));



/**
 * create_new() - entry point to create new project
 * 
 * Creates dialog to select project folder, then calls get_board_rev. 
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
			get_board_rev(icemaker_folder);
		}
	});
	return;
}

/**
 * async get_board_rev(Icemaker_Folder_Path) - called during project creation
 * 
 * Select board revision from a quick pic option, supply this and recieved folder directory
 * to create_icemaker function
 * 
 * TODO: Create intermitent funtion or append to this function before create_icemaker() to recieve the desired project name
 */
async function get_board_rev(icemaker_folder) {
	console.log(icemaker_folder);

	const get_board_options = ['hacker', 'pvt', 'evt1', 'evt2', 'evt3'];
	var get_board_rev_qp_ret = await vscode.window.showQuickPick(get_board_options);

	const get_template = ['Blank', 'Template', 'Nand2Tetris'];
	var get_template_qp_ret = await vscode.window.showQuickPick(get_template);

	var project_name = await vscode.window.showInputBox(); // TODO: add prompt

	await create_icemaker(icemaker_folder, get_board_rev_qp_ret, get_template_qp_ret, project_name);
	return;
}

/**
 * create_icemaker(icemaker_folder_path, fomu_rev_quick_pick_selection) - called during project creation
 * 
 * Creates a file [project-name, "default:top"].icemaker that contains "FOMU_REV=[fomu_rev_qp];", Creates bin
 * directory, creates PCF directory and copies require PCF files
 */
function create_icemaker(icemaker_folder, qp_ret, get_template_qp_ret, project_name) {
	// Create .icemaker project file
	var icemaker_file_name = 'project.icemaker';
	var top_file_name = project_name + ".v";
	var icemaker_file_contents = 'FOMU_REV=' + qp_ret + ';\nTOP_MODULE_NAME=' + project_name + ';\nTOP_FILE_NAME=' + top_file_name + ';';
  
	fs.writeFile(path.join(icemaker_folder, icemaker_file_name), icemaker_file_contents, function (err) {
		if (err) {
			return err; // TODO: handle
		}
	});

	// Create bin directory
	if (!fs.existsSync(path.join(icemaker_folder, 'bin'))) {
		fs.mkdirSync(path.join(icemaker_folder, 'bin'));
	}

	// Create PCF directory and copy .pcf files over
	if (!fs.existsSync(path.join(icemaker_folder, 'pcf'))) {
		fs.mkdirSync(path.join(icemaker_folder, 'pcf'));
	}
	if (!copy_pcf(icemaker_folder)) {
		return "err"; // TODO: Handle
	}

	// Copy template verilog file
	var top_file_template = "template.v";
	if (get_template_qp_ret == 'Blank') {
		top_file_template = "blank.v";
	} else if (get_template_qp_ret == 'Template') {
		top_file_template = "template.v";
	} else if (get_template_qp_ret == 'Nand2Tetris') {
		top_file_template = "nand2tetris.v";
	}
	
	// Copy contents of top file template being used into variable top_template_data
	fs.readFile(path.join(require('path').dirname(__dirname), "template", top_file_template), 'utf8', (err, top_template_data) => {
		if (err) { return "err";} else {
		// Copy contents of header template into header_data
		fs.readFile(path.join(require('path').dirname(__dirname), "template", "header.v"), 'utf8', (err, header_data) => {
			if (err) { return "err";} else {
			// Replace the top module placeholder in header_data with the real top module name
			header_data = header_data.replace("REPLACE", project_name);
			// Write the contents of header_data followed by top_template_data to a new verilog file in the project folder named [topmodule].v
			fs.writeFile(path.join(icemaker_folder, top_file_name), header_data + top_template_data, function (err) {
				if (err) { return err; }});
		}});
	}});

	// if the nand2tetris templace is selected, now copy over resource files (does it now to assist in process of top module creation)
	if (top_file_template == "nand2tetris.v") {
		if (!nand2tetris.copy_template(icemaker_folder)) {
			return "err";
		}
	}

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