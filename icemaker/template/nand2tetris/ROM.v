module ROM (
    input clk,
    input [15:0] pc_out,
    output reg [15:0] rom_dout
);

always @(posedge clk)
    begin
        if (pc_out[2:0] == 3'b000) begin
            rom_dout <= 16'b0000000000000000;
        end
        if (pc_out[2:0] == 3'b001) begin
            rom_dout <= 16'b1110110000001000;
        end
        if (pc_out[2:0] == 3'b010) begin
            rom_dout <= 16'b0000000000000000;
        end
        if (pc_out[2:0] == 3'b011) begin
            rom_dout <= 16'b0000000000000000;
        end
        if (pc_out[2:0] == 3'b100) begin
            rom_dout <= 16'b1111110000010000;
        end
        if (pc_out[2:0] == 3'b101) begin
            rom_dout <= 16'b1110011111001000;
        end
        if (pc_out[2:0] == 3'b110) begin
            rom_dout <= 16'b0000000000000010;
        end
        if (pc_out[2:0] == 3'b111) begin
            rom_dout <= 16'b1110101010000111;
        end
    end

endmodule