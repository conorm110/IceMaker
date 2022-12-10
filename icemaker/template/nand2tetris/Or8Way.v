module Or8Way (
    input [7:0] in,
    output out
);

wire t1, t2, t3, t4, t5, t6;

assign t1 = in[0] | in[1];
assign t2 = in[2] | t1;
assign t3 = in[3] | t2;
assign t4 = in[4] | t3;
assign t5 = in[5] | t4;
assign t6 = in[6] | t5;
assign out = in[7] | t6;

endmodule