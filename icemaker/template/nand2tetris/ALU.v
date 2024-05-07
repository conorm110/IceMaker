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

/** Zero X and/or Y **/
wire [15:0] zxout;
Mux16 _Mux16_0 (
	.a(x),
	.b(16'b0000_0000_0000_0000),
	.sel(zx),
	.out(zxout)
);

wire [15:0] zyout;
Mux16 _Mux16_1 (
	.a(y),
	.b(16'b0000_0000_0000_0000),
	.sel(zy),
	.out(zyout)
);

/** Not X and/or Y **/
wire [15:0] notx;
Not16 _Not16_0 (
	.in(zxout),
	.out(notx)
);

wire [15:0] nxout;
Mux16 _Mux_16_2 (
	.a(zxout),
	.b(notx),
	.sel(nx),
	.out(nxout)
);

wire [15:0] noty;
Not16 _Not16_1 (
	.in(zyout),
	.out(noty)
);

wire [15:0] nyout;
Mux16 _Mux_16_3 (
	.a(zyout),
	.b(noty),
	.sel(ny),
	.out(nyout)
);

/** AND or ADD X and Y **/
wire [15:0] addout;
Add16 _Add16 (
	.a(nxout),
	.b(nyout),
	.out(addout)
);

wire [15:0] andout;
And16 _And16 (
	.a(nxout),
	.b(nyout),
	.out(andout)
);

wire [15:0] fout;
Mux16 _Mux16_4 (
	.a(andout),
	.b(addout),
	.sel(f),
	.out(fout)
);

/** NOT OUTPUT (or not) **/
wire [15:0] nfout;
Not16 _Not16_2 (
	.in(fout),
	.out(nfout)
);

Mux16 _Mux16_5 (
	.a(fout),
	.b(nfout),
	.sel(no),
	.out(out)
);

/** NEGATIVE FLAG **/
assign ng = out[15];

/** ZERO FLAG **/

wire [7:0] zr1;
assign zr1 = out[7:0];

wire [7:0] zr2;
assign zr2 = out[15:8];

wire or1;
Or8Way _Or8Way_0 (
	.in(zr1),
	.out(or1)
);

wire or2;
Or8Way _Or8Way_1 (
	.in(zr2),
	.out(or2)
);

wire or3;
assign or3 = or1 | or2; // Note: Or Module doesn't work because Or is a keyword
assign zr = ~or3;

endmodule
