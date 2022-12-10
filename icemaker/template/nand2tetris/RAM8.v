module RAM8 (
    input clk,
    input [15:0] in,
    input load,
    input [2:0] address,
    output reg [15:0] out
);


always @(posedge clk) begin
    if (load) begin
        out <= in;
    end else begin
        out <= out;
    end
end
endmodule