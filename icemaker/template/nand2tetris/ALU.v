module ALU (
    input [15:0] x,
    input [15:0] y,
    input zx,
    input nx,
    input zy,
    input ny,
    input f,
    input no,
    output [15:0] out,
    output zr,
    output ng
);

wire [15:0] xOrZeroOut;
Mux16 Mux16_INST_A (
    .a(x),
    .b(16'b0000000000000000),
    .sel(zx),
    .out(xOrZeroOut)
);

wire [15:0] notx;
Not16 Not16_INST_A (
    .in(xOrZeroOut),
    .out(notx)
);

wire [15:0] xOrZeroOrNegatedOut;
Mux16 Mux16_INST_B (
    .a(xOrZeroOut),
    .b(notx),
    .sel(nx),
    .out(xOrZeroOrNegatedOut)
);

wire [15:0] yOrZeroOut;
Mux16 Mux16_INST_C (
    .a(y),
    .b(16'b0000000000000000),
    .sel(zy),
    .out(yOrZeroOut)
);

wire [15:0] noty;
Not16 Not16_INST_B (
    .in(yOrZeroOut),
    .out(noty)
);

wire [15:0] yOrZeroOrNegatedOut;
Mux16 Mux16_INST_D (
    .a(yOrZeroOut),
    .b(noty),
    .sel(ny),
    .out(yOrZeroOrNegatedOut)
);

wire [15:0] xPlusY;
Add16 Add16_INST_A (
    .a(xOrZeroOrNegatedOut),
    .b(yOrZeroOrNegatedOut),
    .out(xPlusY)
);

wire [15:0] xAndY;
And16 And16_INST_A (
    .a(xOrZeroOrNegatedOut),
    .b(yOrZeroOrNegatedOut),
    .out(xAndY)
);

wire [15:0] xOpY;
Mux16 Mux16_INST_E (
    .a(xAndY),
    .b(xPlusY),
    .sel(f),
    .out(xOpY)
);

wire [15:0] xOpYNot;
Not16 Not16_INST_C (
    .in(xOpY),
    .out(xOpYNot)
);

wire [15:0] out_if;
Mux16 Mux16_INST_F (
    .a(xOpY),
    .b(xOpYNot),
    .sel(no),
    .out(out_if)
);

wire [7:0] outLSB;
wire [14:8] outMSB;
wire outMSBbit;
assign outLSB = out_if[7:0];
assign outMSB = out_if[14:8];
assign outMSBbit = out_if[15];

assign out = out_if;

wire xOpYOr1;
Or8Way Or8Way_INST_A (
    .in(outLSB),
    .out(xOpYOr1)
);

wire [7:0] outMSB_and_bit;
assign outMSB_and_bit[6:0] = outMSB;
assign outMSB_and_bit[7] = outMSBbit;

wire xOpYOr2;
Or8Way Or8Way_INST_B (
    .in(outMSB_and_bit),
    .out(xOpYOr2)
);

wire xOpYOr;
assign xOpYOr = xOpYOr1 | xOpYOr2;
assign zr = ~xOpYOr;

assign ng = outMSBbit;

endmodule