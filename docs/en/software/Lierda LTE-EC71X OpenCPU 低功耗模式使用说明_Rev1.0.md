# Low Power Mode Usage_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| **Version** | **Date** | **Revised By** | **Reviewed By** | **Changes** |
| --- | --- | --- | --- | --- |
| Rev1.0 | 26-01-21 | zlc | | Initial Release |

## 1 Introduction

This chapter mainly introduces the newly added low power API interfaces, along with API usage descriptions, to facilitate customers when using OPENSDK for low power function implementation.

Power-off Status of Peripherals in Sleep Mode

| Power Mode | | LIOT\_SLEEP\_MODE<br>\_NORMAL | LIOT\_SLEEP\_MODE<br>\_LOW | LIOT\_SLEEP\_MODE<br>\_DEEP\_LOW |
| --- | --- | --- | --- | --- |
| Description | | Normal working mode, milliamp-level power consumption, suitable for scenarios with low power requirements | Microamp-level power consumption, can wake up quickly, suitable for high-frequency sleep/wake scenarios | Lower Power Mode, suitable for long-term sleep while maintaining necessary network connections |
| CPU Frequency | | Normal | Reduced | Sleep |
| RAM Status | | Maintained | Maintained | Power-off |
| Peripherals | Normal GPIO | Available | Unavailable | Unavailable |
| | AON GPIO | Available | Available | Available |
| | APWM | Available | Available | Available |
| | Peripheral Status (I2C/SPI/I2S/PWM/ADC/UART/CAN) | Available | Unavailable | Unavailable |
| | VDD\_EXT | Maintain output | Some models support output | Some models support output |
| Wake-up Method | wakeup/pwrkey | Available | Available | Available |
| | Software Timer | Supported | Supported | Not Supported |
| | Low Power Timer | Supported | Supported | Supported |
| | Low Power UART | Supported | Supported | Supported |
| | Data, SMS | Supported | Supported | Supported |
| Data Communication | Application Protocol | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/LWM2M/COAP/TCP/TCP(S)/UDP(S) | FTP(S)/MQTT(S)/HTTP(S)/WebSocket/LWM2M/COAP/TCP/TCP(S)/UDP(S) | LWM2M/COAP/TCP/UDP |
| | Downlink Paging | Supported | Supported | Supported |

Approximate Current Range in Different Power Modes:

| **Power Mode** | **Non-paging Current** |
| --- | --- |
| LIOT\_SLEEP\_MODE\_NORMAL | ~4mA |
| LIOT\_SLEEP\_MODE\_LOW | ~60uA |
| LIOT\_SLEEP\_MODE\_DEEP\_LOW | ~9.5uA |

## 2 API Function Overview

| **Function** | **Description** |
| --- | --- |
| Liot\_SleepSetMode() | Set power mode |
| Liot\_SleepTimerStart() | Start low power timer |
| Liot\_SleepTimerStop() | Stop low power timer |
| Liot\_SleepTimerCheck() | Check if low power timer is running |
| Liot\_SleepTimerGetID() | Get the low power ID that woke up the system |

## 3 Type Description

### 3.1 liot\_sleep\_mode\_type\_e

Power mode type.

1. Declaration

```c
typedef enum {
    LIOT_SLEEP_MODE_NORMAL, // normal mode
    LIOT_SLEEP_MODE_LOW, // sleep mode
    LIOT_SLEEP_MODE_DEEP_LOW, // deep sleep mode
} liot_sleep_mode_type_e;
```

2. Parameters

* LIOT\_SLEEP\_MODE\_NORMAL - Normal working mode
* LIOT\_SLEEP\_MODE\_LOW - Low Power Mode
* LIOT\_SLEEP\_MODE\_DEEP\_LOW - Ultra Low Power Mode

Description:

Both LIOT\_SLEEP\_MODE\_LOW and LIOT\_SLEEP\_MODE\_DEEP\_LOW modes will power off peripherals. If you want to enter these modes, you need to: 1. Disable software timers, 2. Suspend all non-blocking tasks, 3. Disable peripheral drivers.

LIOT\_SLEEP\_MODE\_LOW mode: RAM is not powered off. Applications need to suspend all tasks. If a timer is created, the system will wake up when the timer expires. If tasks are in non-blocking state, the system will also wake up when the timeout is reached. It is recommended to set the wait time to forever.

LIOT\_SLEEP\_MODE\_DEEP\_LOW mode: RAM is powered off. After the system wakes up, the code runs as if restarting. You need to determine the wake-up reason at the beginning of the application. If using a low power timer, you can use the Liot\_SleepTimerGetID() interface to query the specific hardware timer ID that woke up the system. In this mode, 1 TCP and 1 UDP connection can be maintained. The TCP link status will be backed up and restored by the system; the application layer does not need to handle it additionally. The heartbeat time maintained with the server should not be too short, otherwise it will cause frequent system wake-ups, but also should not exceed the IP aging time (generally within 10 minutes). If the aging time expires, the module needs to re-attach to the network, and power consumption will surge.

### 3.2 LiotSleepModeCfg\_t

Power mode configuration structure.

1. Declaration

```c
typedef struct {
    liot_sleep_mode_type_e mode; // sleep mode
} LiotSleepModeCfg_t;
```

2. Parameters

| **Type** | **Parameter** | **Description** |
| --- | --- | --- |
| liot\_sleep\_mode\_type\_e | mode | Power mode |

### 3.3 Liot\_SleepTimerID\_e

Low power timer enumeration options.

1. Declaration

```c
typedef enum {
    LIOT_DEEPSLP_TIMER_ID0 = 0,  // num 0/1: 2 AONTimer, without flash storage, 2.5 hour in 100Hz
    LIOT_DEEPSLP_TIMER_ID1,
    LIOT_DEEPSLP_TIMER_ID2,
    LIOT_DEEPSLP_TIMER_ID3,
    LIOT_DEEPSLP_TIMER_ID4,
    LIOT_DEEPSLP_TIMER_ID5,
    LIOT_DEEPSLP_TIMER_MAX_NUM,
} Liot_SleepTimerID_e;
```

2. Parameters

* LIOT\_DEEPSLP\_TIMER\_ID0 - Low power timer ID 0
* LIOT\_DEEPSLP\_TIMER\_ID1 - Low power timer ID 1
* LIOT\_DEEPSLP\_TIMER\_ID2 - Low power timer ID 2
* LIOT\_DEEPSLP\_TIMER\_ID3 - Low power timer ID 3
* LIOT\_DEEPSLP\_TIMER\_ID4 - Low power timer ID 4
* LIOT\_DEEPSLP\_TIMER\_ID5 - Low power timer ID 5

3. Description

* LIOT\_DEEPSLP\_TIMER\_ID0 and LIOT\_DEEPSLP\_TIMER\_ID1 belong to AON timers. The timers become invalid after system reset. **Maximum timeout is 2.5 hours. These 2 timers will NOT write to FLASH**.

* LIOT\_DEEPSLP\_TIMER\_ID2~LIOT\_DEEPSLP\_TIMER\_ID5 belong to deep sleep timers. **Maximum timeout is 740 hours. These timers will write to FLASH. Use with caution. These timers will perform FLASH erase/write operations. Flash has an erase/write lifespan. If developers frequently start/stop these timers in a loop, the module may be damaged within a few months. High-frequency (e.g., second-level) loop calls are strictly prohibited. Only recommended for long-period wake-up tasks**.

### 3.4 liot\_sleep\_errcode\_e

Low power interface error code enumeration options.

1. Declaration

```c
typedef enum {
    LIOT_SLEEP_SUCCESS = LIOT_SUCCESS,
    LIOT_SLEEP_INVALID_PARAM = (LIOT_COMPONENT_PM_SLEEP << 16) | 1000,
    LIOT_SLEEP_LOCK_CREATE_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1001,
    LIOT_SLEEP_LOCK_DELETE_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1002,
    LIOT_SLEEP_LOCK_LOCK_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1003,
    LIOT_SLEEP_LOCK_UNLOCK_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1004,
    LIOT_SLEEP_LOCK_AUTOSLEEP_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1005,
    LIOT_SLEEP_PARAM_SAVE_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1006,
} liot_sleep_errcode_e;
```

2. Parameters

* LIOT\_SLEEP\_SUCCESS: Execution successful
* LIOT\_SLEEP\_INVALID\_PARAM: Invalid parameter
* LIOT\_SLEEP\_LOCK\_CREATE\_FAIL: Sleep handle creation failed
* LIOT\_SLEEP\_LOCK\_DELETE\_FAIL: Sleep handle deletion failed
* LIOT\_SLEEP\_LOCK\_LOCK\_FAIL: Sleep handle vote failed
* LIOT\_SLEEP\_LOCK\_UNLOCK\_FAIL: Sleep handle cancel vote failed
* LIOT\_SLEEP\_LOCK\_AUTOSLEEP\_FAIL: Set automatic sleep mode failed
* LIOT\_SLEEP\_PARAM\_SAVE\_FAIL: Parameter save to NV failed

## 4 API Function Details

### 4.1 DeepSlpTimerCb\_Func

Low power function timeout callback function. Note: Do not execute time-consuming operations in this function.

1. Declaration

```c
typedef void (*DeepSlpTimerCb_Func)(Liot_SleepTimerID_e timeid);
```

2. Parameters

* timeid: [In] Low power timer ID, please refer to 3.3.

3. Return Value

* void

### 4.2 Liot\_SleepSetMode

This function is used to set the device sleep mode. After setting the sleep mode, it will not immediately enter low power. The system will perform a vote check internally, and only enter low power when all votes "allow". The setting becomes invalid after system reset.

1. Declaration

```c
liot_sleep_errcode_e Liot_SleepSetMode(LiotSleepModeCfg_t *cfg);
```

2. Parameters

* cfg: [In] Sleep mode configuration.

3. Return Value

* liot\_sleep\_errcode\_e: Execution result code, please refer to 3.4.

### 4.3 Liot\_SleepTimerStart

This function is used to start the low power timer.

1. Declaration

```c
liot_sleep_errcode_e Liot_SleepTimerStart(Liot_SleepTimerID_e timeid, uint32_t timeout, DeepSlpTimerCb_Func cb);
```

2. Parameters

* timeid: [In] Low power timer ID, please refer to 3.3. **Frequent calls by customers will erase/write Flash timers (ID2-5), which may cause hardware damage**.

* timeout: [In] Low power timer timeout value. Different timer IDs have different maximum times that can be set. Please select according to your business needs, please refer to 3.3.

* cb: [In] Low power timer timeout callback function, please refer to 4.1.

3. Return Value

* liot\_sleep\_errcode\_e: Execution result code, please refer to 3.4.

### 4.4 Liot\_SleepTimerStop

This function is used to stop the low power timer.

The low power timer will be automatically deleted after timeout. To start it again, you need to call Start again.

1. Declaration

```c
liot_sleep_errcode_e Liot_SleepTimerStop(Liot_SleepTimerID_e timeid);
```

2. Parameters

* timeid: [In] Low power timer ID, please refer to 3.3.

3. Return Value

* liot\_sleep\_errcode\_e: Execution result code, please refer to 3.4.

### 4.5 Liot\_SleepTimerCheck

This function is used to check if the power timer is running.

1. Declaration

```c
bool Liot_SleepTimerCheck(Liot_SleepTimerID_e timeid);
```

2. Parameters

* timeid: [In] Low power timer ID, please refer to 3.3.

3. Return Value

* bool: true - Low power timer is running, false - Low power timer is not running.

### 4.6 Liot\_SleepTimerGetID

This function is used to get the timer ID that woke up the system.

Mainly used in LIOT\_SLEEP\_MODE\_DEEP\_LOW sleep mode. After the system wakes up, query the low power timer ID that woke up the system. No effect in normal mode.

1. Declaration

```c
Liot_SleepTimerID_e Liot_SleepTimerGetID(void);
```

2. Parameters

* void

3. Return Value

* Liot\_SleepTimerID\_e: Timer ID that woke up the system.

## 5 Code Example

Example code refers to LSDK/example/src/demo_sleepex.c.

**Running Results:**

Test Log for Entering LIOT\_SLEEP\_MODE\_LOW

According to the demo, first enter LIOT\_SLEEP\_MODE\_LOW Low Power Mode, then start a 1-minute low power timer. After waking up, the system checks if it was woken by the low power timer, then exits the low power sleep mode. ![](_images/Low Power ModeUsage Instructions/Low Power ModeDescription 1.png)

Test Log for Entering LIOT\_SLEEP\_MODE\_DEEP\_LOW

According to the demo, first enter LIOT\_SLEEP\_MODE\_DEEP\_LOW Low Power Mode, then start a 1-minute low power timer. After waking up, the system checks if it was woken by the low power timer, then exits the low power sleep mode. ![](_images/Low Power ModeUsage Instructions/Low Power ModeDescription 2.png)

## 6 FAQ

* For LIOT\_SLEEP\_MODE\_DEEP\_LOW mode, after the system enters this mode, RAM will be powered off. Global variables will be cleared after the system wakes up. If you need to save critical data, it is recommended to use the file system for saving, and restore variables after the system wakes up.
