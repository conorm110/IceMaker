module DMux4Way (
    input in,
    input [1:0] sel,
    output a,
    output b,
    output c,
    output d
);

wire outa;
wire outb;

DMux DMux_INST_A (
    .in(in),
    .sel(sel[1]),
    .a(outa),
    .b(outb)
);

DMux DMux_INST_B (
    .in(outa),
    .sel(sel[0]),
    .a(a),
    .b(b)
);

DMux DMux_INST_C (
    .in(outb),
    .sel(sel[0]),
    .a(c),
    .b(d)
);


endmodule