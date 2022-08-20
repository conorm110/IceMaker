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

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	if (process.platform == "win32") {
		term_path = "cmd";
	} else  {
		term_path = "sh";
	}
	term = vscode.window.createTerminal("IceMaker Terminal", term_path)
	term.show(); // display terminal on startup

	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () { run_python_script("setup_project.py"); });
	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () { run_python_script("upload.py"); });
	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () { run_python_script("generate_output.py") });
	disposable = vscode.commands.registerCommand('icemaker.setupWizard', function () { run_python_script("config.py") });

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
