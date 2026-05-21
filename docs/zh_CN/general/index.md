# 通用

{link_to_translation}`en:[English]`

## SDK 概述

Lierda LTE Cat.1 bis OpenCPU SDK 是基于移芯 EC71X 系列芯片的底包分离式开发框架，采用 FreeRTOS 实时操作系统（CMSIS-OS2 接口），为开发者提供完整的 Cat.1 模组应用开发能力。

## 支持型号与可用资源

| 底包型号 | 芯片 | 适配模组 | FLASH 可用 | RAM 可用 | 文件系统 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| F6B_A | EC718PM | NT26FCNB10/30/60/70WNA、NT26F6B0 | 812 KB | 1 MB | 780 KB |
| F6D_A | EC718PM | NT26FCND60NNA、NT26FEUD60NNA、NT26F6D0 | 812 KB | 1 MB | 780 KB |
| F7B_A | EC718PM (VoLTE) | NT26FCNB70WNA | 452 KB | 1 MB | 168 KB |
| K2B_A | EC716E | NT26KCNB20NNA、NT26KCNB2MNNA、NT26K2B1 | 844 KB | 512 KB | 840 KB |
| K2F_A | EC716E | NT26KCNF20NNA | 844 KB | 512 KB | 840 KB |

## 功能一览

### 外设驱动

| 功能 | 说明 |
| ---- | ---- |
| GPIO | 718系列39路，716系列21路，支持中断、内部上下拉 |
| UART | 718系列4路，716系列3路，UART1支持硬件流控和低功耗唤醒 |
| I2C | 2路，支持主/从模式，速率100KHz~1MHz |
| SPI | 718系列2路，716系列1路，速率最高25.6MHz |
| ADC | 718系列4路，716系列2路，12-bit精度，0~3.4V |
| PWM | 6路，支持正向/反向调节，最高26MHz时钟分频 |
| RTC | 实时时钟 |
| I2S/USP | 718系列3路，支持音频/摄像头/屏幕接口，支持QSPI与8080接口 |
| USB | USB 2.0 Device，480Mbps(HS)/12Mbps(FS) |
| Keypad | 矩阵键盘 |
| CAN | 1路（仅718系列） |
| 外扩Flash | 支持（仅718系列） |
| PSRAM | 支持（仅718系列） |

### 网络通信

| 功能 | 说明 |
| ---- | ---- |
| 数据拨号 | Data Call，支持APN配置、多CID |
| Socket | TCP/UDP，支持加密(TLS/DTLS) |
| SSL/TLS | 基于mbedTLS，支持证书认证 |
| HTTP/HTTPS | 支持GET/POST/PUT等方法 |
| MQTT/MQTTS | 支持QoS 0/1/2 |
| FTP/FTPS | 文件上传下载 |
| NTP | 网络时间同步 |
| Ping | ICMP网络诊断 |
| WebSocket | 全双工通信 |

### 物联网平台

| 功能 | 说明 |
| ---- | ---- |
| OneNET | 中国移动物联网平台接入 |
| CTWing | 天翼物联平台接入 |

### 多媒体

| 功能 | 说明 |
| ---- | ---- |
| Audio | 音频播放（PCM/AMR） |
| TTS | 语音合成，支持中/英文，8k/16k采样率 |
| LCD | 屏幕驱动，支持SPI/8080接口 |
| Camera | 摄像头驱动（CSPI接口） |
| VoLTE | 语音通话（仅F7B_A底包） |

### 系统功能

| 功能 | 说明 |
| ---- | ---- |
| FreeRTOS | CMSIS-OS2接口，1ms时间片，支持Heap4/TLSF内存管理 |
| 文件系统 | LittleFS，掉电安全，COW机制，磨损均衡 |
| 低功耗 | Normal(~4mA)/Low(~60uA)/Deep Low(~9.5uA)三级模式 |
| 安全启动 | Secure Boot校验 |
| OTA升级 | 全量FOTA升级（F7B_A/K2B_A不支持） |
| SIM管理 | 双卡单待，支持Class B/C |
| 网络管理 | 注网、信号查询、小区信息 |
| AT命令 | 虚拟AT通道，支持自定义AT命令 |
| WiFi Scan | WiFi扫描辅助定位 |
| LBS | 基站定位 |

### 编译与工具链

| 功能 | 说明 |
| ---- | ---- |
| 统一编译入口 | Makefile / build.bat，支持目标切换、清理、编译 |
| 预设配置 | default.ini（系统参数）/ iodriver.ini（IO引脚配置） |
| 项目裁剪 | 通过Makefile宏控开关功能模块（BUILD_COMP_xxx_EN） |
| Flash烧录 | FlashTools工具 |
| 日志监视 | EPAT工具，支持USB/UART输出 |
| FOTA工具 | FotaToolkit差分包生成 |
| Dump分析 | 死机dump解析 |

```{toctree}
:maxdepth: 1

quick_start
resource-information
boot-process
faq
```