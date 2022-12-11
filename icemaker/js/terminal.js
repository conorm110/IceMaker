
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
var term_path;
var term;

/**
 * send(cmd)
 * @param {string} cmd - command to send to terminal
 */
function send(cmd) {
    refresh();
	try {
		term.exitStatus.toString();
	} catch (error) {
		term.sendText(cmd);
		return;
	}
}

/**
 * open() - opens terminal initially
 * 
 * TODO: Add support for other terminals
 */
function open() {
    if (process.platform == "win32") {
		term_path = "cmd";
	} else {
		term_path = "/bin/bash";
	}
	term = vscode.window.createTerminal("IceMaker Terminal", term_path)
	term.show(); // display terminal on startup
    return
}

/**
 * refresh() - reopens terminal if it was closed
 */
function refresh () {
    try {
		term.exitStatus.toString(); // This will error out if the terminal is still active, TODO: find a more stable way of checking if terminal is active
	} catch (error) {
		return;
	}
    open();
}

module.exports = { send, open, refresh };