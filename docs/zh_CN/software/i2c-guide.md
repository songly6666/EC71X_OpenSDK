# I2C 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| 版本 | 日期 | 作者 | 修订内容 |
| ---- | ---- | ---- | ---- |
| Rev1.0 | 2023-09-11 | TL | 创建文档 |
| Rev1.1 | 2024-03-25 | SXX | 更改文档名称 |
| Rev1.2 | 2024-11-07 | YMX | 增加常见问题章节 |
| Rev1.3 | 2026-01-27 | LJZ | 新增接口 |

## 1 简介

本文档面向使用 Lierda LTE-EC71X 系列（EC716 / EC718 / EC718M）模组进行 OpenCPU 二次开发的工程师，系统介绍了 I2C API 的功能特性、接口定义及使用方法。文档涵盖 I2C 基础概念、端口说明、接收/发送机制、API 详解以及完整代码示例，帮助开发者快速上手并正确集成串口通信功能。

LTE-EC71X 系列模组支持 2 路 I2C，详细 IO 复用参考《Lierda NT26-FCN&NT35-FSA OpenCPU 引脚对照表.xlsx》和《Lierda NT26-KCN OpenCPU 引脚复用表.xlsx》。

## 2 基础概念

I2C 是一种多主机、两线制、低速串行通信总线，广泛用于微控制器和各种外围设备之间的通信。它使用两条线路：串行数据线（SDA）和串行时钟线（SCL）进行双向传输。

- SCL：串行时钟线 - 由主机产生时钟
- SDA：串行数据线 - 双向传输数据

**I2C 数据帧结构：** Start（起始信号）→ Device Address（7-bit 设备地址）→ R/W（读/写控制位）→ ACK（从机应答）→ Data Byte（8-bit 数据）→ ACK（从机/主机应答）→ Stop（停止信号）

### 2.1 接收/发送机制

模组中的 I2C 是基于 I2C 硬件控制器实现的，并非软件 I2C。用户通过接口将数据传给 DMA，由 DMA 负责数据实际传输。

- I2C 写（主机输出）：主机发地址 + 寄存器 + 数据，从机回复 ACK
- I2C 读（主机输入）：从机主动驱动 SDA 发数据，主机回复 ACK/NACK

### 2.2 硬件接线说明

1. 禁止 SCL/SDA 直接接 VCC 或 GND，会烧坏引脚，需要上拉电阻，推荐 3.3KΩ。
2. 多设备共用总线，依靠设备地址区分，不会冲突。
3. 走线尽量短，减少干扰，长布线建议加大上拉电阻。

```
VCC
         │
        3.3KΩ
         │
MODEM_SCL ───┼─── 从机 SCL
         │
        3.3KΩ
         │
MODEM_SDA ───┼─── 从机 SDA

MODEM_GND ─────── 从机 GND
```

## 3 API 函数概览

| 函数 | 说明 |
| ---- | ---- |
| `liot_I2cInit` | 初始化 I2C 总线 |
| `liot_I2cWrite` | 向 I2C 总线写入数据，从设备的寄存器地址长度为 8 位 |
| `liot_I2cRead` | 从 I2C 总线读取数据，从设备的寄存器地址长度为 8 位 |
| `liot_I2cRelease` | 释放 I2C 总线 |
| `liot_I2cWrite_16bit_addr` | 向 I2C 总线写入数据，从设备的寄存器地址长度为 16 位 |
| `liot_I2cRead_16bit_addr` | 从 I2C 总线读取数据，从设备的寄存器地址长度为 16 位 |
| `Liot_I2cWriteReg` | 向 I2C 总线写入数据，寄存器地址长度通过参数控制，可选 8 位或 16 位 |
| `Liot_I2cReadReg` | 从 I2C 总线读取数据，寄存器地址长度通过参数控制，可选 8 位或 16 位 |

## 4 类型说明

### 4.1 liot_errcode_i2c_e

I2C API 执行结果错误码。

1. 定义

```c
typedef enum
{
    LIOT_I2C_SUCCESS = LIOT_SUCCESS,
    LIOT_I2C_INIT_ERR = 1 | LIOT_I2C_ERRCODE_BASE,
    LIOT_I2C_NOT_INIT_ERR,
    LIOT_I2C_INVALID_PARAM_ERR,
    LIOT_I2C_WRITE_ERR = 5 | LIOT_I2C_ERRCODE_BASE,
    LIOT_I2C_READ_ERR,
    LIOT_I2C_RELEASE_ERR,
} liot_errcode_i2c_e;
```

2. 参数说明

| 变量 | 说明 |
| ---- | ---- |
| LIOT_I2C_SUCCESS | 函数执行成功 |
| LIOT_I2C_INIT_ERR | 传入参数错误 |
| LIOT_I2C_NOT_INIT_ERR | I2C 未初始化 |
| LIOT_I2C_INVALID_PARAM_ERR | 参数无效 |
| LIOT_I2C_WRITE_ERR | 向 I2C 写入数据失败 |
| LIOT_I2C_READ_ERR | 从 I2C 读取数据失败 |
| LIOT_I2C_RELEASE_ERR | 释放 I2C 总线失败 |

### 4.2 liot_i2c_channel_e

I2C 通道枚举。

1. 定义

```c
typedef enum
{
    liot_i2c_1 = 0, // i2c channel 1
    liot_i2c_2,     // i2c channel 2
    liot_i2c_3,     // i2c channel 3 (not support)
} liot_i2c_channel_e;
```

2. 参数说明

| 变量 | 说明 |
| ---- | ---- |
| liot_i2c_1 | I2C 总线编号为 1，对应引脚复用表 I2C0 |
| liot_i2c_2 | I2C 总线编号为 2，对应引脚复用表 I2C1 |
| liot_i2c_3 | I2C 总线编号为 3，当前模组不支持 |

### 4.3 liot_i2c_mode_e

I2C 工作模式枚举。

1. 定义

```c
typedef enum
{
    LIOT_STANDARD_MODE = 0, // Standard mode (100K)
    LIOT_FAST_MODE     = 1, // Fast mode (400K)
} liot_i2c_mode_e;
```

2. 参数说明

I2C 仅支持两种传输模式 STANDARD 和 FAST。

| 变量 | 说明 |
| ---- | ---- |
| LIOT_STANDARD_MODE | 标准模式，传输速度为 100 kbps |
| LIOT_FAST_MODE | 快速模式，传输速度为 400 kbps |

## 5 API 函数详解

### 5.1 liot_I2cInit

该函数用于初始化 I2C 总线。

1. 声明

```c
liot_errcode_i2c_e liot_I2cInit(liot_i2c_channel_e i2c_no, liot_i2c_mode_e Mode);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **Mode：** [In] I2C 的工作模式。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.2 liot_I2cWrite

该函数用于向 I2C 总线写入数据，仅用于从设备的寄存器地址长度为 8 位的数据写入。

1. 声明

```c
liot_errcode_i2c_e liot_I2cWrite(liot_i2c_channel_e i2c_no, uint8_t slave, uint8_t addr, uint8_t *data, uint32_t length);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **slave：** [In] I2C 从设备地址。
- **addr：** [In] I2C 从设备的寄存器地址。
- **data：** [In] 写入的数据。
- **length：** [In] 写入的数据长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.3 liot_I2cRead

该函数用于从 I2C 总线读取数据，仅用于从设备的寄存器地址长度为 8 位的数据读取。

1. 声明

```c
liot_errcode_i2c_e liot_I2cRead(liot_i2c_channel_e i2c_no, uint8_t slave, uint8_t addr, uint8_t *buf, uint32_t length);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **slave：** [In] I2C 从设备地址。
- **addr：** [In] I2C 从设备的寄存器地址。
- **buf：** [Out] 读取的数据。
- **length：** [In] 读取数据的长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.4 liot_I2cRelease

该函数用于释放 I2C 总线。若需要重新初始化同一个 I2C 总线，须调用该函数释放 I2C 总线，再重新调用 `liot_I2cInit()` 进行初始化。

1. 声明

```c
liot_errcode_i2c_e liot_I2cRelease(liot_i2c_channel_e i2c_no);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.5 liot_I2cWrite_16bit_addr

该函数用于向 I2C 总线写入数据，仅用于从设备的寄存器地址长度为 16 位的数据写入。

1. 声明

```c
liot_errcode_i2c_e liot_I2cWrite_16bit_addr(liot_i2c_channel_e i2c_no, uint8_t slave, uint16_t addr, uint8_t *data, uint32_t length);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **slave：** [In] I2C 从设备地址。
- **addr：** [In] I2C 从设备的寄存器地址。
- **data：** [In] 写入的数据。
- **length：** [In] 写入数据的长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.6 liot_I2cRead_16bit_addr

该函数用于从 I2C 总线读取数据，仅用于从设备的寄存器地址长度为 16 位的数据读取。

1. 声明

```c
liot_errcode_i2c_e liot_I2cRead_16bit_addr(liot_i2c_channel_e i2c_no, uint8_t slave, uint16_t addr, uint8_t *buf, uint32_t length);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **slave：** [In] I2C 从设备地址。
- **addr：** [In] I2C 从设备的寄存器地址。
- **buf：** [Out] 读取的数据。
- **length：** [In] 读取数据的长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.7 Liot_I2cWriteReg

从 I2C 总线写入数据，从设备的寄存器地址长度通过参数控制，可选 8 位或 16 位。

1. 声明

```c
liot_errcode_i2c_e Liot_I2cWriteReg(liot_i2c_channel_e i2c_no, uint8_t devAddr, uint16_t reg, BOOL addr16, const uint8_t *data, uint32_t len);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **devAddr：** [In] I2C 从设备地址。
- **reg：** [In] I2C 从设备的寄存器地址。
- **addr16：** [In] 寄存器长度是否为 16 位。0: 8 位，1: 16 位。
- **data：** [In] 写入的数据。
- **len：** [In] 写入数据的长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

### 5.8 Liot_I2cReadReg

从 I2C 总线读取数据，从设备的寄存器地址长度通过参数控制，可选 8 位或 16 位。

1. 声明

```c
liot_errcode_i2c_e Liot_I2cReadReg(liot_i2c_channel_e i2c_no, uint8_t devAddr, uint16_t reg, BOOL addr16, uint8_t *data, uint32_t len);
```

2. 参数

- **i2c_no：** [In] I2C 总线编号。
- **devAddr：** [In] I2C 从设备地址。
- **reg：** [In] I2C 从设备的寄存器地址。
- **addr16：** [In] 寄存器长度是否为 16 位。0: 8 位，1: 16 位。
- **data：** [Out] 读取的数据。
- **len：** [In] 读取数据的长度，单位：字节。

3. 返回值

错误码，见 `liot_errcode_i2c_e`。

## 6 代码示例

以下代码位于 `LSDK/examples/demo/src/demo_i2c.c`，演示了如何初始化多个 I2C 端口并在循环中定时针对 8 位和 16 位寄存器读写的示例。

```c
#include "lierda_app_main.h"
#include "liot_gpio2.h"
#include "liot_i2c.h"
#include "liot_os.h"

#define LIOT_I2C_SCL_BIT  67
#define LIOT_I2C_SCL_FUNC (2)

#define LIOT_I2C_SDA_BIT  66
#define LIOT_I2C_SDA_FUNC (2)

#define SalveAddr_w_8bit   (0x42 >> 1)
#define SalveAddr_r_8bit   (0x43 >> 1)

#define SalveAddr_w_16bit (0xa0 >> 1)
#define SalveAddr_r_16bit (0xa1 >> 1)

#define demo_for_8bit_or_16bit  (0)

void liot_i2c_demo_thread(void *arvg)
{
    int i2c_no = 0;
    int ret;
    int fastmode = 0;
    uint8_t read_data = 0;
#if demo_for_8bit_or_16bit
    uint8_t data = 0xaa;
#else
    uint8_t data = 0xab;
#endif

    liot_rtos_task_sleep_ms(200);

    liot_trace("I2C DEMO TEXT !!!");

    Liot_SetPinFunc(LIOT_I2C_SCL_BIT, LIOT_I2C_SCL_FUNC);
    Liot_SetPinFunc(LIOT_I2C_SDA_BIT, LIOT_I2C_SDA_FUNC);

    ret = liot_I2cInit(i2c_no, fastmode);
    if (ret != LIOT_I2C_SUCCESS)
    {
        liot_trace("I2C INIT FAILED[%d]", ret);
    }

    while (1)
    {
#if demo_for_8bit_or_16bit
        liot_I2cRead(i2c_no, SalveAddr_r_8bit, 0xf0, &read_data, 1);
        liot_trace("< read i2c value=0x%x, ret=%d >\n", read_data, ret);

        liot_I2cWrite(i2c_no, SalveAddr_w_8bit, 0x55, &data, 1);
        liot_trace("< write i2c value=0x%x, ret=%d >\n", data, ret);
#else
        ret = liot_I2cRead_16bit_addr(i2c_no, SalveAddr_r_16bit, 0x00ff, &read_data, 1);
        liot_trace("< read i2c value=0x%x, ret=%d >\n", read_data, ret);

        ret = liot_I2cWrite_16bit_addr(i2c_no, SalveAddr_w_16bit, 0x00ff, &data, 1);
        liot_trace("< write i2c value=0x%x, ret=%d >\n", data, ret);
#endif
        read_data = 0;
        liot_rtos_task_sleep_ms(200);
    }

    liot_rtos_task_delete(NULL);
}
```

## 7 常见问题

### 7.1 I2C 的速度是多少？

I2C 支持 4 种速度配置：

- Standard Speed (100kHz)
- Fast Speed (400kHz)
- Fast+ Speed (1MHz)
- High Speed (3.4MHz)（暂不支持）

### 7.2 深度休眠唤醒后 I2C 工作不正常？

建议在休眠前将 I2C 去初始化掉，将 I2C 的状态恢复，深度休眠唤醒后代码会重新跑，不用担心唤醒后初始化的问题。

