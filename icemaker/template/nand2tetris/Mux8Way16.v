module Mux8Way16 (
	input [15:0] a,
	input [15:0] b,
	input [15:0] c,
	input [15:0] d,
	input [15:0] e,
	input [15:0] f,
	input [15:0] g,
	input [15:0] h,
	input [2:0] sel,
	output [15:0] out
);

wire [15:0] ab_out, cd_out, ef_out, gh_out;

// Mux4Way16 for selecting between a, b, c, and d
Mux4Way16 mux_abcd (
    .a(a),
    .b(b),
    .c(c),
    .d(d),
    .sel(sel[2:1]),
    .out(ab_out)
);

// Mux4Way16 for selecting between e, f, g, and h
Mux4Way16 mux_efgh (
    .a(e),
    .b(f),
    .c(g),
    .d(h),
    .sel(sel[2:1]),
    .out(ef_out)
);

// Final Mux4Way16 for selecting between ab_out and cd_out
Mux4Way16 final_mux (
    .a(ab_out),
    .b(cd_out),
    .c(ef_out),
    .d(gh_out),
    .sel(sel[0]),
    .out(out)
);


endmodule
