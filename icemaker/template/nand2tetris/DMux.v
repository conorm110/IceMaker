module DMux (
    input in,
    input sel,
    output a,
    output b
);

wire notsel;
assign notsel = ~sel;

assign a = notsel & in;

assign b = sel & in;

endmodule;