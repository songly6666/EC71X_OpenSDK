# 低功耗模式使用说明_Rev1.0

{link_to_translation}`en:[English]`

## 文件修订历史

| **文档版本** | **变更日期** | **修订人** | **审核人** | **变更内容** |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 26-01-21 | zlc |  | 新增文档 |

## 1 简介

本章节主要内容主要介绍新增加的低功耗API接口，以及API使用的相关说明，方便客户在使用OPENSDK进行低功耗功能实现时进行相关参考。

休眠模式外设掉电情况

<table>
<tr>
<th>功耗模式</th><th></th><th>LIOT_SLEEP_MODE_NORMAL</th><th>LIOT_SLEEP_MODE_LOW</th><th>LIOT_SLEEP_MODE_DEEP_LOW</th>
</tr>
<tr>
<td>说明</td><td></td><td>正常工作模式，<br>毫安级功耗，<br>适用于功耗要求不高的场景</td><td>微安级功耗，<br>可快速唤醒，<br>适用于高频次休眠/唤醒场景</td><td>更低功耗模式，<br>适用于长时间休眠，<br>并保持必要网络连接</td>
</tr>
<tr>
<td>CPU主频</td><td></td><td>正常</td><td>降频</td><td>休眠</td>
</tr>
<tr>
<td>RAM状态</td><td></td><td>保持</td><td>保持</td><td>掉电</td>
</tr>
<tr>
<td rowspan="5">外设</td><td>普通GPIO</td><td>可用</td><td>不可用</td><td>不可用</td>
</tr>
<tr>
<td>AON GPIO</td><td>可用</td><td>可用</td><td>可用</td>
</tr>
<tr>
<td>APWM</td><td>可用</td><td>可用</td><td>可用</td>
</tr>
<tr>
<td>外设状态（I2C/SPI/I2S/PWM/ADC/UART/CAN）</td><td>可用</td><td>不可用</td><td>不可用</td>
</tr>
<tr>
<td>VDD_EXT</td><td>保持输出</td><td>部分型号支持输出</td><td>部分型号支持输出</td>
</tr>
<tr>
<td rowspan="5">唤醒方式</td><td>wakeup/pwrkey</td><td>可用</td><td>可用</td><td>可用</td>
</tr>
<tr>
<td>软件定时器</td><td>支持</td><td>支持</td><td>不支持</td>
</tr>
<tr>
<td>低功耗定时器</td><td>支持</td><td>支持</td><td>支持</td>
</tr>
<tr>
<td>低功耗UART</td><td>支持</td><td>支持</td><td>支持</td>
</tr>
<tr>
<td>数据、短信</td><td>支持</td><td>支持</td><td>支持</td>
</tr>
<tr>
<td rowspan="2">数据通信</td><td>应用协议</td><td>FTP(S)/MQTT(S)<br>HTTP(S)/WebSocket<br>LWM2M/COAP<br>TCP/TCP(S)/UDP(S)</td><td>FTP(S)/MQTT(S)<br>HTTP(S)/WebSocket<br>LWM2M/COAP<br>TCP/TCP(S)/UDP(S)</td><td>LWM2M/COAP<br>TCP/UDP</td>
</tr>
<tr>
<td>下行寻呼</td><td>支持</td><td>支持</td><td>支持</td>
</tr>
</table>

不同功耗模式下的电流大致范围为：

| **功耗模式** | **不可寻呼电流** |
| ---- | ---- |
| `LIOT_SLEEP_MODE_NORMAL` | ~4mA |
| `LIOT_SLEEP_MODE_LOW` | ~60uA |
| `LIOT_SLEEP_MODE_DEEP_LOW` | ~9.5uA |

## 2 API 函数概览

| **函数** | **说明** |
| ---- | ---- |
| `Liot_SleepSetMode()` | 设置功耗模式 |
| `Liot_SleepTimerStart()` | 开启低功耗定时器 |
| `Liot_SleepTimerStop()` | 停止低功耗定时器 |
| `Liot_SleepTimerCheck()` | 检测低功耗定时器是否在运行 |
| `Liot_SleepTimerGetID()` | 获取唤醒系统的低功耗ID |

## 3 类型说明

### 3.1 liot_sleep_mode_type_e

功耗模式类型。

1. 声明

```c
typedef enum {
    LIOT_SLEEP_MODE_NORMAL,      // normal mode
    LIOT_SLEEP_MODE_LOW,         // sleep mode
    LIOT_SLEEP_MODE_DEEP_LOW,    // deep sleep mode
}liot_sleep_mode_type_e;
```

2. 参数

- `LIOT_SLEEP_MODE_NORMAL`：正常工作模式
- `LIOT_SLEEP_MODE_LOW`：低功耗模式
- `LIOT_SLEEP_MODE_DEEP_LOW`：超低功耗模式

**说明：**

`LIOT_SLEEP_MODE_LOW` 与 `LIOT_SLEEP_MODE_DEEP_LOW` 模式外设都会掉电，如果想要进入该模式，需要1、关闭软件定时器，2、挂起所有非阻塞任务，3、关闭外设驱动。

`LIOT_SLEEP_MODE_LOW` 模式RAM是不掉电状态，应用需要将任务都挂起，如果是创建了定时器，定时器超时后会唤醒系统。如果任务非阻塞态，在超时时间到了也会唤醒系统，建议等待时间修改为forever。

`LIOT_SLEEP_MODE_DEEP_LOW` 模式RAM掉电状态，系统唤醒后代码相当于重新运行，需要再应用程序的开始进行唤醒原因判断，如果使用了低功耗定时器，可以通过 `Liot_SleepTimerGetID()` 接口查询查询具体唤醒系统的硬件定时器ID。该模式下可以保持1路tcp与1路udp，TCP链路的状态系统会进行备份恢复，应用层无需做额外处理；与服务器维护的心跳时间不宜过短，否则会引起系统频繁唤醒，也不能超过IP老化时间一般10分钟以内。若老化时间到期，模组需重新进行网络附着，功耗会激增。

### 3.2 LiotSleepModeCfg_t

功耗模式配置结构体。

1. 声明

```c
typedef struct {
    liot_sleep_mode_type_e mode;    //sleep mode
} LiotSleepModeCfg_t;
```

2. 参数

| **类型** | **参数** | **描述** |
| ---- | ---- | ---- |
| liot_sleep_mode_type_e | mode | 功耗模式 |

### 3.3 Liot_SleepTimerID_e

低功耗定时器枚举选项。

1. 声明

```c
typedef enum {
    LIOT_DEEPSLP_TIMER_ID0 = 0,		// num 0/1: 2 AONTimer, without flash storage, 2.5 hour in 100Hz
	LIOT_DEEPSLP_TIMER_ID1,
	LIOT_DEEPSLP_TIMER_ID2,
	LIOT_DEEPSLP_TIMER_ID3,
	LIOT_DEEPSLP_TIMER_ID4,
	LIOT_DEEPSLP_TIMER_ID5,
    LIOT_DEEPSLP_TIMER_MAX_NUM,
}Liot_SleepTimerID_e;
```

2. 参数

- `LIOT_DEEPSLP_TIMER_ID0`：低功耗定时器ID 0
- `LIOT_DEEPSLP_TIMER_ID1`：低功耗定时器ID 1
- `LIOT_DEEPSLP_TIMER_ID2`：低功耗定时器ID 2
- `LIOT_DEEPSLP_TIMER_ID3`：低功耗定时器ID 3
- `LIOT_DEEPSLP_TIMER_ID4`：低功耗定时器ID 4
- `LIOT_DEEPSLP_TIMER_ID5`：低功耗定时器ID 5

3. 说明

- `LIOT_DEEPSLP_TIMER_ID0` 与 `LIOT_DEEPSLP_TIMER_ID1` 属于AON定时器，系统复位后定时器失效，**最大超时时间2.5小时，这2个定时器不会写FLASH**。
- `LIOT_DEEPSLP_TIMER_ID2` ~ `LIOT_DEEPSLP_TIMER_ID5` 属于深度休眠定时器，**最大超时时间740小时，这些定时器会写FLASH，使用时需要注意。这些定时器会进行FLASH擦写，Flash 有擦写寿命。如果开发者在循环中频繁开启/停止这些定时器，模组可能会在几个月内损坏。严禁高频率（如秒级）循环调用，仅建议用于长周期的唤醒任务。**

### 3.4 liot_sleep_errcode_e

低功耗接口错误码枚举选项。

1. 声明

```c
typedef enum{
  LIOT_SLEEP_SUCCESS             = LIOT_SUCCESS,
  LIOT_SLEEP_INVALID_PARAM       = (LIOT_COMPONENT_PM_SLEEP << 16) | 1000,
  LIOT_SLEEP_LOCK_CREATE_FAIL    = (LIOT_COMPONENT_PM_SLEEP << 16) | 1001,
  LIOT_SLEEP_LOCK_DELETE_FAIL    = (LIOT_COMPONENT_PM_SLEEP << 16) | 1002,
  LIOT_SLEEP_LOCK_LOCK_FAIL      = (LIOT_COMPONENT_PM_SLEEP << 16) | 1003,
  LIOT_SLEEP_LOCK_UNLOCK_FAIL    = (LIOT_COMPONENT_PM_SLEEP << 16) | 1004,
  LIOT_SLEEP_LOCK_AUTOSLEEP_FAIL = (LIOT_COMPONENT_PM_SLEEP << 16) | 1005,
  LIOT_SLEEP_PARAM_SAVE_FAIL     = (LIOT_COMPONENT_PM_SLEEP << 16) | 1006,
} liot_sleep_errcode_e;
```

2. 参数

- `LIOT_SLEEP_SUCCESS`：执行成功
- `LIOT_SLEEP_INVALID_PARAM`：无效的参数
- `LIOT_SLEEP_LOCK_CREATE_FAIL`：休眠句柄创建失败
- `LIOT_SLEEP_LOCK_DELETE_FAIL`：休眠句柄删除失败
- `LIOT_SLEEP_LOCK_LOCK_FAIL`：休眠句柄投票失败
- `LIOT_SLEEP_LOCK_UNLOCK_FAIL`：休眠句柄取消投票失败
- `LIOT_SLEEP_LOCK_AUTOSLEEP_FAIL`：设置自动进入休眠模式失败
- `LIOT_SLEEP_PARAM_SAVE_FAIL`：参数保存到NV失败

## 4 API函数详解

### 4.1 DeepSlpTimerCb_Func

低功耗函数超时回调函数，注意：不可以在该函数执行耗时的操作。

1. 声明

```c
typedef void (*DeepSlpTimerCb_Func)(Liot_SleepTimerID_e timeid);
```

2. 参数

- `timeid`：[In] 低功耗定时器ID，请参考 3.3。

3. 返回值

- void

### 4.2 Liot_SleepSetMode

该函数用于设置设备休眠模式。设置休眠模式后，不会立即进入低功耗，系统内部会进行投票检测，所有投票"允许"后才真正进入低功耗。设置在系统复位后失效。

1. 声明

```c
liot_sleep_errcode_e Liot_SleepSetMode(LiotSleepModeCfg_t *cfg);
```

2. 参数

- `cfg`：[In] 休眠模式配置。

3. 返回值

- `liot_sleep_errcode_e`：执行结果码，请参考 3.4。

### 4.3 Liot_SleepTimerStart

该函数用于开启低功耗定时器。

1. 声明

```c
liot_sleep_errcode_e Liot_SleepTimerStart(Liot_SleepTimerID_e timeid, uint32_t timeout, DeepSlpTimerCb_Func cb);
```

2. 参数

- `timeid`：[In] 低功耗定时器ID，请参考 3.3。**客户若频繁调用会擦写 Flash 的定时器（ID2-5），会导致硬件损坏。**
- `timeout`：[In] 低功耗定时器超时时间，不同的定时器ID，可以设置的最大时间不一样，请根据业务进行选择，请参考 3.3。
- `cb`：[In] 低功耗定时器超时回调函数，请参考 4.1。

3. 返回值

- `liot_sleep_errcode_e`：执行结果码，请参考 3.4。

### 4.4 Liot_SleepTimerStop

该函数用于停止低功耗定时器。

低功耗定时器在超时后会自动删除，若要启动需要重新Start。

1. 声明

```c
liot_sleep_errcode_e Liot_SleepTimerStop(Liot_SleepTimerID_e timeid);
```

2. 参数

- `timeid`：[In] 低功耗定时器ID，请参考 3.3。

3. 返回值

- `liot_sleep_errcode_e`：执行结果码，请参考 3.4。

### 4.5 Liot_SleepTimerCheck

该函数用于检查低功耗定时器是否在运行中。

1. 声明

```c
bool Liot_SleepTimerCheck(Liot_SleepTimerID_e timeid);
```

2. 参数

- `timeid`：[In] 低功耗定时器ID，请参考 3.3。

3. 返回值

- `bool`：true 低功耗定时器运行中，false 低功耗定时器未运行。

### 4.6 Liot_SleepTimerGetID

该函数用于获取唤醒系统的定时器ID。

主要只用于 `LIOT_SLEEP_MODE_DEEP_LOW` 休眠模式下，系统唤醒后查询唤醒系统的低功耗定时器ID使用，正常模式无作用。

1. 声明

```c
Liot_SleepTimerID_e Liot_SleepTimerGetID(void);
```

2. 参数

- void

3. 返回值

- `Liot_SleepTimerID_e`：唤醒系统的定时器ID。

## 5 代码示例

示例代码参考 `LSDK/example/src/demo_sleepex.c`。

**运行结果：**

进入 `LIOT_SLEEP_MODE_LOW` 测试日志

根据demo首先进入 `LIOT_SLEEP_MODE_LOW` 低功耗模式，然后启动1分钟的低功耗定时器，唤醒后系统判断是否为低功耗定时器唤醒系统，然后退出休眠低功耗休眠模式。

<div align="center">
<img src="_images/低功耗模式使用说明/image_1.png" width="600"/>
</div>

进入 `LIOT_SLEEP_MODE_DEEP_LOW` 测试日志

根据demo首先进入 `LIOT_SLEEP_MODE_DEEP_LOW` 低功耗模式，然后启动1分钟的低功耗定时器，唤醒后系统判断是否为低功耗定时器唤醒系统，然后退出休眠低功耗休眠模式。

<div align="center">
<img src="_images/低功耗模式使用说明/image_2.png" width="600"/>
</div>

## 6 常见问题

- 对于 `LIOT_SLEEP_MODE_DEEP_LOW` 模式，当系统进入该模式之后，RAM会掉电，全局变量在系统唤醒后会被清零，如果需要保存关键数据，建议使用文件系统进行保存，在系统唤醒后再进行变量恢复。
