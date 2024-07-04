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
 * Using config set in .icemaker file find the correct pnr flags
 * 
 * @param {string} data icemaker file contents
 * @returns {string} pnr flags
 */
function type(data) {
    var board_rev;
    var lines = data.split('\n');
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].slice(0, 10) == "BOARD_REV=") {
				board_rev = lines[i].split('=')[1].split(';')[0];
				var type = "bin";
				var pvt_err = false;
				var pcf_path = "pcf";
				if (board_rev == "fomu-evt1") {
					type = "bit";
				} else if (board_rev == "fomu-evt2") {
					type = "bit";
				} else if (board_rev == "fomu-evt3") {
					type = "bit";
				} else if (board_rev == "fomu-hacker") {
					type = "bit";
				} else if (board_rev == "fomu-pvt") {
					type = "bit";
				}
                return type;
			}
		}
}
 module.exports = { type };