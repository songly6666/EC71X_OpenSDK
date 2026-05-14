# Lierda XiaoDa Application Guide_Rev0.1

[ChangeList](ChangeList.md)

> [!NOTE] Note
> Please remove the enclosure and check the silkscreen model and version on the main board to confirm that your development board version corresponds to the application guide document.

**Xiaoda** is an embedded core module integrating voice recognition, audio playback, and intelligent interaction, specifically designed for smart toys, educational devices, and interactive terminals. This movement incorporates a main control chip, audio system, and power supply module, enabling voice wake-up, conversational interaction, content playback, and other functions.

This application guide will help you get started quickly with **Xiaoda** and provide detailed information about this development board.

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325065.png)

This guide includes the following content:

- [Hardware Version](Xiaoda%20Application%20Guide_Rev0.1.md#Hardware-Version): Introduces hardware version history and known issues.
- [Getting Started](Xiaoda%20Application%20Guide_Rev0.1.md#Getting-Started): Provides a brief introduction to the development board and hardware/software setup guide.
- [Hardware Reference](Xiaoda%20Application%20Guide_Rev0.1.md#Hardware-Reference): Provides detailed information about the development board hardware.
- [Related Resources](Xiaoda%20Application%20Guide_Rev0.1.md#Related-Resources): Lists links to related documents.

---

## Hardware Version

This document only applies to the Xiaoda main board model: L-CT4IT00-YP00W-03A_V04.

| PCB Model               | PCB Version | Change Log |
| ------------------- | ----- | ---- |
| L-CT4IT00-YP00W-03A | V04   | /    |

---

## Getting Started

This section provides a brief introduction to **Xiaoda**, explaining how to flash firmware and related preparation work.

### Component Introduction

| Main Components (TOP)              | Description              |
| :---------------------- | :-------------- |
| L-CT4IT00-YP00W-03A_V04 | Main Board PCB  |
| shell                   | Enclosure       |
| 103040A1                | Battery         |
| JMO-627BA283H-1AXD63    | Microphone      |
| 2831NROOO-4P25D13H      | Speaker         |
| 13P023M                 | Antenna         |

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324925.png)
L-CT4IT00-YP00W-03A_V04 (Main Board PCB)

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324905.png)
shell(Enclosure)

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324857.png)
103040A1 (Battery)

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324851.png)
JMO-627BA283H-1AXD63 (Microphone)

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324847.png)
2831NROOO-4P25D13H (Speaker)

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324854.png)
13P023M (Antenna)

### Main Board Introduction

The main components and interfaces of L-CT4IT00-YP00W-03A_V04 are described below:
![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325070.png)

| Main Components (TOP)     | Description                                              |
| :------------- | :---------------------------------------------- |
| Onboard MIC (Reserved)      | Either this or the microphone connector can be used                                    |
| Speaker Connector         | 1.5mm/2PIN connector socket for connecting 4Ω/3W speaker                     |
| Battery Connector*(1)*     | 1.5mm/3PIN connector socket, compatible with battery 103040A1                    |
| BOOT Test Point        | Used to force entry into download mode when the module is bricked                                 |
| Motor/Servo Connector*(2)*  | 1.25mm/6PIN connector socket, provides 2-channel PWM/power/H-bridge differential output, use as needed         |
| GX8006A        | Offline voice chip with local AEC (Acoustic Echo Cancellation) and custom wake word capability                   |
| CST8302A       | AB/D class amplifier, AB class recommended for better AEC performance                          |
| CL4056D        | Charge management chip, suitable for 4.2V battery, NTC recommended R25=100KΩ    |
| Nor flash      | Nor flash chip, 32Mbit, suitable for 3.3V systems                    |
| TC118S         | H-bridge driver chip                                          |
| USB Connector         | Type-C interface connector for power supply, charging, communication, and download                       |
| Reset Side Button           | Reset, used to reset the module                                    |
| **Main Components (BOT)** | **Description**                                          |
| Antenna Socket           | IPEX-1 generation socket, compatible                                   |
| Extension Button Connector*(3)*   | 1.25mm/6PIN connector socket, provides PWRKEY and 3 custom buttons (2 pins can be multiplexed as UART) |
| NT26F6D0 Module     | Cat.1 module, supports OPEN application development                              |
| FPC Connector*(4)*   | 0.5mm/16PIN FPC connector for connecting binocular screen adapter board                   |
| Microphone Connector         | 1.25mm/2PIN connector socket for connecting electret microphone                     |
| Power Button          | Pwrkey, used for system power on/off                                  |
| RGB LED        | RGB indicator light, indicates module working status                                 |
| Green LED      | Charge complete indicator, stays on when fully charged                                  |
| Red LED        | Charging status indicator, stays on during charging                                  |
| SIM Card Slot         | Nano-SIM card slot connector for SIM card reading                          |

> [!NOTE] Note
> 
> 1. When using the battery connector, ensure the battery terminal wire sequence corresponds to the connector wire sequence
> 2. When using the motor/servo connector, pay attention to the wire sequence; motors and servos are not included in the Xiaoda product package
> 3. When using the extension button connector, pay attention to the wire sequence; the button extension board is not included in the Xiaoda product package
> 4. When using the FPC connector, pay attention to the wire sequence; the binocular screen adapter board is not included in the Xiaoda product package

### Enclosure Interfaces

Key enclosure interfaces are described below:
![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325083.png)
![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325086.png)
![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325089.png)

| Interface (TOP)      | Description                                   |
| :------------ | :----------------------------------- |
| Speaker       | Speaker sound mesh                               |
| Type-C        | Type-C interface, connects PC and Xiaoda for power supply, charging, communication, and download       |
| Charging Indicator         | Indicates charging status: red light during charging, green light when fully charged              |
| RGB Indicator        | Indicates working status                               |
| Reset         | Reset hole, use a SIM eject pin to reset the system                      |
| **Interface (Side)** | **Description**                               |
| MIC           | Microphone pickup hole                               |
| Power Button         | Long press to power on when off, long press to power off when on                  |
| **Interface (BOT)**  | **Description**                               |
| MIC Interface         | Used when connecting an external microphone, pay attention to wire sequence                     |
| Extension Button Interface        | External button extension, IO1/IO2 can be multiplexed as UART, pay attention to wire sequence         |
| Motor/Servo Interface       | External motor/servo, built-in H-bridge driver circuit, M+/M- can connect DC motor, pay attention to wire sequence |

### Start Using

Visually inspect the product appearance for integrity before powering on, ensuring no obvious damage.

#### Required Hardware

- Xiaoda complete unit
- Type-C data cable*
- Computer (Windows, Linux, or macOS)

> [!NOTE] Note
> Some USB data cables only support power supply and charging, and cannot communicate or download. Please ensure the USB data cable you are using can download firmware.

#### Hardware Power On

A USB data cable is required for power supply, communication, and flashing. Connect the PC and Xiaoda with a USB data cable, then long press the power button for more than 3 seconds.

#### Driver Installation

For driver installation, please refer to [Lierda EigenComm Cat.1 bis Module USB Driver Installation Guide](https://alidocs.dingtalk.com/i/nodes/1zknDm0WRaMv5M2wHDj01Xwb8BQEx5rG?corpId=dingecd566d61b3ecc77a39a90f97fcb1e09&doc_type=wiki_doc&utm_medium=search_main&utm_source=search). After installation, you can see the Lierda USB port in Device Manager.

#### Indicator Lights

Xiaoda indicates charging and operating status through the charging indicator and RGB indicator.

**Charging Indicator**

- When USB is not connected, the charging indicator is off
- When USB is connected, the charging indicator shows red, indicating normal charging
- When USB is connected, the charging indicator shows green, indicating fully charged

**RGB Indicator**

- When powered off, the RGB indicator is off
- When powered on, the RGB indicator shows solid green during normal operation
- When powered on, the RGB indicator flashes blue during voice interaction
- When powered on, the RGB indicator shows solid red during abnormal status (e.g., network error)
- When powered on, the RGB indicator flashes green 3 times before shutdown

---

## Hardware Reference

### Functional Block Diagram

The Xiaoda functional block diagram is shown below.
![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325058.png)

### Power Supply Methods

The main board is designed with a power switching circuit and can be powered by the following methods:

1. Powered by **Battery**
   The device has an integrated 3.7V lithium battery. Press the power button for 3 seconds to power on.
2. Powered by **Type-C Port**
   Insert the Type-C USB data cable into the USB interface. The system power will automatically switch to Type-C power supply. Press the power button for 3 seconds to power on.

### Charging Circuit

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325011.png)
CL4056D maximum charging voltage is 4.2V. NTC recommended to use batteries with R<sub>25</sub>=100KΩ, with a designable charging range of 0~45℃. When R<sub>25</sub>=10KΩ, the designable charging range is 0~50℃. As shown in the reference circuit, paired with the 103040A1 battery (R<sub>25</sub>=10KΩ, B<sub>25/50</sub>=3435), the designed charging temperature range is 0.46℃~50.22℃. For specific calculation methods, see the table below: [NTC Calculation Tool](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324834.xlsx)(XLSX)

### USB Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325055.png)
The CC1/CC2 pins of the USB Type-C connector are pulled down to ground through 5.1kΩ resistors by default, configuring the device as a charge-only Sink/Upstream Facing Port (UFP).

### SIM Card Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325063.png)
In addition to the SIM card slot, the main board also reserves a chip SIM card footprint. The two overlap in PCB position, and the chip SIM card is used by default.
The chip SIM card provides 500MB of data per month, valid for one year.

### RF Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325060.png)
The RF interface reserves an IPEX Gen-1 socket with a reserved π-type matching network. If the antenna needs to be replaced, the matching can be adjusted.

### Button Extension Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325051.png)
**Please note that all button extension IOs have special usage:**

1. The basic function of PWRKEY is as a power on/off button. After powering on, the press duration can be adjusted for use as a function button, e.g., short press for conversation, long press for shutdown
2. KEY_FUNC is the only button that can be multiplexed as wakeup, with higher interrupt priority. It can also be multiplexed as AGPIO, maintaining state during module sleep
3. IO1/IO2 are general-purpose IOs with lower interrupt priority, and can be multiplexed as UART for debugging convenience

### Motor/Servo Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325053.png)
The module provides 4 different PWM channels for motor and servo driving, supporting simultaneous connection of 1 DC motor and 2 servos.

### Audio Interface

#### Offline Voice Chip

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325092.png)
The offline voice chip GX8006A communicates with the module via UART and connects RST/BOOT/INT control pins. Users can perform flashing, playback, recording, and other operations on the GX8006A chip through the NT26F6D0 module.

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325093.png)
The GX8006A chip supports local AEC. The AEC reference circuit feeds back from the amplifier output through voltage division and DC blocking to GX8006A's MIC1, performing echo cancellation through AD sampling. If using a Class-D amplifier, the reference path requires multi-stage filtering.

#### Microphone Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325012.png)
The microphone connector inside Xiaoda already has a microphone inserted. If you need to connect another electret microphone externally, please pay attention to the terminal wire sequence. The microphone cannot be driven if the polarity is reversed.

#### Speaker Interface

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325095.png)
The amplifier gain should match the peak-to-peak value of the preceding audio output and the speaker to avoid volume being too low or clipping distortion. Differential input is recommended for audio input to improve audio anti-interference capability. The amplifier is recommended to operate in Class-AB mode to improve AEC reference performance.

### Indicator Light Interface

#### RGB Indicator Light

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325049.png)
The RGB LED communication interface complies with WS2812 timing.

#### Charging Indicator Light

![](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325097.png)
The charging indicator lights up when USB is connected: red light during normal charging, green light when fully charged.

---

## Related Resources

- [SCH-PCB](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325007.zip)(ZIP)
- [BOM](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100325009.xlsx)(XLSX)
- [NTC Calculation Tool](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324981.xlsx)(XLSX)
- [GPIO Multiplexing Table](_images/Xiaoda%20Application%20Guide_Rev0.1/file-20260508100324839.xlsx)(XLSX)

