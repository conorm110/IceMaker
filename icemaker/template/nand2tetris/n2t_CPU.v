module n2t_CPU (
    input clk,
	input reset,
	input [15:0] inM,
	input [15:0] instruction,
	output [15:0] outM,
	output writeM,
	output [14:0] addressM,
	output [14:0] pc,
	output [2:0] n2t_CPU_debug_RGB,
	output [2:0] n2t_DECODE_debug_RGB
);


assign n2t_CPU_debug_RGB[0] = a_register[0];
assign n2t_CPU_debug_RGB[1] = a_register[1];
assign n2t_CPU_debug_RGB[2] = a_register[2];


assign outM = alu_data_out;
assign addressM = a_register;

n2t_DECODE instr_decoder (
	.instruction(instruction),
	.ng(alu_ng),
	.zr(alu_zr),

	.zx(alu_zx),
	.nx(alu_nx),
	.zy(alu_zy),
	.ny(alu_ny),
	.f(alu_f),
	.no(alu_no),
	.sel_MUX_a_reg_input(sel_MUX_a_reg_input),
	.load_a_register(load_a_register),
	.sel_MUX_alu_y_input(sel_MUX_alu_y_input),
	.load_d_register(load_d_register),
	.pc_inc(pc_inc),
	.pc_load(pc_load),
	.write_enable(writeM),

	.n2t_DECODE_debug_RGB(n2t_DECODE_debug_RGB)
);

wire [15:0] a_reg_input;
n2t_MUX16 MUX_a_reg_input (
	.a(alu_data_out),
	.b(instruction),
	.sel(sel_MUX_a_reg_input),
	.out(a_reg_input)
);

wire load_a_register;
reg [15:0] a_register;
always @(posedge clk) begin
	if (load_a_register)
		a_register = a_reg_input;
	if (reset)
		a_register = 16'h0000;
end

wire [15:0] alu_y_input;
n2t_MUX16 MUX_alu_y_input (
	.a(a_register),
	.b(inM),
	.sel(sel_MUX_alu_y_input),
	.out(alu_y_input)
);

wire load_d_register;
reg [15:0] d_register;
always @(posedge clk) begin
	if (load_d_register)
		d_register = alu_data_out;
	if (reset)
		d_register = 16'h0000;
end

wire [15:0] alu_data_out;
wire alu_ng;
wire alu_zr;
wire alu_zx;
wire alu_nx;
wire alu_zy;
wire alu_ny;
wire alu_f;
wire alu_no;
n2t_ALU alu (
	.x(d_register),
	.y(alu_y_input),
	.zx(alu_zx),
	.nx(alu_nx),
	.zy(alu_zy),
	.ny(alu_ny),
	.f(alu_f),
	.no(alu_no),
	.out(alu_data_out),
	.zr(alu_zr),
	.ng(alu_ng)
);

wire pc_load;
wire pc_inc;
n2t_PC program_counter (
	.clk(clk),
	.in(a_register),
	.load(pc_load),
	.inc(pc_inc),
	.reset(1'b0),
	.out(pc)
);

endmodule