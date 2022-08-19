
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
    ## Gets the name of the top design module from the name of the .icemaker file (used for storing value of FOMU_REV)
    ## and uses that to upload the .dfu file with the correct name
    project = ""
    for file in os.listdir("."):
        if file.endswith(".icemaker"):
            top_module = str(file).replace(".icemaker","")
    os.system("dfu-util -D bin/" + top_module + ".dfu")

if __name__=="__main__":
    main()