# SPI 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| **版本** | **日期** | **作者** | **修订内容** |
| ---- | ---- | ---- | ---- |
| Rev1.0 | 23-09-11 | TL | 创建文档 |
| Rev1.1 | 24-03-25 | SXX | 更改文档名称 |
| Rev1.2 | 25-01-14 | YMX | 1. 增加不同模组支持SPI参考引脚复用表说明 2. 取消所有函数链接，解决钉钉链接飞书问题 3. 删除最后章节完整代码，示例代码以SDK为准 |
| Rev1.3 | 25-04-18 | 张浩 | 增加系列常见问题 |
| Rev1.4 | 26-04-22 | ZXQ | 根据审核修改 |

## 1 简介

### 1.1 文档简介

本文档介绍 LTE-EC71X SPI 接口 API 情况， API 接口位于 ：

LSDK/components/kernel/lierda\_api/liot\_spi/liot\_spi.h 文件声明。

LTE-EC71X 系列模组支持最多 2 路 SPI，不同模组支持的SPI需参考对应的《引脚复用表》。

请至钉钉文档查看附件《Lierda NT26-FCN OpenCPU 引脚复用表.xlsx》。

请至钉钉文档查看附件《Lierda NT26-KCN OpenCPU 引脚复用表.xlsx》。

### 1.2 SPI 总线原理简介

串行外设接口（Serial Peripheral Interface，SPI）是一种同步串行通信接口，用于在微控制器和外围设备之间进行全双工、高速数据传输。

LTE-EC71X系列模组支持最多2路SPI总线（SPI0和SPI1），每路SPI支持以下功能特性：

主要功能特性：

1. **全双工同步通信**：支持同时发送和接收数据
2. **主从模式**：支持主从模式操作
3. **多从机支持**：每路SPI最多支持2个片选（CS0、CS1）
4. **可配置时钟频率**：支持812.5KHz、1.625MHz、3.25MHz、6.5MHz、13MHz多种时钟频率
5. **灵活的数据帧格式**：数据帧大小可配置（4~16位，默认8位）
6. **多种传输模式**：支持轮询、中断和DMA传输方式
7. **可配置时钟极性和相位**：支持4种SPI工作模式（CPOL/CPHA组合）
8. **MSB优先传输**：数据始终以最高有效位（MSB）优先的方式传输

通信接口：

- **MOSI**：主设备输出，从设备输入
- **MISO**：主设备输入，从设备输出
- **SCLK**：串行时钟，由主设备产生
- **CS**：片选信号，低电平有效（可配置）

## 2 API 函数概览

| **函数** | **说明** |
| ---- | ---- |
| `liot_spi_init()` | 该函数用于初始化 SPI |
| `liot_spi_init_ext()` | 该函数用于初始化 SPI（配置 SPI 总线参数） |
| `liot_spi_write_read()` | 该函数用于设置通过 SPI 同时发送和接收数据 |
| `liot_spi_read()` | 该函数用于设置通过 SPI 接收数据 |
| `liot_spi_write()` | 该函数用于设置通过 SPI 发送数据 |
| `liot_spi_release()` | 该函数用于释放 SPI 总线 |

## 3 类型说明

### 3.1 liot\_errcode\_spi\_e

SPI API 执行结果错误码。

1. 定义

```c
typedef enum
{
    LIOT_SPI_SET_CB_ERR = -1,
    LIOT_SPI_SUCCESS    = 0,
    LIOT_SPI_ERROR = 1 | (LIOT_COMPONENT_BSP_SPI << 16), // SPI总线其他错误
    LIOT_SPI_PARAM_TYPE_ERROR,                           //参数类型错误
    LIOT_SPI_PARAM_DATA_ERROR,                           //参数数据错误
    LIOT_SPI_PARAM_ACQUIRE_ERROR,                        //参数无法获取
    LIOT_SPI_PARAM_NULL_ERROR,                           //参数NULL错误
    LIOT_SPI_DEV_NOT_ACQUIRE_ERROR,                      //无法获取SPI总线
    LIOT_SPI_PARAM_LENGTH_ERROR,                         //参数长度错误
    LIOT_SPI_MALLOC_MEM_ERROR,                           //申请内存错误
    LIOT_SPI_ADDR_ALIGNED_ERROR,                         //地址不是4字节对齐
    LIOT_SPI_MUTEX_CREATE_ERROR,                         //互斥锁创建失败报错
    LIOT_SPI_MUTEX_LOCK_ERROR,                           //互斥锁上锁超时报错
    LIOT_SPI_UNKNOWN_ERROR,
} liot_errcode_spi_e;
```

2. 参数

- `LIOT_SPI_SET_CB_ERR`：设置回调失败。
- `LIOT_SPI_SUCCESS`：函数执行成功。
- `LIOT_SPI_ERROR`：函数执行失败。
- `LIOT_SPI_PARAM_TYPE_ERROR`：参数类型错误。
- `LIOT_SPI_PARAM_DATA_ERROR`：参数数据错误。
- `LIOT_SPI_PARAM_ACQUIRE_ERROR`：参数无法获取。
- `LIOT_SPI_PARAM_NULL_ERROR`：指针参数为 NULL。
- `LIOT_SPI_DEV_NOT_ACQUIRE_ERROR`：无法获取 SPI 总线。
- `LIOT_SPI_PARAM_LENGTH_ERROR`：参数长度错误。
- `LIOT_SPI_MALLOC_MEM_ERROR`：申请内存错误。
- `LIOT_SPI_ADDR_ALIGNED_ERROR`：地址不是 4 字节对齐(通常在DMA传输模式下会出现此错误)
- `LIOT_SPI_MUTEX_CREATE_ERROR`：互斥锁创建失败报错。
- `LIOT_SPI_MUTEX_LOCK_ERROR`：互斥锁上锁超时报错。
- `LIOT_SPI_UNKNOWN_ERROR`：未知错误。

### 3.2 liot\_spi\_config\_s

SPI 总线参数配置结构体定义如下：

1. 定义

```c
typedef struct{
    liot_spi_input_mode_e input_mode;
    liot_spi_port_e port;
    unsigned int framesize;
    liot_spi_clk_e spiclk;
    liot_spi_cs_pol_e cs_polarity0;
    liot_spi_cs_pol_e cs_polarity1;
    liot_spi_cpol_pol_e cpol;
    liot_spi_cpha_pol_e cpha;
    liot_spi_input_sel_e input_sel;
    liot_spi_transfer_mode_e transmode;
    liot_spi_cs_sel_e cs;
    liot_spi_clk_delay_e clk_delay;
    liot_spi_device_mode_e device_mode;
    liot_spi_data_msb_lsb_e data_msb_lsb;
    liot_spi_irq_callback irq_callback;
} liot_spi_config_s;
```

2. 参数

| **类型** | **参数** | **描述** |
| ---- | ---- | ---- |
| liot\_spi\_input\_mode\_e | input\_mode | SPI 输入功能 |
| liot\_spi\_port\_e | port | SPI 总线编号，仅支持LIOT\_SPI\_PORT0和LIOT\_SPI\_PORT1 |
| unsigned int | framesize | 数据帧大小。范围：4～16；默认值：8；单位：bit |
| liot\_spi\_clk\_e | spiclk | SPI 时钟频率 |
| liot\_spi\_cs\_pol\_e | cs\_polarity0 | CS0 引脚电平 |
| liot\_spi\_cs\_pol\_e | cs\_polarity1 | CS1 引脚电平 |
| liot\_spi\_cpol\_pol\_e | cpol | 时钟极性 |
| liot\_spi\_cpha\_pol\_e | cpha | 时钟相位 |
| liot\_spi\_input\_sel\_e | input\_sel | 数据输入引脚 |
| liot\_spi\_transfer\_mode\_e | transmode | SPI 传输模式 |
| liot\_spi\_cs\_sel\_e | cs | CS 引脚 |
| liot\_spi\_clk\_delay\_e | clk\_delay | MISO 延时采样 |
| liot\_spi\_device\_mode\_e | device\_mode | 主从模式以及主从单线模式选择 |
| liot\_spi\_data\_msb\_lsb\_e | data\_msb\_lsb | msb first or lsb first |
| liot\_spi\_irq\_callback | irq\_callback | spi传输完成回调函数 |

### 3.3 liot\_spi\_input\_mode\_e

SPI 输入功能枚举定义如下：

1. 定义

```c
typedef enum{
    LIOT_SPI_INPUT_FALSE, // SPI不允许输入（读取）
    LIOT_SPI_INPUT_TRUE,  // SPI允许输入（读取）
} liot_spi_input_mode_e;
```

2. 参数

- `LIOT_SPI_INPUT_FALSE`：禁用 SPI 输入（读取）功能。
- `LIOT_SPI_INPUT_TRUE`：启用 SPI 输入（读取）功能。

### 3.4 liot\_spi\_port\_e

SPI 总线编号枚举定义如下：

1. 定义

```c
typedef enum{
    LIOT_SPI_PORT0, // SPI0总线
    LIOT_SPI_PORT1, // SPI1总线
} liot_spi_port_e;
```

2. 参数

- `LIOT_SPI_PORT0`：SPI0 总线。
- `LIOT_SPI_PORT1`：SPI1 总线。

### 3.5 liot\_spi\_clk\_e

SPI 时钟频率枚举定义如下：

1. 定义

```c
typedef enum{
    LIOT_SPI_CLK_INVALID  = -1,       //无效时钟选择
    LIOT_SPI_CLK_812_5KHZ = 812500,   //时钟：812.5K
    LIOT_SPI_CLK_1_625MHZ = 1625000,  //时钟：1.625M
    LIOT_SPI_CLK_3_25MHZ  = 3250000,  //时钟：3.125M
    LIOT_SPI_CLK_6_5MHZ   = 6500000,  //时钟：6.5M
    LIOT_SPI_CLK_13MHZ    = 13000000, //时钟：13M
} liot_spi_clk_e;
```

2. 参数

- `LIOT_SPI_CLK_INVALID`：无效参数。
- `LIOT_SPI_CLK_812_5KHZ`：时钟频率为 812.5 kHz。
- `LIOT_SPI_CLK_1_625MHZ`：时钟频率为 1.625 MHz。
- `LIOT_SPI_CLK_3_25MHZ`：时钟频率为 3.25 MHz。
- `LIOT_SPI_CLK_6_5MHZ`：时钟频率为 6.5 MHz。
- `LIOT_SPI_CLK_13MHZ`：时钟频率为 13 MHz。

注意：这几个枚举值只是几个常用的时钟频率，其他的也支持，直接配置对应的数值就可以，比如10k(10000)、80k(80000)等等。

### 3.6 liot\_spi\_cs\_pol\_e

CS 引脚电平枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_CS_ACTIVE_HIGH, // SPI总线操作时，CS脚为高
        LIOT_SPI_CS_ACTIVE_LOW,  // SPI总线操作时，CS脚为低
    } liot_spi_cs_pol_e;
```

2. 参数

- LIOT\_SPI\_CS\_ACTIVE\_HIGH：SPI 总线操作时，CS 脚为高。
- LIOT\_SPI\_CS\_ACTIVE\_LOW：SPI 总线操作时，CS 脚为低。

### 3.7 liot\_spi\_cpol\_pol\_e

时钟极性枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_CPOL_LOW = 0, // SPI未使能时，CLK线为低电平，第一个边沿是上升沿
        LIOT_SPI_CPOL_HIGH,    // SPI未使能时，CLK线为高电平，第一个边沿是下降沿
    } liot_spi_cpol_pol_e;
```

2. 参数

- LIOT\_SPI\_CPOL\_LOW ：SPI 未使能时，CLK 线为低电平，第一个边沿是上升沿。
- LIOT\_SPI\_CPOL\_HIGH：SPI 未使能时，CLK 线为高电平，第一个边沿是下降沿。

### 3.8 liot\_spi\_cpha\_pol\_e

时钟相位枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_CPHA_1Edge, // 在第一个边沿采样
        LIOT_SPI_CPHA_2Edge,  //在第二个边沿采样
    } liot_spi_cpha_pol_e;
```

2. 参数

LIOT\_SPI\_CPHA\_1Edge：数据采样从第一个时钟边沿开始。

LIOT\_SPI\_CPHA\_2Edge：数据采样从第二个时钟边沿开始。

### 3.9 liot\_spi\_input\_sel\_e

数据输入引脚枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_DI_0 = 0, //选择DI0为数据输入引脚,not use now
        LIOT_SPI_DI_1,     //选择DI1为数据输入引脚
        LIOT_SPI_DI_2,     //选择DI2为数据输入引脚,not use now
    } liot_spi_input_sel_e;
```

2. 参数

LIOT\_SPI\_DI\_0 ：DI0 为数据输入引脚（暂不支持）

LIOT\_SPI\_DI\_1：DI1 为数据输入引脚

LIOT\_SPI\_DI\_2：DI2 为数据输入引脚（暂不支持）

注意：MISO引脚目前不支持配置，使用默认DI1就可以。

### 3.10 liot\_spi\_transfer\_mode\_e

SPI 传输模式枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_DIRECT_POLLING = 0, // FIFO读写，轮询等待
        LIOT_SPI_DIRECT_IRQ,         // FIFO读写，中断通知
        LIOT_SPI_DMA_IRQ,            // DMA读写， 中断通知
    } liot_spi_transfer_mode_e;
```

2. 参数

LIOT\_SPI\_DIRECT\_POLLING ：FIFO 读写，轮询等待。

LIOT\_SPI\_DIRECT\_IRQ：FIFO 读写，中断通知。

LIOT\_SPI\_DMA\_IRQ：DMA 读写， 中断通知。

### 3.11 liot\_spi\_cs\_sel\_e

CS 引脚枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_CS0 = 0, //选择cs0为SPI片选CS引脚
        LIOT_SPI_CS1,     //选择cs1为SPI片选CS引脚
        LIOT_SPI_CS2,     //选择cs2为SPI片选CS引脚,not use now
        LIOT_SPI_CS3,     //选择cs3为SPI片选CS引脚,not use now
    } liot_spi_cs_sel_e;
```

2. 参数

LIOT\_SPI\_CS0 ：CS0 为 SPI 的 CS 引脚。

LIOT\_SPI\_CS1：CS1 为 SPI 的 CS 引脚。

LIOT\_SPI\_CS2：CS2 为 SPI 的 CS 引脚（暂不支持）。

LIOT\_SPI\_CS3：CS3 为 SPI 的 CS 引脚（暂不支持）。

### 3.12 liot\_spi\_clk\_delay\_e

MISO 延时采样枚举定义如下：

1. 声明

```c
typedef enum{
        LIOT_SPI_CLK_DELAY_0 = 0,  //无delay, 默认状态
        LIOT_SPI_CLK_DELAY_1,      // MISO delay一个边沿采样
    } liot_spi_clk_delay_e;
```

2. 参数

LIOT\_SPI\_CLK\_DELAY\_0 ：MISO 无延时采样。

LIOT\_SPI\_CLK\_DELAY\_1：MISO 延时一个时钟边沿采样。

### 3.13 liot\_spi\_device\_mode\_e

device mode枚举定义如下：

1. 声明

```c
typedef enum
    {
        LIOT_SPI_DEVICE_MODE_INVALID = 0,
        LIOT_SPI_DEVICE_MODE_MASTER, // SPI master mode, full duplex
        LIOT_SPI_DEVICE_MODE_SLAVE,  // SPI slave mode, full duplex
        LIOT_SPI_DEVICE_MODE_MASTER_SIMPLEX, // SPI master mode, half duplex, shared MOSI for transmit/receive
        LIOT_SPI_DEVICE_MODE_SLAVE_SIMPLEX,  // SPI slave mode, half duplex, shared MISO for transmit/receive
    } liot_spi_device_mode_e;
```

2. 参数

- LIOT\_SPI\_DEVICE\_MODE\_INVALID：无效模式
- LIOT\_SPI\_DEVICE\_MODE\_MASTER：master模式
- LIOT\_SPI\_DEVICE\_MODE\_SLAVE：slave模式
- LIOT\_SPI\_DEVICE\_MODE\_MASTER\_SIMPLEX：master模式，半双工，共享MOSI收发
- LIOT\_SPI\_DEVICE\_MODE\_SLAVE\_SIMPLEX：slave模式，半双工，共享MISO收发

### 3.14 liot\_spi\_data\_msb\_lsb\_e

msb\_lsb枚举定义如下：

1. 声明

```c
typedef enum
    {
        LIOT_SPI_DATA_MSB_LSB = 0,  // MSB first
        LIOT_SPI_DATA_LSB_MSB,      // LSB first
    } liot_spi_data_msb_lsb_e;
```

2. 参数

- LIOT\_SPI\_DATA\_MSB\_LSB：MSB first
- LIOT\_SPI\_DATA\_LSB\_MSB：LSB first

### 3.15 liot\_spi\_irq\_callback

回调类型定义如下：

1. 声明

```c
typedef void (*liot_spi_irq_callback)(uint32_t event);
```

2. 参数

这是一个函数指针，spi传输完成之后，会在中断中回调这个函数。

## 4 API 函数详解

### 4.1 liot\_spi\_init

该函数用于初始化 SPI，应在使用 SPI 其他 API 前调用。调用该函数前，需通过 liot\_pin\_set\_func(具体参考demo调用)设置指定 GPIO 引脚为 SPI 功能。

其中 liot\_spi\_config\_s 默认配置如下：

```c
struct liot_spi_config_s defaultCfg{
    .input_mode = LIOT_SPI_INPUT_TRUE,       // 是否使能read功能
    .framesize = 8,                          // 一次传输的bit数
    .cs_polarity0 = LIOT_SPI_CS_ACTIVE_LOW,  // cs0低电平有效
    .cs_polarity1 = LIOT_SPI_CS_ACTIVE_LOW,  // cs1低电平有效
    .cpol = LIOT_SPI_CPOL_LOW,               // spi clk初始电平为低电平
    .cpha = LIOT_SPI_CPHA_1Edge,             // 在spi clk第一个边沿采样，上升沿
    .input_sel = LIOT_SPI_DI_1,              // MISO使用默认引脚，不能配置其他
    .cs = LIOT_SPI_CS0,                      // 使用CS0
    .clk_delay = LIOT_SPI_CLK_DELAY_0        // 采样不设置延迟
};
```

1. 声明

```c
liot_errcode_spi_e liot_spi_init(liot_spi_port_e port,
                                   liot_spi_transfer_mode_e transmode,
                                   liot_spi_clk_e spiclk);
```

2. 参数
   
   port：\[In\] SPI 总线编号。
   
   transmode：\[In\] SPI 传输模式。
   
   spiclk：\[In\] SPI 时钟频率。
3. 返回值

- liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

### 4.2 liot\_spi\_init\_ext

该函数用于初始化 SPI（配置 SPI 总线参数），应在使用 SPI 其他 API 前调用。

该函数可用于选择 SPI 总线、配置 SPI 输入功能、时钟频率、数据帧大小、CS 引脚和引脚电平、时钟极性、时钟相位、数据输入引脚、传输模式及 MISO 延时采样。调用此函数前，需通过 liot\_pin\_set\_func（）设置相关 GPIO 引脚为 SPI 功能。

1. 声明

```c
liot_errcode_spi_e liot_spi_init_ext(liot_spi_config_s spi_config);
```

2. 参数
   
   spi\_config：\[In\] SPI 总线参数配置。
3. 返回值

liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

注意：有两个初始化函数，liot\_spi\_init和liot\_spi\_init\_ext，这两个区别是liot\_spi\_init只能配置port、传输模式以及clk；

而liot\_spi\_init\_ext函数通过liot\_spi\_config\_s结构，可以配置spi相关的所有设置。

### 4.3 liot\_spi\_write\_read

该函数用于设置通过 SPI 同时发送和接收数据(全双工模式，同时发送和接收，必须有发送buf和接收buf)。

1. 声明

```c
liot_errcode_spi_e liot_spi_write_read(liot_spi_port_e port,
                                        unsigned char *inbuf,
                                        unsigned char *outbuf,
                                        unsigned int len);
```

2. 参数
   
   port：\[In\] SPI 总线编号。
   
   inbuf：\[Out\] 接收数据。
   
   outbuf：\[In\] 发送数据。
   
   len: \[In\] 发送和接收数据的长度。
3. 返回值

liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

### 4.4 liot\_spi\_read

该函数用于设置通过 SPI 接收数据。

1. 声明

```c
liot_errcode_spi_e liot_spi_read(liot_spi_port_e port,
                          unsigned char *buf,
                          unsigned int len);
```

2. 参数
   
   port：\[in\] SPI 总线编号。
   
   buf：\[Out\] 接收数据。
   
   len：\[In\] 接收数据的长度。单位：字节。
3. 返回值

liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

### 4.5 liot\_spi\_write

该函数用于设置通过 SPI 发送数据。

1. 声明

```c
liot_errcode_spi_e liot_spi_write(liot_spi_port_e port,
                          unsigned char *buf,
                          unsigned int len);
```

2. 参数
   
   port：\[In\] SPI 总线编号。
   
   buf：\[In\] 发送数据。
   
   len：\[In\] 发送数据的长度。单位：字节。
3. 返回值

liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

### 4.6 liot\_spi\_release

该函数用于释放 SPI 总线。

1. 声明

```c
liot_errcode_spi_e liot_spi_release(liot_spi_port_e port);
```

2. 参数
   
   port：\[In\] SPI 总线编号。
3. 返回值

liot\_errcode\_spi\_e：执行结果码，请参考 4.1。

## 5 代码示例

### 5.1 示例代码参考

LSDK/examples/demo/src/demo\_spi.c 文件。

```c
#include "lierda_app_main.h"
#include "liot_gpio2.h"
#include "liot_os.h"
#include "liot_spi.h"
#include <string.h>

// Define SPI pin configurations for different chips
#define LIOT_CUR_SPI0_MOSI_PIN_MUN (85)
#define LIOT_CUR_SPI0_MISO_PIN_MUN (84)
#define LIOT_CUR_SPI0_CLK_PIN_MUN  (86)
#define LIOT_CUR_SPI0_CS0_PIN_MUN  (83)
#define LIOT_CUR_SPI_PIN_FUNC      (1)


/** @brief Switch for testing SPI master mode, 1 for enabled, 0 for disabled */
#define SPI_MASTER_DEMO 0

/** @brief Switch for testing SPI slave mode, 1 for enabled, 0 for disabled */
#define SPI_SLAVE_DEMO  1

/** @brief Clock speed for SPI testing */
#define SPI_DEMO_CLK_SPEED          8000000U

/** @brief Length of test data */
#define TEST_DATA_LEN              (128)

/** @brief Test data buffer for writing */
unsigned char demo_data_w[TEST_DATA_LEN] = {0};

/** @brief Test data buffer for reading */
unsigned char demo_data_r[TEST_DATA_LEN] = {0};

/**
 * @brief Transfer completion flag in SPI slave mode
 */
uint8_t isTransferDone = 0;

/**
 * @brief Interrupt callback function in SPI slave mode
 *        This function is called when the SPI transfer is completed or an error occurs.
 * @param event Event flag indicating the transfer status
 */
void liot_spi_demo_callback(uint32_t event)
{
    uint8_t i = 0;
    if(event & LIOT_SPI_EVENT_TRANSFER_COMPLETE)
    {
        isTransferDone = 1;
    }
    else
    {
        liot_trace("spi_demo_callback error %d", event);
        for(i = 0; i < TEST_DATA_LEN; i++)
        {
            liot_trace("[%d]Input:0x%x", i, demo_data_r[i]);
        }
    }
}

/**
 * @brief Thread function for SPI master mode testing
 *        This function initializes the SPI master mode and performs data write and read operations in a loop.
 * @param argv Thread parameters
 */
#if SPI_MASTER_DEMO == 1
void liot_spi_demo_thread(void *argv)
{
    unsigned char i = 1;

    // Configuration structure for SPI settings, used to initialize the SPI master mode.
    liot_spi_config_s cfg = {
        .input_mode = LIOT_SPI_INPUT_TRUE,
        .port = LIOT_SPI_PORT0,
        .framesize = 8,
        .spiclk = SPI_DEMO_CLK_SPEED,
        .cs_polarity0 = LIOT_SPI_CS_ACTIVE_LOW,
        .cs_polarity1 = LIOT_SPI_CS_ACTIVE_LOW,
        .cpol = LIOT_SPI_CPOL_HIGH,
        .cpha = LIOT_SPI_CPHA_2Edge,
        .input_sel = LIOT_SPI_DI_1,
        .transmode = LIOT_SPI_DIRECT_POLLING,
        .cs = LIOT_SPI_CS0,
        .clk_delay = LIOT_SPI_CLK_DELAY_0,
        .device_mode = LIOT_SPI_DEVICE_MODE_MASTER,
        .data_msb_lsb = LIOT_SPI_DATA_MSB_LSB,
        .irq_callback = NULL,
    };

    Liot_SetPinFunc(LIOT_CUR_SPI0_MOSI_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    Liot_SetPinFunc(LIOT_CUR_SPI0_MISO_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    Liot_SetPinFunc(LIOT_CUR_SPI0_CLK_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    liot_spi_init_ext(cfg);

    while (1)
    {
        liot_rtos_task_sleep_ms(5000);

        liot_trace("spi demo master running...");
        memset(demo_data_w, i++, TEST_DATA_LEN);
        memset(demo_data_r, 0, TEST_DATA_LEN);

        liot_spi_write_read(LIOT_SPI_PORT0, demo_data_r, demo_data_w, TEST_DATA_LEN);

        liot_trace("Output:0x%x,0x%x,0x%x", demo_data_w[0], demo_data_w[TEST_DATA_LEN/2], demo_data_w[TEST_DATA_LEN-1]);
        liot_trace("Input :0x%x,0x%x,0x%x", demo_data_r[0], demo_data_r[TEST_DATA_LEN/2], demo_data_r[TEST_DATA_LEN-1]);
    }
    liot_rtos_task_delete(NULL);
}
#elif SPI_SLAVE_DEMO == 1

/**
 * @brief Thread function for SPI slave mode testing
 *        This function initializes the SPI slave mode and performs data read and write operations in a loop,
 *        waiting for the transfer to complete.
 *
 * @param argv Thread parameters
 */
void liot_spi_demo_thread(void *argv)
{
    unsigned char i = 1;
    uint32_t timeOut_ms = 5000;

    // Configuration structure for SPI settings, used to initialize the SPI slave mode.
    liot_spi_config_s cfg = {
        .input_mode = LIOT_SPI_INPUT_TRUE,
        .port = LIOT_SPI_PORT0,
        .framesize = 8,
        .spiclk = SPI_DEMO_CLK_SPEED,
        .cs_polarity0 = LIOT_SPI_CS_ACTIVE_LOW,
        .cs_polarity1 = LIOT_SPI_CS_ACTIVE_LOW,
        .cpol = LIOT_SPI_CPOL_HIGH,
        .cpha = LIOT_SPI_CPHA_2Edge,
        .input_sel = LIOT_SPI_DI_1,
        .transmode = LIOT_SPI_DMA_IRQ,
        .cs = LIOT_SPI_CS0,
        .clk_delay = LIOT_SPI_CLK_DELAY_0,
        .device_mode = LIOT_SPI_DEVICE_MODE_SLAVE,
        .data_msb_lsb = LIOT_SPI_DATA_MSB_LSB,
        .irq_callback = liot_spi_demo_callback,
    };

    Liot_SetPinFunc(LIOT_CUR_SPI0_MOSI_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    Liot_SetPinFunc(LIOT_CUR_SPI0_MISO_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    Liot_SetPinFunc(LIOT_CUR_SPI0_CLK_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    Liot_SetPinFunc(LIOT_CUR_SPI0_CS0_PIN_MUN, LIOT_CUR_SPI_PIN_FUNC);
    liot_spi_init_ext(cfg);

    while (1)
    {
        liot_trace("spi demo slave running...");
        memset(demo_data_w, i++, TEST_DATA_LEN);
        memset(demo_data_r, 0, TEST_DATA_LEN);
        timeOut_ms = 5000;

        liot_spi_write_read(LIOT_SPI_PORT0, demo_data_r, demo_data_w, TEST_DATA_LEN);

        do {
            liot_rtos_task_sleep_ms(1);
        } while ((isTransferDone == false) && --timeOut_ms);

        if(timeOut_ms == 0)
            liot_trace("Slave receive failed for timeout\n");

        liot_trace("Output:0x%x,0x%x,0x%x", demo_data_w[0], demo_data_w[TEST_DATA_LEN/2], demo_data_w[TEST_DATA_LEN-1]);
        liot_trace("Input :0x%x,0x%x,0x%x", demo_data_r[0], demo_data_r[TEST_DATA_LEN/2], demo_data_r[TEST_DATA_LEN-1]);
    }
    liot_rtos_task_delete(NULL);
}
#endif
```

示例代码有master和slave两种测试模式，根据需要选择。我们打开#define SPI\_MASTER\_DEMO宏，使用主模式测试。

短接模组MISO和MOSI，使用逻辑分析仪及日志工具抓取波形与日志，运行结果如下：

<div align="center">

<img src="_images/SPI开发指导/image_1.png" width="600"/>

</div>

<div align="center">

<img src="_images/SPI开发指导/image_2.png" width="600"/>

</div>

如上图所示，日志打印数据0xab与MOSI、MISO输出一致，表明 SPI 通讯成功。

## 6 常见问题

### 6.1 EC718 的 CSPI 帧结构遵循的是哪家的协议？

MTK 的协议。

### 6.2 SPI 支持 MSB 还是 LSB？

只支持 MSB。

