module CPU (
	input [15:0] inM,
	input [15:0] instruction,
	input reset,
	input clk,
	output [15:0] outM,
	output writeM,
	output [14:0] addressM,
	output [14:0] pc
);

wire c_inst = instruction[15];
wire a_inst = ~c_inst;

/** A Register **/
wire loadALUtoA = c_inst & instruction[5];
wire loadA = loadALUtoA | a_inst;

wire [15:0] ARegInput;
Mux16 _Mux16_ARegInput (
	.a(instruction),
	.b(outM),
	.sel(loadALUtoA),
	.out(ARegInput)
);

wire [15:0] Aout;
Register _ARegsiter (
	.in(ARegInput),
	.load(loadA),
	.out(Aout)
);

assign addressM = Aout[14:0];

/** A or M Register to ALU **/
wire [15:0] AMout;
Mux16 _AorMinALU (
	.a(Aout),
	.b(inM),
	.sel(instruction[12]),
	.out(AMout)
);

/** D Register **/
wire loadD = c_inst & instruction[4];
wire [15:0] Dout;
Register _DRegister (
	.in(outM),
	.load(loadD),
	.out(Dout)
);

/** ALU **/
wire zr, ng;
ALU _ALU (
	.x(Dout),
	.y(AMout),
	.zx(instruction[11]),
	.nx(instruction[10]),
	.zy(instruction[9]),
	.ny(instruction[8]),
	.f(instruction[7]),
	.no(instruction[6]),
	.out(outM),
	.zr(zr),
	.ng(ng)
);

/** writeM **/
assign writeM = c_inst & instruction[3];

/** Program Counter **/
wire jeq = zr & instruction[1];
wire jlt = ng & instruction[2];
wire zeroOrNeg = zr | ng;
wire positive = ~zeroOrNeg;
wire jgt = positive & instruction[0];
wire jle = jlt | jeq;
wire jumpToA = jgt | jle;
wire PCload = c_inst & jumpToA;
wire PCinc = ~PCload;
wire [15:0] PCout;
PC _PC (
	.in(Aout),
	.inc(PCinc),
	.load(PCload),
	.reset(reset),
	.clk(clk),
	.out(PCout)
);
assign pc = PCout[14:0];



endmodule
