module RAM_small (
    input [3:0] address,
    input [15:0] data_in,
    input clk,
    input we,
    output reg [15:0] data_out,
    output reg [15:0] rgb
);

reg [15:0] memory [0:15]; // 16x16-bit memory array

always @(posedge clk) begin
    if (we) begin
        // Write data to memory when write enable (we) is high
        memory[address] <= data_in;
    end
    // Read data from memory based on the address
    data_out <= memory[address];
    // Output data stored in the first address
    rgb <= memory[0];
end

endmodule