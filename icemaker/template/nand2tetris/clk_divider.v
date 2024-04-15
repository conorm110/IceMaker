module clk_divider(
    input in,                      // 50 MHz
    output reg out                 // 2 Hz
);

reg [24:0] count = 0;

always @(posedge in) begin
    if (count == 4166666) begin    // 50e6 / (3e0 / 2)
        out <= ~out;
        count <= 0;
    end else begin
        count <= count + 1;
    end
end

endmodule
