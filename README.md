
# IceMaker

Visual Studio Code extension automating tasks for programming the [FOMU](https://tomu.im/fomu.html) or other iCE40 development boards

## Adding IceMaker to VS Code

1. Download the [latest release](https://github.com/conorm110/IceMaker/releases)

2. Install .vsix file from release in vs code (`CTRL + SHIFT + X` -> three dots above extensions marketplace search -> install from VSIX)

3. A Getting Started WebView should open, if not open command palette and run IceMaker: Run Setup Wizard

## Project Templates

**Hack Computer:** Starting project template contains a verilog implementation of the Hack Computer. The top template file links the HackComputer module to the inputs and outputs of the FOMU. The reset key sets the program counter to zero, RAM at A=0 contains the three bit value for the FOMU’s RGB LED, and RAM at A=1 contains the value of the second key on the FOMU.

**Template (Default):** Project template contains a single top verilog file with a simple clock divider linked to an RGB controller.

**Template (Blank):** Generates an empty project.
  
## Generic iCE40 Boards
This extension utilizes [IceStorm](https://github.com/YosysHQ/icestorm) to generate a bitstream for the project. Configuration files are premade for all FOMU boards in templates/PCF, so FOMU boards are the only currently supported boards. Editing the contents of one of these files to match a generic iCE40 board will allow your project to use the generic board. *Uploading through the extension will not work for most generic boards, support for easily editing pin assignments and adding upload utilities coming soon!*

