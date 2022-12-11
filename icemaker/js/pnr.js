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
 
 function flags(data) {
    var board_rev;
    var lines = data.split('\n');
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].slice(0, 9) == "FOMU_REV=") {
				board_rev = lines[i].split('=')[1].split(';')[0];
				var pnrflags, pcf;
				var pvt_err = false;
				var pcf_path = "pcf";
				if (board_rev == "evt1") {
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt2.pcf";
				} else if (board_rev == "evt2") {
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt2.pcf";
				} else if (board_rev == "evt3") {
					pnrflags = "--up5k --package sg48";
					pcf = pcf_path + "/fomu-evt3.pcf";
				} else if (board_rev == "hacker") {
					pnrflags = "--up5k --package uwg30";
					pcf = pcf_path + "/fomu-hacker.pcf";
				} else if (board_rev == "pvt") {
					pnrflags = "--up5k --package uwg30";
					pcf = pcf_path + "/fomu-pvt.pcf";
				} else {
					pvt_err = true;
					console.log(board_rev);
				}
				if (!pvt_err) {
					return pnrflags + " --pcf " + pcf;
				} else {
					return "err";
				}
			}
		}
}
 module.exports = { flags };