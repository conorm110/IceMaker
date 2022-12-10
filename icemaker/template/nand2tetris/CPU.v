module CPU (
    input clk,

    input [15:0] inM,
    input [15:0] instruction,
    input reset,

    output [15:0] outM,
    output writeM,
    output [14:0] addressM,
    output [15:0] pc_16,

    output reg [15:0] Aout,
    output wire [15:0] Aregin,
    output loadA,
    output reg [15:0] Dout,
    output wire [15:0] ALUout,
    output loadD,
    output PCinc,
    output PCload
);

// get type of instruction
wire Ainstruction;
assign Ainstruction = ~instruction[15];
wire Cinstruction;
assign Cinstruction = ~Ainstruction;

wire ALUtoA;
assign ALUtoA = Cinstruction & instruction[5];

Mux16 Mux16_INST_A (
    .a(instruction),
    .b(ALUout),
    .sel(ALUtoA),
    .out(Aregin)
);

// a register
assign loadA = Ainstruction | ALUtoA;
always @(posedge clk) begin
    if (loadA) begin
        Aout <= Aregin;
    end else begin
        Aout <= Aout;
    end
end

wire [15:0] AMout;
Mux16 Mux16_INST_B (
    .a(Aout),
    .b(inM),
    .sel(instruction[12]),
    .out(AMout)
);

// d register
assign loadD = Cinstruction & instruction[4];
always @(posedge clk) begin
    if (loadD) begin 
        Dout <= ALUout;
    end else begin
        Dout <= Dout;
    end
end

// alu
wire [15:0] ALUout;
wire ZRout;
wire NGout;
ALU ALU_INST_A (
    .x(Dout),
    .y(AMout),
    .zx(instruction[11]),
    .nx(instruction[10]),
    .zy(instruction[9]),
    .ny(instruction[8]),
    .f(instruction[7]),
    .no(instruction[6]),
    .out(ALUout),
    .zr(ZRout),
    .ng(NGout)
);

wire [15:0] addressM_16;
Or16 Or16_INST_A (
    .a(16'b0000000000000000),
    .b(Aout),
    .out(addressM_16)
);
assign addressM = addressM_16;

Or16 Or16_INST_B (
    .a(16'b0000000000000000),
    .b(ALUout),
    .out(outM)
);

assign writeM = Cinstruction & instruction[3];

wire jeq;
assign jeq = ZRout & instruction[1];
wire jlt;
assign jlt = NGout & instruction[2];
wire zeroOrNeg;
assign zeroOrNeg = ZRout & NGout;
wire positive;
assign positive = ~zeroOrNeg;
wire jgt;
assign jgt = positive & instruction[0];
wire jle;
assign jle = jeq | jlt;
wire jumpToA;
assign jumpToA = jle | jgt;
assign PCload = Cinstruction & jumpToA;
assign PCinc = ~PCload;
wire [15:0] pc_16;
PC PC_INST_A (
    .in(Aout),
    .inc(PCinc),
    .load(PCload),
    .reset(reset),
    .out(pc_16),
    .clk(clk)
);


endmodule