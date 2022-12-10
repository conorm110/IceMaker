
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
    

    reg [23:0] div;
    always @(posedge clk) begin
        div <= div + 1;
    end
    
    wire [15:0] outM;
    wire writeM;
    wire [15:0] addressM;
    wire [15:0] pc_out;
    wire [15:0] Aout;
    wire [15:0] Aregin;
    wire [15:0] Dout;
    wire loadA;

    wire [15:0] rom_dout;
    CPU CPU_INST_A (
        .clk(div[22]),
        .inM(inM),
        .instruction(rom_dout),
        .reset(1'b0),
        .outM(outM),
        .writeM(writeM),
        .addressM(addressM),
        .pc_16(pc_out),
        .PCinc(PCinc),
        .PCload(PCload),
        .Aregin(Aregin),
        .loadA(loadA),
        .Aout(Aout),
        .Dout(Dout)
    );

    wire [15:0] inM;
    RAM8 RAM8_INST_A (
        .clk(clk),
        .in(outM),
        .load(writeM),
        .address(addressM),
        .out(inM)
    );

    ROM ROM_main (
        .rom_dout(rom_dout),
        .clk(clk),
        .pc_out(pc_out)
    );

    reg [2:0] rgb_buffer;
    always @(posedge clk) begin
        rgb_buffer <= inM[2:0];
    end

    SB_RGBA_DRV RGBA_DRIVER (
        .CURREN(1'b1),
        .RGBLEDEN(1'b1),
        .`BLUEPWM(rgb_buffer[0]),
        .`REDPWM(rgb_buffer[1]),
        .`GREENPWM(rgb_buffer[2]),
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
