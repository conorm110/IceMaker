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
	execute_term_cmd(path);
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	if (process.platform == "win32") {
		term_path = "cmd";
	} else {
		term_path = "/bin/bash";
	}
	term = vscode.window.createTerminal("IceMaker Terminal", term_path)
	term.show(); // display terminal on startup

	fs.readFile(path.join(__dirname, 'config.txt'), 'utf8', (err, data) => {
		if (err) {
		  return;
		}
		console.log(data.split('=')[1].split(';')[0]);
		if (data.split('=')[1].split(';')[0] == "true") {
			setup_wizard();
			fs.writeFile(path.join(__dirname, 'config.txt'), 'init=false;', function (err,data) {
				if (err) {
					return console.log(err);
				} });
		}
	  });
	

	

	let disposable = vscode.commands.registerCommand('icemaker.newProject', function () { setup_new_project(); });
	disposable = vscode.commands.registerCommand('icemaker.uploadToFomu', function () { upload_to_fomu(); });
	disposable = vscode.commands.registerCommand('icemaker.generateOutput', function () { generate_output(); });
	disposable = vscode.commands.registerCommand('icemaker.setupWizard', function () { setup_wizard(); });

	context.subscriptions.push(disposable);
}

function setup_wizard() {
	const panel = vscode.window.createWebviewPanel(
        'gettingStarted',
        'Getting Started',
        vscode.ViewColumn.One,
        {}
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent();
    
	return;
}

function getWebviewContent() {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Getting Started</title>
		<style>
		.code {
			background-color:#626262;
			border-radius:10px;
			padding-left:5px;
			padding-right:5px;
			font-weight:100;
			margin:0px;
			padding-top:0px;
			padding-bottom:0px;
		}
		.codeblock {
			background-color:#626262;
			padding-left:5px;
			padding-right:5px;
			font-weight:100;
			margin:0px;
			padding-top:0px;
			padding-bottom:0px;
			width:40%;
		}
		body {
			font-size: 14px;
		}
		</style>
	</head>
	<body>
		<h1>Getting Started with IceMaker</h1>
		<p>To open again, run <span class="code">IceMaker: Run Setup Wizard</span> in command palette
		<hr>
		<h2 style="padding-bottom: 0px;margin-bottom: 0px;">Installing FOMU Toolchain</h2>
		<p style="padding-bottom: 0px;margin-bottom: 0px;padding-top: 0px;margin-top: 0px;"><small>FOMU Toolchain installation instructions from <a href="https://github.com/im-tomu/fomu-toolchain#readme">im-tomu/fomu-toolchain/readme.md</a></small></p>
		<p>
			Download the <a href="https://github.com/im-tomu/fomu-toolchain/releases/latest">latest release</a> for your platform and extract it somewhere on your disk. Then set your PATH:
		</p>
		<ul>
			<li>Shell (GNU/Linux, Cygwin/MSYS2/MINGW, MacOS...): <span class="code"> export PATH=[path-to-bin]:$PATH</span></li>
			<li style="padding-top:2px;padding-bottom:2px;">Powershell (Windows): <span class="code"> $ENV:PATH = "[path-to-bin];" + $ENV:PATH</span></li>
			<li>cmd.exe (Windows): <span class="code"> PATH=[path-to-bin];%PATH%</span></li>
		</ul>
		<p>To confirm installation, run a command such as <span class="code"> nextpnr-ice40</span> or <span class="code"> yosys</span>. Then, reload vs code.</p>
	
		<h2 style="padding-bottom: 7px;margin-bottom: 0px;">Creating Your First Project</h2>
		<ol style="padding-top:0px;margin-top:0px;">
			<li>Setup udev rules for GNU/linux ONLY</li>
			<ul>
				<li>Run <span class="code">dfu-util -l</span>, if you get an error message like "dfu-util: Cannot open DFU device" you will need to setup a udev rule. If not, you can skip ahead.</li>
				<li>Setting up a udev rule: </li>
				<ol>
					<li>Add your user to group plugdev: <p class="codeblock">sudo groupadd plugdev</p><p class="codeblock">sudo usermod -a -G plugdev $USER</p></li>
					<li>Log out then in for addition to plugdev to take affect</li>
					<li>Use id $USER and/or groups to check you are in group plugdev:<p class="codeblock">id $USER</p><p class="codeblock">groups | grep plugdev</p></li>
					<li>Create a file named /etc/udev/rules.d/99-fomu.rules and add the following.<p class="codeblock">SUBSYSTEM=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="5bf0", MODE="0664", GROUP="plugdev"</p></li>
					<li>Reload the udev-rules using the following: <p class="codeblock">sudo udevadm control --reload-rules</p><p class="codeblock">sudo udevadm trigger</p></li>
				</ol>
			</ul>
			<li>Install required drivers for Windows systems earlier than Windows 10</li>
			<ol>
				<li>Download <a href="https://zadig.akeo.ie/">Zadig</a></li>
				<li>Open Zadig</li>
				<li>Under Options, select List All Devices</li>
				<li>In the dropdown, select your Fomu; in the field right of the green arrow, choose the WinUSB driver; and hit Upgrade Driver</li>
			</ol>
			<li>Prepare your hardware</li>
			<ul>
				<li>Check FOMU bootloader version with <span class="code">dfu-util -l</span>. If version is older than v2.0.3, you need to <a href="https://workshop.fomu.im/en/latest/bootloader.html#bootloader-update">update the fomu bootloader</a>.</li>
			</ul>
			<li>Create a new project template in Command Palette by running <span class="code">IceMaker: Create New Project Template</span></li>
			<ul>
				<li>Select the folder to create the new icemaker project</li>
				<li>Select your <a href="https://workshop.fomu.im/en/latest/requirements/hardware.html">board revision</a></li>
			</ul>
			<li>Generate bitstream for FOMU in Command Palette by running <span class="code">IceMaker: Synthesize, PNR, and Generate Bitstream</span></li>
			<ul>
				<li>If you do not have a file in your project directory open, you will be prompted for your .icemaker project file</li>
			</ul>
			<li>Upload to the FOMU in Command Palette by running <span class="code">IceMaker: Upload Project to FOMU</span></li>
			<li>After a few seconds your FOMU should begin blinking RGB!</li>
		</ol>
		<h2 style="padding-bottom: 0px;margin-bottom: 0px;">Creating A Second Project with Multiple Files</h2>
		<ol>
			<li>Create a new project template in Command Palette by running <span class="code">IceMaker: Create New Project Template</span></li>
			<ul>
				<li>Select the folder to create the new icemaker project</li>
				<li>Select your <a href="https://workshop.fomu.im/en/latest/requirements/hardware.html">board revision</a></li>
			</ul>
			<li>Create a new verilog file called <span class="code">slowclk.v</span> in your project directory.</li>
			<li>Paste the following into slowclk.v:</li>
			<p class="code" style="width:40%">
			module slowclk (<br>
			input clk_in,<br>
			output clk_out<br>
			);<br>
			reg [22:0] counter;<br>
			<br>
			always @(posedge clk_in) begin<br>
			counter <= counter + 1;<br>
			end<br>
			<br>
			assign clk_out = counter[19];<br>
			<br>
			endmodule
			</p>
			<p>NOTE: Your module name should always be the name of your verilog file, one module per file</p>
			<li>Back in top.v, replace </li>
			<p class="code" style="width:40%">
			// Divide clock to much slower signal so we can see it<br>
			reg [22:0] counter = 0;<br>
			always @(posedge clk) begin<br>
			counter <= counter + 1;<br>
			end<br>
			wire slow_clk = counter[22];
			</p>
			<p>with this:</p>
			<p class="code" style="width:40%">
			wire slow_clk;<br>
			slowclk slowclk_inst (<br>
			.clk_in(clk),<br>
			.clk_out(slow_clk)<br>
			);
			</p>
			<li>Generate bitstream for FOMU in Command Palette by running <span class="code">IceMaker: Synthesize, PNR, and Generate Bitstream</span></li>
			<ul>
				<li>If you do not have a file in your project directory open, you will be prompted for your .icemaker project file</li>
			</ul>
			<li>Upload to the FOMU in Command Palette by running <span class="code">IceMaker: Upload Project to FOMU</span></li>
			<li>After a few seconds your FOMU should begin blinking RGB faster!</li>
		</ol>
	</body>
</html>`;
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
	// Create .icemaker project file
	var icemaker_file_name = 'top.icemaker';
	var icemaker_file_contents = 'FOMU_REV=' + qp_ret + ';';

	fs.writeFile(path.join(icemaker_folder, icemaker_file_name), icemaker_file_contents, function (err) {
		if (err) {
			return err; // TODO: handle
		}
	});

	// Create bin directory
	if (!fs.existsSync(path.join(icemaker_folder, 'bin'))){
		fs.mkdirSync(path.join(icemaker_folder, 'bin'));
	}

	// Create PCF directory and copy .pcf files over
	if (!fs.existsSync(path.join(icemaker_folder, 'pcf'))){
		fs.mkdirSync(path.join(icemaker_folder, 'pcf'));
	}
	if (!copy_pcf(icemaker_folder)) {
		return "err"; // TODO: Handle
	}

	// Copy template verilog file
	// TODO: Add quick pick selection for template or blank
	fs.copyFile(path.join(__dirname, 'template', 'template.v'), path.join(icemaker_folder, 'top.v'), (err) => {
		if (err) {
			return err; // TODO: handle
		}
	});

	return;
}

function copy_pcf(icemaker_folder) {
	// Check if pcf directory exists
	var startPath = path.join(__dirname, 'template', 'pcf');
	if (!fs.existsSync(startPath)) {
		return false; 
	}

	// Read and go through template/pcf folder in extension data, copy all .pcf files
	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		if (filename.endsWith(".pcf")) {
			fs.copyFile(filename, path.join(icemaker_folder, 'pcf', files[i]), (err) => {
				if (err) {
					return false;
				}
			});
		};
	};
	return true;
}


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
					execute_term_cmd("yosys " + yosys_flags + " -p \"read_verilog top.v; hierarchy -top top -libdir .; synth_ice40 -top top -json bin/top.json\"");
					execute_term_cmd("nextpnr-ice40 " + pnrflags + " --pcf " + pcf + " --json bin/top.json --asc bin/top.asc");
					execute_term_cmd("icepack bin/top.asc bin/top.bit");
				} else {
					vscode.window.showErrorMessage(".icemaker is not found, are you in the project directory?");
				}
			}
		}
	  });
}



function upload_to_fomu() {
	var bitstream_file = "empty";
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
				'Bitstream Files': ['bit'],
				'All files': ['*']
			}
		};
	   vscode.window.showOpenDialog(options).then(fileUri => {
		   if (fileUri && fileUri[0]) {
			   console.log('Selected file: ' + fileUri[0].fsPath);
			   bitstream_file = fileUri[0].fsPath;
			   uploading_fomu(bitstream_file);
		   }
	   });
	}
	if (!isErr) {
		bitstream_file = path.join(require('path').dirname(findIcemaker(require('path').dirname(vscode.window.activeTextEditor.document.fileName))),'bin','top.bit');
		uploading_fomu(bitstream_file);
	}
	return;
}

function uploading_fomu (bitstream_file) {
	fs.copyFile(bitstream_file, path.join(require('path').dirname(bitstream_file), 'top.dfu'), () => {});
	execute_term_cmd("dfu-suffix -v 1209 -p 70b1 -a " + path.join(require('path').dirname(bitstream_file), 'bin','top.dfu'));
	execute_term_cmd("dfu-util -D " + path.join(require('path').dirname(bitstream_file), 'top.dfu'));
	return;
}
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
