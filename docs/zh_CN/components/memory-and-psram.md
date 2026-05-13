# FLASH 与 RAM 说明_Rev1.0

{link_to_translation}`en:[English]`

## 1 修订记录

| 版本 | 日期 | 作者 | 审核 | 修订内容 |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | 创建文档 |

## 2 简介

本文档统计了 Lierda EC71X 系列 Cat.1 模组 OpenCPU 开发中，不同底包（Base Package）和功能模块的 FLASH 与 RAM 资源占用情况，为开发者选择合适的模组和配置功能提供参考。

**免责声明：** 本文档数据基于实际编译统计，实际占用可能因 SDK 版本、编译器版本等因素略有差异。设计时建议预留 10-20% 余量。

## 3 数据来源说明

本文档数据通过实际编译统计获得，而非库文件估算：

- **编译方式**：对每个功能模块单独编译，从链接器输出中提取内存数据
- **编译命令**：`build.bat all MODEMPKG=xxx PROJECT=demo EXDEMO_xxx_EN=y`
- **数据提取**：从编译输出的 `Memory region` 段落直接读取
- **准确性**：反映实际链接后的真实占用，包含所有依赖代码。

**注意：** 库文件 (`.a`) 大小 ≠ 实际占用大小。库文件包含符号表、重定位信息等，实际链接后链接器会进行死代码消除、内联优化等，因此实际编译统计是最可靠的方法。

## 4 底包类型和资源

| 底包型号 | FLASH 容量 | RAM 容量 | 支持模组型号 |
| ---- | ---- | ---- | ---- |
| F6B_A | 812 KB | 1 MB | NT26FCNB60WNA、NT26F6B0 |
| F6D_A | 812 KB | 1 MB | NT26FCND60NNA、NT26FEUD60NNA、NT26F6D0 |
| F7B_A | 452 KB | 1 MB | NT26FCNB70WNA |
| K2B_A | 844 KB | 512 KB | NT26K2B1 |
| K2F_A | 844 KB | 512 KB | NT26KCNF20NNA |

## 5 空工程内存占用 (PROJECT=app)

| 底包型号 | FLASH 占用 | RAM 占用 | FLASH 使用率 | RAM 使用率 |
| ---- | ---- | ---- | ---- | ---- |
| F6B_A | 24,316 B | 492 B | 2.92% | 0.05% |
| F6D_A | 24,316 B | 492 B | 2.92% | 0.05% |
| F7B_A | 24,340 B | 492 B | 5.26% | 0.05% |
| K2B_A | 24,308 B | 492 B | 2.81% | 1.50% |
| K2F_A | 24,308 B | 492 B | 2.81% | 1.50% |

## 6 各功能模块独立内存占用 (F6B_A 底包)

以下数据基于 F6B_A 底包（NT26FCNB60WNA），展示每个功能模块独立占用的资源（以空工程为基准的增量值）：

| 功能模块 | 配置参数 | FLASH 占用 | RAM 占用 |
| ---- | ---- | ---- | ---- |
| GPIO | EXDEMO_GPIO2_EN=y | 1,764 B | 192 B |
| ADC | EXDEMO_ADC_EN=y | 392 B | 0 B |
| UART | EXDEMO_UART2_EN=y | 992 B | 200 B |
| I2C | EXDEMO_I2C_EN=y | 808 B | 0 B |
| SPI | EXDEMO_SPI_EN=y | 648 B | 260 B |
| RTC | EXDEMO_RTC_EN=y | 3,548 B | 120 B |
| SIM | EXDEMO_SIM_EN=y | 1,984 B | 0 B |
| 文件系统 | EXDEMO_FS_EN=y | 5,968 B | 0 B |
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

独立 FLASH/RAM = 该功能 API 代码本身占用的资源（相对于空工程 24,316 B FLASH / 492 B RAM 的增量）。

TTS 功能需要同时配置 `EXDEMO_TTS_EN=y` 和 `BUILD_COMP_TTS_EN=y`。

## 7 TTS 资源

TTS 除过独立的 API 占用资源外，还有音频资源包，根据不同语言不同采样率占用资源大小不同。

TTS 资源会在代码 Flash 空间划分一块独立区域存放这个资源包。TTS 资源大小按照 4K 对齐。

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

TTS 资源在代码空间和文件系统空间之间：

```plaintext
┌─────────┬───────┬───────┐
│ code flash    │ tts res      │   little fs   │
└─────────┴───────┴───────┘
```

## 8 编译命令参考

```shell
#Windows
cd LSDK && build.bat MODEMPKG=F6B_A PROJECT=demo EXDEMO_*_EN=y

#Linux
cd LSDK && make MODEMPKG=F6B_A PROJECT=demo EXDEMO_*_EN=y
```

