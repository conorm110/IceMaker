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