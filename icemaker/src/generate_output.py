
# Copyright (c) 2022 Conor Mika
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

import os

def main():
    ## Finds .icemaker file (used for storing FOMU_REV value) and runs make file with the FOMU_REV value
    project = ""
    for file in os.listdir("."):
        if file.endswith(".icemaker"):
            project = str(file)
    f = open(project, "r")
    os.system("make " + f.read())

if __name__=="__main__":
    main()