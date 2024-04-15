module Add16 (
	input [15:0] a,
	input [15:0] b,
	output [15:0] out
);

wire [15:0] carry;
wire [15:0] sum;

FullAdder _FullAdder_0 (
    .a(a[0]),
    .b(b[0]),
    .c(1'b0),
    .sum(sum[0]),
    .carry(carry[0])
);

FullAdder _FullAdder_1 (
    .a(a[1]),
    .b(b[1]),
    .c(carry[0]),
    .sum(sum[1]),
    .carry(carry[1])
);

FullAdder _FullAdder_2 (
    .a(a[2]),
    .b(b[2]),
    .c(carry[1]),
    .sum(sum[2]),
    .carry(carry[2])
);

FullAdder _FullAdder_3 (
    .a(a[3]),
    .b(b[3]),
    .c(carry[2]),
    .sum(sum[3]),
    .carry(carry[3])
);

FullAdder _FullAdder_4 (
    .a(a[4]),
    .b(b[4]),
    .c(carry[3]),
    .sum(sum[4]),
    .carry(carry[4])
);

FullAdder _FullAdder_5 (
    .a(a[5]),
    .b(b[5]),
    .c(carry[4]),
    .sum(sum[5]),
    .carry(carry[5])
);

FullAdder _FullAdder_6 (
    .a(a[6]),
    .b(b[6]),
    .c(carry[5]),
    .sum(sum[6]),
    .carry(carry[6])
);

FullAdder _FullAdder_7 (
    .a(a[7]),
    .b(b[7]),
    .c(carry[6]),
    .sum(sum[7]),
    .carry(carry[7])
);

FullAdder _FullAdder_8 (
    .a(a[8]),
    .b(b[8]),
    .c(carry[7]),
    .sum(sum[8]),
    .carry(carry[8])
);

FullAdder _FullAdder_9 (
    .a(a[9]),
    .b(b[9]),
    .c(carry[8]),
    .sum(sum[9]),
    .carry(carry[9])
);

FullAdder _FullAdder_10 (
    .a(a[10]),
    .b(b[10]),
    .c(carry[9]),
    .sum(sum[10]),
    .carry(carry[10])
);

FullAdder _FullAdder_11 (
    .a(a[11]),
    .b(b[11]),
    .c(carry[10]),
    .sum(sum[11]),
    .carry(carry[11])
);

FullAdder _FullAdder_12 (
    .a(a[12]),
    .b(b[12]),
    .c(carry[11]),
    .sum(sum[12]),
    .carry(carry[12])
);

FullAdder _FullAdder_13 (
    .a(a[13]),
    .b(b[13]),
    .c(carry[12]),
    .sum(sum[13]),
    .carry(carry[13])
);

FullAdder _FullAdder_14 (
    .a(a[14]),
    .b(b[14]),
    .c(carry[13]),
    .sum(sum[14]),
    .carry(carry[14])
);

FullAdder _FullAdder_15 (
    .a(a[15]),
    .b(b[15]),
    .c(carry[14]),
    .sum(sum[15]),
    .carry(carry[15])
);

// Assign the output
assign out = sum;

endmodule
