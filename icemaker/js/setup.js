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

/**
 * run() - create webview with getting started walkthrough
 */
function run() {
    const panel = vscode.window.createWebviewPanel(
        'gettingStarted',
        'Getting Started',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = get_html();
    return;
}

/**
 * get_html() - get html for webview
 * @returns WebView HTML
 */
function get_html() {
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
		<h1>Getting Started with <a href="https://github.com/conorm110/icemaker">IceMaker</a></h1>
		<p>To open again, run <span class="code">IceMaker: Run Setup Wizard</span> in command palette
		<hr>
		<h2 style="padding-bottom: 0px;margin-bottom: 0px;">Installing Toolchain</h2>
		<p style="padding-bottom: 0px;margin-bottom: 0px;padding-top: 0px;margin-top: 0px;"><small>NOTE: FOMU Toolchain contains IceStorm which is necessary for all boards; toolchain installation instructions from <a href="https://github.com/im-tomu/fomu-toolchain#readme">im-tomu/fomu-toolchain/readme.md</a></small></p>
		<p>
			Download the <a href="https://github.com/im-tomu/fomu-toolchain/releases/latest">latest release of the FOMU toolchain</a> for your platform and extract it somewhere on your disk. Then set your PATH:
		</p>
		<ul>
			<li>Shell (GNU/Linux, Cygwin/MSYS2/MINGW, MacOS...): <span class="code"> export PATH=[path-to-bin]:$PATH</span>
            <ul><li><small>Note for MacOS: When running any command it will appear as an untrusted program, you have to hit cancel in the pop up and then in system preferences -> security -> general you need to approve every program then run the command again and hit open. This only needs to be done once.</small></li></ul>
            </li>
			<li style="padding-top:2px;padding-bottom:2px;">Powershell (Windows): <span class="code"> $ENV:PATH = "[path-to-bin];" + $ENV:PATH</span></li>
			<li>cmd.exe (Windows): <span class="code"> PATH=[path-to-bin];%PATH%</span></li>
		</ul>
		 
		<p>To confirm installation, run a command such as <span class="code"> nextpnr-ice40</span> or <span class="code"> yosys</span>. Then, reload VS Code.</p>
		<h2 style="padding-bottom: 7px;margin-bottom: 0px;">Creating a New Project</h2>
        <ol>
        <li>Open the command palette by running <span class="code">IceMaker: Create New Project Template</span> and selecting an empty folder</li>
        <li>Select your development board version (if using custom board select the footprint of your FPGA, either Custom-UWG30 or Custom-SG48)</li>
        <li>Select your project template; read <a href="https://github.com/conorm110/icemaker">here</a> for more information on templates</li>
        <li>Enter the name for your top level Verilog file (also your project name)</li>
        <li>Edit the generated Verilog code, and, if using custom board, configure the pin assignments (read Editing Pin Assignments section below for more information)</li>
        <li>Build your code by running <span class="code">IceMaker: Synthesize, PNR, and Generate Bitstream</span> in the command palette</li>
        <li>Uploading Code
        <ul>
        <li>If using a FOMU, continue to the section below on Configuring FOMU for USB Uploading</li>
        <li>If not using a FOMU, you can upload the binary file in the bin folder to your development board's configuration PROM</li>
        </ul>
        </ol>
        <h2 style="padding-bottom: 7px;margin-bottom: 0px;">Editing Pin Assignments</h2>
        <p>Custom and generic iCE40 Ultra development boards are supported through the custom-sg48 and custom-uwg30 board types. The board type is selected during project generation and can be changed later in the project.icemaker file. The footprint of the FPGA on your custom/generic development board must match the selected board type. </p>

<p>The I/O defined in the top level Verilog file must be set in the .pcf file corresponding to your custom board's board type. The .pcf files are located in the pcf folder generated in icemaker projects. Each I/O pin must be defined as <span class="code">set_io [pin name] [pin code]</span>. For example, <span class="code">set_io rgb0 39</span> or <span class="code">set_io rgb0 A5</span></p>
		<p><a href="https://github.com/im-tomu/fomu-hardware/blob/master/archive/evt/reference/FPGA-iCE40UP%205k%20Pinout.xlsx">This spreadsheet</a> has pin names and pin assignments for both iCE40 Ultra footprints</p>

<h2 style="padding-bottom: 7px;margin-bottom: 0px;">Configuring FOMU for USB Uploading</h2>
        <p style="padding-bottom: 0px;margin-bottom: 0px;padding-top: 0px;margin-top: 0px;"><small>NOTE: Not necessary if not using FOMU</small></p>
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
			<li>Open your IceMaker project</span></li>
			<li>Generate bitstream for FOMU in Command Palette by running <span class="code">IceMaker: Synthesize, PNR, and Generate Bitstream</span></li>
			<li>Upload to the FOMU in Command Palette by running <span class="code">IceMaker: Upload Project to FOMU</span></li>
		</ol>
		
	</body>
</html>`;
}

module.exports = { run };