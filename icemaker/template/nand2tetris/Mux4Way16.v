module Mux4Way16 (
	input [15:0] a,
	input [15:0] b,
	input [15:0] c,
	input [15:0] d,
	input [1:0] sel,
	output [15:0] out
);

wire [15:0] ab_out, cd_out;

// Mux16 for selecting between a and b
Mux16 mux_ab (
    .a(a),
    .b(b),
    .sel(sel[1]),
    .out(ab_out)
);

// Mux16 for selecting between c and d
Mux16 mux_cd (
    .a(c),
    .b(d),
    .sel(sel[1]),
    .out(cd_out)
);

// Final Mux16 for selecting between ab_out and cd_out
Mux16 final_mux (
    .a(ab_out),
    .b(cd_out),
    .sel(sel[0]),
    .out(out)
);

endmodule
