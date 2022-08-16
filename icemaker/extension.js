// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { exec } = require('child_process');
const { copyFile } = require('fs');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('icemaker.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from IceMaker!');
	});

	disposable = vscode.commands.registerCommand('icemaker.newProject', function () {
		var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");

		// create pcf folder
		term.sendText("mkdir pcf");
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\pcf\\fomu-evt2.pcf pcf\\fomu-evt2.pcf");
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\pcf\\fomu-evt3.pcf pcf\\fomu-evt3.pcf");
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\pcf\\fomu-hacker.pcf pcf\\fomu-hacker.pcf");
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\pcf\\fomu-pvt.pcf pcf\\fomu-pvt.pcf");
		// copy makefile
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\Makefile Makefile");

		term.sendText("mkdir bin");
		term.sendText("echo f|xcopy /c /y /i " + __dirname +"\\template.v top.v");

		//vscode.window.showInformationMessage();
	});

	

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
