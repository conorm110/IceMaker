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
		<p> WARNING FOR MAC USERS: When running any command it will appear as an untrusted program, you have to hit cancel and in system preferences -> secutiry -> general you need to approve every program then run the command again and hit open. It only makes you do this once per program but its a pain</p>
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

module.exports = { run };