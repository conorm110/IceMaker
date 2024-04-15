module DMux (
	input in,
	input sel,
	output a,
	output b
);

assign a = (sel == 1'b0) ? in : 1'b0;
assign b = (sel == 1'b1) ? in : 1'b0;

endmodule
