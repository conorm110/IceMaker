# IceMaker
Visual Studio Code extension automating tasks for programming iCE40 Ultra development boards using the [IceStorm](https://github.com/YosysHQ/icestorm) toolchain.

**Adding IceMaker to VS Code**
1. Download the [latest release](https://github.com/conorm110/IceMaker/releases)
2. Install .vsix file from the release in VS Code
    * `CTRL + SHIFT + X` to open the extensions menu, then install from the drop down menu on the sidebar
3. Open the command palette and run `IceMaker: Run Setup Guide` for further instructions on using the extension's tools. 

## Supported Boards
Currently the FOMU FPGA family are the only directly supported development boards that are commercially available. It also supports my BaseBoard-1K development board, based on the iCE5LP1K, which has openly available schematics and is easy to replicate.

### FOMU
[FOMU](https://tomu.im/fomu.html) boards are all directly supported. The toolchain creates a bitstream file which can later be uploaded to a FOMU by running `IceMaker: Upload Project to FOMU` in the command palette. 
### Custom Boards
Custom and generic iCE40 Ultra development boards are supported through the custom-sg48 and custom-uwg30 board types. The board type is selected during project generation and can be changed later in the project.icemaker file. The footprint of the FPGA on your custom/generic development board must match the selected board type. 

The I/O defined in the top level Verilog file must be set in the .pcf file corresponding to your custom board's board type. The .pcf files are located in the pcf folder generated in icemaker projects. Each I/O pin must be defined as `set_io [pin name] [pin code]`. For example, `set_io rgb0 39` or `set_io vga0 A5`

Output files are located in the bin file generated in icemaker projects. Icepack generates a final binary file that should be loaded onto your development board's configuration flash PROM. 
### BaseBoard
BaseBoard-1K is based on the iCE5LP1K-SG48 and has a DSUB (VGA) connector, a 50 MHz oscillator, and two PMOD headers. Simplifying the design, the FPGA loads its code only from the onboard SST 25VF080B Flash IC. The binary file generated from IceMaker can be loaded onto the flash chip with any SPI programmer or PROM programmer. 

Currently, there is no Verilog VGA controller module or PMOD pin assignments in the extension. BaseBoard is still a work in project, improved template code and schematics will be added soon.

## Project Templates
To aid starting projects, three project templates are available:

**Hack Computer Template:** 
Project contains a Verilog implementation of the Hack Computer. Address zero in the hack computer's memory has dual internal outputs and is used as a data output to control the iCE40 Ultra's onboard RGB controller. The default code in the hack computer's ROM module increments the value of address zero in memory to control the RGB output.

**Blank Template:** 
Generates an empty top level Verilog file

**Default Template:** 
Creates a top level Verilog file with a clock input linked to a clock divider module. The iCE40 Ultra's onboard RGB controller is defined as the output in the top file. The value of the RGB output is incremented by the slowed clock. 