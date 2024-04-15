module FullAdder (
	input a,
	input b, 
	input c,
	output sum,
	output carry
);

wire sumab, carryab;
HalfAdder _HalfAdder_A (
	.a(a),
	.b(b),
	.sum(sumab),
	.carry(carryab)
);

wire carryabc;
HalfAdder _HalfAdder_B (
	.a(sumab),
	.b(c),
	.sum(sum),
	.carry(carryabc)
);

assign carry = carryab | carryabc; // Note: Or module doesn't work because Or is a keyword

endmodule
