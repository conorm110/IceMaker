module n2t_ALU (
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

wire [15:0] x_in;
wire [15:0] x_zx;

n2t_MUX16 n2t_MUX16_alua1 (
    .a(x),
    .b(16'b000000000000),
    .sel(zx),
    .out(x_zx)
);

n2t_MUX16 n2t_MUX16_alua2 (
    .a(x_zx),
    .b(~x_zx),
    .sel(nx),
    .out(x_in)
);

wire [15:0] y_in;
wire [15:0] y_zy;

n2t_MUX16 n2t_MUX16_alub1 (
    .a(y),
    .b(16'b000000000000),
    .sel(zy),
    .out(y_zy)
);

n2t_MUX16 n2t_MUX16_alub2 (
    .a(y_zy),
    .b(~y_zy),
    .sel(ny),
    .out(y_in)
);

wire [15:0] f_res;
n2t_MUX16 n2t_MUX16_inst_1 (
    .a(x_in & y_in),
    .b(x_in + y_in),
    .sel(f),
    .out(f_res)
);

n2t_MUX16 n2t_MUX16_inst_2 (
    .a(f_res),
    .b(~f_res),
    .sel(no),
    .out(out)
);

assign zr = (out == 16'b000000000000);
assign ng = (out[15]);

endmodule