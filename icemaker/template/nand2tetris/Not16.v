module Not16 (
	input [15:0] in,
	output [15:0] out
);

assign out = ~in;

endmodule