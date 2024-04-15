module DMux4Way (
	input in,
	input [1:0] sel,
	output [3:0] out
);

wire a, b, c, d;

DMux _dmux1 (
    .in(in),
    .sel(sel[1]),
    .a(a),
    .b(b)
);

DMux _dmux2a (
    .in(a),
    .sel(sel[0]),
    .a(out[0]),
    .b(out[1])
);

DMux _dmux2b (
    .in(b),
    .sel(sel[0]),
    .a(out[2]),
    .b(out[3])
);

endmodule
