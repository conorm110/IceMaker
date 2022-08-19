# IceMaker 

Visual Studio Code extension automating tasks for programming [FOMU](https://tomu.im/fomu.html) in verilog


## Requirements
Since IceMaker is just a tweaked version of the compilation code in the FOMU Workshop, it has the same requirements. You can find how to install these [here](https://workshop.fomu.im/en/latest/requirements/index.html).

If you dont want to install everything or you already had IceStorm set up just check to make sure you can run these:
- yosys
- nextpnr-ice40
- icepack
- dfu-util
- tee
  - To get this and other unix commands on windows, [unxutils](https://sourceforge.net/projects/unxutils/files/unxutils/current/) works really great but I'm sure there are other better fixes. Looks a bit sketch but I don't have any viruses right now
- make
  - To get make on windows, go to powershell, then type the following to install chocolatey
  
    ``` 
    Set-ExecutionPolicy AllSigned

    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) 
    ```
    then run CMD as admin and run
    ```
    choco install make
    ```

## Creating and Uploading Projects with IceMaker
**0. Installing the Extension**
- Download latest release
- In VS Code, press `CTRL + SHIFT + X` to open extensions menu
- Above the extensions marketplace search, click the 3 dots, install from VSIX, then select the VSIX in the release
- NOTE: The extension will not be published until its out of pre-release, until then you will need to install this way

**1. Setting Up a New Project**
 - Create and open a new directory in VS Code
 - Open command palette
 - Run `IceMaker: Set Up New Project in Current Directory`
 - Follow the setup prompts in the wizard
  
**2. Create a Verilog Design**
- The project automatically creates a verilog file with the name of your top module
- The automatically generated verilog design is an example blink program

**3. Synthesize, PNR, and Generating Bitstream**
- Open command palette
- Run `IceMaker: Synthesize, PNR, and Gererate Bitstream`
  
**4. Upload Project to FOMU**
- Open command palette
- Run `IceMaker: Upload Project to FOMU`