# GPIO2 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| **版本** | **日期** | **作者** | **审核** | **修订内容** |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | 创建文档 |
| Rev1.1 | 2026-04-24 | ljz | zlc | 优化文档 |

## 1 简介

本文档介绍 LTE-EC71X GPIO 接口 API 情况，API 接口位于 `liot_gpio2.h` 文件声明。

引脚和 GPIO 对应功能请参考[《Lierda NT26F6B0\_NT26F6D0系列 OpenCPU 引脚复用表》](Lierda%20NT26F6B0_NT26F6D0系列%20OpenCPU%20引脚复用表.xlsx)与[《Lierda K2B&K2F系列 OpenCPU 引脚复用表》](Lierda%20K2B&K2F系列%20OpenCPU%20引脚复用表.xlsx)。

## 2 核心概念说明

为便于理解后续 API，先对普通 GPIO、AGPIO、WAKEUP 及电源域相关概念进行说明。

| 类型 | 是否支持输出 | 是否支持输入/中断 | 休眠时是否可保持电平 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| 普通 GPIO | 支持 | 支持 | 否 | 由普通 IO 电源域供电，系统正常启动后，所在电源域自动上电，休眠时对应电源域将会掉电。 |
| AGPIO | 支持 | 支持 | 是 | 属于 AON（Always On）电源域，系统正常启动后，需软件控制开启，适合低功耗保持输出 |
| WAKEUP Pad | WAKEUP 0-2 不能输出；WAKEUP 3-5可以复用为GPIO进行输出 | WAKEUP 0-2 只可作为中断脚；WAKEUP 3-5支持中断，也可复用为GPIO进行输入 | 不适用 | 主要用作中断脚，支持低功耗唤醒 |

**休眠唤醒配置说明：**

1. 普通 GPIO 在休眠时可能因电源域关闭而失去配置状态，唤醒后建议根据业务需要重新初始化；
2. AGPIO 适用于休眠期间保持输出电平，但使用前需确保 AON 电源域已开启；
3. WAKEUP 引脚用于低功耗唤醒，其配置与普通 GPIO 不同，使用时应按专用接口进行初始化；
4. 除 WAKEUP Pad 外，某些平台/场景下 PWRKEY 也可作为唤醒源，是硬件唤醒，不属于本文档 `liot_wakeuppad_e` 枚举范围；
5. 对于深度休眠或平台复位类唤醒场景，建议在系统启动流程中重新执行 GPIO/引脚复用相关配置。

## 3 API 函数概览

### 3.1 GPIO 基础配置

| **函数** | **说明** |
| ---- | ---- |
| `Liot_GpioInit` | GPIO 初始化接口 |
| `Liot_GpioGetLevel` | 获取 GPIO 电平接口 |
| `Liot_GpioSetLevel` | GPIO 设置电平 |

### 3.2 GPIO 中断控制

| **函数** | **说明** |
| ---- | ---- |
| `Liot_GpioIntEnable` | 使能普通 gpio 中断源 |
| `Liot_GpioIntDisable` | 关闭普通 gpio 中断源 |

### 3.3 电源域配置

| **函数** | **说明** |
| ---- | ---- |
| `Liot_AonPowerCtl` | 控制 AGPIO 电源域开关 |
| `Liot_SetVoltage` | 设置电源域电压 |

### 3.4 引脚复用配置

| **函数** | **说明** |
| ---- | ---- |
| `Liot_SetPinFunc` | 设置模组引脚复用功能 |
| `Liot_GetPinFunc` | 获取模组引脚复用功能 |

### 3.5 WAKEUP 配置

| **函数** | **说明** |
| ---- | ---- |
| `Liot_WakeupIntInit` | 初始化 wakeup 引脚中断 |
| `Liot_WakeupIntDeinit` | 去初始化 wakeup 引脚中断 |
| `Liot_WakeupPadGetLevel` | 获取wakeup 引脚电平 |

## 4 类型说明

### 4.1 liot_gpioerr_e

枚举定义：

```c
typedef enum {
    L_GPIO_ERR_SUCCESS  = LIOT_SUCCESS,                    /*!< Operation was successful */
    L_GPIO_ERR_EXECUTE  = 1 | LIOT_GPIO_ERRCODE_BASE,      /*!< General execution error */
    L_GPIO_ERR_INVALID_PARAM,                              /*!< Invalid input parameter */
    L_GPIO_ERR_OPEN,                                       /*!< Failed to open GPIO */
    L_GPIO_ERR_CONFIG,                                     /*!< Configuration failed */
    L_GPIO_ERR_PULL_SET,                                   /*!< Pull resistor setup failed */
    L_GPIO_ERR_CALLBACK,                                   /*!< Callback registration failed */
    L_GPIO_ERR_LEVEL_TRIGGER                               /*!< Level trigger configuration failed */
} liot_gpioerr_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_GPIO_ERR_SUCCESS | 执行成功 |
| L_GPIO_ERR_EXECUTE | 通用异常错误 |
| L_GPIO_ERR_INVALID_PARAM | 输入参数无效 |
| L_GPIO_ERR_OPEN | 打开失败 |
| L_GPIO_ERR_CONFIG | 配置接口失败 |
| L_GPIO_ERR_PULL_SET | 设置上拉失败 |
| L_GPIO_ERR_CALLBACK | 注册回调函数失败 |
| L_GPIO_ERR_LEVEL_TRIGGER | 设置中断触发失败 |

### 4.2 liot_gpio_e

枚举定义：

```c
typedef enum
{
    L_GPIO_0 = 0,     /*!< GPIO 0 */
    L_GPIO_1,         /*!< GPIO 1 */
    L_GPIO_2,         /*!< GPIO 2 */
    ...
    L_GPIO_38,        /*!< GPIO 38 */
    L_GPIO_MAX        /*!< Maximum index for GPIO pin numbers (not a valid pin) */
} liot_gpio_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_GPIO_0 ~ L_GPIO_38 | GPIO 0 ~ GPIO 38 |
| L_GPIO_MAX | 枚举最大值 |

### 4.3 liot_gpiodir_e

gpio 输入输出模式。

枚举定义：

```c
typedef enum
{
    L_IO_INPUT,      /*!< Configure the GPIO as an input pin */
    L_IO_OUTPUT,     /*!< Configure the GPIO as an output pin */
} liot_gpiodir_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_IO_INPUT | GPIO 输入模式 |
| L_IO_OUTPUT | GPIO 输出模式 |

### 4.4 liot_gpiolvl_e

gpio 电平。

枚举定义：

```c
typedef enum {
    L_IO_LOW,       /*!< Logic low level (0V or GND) */
    L_IO_HIGH,      /*!< Logic high level */
    L_IO_NONE       /*!< Unknown logic level */
} liot_gpiolvl_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_IO_LOW | 配置为输出时：默认输出低电平；配置为输入时：下拉输入 |
| L_IO_HIGH | 配置为输出时：默认输出高电平；配置为输入时：上拉输入 |
| L_IO_NONE | 配置为输出时：不设置输出电平；配置为输入时：浮空输入 |

### 4.5 liot_intsig_e

中断触发模式。

枚举定义：

```c
typedef enum {
    L_INT_SIG_NONE      = 0U,
    L_INT_LEVEL_LOW     = 1U,        /*!< Trigger interrupt on level low */
    L_INT_LEVEL_HIGH    = 2U,        /*!< Trigger interrupt on level high */
    L_INT_EDGE_FALL     = 3U,        /*!< Trigger interrupt on signal edge falling */
    L_INT_EDGE_RISE     = 4U,        /*!< Trigger interrupt on signal edge rising */
    L_INT_EDGE_BOTH     = 5U,        /*!< Trigger interrupt on both rising and falling edges */
} liot_intsig_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_INT_SIG_NONE | 不配置中断触发 |
| L_INT_LEVEL_LOW | 低电平触发 |
| L_INT_LEVEL_HIGH | 高电平触发 |
| L_INT_EDGE_FALL | 下降沿触发 |
| L_INT_EDGE_RISE | 上升沿触发 |
| L_INT_EDGE_BOTH | 双边沿触发 |

### 4.6 liot_wakeuppad_e

wakeup 唤醒源。

枚举定义：

```c
typedef enum
{
    L_WAKEUPAD_0 = 0,       /*!< Wakeup source 0 */
    L_WAKEUPAD_1,           /*!< Wakeup source 1 */
    L_WAKEUPAD_2,           /*!< Wakeup source 2 */
    L_WAKEUPAD_3,           /*!< Wakeup source 3 */
    L_WAKEUPAD_4,           /*!< Wakeup source 4 */
    L_WAKEUPAD_5            /*!< Wakeup source 5 */
} liot_wakeuppad_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_WAKEUPAD_0 ~ L_WAKEUPAD_5 | wakeup 唤醒源 0 ~ 5 |

### 4.7 liot_volt_e

引脚电压。

枚举定义：

```c
typedef enum
{
    // @ 1.8V level
    L_VOLT_1_65V = 0,
    L_VOLT_1_70V,
    L_VOLT_1_75V,
    L_VOLT_1_80V,
    L_VOLT_1_85V,
    L_VOLT_1_90V,
    L_VOLT_1_95V,
    L_VOLT_2_00V,

    // @ 2.8V level
    L_VOLT_2_65V = 8,
    L_VOLT_2_70V,
    L_VOLT_2_75V,
    L_VOLT_2_80V,
    L_VOLT_2_85V,
    L_VOLT_2_90V,
    L_VOLT_2_95V,
    L_VOLT_3_00V,

    // @ 3.3V level
    L_VOLT_3_05V = 16,
    L_VOLT_3_10V,
    L_VOLT_3_15V,
    L_VOLT_3_20V,
    L_VOLT_3_25V,
    L_VOLT_3_30V,
    L_VOLT_3_35V,
    L_VOLT_3_40V,
} liot_volt_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_VOLT_1_65V ~ L_VOLT_2_00V | 1.8V 档位电压（1.65V ~ 2.00V） |
| L_VOLT_2_65V ~ L_VOLT_3_00V | 2.8V 档位电压（2.65V ~ 3.00V） |
| L_VOLT_3_05V ~ L_VOLT_3_40V | 3.3V 档位电压（3.05V ~ 3.40V） |

### 4.8 liot_powerdomain_e

电源域配置。

枚举定义：

```c
typedef enum
{
    L_DOMAIN_NORMAL = 0,
    L_DOMAIN_AON,
    L_DOMAIN_ALL
} liot_powerdomain_e;
```

枚举说明：

| **变量** | **说明** |
| ---- | ---- |
| L_DOMAIN_NORMAL | 普通 GPIO 口电源域 |
| L_DOMAIN_AON | AGPIO 口电源域 |
| L_DOMAIN_ALL | 普通 GPIO 口 + AGPIO 口电源域 |

### 4.9 liot_pinfunc_e

引脚复用功能编号，用于配置指定物理引脚的功能复用模式。

注意事项：

1. `liot_pinfunc_e` 仅表示引脚复用选择值，不直接表示固定功能名称。
2. 不同模组引脚在 L_PIN_FUNC_0 ~ L_PIN_FUNC_7 下所对应的实际功能可能不同，例如 GPIO、UART、SPI、I2C 等，具体请以对应型号的复用表为准。
3. 建议在调用 `Liot_SetPinFunc()` 前，先根据模组型号查阅引脚复用表，确认目标物理引脚支持的功能及对应的 func_sel 取值。

枚举定义：

```c
typedef enum
{
    L_PIN_FUNC_0 = 0U,
    L_PIN_FUNC_1 = 1U,
    L_PIN_FUNC_2 = 2U,
    L_PIN_FUNC_3 = 3U,
    L_PIN_FUNC_4 = 4U,
    L_PIN_FUNC_5 = 5U,
    L_PIN_FUNC_6 = 6U,
    L_PIN_FUNC_7 = 7U,
    L_PIN_FUNC_UNKNOWN = 0xFF
} liot_pinfunc_e;
```

枚举说明：

| **变量** | **说明（功能参考引脚复用表）** |
| ---- | ---- |
| L_PIN_FUNC_0 ~ L_PIN_FUNC_7 | 引脚复用功能 0 ~ 7 |
| L_PIN_FUNC_UNKNOWN | 引脚复用功能未知 |

### 4.10 liot_intcb_t

中断参数配置。

- 中断回调函数运行在中断上下文中，不应执行耗时操作；
- 不应在回调中调用阻塞类接口；
- 若需执行复杂业务逻辑，建议在回调中仅做标志置位或发送事件，再由任务上下文处理。

结构体定义：

```c
typedef struct
{
    liot_intsig_e signal;
    void (*callback)(void* arg);
    void* arg;
} liot_intcb_t;
```

结构体变量说明：

| **变量** | **说明** |
| ---- | ---- |
| signal | 中断触发方式，见 `liot_intsig_e` |
| callback | 中断回调函数，函数原型为 `void (*callback)(void* arg)` |
| arg | 中断回调参数 |

## 5 API 函数详解

### 5.1 Liot_GpioInit

GPIO 初始化。调用 `Liot_GpioInit()` 前，请确保目标引脚已配置为 GPIO 功能；若当前引脚处于其他复用功能下，建议先调用 `Liot_SetPinFunc()` 完成复用切换。

声明：

```c
liot_gpioerr_e Liot_GpioInit(liot_gpio_e gpio, liot_gpiodir_e mode, liot_gpiolvl_e level, liot_intcb_t* intcb);
```

参数：

- **gpio：** [In] gpio 口（不是模组引脚，模组引脚对应的GPIO编号请通过复用表查看）。
- **mode：** [In] GPIO 输入输出模式。
- **level：** [In] GPIO 默认配置值。
  - 当 mode 为 L_IO_OUTPUT 时，表示默认输出电平；
  - 当 mode 为 L_IO_INPUT 时，表示输入配置方式：L_IO_LOW 为下拉输入，L_IO_HIGH 为上拉输入，L_IO_NONE 为浮空输入。
- **intcb：** [In] GPIO 中断配置参数，见 `liot_intcb_t`。
  - 当该 GPIO 仅作为普通输入/输出使用、不需要中断功能时，可传 NULL；
  - 当需要配置 GPIO 中断时，应传入有效的中断配置结构体。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.2 Liot_GpioGetLevel

获取 GPIO 口电平。

声明：

```c
liot_gpiolvl_e Liot_GpioGetLevel(liot_gpio_e gpio);
```

参数：

- **gpio：** [In] gpio 口（不是模组引脚，模组引脚对应的GPIO编号请通过复用表查看）。

返回值：

电平值，见 `liot_gpiolvl_e`。

### 5.3 Liot_GpioSetLevel

设置 GPIO 口电平。

声明：

```c
liot_gpioerr_e Liot_GpioSetLevel(liot_gpio_e gpio, liot_gpiolvl_e level);
```

参数：

- **gpio：** [In] gpio 口（不是模组引脚，模组引脚对应的GPIO编号请通过复用表查看）。
- **level：** [In] 引脚电平，见 `liot_gpiolvl_e`。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.4 Liot_GpioIntEnable

使能全局 GPIO 中断。

声明：

```c
liot_gpioerr_e Liot_GpioIntEnable(void);
```

参数：无。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.5 Liot_GpioIntDisable

关闭全局 GPIO 中断。

声明：

```c
liot_gpioerr_e Liot_GpioIntDisable(void);
```

参数：无。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.6 Liot_AonPowerCtl

控制 AGPIO 电源域。

声明：

```c
liot_gpioerr_e Liot_AonPowerCtl(bool enable);
```

参数：

- **enable：** [In] true：打开，false：关闭。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.7 Liot_SetVoltage

设置指定电源域的 IO 电压，配置后立即生效。

注意事项：

1. 设置电压前，请务必确认外围电路及外接器件的耐压范围，错误配置可能导致硬件损坏；
2. 在休眠场景中，普通 GPIO 与 AGPIO 的保持能力不同。即使电压域已配置，普通 GPIO 在休眠后仍可能掉电。

声明：

```c
liot_gpioerr_e Liot_SetVoltage(liot_powerdomain_e domain, liot_volt_e volt);
```

参数：

- **domain：** [In] 电源域，见 `liot_powerdomain_e`。
- **volt：** [In] 电压值，见 `liot_volt_e`。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.8 Liot_SetPinFunc

设置引脚复用功能。

声明：

```c
liot_gpioerr_e Liot_SetPinFunc(int modempin, liot_pinfunc_e func_sel);
```

参数：

- **modempin：** [In] 模组外部引脚编号，见模组型号引脚复用表。
- **func_sel：** [In] 引脚复用功能，见 `liot_pinfunc_e`。

返回值：

错误码，见 `liot_gpioerr_e`。

### 5.9 Liot_GetPinFunc

获取引脚复用功能。

声明：

```c
liot_pinfunc_e Liot_GetPinFunc(int modempin);
```

参数：

- **modempin：** [In] 模组引脚，见模组型号引脚复用表。

返回值：

引脚复用功能，见 `liot_pinfunc_e`。

### 6.10 Liot_WakeupIntInit

初始化唤醒引脚中断。

注意事项：

1. WAKEUP 中断回调运行在中断上下文中，不应执行耗时或阻塞操作；
2. WAKEUP 引脚主要用于唤醒场景，不建议作为普通输出使用；
3. 若需执行复杂处理逻辑，建议在中断回调中通知任务，再由任务上下文完成后续处理。

声明：

```c
liot_gpioerr_e Liot_WakeupIntInit(liot_wakeuppad_e wakeuppad, liot_intsig_e sig, void (*cb)(void *), void *arg);
```

参数：

- **wakeuppad：** [In] 模组 wakeup 中断脚，见 `liot_wakeuppad_e`。
- **sig：** [In] 中断触发类型，见 `liot_intsig_e`。
- **cb：** [In] 中断回调函数，类型 `void (*cb)(void *)`。
- **arg：** [In] 中断回调参数。

返回值：

错误码，见 `liot_gpioerr_e`。

### 6.11 Liot_WakeupIntDeinit

去初始化唤醒引脚中断。

声明：

```c
liot_gpioerr_e Liot_WakeupIntDeinit(liot_wakeuppad_e wakeuppad);
```

参数：

- **wakeuppad：** [In] 模组 wakeup 中断脚，见 `liot_wakeuppad_e`。

返回值：

错误码，见 `liot_gpioerr_e`。

### 6.12 Liot_WakeupPadGetLevel

获取 wakeup 引脚电平。

声明：

```c
liot_gpiolvl_e Liot_WakeupPadGetLevel(liot_wakeuppad_e wakeuppad);
```

参数：

- **wakeuppad：** [In] 模组 wakeup 中断脚，见 `liot_wakeuppad_e`。

返回值：

引脚电平，见 `liot_gpiolvl_e`。

## 7 代码示例

示例代码参考 `LSDK\examples\demo\src\demo_gpio2.c` 文件。

