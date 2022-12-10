module FullAdder (
    input a,
    input b,
    input c,
    output sum,
    output carry
);

wire absum, abcarry;
HalfAdder HalfAdder_INST_A (
    .a(a),
    .b(b),
    .sum(absum),
    .carry(abcarry)
);

wire abccarry;
HalfAdder HalfAdder_INST_B (
    .a(absum),
    .b(c),
    .sum(sum),
    .carry(abccarry)
);

assign carry = abcarry | abccarry;

endmodule