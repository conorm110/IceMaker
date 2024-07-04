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

 const vscode = require('vscode');
 var path = require("path");
 const fs = require('fs');
 const projects = require(path.join(__dirname, "projects.js"));
 const fomu = require(path.join(__dirname, "fomu.js"));

/**
 * bitstream()
 * 
 * Entry point for uploading bitstream to FPGA
 */
function bitstream() {
    var icemaker_file;
	var active_text_editor = false;
	try {
		// Try finding the active file to search its directory for icemaker
		vscode.window.activeTextEditor.document.fileName;
	} catch(err) {
		// Throws err if no file active, open file selector menu
		active_text_editor = true;
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
			   // send icemaker file chosen from file explorer menu to parse_icemaker()
			   parse_icemaker(icemaker_file);
		   }
	   });
	}
	if (!active_text_editor) {
		// if a file was found open, send the directory of it to projects.findIcemaker and save the returned path as icemaker_file
		// then generate actions using this file in parse_icemaker()
		icemaker_file = projects.findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName));
		parse_icemaker(icemaker_file);
	}
}

/**
 * check_board_type(board_type, icemaker_lines)
 * 
 * EXAMPLE:
 *  PEAR_REV=13.0; -> 
 *  The board type is PEAR -> 
 *  check_board_type("PEAR", lines) will return true but check_board_type("APPLE", lines) will return false
 * 
 * @param {string} board_type Board type (ex: FOMU)
 * @param {string[]} icemaker_lines .icemaker file split into lines
 * @returns {boolean} True if board_type matches the board type in the icemaker file
 */
function check_board_type(board_type, icemaker_lines) {
    for (var i = 0; i < icemaker_lines.length; i++) {
        var fields = icemaker_lines[i].split("=");
        if (fields[0].includes(board_type)) {
            return true;
        }
    }
    return false;
}

/**
 * parse_icemaker(icemaker_file)
 * 
 * Selects which method to upload board based on the board type in the icemaker file
 * 
 * @param {string} icemaker_file 
 */
function parse_icemaker(icemaker_file) {
    fs.readFile(icemaker_file, 'utf8', function(err, data) {
        if (err) {
            vscode.window.showErrorMessage("0x2 (FS): Error reading .icemaker file. Make sure the file exists and is in the same directory as your top module.");
            return;
        }
        var lines = data.split("\n");


        if (check_board_type("FOMU", lines)) {
            fomu.upload_bitstream(icemaker_file);
        } 
        // EXAMPLE TO ADD MORE BOARDS
        // else if (check_board_type("PEAR", lines)) {
        //     pear.upload_bitstream(icemaker_file);
        // }
        else {
            vscode.window.showErrorMessage("0x3 (BOARD): Unsupported board error. If your board is supported, make sure it is set in the icemaker file. EX: If you are using a FOMU, make sure the .icemaker file contains FOMU_REV=[pvt, hacker, etc]; and that it is spelled correctly.");
            return;
        }
    });
}


module.exports = { bitstream };