# UART Development Guide_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| Version | Date | Author | Review | Changes |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | Initial document |
| Rev1.1 | 2026-04-24 | mbb |  | Added UART basic concepts, demo details and quick development flow |

## 1 Introduction

This document is intended for engineers developing on Lierda LTE-EC71X series (EC716 / EC718 / EC718M) modules using the OpenCPU environment. It describes the UART API features, interface definitions, and usage methods. The guide covers UART fundamentals, port descriptions, receive/send mechanisms, detailed API references, and complete code examples to help developers quickly get started and integrate serial communication correctly.

Note: The title contains "UART2" which refers to the upgraded second-generation UART API, not a driver for a specific physical "UART2" port.

## 2 Basic Concepts

### 2.1 UART

UART (Universal Asynchronous Receiver/Transmitter) is one of the most basic and commonly used serial communication methods. Think of it as a "conversation line" between two devices:

- Transmitter (TX): sends bits one by one, like speaking word by word.
- Receiver (RX): reconstructs the bits into data, like listening word by word.

Both sides must agree on several key parameters to "understand" each other:

| Parameter | Meaning | Common Settings |
| ---- | ---- | ---- |
| Baudrate | Bits transmitted per second — "speaking speed" | 115200, 9600 |
| Data bits | Number of data bits in a frame | 8, 7 |
| Stop bits | Frame end interval for synchronization | 1, 2 |
| Parity | Simple error-detection mechanism | None, Odd, Even |

UART devices must use identical parameters to communicate correctly; otherwise communication fails.

EC71X modules include multiple UART controllers and the OpenCPU SDK provides a simple API wrapper. Users do not need to manage low-level registers — call initialization, send, and receive callback APIs to implement serial communication.

### 2.2 UART Port Description

EC71X modules provide multiple UART ports, including physical and virtual ports:

| Port Enum | Port Type | Notes |
| ---- | ---- | ---- |
| L_UART0 | Physical UART | Main UART (default UNILOG for logs). Can be reconfigured for user data. EC718: PAD31(RX)/PAD32(TX); EC716: PAD18(RX)/PAD19(TX). |
| L_UART1 | Physical UART | Auxiliary UART for external devices. EC718: PAD33(RX)/PAD34(TX); EC716: PAD20(RX)/PAD21(TX). |
| L_UART2 | Physical UART | Auxiliary UART. EC718: PAD25(RX)/PAD26(TX); EC716: PAD16(RX)/PAD17(TX). |
| L_UART3 | Physical UART | Auxiliary UART. PAD29(RX)/PAD30(TX). Ensure `RTE_UART3` is enabled in `RTE_Device.h` before use. |
| L_USBCOM | Virtual Port | Virtual COM port exposed to a PC over USB (no external USB-to-UART adapter required). Uses OPAQ bus internally. |

### 2.3 Receive Mechanism

The SDK uses interrupt-driven reception with user callbacks:

1. Hardware receives data via DMA or interrupt, then triggers an OPAQ channel callback.
2. The SDK invokes the user-registered callback `L_UartCallback_f` in a lower-level task context.
3. The callback runs in the SDK's task context; do not perform long-running operations (e.g., long delays, heavy logging) inside the callback to avoid blocking the receive task.

### 2.4 Transmit Methods

The SDK supports three transmit methods configured by `Liot_UartConfig_t.tx_way`:

| Tx Method | Behavior |
| ---- | ---- |
| L_UART_TX_OPAQ | Send via OPAQ bus: data is queued to an internal buffer and sent asynchronously; API returns immediately. L_USBCOM only supports this mode. |
| L_UART_TX_DRIVER | Polling mode: synchronous blocking transmit; API waits until all data is transmitted. |
| L_UART_TX_DRIVER_DMA | DMA mode: data is submitted to a DMA buffer and API returns immediately; DMA performs the actual transmission. |

Note: UART pins are typically 1.8V TTL. Do NOT connect directly to RS232 (±12V) or 5V TTL devices — this may permanently damage the module. Use level shifters when interfacing with 3.3V/5V devices.

## 3 API Function Overview

| Function | Description |
| ---- | ---- |
| `Liot_UartInit` | UART initialization interface |
| `Liot_UartDeinit` | UART deinitialization interface |
| `Liot_UartSend` | UART send interface |

## 4 Type Definitions

### 4.1 `liot_uart_err_e`

1. Enum definition:

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

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_SUCCESS | Success |
| L_UART_ERR_EXECUTE | Execution error / general failure |
| L_UART_ERR_ADDR_NULL | Null pointer |
| L_UART_ERR_INVALID_PARAM | Invalid parameter |
| L_UART_ERR_OPEN_REPEAT | Repeated initialization |
| L_UART_ERR_NOT_OPEN | UART not initialized |

### 4.2 `liot_uart_e`

1. Enum definition:

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

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_PORT_NONE | No port |
| L_UART0 | UART0 |
| L_UART1 | UART1 |
| L_UART2 | UART2 |
| L_UART3 | UART3 |
| L_USBCOM | Virtual AT/DEBUG port over USB |
| L_PORT_MAX | Enum max value |

### 4.3 `liot_uart_flowctrl_e`

1. Enum definition:

```c
typedef enum
{
	L_UART_FC_NONE = 0,
	L_UART_FC_HW,
} liot_uart_flowctrl_e;
```

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_FC_NONE | Hardware flow control disabled |
| L_UART_FC_HW | Hardware flow control enabled |

### 4.4 `liot_uart_baudrate_e`

1. Enum definition:

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

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_BR_AUTO | Auto baud detection |
| L_UART_BR_600 ~ L_UART_BR_921600 | Corresponding baudrates |

Note: Auto-baud requires hardware support; usually the remote side must send calibration characters (e.g., "AT") for detection. If unsure, use a fixed baud rate such as `L_UART_BR_115200`.

### 4.5 `liot_uart_databit_e`

1. Enum definition:

```c
typedef enum
{
	L_UART_DATA_7 = 7,
	L_UART_DATA_8 = 8,
} liot_uart_databit_e;
```

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_DATA_7 | 7 data bits |
| L_UART_DATA_8 | 8 data bits |

### 4.6 `liot_uart_stopbit_e`

1. Enum definition:

```c
typedef enum
{
	L_UART_STOP_1 = 1,
	L_UART_STOP_2 = 2,
} liot_uart_stopbit_e;
```

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_STOP_1 | 1 stop bit |
| L_UART_STOP_2 | 2 stop bits |

### 4.7 `liot_uart_paritybit_e`

1. Enum definition:

```c
typedef enum
{
	L_UART_PARITY_NONE,
	L_UART_PARITY_ODD,
	L_UART_PARITY_EVEN,
} liot_uart_paritybit_e;
```

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_PARITY_NONE | No parity |
| L_UART_PARITY_ODD | Odd parity |
| L_UART_PARITY_EVEN | Even parity |

### 4.8 `liot_uart_txway_e`

1. Enum definition:

```c
typedef enum
{
	L_UART_TX_OPAQ       = 0,
	L_UART_TX_DRIVER,
	L_UART_TX_DRIVER_DMA
} liot_uart_txway_e;
```

2. Description:

| Value | Meaning |
| ---- | ---- |
| L_UART_TX_OPAQ | OPAQ bus asynchronous transmit with internal queue |
| L_UART_TX_DRIVER | Polling synchronous transmit |
| L_UART_TX_DRIVER_DMA | DMA-based asynchronous transmit |

### 4.9 `Liot_UartConfig_t`

1. Struct definition:

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

2. Field descriptions:

| Field | Description |
| ---- | ---- |
| baudrate | Baudrate, see `liot_uart_baudrate_e` |
| data_bit | Data bits, see `liot_uart_databit_e` |
| stop_bit | Stop bits, see `liot_uart_stopbit_e` |
| parity_bit | Parity, see `liot_uart_paritybit_e` |
| flow_ctrl | Hardware flow control, see `liot_uart_flowctrl_e` |
| tx_way | Transmit method, see `liot_uart_txway_e` |
| cts_enable | CTS enable — not supported in current version, set to `false` |
| rts_enable | RTS enable — not supported in current version, set to `false` |
| rx_buf_size | RX buffer size — not supported in current version, set to `0` |
| tx_buf_size | TX buffer size — not supported in current version, set to `0` |
| lpuart_enable | Low-power UART enable |

Note: It is recommended to zero-initialize the `Liot_UartConfig_t` struct (e.g., `memset` or `= {0}`) before setting fields to ensure safe defaults for unsupported fields.

## 5 API Details

### 5.1 `L_UartCallback_f`

UART receive callback type. The SDK calls this when data arrives on a UART port.

1. Declaration:

```c
typedef void (*L_UartCallback_f)(liot_uart_e port, char *data, uint32_t size, void *argc);
```

2. Parameters:

- `port`: [In] The UART port where data was received.
- `data`: [In] Pointer to the received data.
- `size`: [In] Length of received data in bytes.
- `argc`: [In] User context pointer passed into `Liot_UartInit`. Use to carry user instance/context; pass `NULL` if unused.

3. Return value: none.

Note: The `data` pointer points to an internal receive buffer which may be overwritten or freed after the callback returns. If you need to process data outside the callback, `memcpy` it into your own buffer inside the callback.

### 5.2 `Liot_UartInit`

Initialize a UART port.

1. Declaration:

```c
liot_uart_err_e Liot_UartInit(liot_uart_e port, Liot_UartConfig_t *uart_config, L_UartCallback_f uart_cb, void *argc);
```

2. Parameters:

- `port`: [In] UART port enum.
- `uart_config`: [In] Pointer to `Liot_UartConfig_t` (must not be `NULL`).
- `uart_cb`: [In] Receive callback function (must not be `NULL`).
- `argc`: [In] User context pointer passed to the callback; may be `NULL`.

3. Return value:

- `0` on success (i.e., `L_UART_SUCCESS`).
- Non-zero on failure; see `liot_uart_err_e`.

### 5.3 `Liot_UartDeinit`

Deinitialize a UART port and free related resources.

1. Declaration:

```c
liot_uart_err_e Liot_UartDeinit(liot_uart_e port);
```

2. Parameters:

- `port`: [In] UART port enum.

3. Return value:

- `0` on success; non-zero on failure.

### 5.4 `Liot_UartSend`

Send data over UART. Behavior depends on the `tx_way` configured at init time:

- `L_UART_TX_DRIVER`: Polling — synchronous blocking send.
- `L_UART_TX_DRIVER_DMA`: DMA — submit data to DMA buffer and return immediately.
- `L_UART_TX_OPAQ`: OPAQ — queue data to OPAQ channel and return; used by `L_USBCOM`.

1. Declaration:

```c
uint32_t Liot_UartSend(liot_uart_e port, unsigned char *data, unsigned int data_len);
```

2. Parameters:

- `port`: [In] UART port enum.
- `data`: [In] Pointer to data to send (must not be `NULL`).
- `data_len`: [In] Number of bytes to send (must be > 0).

3. Return value:

- `>0`: Transmit succeeded.
- `0`: Transmit failed.

## 6 Code Examples

### 6.1 Quick Start Flow

The basic steps to use the UART API are shown below, using the example `examples/demo/src/demo_uart2.c` as a reference.

Step 1 — Define a receive callback:

```c
#include "liot_uart2.h"

void liot_uart2_notify_cb(liot_uart_e port, char *data, uint32_t size, void *argc)
{
	liot_trace("UART port %d receive size:%d, data=%s", port, size, data);
}
```

The callback is executed in a lower-level task context; copy received data out if you need to process it outside the callback.

Step 2 — Initialize `Liot_UartConfig_t`:

```c
Liot_UartConfig_t usart_config = {0};
usart_config.baudrate   = L_UART_BR_115200;
usart_config.data_bit   = L_UART_DATA_8;
usart_config.flow_ctrl  = L_UART_FC_NONE;
usart_config.stop_bit   = L_UART_STOP_1;
usart_config.parity_bit = L_UART_PARITY_NONE;
```

Step 3 — Call `Liot_UartInit`:

```c
int ret = Liot_UartInit(L_USBCOM, &usart_config, liot_uart2_notify_cb, NULL);
if(ret != L_UART_SUCCESS)
	liot_trace("Liot_UartInit failed, ret=%d", ret);
```

Step 4 — Send data:

```c
Liot_UartSend(L_USBCOM, (unsigned char *)"helloworld\r\n", 10);
```

Step 5 — Handle received data in the callback; no polling required.

Step 6 (optional) — Deinitialize:

```c
Liot_UartDeinit(L_USBCOM);
```

`Liot_UartDeinit` releases port resources.

### 6.2 Full Example

The following example is adapted from `examples/demo/src/demo_uart2.c`. It initializes multiple UART ports and periodically sends test strings.

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
	liot_trace("==========Uart2 Demo Init: Baudrate-%d ==========%\r\n", usart_config.baudrate);

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

Notes:

1. Port selection is controlled by macros (e.g., `LIOT_UART_PORT_USB_TEST_DEMO`) to flexibly enable test ports without changing logic.
2. Zero-initialize the `Liot_UartConfig_t` struct to ensure safe defaults for unsupported fields.
3. A unified callback is used for all ports; use the `port` parameter to distinguish sources.
4. The demo sends test strings every second and logs status for verification.

