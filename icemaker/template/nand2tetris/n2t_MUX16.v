module n2t_MUX16(
    input [15:0] a, 
    input [15:0] b, 
    input sel, 
    output reg [15:0] out
    );
    always @ (*)
    begin
        if (sel)
            out = b;
        else
            out = a;
    end
endmodule