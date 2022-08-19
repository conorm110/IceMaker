
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
import easygui
import os

def main():
    msg = "Setup Project"
    title = "IceMaker Project Setup Wizard"
    fieldNames = ["Top Module Name: ", "FOMU Rev: "]
    fieldValues = []
    fieldValues = easygui.multenterbox(msg,title, fieldNames)
    err = False
    for i in range(len(fieldNames)):
        if fieldValues[i].strip() == "":
            err = True
    
    with open(fieldValues[0] + ".icemaker", 'w') as f:
        f.write("FOMU_REV=" + fieldValues[1] + "\n")

    if err:
        easygui.msgbox("One or more values were invalid. IceMaker project creation failed.", title="IceMaker Error Message")
        return

    try:
        shutil.copytree(sys.argv[1] + "\\template", ".", dirs_exist_ok=True)
    except Exception as e:
        easygui.msgbox("An error occured while setting up your IceMaker project:\n" + str(e), title="IceMaker Error Message")
        return

    with open("Makefile", "r+") as f:
        old = f.read() # read everything in the file
        f.seek(0) # rewind
        f.write(old.replace("DESIGN = top", "DESIGN = " + fieldValues[0]).replace("DESIGN_FILES = bin\\top", "DESIGN_FILES = bin\\" + fieldValues[0])) # write the new line before
    
    with open("template.v", "r+") as f:
        old = f.read() # read everything in the file
        f.seek(0) # rewind
        f.write(old.replace("module top", "module " + fieldValues[0])) # write the new line before

    try:
        os.mkdir("bin")
    except:
        a=0
    os.rename("template.v", fieldValues[0] + ".v")



if __name__=="__main__":
    main()