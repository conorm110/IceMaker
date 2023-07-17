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