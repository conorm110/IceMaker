module Mux (
    input a,
    input b,
    input sel,
    output out
);

wire notsel;
assign notsel = ~sel;

wire ares;
assign ares = notsel & a;

wire bres;
assign bres = sel & b;

assign out = ares | bres;

endmodule