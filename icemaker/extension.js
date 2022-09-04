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

const { exec } = require('child_process');
const { copyFile } = require('fs');
const vscode = require('vscode');
var path = require("path");
const fs = require('fs');
const { Console } = require('console');
const { stringify } = require('querystring');

var term_path;
var term; // create new terminal on startup

// run any python script in src/ and give the directory of this as an argument
function run_python_script(path) {
	try {
		term.exitStatus.toString(); // This will error out if the terminal is still active, TODO: find a more stable way of checking if terminal is active
	} catch (error) {
		if (process.platform == "win32") { // since windows uses py instead of python we need to check the os to find which command to use
			term.sendText("py " + __dirname + "\\src\\" + path + " " + __dirname);
		}
		else {
			term.sendText("python3 " + __dirname + "/src/" + path + " " + __dirname);
		}
		return;
	}
	// Only reachable if there was no error which means terminal is not active
	term = vscode.window.createTerminal("IceMaker Terminal", term_path); // create new terminal
	term.show(); // show new terminal only if a new one was just created
	run_python_script(path);
}

function execute_term_cmd(cmd) {
	try {
		term.exitStatus.toString(); // This will error out if the terminal is still active, TODO: find a more stable way of checking if terminal is active
	} catch (error) {
		term.sendText(cmd);
		return;
	}
	// Only reachable if there was no error which means terminal is not active
	term = vscode.window.createTerminal("IceMaker Terminal", term_path); // create new terminal
	term.show(); // show new terminal only if a new one was just created
	run_python_script(path);
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	if (process.platform == "win32") {
		term_path = "cmd";
	} else {
		term_path = "sh";
	}
	term = vscode.window.createTerminal("IceMaker Terminal", term_path)
	term.show(); // display terminal on startup

	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () { setup_new_project(); });
	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () { execute_term_cmd("dfu-util -D bin/top.dfu"); });
	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () { generate_output(); });
	disposable = vscode.commands.registerCommand('icemaker.setupWizard', function () { run_python_script("config.py"); });

	context.subscriptions.push(disposable);
}

function setup_new_project() {
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
	fs.writeFile(icemaker_folder + '\\top.icemaker', 'FOMU_REV=' + qp_ret + ';', function (err) {
		if (err) {
			return console.log(err);
		}
	});
	if (!fs.existsSync(icemaker_folder + '\\bin')){
		fs.mkdirSync(icemaker_folder + '\\bin');
	}
	if (!fs.existsSync(icemaker_folder + '\\pcf')){
		fs.mkdirSync(icemaker_folder + '\\pcf');
	}
	copy_pcf(icemaker_folder);
	fs.copyFile(__dirname + '\\template\\template.v', icemaker_folder + '\\top.v', (err) => {
		if (err) throw err;
			
		console.log('File Copy Successfully.');
		});
	return;
}

function copy_pcf(icemaker_folder) {
	var startPath = __dirname + '\\template\\pcf'
	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return;
	}
	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		if (filename.endsWith(".pcf")) {
			fs.copyFile(filename, icemaker_folder + '\\pcf\\' + files[i], (err) => {
			if (err) throw err;
				
			console.log('File Copy Successfully.');
			});
		};
	};
};


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
		icemaker_file = findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName));
		generate_actions(icemaker_file);
	}
	
}

function generate_actions (icemaker_file) {
	var board_rev;
	fs.readFile(icemaker_file, 'utf8', (err, data) => {
		if (err) {
		  return "err2";
		}
		var lines = data.split('\n');
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].slice(0, 9) == "FOMU_REV=") {
				board_rev = lines[i].split('=')[1].split(';')[0];
				var yosys_flags, pnrflags, pcf;
				var pvt_err = false;
				var pcf_path = "pcf";
				if (board_rev == "evt1") {
					yosys_flags = "-D EVT=1 -D EVT1=1 -D HAVE_PMOD=1";
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt2.pcf";
				} else if (board_rev == "evt2") {
					yosys_flags = "-D EVT=1 -D EVT2=1 -D HAVE_PMOD=1";
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt2.pcf";
				} else if (board_rev == "evt3") {
					yosys_flags = "-D EVT=1 -D EVT3=1 -D HAVE_PMOD=1";
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt3.pcf";
				} else if (board_rev == "hacker") {
					yosys_flags = "-D HACKER=1";
					pnrflags = "--up5k --package uwg30";
					pcf = pcf_path + "/fomu-hacker.pcf";
				} else if (board_rev == "pvt") {
					yosys_flags = "-D PVT=1";
					pnrflags = "--up5k --package uwg30";
					pcf = pcf_path + "/fomu-pvt.pcf";
				} else {
					pvt_err = true;
					console.log(board_rev);
				}
				if (!pvt_err) {
					execute_term_cmd("yosys " + yosys_flags + " -p \"read_verilog top.v; hierarchy -top top -libdir .; synth_ice40 -top top -json bin/top.json\" 2>&1 | tee bin/yosys-report.txt");
					execute_term_cmd("nextpnr-ice40 " + pnrflags + " --pcf " + pcf + " --json bin/top.json --asc bin/top.asc");
					execute_term_cmd("icepack bin/top.asc bin/top.bit");
					execute_term_cmd("cp -a bin/top.bit bin/top.dfu");
					execute_term_cmd("dfu-suffix -v 1209 -p 70b1 -a bin/top.dfu");
				} else {
					vscode.window.showErrorMessage(".icemaker is not found, are you in the project directory?");
				}
			}
		}
	  });
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
