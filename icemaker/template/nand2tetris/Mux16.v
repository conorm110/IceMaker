module Mux16 (
    input [15:0] a,
    input [15:0] b,
    input sel,
    output [15:0] out
);

Mux Mux_INST_A (
    .a(a[0]),
    .b(b[0]),
    .sel(sel),
    .out(out[0])
);

Mux Mux_INST_B (
    .a(a[1]),
    .b(b[1]),
    .sel(sel),
    .out(out[1])
);

Mux Mux_INST_C (
    .a(a[2]),
    .b(b[2]),
    .sel(sel),
    .out(out[2])
);

Mux Mux_INST_D (
    .a(a[3]),
    .b(b[3]),
    .sel(sel),
    .out(out[3])
);

Mux Mux_INST_E (
    .a(a[4]),
    .b(b[4]),
    .sel(sel),
    .out(out[4])
);

Mux Mux_INST_F (
    .a(a[5]),
    .b(b[5]),
    .sel(sel),
    .out(out[5])
);

Mux Mux_INST_G (
    .a(a[6]),
    .b(b[6]),
    .sel(sel),
    .out(out[6])
);

Mux Mux_INST_H (
    .a(a[7]),
    .b(b[7]),
    .sel(sel),
    .out(out[7])
);

Mux Mux_INST_I (
    .a(a[8]),
    .b(b[8]),
    .sel(sel),
    .out(out[8])
);

Mux Mux_INST_J (
    .a(a[9]),
    .b(b[9]),
    .sel(sel),
    .out(out[9])
);

Mux Mux_INST_K (
    .a(a[10]),
    .b(b[10]),
    .sel(sel),
    .out(out[10])
);

Mux Mux_INST_L (
    .a(a[11]),
    .b(b[11]),
    .sel(sel),
    .out(out[11])
);

Mux Mux_INST_M (
    .a(a[12]),
    .b(b[12]),
    .sel(sel),
    .out(out[12])
);

Mux Mux_INST_N (
    .a(a[13]),
    .b(b[13]),
    .sel(sel),
    .out(out[13])
);

Mux Mux_INST_O (
    .a(a[14]),
    .b(b[14]),
    .sel(sel),
    .out(out[14])
);

Mux Mux_INST_P (
    .a(a[15]),
    .b(b[15]),
    .sel(sel),
    .out(out[15])
);

endmodule