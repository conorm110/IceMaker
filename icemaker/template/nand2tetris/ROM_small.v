module ROM_small (
	input [3:0] address,
    input clock,
    output reg [15:0] data
);

reg [15:0] memory [0:15]; // 16x16-bit memory array

initial begin
    // Initialize memory with desired values
    memory[0] = 16'h0000;
    memory[1] = 16'hfdc8;
    memory[2] = 16'hea87;
    memory[3] = 16'he7d0;
    memory[4] = 16'h0001;
    memory[5] = 16'hea87;
    memory[6] = 16'hea87;
    memory[7] = 16'hea87;
    memory[8] = 16'b1010_1010_0101_0101;
    memory[9] = 16'b0101_0101_1010_1010;
    memory[10] = 16'b1111_0000_0000_1111;
    memory[11] = 16'b0000_1111_1111_0000;
    memory[12] = 16'b1010_1111_0101_1110;
    memory[13] = 16'b0101_0000_1010_0001;
    memory[14] = 16'b1111_0101_0000_1010;
    memory[15] = 16'b0000_1010_1111_0101;
end

always @(posedge clock) begin
    // Read data from memory based on the address
    data <= memory[address];
end

endmodule
