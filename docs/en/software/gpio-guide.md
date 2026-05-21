# GPIO Development Guide_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| **Version** | **Date** | **Author** | **Reviewer** | **Changes** |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | Initial Release |
| Rev1.1 | 2026-04-24 | ljz | zlc | Document optimization |

## 1 Introduction

This document describes the LTE-EC71X GPIO interface APIs, which are declared in the `liot_gpio2.h` file.

For pin-to-GPIO function mapping, please refer to ["Lierda NT26F6B0_NT26F6D0 Series OpenCPU Pin Multiplexing Table"](Lierda%20NT26F6B0_NT26F6D0系列%20OpenCPU%20引脚复用表.xlsx) and ["Lierda K2B&K2F Series OpenCPU Pin Multiplexing Table"](Lierda%20K2B&K2F系列%20OpenCPU%20引脚复用表.xlsx).

## 2 Core Concepts

To facilitate understanding of the subsequent APIs, the concepts of regular GPIO, AGPIO, WAKEUP, and power domains are explained below.

| Type | Output Support | Input/Interrupt Support | Level Retention During Sleep | Description |
| ---- | ---- | ---- | ---- | ---- |
| Regular GPIO | Yes | Yes | No | Powered by the regular IO power domain. After system startup, the power domain is automatically powered on; during sleep, the corresponding power domain will be powered off. |
| AGPIO | Yes | Yes | Yes | Belongs to the AON (Always On) power domain. After system startup, software control is required to enable it. Suitable for maintaining output in low-power mode. |
| WAKEUP Pad | WAKEUP 0-2 cannot output; WAKEUP 3-5 can be multiplexed as GPIO for output | WAKEUP 0-2 can only serve as interrupt pins; WAKEUP 3-5 support interrupts and can be multiplexed as GPIO for input | N/A | Primarily used as interrupt pins, supporting low-power wakeup. |

**Sleep/Wakeup Configuration Notes:**

1. Regular GPIO may lose its configuration state during sleep due to power domain shutdown. It is recommended to reinitialize after wakeup based on business requirements;
2. AGPIO is suitable for maintaining output levels during sleep, but ensure the AON power domain is enabled before use;
3. WAKEUP pins are used for low-power wakeup. Their configuration differs from regular GPIO and should be initialized using dedicated interfaces;
4. Besides WAKEUP Pads, on some platforms/scenarios PWRKEY can also serve as a wakeup source (hardware wakeup), which is not within the `liot_wakeuppad_e` enumeration scope of this document;
5. For deep sleep or platform reset wakeup scenarios, it is recommended to re-execute GPIO/pin multiplexing configurations during the system startup process.

## 3 API Function Overview

### 3.1 GPIO Basic Configuration

| **Function** | **Description** |
| ---- | ---- |
| `Liot_GpioInit` | GPIO initialization interface |
| `Liot_GpioGetLevel` | Get GPIO level interface |
| `Liot_GpioSetLevel` | Set GPIO level |

### 3.2 GPIO Interrupt Control

| **Function** | **Description** |
| ---- | ---- |
| `Liot_GpioIntEnable` | Enable regular GPIO interrupt source |
| `Liot_GpioIntDisable` | Disable regular GPIO interrupt source |

### 3.3 Power Domain Configuration

| **Function** | **Description** |
| ---- | ---- |
| `Liot_AonPowerCtl` | Control AGPIO power domain switch |
| `Liot_SetVoltage` | Set power domain voltage |

### 3.4 Pin Multiplexing Configuration

| **Function** | **Description** |
| ---- | ---- |
| `Liot_SetPinFunc` | Set module pin multiplexing function |
| `Liot_GetPinFunc` | Get module pin multiplexing function |

### 3.5 WAKEUP Configuration

| **Function** | **Description** |
| ---- | ---- |
| `Liot_WakeupIntInit` | Initialize wakeup pin interrupt |
| `Liot_WakeupIntDeinit` | Deinitialize wakeup pin interrupt |
| `Liot_WakeupPadGetLevel` | Get wakeup pin level |

## 4 Type Definitions

### 4.1 liot_gpioerr_e

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_GPIO_ERR_SUCCESS | Execution successful |
| L_GPIO_ERR_EXECUTE | General execution error |
| L_GPIO_ERR_INVALID_PARAM | Invalid input parameter |
| L_GPIO_ERR_OPEN | Open failed |
| L_GPIO_ERR_CONFIG | Configuration interface failed |
| L_GPIO_ERR_PULL_SET | Pull resistor setup failed |
| L_GPIO_ERR_CALLBACK | Callback registration failed |
| L_GPIO_ERR_LEVEL_TRIGGER | Interrupt trigger setup failed |

### 4.2 liot_gpio_e

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_GPIO_0 ~ L_GPIO_38 | GPIO 0 ~ GPIO 38 |
| L_GPIO_MAX | Maximum enumeration value |

### 4.3 liot_gpiodir_e

GPIO input/output mode.

Enumeration definition:

```c
typedef enum
{
    L_IO_INPUT,      /*!< Configure the GPIO as an input pin */
    L_IO_OUTPUT,     /*!< Configure the GPIO as an output pin */
} liot_gpiodir_e;
```

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_IO_INPUT | GPIO input mode |
| L_IO_OUTPUT | GPIO output mode |

### 4.4 liot_gpiolvl_e

GPIO level.

Enumeration definition:

```c
typedef enum {
    L_IO_LOW,       /*!< Logic low level (0V or GND) */
    L_IO_HIGH,      /*!< Logic high level */
    L_IO_NONE       /*!< Unknown logic level */
} liot_gpiolvl_e;
```

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_IO_LOW | As output: default output low level; As input: pull-down input |
| L_IO_HIGH | As output: default output high level; As input: pull-up input |
| L_IO_NONE | As output: no output level set; As input: floating input |

### 4.5 liot_intsig_e

Interrupt trigger mode.

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_INT_SIG_NONE | No interrupt trigger configured |
| L_INT_LEVEL_LOW | Low level trigger |
| L_INT_LEVEL_HIGH | High level trigger |
| L_INT_EDGE_FALL | Falling edge trigger |
| L_INT_EDGE_RISE | Rising edge trigger |
| L_INT_EDGE_BOTH | Both edges trigger |

### 4.6 liot_wakeuppad_e

Wakeup source.

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_WAKEUPAD_0 ~ L_WAKEUPAD_5 | Wakeup source 0 ~ 5 |

### 4.7 liot_volt_e

Pin voltage.

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_VOLT_1_65V ~ L_VOLT_2_00V | 1.8V range voltage (1.65V ~ 2.00V) |
| L_VOLT_2_65V ~ L_VOLT_3_00V | 2.8V range voltage (2.65V ~ 3.00V) |
| L_VOLT_3_05V ~ L_VOLT_3_40V | 3.3V range voltage (3.05V ~ 3.40V) |

### 4.8 liot_powerdomain_e

Power domain configuration.

Enumeration definition:

```c
typedef enum
{
    L_DOMAIN_NORMAL = 0,
    L_DOMAIN_AON,
    L_DOMAIN_ALL
} liot_powerdomain_e;
```

Enumeration description:

| **Variable** | **Description** |
| ---- | ---- |
| L_DOMAIN_NORMAL | Regular GPIO power domain |
| L_DOMAIN_AON | AGPIO power domain |
| L_DOMAIN_ALL | Regular GPIO + AGPIO power domain |

### 4.9 liot_pinfunc_e

Pin multiplexing function number, used to configure the function multiplexing mode of a specified physical pin.

Notes:

1. `liot_pinfunc_e` only represents the pin multiplexing selection value, not a fixed function name.
2. Different module pins may correspond to different actual functions under L_PIN_FUNC_0 ~ L_PIN_FUNC_7, such as GPIO, UART, SPI, I2C, etc. Please refer to the multiplexing table for the specific model.
3. Before calling `Liot_SetPinFunc()`, it is recommended to consult the pin multiplexing table for the module model to confirm the supported functions and corresponding func_sel values for the target physical pin.

Enumeration definition:

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

Enumeration description:

| **Variable** | **Description (refer to pin multiplexing table)** |
| ---- | ---- |
| L_PIN_FUNC_0 ~ L_PIN_FUNC_7 | Pin multiplexing function 0 ~ 7 |
| L_PIN_FUNC_UNKNOWN | Pin multiplexing function unknown |

### 4.10 liot_intcb_t

Interrupt parameter configuration.

- Interrupt callbacks run in interrupt context and should not perform time-consuming operations;
- Blocking interfaces should not be called within callbacks;
- For complex business logic, it is recommended to only set flags or send events in the callback, and let the task context handle the processing.

Structure definition:

```c
typedef struct
{
    liot_intsig_e signal;
    void (*callback)(void* arg);
    void* arg;
} liot_intcb_t;
```

Structure member description:

| **Variable** | **Description** |
| ---- | ---- |
| signal | Interrupt trigger mode, see `liot_intsig_e` |
| callback | Interrupt callback function, prototype: `void (*callback)(void* arg)` |
| arg | Interrupt callback parameter |

## 5 API Function Details

### 5.1 Liot_GpioInit

GPIO initialization. Before calling `Liot_GpioInit()`, ensure the target pin is configured as GPIO function. If the pin is currently in another multiplexing function, call `Liot_SetPinFunc()` first to switch the multiplexing.

Declaration:

```c
liot_gpioerr_e Liot_GpioInit(liot_gpio_e gpio, liot_gpiodir_e mode, liot_gpiolvl_e level, liot_intcb_t* intcb);
```

Parameters:

- **gpio:** [In] GPIO port (not the module pin number; refer to the multiplexing table for the GPIO number corresponding to the module pin).
- **mode:** [In] GPIO input/output mode.
- **level:** [In] GPIO default configuration value.
  - When mode is L_IO_OUTPUT, represents the default output level;
  - When mode is L_IO_INPUT, represents the input configuration: L_IO_LOW for pull-down input, L_IO_HIGH for pull-up input, L_IO_NONE for floating input.
- **intcb:** [In] GPIO interrupt configuration parameters, see `liot_intcb_t`.
  - When the GPIO is used only as regular input/output without interrupt functionality, pass NULL;
  - When GPIO interrupt configuration is needed, pass a valid interrupt configuration structure.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.2 Liot_GpioGetLevel

Get GPIO port level.

Declaration:

```c
liot_gpiolvl_e Liot_GpioGetLevel(liot_gpio_e gpio);
```

Parameters:

- **gpio:** [In] GPIO port (not the module pin number; refer to the multiplexing table for the GPIO number corresponding to the module pin).

Return value:

Level value, see `liot_gpiolvl_e`.

### 5.3 Liot_GpioSetLevel

Set GPIO port level.

Declaration:

```c
liot_gpioerr_e Liot_GpioSetLevel(liot_gpio_e gpio, liot_gpiolvl_e level);
```

Parameters:

- **gpio:** [In] GPIO port (not the module pin number; refer to the multiplexing table for the GPIO number corresponding to the module pin).
- **level:** [In] Pin level, see `liot_gpiolvl_e`.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.4 Liot_GpioIntEnable

Enable global GPIO interrupt.

Declaration:

```c
liot_gpioerr_e Liot_GpioIntEnable(void);
```

Parameters: None.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.5 Liot_GpioIntDisable

Disable global GPIO interrupt.

Declaration:

```c
liot_gpioerr_e Liot_GpioIntDisable(void);
```

Parameters: None.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.6 Liot_AonPowerCtl

Control AGPIO power domain.

Declaration:

```c
liot_gpioerr_e Liot_AonPowerCtl(bool enable);
```

Parameters:

- **enable:** [In] true: enable, false: disable.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.7 Liot_SetVoltage

Set the IO voltage for the specified power domain. Takes effect immediately after configuration.

Notes:

1. Before setting the voltage, ensure the peripheral circuit and connected devices can tolerate the voltage range. Incorrect configuration may cause hardware damage;
2. In sleep scenarios, regular GPIO and AGPIO have different retention capabilities. Even if the voltage domain is configured, regular GPIO may still lose power after sleep.

Declaration:

```c
liot_gpioerr_e Liot_SetVoltage(liot_powerdomain_e domain, liot_volt_e volt);
```

Parameters:

- **domain:** [In] Power domain, see `liot_powerdomain_e`.
- **volt:** [In] Voltage value, see `liot_volt_e`.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.8 Liot_SetPinFunc

Set pin multiplexing function.

Declaration:

```c
liot_gpioerr_e Liot_SetPinFunc(int modempin, liot_pinfunc_e func_sel);
```

Parameters:

- **modempin:** [In] Module external pin number, see the module model pin multiplexing table.
- **func_sel:** [In] Pin multiplexing function, see `liot_pinfunc_e`.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.9 Liot_GetPinFunc

Get pin multiplexing function.

Declaration:

```c
liot_pinfunc_e Liot_GetPinFunc(int modempin);
```

Parameters:

- **modempin:** [In] Module pin, see the module model pin multiplexing table.

Return value:

Pin multiplexing function, see `liot_pinfunc_e`.

### 5.10 Liot_WakeupIntInit

Initialize wakeup pin interrupt.

Notes:

1. WAKEUP interrupt callbacks run in interrupt context and should not perform time-consuming or blocking operations;
2. WAKEUP pins are primarily used for wakeup scenarios and are not recommended for use as regular outputs;
3. For complex processing logic, it is recommended to notify a task from the interrupt callback and let the task context complete subsequent processing.

Declaration:

```c
liot_gpioerr_e Liot_WakeupIntInit(liot_wakeuppad_e wakeuppad, liot_intsig_e sig, void (*cb)(void *), void *arg);
```

Parameters:

- **wakeuppad:** [In] Module wakeup interrupt pin, see `liot_wakeuppad_e`.
- **sig:** [In] Interrupt trigger type, see `liot_intsig_e`.
- **cb:** [In] Interrupt callback function, type `void (*cb)(void *)`.
- **arg:** [In] Interrupt callback parameter.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.11 Liot_WakeupIntDeinit

Deinitialize wakeup pin interrupt.

Declaration:

```c
liot_gpioerr_e Liot_WakeupIntDeinit(liot_wakeuppad_e wakeuppad);
```

Parameters:

- **wakeuppad:** [In] Module wakeup interrupt pin, see `liot_wakeuppad_e`.

Return value:

Error code, see `liot_gpioerr_e`.

### 5.12 Liot_WakeupPadGetLevel

Get wakeup pin level.

Declaration:

```c
liot_gpiolvl_e Liot_WakeupPadGetLevel(liot_wakeuppad_e wakeuppad);
```

Parameters:

- **wakeuppad:** [In] Module wakeup interrupt pin, see `liot_wakeuppad_e`.

Return value:

Pin level, see `liot_gpiolvl_e`.

## 6 Code Example

Example code can be found in the `LSDK\examples\demo\src\demo_gpio2.c` file.
