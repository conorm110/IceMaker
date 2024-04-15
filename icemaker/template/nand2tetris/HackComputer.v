module HackComputer (
	input clk,
	input n_reset,
	input key,
	output [2:0] led
);

wire we;
wire [15:0] cpu_din;
wire [15:0] cpu_dout;
wire [14:0] instruction_addr;
wire [14:0] data_addr;
CPU _CPU (
	.inM(cpu_din),
	.instruction(rom_data),
	.reset(~n_reset),
	.clk(clk),
	.outM(cpu_dout),
	.writeM(we),
	.addressM(data_addr),
	.pc(instruction_addr)
);

wire [3:0] rom_addr;
assign rom_addr = instruction_addr[3:0];
wire [15:0] rom_data;
ROM_small _ROM_small (
	.address(rom_addr),
	.clock(clk),
	.data(rom_data)
);


wire [3:0] ram_addr;
wire [15:0] rgb_bus;
assign ram_addr = data_addr[3:0];
RAM_small _RAM_small (
	.address(ram_addr),
	.data_in(cpu_dout),
	.clk(clk),
	.we(we),
	.data_out(cpu_din),
	.rgb(rgb_bus)
);

assign led = rgb_bus[2:0];

endmodule
