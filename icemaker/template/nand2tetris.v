input clki,

    output rgb0,
    output rgb1,
    output rgb2,

    input  user_1,
    output user_2,
    output user_3,
    input  user_4,
    
    output usb_dp,
    output usb_dn,
    output usb_dp_pu
);

    // Set all USB low to disconnect from host
    assign usb_dp = 1'b0;
    assign usb_dn = 1'b0;
    assign usb_dp_pu = 1'b0;

    assign user_2 = 1'b0;
    assign user_3 = 1'b0;

    localparam SB_IO_TYPE_SIMPLE_INPUT = 6'b000001;

    wire user_1_pulled;
    SB_IO #(
        .PIN_TYPE(SB_IO_TYPE_SIMPLE_INPUT),
        .PULLUP(1'b1)
    ) user_1_io (
        .PACKAGE_PIN(user_1),
        .OUTPUT_ENABLE(1'b0),
        .INPUT_CLK(clk),
        .D_IN_0(user_1_pulled),
    );

    wire user_4_pulled;
    SB_IO #(
        .PIN_TYPE(SB_IO_TYPE_SIMPLE_INPUT),
        .PULLUP(1'b 1)
    ) user_4_io (
        .PACKAGE_PIN(user_4),
        .OUTPUT_ENABLE(1'b0),
        .INPUT_CLK(clk),
        .D_IN_0(user_4_pulled),
    );

    wire reset = ~user_1_pulled; // Reset when pin one in shorted
    wire data_in  = ~user_4_pulled; // Operates as user input read only cell of memory at location 15'h0000

    // Connect to system clock (with buffering)
    wire clk;
    SB_GB clk_gb (
        .USER_SIGNAL_TO_GLOBAL_BUFFER(clki),
        .GLOBAL_BUFFER_OUTPUT(clk)
    );

    // Clock divider for CPU & RAM ([22] is 0.5 Hz Demo mode, otherwise use [1])
    wire cpu_ram_clk;
    assign cpu_ram_clk = counter[20]; 
    reg [24:0] counter = 25'b0_0000_0000_0000_0000_0000_0000;
    always@(posedge clk)
    begin
        counter <= counter + 1;
    end

    // Nand2Tetris 
    wire [15:0] rom_data;
    wire [14:0] rom_addr;

    n2t_computer computer (
        .clk(cpu_ram_clk),
        .reset(reset), // TODO: shorting FOMU instead of constant should cause reset
        .user_data_in(data_in),
        .rom_data(rom_data),
        .rom_addr(rom_addr),
        .rgb(rgb)
        //.n2t_computer_debug_RGB(rgb)
        //.n2t_CPU_debug_RGB(rgb)
        //.n2t_DECODE_debug_RGB(rgb)
    );

    n2t_ROM rom (
        .clk(clk), // Operates on faster clock, posedge buffer in n2t_computer
        .addr(rom_addr),
        .data_out(rom_data)
    );


    wire [2:0] rgb;
    // RGB Driver
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