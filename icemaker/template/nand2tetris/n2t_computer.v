
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