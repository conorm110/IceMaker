module Inc16 (
    input [15:0] in,
    output [15:0] out
);

Add16 Add16_INST_A (
    .a(in),
    .b(16'b0000000000000001),
    .out(out)
);

endmodule