
`ifdef EVT
`define BLUEPWM  RGB0PWM
`define REDPWM   RGB1PWM
`define GREENPWM RGB2PWM
`elsif HACKER
`define BLUEPWM  RGB0PWM
`define GREENPWM RGB1PWM
`define REDPWM   RGB2PWM
`elsif PVT
`define GREENPWM RGB0PWM
`define REDPWM   RGB1PWM
`define BLUEPWM  RGB2PWM
`else
`error_board_not_supported
`endif

module top (
    input clki,

    output rgb0,
    output rgb1,
    output rgb2,

    //input  user_1,
    //output user_2,
    //output user_3,
    //input  user_4,
    
    output usb_dp,
    output usb_dn,
    output usb_dp_pu
);

    // Set all USB low to disconnect from host
    assign usb_dp = 1'b0;
    assign usb_dn = 1'b0;
    assign usb_dp_pu = 1'b0;

    // Connect to system clock (with buffering)
    wire clk;
    SB_GB clk_gb (
        .USER_SIGNAL_TO_GLOBAL_BUFFER(clki),
        .GLOBAL_BUFFER_OUTPUT(clk)
    );

    // Divide clock to much slower signal so we can see it
    reg [22:0] counter = 0;
    always @(posedge clk) begin
        counter <= counter + 1;
    end
    wire slow_clk = counter[22];

    // Driven by the slower couple HZ clock, increment a register corresponding to the RGB LEDs
    reg [2:0] rgb = 3'b000;
    always @(posedge slow_clk) begin
        rgb <= rgb + 1;
    end

    SB_RGBA_DRV RGBA_DRIVER (
        .CURREN(1'b1),
        .RGBLEDEN(1'b1),
        .`BLUEPWM(rgb[0]),
        .`REDPWM(rgb[1]),
        .`GREENPWM(rgb[2]),
        .RGB0(rgb0),
        .RGB1(rgb1),
        .RGB2(rgb2)
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
