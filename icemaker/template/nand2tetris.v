input clki,

    output rgb0,
    output rgb1,
    output rgb2,

    input  user_1,
    output user_2,
    output user_3,
    input  user_4,
    
    output usb_dp,
    output usb_dn,
    output usb_dp_pu
);

    // Set all USB low to disconnect from host
    assign usb_dp = 1'b0;
    assign usb_dn = 1'b0;
    assign usb_dp_pu = 1'b0;

    assign user_2 = 1'b0;
    assign user_3 = 1'b0;

    localparam SB_IO_TYPE_SIMPLE_INPUT = 6'b000001;

    wire user_1_pulled;
    SB_IO #(
        .PIN_TYPE(SB_IO_TYPE_SIMPLE_INPUT),
        .PULLUP(1'b1)
    ) user_1_io (
        .PACKAGE_PIN(user_1),
        .OUTPUT_ENABLE(1'b0),
        .INPUT_CLK(clk),
        .D_IN_0(user_1_pulled),
    );

    wire user_4_pulled;
    SB_IO #(
        .PIN_TYPE(SB_IO_TYPE_SIMPLE_INPUT),
        .PULLUP(1'b 1)
    ) user_4_io (
        .PACKAGE_PIN(user_4),
        .OUTPUT_ENABLE(1'b0),
        .INPUT_CLK(clk),
        .D_IN_0(user_4_pulled),
    );

    wire reset = ~user_1_pulled; // Reset when pin one in shorted
    wire data_in  = ~user_4_pulled; // Operates as user input read only cell of memory at location 15'h0000

    // Connect to system clock (with buffering)
    wire clk;
    SB_GB clk_gb (
        .USER_SIGNAL_TO_GLOBAL_BUFFER(clki),
        .GLOBAL_BUFFER_OUTPUT(clk)
    );

    // Clock divider for CPU & RAM ([22] is 0.5 Hz Demo mode, otherwise use [1])
    wire cpu_ram_clk;
    assign cpu_ram_clk = counter[20]; 
    reg [24:0] counter = 25'b0_0000_0000_0000_0000_0000_0000;
    always@(posedge clk)
    begin
        counter <= counter + 1;
    end

    // Nand2Tetris 
    wire [15:0] rom_data;
    wire [14:0] rom_addr;

    n2t_computer computer (
        .clk(cpu_ram_clk),
        .reset(reset), // TODO: shorting FOMU instead of constant should cause reset
        .user_data_in(data_in),
        .rom_data(rom_data),
        .rom_addr(rom_addr),
        .rgb(rgb)
        //.n2t_computer_debug_RGB(rgb)
        //.n2t_CPU_debug_RGB(rgb)
        //.n2t_DECODE_debug_RGB(rgb)
    );

    n2t_ROM rom (
        .clk(clk), // Operates on faster clock, posedge buffer in n2t_computer
        .addr(rom_addr),
        .data_out(rom_data)
    );


    wire [2:0] rgb;
    // RGB Driver
    SB_RGBA_DRV RGBA_DRIVER (
        .CURREN(1'b1),
        .RGBLEDEN(1'b1),
        .`BLUEPWM(rgb[0]),
        .`REDPWM(rgb[1]),
        .`GREENPWM(rgb[2]),
        .RGB0(rgb0),
        .RGB1(rgb1),
        .RGB2(rgb2)
    );

    // Parameters from iCE40 UltraPlus LED Driver Usage Guide, pages 19-20
    localparam RGBA_CURRENT_MODE_FULL = "0b0";
    localparam RGBA_CURRENT_MODE_HALF = "0b1";
    // Current levels in Full / Half mode
    localparam RGBA_CURRENT_04MA_02MA = "0b000001";
    localparam RGBA_CURRENT_08MA_04MA = "0b000011";
    localparam RGBA_CURRENT_12MA_06MA = "0b000111";
    localparam RGBA_CURRENT_16MA_08MA = "0b001111";
    localparam RGBA_CURRENT_20MA_10MA = "0b011111";
    localparam RGBA_CURRENT_24MA_12MA = "0b111111";
    defparam RGBA_DRIVER.CURRENT_MODE = RGBA_CURRENT_MODE_HALF;
    defparam RGBA_DRIVER.RGB0_CURRENT = RGBA_CURRENT_16MA_08MA; // Blue - Needs more current.
    defparam RGBA_DRIVER.RGB1_CURRENT = RGBA_CURRENT_08MA_04MA; // Red
    defparam RGBA_DRIVER.RGB2_CURRENT = RGBA_CURRENT_08MA_04MA; // Green

endmodule

module n2t_computer (
    input clk,
    input reset,
    input user_data_in,
    input [15:0] rom_data,  // ROM data bus
    output [14:0] rom_addr,  // Address of next instruction
    output reg [2:0] rgb,    // [2:0] of last word written to register0
    output [2:0] n2t_computer_debug_RGB,
    output [2:0] n2t_CPU_debug_RGB,
    output [2:0] n2t_DECODE_debug_RGB
);

/*
Once the PC gets the clock signal it will increment PC in turn incrementing rom_addr and changing 
the value of rom_data to the next instruction before the next clk posedge because of the ROM 
operating on a different clock. This fixes the issue without adding a delay.
*/
reg [15:0] instruction;
always @(posedge clk) begin
    instruction = rom_data;
end


wire ram_we;
wire [14:0] ram_addr;
wire [15:0] ram_out;
wire [15:0] ram_in;

n2t_CPU CPU (
    .clk(clk),
	.inM(ram_out),
	.instruction(instruction),
	.reset(reset),
	.outM(ram_in),
	.writeM(ram_we),
	.addressM(ram_addr),
	.pc(rom_addr),
    .n2t_CPU_debug_RGB(n2t_CPU_debug_RGB),
    .n2t_DECODE_debug_RGB(n2t_DECODE_debug_RGB)
);

n2t_RAM RAM(
    .clk(clk),
    .in(ram_in),
    .load(ram_we),
    .address(ram_addr),
    .out(ram_out)
);

always @(*) begin
    if(ram_we) begin
        if (ram_addr == 15'b000000000000000)
            rgb = ram_out;
    end
    if (reset)
        rgb = 3'b000;
end


assign n2t_computer_debug_RGB[0] = rom_addr[0];
assign n2t_computer_debug_RGB[1] = rom_addr[1];
assign n2t_computer_debug_RGB[2] = rom_addr[2];


endmodule

module n2t_ROM (
    input wire clk,
    input wire [14:0] addr,
    output [15:0] data_out
);

reg [15:0] rom_reg [4:0];

initial begin
rom_reg[0] = 16'hfdd0; // D=M+1
rom_reg[1] = 16'he7c8; // M=D+1
rom_reg[2] = 16'hea87; // 0;JMP
end

wire [4:0] short_addr;
assign short_addr[3:0] = addr[3:0];

assign data_out = rom_reg[short_addr];

endmodule

/** Every Other Color Loop    
rom_reg[0] = 16'hfdd0; // D=M+1
rom_reg[1] = 16'he7c8; // M=D+1
rom_reg[2] = 16'hea87; // 0;JMP
*/ 

/** Writes Address of Each RAM Word to Each RAM Word
rom_reg[0] = 16'he7e0; // D=M+1
rom_reg[1] = 16'hec08; // M=D+1
rom_reg[2] = 16'he7d0; // 0;JMP
rom_reg[3] = 16'h0000; // D=M+1
rom_reg[4] = 16'hea87; // M=D+1
*/

module n2t_RAM (
    input clk,
    input load,
    input [14:0] address,
    input [15:0] in,
    output reg [15:0] out
);

reg [15:0] ram_reg [1:0];

always @(posedge clk) begin
    if (load) begin
        ram_reg[address] = in;
    end
    out <= ram_reg[address];
end


endmodule

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

module n2t_DECODE (
    input [15:0] instruction,
    input ng,
    input zr,

    output zx,
    output nx,
    output zy,
    output ny,
    output f,
    output no,
    output sel_MUX_a_reg_input,
    output load_a_register,
    output sel_MUX_alu_y_input,
    output load_d_register,
    output pc_inc,
    output pc_load,
    output write_enable,

    output [2:0] n2t_DECODE_debug_RGB
);

/**
assign n2t_DECODE_debug_RGB[0] = ;
assign n2t_DECODE_debug_RGB[1] = ;
assign n2t_DECODE_debug_RGB[2] = ;
*/

wire c_instruction = instruction[15];

wire [6:0] comp = instruction[12:6];
wire [2:0] dest = instruction[5:3]; // [0]->M,[1]->D,[2]->A
wire [2:0] jump = instruction[2:0]; // [0]->j3, [1]->j2, [2]-> j1

wire sel_MUX_alu_y_input = comp[6];
assign zx = comp[5];
assign nx = comp[4];
assign zy = comp[3];
assign ny = comp[2];
assign f = comp[1];
assign no = comp[0];

assign write_enable = c_instruction & dest[0];

wire a_instruction = ~c_instruction;
assign sel_MUX_a_reg_input = a_instruction;
assign load_a_register = a_instruction | (c_instruction & dest[2]); // c_i & dest2 used to be c_i & dest2ordest0, changed to fix a bug

assign load_d_register = c_instruction & dest[1];

wire jgt = (~jump[2] & ~jump[1] & jump[0]) & ((~ng) & (~zr));
wire jeq = (~jump[2] & jump[1] & ~jump[0]) & zr; 
wire jge = (~jump[2] & jump[1] & jump[0]) & (~ng);
wire jlt = (jump[2] & ~jump[1] & ~jump[0]) & ng;
wire jne = (jump[2] & ~jump[1] & jump[0]) & (~zr);
wire jle = (jump[2] & jump[1] & ~jump[0]) & (ng | zr);
wire jmp = (jump[2] & jump[1] & jump[0]);
wire jump_true = jgt | jeq | jge | jlt | jne | jle | jmp;

wire pc_load = c_instruction & jump_true; // only can load during c instruction
wire pc_inc = ~pc_load;



endmodule

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

module n2t_PC (
    input clk,
    input inc,
    input [15:0] in,
    input reset,
    input load,
    output reg [15:0] out
);

always @(posedge clk) begin
    if (reset) begin
        out = 15'b000000000000000;
    end else begin
        if (load) begin
                out = in;
        end else begin
            if (inc) begin
                out = out + 15'b000000000000001;
            end
        end
    end
end

endmodule

module n2t_MUX16(
    input [15:0] a, 
    input [15:0] b, 
    input sel, 
    output reg [15:0] out
    );
    always @ (*)
    begin
        if (sel)
            out = b;
        else
            out = a;
    end
endmodule