module PC (
	input [15:0] in,
	input load,
	input inc,
	input reset,
	input clk,
	output [15:0] out
);

reg [15:0] pc_reg;

wire inc_pc_reg;
Inc16 _Inc16 (
	.in(pc_reg),
	.out(inc_pc_reg)
);

always @(posedge clk)
begin
	if (reset)
		pc_reg <= 16'b0;
	else if (load)
		pc_reg <= in;
	else if (inc)
		pc_reg <= inc_pc_reg;
end

assign out = pc_reg;

endmodule
