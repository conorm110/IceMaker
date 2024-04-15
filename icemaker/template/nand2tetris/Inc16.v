module Inc16 (
	input [15:0] in,
	output [15:0] out
);

Add16 _Add16 (
	.a(in),
	.b(16'b0000_0000_0000_0001),
	.out(out)
);

endmodule
