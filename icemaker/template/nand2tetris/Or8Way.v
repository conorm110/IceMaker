module Or8Way (
	input [7:0] in,
	output out
);

assign out = |in;

endmodule
