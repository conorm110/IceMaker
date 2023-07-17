module n2t_DECODE (
    input [15:0] instruction,
    input ng,
    input zr,

    output zx,
    output nx,
    output zy,
    output ny,
    output f,
    output no,
    output sel_MUX_a_reg_input,
    output load_a_register,
    output sel_MUX_alu_y_input,
    output load_d_register,
    output pc_inc,
    output pc_load,
    output write_enable,

    output [2:0] n2t_DECODE_debug_RGB
);

/**
assign n2t_DECODE_debug_RGB[0] = ;
assign n2t_DECODE_debug_RGB[1] = ;
assign n2t_DECODE_debug_RGB[2] = ;
*/

wire c_instruction = instruction[15];

wire [6:0] comp = instruction[12:6];
wire [2:0] dest = instruction[5:3]; // [0]->M,[1]->D,[2]->A
wire [2:0] jump = instruction[2:0]; // [0]->j3, [1]->j2, [2]-> j1

wire sel_MUX_alu_y_input = comp[6];
assign zx = comp[5];
assign nx = comp[4];
assign zy = comp[3];
assign ny = comp[2];
assign f = comp[1];
assign no = comp[0];

assign write_enable = c_instruction & dest[0];

wire a_instruction = ~c_instruction;
assign sel_MUX_a_reg_input = a_instruction;
assign load_a_register = a_instruction | (c_instruction & dest[2]); // c_i & dest2 used to be c_i & dest2ordest0, changed to fix a bug

assign load_d_register = c_instruction & dest[1];

wire jgt = (~jump[2] & ~jump[1] & jump[0]) & ((~ng) & (~zr));
wire jeq = (~jump[2] & jump[1] & ~jump[0]) & zr; 
wire jge = (~jump[2] & jump[1] & jump[0]) & (~ng);
wire jlt = (jump[2] & ~jump[1] & ~jump[0]) & ng;
wire jne = (jump[2] & ~jump[1] & jump[0]) & (~zr);
wire jle = (jump[2] & jump[1] & ~jump[0]) & (ng | zr);
wire jmp = (jump[2] & jump[1] & jump[0]);
wire jump_true = jgt | jeq | jge | jlt | jne | jle | jmp;

wire pc_load = c_instruction & jump_true; // only can load during c instruction
wire pc_inc = ~pc_load;



endmodule