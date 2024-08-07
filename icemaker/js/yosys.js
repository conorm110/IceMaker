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

/**
 * flags(data)
 * 
 * Generates the Yosys flags for the board revision
 * 
 * @param {string} data .icemaker file contents
 * @returns {string} flags
 */
function flags(data) {
    var board_rev;
    var lines = data.split('\n');
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].slice(0, 10) == "BOARD_REV=") {
				board_rev = lines[i].split('=')[1].split(';')[0];
				var yosys_flags;
				var pvt_err = false;
				if (board_rev == "fomu-evt1") {
					yosys_flags = "-D EVT=1 -D EVT1=1 -D HAVE_PMOD=1";
				} else if (board_rev == "fomu-evt2") {
					yosys_flags = "-D EVT=1 -D EVT2=1 -D HAVE_PMOD=1";
				} else if (board_rev == "fomu-evt3") {
					yosys_flags = "-D EVT=1 -D EVT3=1 -D HAVE_PMOD=1";
				} else if (board_rev == "fomu-hacker") {
					yosys_flags = "-D HACKER=1";
				} else if (board_rev == "fomu-pvt") {
					yosys_flags = "-D PVT=1";
				} else if (board_rev == "baseboard-1k") {
					yosys_flags = "-D PVT=1";
				} else if (board_rev == "custom-sg48") {
					yosys_flags = "-D PVT=1";
				} else if (board_rev == "custom-uwg30") {
					yosys_flags = "-D PVT=1";
				} else {
					pvt_err = true;
				}
				if (!pvt_err) {
					return yosys_flags;
				} else {
					return "err";
				}
			}
		}
}
 module.exports = { flags };