module DMux8Way (
	input in,
	input [3:0] sel,
	output [15:0] out
);

wire [1:0] sel_next;

// Intermediate select signals
assign sel_next = sel[2:1];

// First stage of demultiplexing
DMux4Way dmux1 (
    .in(in),
    .sel(sel[3]),
    .out({out[7], out[6], out[5], out[4]})
);

DMux4Way dmux2 (
    .in(out[7]),
    .sel(sel_next),
    .out({out[15], out[14], out[13], out[12]})
);

DMux4Way dmux3 (
    .in(out[6]),
    .sel(sel_next),
    .out({out[11], out[10], out[9], out[8]})
);


endmodule
