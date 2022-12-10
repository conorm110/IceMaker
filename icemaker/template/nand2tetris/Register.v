module Register (
    input clk,
    input [15:0] in,
    input load,
    output reg [15:0] out
);

wire [15:0] loop;
assign loop = out;

always @(posedge clk) begin
  if (in) begin
    out <= in;
  end else begin
    out <= loop;
  end
end
endmodule