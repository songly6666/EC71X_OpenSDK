{link_to_translation}`en:[English]`

# 新手快速开发指导（基于L-CT4IT00-YP00W-01_V04硬件）

## 文件修订历史

| **版本** | **日期** | **作者** | **审核** | **修订内容** |
| --- | --- | --- | --- | --- |
| Rev1.0 | 2026-05-20 | zxq | zlc | 创建文档 |

## 1 简介

本文介绍了01\_V04硬件的基本情况，介绍如何上手使用，安装驱动，固件下载以及软件上如何跑通一个demo，以帮助客户快速熟悉软硬件环境。

## 2 初识开发板

## 2.1 开发板硬件功能介绍

在开始之前，了解一些产品的基本参数非常重要。下表提供了NT26-EC718PM AI开发板的特性信息。

### 2.1.1 硬件图片以及资源

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_1.png" width="600"/>

</div>

### 2.1.2 硬件资源介绍

| 主要器件 (TOP) | 描述 |
| --- | --- |
| Pwrkey 按键 | Pwrkey，用于模组开关机 |
| USB 连接器\*(1)\* | Type-C接口连接器，用于供电、充电、通信、下载 |
| Pwrkey 按键 | 1.25mm/6PIN连接器座子，提供2路PWM/电源/H桥差分输出，按需使用 |
| 充电指示灯 | 红绿两个指示灯，充电中红灯常亮，充满电时绿灯常亮 |
| Reset 按键 | Reset，用于复位模组 |
| CL4056D | 充电管理芯片，适用4.2V电池，NTC建议使用 R~25~\=100KΩ |
| 天线座子 | IPEX-1 代座子 |
| RGB LED | RGB指示灯，指示模组工作状态 |
| 板载硅麦 | 与麦克风连接器二选一即可 |
| 麦克风连接器\*(2)\* | 1.25mm/2PIN连接器座子，用于连接驻极体麦克风 |
| Boot按键 | 用于强制进入下载模式 |
| NT26F6D0模组 | Cat.1模组，支持OPEN应用开发 |
| 点阵屏连接器 | 用于连接SSD1306点阵屏(12864/12832) |
| Key0/1/2按键 | 3个用户自定义按键 |
| **主要器件 (BOT)** | **描述** |
| 摄像头连接器\*(3)\* | 0.5mm/24PIN FPC连接器，用于连接摄像头模组 |
| ES8311 | 高性能语音编解码芯片 |
| LDO28 | 2.8V/300mA低压差线性稳压器 |
| Nor flash | Nor flash芯片，32Mbit，适用于3.3V系统 |
| SIM卡座 | Nano-SIM卡座连接器，用于插入SIM卡 |
| CST8302A | AB/D类功放 |
| LDO33 | 3.3V/300mA低压差线性稳压器 |
| 扬声器连接器 | 1.5mm/2PIN连接器座子，用于连接4Ω/3W喇叭 |
| LCD连接器\*(4)\* | 0.5mm/20PIN FPC连接器，用于连接屏幕转接板 |
| 电池连接器\*(5)\* | 1.5mm/3PIN连接器座子 |

**注意：**

1.  **USB连接器**：请使用支持 USB 2.0 并包含 D+/D- 数据线的线缆（非仅充电线）；

2.  **麦克风连接器**：接口有极性，连接时注意正负线序，接反将无法录音；

3.  **摄像头连接器**：FPC 连接器为上接触类型（触点朝上），排线金手指需朝下插入；

4.  **LCD连接器**：连接器为上下双面接触，插入排线时需核对引脚顺序，防止反向；

5.  **电池连接器**：务必核对电池端子的线序（如正、负、NTC）与板端连接器定义一致，接错可能损坏设备；

## 3 PC驱动安装

usb驱动是连接PC以及开发板之间的桥梁，在开发过程中，需要烧录固件，AT命令发送以及Log信息的获取，都需要通过USB，因此安装usb驱动是开发工作的必要前提。

安装驱动可以参考文档《Lierda LTE-EC71x OpenCPU USB驱动安装应用指导》，驱动正确安装之后，开发板开机之后，会出现下面三个COM口。

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_2.png" width="600"/>

</div>

常用下面两个COM口：

Lierda At Port，这是发送AT命令的端口，固件下载和发送AT都会用到这个口；

Lierda Log Port，这是获取Log的端口，如果使用EPAT工具抓log，会用到这个口。

## 4 烧录工具和Log工具的使用

## 4.1 烧录工具

[《Lierda 蜂窝固件烧录工具使用指导\_Rev1.0》](../../tools/flash/flash-tool.md)

## 4.2 Log工具

[《Windows Log抓取指南\_V1.0》](../../tools/Packet%20capture/packet-capture.md)

## 5 如何开机

1、 一般插入usb可以直接开机，如果没有开机，看不到com口，可以用PWRKEY。

2、PWRKEY开机(短按500ms开机，长按650ms关机)。

PWRKEY在板子A面，如下图：

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_3.png" width="600"/>

</div>

## 6 SDK获取以及点亮开发板RGB灯

## 6.1 SDK如何获取

获取链接如下：

[https://github.com/orgs/lierda-iot/repositories](https://github.com/orgs/lierda-iot/repositories)

关于SDK详细介绍，请参考如下文档：

[《新手开发指南\_Rev1.0》](../../general/quick_start.md)

## 6.2 点亮RGB灯软件修改以及操作步骤

### 6.2.1 修改Makefile文件

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_4.png" width="600"/>

</div>

### 6.2.2 修改文件examples/demo/config

此文件控制具体编译哪个demo，比如我们编译RGB灯的demo，也可以选择自己需要的其他demo，可以用宏控选择编译哪个demo。

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_5.png" width="600"/>

</div>

### 6.2.3 编译

进入到SDK根目录，然后使用make all命令编译，如果正确编译完，会有如下输出。

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_6.png" width="600"/>

</div>

### 6.2.4 烧录验证

烧录之后开机，选择烧录这个固件gccout/app/app\_NT26FCNB60WNA\_01.binpkg；

正常情况下，RGB灯会不断变化闪烁，表示编译和烧录成功。

<div align="center">

<img src="_images/L-CT4IT00-YP00W-01_V04_quick_start/image_7.png" width="600"/>

</div>
