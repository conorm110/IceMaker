
    input clki,

    output vga0,
    output vga1,
    output vga2
);
    // NOTE: This code is not designed to control a VGA display; only uses DSUB connector as a simple output

    reg [2:0] vga = 3'b101;

    
    wire clk;
    SB_GB clk_gb (
        .USER_SIGNAL_TO_GLOBAL_BUFFER(clki),
        .GLOBAL_BUFFER_OUTPUT(clk)
    );
    SB_RGBA_DRV RGBA_DRIVER (
        .CURREN(1'b1),
        .RGBLEDEN(1'b1),
        .RGB2PWM(vga[0]),
        .RGB1PWM(vga[1]),
        .RGB0PWM(vga[2]),
        .RGB0(vga0),
        .RGB1(vga1),
        .RGB2(vga2)
    );
    localparam RGBA_CURRENT_MODE_FULL = "0b0";
    localparam RGBA_CURRENT_MODE_HALF = "0b1";
    localparam RGBA_CURRENT_04MA_02MA = "0b000001";
    localparam RGBA_CURRENT_08MA_04MA = "0b000011";
    localparam RGBA_CURRENT_12MA_06MA = "0b000111";
    localparam RGBA_CURRENT_16MA_08MA = "0b001111";
    localparam RGBA_CURRENT_20MA_10MA = "0b011111";
    localparam RGBA_CURRENT_24MA_12MA = "0b111111";
    defparam RGBA_DRIVER.CURRENT_MODE = RGBA_CURRENT_MODE_HALF;
    defparam RGBA_DRIVER.RGB0_CURRENT = RGBA_CURRENT_16MA_08MA; 
    defparam RGBA_DRIVER.RGB1_CURRENT = RGBA_CURRENT_08MA_04MA;
    defparam RGBA_DRIVER.RGB2_CURRENT = RGBA_CURRENT_08MA_04MA;

endmodule
