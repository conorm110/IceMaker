module DMux4Way (
    input in,
    input [2:0] sel,
    output a,
    output b,
    output c,
    output d,
    output e,
    output f,
    output g,
    output h
);

wire abcd;
wire efgh;
wire ab;
wire cd;
wire ef;
wire gh;

DMux DMux_INST_A (
    .in(in),
    .sel(sel[2]),
    .a(abcd),
    .b(efgh)
);

DMux DMux_INST_B (
    .in(abcd),
    .sel(sel[1]),
    .a(ab),
    .b(cd)
);

DMux DMux_INST_C (
    .in(efgh),
    .sel(sel[1]),
    .a(ef),
    .b(gh)
);

DMux DMux_INST_D (
    .in(ab),
    .sel(sel[0]),
    .a(a),
    .b(b)
);

DMux DMux_INST_E (
    .in(cd),
    .sel(sel[0]),
    .a(c),
    .b(d)
);

DMux DMux_INST_F (
    .in(ef),
    .sel(sel[0]),
    .a(e),
    .b(f)
);

DMux DMux_INST_G (
    .in(gh),
    .sel(sel[0]),
    .a(g),
    .b(h)
);

endmodule