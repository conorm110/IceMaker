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

const setup = require(path.join(__dirname, "js", "setup.js"));
const projects = require(path.join(__dirname, "js", "projects.js"));
const terminal = require(path.join(__dirname, "js", "terminal.js"));
const icestorm = require(path.join(__dirname, "js", "icestorm.js"));
const upload = 	require(path.join(__dirname, "js", "upload.js"));

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	terminal.open();
	// TODO: Only run on initial install 
	// setup.run();
	
	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () { projects.create_new(); });
	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () { upload.bitstream() });
	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () { icestorm.generate_output(); });
	disposable = vscode.commands.registerCommand('icemaker.setupWizard', function () { setup.run(); });

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
