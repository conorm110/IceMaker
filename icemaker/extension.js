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

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () {
		var term = vscode.window.createTerminal("IceMaker Terminal", "cmd"); // create new cmd terminal
		term.show();

		if (process.platform == "win32") {
			term.sendText("py " + __dirname + "\\src\\setup_project.py " + __dirname);
		}
		else {
			term.sendText("python " + __dirname + "\\src\\setup_project.py " + __dirname);
		}

		term.sendText("exit");
	});

	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () {
		var term = vscode.window.createTerminal("IceMaker Terminal", "cmd"); // create new cmd terminal
		term.show();

		if (process.platform == "win32") {
			term.sendText("py " + __dirname + "\\src\\upload.py " + __dirname);
		}
		else {
			term.sendText("python " + __dirname + "\\src\\upload.py " + __dirname);
		}

		term.sendText("exit");
	});

	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () {
		var term = vscode.window.createTerminal("IceMaker Terminal", "cmd"); // create new cmd terminal
		term.show();

		if (process.platform == "win32") {
			term.sendText("py " + __dirname + "\\src\\generate_output.py " + __dirname);
		}
		else {
			term.sendText("python " + __dirname + "\\src\\generate_output.py " + __dirname);
		}

		term.sendText("exit");
	});

	context.subscriptions.push(disposable);

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
