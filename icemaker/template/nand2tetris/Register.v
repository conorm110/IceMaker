module Register (
    input [15:0] in,
    input load,
    output reg [15:0] out
);

always @(posedge load)
begin
    if (load)
        out <= in;
end

endmodule
