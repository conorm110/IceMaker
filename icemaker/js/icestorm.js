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

const terminal = require(path.join(__dirname, "terminal.js"));
const yosys = require(path.join(__dirname, "yosys.js"));
const pnr = require(path.join(__dirname, "pnr.js"));
const projects = require(path.join(__dirname, "projects.js"));




function generate_output() {
	var icemaker_file = "empty";
	var isErr = false;
	try {
		// Try finding the active file to search its directory for icemaker
		vscode.window.activeTextEditor.document.fileName;
	} catch(err) {
		// Throws err if no file active, open file selector menu
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
			   // send icemaker file chosen from file explorer menu to generate_actions()
			   generate_actions(icemaker_file);
		   }
	   });
	}
	if (!isErr) {
		// if a file was found open, send the directory of it to projects.findIcemaker and save the returned path as icemaker_file
		// then generate actions using this file in generate_actions()
		icemaker_file = projects.findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName));
		generate_actions(icemaker_file);
	}
	
}

function generate_actions (icemaker_file) {
	// read provided icemaker file
	fs.readFile(icemaker_file, 'utf8', (err, data) => {
		if (err) { return "err"; } // TODO: Throw error for unknown icemaker file

		var top_file_name = projects.get_top_file_name(data);
		var top_name = projects.get_top_name(data);
		var project_dir = require('path').dirname(icemaker_file);

		var pnr_flags = pnr.flags(data);
		var yosys_flags = yosys.flags(data);
		if (yosys_flags == "err") {
			vscode.window.showErrorMessage("0x0 (YOSYS_FLAGS): Error in YOSYS flag generation, check the FOMU_REV in your .icemaker file");
		} 
		if (pnr_flags == "err") {
			vscode.window.showErrorMessage("0x1 (PNR_FLAGS): Error in PNR flag generation, check the FOMU_REV in your .icemaker file");
		} 

		// Delete existing contents of bin/
		fs.readdir(path.join(project_dir, 'bin'), (err, files) => {
			if (err) {
			  throw err;
			}
		
			// Iterate over the files and delete each one
			for (const file of files) {
			  fs.unlink(`${path.join(project_dir, 'bin')}/${file}`, err => {
				if (err) {
				  throw err;
				}
			  });
			}
		  });



		if (yosys_flags != "err") {
			// no errs in generating flags
			terminal.send("yosys " + yosys.flags(data) + " -p \"read_verilog " + top_file_name + "; hierarchy -top " + top_name + " -libdir .; synth_ice40 -top " + top_name + " -json bin/top.json\"");
		}
		

		if (pnr_flags != "err") {
			run_nextpnr(project_dir, pnr_flags);
		}

	  });
}

function run_nextpnr (project_dir, pnr_flags) {
	fs.access(path.join(project_dir, 'bin', 'top.json'), fs.constants.R_OK, (err) => {
		if (err) {
			run_nextpnr(project_dir, pnr_flags);
		}
		else {
			terminal.send("nextpnr-ice40 " + pnr_flags + " --json bin/top.json --asc bin/top.asc");
			run_icepack(project_dir)
		}
	});
}

function run_icepack (project_dir) {
	fs.access(path.join(project_dir, 'bin', 'top.json'), fs.constants.R_OK, (err) => {
		if (err) {
			run_icepack(project_dir);
		}
		else {
			terminal.send("icepack bin/top.asc bin/top.bit");
		}
	});
}

module.exports = { generate_output };