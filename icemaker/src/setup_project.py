
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
from tkinter import *
import os
import platform

def focus1(event):
    module_name_field.focus_set()

def focus2(event):
    fomu_rev_field.focus_set()

def insert():
    if (module_name_field.get() == "" and
        fomu_rev_field.get() == ""):
        print("empty input")
    else:
        a = module_name_field.get()
        b = fomu_rev_field.get()
        root.destroy()
        create_proj(a, b)
        try:
            module_name_field.focus_set()
        except:
            exit()
        module_name_field.delete(0, END)
        fomu_rev_field.delete(0, END)
        
        return

def create_proj(mod_name, fomu_rev):
    fieldValues = [mod_name,fomu_rev]
    with open(fieldValues[0] + ".icemaker", 'w') as f:
        f.write("FOMU_REV=" + fieldValues[1] + "\n")
    try:
        shutil.copytree(sys.argv[1] + "/template", ".", dirs_exist_ok=True)
    except Exception as e:
        print("An error occured while setting up your IceMaker project:\n" + str(e))
        return
    with open("Makefile", "r+") as f:
        old = f.read() # read everything in the file
        f.seek(0) # rewind
        f.write(old.replace("DESIGN = top", "DESIGN = " + fieldValues[0]).replace("DESIGN_FILES = bin/top", "DESIGN_FILES = bin/" + fieldValues[0])) # write the new line before
    with open("template.v", "r+") as f:
        old = f.read() # read everything in the file
        f.seek(0) # rewind
        f.write(old.replace("module top", "module " + fieldValues[0])) # write the new line before
    try:
        os.mkdir("bin")
    except:
        a=0
    os.rename("template.v", fieldValues[0] + ".v")

root = Tk()
root.configure(background='white')
root.title("IceMake New Project Setup Wizard")
root.geometry("370x90")
heading = Label(root, text="Project Setup Wizard", bg="white")
module_name_label = Label(root, text="Top Module Name", bg="white")
fomu_rev_label = Label(root, text="FOMU Rev", bg="white")
heading.grid(row=0, column=1)
module_name_label.grid(row=1, column=0)
fomu_rev_label.grid(row=2, column=0)
module_name_field = Entry(root)
fomu_rev_field = Entry(root)
module_name_field.bind("<Return>", focus1)
fomu_rev_field.bind("<Return>", focus2)
module_name_field.grid(row=1, column=1, columnspan=2, ipadx="70")
fomu_rev_field.grid(row=2, column=1, columnspan=2, ipadx="70")
submit = Button(root, text="Submit", fg="White", bg="Black", command=insert)
submit.grid(row=8, column=1)

def main():
    try:
        root.mainloop()
    except:
        a = "i need to find out how tkinter works"

    



if __name__=="__main__":
    main()