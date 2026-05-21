# USB Driver Installation Guide_Rev1.0

{link_to_translation}`zh_CN:[Chinese]`

## 1 Revision History

| Version | Date | Author | Reviewer | Revision Content |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | Document created |

## 2 Introduction

This document is intended to help users of Lierda LTE-EC71x series modules quickly complete USB driver installation and become familiar with all functions supported by the USB port of LTE-EC71x series modules.

## 3 USB Driver Installation Steps

[Download Installer](_tools/lierdaCat1usbSetup_V3.4.3.exe)

### 3.1 Enumerated Ports on Windows

<div align="center">

<img src="_images/USB驱动安装指导/image_1.png" width="600"/>

</div>

<div align="center">

<img src="_images/USB驱动安装指导/image_2.png" width="600"/>

</div>

As shown above, the USB driver loads four functional ports: AT, Diag, OPAQ, and ECM (or RNDIS).

`Lierda At Port`: Used for sending AT commands and communicating with the module (MI_03)

`Lierda Diag Port`: Used with the EPAT tool to capture module runtime logs (MI_02)

`Lierda OPAQ Port`: A general serial port enumerated by the module, used for serial data transmission and reception (MI_04)

`Mobile ECM Network Adapter`: ECM network adapter for ECM internet access. On Windows, internet access is not supported without the driver (MI_00)

`Remote NDIS Based Internet Sharing Device`: RNDIS network adapter for RNDIS internet access. The driver is built into Windows and does not require manual installation (MI_00)

**Note:** Only one of RNDIS or ECM can be active for internet access at a time. MI numbers are fixed and correspond to the `bInterfaceProtocol` field.

### 3.2 Double-click to Run lierdaCat1usbSetup_V3.4.3.exe Installer (Run as Administrator)

<div align="center">

<img src="_images/USB驱动安装指导/image_3.png" width="600"/>

</div>

<div align="center">

<img src="_images/USB驱动安装指导/image_4.png" width="600"/>

</div>

### 3.3 Click Install to Proceed

<div align="center">

<img src="_images/USB驱动安装指导/image_5.png" width="600"/>

</div>

### 3.4 Installation Complete

<div align="center">

<img src="_images/USB驱动安装指导/image_6.png" width="600"/>

</div>

## 4 Driver Installation on Linux

The LTE-EC71X series modules use the `usb_serial.ko` driver on Linux. The **CONFIG_USB_SERIAL** kernel configuration option must be enabled.

**Required kernel options:**

```
USB_SERIAL=y
USB_SERIAL_WWAN=y
USB_SERIAL_OPTION=y
```

### 4.1 Modifying the option.c File

**Adding PID and VID to the Table**

**Method 1:** The USB serial driver matches inserted USB devices through the `option_ids[]` array. The VID and PID for LTE-EC71X series modules are 3505/0003. Add them to the table as shown:

<div align="center">

<img src="_images/USB驱动安装指导/image_7.png" width="600"/>

</div>

**Method 2:** Alternatively, you can add the PID and VID via command line:

```shell
Linux#> sudo /sbin/modprobe option
Linux#> sudo chmod 666 /sys/bus/usb-serial/drivers/option1/new_id
Linux#> echo 3505 0003 > /sys/bus/usb-serial/drivers/option1/new_id
```

**Filtering Network Adapter Type Driver Enumeration**

Add code to filter network adapter enumeration devices in the `option_probe` function of `drivers/usb/serial/option.c`:

<div align="center">

<img src="_images/USB驱动安装指导/image_8.png" width="600"/>

</div>

### 4.2 Enumerated Ports on Linux

<div align="center">

<img src="_images/USB驱动安装指导/image_9.png" width="600"/>

</div>

- **ttyUSB0:** Corresponds to Lierda Diag Port on Windows, the log port.
- **ttyUSB1:** Corresponds to Lierda At Port on Windows, for sending AT commands.
- **ttyUSB2:** Under OpenSDK, corresponds to Lierda OPAQ Port on Windows. Under standard firmware, corresponds to Lierda USB Modem on Windows (PPP dial-up interface).
- ECM and RNDIS are directly loaded to eth0.

**Note:** Only one of RNDIS or ECM can be active for internet access at a time. MI numbers are fixed and correspond to the `bInterfaceProtocol` field.
You can use the command: `sudo dmesg | grep -i usb` to check.

## 5 FAQ

### 5.1 If Driver Installation Fails on Windows, Disable Memory Integrity

1. Press Windows + R to open the "Run" dialog, execute `windowsdefender:` (with the colon) to open "Windows Security Center".
2. Navigate to "Device Security" > "Core Isolation Details".
3. Based on your actual usage scenario, toggle the "Memory Integrity" switch on or off.
4. Restart the computer for the configuration to take effect.

<div align="center">

<img src="_images/USB驱动安装指导/image_10.png" width="600"/>

</div>
