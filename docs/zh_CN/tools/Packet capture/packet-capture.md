# Windows Log 抓取指南_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| **版本** | **日期** | **作者** | **修订内容** |
| ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-04-25 | ljz | 创建文档 |

## 1 引言

本文档介绍系列模组 windows 环境下如何使用上位机工具抓取 LTE-EC71X 系列模组的运行日志，用于协助用户及工程师分析模组运行状态、现网表现及排查异常问题。

### 2 EPAT 简介

- **EPAT：** EigenComm Platform Analysis Tools。用于抓取和分析EigenComm UE Log，对 UE 进行调试和分析。
- **EPAT offline mode：** 用于打开 UE log 并显示 log，在 offline mode 下可以启动多个 EPAT 进程，同时打开多 UE log，便于log 之间比较。
- **EPAT online mode：** 用于捕获 UE log 及 UE 在线状态，在 Online mode 下仅能启动一个 EPAT。

## 3 环境搭建

### 3.1 确认日志输出端口

APP 中的log在 `LSDK/config/default.ini` 确认或修改当前模组配置：

<div align="center">

<img src="_images/Windows抓Log工具/image_1.png" width="600"/>

</div>

| **功能** | **指令** | **说明** |
| ---- | ---- | ---- |
| 输出至 USB AT | appLogPort=0 | 无 |
| 输出至UART2口 | appLogPort=1 | uart2At需要设置为1 |
| 输出至EPAT工具中 | appLogPort=3 | 使用 EPAT.exe |

### 3.2 准备工作

请准备以下工具和条件：

1. 目标模组（需抓取 log 的设备）；
2. 模组支持两种日志输出方式：
   - **USB AT 日志输出（默认）**：连接模组 USB 接口，使用串口工具查看，设备管理器中映射的名称为：Lierda At Port；
   - **USB Log 日志输出（默认）**：连接模组 USB 接口，使用EPAT工具查看，设备管理器中映射的名称为：Lierda Log Port；
   - **UART 2 串口输出**：默认需连接 AUX_TXD、AUX_RXD、GND 引脚，使用串口工具查看；
3. 上位机日志抓取工具：**串口工具或EPAT.exe**；
4. 若使用EPAT查看，还需准备对应固件版本的数据库文件（如 `comdb.txt`）。

**注意：**

- 若无 EPAT.exe 工具，请联系技术支持获取；
- 数据库文件需与固件版本匹配。

## 4串口LOG抓取

打开任意串口工具，波特率选择115200，打开串口后，即可查看APP的log。

<div align="center">

<img src="_images/Windows抓Log工具/image_2.png" width="600"/>

</div>

## 5 EPAT LOG抓取

### 5.1 启动 EPAT 工具

双击运行 `EPAT.exe`，工具版本可能不同，如有需要请联系 FAE 获取最新版。

<div align="center">

<img src="_images/Windows抓Log工具/image_3.png" width="600"/>

</div>

首次打开 EPAT 工具，将弹出选择数据源窗口：

- **选择**：`Serial Device（串口设备）`
- 点击 `OK` 进入主界面

<div align="center">

<img src="_images/Windows抓Log工具/image_4.png" width="600"/>

</div>

<div align="center">

<img src="_images/Windows抓Log工具/image_5.png" width="600"/>

</div>

### 5.2 连接 UE

#### 5.2.1 设备对话框

点击"串口设置"图标，在弹出的"Device Communication"中点击"Setting"

<div align="center">

<img src="_images/Windows抓Log工具/image_6.png" width="600"/>

</div>

<div align="center">

<img src="_images/Windows抓Log工具/image_7.png" width="600"/>

</div>

#### 5.2.2 设置连接参数

选择正确的日志端口（Lierda Log Port），配置波特率（默认 `3000000`）

<div align="center">

<img src="_images/Windows抓Log工具/image_8.png" width="600"/>

</div>

配置完成后点击 `OK` 返回主界面

**注意：**

- 若 USB 端口未枚举，请参考《USB 驱动安装指导》进行驱动安装。
- DBG串口波特率默认3M，可设置为其他波特率，设置后重启生效。

<div align="center">

<img src="_images/Windows抓Log工具/image_9.png" width="600"/>

</div>

设备管理器中的USB设备

#### 5.2.3  查看连接状态

在 EPAT 状态栏可以查看连接状态。

| **状态** | **显示效果** |
| ---- | ---- |
| 连接成功 |  |
| 未连接 |  |
| 连接失败 |  |

### 5.3 Update DB

#### 5.3.1 查看状态

工具栏的 Database State 按钮有三种状态来表示数据库的匹配状态。

| **状态** | **显示效果** |
| ---- | ---- |
| UE DB 读取失败 |  |
| UE DB 不匹配 |  |
| UE DB 匹配 |  |

点击工具栏中的"数据库更新"图标

<div align="center">

<img src="_images/Windows抓Log工具/image_16.png" width="600"/>

</div>

在弹出窗口中点击 `Update`，然后选择匹配的comdb.txt文件

<div align="center">

<img src="_images/Windows抓Log工具/image_17.png" width="600"/>

</div>

#### 5.3.2 更新数据库

在更新数据库界面，手动更新对应的数据库文件

<div align="center">

<img src="_images/Windows抓Log工具/image_18.png" width="600"/>

</div>

数据库版本更新完成后弹出提示：**Databases updated!**

<div align="center">

<img src="_images/Windows抓Log工具/image_19.png" width="600"/>

</div>

更新后，Check DB Version Result 区域显示结果：

- **绿色：** 成功且匹配
- **红色：** 不匹配
- **灰色：** 读取 UE DB 失败

点击 `Close` 返回主界面

<div align="center">

<img src="_images/Windows抓Log工具/image_20.png" width="600"/>

</div>

**注意：**

- 数据库图标中的问号会在成功抓取日志时自动消失。

### 5.4 Start/Pause/Stop/Clear 功能

<div align="center">

<img src="_images/Windows抓Log工具/image_21.png" width="600"/>

</div>

#### 5.4.1 Pause

表示 Viewer 不刷新 log 显示，但继续保存 Log。用于不确定当前的 log 是否已经发现 UE 的故障，仅临时查看一下，log继续写情况下。

#### 5.4.2 Stop

表示 Viewer 不刷新 log 显示，并停止保存 log。用于确认当前的 log 已经想要保存、后面接受的 log 不需要的保存的情况下。

#### 5.4.3 Clear

清空 Viewer，并新开 log 文件继续写 log。

### 5.5 日志抓取

#### 5.5.1 启动日志抓取

点击主界面右上角"运行"按钮，开始日志抓取。

<div align="center">

<img src="_images/Windows抓Log工具/image_22.png" width="600"/>

</div>

日志输出成功后，数据库图标变为绿色表示数据库与模组固件匹配。

<div align="center">

<img src="_images/Windows抓Log工具/image_23.png" width="600"/>

</div>

### 5.6 筛选 APP 中的LOG

点击筛选日志图标

<div align="center">

<img src="_images/Windows抓Log工具/image_24.png" width="600"/>

</div>

先点击All前面的对勾，取消勾选所有log

<div align="center">

<img src="_images/Windows抓Log工具/image_25.png" width="600"/>

</div>

勾选 `CUSTOMER -> LIOT_CUST -> USRTAPP_LOG`，点击 Apply 和 OK。

<div align="center">

<img src="_images/Windows抓Log工具/image_26.png" width="600"/>

</div>

此时log查看界面显示的就是 APP 部分的log。

<div align="center">

<img src="_images/Windows抓Log工具/image_27.png" width="600"/>

</div>

### 5.7 日志保存

#### 5.7.1 手动保存日志文件

日志抓取完成后，点击"停止"按钮后，点击"保存"图标，将当前抓取日志保存为 `.zip` 格式压缩包。

<div align="center">

<img src="_images/Windows抓Log工具/image_28.png" width="600"/>

</div>

<div align="center">

<img src="_images/Windows抓Log工具/image_29.png" width="600"/>

</div>

#### 5.7.2 自动保存与分包保存日志文件

为便于长时间测试及问题复现，建议启用日志"分包保存"功能：

- 菜单路径：`Log -> Options`
- 启用定时或大小分包保存选项
- 若无此功能，请联系支持人员获取最新版工具

在选中 AutoSave Log File 后，Set max file size 中设置文件大小，当 log 文件达到此大小时自动保存到磁盘。在 Save Folder 输入框中指定保存文件的位置。

如果选项 Automatically delete old zip log files 被选中，自动保存的 zip log 文件数量如果超过预设数量的上限，旧的文件会被自动删除。此数量的值默认是 50。

<div align="center">

<img src="_images/Windows抓Log工具/image_30.png" width="600"/>

</div>

<div align="center">

<img src="_images/Windows抓Log工具/image_31.png" width="600"/>

</div>

**注意：**

- 长时间挂测时需设置该参数，若不进行设置日志文件会被保存为一份，时间越长日志文件越大，不利于日志的传输与分析。

#### 5.7.3 保存文本 log

这里有两个选项分别来控制当保存 zip log 文件时，unilog 或者 siglog 是否保存为同名的 csv 或者 text 文件。

如果选中 Saving unilog as csv file when saving zip log，在保存 zip log 文件的同时，当前的 unilog 数据保存为 zip log 文件的相同目录和名字的 csv 文件。

如果选中 Saving siglog as text file when saving zip log，则在保存 zip log 文件的同时，当前的 siglog 数据保存为 zip log 文件的相同目录和名字的文本文件。

#### 5.7.4 删除

选择 Log file 分类下的 Delete 选项，则显示配置页如下图：

选中 Automatically delete old log files 后，本地记录的 log 文件如果超过指定的数量会自动删除旧的文件。此数量由 Number of local files 确定。

<div align="center">

<img src="_images/Windows抓Log工具/image_32.png" width="600"/>

</div>

#### 5.7.5 转换为 Wireshark 数据包

EPAT 支持将日志转换为 `.pcap` 格式，供 Wireshark 分析使用：

1. 切换日志窗口到 **SigLogger**

<div align="center">

<img src="_images/Windows抓Log工具/image_33.png" width="600"/>

</div>

2. 菜单中选择导出选项

<div align="center">

<img src="_images/Windows抓Log工具/image_34.png" width="600"/>

</div>

3. 设置保存路径与文件名

<div align="center">

<img src="_images/Windows抓Log工具/image_35.png" width="600"/>

</div>

4. 使用 Wireshark 打开 `.pcap` 文件进行数据包分析

<div align="center">

<img src="_images/Windows抓Log工具/image_36.png" width="600"/>

</div>

5. 通过wireshark工具进行网络数据包分析。这里只举例简单TCP数据业务的收发流程。

<div align="center">

<img src="_images/Windows抓Log工具/image_37.png" width="600"/>

</div>

## 6 注意事项

1. **使用最新版 EPAT.exe 工具**，可联系支持人员确认版本；
2. **数据库文件需与固件匹配**，版本不一致会导致日志解析失败；
3. 若 EPAT 异常闪退或无法打开，请结束所有进程，重解压后重新启动；

## 7 常见问题

### 7.1 找不到mfc140u.dll

[请至钉钉文档查看附件《找不到mfc140u.dll.mp4》](https://alidocs.dingtalk.com/i/nodes/1DKw2zgV2P7D273GsPYNbN6v8B5r9YAn?doc_type=wiki_doc&iframeQuery=anchorId%3DX02mcd6f1zzlsae5hzxv5&rnd=0.3503756492205281)

将以下3个文件拷贝到EPAT根目录下：

- [请至钉钉文档查看附件《mfc140u.dll》](https://alidocs.dingtalk.com/i/nodes/1DKw2zgV2P7D273GsPYNbN6v8B5r9YAn?doc_type=wiki_doc&iframeQuery=anchorId%3DX02mcd6i2jcf8lz5l23mml&rnd=0.3503756492205281)
- [请至钉钉文档查看附件《vcruntime140.dll》](https://alidocs.dingtalk.com/i/nodes/1DKw2zgV2P7D273GsPYNbN6v8B5r9YAn?doc_type=wiki_doc&iframeQuery=anchorId%3DX02mcd6i3v1iweopq9eqp&rnd=0.3503756492205281)
- [请至钉钉文档查看附件《msvcp140.dll》](https://alidocs.dingtalk.com/i/nodes/1DKw2zgV2P7D273GsPYNbN6v8B5r9YAn?doc_type=wiki_doc&iframeQuery=anchorId%3DX02mcd6i4zw2vzn56bup8l&rnd=0.3503756492205281)

