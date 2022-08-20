
# Copyright (c) 2022 Conor Mika
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

import shutil
import sys
import os
import subprocess
import pkg_resources
import platform


def full_dep_check():
    if platform.system() == "Windows":
        required = {'tk'}
        installed = {pkg.key for pkg in pkg_resources.working_set}
        missing = required - installed
        if missing:
            python = sys.executable
            print("tkinter not installed. getting tkinter...")
            subprocess.check_call([python, '-m', 'pip', 'install', *missing], stdout=subprocess.DEVNULL)
    else:
        try:
            import tkinter
        except:
            print("tkinter is not installed. In a new terminal run sudo apt-get install python3-tk, then press enter once done...")
            input()
            full_dep_check()
    

    reqs = ['python', 'tkinter', 'make', 'tee', 'yosys', 'nextpnr-ice40', 'icepack']
    reqs_installed = [True, True, False, False, False, False, False]
    if shutil.which("make") != None:
        print("make found!")
        reqs_installed[2] = True
    else:
        print("make not found")
    if shutil.which("tee") != None:
        print("tee found!")
        reqs_installed[3] = True
    else:
        print("tee not found")
    if shutil.which("yosys") != None:
        print("yosys found!")
        reqs_installed[4] = True
    else:
        print("yosys not found")
    if shutil.which("nextpnr-ice40") != None:
        print("nextpnr-ice40 found!")
        reqs_installed[5] = True
    else:
        print("nextpnr-ice40 not found")
    if shutil.which("icepack") != None:
        print("icepack found!")
        reqs_installed[6] = True
    else:
        print("icepack not found")
    installed_message = str(reqs_installed.count(True)) + '/7 dependencies found\n'
    if (reqs_installed.count(True) == 7):
        installed_message += 'IceMaker Configuration Finished!'
        print(installed_message,)
    else:
        installed_message += "Missing dependencies:\n"
        for req in reqs: 
            installed_message += "    " + req + "... " + str(reqs_installed[reqs.index(req)]) + "\n"
        installed_message += "\n\nWould you like to install these now?"
        if print(installed_message):
            print("Installing dependencies...")
            if (reqs_installed[2] != True): # make
                if platform.system() == "Windows":
                    print("Install Make for Windows\nTo install make...\n 1. Run powershell as admin\n 2. Run \"Set-ExecutionPolicy AllSigned\"\n 3. Run \"Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) \"\n 4. Close powershell and open CMD as admin\n 5. Run \"choco install make\"\n\n Continue once make installation completed...")
                else:
                    print("Install Make\nTo install make for MacOS:\n 1. Open the terminal\n 2. In the terminal run \"xcode-select --install\"\n 3. Follow the prompts\n\n To install for Debian based OSes:\n 1. Open terminal\n 2. In terminal run \"sudo apt-get install -y make\"\n\nIf you are running Windows, your OS is not being recognized.\n\nContinue once make installation completed...")
            if (reqs_installed[3] != True): # tee
                if platform.system() == "Windows":
                    print("Install UnxUtils (contains tee) for Windows\n 1. Download https://sourceforge.net/projects/unxutils/files/unxutils/current/ \n 2. Extract the ZIP somewhere it can stay\n 3. Add [PATH TO UNXUTILS]\\UnxUtils\\usr\\local\\wbin to path in Enviornmental Variables\n\nContinue once unxutils installation completed...")
                else:
                    print("You must be running Windows, MacOS, or Linux. If you are seeing this and you are running one of those OSes, check to see if you can run the tee command. If you can't, there may be something wrong with your system. If you can run tee please add an issue to the github repo!\n\nConfiguration Failed!")
            if (reqs_installed[4] != True or reqs_installed[5] != True or reqs_installed[6] != True): # fomu-toolchain    
                print("Install FOMU Toolchain\n FOMU Toolchain: https://github.com/im-tomu/fomu-toolchain \n\nFROM FOMU TOOLCHAIN README.MD:\nDownload the latest release for your platform and extract it somewhere on your disk. Then set your PATH:\n    Shell (GNU/Linux, Cygwin/MSYS2, MacOS...): export PATH=[path-to-bin]:$PATH\n    Powershell (Windows): $ENV:PATH = \"[path-to-bin];\" + $ENV:PATH\n    cmd.exe (Windows): PATH=[path-to-bin];%PATH%\n\nOnce installation of FOMU Toolchain is complete, continue...")
            print("Configuration Wizard Finished!\n\nTo verify file integrity, restart VS Code and run the configuration wizard again to check for dependencies!")
        else:
            print("WARNING: IceMaker will not work until all dependencies are installed!\n\n\nConfiguration Wizard Finished!")

def main():
    ## Read config.txt and strip everything outside of data
    with open(sys.argv[1] + '/src/config.txt') as f:
        lines = f.readlines()
    start_index = 0
    end_index = 0
    for line in lines:
        if "START" in line: start_index = lines.index(line)
        if "END" in line: end_index = lines.index(line)
    lines = lines[start_index+1:end_index]
    if "start=init" in lines[0]:
        full_dep_check()
    elif "dependencies_installed=true" in lines[1]: 
        print("IceMaker is already configured for your computer. Would you like to run the configuration wizard anyways? yes/no")
        if input() == "yes":
            full_dep_check()
    else:
        full_dep_check()


if __name__=="__main__":
    main()