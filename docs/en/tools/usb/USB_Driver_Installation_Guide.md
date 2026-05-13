# USB 驱动安装指导_Rev1.0

{link_to_translation}`zh_CN:[Chinese]`

## 1 修订记录

| 版本 | 日期 | 作者 | 审核 | 修订内容 |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | 创建文档 |

## 2 简介

本文旨在帮助使用 Lierda LTE-EC71x 系列模组的用户快速完成 USB 驱动安装，以及熟悉 LTE-EC71x 系列模组 USB 口所支持的所有功能。

## 3 USB 驱动安装操作步骤

[下载安装包](_tools/lierdaCat1usbSetup_V3.4.3.exe)

### 3.1 Windows 下枚举口介绍

<div align="center">

<img src="_images/USB驱动安装指导/image_1.png" width="600"/>

</div>

<div align="center">

<img src="_images/USB驱动安装指导/image_2.png" width="600"/>

</div>

如上图所示，USB 驱动会加载四个功能口：AT、Diag、OPAQ 和 ECM(或 RNDIS)。

`Lierda At Port`: 用于发送 AT 指令和模组通信（MI_03）

`Lierda Diag Port`: 用于配合 EPAT 工具，抓取模组运行日志（MI_02）

`Lierda OPAQ Port`: 是模组枚举出的普通串口功能的端口，用于串口数据收发（MI_04）

`Mobile ECM Network Adapter`: ECM 网络适配器，用于 ECM 上网，在 Windows 下无驱动不能支持上网（MI_00）

`Remote NDIS Based Internet Sharing Device`: RNDIS 网络适配器，用于 RNDIS 上网，驱动由 Windows 自带，不需要主动安装（MI_00）

**注意：** RNDIS 和 ECM 只能同时存在一个上网。MI 号是固定的，对应 `bInterfaceProtocol` 字段。

### 3.2 双击运行 lierdaCat1usbSetup_V3.4.3.exe 安装程序，以管理员权限运行

<div align="center">

<img src="_images/USB驱动安装指导/image_3.png" width="600"/>

</div>

<div align="center">

<img src="_images/USB驱动安装指导/image_4.png" width="600"/>

</div>

### 3.3 点击安装进入下一步

<div align="center">

<img src="_images/USB驱动安装指导/image_5.png" width="600"/>

</div>

### 3.4 完成安装

<div align="center">

<img src="_images/USB驱动安装指导/image_6.png" width="600"/>

</div>

## 4 Linux 环境下驱动安装

LTE-EC71X 系列模组在 Linux 环境下使用 `usb_serial.ko` 驱动，需要在内核配置项中打开 **CONFIG_USB_SERIAL** 宏控。

**使能的内核选项：**

```
USB_SERIAL=y
USB_SERIAL_WWAN=y
USB_SERIAL_OPTION=y
```

### 4.1 修改 option.c 文件

**在表中添加 PID VID 号**

**方法一：** USB serial 驱动通过 `option_ids[]` 数组匹配插入的 USB 设备。LTE-EC71X 系列模组 USB 的 VID 和 PID 号为 3505/0003，将其添加到表中，如图所示：

<div align="center">

<img src="_images/USB驱动安装指导/image_7.png" width="600"/>

</div>

**方法二：** 或者可选择通过命令行方式添加 PID 和 VID：

```shell
Linux#> sudo /sbin/modprobe option
Linux#> sudo chmod 666 /sys/bus/usb-serial/drivers/option1/new_id
Linux#> echo 3505 0003 > /sys/bus/usb-serial/drivers/option1/new_id
```

**过滤对网卡类型驱动枚举**

在 `drivers/usb/serial/option.c` 文件 `option_probe` 中添加对网卡枚举设备的屏蔽代码：

<div align="center">

<img src="_images/USB驱动安装指导/image_8.png" width="600"/>

</div>

### 4.2 Linux 下枚举口介绍

<div align="center">

<img src="_images/USB驱动安装指导/image_9.png" width="600"/>

</div>

- **ttyUSB0:** 对应 Windows 下 Lierda Diag Port，日志口。
- **ttyUSB1:** 对应 Windows 下 Lierda At Port，发送 AT 指令。
- **ttyUSB2:** OpenSDK 下对应 Windows 下 Lierda OPAQ Port。标准固件下对应 Windows 下 Lierda USB Modem（PPP 拨号接口）。
- ECM 和 RNDIS 会直接加载到 eth0。

**注意：** RNDIS 和 ECM 只能同时存在一个上网。MI 号是固定的，对应 `bInterfaceProtocol` 字段。
可使用命令：`sudo dmesg | grep -i usb` 查看。

## 5 常见问题

### 5.1 如果在 Windows 上安装驱动失败，请关闭内存完整性

1. 按 Windows + R 快捷键打开「运行」对话框，执行 `windowsdefender:`（有冒号）打开「Windows 安全中心」。
2. 进入「设备安全性」>「内核隔离详细信息」。
3. 根据你的实际使用情况和场景，打开或关闭「内存完整性」开关。
4. 重启电脑让配置生效。

<div align="center">

<img src="_images/USB驱动安装指导/image_10.png" width="600"/>

</div>

