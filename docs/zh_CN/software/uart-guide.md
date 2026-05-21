# UART 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 文件修订历史

| 版本 | 日期 | 作者 | 审核 | 修订内容 |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | 创建文档 |
| Rev1.1 | 2026-04-24 | mbb | | 增加 UART 的基本概念介绍、demo 详解和快速开发流程 |

## 1 简介

本文档面向使用 Lierda LTE-EC71X 系列（EC716 / EC718 / EC718M）模组进行 OpenCPU 二次开发的工程师，系统介绍了 UART API 的功能特性、接口定义及使用方法。文档涵盖 UART 基础概念、端口说明、接收/发送机制、API 详解以及完整代码示例，帮助开发者快速上手并正确集成串口通信功能。

**注意：** 文档标题中"UART2"不是"UART2 端口的驱动"，而是升级的第二代 UART API。

## 2 基本概念

### 2.1 UART

UART（Universal Asynchronous Receiver/Transmitter，通用异步收发传输器）是一种最基础、最常用的串行通信方式。把它理解为两个设备之间的"对话线路"：

- 发送方（TX）：把数据一个比特一个比特地发送出去，就像逐字说话。
- 接收方（RX）：把对方发送过来的比特还原成完整的数据，就像逐字听话。

为了让双方能够"听懂"彼此，UART 通信需要事先约定好几个关键参数：

| 参数 | 含义 | 常见设置 |
| ---- | ---- | ---- |
| 波特率（Baudrate） | 每秒传输的比特数，相当于"说话速度" | 115200、9600 |
| 数据位（Data Bit） | 每个数据帧中实际携带的数据位数 | 8 位、7 位 |
| 停止位（Stop Bit） | 每个数据帧结束时的间隔位，用于同步 | 1 位、2 位 |
| 校验位（Parity） | 简单的错误检测机制 | 无校验、奇校验、偶校验 |

两个 UART 设备要正常通信，必须将上述参数设置为完全一致，否则就会像两个人一个说中文一个说英文，无法沟通。

EC71X 系列模组内置了多个 UART 硬件控制器，并通过 OpenCPU SDK 封装了一套简单易用的 API。用户无需关心底层寄存器配置，只需调用初始化、发送、接收回调这几个接口，即可快速实现与外部设备的串口通信。

### 2.2 UART 端口说明

EC71X 系列模组提供多个 UART 端口供用户使用，包含物理串口和虚拟端口：

| 端口枚举 | 端口类型 | 说明 |
| ---- | ---- | ---- |
| L_UART0 | 物理串口 | 主串口（Main UART），默认用于日志输出（UNILOG），也可配置为用户数据通信口。EC718 对应 PAD31(RX)/PAD32(TX)；EC716 对应 PAD18(RX)/PAD19(TX)。 |
| L_UART1 | 物理串口 | 辅助串口，常用于与外部设备通信。EC718 对应 PAD33(RX)/PAD34(TX)；EC716 对应 PAD20(RX)/PAD21(TX)。 |
| L_UART2 | 物理串口 | 辅助串口。EC718 对应 PAD25(RX)/PAD26(TX)；EC716 对应 PAD16(RX)/PAD17(TX)。 |
| L_UART3 | 物理串口 | 辅助串口。对应 PAD29(RX)/PAD30(TX)。使用前需在 RTE_Device.h 中确认 RTE_UART3 已启用。 |
| L_USBCOM | 虚拟端口 | 通过 USB 线连接电脑后虚拟出的 COM 端口，无需外接串口转换线。内部通过 OPAQ 总线通信。 |

### 2.3 接收机制

SDK 采用中断触发 + 回调函数的接收模式：

1. 底层硬件通过 DMA 或中断接收到数据后，触发 OPAQ 通道回调。
2. SDK 内部在底层任务上下文中调用用户注册的回调函数 `L_UartCallback_f`。
3. 回调函数在底层任务上下文中执行，用户不应在回调中执行耗时操作（如长时间延时、大量日志打印等），以免阻塞底层接收任务。

### 2.4 发送方式

SDK 支持三种数据发送方式，通过 `Liot_UartConfig_t` 的 `tx_way` 字段配置：

| 发送方式 | 行为 |
| ---- | ---- |
| L_UART_TX_OPAQ | 通过 OPAQ 总线发送，数据存入内部缓存后异步发送，接口立即返回。L_USBCOM 端口仅支持此模式。 |
| L_UART_TX_DRIVER | Polling 模式，同步阻塞发送，接口等待所有数据发送完成后返回。 |
| L_UART_TX_DRIVER_DMA | DMA 模式，数据提交到 DMA 缓冲区后接口立即返回，由 DMA 硬件完成实际发送。 |

**注意：** 模组 UART 引脚通常为 1.8V TTL 电平。严禁直接连接 RS232 电平（±12V）或 5V TTL 电平设备，否则会永久损坏模组！如需与 3.3V/5V 设备通信，请使用电平转换芯片。

## 3 API 函数概览

| 函数 | 说明 |
| ---- | ---- |
| `Liot_UartInit` | UART 初始化接口 |
| `Liot_UartDeinit` | UART 去初始化接口 |
| `Liot_UartSend` | UART 发送接口 |

## 4 类型说明

### 4.1 liot_uart_err_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_SUCCESS     = 0,
    L_UART_ERR_EXECUTE,
    L_UART_ERR_ADDR_NULL,
    L_UART_ERR_INVALID_PARAM,
    L_UART_ERR_OPEN_REPEAT,
    L_UART_ERR_NOT_OPEN,
} liot_uart_err_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_SUCCESS | 执行成功 |
| L_UART_ERR_EXECUTE | 执行异常/通用错误 |
| L_UART_ERR_ADDR_NULL | 地址为空 |
| L_UART_ERR_INVALID_PARAM | 传入参数错误 |
| L_UART_ERR_OPEN_REPEAT | 重复初始化 |
| L_UART_ERR_NOT_OPEN | UART 未初始化 |

### 4.2 liot_uart_e

1. 枚举定义：

```c
typedef enum
{
    L_PORT_NONE = -1,
    L_UART0,
    L_UART1,
    L_UART2,
    L_UART3,
    L_USBCOM,
    L_PORT_MAX,
} liot_uart_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_PORT_NONE | 空 UART 口 |
| L_UART0 | UART0 |
| L_UART1 | UART1 |
| L_UART2 | UART2 |
| L_UART3 | UART3 |
| L_USBCOM | 通过 USB 线连接电脑后虚拟出的 AT/DEBUG 端口，无需外接串口转换线 |
| L_PORT_MAX | 枚举最大值 |

### 4.3 liot_uart_flowctrl_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_FC_NONE = 0,
    L_UART_FC_HW,
} liot_uart_flowctrl_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_FC_NONE | 关闭硬件流控 |
| L_UART_FC_HW | 打开硬件流控 |

### 4.4 liot_uart_baudrate_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_BR_AUTO   = 0,
    L_UART_BR_600    = 600,
    L_UART_BR_1200   = 1200,
    L_UART_BR_2400   = 2400,
    L_UART_BR_4800   = 4800,
    L_UART_BR_9600   = 9600,
    L_UART_BR_14400  = 14400,
    L_UART_BR_19200  = 19200,
    L_UART_BR_28800  = 28800,
    L_UART_BR_38400  = 38400,
    L_UART_BR_57600  = 57600,
    L_UART_BR_115200 = 115200,
    L_UART_BR_230400 = 230400,
    L_UART_BR_460800 = 460800,
    L_UART_BR_921600 = 921600,
} liot_uart_baudrate_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_BR_AUTO | 自动波特率 |
| L_UART_BR_600 ~ L_UART_BR_921600 | 对应波特率值 |

**注意：** 自动波特率需要底层硬件支持自动波特率检测功能，通常需要对端先发送特定校准字符（如 "AT"）才能完成波特率识别。如果不确定底层是否支持，建议使用固定波特率（如 `L_UART_BR_115200`）。

### 4.5 liot_uart_databit_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_DATA_7 = 7,
    L_UART_DATA_8 = 8,
} liot_uart_databit_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_DATA_7 | 数据位 7 |
| L_UART_DATA_8 | 数据位 8 |

### 4.6 liot_uart_stopbit_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_STOP_1 = 1,
    L_UART_STOP_2 = 2,
} liot_uart_stopbit_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_STOP_1 | 1 个停止位 |
| L_UART_STOP_2 | 2 个停止位 |

### 4.7 liot_uart_paritybit_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_PARITY_NONE,
    L_UART_PARITY_ODD,
    L_UART_PARITY_EVEN,
} liot_uart_paritybit_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_PARITY_NONE | 无校验 |
| L_UART_PARITY_ODD | 奇校验 |
| L_UART_PARITY_EVEN | 偶校验 |

### 4.8 liot_uart_txway_e

1. 枚举定义：

```c
typedef enum
{
    L_UART_TX_OPAQ       = 0,
    L_UART_TX_DRIVER,
    L_UART_TX_DRIVER_DMA
} liot_uart_txway_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_UART_TX_OPAQ | OPAQ 总线发送，会建立缓存，异步发送 |
| L_UART_TX_DRIVER | Polling 模式，同步发送接口 |
| L_UART_TX_DRIVER_DMA | DMA 模式发送，DMA 异步发送接口，数据送到 DMA 后接口返回 |

### 4.9 Liot_UartConfig_t

1. 结构体定义：

```c
typedef struct
{
    liot_uart_baudrate_e baudrate;
    liot_uart_databit_e data_bit;
    liot_uart_stopbit_e stop_bit;
    liot_uart_paritybit_e parity_bit;
    liot_uart_flowctrl_e flow_ctrl;
    liot_uart_txway_e tx_way;
    bool cts_enable;
    bool rts_enable;
    uint32_t rx_buf_size;
    uint32_t tx_buf_size;
    bool lpuart_enable;
} Liot_UartConfig_t;
```

2. 结构体变量说明

| 变量 | 说明 |
| ---- | ---- |
| baudrate | 设置波特率，参考 `liot_uart_baudrate_e` |
| data_bit | 设置数据位，参考 `liot_uart_databit_e` |
| stop_bit | 设置停止位，参考 `liot_uart_stopbit_e` |
| parity_bit | 设置校验位，参考 `liot_uart_paritybit_e` |
| flow_ctrl | 设置硬件流控方式，参考 `liot_uart_flowctrl_e` |
| tx_way | 设置数据发送方式，参考 `liot_uart_txway_e` |
| cts_enable | 使能 CTS，当前版本暂不支持，请设置为 false |
| rts_enable | 使能 RTS，当前版本暂不支持，请设置为 false |
| rx_buf_size | 设置接收缓存大小，当前版本暂不支持，请设置为 0 |
| tx_buf_size | 设置发送缓存大小，当前版本暂不支持，请设置为 0 |
| lpuart_enable | 使能低功耗串口 |

**注意：** 建议使用 `memset` 或 `= {0}` 将 `Liot_UartConfig_t` 结构体整体初始化为 0 后，再逐一设置需要的字段。这样可确保当前不支持的字段为安全的默认值，避免未初始化的随机值导致异常。

## 5 API 函数详解

### 5.1 L_UartCallback_f

UART 数据接收回调函数类型定义。当 UART 端口收到数据时，SDK 底层会调用此回调函数通知用户。

1. 声明

```c
typedef void (*L_UartCallback_f)(liot_uart_e port, char *data, uint32_t size, void *argc);
```

2. 参数

- **port：** [In] 产生数据的 UART 端口号。
- **data：** [In] 指向接收数据的指针。
- **size：** [In] UART 接收数据长度。
- **argc：** [In] 用户自定义上下文指针（Context Pointer），即调用 `Liot_UartInit` 时传入的 argc 参数。通常用于传递对象实例指针或用户结构体地址，方便在回调中访问用户上下文数据。如不需要可传入 NULL。

3. 返回值

无返回值。

**注意：** 该指针指向底层接收缓冲区，回调函数返回后该内存可能被释放或覆盖。如需在回调外部处理数据，请在回调中使用 `memcpy` 将数据复制到用户自定义的缓存中。

### 5.2 Liot_UartInit

初始化 UART 端口。

1. 声明

```c
liot_uart_err_e Liot_UartInit(liot_uart_e port, Liot_UartConfig_t *uart_config, L_UartCallback_f uart_cb, void *argc);
```

2. 参数

- **port：** [In] UART 端口号，参考 `liot_uart_e`。
- **uart_config：** [In] UART 参数配置结构体指针，参考 `Liot_UartConfig_t`，不能为 NULL。
- **uart_cb：** [In] 数据接收回调函数，参考 `L_UartCallback_f`，不能为 NULL。
- **argc：** [In] 传递给回调函数的用户自定义上下文指针。该指针会在每次回调触发时作为第四个参数传回给 `uart_cb`。如不需要可传入 NULL。

3. 返回值

- 0：成功。
- != 0：失败，参考 `liot_uart_err_e`。

### 5.3 Liot_UartDeinit

去初始化 UART 端口，释放相关资源。

1. 声明

```c
liot_uart_err_e Liot_UartDeinit(liot_uart_e port);
```

2. 参数

- **port：** [In] UART 端口号，参考 `liot_uart_e`。

3. 返回值

- 0：成功。
- != 0：失败，参考 `liot_uart_err_e`。

### 5.4 Liot_UartSend

UART 发送数据接口。发送行为取决于初始化时配置的 `tx_way` 发送方式：

- `L_UART_TX_DRIVER`（Polling 模式）：同步阻塞发送，接口等待所有数据发送完成后返回。
- `L_UART_TX_DRIVER_DMA`（DMA 模式）：将数据提交到 DMA 缓冲区后立即返回，由 DMA 硬件完成实际发送。
- `L_UART_TX_OPAQ`（OPAQ 模式）：将数据送入 OPAQ 通道缓存后返回，异步发送。`L_USBCOM` 端口使用此模式。

1. 声明

```c
uint32_t Liot_UartSend(liot_uart_e port, unsigned char *data, unsigned int data_len);
```

2. 参数

- **port：** [In] UART 端口号，参考 `liot_uart_e`。
- **data：** [In] 指向待发送数据的指针，不能为 NULL。
- **data_len：** [In] 待发送数据长度（字节数），必须大于 0。

3. 返回值

- \>0：发送成功。
- =0：发送失败。

## 6 代码示例

### 6.1 快速开发流程

使用 UART API 进行串口通信的基本步骤如下，下面以 `LSDK/examples/demo/src/demo_uart2.c` 中的 demo 为例进行说明。

**步骤 1：** 定义接收回调函数

```c
#include "liot_uart2.h"

void liot_uart2_notify_cb(liot_uart_e port, char *data, uint32_t size, void *argc)
{
    liot_trace("UART port %d receive size:%d, data=%s", port, size, data);
}
```

回调函数在底层任务中被调用，收到数据后建议立即复制到用户缓冲区，避免在回调中执行复杂逻辑。

**步骤 2：** 初始化 `Liot_UartConfig_t` 结构体

```c
Liot_UartConfig_t usart_config = {0};
usart_config.baudrate   = L_UART_BR_115200;
usart_config.data_bit   = L_UART_DATA_8;
usart_config.flow_ctrl  = L_UART_FC_NONE;
usart_config.stop_bit   = L_UART_STOP_1;
usart_config.parity_bit = L_UART_PARITY_NONE;
```

**步骤 3：** 调用 `Liot_UartInit` 初始化端口

```c
int ret = Liot_UartInit(L_USBCOM, &usart_config, liot_uart2_notify_cb, NULL);
if(ret != L_UART_SUCCESS)
    liot_trace("Liot_UartInit failed, ret=%d", ret);
```

**步骤 4：** 发送数据

```c
Liot_UartSend(L_USBCOM, (unsigned char *)"helloworld\r\n", 10);
```

**步骤 5：** 在回调函数中处理接收到的数据

数据接收由底层自动触发回调，在步骤 1 注册的回调函数 `liot_uart2_notify_cb` 中处理数据，无需用户轮询。

**步骤 6（可选）：** 去初始化

```c
Liot_UartDeinit(L_USBCOM);
```

`Liot_UartDeinit` 会释放端口资源。

### 6.2 完整示例

以下代码位于 `LSDK/examples/demo/src/demo_uart2.c`，演示了如何初始化多个 UART 端口并在循环中定时发送数据。

```c
#include "liot_uart2.h"
#include "liot_os.h"
#include "lierda_app_main.h"

#define LIOT_UART_PORT_USB_TEST_DEMO
//#define LIOT_UART_PORT_0_TEST_DEMO
#define LIOT_UART_PORT_1_TEST_DEMO
//#define LIOT_UART_PORT_2_TEST_DEMO
//#define LIOT_UART_PORT_3_TEST_DEMO

void liot_uart2_notify_cb(liot_uart_e port, char *data, uint32_t size, void *argc)
{
    liot_trace("UART port %d receive size:%d, data=%s", port, size, data);
}

void liot_uart2_demo_thread(void *arvg)
{
    int ret                         = 0;
    Liot_UartConfig_t usart_config = {0};
    usart_config.baudrate   = L_UART_BR_115200;
    usart_config.data_bit   = L_UART_DATA_8;
    usart_config.flow_ctrl  = L_UART_FC_NONE;
    usart_config.stop_bit   = L_UART_STOP_1;
    usart_config.parity_bit = L_UART_PARITY_NONE;

    liot_rtos_task_sleep_ms(10000);
    liot_trace("==========Uart2 Demo Init: Baudrate-%d ==========\r\n", usart_config.baudrate);

#ifdef LIOT_UART_PORT_USB_TEST_DEMO
    ret = Liot_UartInit(L_USBCOM, &usart_config, liot_uart2_notify_cb, NULL);
    if(ret != L_UART_SUCCESS)
        liot_trace("Liot_UartInit failed, ret=%d", ret);
#endif
#ifdef LIOT_UART_PORT_1_TEST_DEMO
    ret = Liot_UartInit(L_UART1, &usart_config, liot_uart2_notify_cb, NULL);
    if(ret != L_UART_SUCCESS)
        liot_trace("Liot_UartInit failed, ret=%d", ret);
#endif

    while (1)
    {
#ifdef LIOT_UART_PORT_USB_TEST_DEMO
        Liot_UartSend(L_USBCOM, (unsigned char *)"helloworld\r\n", 10);
#endif
#ifdef LIOT_UART_PORT_1_TEST_DEMO
        Liot_UartSend(L_UART1, (unsigned char *)"helloworld\n\n", 10);
#endif
        liot_rtos_task_sleep_ms(1000);
    }

#ifdef LIOT_UART_PORT_USB_TEST_DEMO
    Liot_UartDeinit(L_USBCOM);
#endif
#ifdef LIOT_UART_PORT_1_TEST_DEMO
    Liot_UartDeinit(L_UART1);
#endif
    liot_rtos_task_delete(NULL);
}
```

**示例说明：**

1. 宏控制端口启用：通过 `LIOT_UART_PORT_x_TEST_DEMO` 宏选择需要测试的端口，便于灵活切换，无需修改业务逻辑代码。
2. 结构体清零初始化：`Liot_UartConfig_t usart_config = {0};` 确保所有字段（包括当前版本不支持的 `cts_enable`、`rts_enable` 等）都有安全默认值。
3. 统一回调：所有端口共用同一个 `liot_uart2_notify_cb`，通过 `port` 参数区分数据来源。
4. 定时发送：在 `while(1)` 循环中，每隔 1 秒向已启用的端口发送测试字符串，同时通过 `printf` 输出日志验证程序运行状态。

