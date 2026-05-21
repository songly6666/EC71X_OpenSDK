# 系统资源开发指南_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| 版本 | 日期 | 作者 | 审核 | 修订内容 |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | 创建文档 |

## 1 简介

本文档统计了 Lierda EC71X 系列 Cat.1 模组 OpenCPU 开发中，各个系统功能以及资源使用情况给开发者一个了解规划自己开发 OPEN SDK 工程的指导。

## 2 芯片资源说明

Lierda Cat.1 模组采用移芯芯片架构，针对不同应用场景，搭配不同的外设，以节省成本和资源。

| 底包型号 | F6B_A | F6D_A | F7B_A | K2B_A | K2F_A |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 支持模组型号 | NT26FCNB60WNA、NT26F6B0 | NT26FCND60NNA、NT26FEUD60NNA、NT26F6D0 | NT26FCNB70WNA | NT26K2B1 | NT26KCNF20NNA |
| 芯片型号 | EC718pm | | | EC716e | |
| CPU | 32 位 Arm Cortex-M3@306Mhz | | | 32 位 Arm Cortex-M3@204Mhz | |
| 系统 | FreeRTOS CMSIS-OS2 | | | | |
| FLASH 总量 | 4 MB | | | 4 MB | |
| FLASH 可用 | 812 KB | 812 KB | 452 KB | 844 KB | 844 KB |
| RAM 总量 | 4 MB | | | 1 MB | |
| RAM 可用 | 1 MB | 1 MB | 1 MB | 512 KB | 512 KB |
| 文件系统 | 780KB | 780KB | 168KB | 840KB | 840KB |
| 外扩 FLASH | 支持 | | | | |
| 外扩 RAM | 不支持 | | | | |
| PSRAM | 支持 | | | 不支持 | |
| 通信特性 | 支持3GPP Rel.13/14 Cat.1无线电通信接口和协议 | | | | |
| 关机功耗 | ≤ 1uA | | | | |
| 数据传输特性 | LTE-FDD：最大下行速率 10 Mbps，最大上行速率 5 Mbps。LTE-TDD：最大下行速率 8.96 Mbps，最大上行速率 3.1 Mbps。 | | | | |
| USIM | 双卡单待，ClassB（3.0V）和ClassC（1.8V） | | | | |
| UART 数量 | 4路 | | | 3路 | |
| UART 说明 | UART 0 默认系统 LOG 输出。仅 UART1 支持硬件流控和低功耗串口。 | | | | |
| GPIO | 39路 | | | 21路 | |
| GPIO 说明 | 9 路 AGPIO，独立 AION 电源域，休眠下可用。刷新速率 200 us。电平 1.65V ~ 3.30V 可调节，默认 1.8V。中断触发方式：低电平、高电平、上升沿、下降沿。部分 IO 支持内部上下拉。 | | | | |
| PWM | 6路 | | | | |
| PWM 说明 | 支持正向 PWM 和反向 PWM 调节。最高 26MHz 时钟分频。 | | | | |
| I2C | 2路 | | | 2路 | |
| I2C 说明 | 支持主、从模式，速率 100 KHz- 1MHz。 | | | | |
| SPI | 2路 | | | 1路 | |
| SPI 说明 | 支持主、从模式，速率最高 25.6MHz | | | | |
| USP | 3路 | | | 1路 | |
| USP 说明 | 类型：3 种（I2S/CSPI/LSPI），可用于外接音频、摄像头、屏幕。模式：支持主、从模式。支持 8~96k、16 或 24 位，8~48k，32 位。支持标准 I2S/LJ/RJ 模式、PCM 模式 A/B。I2S/PCM 支持 TXRX/TX/RX。CSPI 支持从机接收。USP0/USP1 底层有硬件加速。新增支持 QSPI 与 8080 接口（仅 718(P_M/P_VM) 系列模组支持） | | | | |
| USB | 1路 | | | | |
| USB 说明 | 高速 USB Device 2.0，支持 480Mbps（HS），12Mbps（FS）数据传输。USB VBus 功能可屏蔽。支持 USB 挂起、远程唤醒 | | | | |
| ADC | 4路 | | | 2路 | |
| ADC 说明 | 模拟通道：4 路，输入范围：0V ~ 3.4V。温度传感器：1 路，输入范围：-40°C ~ 85°C。VBAT 电压：1 路，输入范围：2.7V ~ 4.5V。精度：12-bit AUXADC。 | | | | |
| 硬件 Timer | 6路 | | | | |
| Timer 说明 | 不具备唤醒功能，仅在系统 active 时有效 | | | | |
| 低功耗定时器 | 10 路（两路内部使用） | | | | |
| 低功耗定时器说明 | TIMER_ID0–TIMER_ID1：AON 定时器，最大超时值为 2.5 小时。TIMER_ID2–TIMER_ID6：Flash 定时器，最大超时值为 740 小时。TIMER_ID7–TIMER_ID9：仅保留供内部使用。启动或删除 Flash 定时器会引发 Flash 写操作，因此应尽量避免频繁使用。 | | | | |
| Wakeup | 支持 6 路低功耗外部中断唤醒源 | | | | |
| CAN | 1 路 | | | 不支持 | |

## 3 IO 电源说明

| 电源 | 说明 |
| ---- | ---- |
| VBAT | 供电电源输入，推荐使用 3.8V/1.2A 电源供电。Vmax=4.5V，Vmin=3.3V，Vnorm=3.8V |
| VDD_EXT | 默认 1.8V。睡眠模式下，VDD_EXT 掉电版本，驱动能力 120mA；睡眠模式下，VDD_EXT 不掉电版本，驱动能力 3mA。VILmax=0.2×VDD_EXT，VIHmin=0.7×VDD_EXT，VOLmax=0.15×VDD_EXT，VOHmin=0.8×VDD_EXT |
| VO_LDOIO | VOLmax=0.2×VO_LDOIO，VOHmin=0.7×VO_LDOIO，VILmax=0.15×VO_LDOIO，VIHmin=0.8×VO_LDOIO |
| VDD18AON | VILmax=0.2×VDD18AON，VIHmin=0.7×VDD18AON，VOLmax=0.15×VDD18AON，VOHmin=0.8×VDD18AON |
| LDO_AONIO | VILmax=0.2×LDO_AONIO，VIHmin=0.7×LDO_AONIO，VOLmax=0.15×LDO_AONIO，VOHmin=0.8×LDO_AONIO |
| VO_LDOSIM | Vnorm=1.8/3.0V，VOLmax=0.15×VO_LDOSIM，VOHmin=0.8×VO_LDOSIM，VILmax=0.2×VO_LDOSIM，VIHmin=0.7×VO_LDOSIM |

## 4 功能模块内存占用说明

以下数据基于 F6B_A 底包（NT26FCNB60WNA），展示每个功能模块独立占用的资源（以空工程为基准的增量值）：

| 功能模块 | FLASH 占用 | RAM 占用 |
| ---- | ---- | ---- |
| 空工程(APP) | 24,316 B (FLASH 使用率: 2.92%) | 492 B (RAM 使用率: 0.05%) |
| GPIO | 1,764 B | 192 B |
| ADC | 392 B | 0 B |
| UART | 992 B | 200 B |
| I2C | 808 B | 0 B |
| SPI | 648 B | 260 B |
| RTC | 3,548 B | 120 B |
| SIM | 1,984 B | 0 B |
| 文件系统 | 5,968 B | 0 B |
| Flash | 800 B | 0 B |
| USB | 424 B | 0 B |
| Socket | 5,048 B | 36 B |
| SSL | 9,552 B | 44 B |
| HTTP_FOTA | 132,292 B | 476 B |
| Sound | 104,120 B | 100,612 B |
| PWMAUD | 100,588 B | 100,316 B |
| 摄像头 | 125,800 B | 20,536 B |
| WS2812B | 1,380 B | 192 B |
| VOLTE 通话 | 2,648 B | 12 B |
| MOTOR | 624 B | 0 B |
| TTS | 227,088 B | 408 B |

**注意：**

独立 FLASH/RAM = 该功能 API 代码本身占用的资源（相对于空工程 24,316 B FLASH / 492 B RAM 的增量）。

TTS 功能需要同时配置 `EXDEMO_TTS_EN=y` 和 `BUILD_COMP_TTS_EN=y`。

## 5 FLASH 内存使用说明

Flash 大小为 4MB，用户可以操作的分区大小只有 app 和 lfs。base pack 空间跟随不同的底包型号占用空间大小不同，如果需要更大的 app 空间可联系研发定制。

app 的空间就是 SDK 保留给客户可用的代码空间，app 空间和 lfs 空间总大小不变。app 空间和 lfs 空间的大小是此消彼长的，扩大 app 空间，就是划分一部分 lfs 空间给 app 用，反之亦然。

lfs 调整时，请确保 lfs 的可用空间可以完全放置下，app 的 bin 文件，否则会导致全量升级不可用。

```text
+-------------------------------+
|        header1 4KB            | ← 启动检查信息
+-------------------------------+
|    header2 4+4KB              | ← 启动检查信息
|       [Secboot Head]          |
+-------------------------------+
|        bootloader             | ← Bootloader 分区
+-------------------------------+
|  factory back (4+16KB)        | ← 工厂备份分区，存储 IMEI/SN 和 RF 的校准压缩备份
|       [Secboot Head]          |
+-------------------------------+
|        base pack              | ← 底包空间，为客户提供 API 和功能（根据底包可调整）
|       [Secboot Head]          |
+-------------------------------+
|      hib backup 96KB          | ← 休眠备份空间，休眠下保存变量
+-------------------------------+
|          app                  | ← 用户代码空间，可以自己调整（SDK 可调整）
|       [Secboot Head]          |
+-------------------------------+
|          lfs                  | ← 用户文件系统空间，可以自己调整（SDK 可调整）
+-------------------------------+
|      fotaRsvd 48KB            | ← 存放 FOTA 时临时存储数据
+-------------------------------+
|      factory 4+48KB           | ← 工厂分区，存储 IMEI/SN 和 RF 校准
+-------------------------------+
|      plat config 8KB          | ← 保存系统默认的参数
+-------------------------------+
```

## 6 低功耗资源使用说明

模组内部功耗控制分为两部分：

- **PMU 功耗模式**：管理模组运行本身的系统功耗。
- **Modem 功耗模式**：符合 3GPP 标准，用于射频与基带功耗管理，可以简单理解为注网与非注网状态。

**注意：** 模组功耗需要同时确认 PMU 模式与 Modem 模式，两者组合才是模组在不同状态下的功耗。

| 功耗模式 | | LIOT_SLEEP_MODE_NORMAL | LIOT_SLEEP_MODE_LOW | LIOT_SLEEP_MODE_DEEP_LOW |
| ---- | ---- | ---- | ---- | ---- |
| 说明 | | 正常工作模式，毫安级功耗，适用于功耗要求不高的场景 | 微安级功耗，可快速唤醒，适用于高频次休眠/唤醒场景 | 更低功耗模式，适用于长时间休眠，并保持必要网络连接 |
| CPU主频 | | 正常 | 降频 | 休眠 |
| RAM状态 | | 保持 | 保持 | 掉电 |
| 外设 | 普通GPIO | 可用 | 不可用 | 不可用 |
| | AON GPIO | 可用 | 可用 | 可用 |
| | APWM | 可用 | 可用 | 可用 |
| | 外设状态（I2C/SPI/I2S/PWM/ADC/UART/CAN） | 可用 | 不可用 | 不可用 |
| | VDD_EXT | 保持输出 | 部分型号支持输出 | 部分型号支持输出 |
| 唤醒方式 | wakeup/pwrkey | 可用 | 可用 | 可用 |
| | 软件定时器 | 支持 | 支持 | 不支持 |
| | 低功耗定时器 | 支持 | 支持 | 支持 |
| | 低功耗UART | 支持 | 支持 | 支持 |
| | 数据、短信 | 支持 | 支持 | 支持 |
| 数据通信 | 应用协议 | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/TCP/TCP(S)/UDP(S) | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/TCP/TCP(S)/UDP(S) | TCP/UDP |
| | 下行寻呼 | 支持 | 支持 | 支持 |

不同功耗模式下的电流大致范围为：

| 功耗模式 | 不可寻呼电流 |
| ---- | ---- |
| LIOT_SLEEP_MODE_NORMAL | ~4mA |
| LIOT_SLEEP_MODE_LOW | ~60uA |
| LIOT_SLEEP_MODE_DEEP_LOW | ~9.5uA |

## 7 操作系统资源说明

SDK 采用 FreeRTOS 实时操作系统，使用 ARM CMSIS OS2 标准接口作为适配层，使用 CMSIS OS2 封装后的 API。FreeRTOS 是实时的可抢占式内核，高优先级任务实时调度，同优先级任务采用时间片轮询调度，时间片粒度为 1ms。

关于 OS 提供的基础功能，如互斥锁，信号量，队列，CMSIS-OS2 标准 API 接口等，官网有详细说明。

| 项目 | 说明 |
| ---- | ---- |
| Version | CMSIS-OS2 V2.1.1 |
| Ticks | ~1ms |
| Watch Dog | AON-WDG: 默认超时时间 16S，在深度休眠下仍保持运行。NORMAL-WDG：默认超时时间 20S，只在系统 Active 时运行。 |
| Soft Timer | OS timer 的机制由 FreeRTOS 提供，粒度为 1 个 systick，目前为 1ms。Timer 处理 task 的优先级为 40，相对较高，SDK 用户的任务不能超过这个优先级。 |
| 内存管理 | SDK 支持 Heap4 和 TLSF 算法，SDK 默认使用 TLSF 算法 |
| 最大线程数 | 无具体限制，由系统消耗 RAM 内存总量决定 |
| 最大 Timer 数 | 无具体限制，由系统消耗 RAM 内存总量决定 |
| 最大 Queue 数 | 无具体限制，由系统消耗 RAM 内存总量决定 |
| 最大 Sem 数 | 无具体限制，由系统消耗 RAM 内存总量决定 |
| Malloc 最大字节 | 512KB |

## 8 注网使用说明

## 9 文件系统接口资源使用说明

| 项目 | 说明 |
| ---- | ---- |
| 数据存储最小块 | 4KB |
| 可用空间 | 默认 780KB，用户可调整 |
| 小文件内联阈值 | 512 字节。文件 ≤512B = 内联存储；>512B = 跳表存储 |
| 源数据对大小 | 2 个块 = 8KB |
| 超级块占用 | 块 0 + 块 1（共 8KB） |
| 路径长度限制 | 255 字节，路径如 `/a/b/c/d/.../file`，安全深度 < 10 |
| 目录名称最大长度 | 255 字节 |
| 文件名称长度 | 255 字节 |
| 文件数量 | 无具体限制，受 FLASH 大小影响 |
| 文件内容长度 | 无具体限制，受 FLASH 大小影响 |
| 掉电保持 | 支持 |
| 目录存储规则 | 1 个目录 = 1 组元数据对（8KB），目录满了自动用 TAIL 链下一个元数据对 |
| 文件存储规则（小文件） | 小文件（≤512 字节）：直接存在父目录的元数据对里，不占用独立数据块。读写最快，无碎片，掉电绝对安全。 |
| 文件存储规则（大文件） | 大文件（>512 字节）：必须使用 CTZ 反向跳表，最小占用 1 个数据块（4KB） |

**注意：** 请保留最小文件系统空间 32KB，用于保存系统基本配置信息。

**写入 / 更新规则：**

- 写 ≤512B：直接改目录元数据 → 双块原子提交 → 完成
- 写 >512B：分配新 4KB 块 → 写数据 → 更新跳表 → 原子提交
- 修改文件：绝不覆盖旧块 → COW 写新 4KB 块 → 切换指针 → 旧块回收
- 删除：打删除标记 → 空间延迟回收（磨损均衡）

**磨损均衡规则：**

- 所有 4KB 块统一进入全局块池
- 优先使用擦写次数最少的块
- 坏块自动标记，跳过不用
- 无碎片整理，天然抗碎片

## 10 TTS 资源

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

