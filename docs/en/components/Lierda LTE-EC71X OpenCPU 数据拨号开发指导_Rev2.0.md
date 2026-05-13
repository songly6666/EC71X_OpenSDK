# Data DialDevelopment Guide\_Rev2.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| **Version** | **Date** | **Author** | **Revision Content** |
| --- | --- | --- | --- |
| Rev1.0 | 23-09-15 | YPP | Created Document |
| Rev1.1 | 24-03-25 | sxx | Changed Document Name |
| Rev1.2 | 24-10-25 | LJZ | Modified Document Format |
| Rev1.3 | 25-04-09 | ZW | Added Section 4.16, Added Interfaceliot\_network\_register\_cereg\_get. |
| Rev1.4 | 26-01-09 | ZLC | Added Section 4.16, AddedInterface. |
| Rev2.0 | 26-03-03 | YMX | Modified Document Format |

## 1 Introduction

This document mainly introduces LTE-EC71X OpenCPU Data Dial API FunctionDetails, API Located at\PLAT\middleware\lierda\_open\lierda\_api\liot\_nw\inc\liot\_datacall.h File.

* **Network Registration: **liot\_network\_register\_wait(Network Registration) is automatic action after boot, but if dedicated SIM card, need to configure APN first, then control the device switch to implement network registration.

* **Dial Activation: **liot\_start\_data\_call(Dial) is Manual Get Service IP Action, to implement data communication between module and base station, must perform Dial.

* **Default Bearer(Default EPS Bearer): **  Cat.1 Moduleafter successful attachment usually auto-activate CID 1.


Added

## 2 API Function Overview

### 2.1 Core Control

| **Function** | **Description** |
| --- | --- |
| [liot\_start\_data\_call()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8nt6pn6uante) | Start Data Dial |
| [liot\_stop\_data\_call()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy9k2bxf368k4y) | Stop Data Dial |
| [liot\_set\_data\_call\_asyn\_mode()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy9p4eihd5eite) | Set Start and Stop Data DialFunction Execution mode |
| [liot\_datacall\_set\_nat()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyaj90q38qajs5) | Enable NAT Function |

### 2.2 Status Query

| **Function** | **Description** |
| --- | --- |
| [liot\_get\_data\_call\_info()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy6ftfwg06gwwa) | Get Data Dial Info |
| [liot\_datacall\_get\_sim\_profile\_is\_active()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy9s7f2w8vyrh) | GetCurrent PDP Context ActivateStatus |
| [liot\_datacall\_get\_default\_pdn\_info()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy99am1obv8sxn) | Get Default Bearer Info |
| [liot\_network\_register\_wait()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyabq77vglzcck) | Wait for Network Registration |
| [liot\_network\_register\_cereg\_get()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m99qkgmyvzhmrvlvsm8) | Get Network Registration Status |
| [liot\_datacall\_get\_nat()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyakk3yl6y0t0r) | Query(U)SIM Card Corresponding  NAT mode |
| [Liot\_DataCallCfgDefaultEpsBearer()](https://alidocs.dingtalk.com/i/nodes/MyQA2dXW7e7kn7ZLfpLr6reRJzlwrZgb?utm_scene=team_space&iframeQuery=anchorId%3Duu_mk6laxbges3z8sehxcw) | SetorQueryDefault Bearer(CID 1)  APN and IP Type |

### 2.3 Event Handling

| **Function** | **Description** |
| --- | --- |
| [liot\_datacall\_register\_cb()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4i13sb6d0s5q) | Register Data Dial Callback Function |
| [liot\_datacall\_unregister\_cb()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy58gyeu5iktte) | Unregister Data Dial Callback |
| [Liot\_PsEventCb()](https://alidocs.dingtalk.com/i/nodes/MyQA2dXW7e7kn7ZLfpLr6reRJzlwrZgb?utm_scene=team_space&iframeQuery=anchorId%3Duu_mk6kgot4vwatib9xpsm) | Register System Event Callback. |

### 2.4 IP Address Tools

| **Function** | **Description** |
| --- | --- |
| [liot\_ip4addr\_ntoa()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyajvdoou5r1vw) | IPv4 Address to String |
| [liot\_ip6addr\_ntoa()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyaco6qat24n8a) | IPv6 Address to String |
| [liot\_ip4addr\_aton()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyb2h5pirf174q) | IPv4 String to Address |
| [liot\_ip6addr\_aton()](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmyb5xf6ko5tnof) | IPv6 String to Address |

## 3 API FunctionDetails

### 3.1 liot\_datacall\_register\_cb

This function is used forRegister Data Dial Callback Function. Whether async or sync mode, need to register callbackreports network deactivation/detach events, can initiate re-Dial on event.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_datacall_register_cb(uint8_t nSim, int profile_idx, liot_datacall_callback datacall_cb, void *ctx)
    ```

* **Parameter**

nSim:

\[In\] Used (U)SIM Card, IfModuleonly supports 1 (U)SIM Interface, This Parameter Canset to 0, value: 0-1 or 0xFF.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7 or 0xFF.

datacall\_cb:

\[In\] Callback to Register. See Section [4.1.1](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4h4ajit077cw) .

ctx:

\[In\] Callback Parameter Pointer.

* **Return Value**


See Section [4.1.2](https://lierda.feishu.cn/docx/VB8ndMgiAotqJ3xjEgicmMpanud?contentTheme=DARK&amp;theme=LIGHT#ARm3dgj7bohdakxsTugccXUkn1c) .

#### 3.1.1 liot\_datacall\_callback

This callback reports data Dial events.

* **Declaration**

    ```c
typedef void (*liot_datacall_callback)(uint8_t nSim, unsigned int ind_type, int profile_idx, bool result, void *ctx);
    ```

* **Parameter**


nSim:

\[In\] Used (U)SIM Card, IfModuleonly supports 1 (U)SIM Interface, This Parameter Canset to 0, value: 0-1 or 0xFF.

ind\_type:

\[In\] Data Dial Event Type.

| **Event** | **Description** |
| --- | --- |
| LIOT\_DAT ACALL\_ACT\_RSP\_IND | In async mode PDP Activate Result Response Event |
| LIOT\_DAT ACALL\_DEACT\_RSP\_IND | In async mode PDP Deactivate Result Response Event |
| LIOT\_DAT ACALL\_PDP\_DEACTIVE\_IND | PDP Network Deactivationor Detach Event |

profile\_idx:

\[In\] PDP Context ID, Range: 1~7 or 0xFF.

result:

\[In\] PDP Context Activate and Deactivate Result, 0 Failure, 1 Success.

ctx:

\[In\] Callback Parameter Pointer.

#### 3.1.2 liot\_datacall\_errcode\_e

Data Dial API Execution Result Error Codes.

* **Declaration**

    ```c
typedef enum{
LIOT_DAT ACALL_SUCCESS = 0,
LIOT_DAT ACALL_EXECUTE_ERR = 1 | LIOT_DAT ACALL_ERRCODE_BASE,
LIOT_DAT ACALL_MEM_ADDR_NULL_ERR,
LIOT_DAT ACALL_INVALID_PARAM_ERR,
LIOT_DAT ACALL_NW_REGISTER_TIMEOUT_ERR,
LIOT_DAT ACALL_CFW_ACT_STAT E_GET_ERR = 5 | LIOT_DAT ACALL_ERRCODE_BASE, LIOT_DAT ACALL_REPEAT_ACTIVE_ERR,
LIOT_DAT ACALL_REPEAT_DEACTIVE_ERR,
LIOT_DAT ACALL_CFW_PDP_CTX_SET_ERR,
LIOT_DAT ACALL_CFW_PDP_CTX_GET_ERR,
LIOT_DAT ACALL_CS_CALL_ERR = 10 | LIOT_DAT ACALL_ERRCODE_BASE,
LIOT_DAT ACALL_CFW_CFUN_GET_ERR,
LIOT_DAT ACALL_CFUN_DISABLE_ERR,
LIOT_DAT ACALL_NW_STAT US_GET_ERR,
LIOT_DAT ACALL_NOT_REGISTERED_ERR,
LIOT_DAT ACALL_NO_MEM_ERR = 15 | LIOT_DAT ACALL_ERRCODE_BASE,
LIOT_DAT ACALL_CFW_AT TACH_STAT US_GET_ERR,
LIOT_DAT ACALL_SEMAPHORE_CREAT E_ERR,
LIOT_DAT ACALL_SEMAPHORE_TIMEOUT_ERR,
LIOT_DAT ACALL_CFW_AT TACH_REQUEST_ERR,
LIOT_DAT ACALL_CFW_ACTIVE_REQUEST_ERR = 20 | LIOT_DAT ACALL_ERRCODE_BASE,
LIOT_DAT ACALL_ACTIVE_FAI L_ERR,
LIOT_DAT ACALL_CFW_DEACTIVE_REQUEST_ERR,
LIOT_DAT ACALL_NO_DFTP DN_CFG_CONTEXT,
LIOT_DAT ACALL_NO_DFTP DN_INFO_CONTEXT,
} liot_datacall_errcode_e;
    ```

* **Parameter**


| **Parameter** | **Description** |
| --- | --- |
| LIOT\_DAT ACALL\_SUCCESS | ExecuteSuccess |
| LIOT\_DAT ACALL\_EXECUTE\_ERR | ExecuteFailure |
| LIOT\_DAT ACALL\_MEM\_ADDR\_NULL\_ERR | Parameter Address is NULL |
| LIOT\_DAT ACALL\_INVALID\_PARAM\_ERR | Parameter is invalid |
| LIOT\_DAT ACALL\_NW\_REGISTER\_TIMEOUT\_ERR | Network RegistrationTimeout |
| LIOT\_DAT ACALL\_CFW\_ACT\_STAT E\_GET\_ERR | Get PDP Context ActivateStatusFailure |
| LIOT\_DAT ACALL\_REPEAT\_ACTIVE\_ERR | Repeated PDP Context Activation |
| LIOT\_DAT ACALL\_REPEAT\_DEACTIVE\_ERR | Repeated PDP Context Deactivation |
| LIOT\_DAT ACALL\_CFW\_PDP\_CTX\_SET\_ERR | Set PDP ContextFailure |
| LIOT\_DAT ACALL\_CFW\_PDP\_CTX\_GET\_ERR | Get PDP ContextFailure |
| LIOT\_DAT ACALL\_CS\_CALL\_ERR | Ongoing call causes data business operation failure |
| LIOT\_DAT ACALL\_CFW\_CFUN\_GET\_ERR | GetFunctionmodeFailure |
| LIOT\_DAT ACALL\_CFUN\_DISABLE\_ERR | Non-full function mode causes data business operation failure |
| LIOT\_DAT ACALL\_NW\_STAT US\_GET\_ERR | Get Network Registration StatusFailure |
| LIOT\_DAT ACALL\_NOT\_REGISTERED\_ERR | Network not registered |
| LIOT\_DAT ACALL\_NO\_MEM\_ERR | Memory request failure |
| LIOT\_DAT ACALL\_CFW\_AT TACH\_STAT US\_GET\_ERR | GetNetworkattachmentStatusFailure |
| LIOT\_DAT ACALL\_SEMAPHORE\_CREAT E\_ERR | Semaphore creation failure |
| LIOT\_DAT ACALL\_SEMAPHORE\_TIMEOUT\_ERR | Semaphore wait timeout |
| LIOT\_DAT ACALL\_CFW\_AT TACH\_REQUEST\_ERR | Network attachment rejected |
| LIOT\_DAT ACALL\_CFW\_ACTIVE\_REQUEST\_ERR | PDP Context Activation Rejected |
| LIOT\_DAT ACALL\_ACTIVE\_FAI L\_ERR | PDP Context ActivateFailure |
| LIOT\_DAT ACALL\_CFW\_DEACTIVE\_REQUEST\_ERR | PDP Context Deactivation Rejected |
| LIOT\_DAT ACALL\_NO\_DFTP DN\_CFG\_CONTEXT | not configuredDefault BearerContext |
| LIOT\_DAT ACALL\_NO\_DFTP DN\_INFO\_CONTEXT | NoneDefault BearerContextInformation |

### 3.2 liot\_datacall\_unregister\_cb

This function is used to unregister the liot\_datacall\_register\_cb() registered callback function. After unregistering, the callback function will no longer receive data dial related events.

* **Function**

    ```c
liot_datacall_errcode_e liot_datacall_unregister_cb(uint8_t nSim, int profile_idx, liot_datacall_callback datacalliot_cb, void *ctx);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card, IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0, value: 0-1 or 0xFF.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7 or 0xFF.

datacall\_cb:

\[In\] Callback to Register. See Section [4.1.1](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4h4ajit077cw) .

ctx:

\[In\] Callback Parameter Pointer.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.3 liot\_get\_data\_call\_info

This function is used forGet Data Dial Info.

* **Function**

    ```c
liot_datacall_errcode_e liot_get_data_call_info(UINT8 nSim, INT32 profile_idx, liot_data_call_info_t *call_info);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7.

call\_info:

\[Out\] Data DialInformation. See Section [4.3.1](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy6nva7m0yvbd0) .

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

**3.3.1 liot\_data\_call\_info\_t**

Data DialInformation.

* **Declaration**

    ```c
typedef struct{
INT32 cid;
INT32 ip_version;
liot_v4_info v4;
liot_v6_info v6;
char apn_name[LIOT_APN_LEN_MAX];
} liot_data_call_info_t;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| cid | INT32 | PDP Context ID. Range: 1~7. |
| ip\_version | INT32 | IP Type. <br>1    IP v4<br>2    IP v6<br>3    IP v4v6 |
| v4 | struct liot\_v4\_info | IP v4 Information. See Section [4.3.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy6lt4b2dae99r) . |
| v6 | struct liot\_v6\_info | IP v6 Information. See Section [4.3.5](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7sy9pcxyqrn) . |
| apn\_name | char | APN name, string, max length 64. |

**3.3.2 liot\_v4\_info**

IP v4 Information.

* **Declaration**

    ```c
typedef struct
{
INT32 state; // Dial status
liot_v4_address_status addr; // IP v4 address information
} liot_v4_info;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| state | INT32 | Dial Status. <br>0    Not dialed<br>1    Dial succeeded |
| addr | struct liot\_v4\_address\_status | IP v4 AddressStatus. See Section [4.3.3](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7h8qtx414jqq) . |

**3.3.3 liot\_v4\_address\_status**

IP v4 AddressStatus.

* **Declaration**

    ```c
typedef struct
{
liot_ip4_addr_t ip;
liot_ip4_addr_t pri_dns;
liot_ip4_addr_t sec_dns;
} liot_v4_address_status;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| ip | struct liot\_ip4\_addr\_t | Get  IP v4 Address. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs) . |
| pri\_dns | struct liot\_ip4\_addr\_t | Primary DNS server IP v4 Address. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs)  . |
| sec\_dns | struct liot\_ip4\_addr\_t | Secondary DNS server IP v4 Address. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs) . |

**3.3.4 liot\_ip4\_addr\_t**

IP v4 Address.

* **Declaration**

    ```c
typedef struct
{
UINT32 addr;
} liot_ip4_addr_t;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| addr | UINT32 | IP v4 Address. |

**3.3.5 liot\_v6\_info**

IP v6 Information.

* **Declaration**

    ```c
typedef struct
{
INT32 state; // Dial status
liot_v6_address_status addr; // IP v6 address information
} liot_v6_info;
    ```

* **Parameter**

| **Parameter** | Type | **Description** |
    | --- | --- | --- |
| state | INT32 | Dial Status. <br>0    Not dialed<br>1    Dial succeeded |
| addr | struct liot\_v6\_address\_status | IP v6 AddressStatus. See Section [4.3.6](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7c2ddzgrlm7t) . |

**3.3.6 liot\_v6\_address\_status**

IP v6 AddressStatus.

* **Declaration**

    ```c
typedef struct
{
liot_ip6_addr_t ip;
liot_ip6_addr_t pri_dns;
liot_ip6_addr_t sec_dns;
} liot_v6_address_status;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| ip | struct liot\_ip6\_addr\_t | Get  IP v6 Address. See Section [4.3.7](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8irk4wwc4jfg) . |
| pri\_dns | struct liot\_ip6\_addr\_t | Primary DNS server IP v6 Address. See Section [4.3.7](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8irk4wwc4jfg) . |
| sec\_dns | struct liot\_ip6\_addr\_t | Secondary DNS server IP v6 Address. See Section [4.3.7](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8irk4wwc4jfg) . |

**3.3.7 liot\_ip6\_addr\_t**

IP v6 Address.

* **Declaration**

    ```c
typedef struct
{
UINT32 addr[4];
} liot_ip6_addr_t;
    ```

* **Parameter**


| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| addr | UINT32 | IP v6 Address, size is 4 bytes. |

### 3.4 liot\_start\_data\_call

This function is used to start data dial. default is sync mode, for async mode please use liot\_set\_data\_call\_asyn\_mode() to set. Difference between sync mode and async mode is as follows:

1. Syncmode: After function execution ends, returns data dial result codes, If returns LIOT\_DAT ACALL\_SUCCESS it means data dial succeeded, Getto IP Address, Canperform socket communication.


2. Async Mode: After function execution ends, returns function execution result codes, If returns LIOT\_DAT ACALL\_SUCCESS does not mean data dial succeeded, only means function executed successfully, registered callback function will through LIOT\_DAT ACALL\_ACT\_RSP\_IND Event notifies upper layer whether dial succeeded.


* **Declaration**

    ```c
liot_datacall_errcode_e liot_start_data_call(UINT8 nSim, INT32 cid, INT32 ip_version, CHAR *apn_name, CHAR *username, CHAR *password, INT32 auth_type);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

cid:

\[In\] PDP Context ID, Range: 1~7.

ip\_version:

\[In\] IP Version: 1 IP v4, 2 IP v6, 3 IP v4v6.

apn\_name:

\[In\] APN name.

username:

\[In\] User name.

password:

\[In\] User password.

auth\_type:

\[In\] Authentication type. See Section [4.4.1](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy83sf8j29dr98) .

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

### 3.4.1 liot\_data\_auth\_type\_e

Authentication type.

* **Declaration**

    ```c
typedef enum
{
LIOT_DAT A_AUTH_TYPE_AUTO = 0xFF,
LIOT_DAT A_AUTH_TYPE_NONE = 0,
LIOT_DAT A_AUTH_TYPE_PAP,
LIOT_DAT A_AUTH_TYPE_CHAP,
} liot_data_auth_type_e;
    ```

* **Parameter**

| **Parameter** | **Description** |
    | --- | --- |
| LIOT\_DAT A\_AUTH\_TYPE\_AUTO | Automatically select PAP or CHAP authentication protocol |
| LIOT\_DAT A\_AUTH\_TYPE\_NONE | No authentication protocol |
| LIOT\_DAT A\_AUTH\_TYPE\_PAP | PAP authentication protocol |
| LIOT\_DAT A\_AUTH\_TYPE\_CHAP | CHAP authentication protocol |

## 3.5 liot\_datacall\_get\_default\_pdn\_info

This function is used forGet Default Bearer Info.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_datacall_get_default_pdn_info(uint8_t nSim, liot_data_call_default_pdn_info_s *ctx);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

ctx:

\[Out\] Bearer information. See Section [4.5.1](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy998l0p2lsd1b) .

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

**3.5.1 liot\_data\_call\_default\_pdn\_info\_s**

Authentication type.

* **Declaration**

    ```c
typedef struct{
uint8_t ip_version;
liot_ip4_addr_t ipv4;
liot_ip6_addr_t ipv6;
char apn_name[LIOT_APN_LEN_MAX];
} liot_data_call_default_pdn_info_s;
    ```

* **Parameter**

| **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
| ip\_version | uint8\_t | IP Type. <br>1    IP v4<br>2    IP v6<br>3    IP v4v6 |
| ipv4 | struct liot\_ip4\_addr\_t | IP v4 Information. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs) . |
| ipv6 | struct liot\_ip6\_addr\_t | IP v6 Information. See Section [4.3.7](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8irk4wwc4jfg) . |
| apn\_name | char | APN name, string, max length 64. |

## 3.6 liot\_datacall\_get\_sim\_profile\_is\_active

This function is used forGetCurrent PDP Context ActivateStatus.

* **Declaration**

    ```c
bool liot_datacall_get_sim_profile_is_active(uint8_t nSim, int profile_idx);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7.

* **Return Value**

true Activated, false Not activated.

## 3.7 liot\_stop\_data\_call

This function is used to stop data dial. default is sync mode, for async mode please use liot\_set\_data\_call\_asyn\_mode() to set. When stopping dial, all depending onThis cid   Socket Connectwill be forciblyDisable.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_stop_data_call(UINT8 nSim, INT32 profile_idx);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.8 liot\_set\_data\_call\_asyn\_mode

This function is used to set the execution mode of start and stop data dial functions(i.e. liot\_start\_data\_call() and liot\_stop\_data\_call()) Execution mode. Execution mode is divided into sync and async modes. mustin liot\_start\_data\_call beforeCall, to configure execution mode.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_set_data_call_asyn_mode(uint8_t nSim, int profile_idx, bool enable);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

profile\_idx:

\[In\] PDP Context ID, Range: 1~7.

enable:

\[In\] FunctionExecution mode: 0 Syncmode, 1 Async Mode.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.9 liot\_network\_register\_wait

This function is used to wait for network registration. Network registration is automatically completed after boot , only after successful registration, can perform data dial. If currently not registered to network, will block the thread calling this function, until network registration succeeds or times out then exits.

This function belongs to sync function, will wait for network registration within timeout time and return after success, If timeout reached and still not registered to network, returns registration failure. Suggest calling this interface in a separate thread.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_network_register_wait(uint8_t nSim, unsigned int timeout_s);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

timeout\_s:

\[In\] Wait time for network registration timeout. unit: seconds.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4).

## 3.10 liot\_datacall\_set\_nat

This function is used forEnable NAT Function. Configuration takes effect after module restart. NATFunctionusuallyinModuleasto RNDIS/ECM network card usageonly whenwillEnable.

* **Declaration**

    ```c
liot_datacall_errcode_e liot_datacall_set_nat(uint8_t nSim, UINT32 natmode);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

natmode:

\[In\] NAT mode: 0 Enable, 1 Disable.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.11 liot\_datacall\_get\_nat

This function is used forQuery (U)SIM Card Corresponding  NAT mode.

* **Function**

    ```c
liot_datacall_errcode_e liot_datacall_get_nat(uint8_t nSim, UINT32 *natmode);
    ```

* **Parameter**

nSim:

\[In\] Used  (U)SIM Card. IfModuleonly supports 1  (U)SIM Interface, This Parameter Canset to 0. Value: 0-1.

natmode:

\[Out\] NAT mode: 0 Enable, 1 Disable.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.12 liot\_ip4addr\_ntoa

This function is used for IP V4 Address to String, The purpose is to convert binary IP address to user-readable string.

* **Function**

    ```c
CHAR *liot_ip4addr_ntoa(liot_ip4_addr_t *addr);
    ```

* **Parameter**

addr:

\[In\] IP V4 AddressPointer. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs) .

* **Return Value**

String.

## 3.13 liot\_ip6addr\_ntoa

This function is used for IP V6 Address to String, The purpose is to convert binary IP address to user-readable string.

* **Function**

    ```c
CHAR *liot_ip6addr_ntoa(liot_ip6_addr_t *addr);
    ```

* **Parameter**

addr:

\[In\] IP V6 AddressPointer. See Section [4.3.7](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy8irk4wwc4jfg) .

* **Return Value**

String.

## 3.14 liot\_ip4addr\_aton

This function is used for IP V4 String to Address, Converts user-readable  IP v4 Address string to binary format required for network programming binary format.

* **Function**

    ```c
BOOL liot_ip4addr_aton(CHAR *cp, liot_ip4_addr_t *addr);
    ```

* **Parameter**

cp:

\[In\] IP V4 String.

addr:

\[Out\] IP V4 AddressPointer. See Section [4.3.4](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy7rc13sv3enfs).

* **Return Value**

true Success, false Failure.

## 3.15 liot\_ip6addr\_aton

This function is used for IP V6 String to Address, Converts user-readable  IP v6 Address string to binary format required for network programming binary format.

* **Function**

    ```c
BOOL liot_ip6addr_aton(CHAR *cp, liot_ip6_addr_t *addr);
    ```

* **Parameter**

cp: \[In\] IP V6 String.

addr: \[Out\] Pointer to converted IPv6 address.

* **Return Value**

See Section [4.1.2](https://lierda.feishu.cn/docx/VB8ndMgiAotqJ3xjEgicmMpanud?contentTheme=DARK&amp;theme=LIGHT#ARm3dgj7bohdakxsTugccXUkn1c) .

## 3.16 liot\_network\_register\_cereg\_get

This function is used to get network registration status. Equivalent to underlying CEREG (Cellular Register) Status QueryInterface Return.

* **Function**

    ```c
liot_datacall_errcode_e liot_network_register_cereg_get(uint8_t nSim);
    ```

* **Parameter**

nSim:

\[In\] Used (U)SIM Card, IfModuleonly supports 1 (U)SIM Interface, This Parameter Canset to 0, value: 0-1 or 0xFF.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

## 3.17 Liot\_PsEventCb

This function registers callback function, Get system network registration, Dial, OOS event.

Liot\_PsEventCb Used for monitoring overall network status(network registration, OOS), while liot\_datacall\_register\_cb focuses on async response events after dial interface initiation.

* **Function**

    ```c
liot_datacall_errcode_e Liot_PsEventCb(Liot_PsEventCallback_t callback);
    ```

* **Parameter**

callback:

\[In\] User registered event notification callback, When network registration occurs, Dial, OOS event will trigger notification.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

### 3.17.1 Liot\_PsEventCallback\_t

This callback function is used to report network registration, Dial, OOS events.

* **Declaration**

| ```c<br>typedef void (*Liot_PsEventCallback_t)(Liot_PsEvent_e eventId, void *param, UINT32 paramLen);<br>``` |
    | --- |

* **Parameter**

eventId:

\[In\] NotificationEventID.

| **Event** | **Description** |
    | --- | --- |
| LIOT\_PS\_EVENT\_BEARER\_ACTED | Network RegistrationSuccess |
| LIOT\_PS\_EVENT\_BEARER\_DEACTED | Network RegistrationFailure |
| LIOT\_PS\_EVENT\_NETIF\_OOS | Noneservice(Out of Service) |
| LIOT\_PS\_EVENT\_NETIF\_ACTIVAT ED | NetworkInterfaceattachment success |
| LIOT\_PS\_EVENT\_NETIF\_DEACTIVAT ED | NetworkInterfaceattachmentFailure |
| LIOT\_PS\_EVENT\_MAX | Enumeration maximum(used for boundaryCheck) |

param:

\[In\] Callback function event corresponding parameter, not used yet.

paramLen:

\[In\] Callback function event corresponding parameter length, not used yet.

## 3.18 Liot\_DataCallCfgDefaultEpsBearer

ThisFunctionSetorQueryDefault Bearer(CID 1)  APN and IP Type.

* **Function**

    ```c
liot_datacall_errcode_e Liot_DataCallCfgDefaultEpsBearer(Liot_DataCallCFG_t *cfg);
    ```

* **Parameter**

cfg:

\[In\] Configuration structure.

* **Return Value**

See Section [4.1.2](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuXe1XXn586zbX04v?utm_scene=team_space&iframeQuery=anchorId%3Duu_m05cnmy4qjcee3sytq4) .

**3.18.1 Liot\_DataCallCFG\_t**

Configure default bearer structure.

* **Declaration**

    ```c
typedef struct
{
Liot_DataCallMethod_e method; ///< Operation method: Set or query configuration
Liot_DataCallIpType_e ip_version; ///< IP Type
char apn[LIOT_APN_LEN_MAX]; ///< APN String
uint16_t apn_len; ///< APN string actual length
} Liot_DataCallCFG_t;
    ```

* **Parameter**

| **Type** | **Parameter** | **Description** |
    | --- | --- | --- |
| Liot\_DataCallMethod\_e | method | Operation method: Set or query configuration |
| Liot\_DataCallIpType\_e | ip\_version | SetorQuery  IP Type(V4/V6/IP V4V6) |
| char | apn | APN, max 100 bytes |
| uint16\_t | apn\_len | APN String actualLength |

**3.18.2 Liot\_DataCallMethod\_e**

Operation method enumeration definition: Set or query configuration.

* **Declaration**

    ```c
typedef enum
{
LIOT_DAT ACALL_APN_SET, ///< Set APN configure
LIOT_DAT ACALL_APN_GET, ///< Query APN configure
LIOT_DAT ACALL_APN_MAX ///< Maximum value(Used forboundaryCheck)
} Liot_DataCallMethod_e;
    ```

* **Parameter**

| **Enum Value** | **Description** |
    | --- | --- |
| LIOT\_DAT ACALL\_APN\_SET | Set APN configure |
| LIOT\_DAT ACALL\_APN\_GET | Query APN configure |
| LIOT\_DAT ACALL\_APN\_MAX | Maximum value(Used forboundaryCheck) |

**3.18.3 Liot\_DataCallIpType\_e**

Definition IP Type Enumeration.

* **Declaration**

    ```c
typedef enum
{
LIOT_PS_PDN_TYPE_IP_V4 = 1, ///< IP v4 Type
LIOT_PS_PDN_TYPE_IP_V6, ///< IP v6 Type
LIOT_PS_PDN_TYPE_IP_V4V6, ///< IPv4/IPv6 dual stack type
LIOT_PS_PDN_TYPE_NUM ///< IP type count (used for counting)
} Liot_DataCallIpType_e;
    ```

* **Parameter**


| **Enum Value** | **Description** |
| --- | --- |
| LIOT\_PS\_PDN\_TYPE\_IP\_V4 | IP v4 Type |
| LIOT\_PS\_PDN\_TYPE\_IP\_V6 | IP v6 Type |
| LIOT\_PS\_PDN\_TYPE\_IP\_V4V6 | IP v4/IP v6 dual stackType |
| LIOT\_PS\_PDN\_TYPE\_NUM | IP TypeCount(used for counting) |

## 4 CodeExample

Example code reference \PLAT\project\ec7xx\_0h00\ap\apps\lierda\_app\lierda\_examples\liot\_datacall\_demo.c File. As follows run result describes getting all information normally:

* Syncmode

![Drawing 0](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOLwj1Zprmqpz2/img/98ee7ad6-fb9b-4617-b544-230d4b5fad5b.jpeg)

* Async Mode


![Drawing 1](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/eYVOLwj1Zprmqpz2/img/2f04f629-2060-46cb-a061-655f04e2999e.jpeg)

## 5 Terminology

* **PDN Context**: Packet Data Network Context  is Moduleand operatorNetworkestablishdatachannel logical entity.

* **CID**: profile\_idx (CID)  is Thischannel  ID, Rangeusuallyto 1-7.  CID  is all subsequentNetworkoperation(DNS, Socket), identifier needed, User identifies through which to establish data business.

* **APN**: Access Point Name  is operatorNetwork access point. it is Activate PDN Context  keyParameter. Ensure APN namecorrect.