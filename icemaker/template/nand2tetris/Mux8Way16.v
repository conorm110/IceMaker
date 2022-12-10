module Mux8Way16 (
    input [15:0] a,
    input [15:0] b,
    input [15:0] c,
    input [15:0] d,
    input [15:0] e,
    input [15:0] f,
    input [15:0] g,
    input [15:0] h,
    input [2:0] sel,
    output [15:0] out
);

wire [15:0] outab;
wire [15:0] outcd;
wire [15:0] outef;
wire [15:0] outgh;
wire [15:0] outabcd;
wire [15:0] outefgh;

Mux16 Mux16_INST_A (
    .a(a),
    .b(b),
    .sel(sel[0]),
    .out(outab)
);

Mux16 Mux16_INST_B (
    .a(c),
    .b(d),
    .sel(sel[0]),
    .out(outcd)
);

Mux16 Mux16_INST_C (
    .a(e),
    .b(f),
    .sel(sel[0]),
    .out(outef)
);

Mux16 Mux16_INST_D (
    .a(g),
    .b(h),
    .sel(sel[0]),
    .out(outgh)
);

Mux16 Mux16_INST_E (
    .a(outab),
    .b(outcd),
    .sel(sel[1]),
    .out(outabcd)
);

Mux16 Mux16_INST_F (
    .a(outef),
    .b(outgh),
    .sel(sel[1]),
    .out(outefgh)
);

Mux16 Mux16_INST_G (
    .a(outabcd),
    .b(outefgh),
    .sel(sel[2]),
    .out(out)
);

endmodule