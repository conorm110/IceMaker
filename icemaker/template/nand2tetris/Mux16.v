module Mux16 (
	input [15:0] a,
	input [15:0] b,
	input sel,
	output [15:0] out
);

assign out = (sel == 1'b0) ? a : b;

endmodule
