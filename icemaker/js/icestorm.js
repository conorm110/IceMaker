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

var path = require("path");
const vscode = require('vscode');
const fs = require('fs');

const terminal = require(path.join(__dirname, "terminal.js"));
const yosys = require(path.join(__dirname, "yosys.js"));
const pnr = require(path.join(__dirname, "pnr.js"));
const projects = require(path.join(__dirname, "projects.js"));
const icepack = require(path.join(__dirname, "icepack.js"));

const yosys_timeout_ms = 200 * 1000;
const pnr_timeout_ms = 200 * 1000;
const icepack_timeout_ms = 200 * 1000;

/**
 * generate_output()
 * 
 * Entry point for icestorm toolchain output file generation. Calls generate_actions() with the icemaker file to use for config data
 * 
 * @returns {void}
 */
function generate_output() {
	var icemaker_file = "empty";
	var isErr = false;
	try {
		// Try finding the active file to search its directory for icemaker
		vscode.window.activeTextEditor.document.fileName;
	} catch (err) {
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

// TODO: move flag generation to generate output, segment generate_actions better and rename

/**
 * generate_actions(icemaker_file)
 * 
 * Generate YOSYS and PNR flags, run yosys and call run_nextpnr() if yosys successful, exit if not. 
 * Also passes through current project directory and pnr flags to run_nextpnr
 * 
 * @param {string} icemaker_file path to icemaker file
 */
function generate_actions(icemaker_file) {
	// read provided icemaker file
	fs.readFile(icemaker_file, 'utf8', (err, data) => {
		if (err) {
			vscode.window.showErrorMessage("0xB (FS): .icemaker file could not be read. Check that your .icemaker file exists in your project directory.")
			return;
		}

		var top_file_name = projects.get_top_file_name(data);
		var top_name = projects.get_top_name(data);
		var project_dir = require('path').dirname(icemaker_file);

		var pnr_flags = pnr.flags(data);
		var yosys_flags = yosys.flags(data);
		if (yosys_flags == "err") {
			vscode.window.showErrorMessage("0x0 (YOSYS_FLAGS): Error in YOSYS flag generation, check the FOMU_REV in your .icemaker file");
			return;
		}
		if (pnr_flags == "err") {
			vscode.window.showErrorMessage("0x1 (PNR_FLAGS): Error in PNR flag generation, check the FOMU_REV in your .icemaker file");
			return;
		}

		// Delete existing contents of bin/
		fs.readdir(path.join(project_dir, 'bin'), (err, files) => {
			if (err) {
				vscode.window.showErrorMessage("0xC (FS): " + path.join(project_dir, 'bin') + " 's contents could not be read. Check that VS Code has access to read files in this directory.");
				return;
			}

			// Iterate over the files and delete each one
			for (const file of files) {
				fs.unlink(`${path.join(project_dir, 'bin')}/${file}`, err => {
					if (err) {
						vscode.window.showErrorMessage("0xD (FS): " + path.join(project_dir, 'bin') + " 's contents could not be deleted. Check that VS Code has access to delete files in this directory.");
						return;
					}
				});
			}
		});

		terminal.send("yosys " + yosys.flags(data) + " -p \"read_verilog " + top_file_name + "; hierarchy -top " + top_name + " -libdir .; synth_ice40 -top " + top_name + " -json bin/top.json\"");

		run_nextpnr(project_dir, pnr_flags, 0);
	});
}
/**
 * run_nextpnr(project_dir, pnr_flags)
 * 
 * Execute PNR step of icestorm toolchain. Calls run_icepack and passes project_dir
 * 
 * @param {string} project_dir 
 * @param {string} pnr_flags 
 * @param {*} yosys_ms Time since called + previous run times in ms (for timeout)
 */
function run_nextpnr(project_dir, pnr_flags, yosys_ms) {
	const hrstart = process.hrtime();
	fs.access(path.join(project_dir, 'bin', 'top.json'), fs.constants.R_OK, (err) => {
		if (err) {
			const hrend = process.hrtime(hrstart);
			var c_time = yosys_ms + (hrend[1] / 1000000);
			if (c_time > yosys_timeout_ms) {
				vscode.window.setStatusBarMessage(`YOSYS generation timed out (>${yosys_timeout_ms}ms). Check terminal for YOSYS err.`);
				return;
			}
			run_nextpnr(project_dir, pnr_flags, c_time); // TODO: timeout
		}
		else {
			terminal.send("nextpnr-ice40 " + pnr_flags + " --json bin/top.json --asc bin/top.asc");
			run_icepack(project_dir)
		}
	});
}

/**
 * run_icepack(project_dir)
 * 
 * Execute icepack step of icestorm toolchain. Calls finish_generation()
 * 
 * @param {string} project_dir
 * @param {*} pnr_ms Time since called + previous run times in ms (for timeout) 
 */
function run_icepack(project_dir, pnr_ms) {
	const hrstart = process.hrtime();
	fs.access(path.join(project_dir, 'bin', 'top.json'), fs.constants.R_OK, (err) => {
		if (err) {
			const hrend = process.hrtime(hrstart);
			var c_time = pnr_ms + (hrend[1] / 1000000);
			if (c_time > pnr_timeout_ms) {
				vscode.window.setStatusBarMessage(`YOSYS generation timed out (>${yosys_timeout_ms}ms). Check terminal for YOSYS err.`);
				return;
			}
			run_icepack(project_dir, c_time); // TODO: timeout
		}
		else {
			fs.readFile(projects.findIcemaker(project_dir), 'utf8', (err, data) => {
				if (err) {
					vscode.window.showErrorMessage("0xB (FS): .icemaker file could not be read. Check that your .icemaker file exists in your project directory.")
					return;
				}
			var icepackCMD = "icepack bin/top.asc bin/top." + icepack.type(data);
			terminal.send(icepackCMD);
			finish_generation(project_dir);
			});
		}
	});
}

/**
 * finish_generation(project_dir, icepack_ms)
 * 
 * @param {string} project_dir 
 * @param {*} icepack_ms Time since called + previous run times in ms (for timeout)
 */
function finish_generation(project_dir, icepack_ms) {
	const hrstart = process.hrtime();
	fs.access(path.join(project_dir, 'bin', 'top.bit'), fs.constants.R_OK, (err) => {
		if (err) {
			const hrend = process.hrtime(hrstart);
			var c_time = icepack_ms + (hrend[1] / 1000000);
			if (c_time > icepack_timeout_ms) {
				vscode.window.setStatusBarMessage(`YOSYS generation timed out (>${yosys_timeout_ms}ms). Check terminal for YOSYS err.`);
				return;
			}
			finish_generation(project_dir, c_time); // TODO: timeout
		}
		else {
			vscode.window.showInformationMessage("Bitstream Generation Successful!");
		}
	});
}

module.exports = { generate_output };