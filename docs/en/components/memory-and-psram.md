# Memory and PSRAM Description_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## 1 Revision History

| Version | Date | Author | Reviewer | Revision Content |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | Document created |

## 2 Introduction

This document provides statistics on FLASH and RAM resource usage for different base packages and function modules in Lierda EC71X series Cat.1 module OpenCPU development, serving as a reference for developers to select appropriate modules and configure features.

**Disclaimer:** The data in this document is based on actual compilation statistics. Actual usage may vary slightly due to factors such as SDK version and compiler version. It is recommended to reserve 10-20% margin during design.

## 3 Data Source Description

The data in this document is obtained through actual compilation statistics, not library file estimation:

- **Compilation method**: Each function module is compiled independently, and memory data is extracted from linker output
- **Compilation command**: `build.bat all MODEMPKG=xxx PROJECT=demo EXDEMO_xxx_EN=y`
- **Data extraction**: Read directly from the `Memory region` section of compilation output
- **Accuracy**: Reflects actual usage after linking, including all dependent code

**Note:** Library file (`.a`) size ≠ actual usage size. Library files contain symbol tables, relocation information, etc. After actual linking, the linker performs dead code elimination, inline optimization, etc. Therefore, actual compilation statistics is the most reliable method.

## 4 Base Package Types and Resources

| Base Package Model | FLASH Capacity | RAM Capacity | Supported Module Models |
| ---- | ---- | ---- | ---- |
| F6B_A | 812 KB | 1 MB | NT26FCNB60WNA, NT26F6B0 |
| F6D_A | 812 KB | 1 MB | NT26FCND60NNA, NT26FEUD60NNA, NT26F6D0 |
| F7B_A | 452 KB | 1 MB | NT26FCNB70WNA |
| K2B_A | 844 KB | 512 KB | NT26K2B1 |
| K2F_A | 844 KB | 512 KB | NT26KCNF20NNA |

## 5 Empty Project Memory Usage (PROJECT=app)

| Base Package Model | FLASH Usage | RAM Usage | FLASH Utilization | RAM Utilization |
| ---- | ---- | ---- | ---- | ---- |
| F6B_A | 24,316 B | 492 B | 2.92% | 0.05% |
| F6D_A | 24,316 B | 492 B | 2.92% | 0.05% |
| F7B_A | 24,340 B | 492 B | 5.26% | 0.05% |
| K2B_A | 24,308 B | 492 B | 2.81% | 1.50% |
| K2F_A | 24,308 B | 492 B | 2.81% | 1.50% |

## 6 Individual Function Module Memory Usage (F6B_A Base Package)

The following data is based on the F6B_A base package (NT26FCNB60WNA), showing the independent resource usage of each function module (incremental values based on an empty project):

| Function Module | Configuration Parameter | FLASH Usage | RAM Usage |
| ---- | ---- | ---- | ---- |
| GPIO | EXDEMO_GPIO2_EN=y | 1,764 B | 192 B |
| ADC | EXDEMO_ADC_EN=y | 392 B | 0 B |
| UART | EXDEMO_UART2_EN=y | 992 B | 200 B |
| I2C | EXDEMO_I2C_EN=y | 808 B | 0 B |
| SPI | EXDEMO_SPI_EN=y | 648 B | 260 B |
| RTC | EXDEMO_RTC_EN=y | 3,548 B | 120 B |
| SIM | EXDEMO_SIM_EN=y | 1,984 B | 0 B |
| File System | EXDEMO_FS_EN=y | 5,968 B | 0 B |
| FLASH | EXDEMO_FLASH_EN=y | 800 B | 0 B |
| USB | EXDEMO_USB_EN=y | 424 B | 0 B |
| SOCKET | EXDEMO_SOCKET_EN=y | 5,048 B | 36 B |
| SSL | EXDEMO_SSL2_EN=y | 9,552 B | 44 B |
| HTTP_FOTA | EXDEMO_HTTP_FOTA_EN=y | 132,292 B | 476 B |
| SOUND | EXDEMO_SOUND_EN=y | 104,120 B | 100,612 B |
| PWMAUD | EXDEMO_PWMAUD_EN=y | 100,588 B | 100,316 B |
| CAMERA | EXDEMO_CAMERA_EN=y | 125,800 B | 20,536 B |
| WS2812B | EXDEMO_WS2812B_EN=y | 1,380 B | 192 B |
| VOLTE | EXDEMO_VOLTE_EN=y | 2,648 B | 12 B |
| MOTOR | EXDEMO_MOTOR_EN=y | 624 B | 0 B |
| TTS | EXDEMO_TTS_EN=y (+BUILD_COMP_TTS_EN=y) | 227,088 B | 408 B |

Independent FLASH/RAM = resource usage of the function's API code itself (incremental relative to the empty project's 24,316 B FLASH / 492 B RAM).

TTS functionality requires both `EXDEMO_TTS_EN=y` and `BUILD_COMP_TTS_EN=y` to be configured.

## 7 TTS Resources

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

## 8 Compilation Command Reference

```shell
#Windows
cd LSDK && build.bat MODEMPKG=F6B_A PROJECT=demo EXDEMO_*_EN=y

#Linux
cd LSDK && make MODEMPKG=F6B_A PROJECT=demo EXDEMO_*_EN=y
```
