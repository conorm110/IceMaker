# Copyright (c) 2022 Conor Mika
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

VERILOG_SYN_FILES = $(shell ls *.v)
DESIGN = top
DESIGN_FILES = bin\top

# Different Fomu hardware revisions are wired differently and thus
# require different configurations for yosys and nextpnr.
# Configuration is performed by setting the environment variable FOMU_REV accordingly.

PCF_PATH   ?= pcf

ifeq ($(FOMU_REV),evt1)
YOSYSFLAGS ?= -D EVT=1 -D EVT1=1 -D HAVE_PMOD=1
PNRFLAGS   ?= --up5k --package sg48
PCF        ?= $(PCF_PATH)/fomu-evt2.pcf
else ifeq ($(FOMU_REV),evt2)
YOSYSFLAGS ?= -D EVT=1 -D EVT2=1 -D HAVE_PMOD=1
PNRFLAGS   ?= --up5k --package sg48
PCF        ?= $(PCF_PATH)/fomu-evt2.pcf
else ifeq ($(FOMU_REV),evt3)
YOSYSFLAGS ?= -D EVT=1 -D EVT3=1 -D HAVE_PMOD=1
PNRFLAGS   ?= --up5k --package sg48
PCF        ?= $(PCF_PATH)/fomu-evt3.pcf
else ifeq ($(FOMU_REV),hacker)
YOSYSFLAGS ?= -D HACKER=1
PNRFLAGS   ?= --up5k --package uwg30
PCF        ?= $(PCF_PATH)/fomu-hacker.pcf
else ifeq ($(FOMU_REV),pvt)
YOSYSFLAGS ?= -D PVT=1
PNRFLAGS   ?= --up5k --package uwg30
PCF        ?= $(PCF_PATH)/fomu-pvt.pcf
else
$(error Unrecognized FOMU_REV value. must be "evt1", "evt2", "evt3", "pvt", or "hacker")
endif

TOP    = $(DESIGN)

YOSYS     ?= yosys
NEXTPNR   ?= nextpnr-ice40
ICEPACK   ?= icepack

SHELL = /bin/bash
.SHELLFLAGS = -o pipefail -c

QUIET = @

# If a container engine is used, each tool is executed in a separated container
ifdef CONTAINER_ENGINE
CONTAINER_ENGINE ?= docker

PWD = $(shell pwd)
CONTAINER_ARGS = run \
	--rm \
	-v /$(PWD)/../../..://wrk \
	-w //wrk/hdl/$(notdir $(shell dirname $(PWD)))/$(notdir $(PWD))

GHDL    = $(CONTAINER_ENGINE) $(CONTAINER_ARGS) gcr.io/hdl-containers/ghdl/yosys ghdl
YOSYS   = $(CONTAINER_ENGINE) $(CONTAINER_ARGS) gcr.io/hdl-containers/ghdl/yosys yosys
NEXTPNR = $(CONTAINER_ENGINE) $(CONTAINER_ARGS) gcr.io/hdl-containers/nextpnr/ice40 nextpnr-ice40
ICEPACK = $(CONTAINER_ENGINE) $(CONTAINER_ARGS) gcr.io/hdl-containers/icestorm icepack

endif

# Add Windows and Unix support
RM         = rm -rf
COPY       = cp -a
PATH_SEP   = /
ifeq ($(OS),Windows_NT)
ifndef MSYSTEM
# When SHELL=sh.exe and this actually exists, make will silently
# switch to using that instead of cmd.exe.  Unfortunately, there's
# no way to tell which environment we're running under without either
# (1) printing out an error message, or (2) finding something that
# works everywhere.
# As a result, we force the shell to be cmd.exe, so it works both
# under cygwin and normal Windows.
SHELL      = cmd.exe
COPY       = copy
RM         = del
PATH_SEP   = \\
endif
endif

all: $(DESIGN_FILES).dfu
	$(QUIET) echo "Built '$(DESIGN)' for Fomu $(FOMU_REV)"

.DEFAULT: all

# Use *Yosys* to generate the synthesized netlist.
# This is called the **synthesis** and **tech mapping** step.
$(DESIGN_FILES).json: $(VERILOG_SYN_FILES)
	$(QUIET) $(YOSYS) $(YOSYSFLAGS) \
		-p \
		"read_verilog $(VERILOG_SYN_FILES); \
		synth_ice40 \
		-top $(TOP) \
		-json $@" 2>&1 | tee bin/yosys-report.txt

COPY ?= cp -a

# Use **nextpnr** to generate the FPGA configuration.
# This is called the **place** and **route** step.
$(DESIGN_FILES).asc: $(DESIGN_FILES).json $(PCF)
	$(QUIET) $(NEXTPNR) \
		$(PNRFLAGS) \
		--pcf $(PCF) \
		--json $(DESIGN_FILES).json \
		--asc $@

# Use icepack to convert the FPGA configuration into a "bitstream" loadable onto the FPGA.
# This is called the bitstream generation step.
$(DESIGN_FILES).bit: $(DESIGN_FILES).asc
	$(QUIET) $(ICEPACK) $< $@

# Use dfu-suffix to generate the DFU image from the FPGA bitstream.
$(DESIGN_FILES).dfu: $(DESIGN_FILES).bit
	$(QUIET) $(COPY) $< $@
	$(QUIET) dfu-suffix -v 1209 -p 70b1 -a $@

# Use df-util to load the DFU image onto the Fomu.
load: $(DESIGN_FILES).dfu
	dfu-util -D $<


run: $(DESIGN_FILES).bin
	fomu-flash -f $<

.PHONY: load

clean:
	rm -fr *.json *-report.txt *.asc *.bit *.dfu
