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

var path = require("path");

const vscode = require('vscode');
const fs = require('fs');

const setup = require(path.join(__dirname, "js", "setup.js"));
const projects = require(path.join(__dirname, "js", "projects.js"));
const fomu = require(path.join(__dirname, "js", "fomu.js"));
const terminal = require(path.join(__dirname, "js", "terminal.js"));
const yosys = require(path.join(__dirname, "js", "yosys.js"));
const pnr = require(path.join(__dirname, "js", "pnr.js"));

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	terminal.open();
	// TODO: Only run on initial install 
	// setup.run();
	
	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () { projects.create_new(); });
	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () { fomu.upload_bitstream(); });
	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () { generate_output(); });
	disposable = vscode.commands.registerCommand('icemaker.setupWizard', function () { setup.run(); });

	context.subscriptions.push(disposable);
}


function generate_output() {
	var icemaker_file = "empty";
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
				'Project Files': ['icemaker'],
				'All files': ['*']
			}
		};
	   vscode.window.showOpenDialog(options).then(fileUri => {
		   if (fileUri && fileUri[0]) {
			   console.log('Selected file: ' + fileUri[0].fsPath);
			   icemaker_file = fileUri[0].fsPath;
			   generate_actions(icemaker_file);
		   }
	   });
	}
	if (!isErr) {
		icemaker_file = projects.findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName));
		generate_actions(icemaker_file);
	}
	
}

function generate_actions (icemaker_file) {
	fs.readFile(icemaker_file, 'utf8', (err, data) => {
		if (err) {
		  return "err2";
		}

		var top_file_name = projects.get_top_file_name(data);
		var top_name = projects.get_top_name(data);
		terminal.send("yosys " + yosys.flags(data) + " -p \"read_verilog " + top_file_name + "; hierarchy -top " + top_name + " -libdir .; synth_ice40 -top " + top_name + " -json bin/top.json\"");
		terminal.send("nextpnr-ice40 " + pnr.flags(data) + " --json bin/top.json --asc bin/top.asc");
		terminal.send("icepack bin/top.asc bin/top.bit");
	  });
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
