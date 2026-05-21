# System Resource Development Guide_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Revision History

| Version | Date | Author | Reviewer | Revision Content |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | Document created |

## 1 Introduction

This document provides statistics on system functions and resource usage for Lierda EC71X series Cat.1 module OpenCPU development, giving developers guidance for planning their own OPEN SDK project development.

## 2 Chip Resource Description

Lierda Cat.1 modules adopt the ECSOCchip architecture, paired with different peripherals for different application scenarios to save cost and resources.

| Base Package Model | F6B_A | F6D_A | F7B_A | K2B_A | K2F_A |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Supported Module Models | NT26FCNB60WNA, NT26F6B0 | NT26FCND60NNA, NT26FEUD60NNA, NT26F6D0 | NT26FCNB70WNA | NT26K2B1 | NT26KCNF20NNA |
| Chip Model | EC718pm | | | EC716e | |
| CPU | 32-bit Arm Cortex-M3@306MHz | | | 32-bit Arm Cortex-M3@204MHz | |
| OS | FreeRTOS CMSIS-OS2 | | | | |
| Total FLASH | 4 MB | | | 4 MB | |
| Available FLASH | 812 KB | 812 KB | 452 KB | 844 KB | 844 KB |
| Total RAM | 4 MB | | | 1 MB | |
| Available RAM | 1 MB | 1 MB | 1 MB | 512 KB | 512 KB |
| File System | 780KB | 780KB | 168KB | 840KB | 840KB |
| External FLASH | Supported | | | | |
| External RAM | Not supported | | | | |
| PSRAM | Supported | | | Not supported | |
| Communication | Supports 3GPP Rel.13/14 Cat.1 radio communication interface and protocol | | | | |
| Shutdown Power | ≤ 1uA | | | | |
| Data Transfer | LTE-FDD: Max downlink 10 Mbps, max uplink 5 Mbps. LTE-TDD: Max downlink 8.96 Mbps, max uplink 3.1 Mbps. | | | | |
| USIM | Dual SIM single standby, ClassB (3.0V) and ClassC (1.8V) | | | | |
| UART Count | 4 | | | 3 | |
| UART Notes | UART 0 defaults to system LOG output. Only UART1 supports hardware flow control and low-power UART. | | | | |
| GPIO | 39 | | | 21 | |

| GPIO Notes | 9 AGPIOs, independent AION power domain, available during sleep. Refresh rate 200 us. Voltage level adjustable from 1.65V to 3.30V, default 1.8V. Interrupt trigger modes: low level, high level, rising edge, falling edge. Some IOs support internal pull-up/pull-down. | | | | |
| PWM | 6 | | | | |
| PWM Notes | Supports forward PWM and reverse PWM adjustment. Maximum 26MHz clock division. | | | | |
| I2C | 2 | | | 2 | |
| I2C Notes | Supports master and slave modes, speed 100 KHz - 1MHz. | | | | |
| SPI | 2 | | | 1 | |
| SPI Notes | Supports master and slave modes, maximum speed 25.6MHz | | | | |
| USP | 3 | | | 1 | |
| USP Notes | Types: 3 (I2S/CSPI/LSPI), can be used for external audio, camera, display. Mode: supports master and slave modes. Supports 8~96k, 16 or 24 bit, 8~48k, 32 bit. Supports standard I2S/LJ/RJ mode, PCM mode A/B. I2S/PCM supports TXRX/TX/RX. CSPI supports slave reception. USP0/USP1 have hardware acceleration at the lower level. Added support for QSPI and 8080 interface (only supported by 718(P_M/P_VM) series modules) | | | | |
| USB | 1 | | | | |
| USB Notes | High-speed USB Device 2.0, supports 480Mbps (HS), 12Mbps (FS) data transfer. USB VBus function can be masked. Supports USB suspend and remote wakeup | | | | |
| ADC | 4 | | | 2 | |
| ADC Notes | Analog channels: 4, input range: 0V ~ 3.4V. Temperature sensor: 1, input range: -40°C ~ 85°C. VBAT voltage: 1, input range: 2.7V ~ 4.5V. Precision: 12-bit AUXADC. | | | | |
| Hardware Timer | 6 | | | | |
| Timer Notes | Does not have wake-up capability, only effective when system is active | | | | |
| Low-Power Timer | 10 (2 for internal use) | | | | |
| Low-Power Timer Notes | TIMER_ID0–TIMER_ID1: AON timers, max timeout 2.5 hours. TIMER_ID2–TIMER_ID6: Flash timers, max timeout 740 hours. TIMER_ID7–TIMER_ID9: Reserved for internal use only. Starting or deleting Flash timers triggers Flash write operations, so frequent use should be avoided. | | | | |
| Wakeup | Supports 6 low-power external interrupt wake-up sources | | | | |
| CAN | 1 | | | Not supported | |

## 3 IO Power Supply Description

| Power Supply | Description |
| ---- | ---- |
| VBAT | Power supply input, recommended 3.8V/1.2A power supply. Vmax=4.5V, Vmin=3.3V, Vnorm=3.8V |
| VDD_EXT | Default 1.8V. In sleep mode, VDD_EXT power-off version, drive capability 120mA; in sleep mode, VDD_EXT power-on version, drive capability 3mA. VILmax=0.2×VDD_EXT, VIHmin=0.7×VDD_EXT, VOLmax=0.15×VDD_EXT, VOHmin=0.8×VDD_EXT |
| VO_LDOIO | VOLmax=0.2×VO_LDOIO, VOHmin=0.7×VO_LDOIO, VILmax=0.15×VO_LDOIO, VIHmin=0.8×VO_LDOIO |
| VDD18AON | VILmax=0.2×VDD18AON, VIHmin=0.7×VDD18AON, VOLmax=0.15×VDD18AON, VOHmin=0.8×VDD18AON |
| LDO_AONIO | VILmax=0.2×LDO_AONIO, VIHmin=0.7×LDO_AONIO, VOLmax=0.15×LDO_AONIO, VOHmin=0.8×LDO_AONIO |
| VO_LDOSIM | Vnorm=1.8/3.0V, VOLmax=0.15×VO_LDOSIM, VOHmin=0.8×VO_LDOSIM, VILmax=0.2×VO_LDOSIM, VIHmin=0.7×VO_LDOSIM |

## 4 Function Module Memory Usage

The following data is based on the F6B_A base package (NT26FCNB60WNA), showing the independent resource usage of each function module (incremental values based on an empty project):

| Function Module | FLASH Usage | RAM Usage |
| ---- | ---- | ---- |
| Empty Project (APP) | 24,316 B (FLASH usage: 2.92%) | 492 B (RAM usage: 0.05%) |
| GPIO | 1,764 B | 192 B |
| ADC | 392 B | 0 B |
| UART | 992 B | 200 B |
| I2C | 808 B | 0 B |
| SPI | 648 B | 260 B |
| RTC | 3,548 B | 120 B |
| SIM | 1,984 B | 0 B |
| File System | 5,968 B | 0 B |
| Flash | 800 B | 0 B |
| USB | 424 B | 0 B |
| Socket | 5,048 B | 36 B |
| SSL | 9,552 B | 44 B |
| HTTP_FOTA | 132,292 B | 476 B |
| Sound | 104,120 B | 100,612 B |
| PWMAUD | 100,588 B | 100,316 B |
| Camera | 125,800 B | 20,536 B |
| WS2812B | 1,380 B | 192 B |
| VoLTE Call | 2,648 B | 12 B |
| MOTOR | 624 B | 0 B |
| TTS | 227,088 B | 408 B |

**Note:**

Independent FLASH/RAM = resource usage of the function's API code itself (incremental relative to the empty project's 24,316 B FLASH / 492 B RAM).

TTS functionality requires both `EXDEMO_TTS_EN=y` and `BUILD_COMP_TTS_EN=y` to be configured.

## 5 FLASH Memory Usage Description

Flash size is 4MB. The partition sizes that users can operate on are limited to app and lfs. The base pack space varies in size depending on the base package model. Contact R&D for customization if larger app space is needed.

The app space is the code space reserved by the SDK for customers. The total size of app space and lfs space remains constant. The app space and lfs space are inversely proportional — expanding app space means allocating part of the lfs space to app, and vice versa.

When adjusting lfs, ensure that the available lfs space can fully accommodate the app's bin file, otherwise full OTA upgrades will be unavailable.

```text
+-------------------------------+
|        header1 4KB            | ← Boot check information
+-------------------------------+
|    header2 4+4KB              | ← Boot check information
|       [Secboot Head]          |
+-------------------------------+
|        bootloader             | ← Bootloader partition
+-------------------------------+
|  factory back (4+16KB)        | ← Factory backup partition, stores IMEI/SN and RF calibration backup
|       [Secboot Head]          |
+-------------------------------+
|        base pack              | ← Base pack space, provides API and functions (adjustable by base pack)
|       [Secboot Head]          |
+-------------------------------+
|      hib backup 96KB          | ← Hibernation backup space, saves variables during sleep
+-------------------------------+
|          app                  | ← User code space, adjustable (SDK adjustable)
|       [Secboot Head]          |
+-------------------------------+
|          lfs                  | ← User file system space, adjustable (SDK adjustable)
+-------------------------------+
|      fotaRsvd 48KB            | ← Temporary storage for FOTA data
+-------------------------------+
|      factory 4+48KB           | ← Factory partition, stores IMEI/SN and RF calibration
+-------------------------------+
|      plat config 8KB          | ← Stores system default parameters
+-------------------------------+
```

## 6 Low Power Resource Usage Description

The module's internal power consumption control is divided into two parts:

- **PMU Power Mode**: Manages the system power consumption of the module itself.
- **Modem Power Mode**: Compliant with 3GPP standards, used for RF and baseband power management. Can be simply understood as registered vs. unregistered network states.

**Note:** Module power consumption requires confirming both PMU mode and Modem mode — the combination of both determines the module's power consumption in different states.

| Power Mode | | LIOT_SLEEP_MODE_NORMAL | LIOT_SLEEP_MODE_LOW | LIOT_SLEEP_MODE_DEEP_LOW |
| ---- | ---- | ---- | ---- | ---- |
| Description | | Normal operating mode, milliamp-level power consumption, suitable for scenarios with low power requirements | Microamp-level power consumption, fast wake-up, suitable for high-frequency sleep/wake scenarios | Lower power mode, suitable for long-term sleep while maintaining necessary network connections |
| CPU Frequency | | Normal | Reduced | Sleep |
| RAM State | | Retained | Retained | Power off |
| Peripherals | Normal GPIO | Available | Unavailable | Unavailable |
| | AON GPIO | Available | Available | Available |
| | APWM | Available | Available | Available |
| | Peripheral State (I2C/SPI/I2S/PWM/ADC/UART/CAN) | Available | Unavailable | Unavailable |
| | VDD_EXT | Output maintained | Some models support output | Some models support output |
| Wake-up Method | wakeup/pwrkey | Available | Available | Available |
| | Software Timer | Supported | Supported | Not supported |
| | Low-Power Timer | Supported | Supported | Supported |
| | Low-Power UART | Supported | Supported | Supported |
| | Data, SMS | Supported | Supported | Supported |
| Data Communication | Application Protocol | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/TCP/TCP(S)/UDP(S) | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/TCP/TCP(S)/UDP(S) | TCP/UDP |
| | Downlink Paging | Supported | Supported | Supported |

Approximate current ranges for different power modes:

| Power Mode | Non-pageable Current |
| ---- | ---- |
| LIOT_SLEEP_MODE_NORMAL | ~4mA |
| LIOT_SLEEP_MODE_LOW | ~60uA |
| LIOT_SLEEP_MODE_DEEP_LOW | ~9.5uA |

## 7 Operating System Resource Description

The SDK uses the FreeRTOS real-time operating system with the ARM CMSIS OS2 standard interface as the adaptation layer, using APIs wrapped by CMSIS OS2. FreeRTOS is a real-time preemptive kernel — higher priority tasks are scheduled in real-time, while tasks of the same priority use time-slice round-robin scheduling with a granularity of 1ms.

For basic OS features such as mutexes, semaphores, queues, and CMSIS-OS2 standard API interfaces, detailed documentation is available on the official website.

| Item | Description |
| ---- | ---- |
| Version | CMSIS-OS2 V2.1.1 |
| Ticks | ~1ms |
| Watch Dog | AON-WDG: Default timeout 16S, remains running during deep sleep. NORMAL-WDG: Default timeout 20S, only runs when system is active. |
| Soft Timer | OS timer mechanism provided by FreeRTOS, granularity is 1 systick, currently 1ms. Timer processing task priority is 40, relatively high — SDK user tasks must not exceed this priority. |
| Memory Management | SDK supports Heap4 and TLSF algorithms, SDK defaults to TLSF algorithm |
| Max Thread Count | No specific limit, determined by total system RAM consumption |
| Max Timer Count | No specific limit, determined by total system RAM consumption |
| Max Queue Count | No specific limit, determined by total system RAM consumption |
| Max Semaphore Count | No specific limit, determined by total system RAM consumption |
| Max Malloc Bytes | 512KB |

## 8 Network Registration Usage Description

## 9 File System Interface Resource Usage Description

| Item | Description |
| ---- | ---- |
| Minimum Data Storage Block | 4KB |
| Available Space | Default 780KB, user adjustable |
| Small File Inline Threshold | 512 bytes. File ≤512B = inline storage; >512B = skip list storage |
| Metadata Pair Size | 2 blocks = 8KB |
| Superblock Usage | Block 0 + Block 1 (total 8KB) |
| Path Length Limit | 255 bytes, path like `/a/b/c/d/.../file`, safe depth < 10 |
| Max Directory Name Length | 255 bytes |
| File Name Length | 255 bytes |
| File Count | No specific limit, affected by FLASH size |
| File Content Length | No specific limit, affected by FLASH size |
| Power-off Retention | Supported |
| Directory Storage Rule | 1 directory = 1 metadata pair (8KB), when directory is full it automatically chains to the next metadata pair via TAIL |
| File Storage Rule (Small Files) | Small files (≤512 bytes): stored directly in the parent directory's metadata pair, no independent data block used. Fastest read/write, no fragmentation, absolutely power-off safe. |
| File Storage Rule (Large Files) | Large files (>512 bytes): must use CTZ reverse skip list, minimum 1 data block (4KB) |

**Note:** Please reserve a minimum file system space of 32KB for saving basic system configuration information.

**Write / Update Rules:**

- Write ≤512B: modify directory metadata directly → dual-block atomic commit → done
- Write >512B: allocate new 4KB block → write data → update skip list → atomic commit
- Modify file: never overwrite old block → COW write new 4KB block → switch pointer → reclaim old block
- Delete: mark as deleted → delayed space reclamation (wear leveling)

**Wear Leveling Rules:**

- All 4KB blocks enter a unified global block pool
- Blocks with the lowest erase count are used first
- Bad blocks are automatically marked and skipped
- No defragmentation needed, naturally anti-fragmentation

## 10 TTS Resources

In addition to the independent API resource usage, TTS also has audio resource packages. Resource sizes vary depending on different languages and sample rates.

TTS resources are stored in an independent area carved out from the code Flash space. TTS resource size is aligned to 4K.

```shell
lierda@Ubuntu:~/LSDK/components/tts$ ll
total 2340
drwxrwxr-x  2 root root   4096 Apr 17 08:40 ./
drwxrwxr-x 10 root root   4096 Apr  8 11:37 ../
-rw-rw-r--  1 root root    781 Apr  8 11:43 Makefile
-rw-rw-r--  1 root root 604068 Apr 17 08:40 ttsRes_16k_en.bin
-rw-rw-r--  1 root root 617142 Apr 17 08:40 ttsRes_16k_zh.bin
-rw-rw-r--  1 root root 617470 Apr 17 08:40 ttsRes_8k_en.bin
-rw-rw-r--  1 root root 539640 Apr 17 08:40 ttsRes_8k_zh.bin
```

TTS resources are located between the code space and file system space:

```plaintext
┌─────────┬───────┬───────┐
│ code flash    │ tts res      │   little fs   │
└─────────┴───────┴───────┘
```
