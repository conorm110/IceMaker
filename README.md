# IceMaker


Visual Studio Code extension automating tasks for programming [FOMU](https://tomu.im/fomu.html) in Verilog. Contains Nand2Tetris template to base a project off the Nand2Tetris CPU. **Support for all iCE40 boards coming soon!**


## Creating and Uploading Projects with IceMaker
1. Download the [latest release](https://github.com/conorm110/IceMaker/releases)
2. Install .vsix file from release in vs code (`CTRL + SHIFT + X` -> three dots above extensions marketplace search -> install from VSIX)
3. A Getting Started WebView should open, if not open command palette and run IceMaker: Run Setup Wizard


## Using the Nand2Tetris Template


*(The Nand2Tetris template option is newer and has more bugs, especially with timing, that have not popped up yet, if using the design for the base of a project be aware of potential bugginess, sorry!)*


**Architecture Overview**


Top level file contains IO controls for the FPGA, a clock divider (for the CPU and RAM), a ROM emulator, and a module, n2t_computer, which contains the Nand2Tetris computer architecture. The ROM module contains the machine code that is executed by the Nand2Tetris computer. The computer module has inputs and outputs for the ROM and clock but also a single output port, called RGB, which controls the single LED on the FOMU. The RGB port is register 0 (the first location in memory). There is also a reset wire triggered by touching the contacts on the FOMU.


Because the Nand2Tetris curriculum creates a lot of smaller modules that don't make much sense in Verilog (ex. Or8Way can just be wire [7:0] a; wire b = |a;) the hierarchy is a bit different in this. The CPU requires an ALU module, an instruction decoder module, a 16 bit wide MUX module, and a program counter module. RAM and ROM are not built up of smaller memory modules, like in Nand2Tetris, they are just register arrays. The address width of the arrays is different due to size constraints on the FOMU FPGA.


**ROM Emulator**


The default program on the ROM emulator cycles through four colors. In the template module for the ROM there are two other example programs that can be played around with that are commented out. The ROM emulator is a 2D register array and all the values are initialized in the module as machine code (ex: rom[0] = 16'hea87; in initial begin is an infinite loop)


**Future Nand2Tetris Features**
- The other contacts that can be shorted on the FOMU will soon act as a second input to the FPGA, acting as a read only part of the memory at a fixed address taken from the memory, just like the keyboard from the original Nand2Tetris course. Hopefully this feature will be added soon!
- Integration with the Nand2Tetris tools to allow for programming in assembly, or even the higher level Nand2Tetris language, will also be added hopefully soon!
- After support for all iCE40 FPGA development boards is added in the coming year, the VGA controller will be an optional feature of the template and will act as the standard Nand2Tetris screen. The Verilog and integration with the CPU architecture is completed [on my other repository](https://github.com/conorm110/verilog2tetris) where I recreated the Nand2Tetris architecture with more features in its more true form due to less constraints with the FPGA I chose

