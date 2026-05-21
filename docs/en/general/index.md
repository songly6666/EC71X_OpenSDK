# General

{link_to_translation}`zh_CN:[中文]`

## SDK Overview

Lierda LTE Cat.1 bis OpenCPU SDK is a base-package-separated development framework based on the Eigencomm EC71X series chipset, running FreeRTOS real-time operating system (CMSIS-OS2 interface), providing developers with comprehensive Cat.1 module application development capabilities.

## Supported Models and Available Resources

| Base Package | Chip | Supported Modules | Available FLASH | Available RAM | File System |
| ---- | ---- | ---- | ---- | ---- | ---- |
| F6B_A | EC718PM | NT26FCNB10/30/60/70WNA, NT26F6B0 | 812 KB | 1 MB | 780 KB |
| F6D_A | EC718PM | NT26FCND60NNA, NT26FEUD60NNA, NT26F6D0 | 812 KB | 1 MB | 780 KB |
| F7B_A | EC718PM (VoLTE) | NT26FCNB70WNA | 452 KB | 1 MB | 168 KB |
| K2B_A | EC716E | NT26KCNB20NNA, NT26KCNB2MNNA, NT26K2B1 | 844 KB | 512 KB | 840 KB |
| K2F_A | EC716E | NT26KCNF20NNA | 844 KB | 512 KB | 840 KB |

## Feature Overview

### Peripheral Drivers

| Feature | Description |
| ---- | ---- |
| GPIO | 718 series: 39 channels, 716 series: 21 channels, interrupt and internal pull-up/down supported |
| UART | 718 series: 4 channels, 716 series: 3 channels, UART1 supports hardware flow control and low-power wake-up |
| I2C | 2 channels, master/slave mode, 100KHz~1MHz |
| SPI | 718 series: 2 channels, 716 series: 1 channel, up to 25.6MHz |
| ADC | 718 series: 4 channels, 716 series: 2 channels, 12-bit resolution, 0~3.4V |
| PWM | 6 channels, forward/reverse adjustment, up to 26MHz clock divider |
| RTC | Real-time clock |
| I2S/USP | 718 series: 3 channels, audio/camera/display interface, QSPI and 8080 interface supported |
| USB | USB 2.0 Device, 480Mbps(HS)/12Mbps(FS) |
| Keypad | Matrix keypad |
| CAN | 1 channel (718 series only) |
| External Flash | Supported (718 series only) |
| PSRAM | Supported (718 series only) |

### Network Communication

| Feature | Description |
| ---- | ---- |
| Data Call | APN configuration, multi-CID support |
| Socket | TCP/UDP, encryption supported (TLS/DTLS) |
| SSL/TLS | Based on mbedTLS, certificate authentication |
| HTTP/HTTPS | GET/POST/PUT and other methods |
| MQTT/MQTTS | QoS 0/1/2 supported |
| FTP/FTPS | File upload and download |
| NTP | Network time synchronization |
| Ping | ICMP network diagnostics |
| WebSocket | Full-duplex communication |

### IoT Platforms

| Feature | Description |
| ---- | ---- |
| OneNET | China Mobile IoT platform |
| CTWing | China Telecom IoT platform |

### Multimedia

| Feature | Description |
| ---- | ---- |
| Audio | Audio playback (PCM/AMR) |
| TTS | Text-to-speech, Chinese/English, 8k/16k sample rate |
| LCD | Display driver, SPI/8080 interface |
| Camera | Camera driver (CSPI interface) |
| VoLTE | Voice call (F7B_A base package only) |

### System Features

| Feature | Description |
| ---- | ---- |
| FreeRTOS | CMSIS-OS2 interface, 1ms tick, Heap4/TLSF memory management |
| File System | LittleFS, power-fail safe, COW mechanism, wear leveling |
| Low Power | Normal(~4mA)/Low(~60uA)/Deep Low(~9.5uA) three-level modes |
| Secure Boot | Boot verification |
| OTA Upgrade | Full FOTA upgrade (not supported on F7B_A/K2B_A) |
| SIM Management | Dual SIM single standby, Class B/C |
| Network Management | Registration, signal query, cell information |
| AT Command | Virtual AT channel, custom AT commands |
| WiFi Scan | WiFi scan for assisted positioning |
| LBS | Cell tower positioning |

### Build and Toolchain

| Feature | Description |
| ---- | ---- |
| Unified Build Entry | Makefile / build.bat, target switching, clean, compile |
| Preset Configuration | default.ini (system params) / iodriver.ini (IO pin config) |
| Module Trimming | Makefile macro switches (BUILD_COMP_xxx_EN) |
| Flash Programming | FlashTools |
| Log Monitoring | EPAT tool, USB/UART output |
| FOTA Tool | FotaToolkit for differential package generation |
| Dump Analysis | Crash dump parsing |

```{toctree}
:maxdepth: 1

quick_start
resource-information
boot-process
faq
```