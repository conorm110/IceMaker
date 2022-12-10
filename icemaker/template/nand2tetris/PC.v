module PC (
    input clk,
    input [15:0] in,
    input load,
    input inc,
    input reset,
    output [15:0] out
);

always @(posedge clk) begin
    if (reset) begin
        out <= 16'b0000000000000000;
    end else if (load) begin
        out <= in;
    end else if (inc) begin
        out <= out + 16'b0000000000000001;
    end
end

endmodule