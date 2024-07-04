input clki,

    output vga0,
    output vga1,
    output vga2
);
    // NOTE: This code is not designed to control a VGA display; only uses DSUB connector as a simple output

    wire data_in  = 1'b1; 

    // Connect to system clock (with buffering)
    wire clk;
    SB_GB clk_gb (
        .USER_SIGNAL_TO_GLOBAL_BUFFER(clki),
        .GLOBAL_BUFFER_OUTPUT(clk)
    );

    wire clk_3Hz;
    clk_divider _clk_divider(
        .in(clk),
        .out(clk_3Hz)
    );

    HackComputer _HackComputer(
        .clk(clk_3Hz),
        .n_reset(1'b1),
        .key(data_in),
        .led(vga)
    );

    wire [2:0] vga;
    // RGB Driver
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

    // Parameters from iCE40 UltraPlus LED Driver Usage Guide, pages 19-20
    localparam RGBA_CURRENT_MODE_FULL = "0b0";
    localparam RGBA_CURRENT_MODE_HALF = "0b1";
    // Current levels in Full / Half mode
    localparam RGBA_CURRENT_04MA_02MA = "0b000001";
    localparam RGBA_CURRENT_08MA_04MA = "0b000011";
    localparam RGBA_CURRENT_12MA_06MA = "0b000111";
    localparam RGBA_CURRENT_16MA_08MA = "0b001111";
    localparam RGBA_CURRENT_20MA_10MA = "0b011111";
    localparam RGBA_CURRENT_24MA_12MA = "0b111111";
    defparam RGBA_DRIVER.CURRENT_MODE = RGBA_CURRENT_MODE_HALF;
    defparam RGBA_DRIVER.RGB0_CURRENT = RGBA_CURRENT_16MA_08MA; // Blue - Needs more current.
    defparam RGBA_DRIVER.RGB1_CURRENT = RGBA_CURRENT_08MA_04MA; // Red
    defparam RGBA_DRIVER.RGB2_CURRENT = RGBA_CURRENT_08MA_04MA; // Green

endmodule