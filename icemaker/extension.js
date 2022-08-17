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
	if (process.platform != "win32") // this is a really bad way to check if 
	{
		vscode.window.showErrorMessage("IceMaker: Your system does not meet the OS requirement");
	}
	else {
		let disposable = vscode.commands.registerCommand('icemaker.newProject', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd"); // create new cmd terminal
			term.show();

			// Create PCF folder and copy PCF files over
			term.sendText("mkdir pcf");
			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\pcf\\fomu-evt2.pcf pcf\\fomu-evt2.pcf");
			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\pcf\\fomu-evt3.pcf pcf\\fomu-evt3.pcf");
			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\pcf\\fomu-hacker.pcf pcf\\fomu-hacker.pcf");
			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\pcf\\fomu-pvt.pcf pcf\\fomu-pvt.pcf");

			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\Makefile Makefile"); // copy makefile
			term.sendText("mkdir bin"); // create bin for output files
			term.sendText("echo f|xcopy /c /y /i " + __dirname + "\\template.v top.v"); // copy template for verilog

			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd"); // create new cmd terminal
			term.show();

			term.sendText("dfu-util -D bin/top.dfu"); // send over DFU file

			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.generateOutputevt1', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");
			term.show();
			term.sendText("make FOMU_REV=evt1");
			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.generateOutputevt2', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");
			term.show();
			term.sendText("make FOMU_REV=evt2");
			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.generateOutputevt3', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");
			term.show();
			term.sendText("make FOMU_REV=evt3");
			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.generateOutputpvt', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");
			term.show();
			term.sendText("make FOMU_REV=pvt");
			term.sendText("timeout 5 && exit");
		});

		disposable = vscode.commands.registerCommand('icemaker.generateOutputhacker', function () {
			var term = vscode.window.createTerminal("IceMaker Terminal", "cmd");
			term.show();
			term.sendText("make FOMU_REV=hacker");
			term.sendText("timeout 5 && exit");
		});

		context.subscriptions.push(disposable);
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
