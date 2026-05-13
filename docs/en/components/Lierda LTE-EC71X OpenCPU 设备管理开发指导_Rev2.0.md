# Device Management Development Guide\_Rev2.0

{link_to_translation}`zh_CN:[in文]`

## Document Revision History

| **Version** | **Date** | **Author** | **Reviewer** | **Revision Content** |
| --- | --- | --- | --- | --- |
| Rev1.0 | 23-09-19 | LJZ | zlc | Created Document |
| Rev1.1 | 24-03-25 | sxx | | Changed Document Name |
| Rev1.2 | 24-10-25 | LJZ | | Modified Document Format |
| Rev1.3 | 25-05-14 | LJZ | | Optimized Document Format |
| Rev1.4 | 25-12-27 | ZLC | | AddedAPI Interface Description |
| Rev1.5 | 26-02-25 | ZLC | | AddedAPI Interface Description |
| Rev2.0 | 26-03-03 | YMX | | Modified Document Format |

## 1 Introduction

This document introduces LTE-EC71X Device Management Interface API Overview,  API InterfaceLocated at PLAT/middleware/lierda\_open/lierda\_api/liot\_platform/inc/liot\_dev.h file declaration.

### 1.1 Principle Description

#### 1.1.1 RRC Fast Release Principle

1. LTE Standard RRC Connection Release Mechanism


In traditional LTE network, RRC Connection Release is completely controlled by network side(base station)control. Base station will maintain one for each UE (user terminal)**inactivity timer**(Inactivity Timer).

* **Working Principle**: When UE and base station stop data transmission, this timer starts. If before timer timeout(for example 10s or 20s)before new data transmission, base station actively sends to UE `RRCConnectionRelease` message, commanding UE to release connection, return toRRC\_IDLEStatusto savePower Consumption.

* **Existing Issue**: This mechanism depends on network configuration. In some networks, if base station not configured this timer or timer set too long, UE stays in connected state for long time, causing unnecessary power consumption.


1. RRC Fast Release Core Principle: terminal-initiated

To overcome above issues, implement“fastRelease”, proposed and applied a**terminal-initiated** optimization solution. The core idea is : **let terminal based on its own business model, after confirming data transmission complete, immediately initiate process, prompt network to release RRC connection. **

working principle described through following steps:

![deepseek_mermaid_20260227_15da4d.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7Jm238ml7M/img/aa7361b2-50c0-493e-83b4-3753181b0f37.png)

2. RRC Fast Release Application Significance

**Significantly Reduce Power**: Cat1 mainly targets IoT(IoT)market, such as smart wearables, industrial sensors, etc., extremely sensitive to power consumption. Reducing RRC connection duration from network-controlled 10s to terminal business end ms/s level, can significantly extend device battery life.

3. Operation Drawbacks


* **due to underlying implementation reasons, enabling this function may cause inability to receive downlink data for short time. **

* **For applications with high requirements for real-time and reliability, please use with caution. **


#### 1.1.2 Frequency and Frequency Point Locking(Lock Freq)

1. Frequency Lock (Lock Freq): Lock frequency resource **Principle Description: **        When you issue frequency lock command to module, actually limiting module physical layer search range. in LTE in protocol, terminal will perform full band scan after boot or out of network, to find cell with strongest signal.


* **Default behavior**: Module scans all supported bands, finds cell with best signal to camp on.

* **After frequency lock**: Module will skip normal frequency scanning logic, only tune to specified  EARFCN to receive signal. If cell exists on this frequency point and signal meets standard, it camps on it; if not exists, it reports out of network, and will not try other frequency points.


Test usage examples:

* **Shielded room/production test**: In production environment, shielded box has only one fixed base station signal. Frequency lock can ensure module only connects to this specified test base station, avoid searching stray signals outside shielded box causing wrong connection.

* **Interference investigation**: If you suspect interference in certain frequency segment, can lock to that frequency point, observe module receive indicators(such as RSSI, i.e., received signal strength indicator).

* **Band switching verification**: When testing module switching from Band 8 to Band 3, can force module to work on specific frequency point through frequency lock.


1. Cell Lock (Lock Cell): Lock physical cell identity **Principle Description: **     Cell lock is one level finer than frequency lock. It is after module completes frequency sync, incellselect/added to reselection algorithm“identity filter”.


* **Working process**: Module can still scan multiple frequency points(if command allows), but after decoding system messages of each cell, and knowing their  PCI after, Module will compare these PCI. onlyhasWhen PCI with locked value matches, Module will attempt to camp; for PCI non-matching cell, even if signal strength is 20dB, Module will directly ignore.


Test usage examples:

* **Handover preparation**: When testing handover from cell A to cell B, can first lock on cell A for signaling interaction, after handover trigger condition is met, observe module is whether canSuccessswitchto cell B(At this time need to unlock or change lock target first).

* **Avoid failure cell**: If in road test find certain specific PCI cell signal is strong but data cannot be transmitted, can temporarily lock other PCI cells to maintain business continuity.


## 2 API Function Overview

### 2.1 deviceInformationQuery

| **Function** | **Description** |
| --- | --- |
| [liot\_dev\_get\_imei()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9qiryk7fg1lij) | Get device  IMEI number |
| liot\_dev\_get\_firmware\_version[()](https://lierda.feishu.cn/wiki/Wv8UwMKdei1A7ek9mXcczClonGd#part-Wuk6drEs6oiOWtx5CBScB7i8nce) | Get device firmware version |
| [liot\_dev\_get\_model()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9r117ekcdbqjv) | Get device model |
| [liot\_dev\_get\_sn()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9q1y1ku8gbkd8) | Get deviceSerial Number |
| [liot\_dev\_get\_product\_id()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9qa6cp3ombqpp) | Get deviceManufacturer ID |
| [liot\_dev\_get\_firmware\_subversion()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9qhcz81tdbsh3) | Used for getting device sub-firmware version |
| [Liot\_DevGetHardWareInfo()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mm1nqyw9bmlscimb62w) | Get hardware model |

### 2.2  SystemFunctioncontrol

| **Function** | **Description** |
| --- | --- |
| [liot\_dev\_set\_modem\_fun()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rjqx2ehfmut1) | Setdevice modem Function |
| [liot\_dev\_get\_modem\_fun()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rdn09d9a8ce0) | Get device modem Function |
| [Liot\_DevSetBandMode()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mjo0huyx78nkgaiiwx) | Set available bands |
| [Liot\_DevGetBandMode()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mjo0pumalhz8cfhi38l) | Query available bands and supported band list |
| [Liot\_DevFreqConfig()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mjo1ajzkgr41ezs8sdk) | Lock frequency point, cell and clear priority frequency point |
| [Liot\_RRCRelease()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mk6al4keg2fz0xsco4a) | Enable fast release |
| [Liot\_DevSetDnsServersAddr()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mk6jbla2rm7v7752nf8) | Set primary/backup DNS server address |
| [Liot\_DevGetDnsServersAddr()](https://alidocs.dingtalk.com/i/nodes/7QG4Yx2JpLGB6GnKS1RZ4kwgJ9dEq3XD?utm_scene=team_space&iframeQuery=anchorId%3Duu_mk6jmqkz994c19r3e5b) | Query primary/backup DNS server address |

### 2.3 System Security/Diagnostics

| **Function** | **Description** |
| --- | --- |
| [liot\_dev\_set\_modem\_fun()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rjqx2ehfmut1) | Setdevice modem Function |
| [liot\_dev\_get\_modem\_fun()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rdn09d9a8ce0) | Get device modem Function |
| [liot\_dev\_memory\_size\_query()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rmy39pzfd6ms) | Query heap spaceStatusInformation |
| [liot\_dev\_cfg\_wdt()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9rafmbiveg3at) | configurewatchdog(timer)switch |
| [liot\_dev\_feed\_wdt()](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9scjjznhvh0za) | feedSystemwatchdog(willtimerclear) |

## 3 TypeDescription

### 3.1 liot\_errcode\_dev\_e

DEV API Execution Result Error Codes.

1. Declaration


```c
typedef enum
{
LIOT_DEV_SUCCESS = LIOT_SUCCESS, ///< Operation successful
LIOT_DEV_EXECUTE_ERR = 1 | LIOT_DEV_ERRCODE_BASE, ///< Execution error
LIOT_DEV_MEM_ADDR_NULL_ERR, ///< Memory address null error
LIOT_DEV_INVALID_PARAM_ERR, ///< Invalid parameter error
LIOT_DEV_BUSY_ERR, ///< Device busy error
LIOT_DEV_SEMAPHORE_CREAT E_ERR, ///< Semaphore creation error
LIOT_DEV_SEMAPHORE_TIMEOUT_ERR, ///< Semaphore timeout error
LIOT_DEV_HANDLE_INVALID_ERR, ///< Invalid handle error
LIOT_DEV_CFW_CFUN_GET_ERR = 15 | LIOT_DEV_ERRCODE_BASE, ///< CFW CFUN get error
LIOT_DEV_CFW_CFUN_SET_CURR_COMM_FLAG_ERR = 18 | LIOT_DEV_ERRCODE_BASE, ///< CFW CFUN set current comm flag error
LIOT_DEV_CFW_CFUN_SET_COMM_ERR, ///< CFW CFUN set comm error
LIOT_DEV_CFW_CFUN_SET_COMM_RSP_ERR, ///< CFW CFUN set comm response error
LIOT_DEV_CFW_CFUN_RESET_BUSY = 25 | LIOT_DEV_ERRCODE_BASE, ///< CFW CFUN reset busy
LIOT_DEV_CFW_CFUN_RESET_CFW_CTRL_ERR, ///< CFW CFUN reset CFW control error
LIOT_DEV_CFW_CFUN_RESET_CFW_CTRL_RSP_ERR, ///< CFW CFUN reset CFW control response error
LIOT_DEV_IMEI_GET_ERR = 33 | LIOT_DEV_ERRCODE_BASE, ///< IMEI get error
LIOT_DEV_SN_GET_ERR = 36 | LIOT_DEV_ERRCODE_BASE, ///< Serial number get error
LIOT_DEV_UID_READ_ERR = 39 | LIOT_DEV_ERRCODE_BASE, ///< UID read error
LIOT_DEV_TEMP_GET_ERR = 50 | LIOT_DEV_ERRCODE_BASE, ///< Temperature get error
LIOT_DEV_WDT_CFG_ERR = 53 | LIOT_DEV_ERRCODE_BASE, ///< Watchdog timer configuration error
LIOT_DEV_HEAP_QUERY_ERR = 56 | LIOT_DEV_ERRCODE_BASE, ///< Heap query error
LIOT_DEV_AUTHCODE_READ_ERR = 90 | LIOT_DEV_ERRCODE_BASE, ///< Auth code read error
LIOT_DEV_AUTHCODE_ADDR_NULL_ERR, ///< Auth code address null error
LIOT_DEV_READ_WIFI_MAC_ERR = 100 | LIOT_DEV_ERRCODE_BASE, ///< Read WiFi MAC address NV error
} liot_errcode_dev_e;
```

2. Parameter


* LIOT\_DEV\_SUCCESS: FunctionExecuteSuccess.


* LIOT\_DEV\_EXECUTE\_ERR: FunctionExecuteFailure .


* LIOT\_DEV\_MEM\_ADDR\_NULL\_ERR: Pointer NULL Error.


* LIOT\_DEV\_INVALID\_PARAM\_ERR: ParameterError.


* LIOT\_DEV\_BUSY\_ERR: Device busy, operation failure .


* LIOT\_DEV\_SEMAPHORE\_CREAT E\_ERR: Semaphore creation failure.


* LIOT\_DEV\_SEMAPHORE\_TIMEOUT\_ERR: Semaphore timeout.


* LIOT\_DEV\_HANDLE\_INVALID\_ERR: Invalid handle.


* LIOT\_DEV\_CFW\_CFUN\_GET\_ERR: CurrentFunctionmodeGetFailure.


* LIOT\_DEV\_CFW\_CFUN\_SET\_CURR\_COMM\_FLAG\_ERR: Current does not support function mode set .


* LIOT\_DEV\_CFW\_CFUN\_SET\_COMM\_ERR: FunctionmodeSetFailure.


* LIOT\_DEV\_CFW\_CFUN\_SET\_COMM\_RSP\_ERR: FunctionmodeSetResponseException .


* LIOT\_DEV\_CFW\_CFUN\_RESET\_BUSY: Shutdown busy, Previous shutdown process in progress .


* LIOT\_DEV\_CFW\_CFUN\_RESET\_CFW\_CTRL\_ERR: Disable protocol stack failure .


* LIOT\_DEV\_CFW\_CFUN\_RESET\_CFW\_CTRL\_RSP\_ERR: Disable protocol stack response exception.


* LIOT\_DEV\_IMEI\_GET\_ERR: IMEI GetFailure.


* LIOT\_DEV\_SN\_GET\_ERR: deviceSerial NumberGetFailure .


* LIOT\_DEV\_UID\_READ\_ERR: Unique ID code get failure .


* LIOT\_DEV\_TEMP\_GET\_ERR: Chip temperature get failure.


* LIOT\_DEV\_WDT\_CFG\_ERR: watchdog(timer)switchconfigureFailure.


* LIOT\_DEV\_HEAP\_QUERY\_ERR: Heap Status QueryFailure.


* LIOT\_DEV\_AUTHCODE\_READ\_ERR: Camera decode library authorization code read failure .


* LIOT\_DEV\_AUTHCODE\_ADDR\_NULL\_ERR: Get camera decode library authorization code address is NULL.


* LIOT\_DEV\_READ\_WIFI\_MAC\_ERR: Read Wi-Fi MAC AddressFailure.


**Description**

| LIOT\_DEV\_CFWprefixed Error Codesindicates underlying communication protocol stackExecuterelatedoperation failure |
| --- |

### 3.2 liot\_dev\_cfun\_e

Function mode enumeration type definition as follows

1. Declaration


```c
typedef enum{
LIOT_DEV_CFUN_MIN = 0,
LIOT_DEV_CFUN_FULL = 1,
LIOT_DEV_CFUN_AI R = 4,
}liot_dev_cfun_e;
```

2. Parameter


* LIOT\_DEV\_CFUN\_MIN: Minimum function mode, RF radio function disabled, SIM card function not available.


* LIOT\_DEV\_CFUN\_FULL: Full function mode  .


* LIOT\_DEV\_CFUN\_AI R: Disable ME Send and receive radio signal function, Flight mode, SIM card can read but no network.


### 3.3 liot\_memory\_heap\_state\_s

Space status information structure definition as follows

1. Declaration


```c
typedef struct{
UINT32 total_size; ///< memory heap total size
UINT32 avail_size; ///< available size. The actual allocatable size may be less than this
}liot_memory_heap_state_s;
```

2. Parameter


| **Type** | **Parameter** | **Description** |
| --- | --- | --- |
| UINT32 | total\_size | Heap space total size |
| UINT32 | avail\_size | System can request maximum memory block size |

### 3.4 Liot\_DevGetBandMode\_e

Query band list mode

1. Declaration


```c
typedef enum
{
LIOT_DEV_GET_CAN_USED_BAND_LIST = 0, ///< Query to get the list of currently used bands
LIOT_DEV_GET_SUPPORT_BAND_LIST = 1, ///< Query to get the list of supported bands
LIOT_DEV_GET_BAND_MAX_NUM ///< Placeholder for maximum number of band query types
} Liot_DevGetBandMode_e;
```

2. Parameter


* LIOT\_DEV\_GET\_CAN\_USED\_BAND\_LIST: Query available band list.


* LIOT\_DEV\_GET\_SUPPORT\_BAND\_LIST: Query supported band list.


* LIOT\_DEV\_GET\_BAND\_MAX\_NUM: Used for maximum band query type count placeholder.


### 3.5 Liot\_DevFreqOpt\_e

Frequency point operation mode

1. Declaration


```c
typedef enum
{
LIOT_DEV_SET_UNLOCK = 0, ///< Unlock cell
LIOT_DEV_SET_PRIORITY_FREQ = 1, ///< Set priority frequency
LIOT_DEV_SET_LOCK_FREQ_OR_CELLID = 2, ///< Lock frequency or cell
LIOT_DEV_SET_CLEAN_PRIORITY_FREQ = 3, ///< Clear priority frequency
LIOT_DEV_GET_FREQ = 4, ///< Get frequency information
LIOT_DEV_SET_MAX_FREQ_MODE ///< Maximum frequency mode (placeholder)
} Liot_DevFreqOpt_e;
```

2. Parameter


* LIOT\_DEV\_SET\_UNLOCK: Unlock cell.


* LIOT\_DEV\_SET\_PRIORITY\_FREQ: Set priority frequency point.


* LIOT\_DEV\_SET\_LOCK\_FREQ\_OR\_CELLID: Lock frequency point or cell.

* LIOT\_DEV\_SET\_CLEAN\_PRIORITY\_FREQ:Clear priority frequency point.

* LIOT\_DEV\_GET\_FREQ:Get lock frequency information.

* LIOT\_DEV\_SET\_MAX\_FREQ\_MODE:Maximum frequency mode (placeholder).


### 3.6 Liot\_DevFreqConfig\_t

Frequency point configuration structure

1. Declaration


```c
#define SUPPORT_MAX_FREQ_NUM 8 ///< Maximum number of supported frequencies

typedef struct
{
Liot_DevFreqOpt_e mode; ///< Operation mode, refer to
UINT16 phyCellId; ///< Physical Cell ID, range: 0 - 503

UINT8 arfcnNum; ///< Number of frequencies:
///< - Must not be 0 when the mode is
///< - Maximum value is

UINT32 lockedArfcn; ///< Locked EARFCN (E-UTRA Absolute Radio Frequency Channel Number)
UINT32 arfcnList[SUPPORT_MAX_FREQ_NUM]; ///< Frequency list, supports up to
} Liot_DevFreqConfig_t;
```

2. Parameter


| **Type** | **Parameter** | **Description** |
| --- | --- | --- |
| Liot\_DevFreqOpt\_e | mode | operationmode |
| UINT16 | phyCellId | Physical cell ID, Range: 0 – 503 |
| UINT8 | arfcnNum | When mode to LIOT\_DEV\_SET\_LOCK\_FREQ\_OR\_CELLID or LIOT\_DEV\_SET\_PRIORITY\_FREQ when notCanto 0 |
| UINT32 | lockedArfcn | Locked  EARFCN(E-UTRA Absolute Radio Frequency Channel Number) |
| UINT32 | arfcnList | Frequency point list, Maximum support SUPPORT\_MAX\_FREQ\_NUM  |

### 3.7 Liot\_DevRRCRelease\_t

RRC Fast Release configuration structure

1. Declaration


```c
typedef struct
{
bool mode; //< Enable or Disable RRC fast release:
//< - true: Enable
//< - false: Disable
uint16_t idle_time; //< Wait idle time before executing fast release(unit: seconds)
uint16_t retry_time; //< Retry time (currently not used)
} Liot_DevRRCRelease_t;
```

2. Parameter


| **Type** | **Parameter** | **Description** |
| --- | --- | --- |
| bool | mode | Enable or Disable RRC fast release |
| uint16\_t | idle\_time | Wait idle time before executing fast release, Value range 1~50(unit: seconds) |
| uint16\_t | retry\_time | Retry time (currently not used) |

### 3.8 Liot\_DevDnsServer\_t

DNS server address structure

1. Declaration


```c
#define LIOT_WARE_DEFAULT_DNS_NUM 2
#define LIOT_WARE_ADDR_LEN 64

/**
* @brief DNS Server Address Structure
*
* Used to store the device's DNS server addresses, including both IP v4 and IP v6 addresses.
* example: ipv4Dns[0] = "192.168.1.1"
* ipv6Dns[0] = "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
*
* strcpy((char*)dns.ipv4Dns[0], "8.8.8.8");
*/
typedef struct
{
UINT8 ipv4Dns[LIOT_WARE_DEFAULT_DNS_NUM][LIOT_WARE_ADDR_LEN + 1]; ///< IP v4 DNS address list
UINT8 ipv6Dns[LIOT_WARE_DEFAULT_DNS_NUM][LIOT_WARE_ADDR_LEN + 1]; ///< IP v6 DNS address list
} Liot_DevDnsServer_t;
```

2. Parameter


| **Type** | **Parameter** | **Description** |
| --- | --- | --- |
| UINT8 | ipv4Dns | IPv4 DNS address list |
| UINT8 | ipv6Dns | IPv6 DNS address list |

## 4 API FunctionDetails

### 4.1 liot\_dev\_get\_imei

This function is used to get IMEI number.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_imei(char *p_imei,size_t imei_len,uint8_t nSim);
```

2. Parameter


* p\_imei: \[Out\] Pointer to read IMEI data address.


* imei\_len: \[In\] Read IMEI data buffer size, Buffer not less than 16 bytes.


* nSim: \[In\] SIM card index, Value: 0-1,  EC71X series module usually only supportssingle card, Suggest usually set nSimto 0.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.2 liot\_dev\_get\_firmware\_version

This function is used to get device firmware version.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_firmware_version(char *p_version,size_t version_len);
```

2. Parameter


* p\_version: \[Out\] Pointer to read customer version data address.


* version\_len: \[In\] Read customer version data buffer size, Suggest not less than 64 bytes .


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.3 liot\_dev\_get\_sn

This function is used forGet deviceSN.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_sn(char *p_sn,size_t sn_len,uint8_t nSim);
```

2. Parameter


* p\_sn: \[Out\] Pointer to read SN data address.


* sn\_len: \[In\] Read SN data buffer size , Buffer not less than 32 bytes.


* nSim: \[In\] SIM card index, Value: 0-1.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.4 liot\_dev\_get\_product\_id

This function is used forGet deviceManufacturer ID.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_product_id(char* p_product_id, size_t product_id_len);
```

2. Parameter


* p\_product\_id: \[Out\] Pointer to read ID data address.


* product\_id\_len: \[In\] Read ID data buffer size, Buffer at least 16 bytes.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.5 liot\_dev\_get\_firmware\_subversion

This function is used to get device sub-firmware version.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_firmware_subversion(char *p_subversion,size_t subversion_len);
```

2. Parameter


* p\_subversion: \[Out\] Pointer to read sub-version data address.


* subversion\_len: \[In\] Read sub-version data buffer size.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.6 liot\_dev\_get\_model

This function is used to get device model.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_model(char* p_model, size_t model_len);
```

2. Parameter


* p\_model: \[Out\] Pointer to read device model data address, Buffer at least 16 bytes.


* model\_len: \[In\] Read device model data buffer size.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.7 liot\_dev\_set\_modem\_fun

This function is used forSetdevice modem Function.

1. Declaration


```c
liot_errcode_dev_e liot_dev_set_modem_fun(uint8_t at_dst_fun, uint8_t rst, uint8_t nSim);
```

2. Parameter


* at\_dst\_fun: \[In\] needSet  modem Function, Value: [liot\_dev\_cfun\_e](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9pcgdbfiofenh).


* rst: \[In\] Set modem Functionbefore is whetherRestart modem, Value: 0-1, When rst=0 does not reset system, When rst=1 calling interface will reset system.


* nSim: \[In\] SIM card index, Value: 0-1.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.8 liot\_dev\_get\_modem\_fun

This function is used forGet deviceCurrent modem Function.

1. Declaration


```c
liot_errcode_dev_e liot_dev_get_modem_fun(uint8_t *p_function, uint8_t nSim);
```

2. Parameter


* p\_function: \[Out\] deviceCurrent modem Function, Value: [liot\_dev\_cfun\_e](https://alidocs.dingtalk.com/i/nodes/9bN7RYPWdMo06oejuvjrvkRxVZd1wyK0?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnx9pcgdbfiofenh).


* nSim: \[In\] SIM card index, Value: 0-1.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.9 liot\_dev\_memory\_size\_query

This function is used forQuery heap spaceStatusInformation.

byFreeRTOS inwillgenerate memory fragmentation, and eventually lead to inability to request large memory blocks, So when performing memory request in time, avoid frequently requesting large memory blocks of different sizes.

1. Declaration


```c
liot_errcode_dev_e liot_dev_memory_size_query(liot_memory_heap_state_s *liot_heap_state);
```

2. Parameter


* liot\_heap\_state: \[Out\] Heap spaceStatusInformation, See[liot\_memory\_heap\_state\_s](https://lierda.feishu.cn/wiki/Wv8UwMKdei1A7ek9mXcczClonGd#part-Oi8LdqTzcoHdM3xvj8LckgSnnJh) .


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.10 liot\_dev\_cfg\_wdt

This function is used forconfigurewatchdog(timer)switch.

**System default will automatically feed dog, Unless performing underlying debug, otherwise notSuggestDisable WDT. Mass production code strictly prohibits disabling WDT. **

1. Declaration


```c
liot_errcode_dev_e liot_dev_cfg_wdt(uint8_t opt);
```

2. Parameter


* opt: \[In\] Watchdog switch, Value: 0-1.


3. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.11 liot\_dev\_feed\_wdt

This function is used forfeedSystemwatchdog(willtimerclear).

System will default perform feeding dog, After currently disabling system watchdog, can call this interface to feed dog, feed watchdogoperationshouldin a **separate and high priority**  in taskExecute, itsPeriodmust**less than**watchdog Timeout Time.

1. Declaration


```c
liot_errcode_dev_e liot_dev_feed_wdt(void);
```

2. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.12 Liot\_DevSetBandMode

This function is used to set system available frequency point list. Only suggest using during debug.

**Mass production firmware needs note, Careful operation！ If set available bands do not include current environment base station band, Module will not be able to register to network. SetaftermustRestartradio frequency(CFUN 0/1)methodCantake effect. **

1. Declaration


```c
liot_errcode_dev_e Liot_DevSetBandMode(uint8_t bandNum, uint8_t *orderBand);
```

2. Parameter


* bandNum: \[In\] needSet frequency point orderBand Count.

* orderBand: \[In\] Set frequency point list. If set frequency point not in supported frequency point list, can cause set failure. After set need to re-enable radio to take effect.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.13 Liot\_DevGetBandMode

This function is used to query system supported band list and available frequency point list.

1. Declaration


```c
liot_errcode_dev_e Liot_DevGetBandMode(Liot_DevGetBandMode_e mode, uint8_t *bandNum, uint8_t *orderBand);
```

2. Parameter


* mode: \[In\] Query mode, Distinguish supported frequency points and available frequency points, Please reference 3.4 Section. When mode toCell Lockwhen, need phyCellId Parameter; When locking frequency point, need lockedArfcn Parameter.

* bandNum: \[Out\] Save query result order band array size, Minimum must be 32 bytes.

* orderBand: \[Out\] Save query result order band array.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.14 Liot\_DevFreqConfig

This function is used to lock frequency point, cell, Clear locked frequency point cell and clear priority frequency point.

1. Declaration


```c
liot_errcode_dev_e Liot_DevFreqConfig(Liot_DevFreqConfig_t *info);
```

2. Parameter


* info: \[In\] Query mode, Distinguish supported frequency points and available frequency points, Please reference 3.6 Section.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.15 Liot\_RRCRelease

This function is used forconfigure RRC(NoneresourceSourcecontrol)fastReleasefeature, Enable device after sending heartbeat packet or data business, can quickly enter low power status.

* **due to underlying implementation reasons, enabling this function may cause inability to receive downlink data for short time. **

* **For applications with high requirements for real-time and reliability, please use with caution. **


1. Declaration


```c
liot_errcode_dev_e Liot_RRCRelease(Liot_DevRRCRelease_t *cfg);
```

2. Parameter


* cfg: \[In\] Configuration mode, Enable or disable fast release, Please reference 3.7 Section.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.16 Liot\_DevSetDnsServersAddr

Setprimary/backup DNS serverAddress.

1. Declaration


```c
liot_errcode_dev_e Liot_DevSetDnsServersAddr(Liot_DevDnsServer_t *dns_servers);
```

2. Parameter


* dns\_servers: \[In\] Configuration structure, Please reference 3.8.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1Section.


### 4.17 Liot\_DevGetDnsServersAddr

Queryprimary/backup DNS serverAddress.

1. Declaration


```c
liot_errcode_dev_e Liot_DevGetDnsServersAddr(Liot_DevDnsServer_t *dns_servers);
```

2. Parameter


* dns\_servers: \[out\] Configuration structure, Please reference 3.8 Section.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


### 4.18 Liot\_DevGetHardWareInfo

Query device hardware version information.

1. Declaration


```c
liot_errcode_dev_e Liot_DevGetHardWareInfo(const char*hdversion, uint16_t len);
```

2. Parameter


* hdversion: \[out\] Get hardware version buffer address.

* len: \[in\] Get hardware version buffer size, At least 32 bytes.


1. Return Value


* liot\_errcode\_dev\_e: Execution result codes, Please reference 3.1 Section.


## 5 CodeExample

1. Example code reference  PLAT\project\ec7xx\_0h00\ap\apps\lierda\_app\lierda\_examples\liot\_dev\_demo.c File. As follows run result describes getting all information normally:

![Drawing 0](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/AJdl64ABjM6Pqke1/img/bc96b132-e2e3-48af-9181-be9c548a4628.png)

2. CFUN SetandQueryExample


```c
uint8_t cfun = 0;
liot_dev_get_modem_fun(&cfun, 0);
liot_trace("cfun: %d", cfun);
liot_dev_set_modem_fun(LIOT_DEV_CFUN_FULL, 0, 0);
```

## 6 otherIssue

1. WDT system watchdog timeout time is 20s.

2. switch CFUN modeafter, Will network connection disconnect？CurrentSetliot\_dev\_set\_modem\_funinat\_dst\_fun=0or4when, Network connection will disconnect. ifneedreconnect to network, needSetat\_dst\_fun=1.

3. IMEI full name is International Mobile Equipment Identity, by GSMAwill(GSMA)uniformlyAllocateandmanagement. Each device has uniqueness and cannot be tampered.

4. SN full name is Serial Number, is manufacturertofor internalmanagementassigned to each product “unique ID”. It does not have international standard like IMEI, Is used for product internal management.