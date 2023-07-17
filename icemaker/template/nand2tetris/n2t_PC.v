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