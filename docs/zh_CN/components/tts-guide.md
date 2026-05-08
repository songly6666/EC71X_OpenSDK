# Lierda LTE-EC71X OpenCPU TTS 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| 版本 | 日期 | 作者 | 修订内容 |
| ---- | ---- | ---- | ---- |
| 1.0 | 2023-09-11 | LHL、YHP | 创建文档 |
| 1.1 | 2024-03-25 | sxx | 更改文档名称 |
| 1.2 | 2024-09-11 | LHL | 新增 liot_tts_engine_init 注册回调函数返回值说明、音量设置测试数据、16K 库使用说明。修改 liot_pUserCallback、liot_tts_end、liot_tts_exit 和 liot_tts_is_running 函数说明、更改了示例 demo，demo 中增加了 GBK、Unicode 编码播放用例和 PWM、codec 播放选择接口。 |
| 1.3 | 2024-11-07 | zw | 修改文档格式，删除 demo。 |
| 1.4 | 2025-04-01 | zlc | 增加外挂 flash 测试与烧录指导 |
| 1.5 | 2025-08-29 | zlc | 增加讯飞《Aisound5 简单文本标注用户手册》手册，方便客户参考对特殊数据的处理。 |
| 1.6 | 2025-12-30 | zlc | 修改使能 TTS 不同采样率的方式。 |
| 1.7 | 2026-04-28 | mbb | 根据底包分离版本更新文档内容、增加快速上手指南。 |

## 1简介

本文档介绍 LTE-EC71X 平台的 TTS（Text-to-Speech，文本转语音）接口 API 情况。API 接口声明位于 `LSDK/components/kernel/lierda_api/liot_tts/liot_tts.h` 文件中。

### 1.1 默认 Demo 配置

输出格式：默认 Demo 中 TTS 输出 PCM 采样率为 8K，支持中文。

SDK 支持范围：SDK 支持多种采样率和语言组合，包括：

- 8K 中文（8k_zh）
- 16K 中文（16k_zh）
- 8K 英文（8k_en）
- 16K 英文（16k_en）

文本编码支持：TTS 引擎支持以下文本输入编码格式，可通过 `liot_tts_set_config_param` 接口配合 `LIOT_TTS_CONFIG_ENCODING` 进行配置：

- UTF-8（默认）
- GBK
- UCS-2

### 1.2 资源文件说明

资源文件格式：当前 SDK 中 TTS 资源文件为 `.bin` 格式，存放于 `LSDK/components/tts/` 目录下。不同采样率和语言对应的资源文件如下：

| 资源文件名 | 采样率/语言 | 大小（约） |
| ---- | ---- | ---- |
| ttsRes_8k_zh.bin | 8K 中文 | 527 KB |
| ttsRes_16k_zh.bin | 16K 中文 | 603 KB |
| ttsRes_8k_en.bin | 8K 英文 | 603 KB |
| ttsRes_16k_en.bin | 16K 英文 | 590 KB |

资源加载方式：TTS 资源文件在编译时通过打包工具自动写入模组内部 Flash 的 TTS 专用区域。运行时通过 `liot_tts_set_resource` 接口设置资源读取回调，TTS 引擎会在需要时通过回调从 Flash 中读取资源数据。无需将资源文件加载到 RAM 中，可有效节省内存。

### 1.3 SDK 配置指南

使能 TTS 功能并选择资源类型，需进行以下配置：

#### 步骤 1：使能 TTS 组件编译

打开 `LSDK/rules/Makefile.defs` 文件，将 `BUILD_COMP_TTS_EN` 设置为 `y`：

```makefile
BUILD_COMP_TTS_EN ?= y
```

#### 步骤 2：选择 TTS 资源类型

在同一文件中，通过 `TTS_RESOURCE_TYPE` 选择需要的采样率和语言组合：

```makefile
# TTS_RESOURCE_TYPE values
# 8kzh     : 8K采样率+中文
# 16kzh    : 16K采样率+中文
# 8ken     : 8K采样率+英语
# 16ken    : 16K采样率+英语
TTS_RESOURCE_TYPE ?= 8kzh
```

例如，需要使用 16K 中文采样率，将 `TTS_RESOURCE_TYPE` 修改为 `16kzh` 即可。底层库会根据资源类型自动适配，无需手动替换库文件。

#### 步骤 3：使能 TTS Demo（可选）

如需编译运行 TTS Demo，打开 `LSDK/examples/demo/config`，将 `EXDEMO_TTS_EN` 设置为 `y`：

```makefile
EXDEMO_TTS_EN ?= y
```

完成上述配置后，正常编译即可。编译过程中，系统会自动将对应的 `.bin` 资源文件打包到固件中。

### 1.4 Aisound5 文本标注使用说明

Aisound5 是讯飞提供的 TTS 文本标注系统，当用户需要对 TTS 合成效果进行精细化控制时使用，主要应用场景包括：

- 数字读法控制：如将 "1200" 控制为读作"一千二百"（金额方式）或"一二零零"（号码方式）。
- 发音人切换：在一段话中动态切换不同发音人。
- 语速/语调/音量精细调节：在文本中某一段落单独设置语速、语调或音量。
- 多音字处理：对存在多种读音的汉字指定正确的读音。
- 音效设置：如回声、机器人、合唱等特殊音效。
- 英文数字 0 读法：控制读作 "O" 还是 "zero"。

Aisound5 通过在待合成文本中嵌入特定标记来实现上述功能，标记格式为 `[标记符*]`。例如：

- `[n1]1200`：将 "1200" 按号码方式朗读（读作"一二零零"）。
- `[n2]1200`：将 "1200" 按数值方式朗读（读作"一千二百"）。
- `[s8]这段文字会较快朗读`：设置语速为 8（较快）。
- `[m3]这段文字使用晓燕发音`：切换发音人为晓燕。

接口配置说明：使用 Aisound5 文本标注时，需确保文本编码格式与 TTS 引擎配置一致。通过 `liot_tts_set_config_param(LIOT_TTS_CONFIG_ENCODING, LIOT_TTS_UTF8)` 设置输入文本为 UTF-8 编码（默认），然后将包含标注标记的文本传入 `liot_tts_start()` 即可。

详细标注语法请参考本文档附录《Aisound5 简单文本标注用户手册》。

## 2 API 函数概览

| 函数 | 说明 |
| ---- | ---- |
| `liot_tts_engine_init` | 初始化 TTS 引擎 |
| `liot_tts_set_config_param` | 播放 TTS 前设置配置选项 |
| `liot_tts_get_config_param` | 获取 TTS 的配置选项 |
| `liot_tts_start` | 开始播放 TTS |
| `liot_tts_end` | TTS 播放完成时释放占用资源 |
| `liot_tts_exit` | 中断 TTS 播放并退出 TTS |
| `liot_tts_is_running` | 返回 TTS 运行状态 |
| `liot_tts_set_resource` | 设定 TTS 资源 |
| `liot_utf8_to_gbk_str` | 将 UTF-8 编码字符串转成 GBK 编码字符串 |

## 3 类型说明

### 3.1 liot_tts_errcode_e

TTS API 执行结果错误码。

1. 声明

```c
typedef enum
{
    LIOT_TTS_SUCCESS               = LIOT_SUCCESS,
    LIOT_TTS_UNKNOWN_ERROR         = 901 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_INVALID_PARAM         = 902 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_OPERATION_NOT_SUPPORT = 903 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_DEVICE_BUSY           = 904 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_INIT_ENGINE_ERR       = 2001 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_INIT_SOURCE_ERR       = 2002 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_START_ERR             = 2003 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_STOP_ERR              = 2004 | (LIOT_COMPONENT_AUDIO_TTS << 16),
    LIOT_TTS_EXIT_ERR              = 2005 | (LIOT_COMPONENT_AUDIO_TTS << 16)
} liot_tts_errcode_e;
```

2. 参数说明

| 参数 | 描述 |
| ---- | ---- |
| LIOT_TTS_SUCCESS | 函数执行成功 |
| LIOT_TTS_UNKNOWN_ERROR | 未知错误 |
| LIOT_TTS_INVALID_PARAM | 无效参数 |
| LIOT_TTS_OPERATION_NOT_SUPPORT | 不支持该操作 |
| LIOT_TTS_DEVICE_BUSY | TTS 正在播放 |
| LIOT_TTS_INIT_ENGINE_ERR | TTS 引擎初始化失败 |
| LIOT_TTS_INIT_SOURCE_ERR | TTS 数据库异常 |
| LIOT_TTS_START_ERR | TTS 开始播放失败 |
| LIOT_TTS_STOP_ERR | TTS 停止播放失败 |
| LIOT_TTS_EXIT_ERR | TTS 退出失败 |

### 3.2 liot_tts_config_e

TTS 配置类型枚举信息。

1. 声明

```c
typedef enum
{
    LIOT_TTS_CONFIG_SPEED = 1,
    LIOT_TTS_CONFIG_VOLUME,
    LIOT_TTS_CONFIG_ENCODING,
    LIOT_TTS_CONFIG_ROLE,
    LIOT_TTS_CONFIG_READ_DIGIT,
    LIOT_TTS_CONFIG_MAX
} liot_tts_config_e;
```

2. 参数说明

角色、数字朗读、多音字处理等可以通过语音标注方式，详细参考本文档附录《Aisound5 简单文本标注用户手册》。

| 参数 | 描述 |
| ---- | ---- |
| LIOT_TTS_CONFIG_SPEED | 设置播放 TTS 的速度 |
| LIOT_TTS_CONFIG_VOLUME | 设置播放 TTS 的音量 |
| LIOT_TTS_CONFIG_ENCODING | 设置输入的文本格式，详见 4.3 |
| LIOT_TTS_CONFIG_ROLE | 角色播放配置 |
| LIOT_TTS_CONFIG_READ_DIGIT | 数字朗读配置，如 1200 默认为金额方式"一千二百"，设置完按照数字 1200 进行播放 |
| LIOT_TTS_CONFIG_MAX | 非设置参数，仅用于限制输入参数范围，输入参数不得大于等于该值 |

### 3.3 liot_tts_encoding_e

TTS 输入编码格式枚举信息。

1. 声明

```c
typedef enum
{
    LIOT_TTS_GBK = 0,
    LIOT_TTS_UTF8,
    LIOT_TTS_UCS2
} liot_tts_encoding_e;
```

2. 参数说明

| 参数 | 描述 |
| ---- | ---- |
| LIOT_TTS_GBK | 输入为 GBK 编码格式 |
| LIOT_TTS_UTF8 | 输入为 UTF-8 编码格式 |
| LIOT_TTS_UCS2 | 输入为 UCS-2 编码格式 |

### 3.4 liot_pUserCallback

TTS 用户回调函数类型。

1. 声明

```c
typedef int (*liot_pUserCallback)(void *context, int msg, int ds, int param2, int dSize, const void *dBuffer);
```

2. 参数

- **context：** 用户回调参数。
- **msg：** 消息类型，目前固定为 0。
- **ds：** 输出数据代码。
- **param2：** TTS 配置选项，目前固定为 0。
- **dSize：** 输出数据大小。
- **dBuffer：** 输出数据数组。

3. 返回值

- 0 为正常运行。
- 任意非 0 值为停止转换。

可通过返回任意非 0 值来达成中断 TTS 转换的效果。（注意：返回非 0 值只能中断 TTS 转换，若要中断音频播放，还需调用音频相关函数。）

### 3.5 liot_read_res_cb

TTS 资源获取回调函数。

1. 声明

```c
typedef bool (*liot_read_res_cb)(void *pParameter, void *pBuffer, uint32_t iPos, uint32_t nSize);
```

2. 参数

- **pParameter：** TTS 资源库首地址。
- **pBuffer：** 相关资源存放地址。
- **iPos：** 所提取资源的地址偏移量。
- **nSize：** 所提取资源的大小。

3. 返回值

返回 true 表示读取成功，false 表示读取失败。

## 4 API 函数详解

### 4.1 liot_tts_engine_init

初始化 TTS 引擎。

1. 声明

```c
liot_tts_errcode_e liot_tts_engine_init(liot_pUserCallback mCallback);
```

2. 参数

- **mCallback：** [In] 回调函数。用于将解析得到的音频数据发送至应用层，在调用 `liot_tts_start()` 开始文本转换后就会进入此回调函数。

3. 返回值

`liot_tts_errcode_e`：执行结果码，请参考 4.1。

### 4.2 liot_tts_set_config_param

播放 TTS 前设置配置选项。

1. 声明

```c
liot_tts_errcode_e liot_tts_set_config_param(liot_tts_config_e type, int value);
```

2. 参数

- **type：** [In] TTS 的配置类型，详见 4.2。
- **value：** [In]
  - 对应播放速度：-32768 ~ 32767；
  - 播放音量大小：-32768 ~ 32767；
  - 解码格式：0-GBK，1-UTF-8，2-Unicode。

3. 返回值

`liot_tts_errcode_e`：执行结果码，请参考 4.1。

### 4.3 liot_tts_get_config_param

获取 TTS 的配置选项。

1. 声明

```c
int liot_tts_get_config_param(liot_tts_config_e type);
```

2. 参数

- **type：** [In] TTS 的配置类型，详见 4.2。

3. 返回值

获取成功返回配置参数值，获取失败返回执行结果码，请参考 4.1。

### 4.4 liot_tts_start

开始 TTS 转换函数。此函数实现是同步功能，调用此函数后，会进行 TTS 转换，转换期间会阻塞，直至全部输入数据转换完成。

1. 声明

```c
liot_tts_errcode_e liot_tts_start(const char *textString, unsigned int textLen);
```

2. 参数

- **textString：** [In] 输入 UTF-8、GBK 或者 UCS-2 格式的字符串，默认输入类型为 UTF-8。
- **textLen：** [In] 输入字符串的长度。

3. 返回值

`liot_tts_errcode_e`：执行结果码，请参考 4.1。

### 4.5 liot_tts_end

TTS 结束后需要退出 TTS，可调用此函数退出 TTS。下次 TTS 开始时可直接调用 `liot_tts_start`，无需再次初始化。需在 `liot_tts_exit` 函数之前调用。

1. 声明

```c
liot_tts_errcode_e liot_tts_end(void);
```

2. 参数

无。

3. 返回值

`liot_tts_errcode_e`：执行结果码，请参考 4.1。

### 4.6 liot_tts_exit

释放 TTS 占用资源，此函数用于退出后释放 TTS 资源。调用此函数后，若需再次进行 TTS 转换，需要调用 `liot_tts_engine_init` 函数进行初始化。需在 `liot_tts_end` 函数之后调用。

1. 声明

```c
liot_tts_errcode_e liot_tts_exit(void);
```

2. 参数

无。

3. 返回值

`liot_tts_errcode_e`：执行结果码，请参考 4.1。

### 4.7 liot_tts_is_running

返回 TTS 引擎是否在运行状态。

1. 声明

```c
int liot_tts_is_running(void);
```

2. 参数

无。

3. 返回值

- 1：正在运行。调用 `liot_tts_engine_init` 函数后 TTS 引擎就会一直运行。
- 0：未运行。调用 `liot_tts_exit` 函数后会停止 TTS 引擎运行。

### 4.8 liot_tts_set_resource

TTS 资源设定。

1. 声明

```c
void liot_tts_set_resource(void *pParameter, liot_read_res_cb rd_res_cb);
```

2. 参数

- **pParameter：** [In] TTS 资源库首地址。
- **rd_res_cb：** [In] 资源读取回调函数。

3. 返回值

无。

### 4.9 liot_utf8_to_gbk_str

将 UTF-8 编码字符串转成 GBK 编码字符串。

1. 声明

```c
void liot_utf8_to_gbk_str(void *utf8, int inputlen, int *outputlen, void *gbk);
```

2. 参数

- **utf8：** [In] 要转换的 UTF-8 字符串。
- **inputlen：** [In] 要转换的 UTF-8 字符串的长度。
- **outputlen：** [Out] 输出的 GBK 字符串的长度。
- **gbk：** [Out] 输出的 GBK 字符串。

3. 返回值

无。

## 5 音量测试数据

1. 测试环境：NT26KCNB20NNA 模组、TM8211、4 欧 3 瓦喇叭，播放 5 秒语音，取 5 秒内分贝变化平均值。
2. 每组数据测试三次，取平均值（手工测量及设备差异存在误差，请以实际使用为准。）
3. 音量值每增加 10000，声音强度增强 2 倍到 3 倍之间，设置值越靠近极限值，声音强度增强或衰弱倍数更大。

| 设置值 | 测量数据 |
| ---- | ---- |
| 30000 | 76 dB |
| 20000 | 72 dB |
| 10000 | 68 dB |
| 0 | 65 dB |
| -10000 | 61 dB |
| -20000 | 56 dB |
| -30000 | 48 dB |

## 6 16K 库使用说明

当前 SDK 中，使用 16K 采样率库的方法非常简单，只需修改资源类型配置即可，底层会自动完成库文件适配，无需手动替换库文件。

1. 打开 `LSDK/rules/Makefile.defs` 文件。
2. 将修改为需要的 16K 类型，例如使用 16K 中文：

```makefile
TTS_RESOURCE_TYPE ?= 16kzh     #可选值包括：8kzh（默认）、16kzh、8ken、16ken。
```

3. 保存后重新编译即可。编译系统会根据 `TTS_RESOURCE_TYPE` 自动选择对应的资源文件并打包到固件中。

**注意：** 使用 16K 采样率时，音频硬件配置（如 `Liot_SndHwConfig_t` 中的 `samples` 字段）需对应设置为 `L_SND_16K_SAMPLES`，以确保音频播放采样率与 TTS 输出采样率匹配。

## 7 快速上手指南

本节根据 `LSDK/examples/demo/src/demo_tts.c` 提供 TTS 功能的快速入门指导。

### 7.1 硬件准备

- EC71X 模组
- ES8311 音频编解码芯片
- I2C 接口（连接 ES8311）
- I2S 接口（音频数据输出）
- 功放 GPIO（控制扬声器电源）
- 4 欧 3 瓦喇叭

### 7.2 软件配置

1. 在 `LSDK/rules/Makefile.defs` 中使能 TTS：

```makefile
BUILD_COMP_TTS_EN ?= y
TTS_RESOURCE_TYPE ?= 8kzh
```

2. 在 `LSDK/examples/demo/config` 中使能 TTS Demo：

```makefile
EXDEMO_TTS_EN ?= y
```

3. 在 `LSDK/examples/Makefile` 中控制编译 Demo：

```makefile
PROJECT ?= demo
```

### 7.3 代码示例

以下是一个完整的 TTS 播放示例代码，基于 `demo_tts.c`：

```c
#include "liot_type.h"
#include "liot_sound.h"
#include "liot_log.h"
#include "liot_os.h"
#include "liot_gpio2.h"
#include "liot_tts.h"
#include <string.h>
#include "mem_map.h"
#include "liot_flash.h"

const char* playbuf = "利尔达公司欢迎您";

static int ttsUserCallback(void *context, int msg, int ds, int param2, int dSize, const void *dBuffer)
{
    Liot_SoundPlay((uint8_t *)dBuffer, dSize);
    return 0;
}

static bool user_read_res_cb(void *pParameter, void *pBuffer, uint32_t iPos, uint32_t nSize)
{
    liot_flash_read((uint8_t *)pBuffer, (uint32_t)((uint8_t *)pParameter + iPos), nSize);
    return true;
}

void liot_tts_demo_thread(void *argv)
{
    liot_rtos_task_sleep_ms(2000);

    Liot_AonPowerCtl(TRUE);
    Liot_SetVoltage(L_DOMAIN_ALL, L_VOLT_3_30V);

    Liot_SndHwConfig_t cfg = {
        .i2cNum = 1,
        .i2sNum = 0,
        .paGpioNum = 8,
        .codecType = L_SND_ES8311,
        .channel = L_SND_MONO_RIGHT,
        .role = L_SND_ROLE_SLAVE,
        .mode = L_SND_MODE_I2S,
        .frameSize = L_SND_FRAMESIZE_16_16,
        .samples = L_SND_08K_SAMPLES,
    };

    liot_trace("Liot_SoundInit");
    Liot_SoundInit(&cfg);
    Liot_SoundSetVolume(60);

    liot_tts_set_resource((void *)PKGFLXTTS_RES_ADDR, user_read_res_cb);
    liot_tts_engine_init(ttsUserCallback);

    while (1)
    {
        liot_tts_start(playbuf, strlen(playbuf));
        liot_rtos_task_sleep_ms(5000);
    }

    liot_tts_end();
    liot_tts_exit();
    Liot_SoundDeInit();
    liot_rtos_task_delete(0);
}
```

### 7.4 关键步骤说明

| 步骤 | 函数 | 说明 |
| ---- | ---- | ---- |
| 1 | Liot_SoundInit() | 初始化音频硬件（I2C、I2S、Codec） |
| 2 | liot_tts_set_resource() | 注册 TTS 资源地址和读取回调 |
| 3 | liot_tts_engine_init() | 初始化 TTS 引擎，注册音频输出回调 |
| 4 | liot_tts_start() | 启动 TTS 文本合成（同步阻塞） |
| 5 | liot_tts_end() | 结束当前 TTS 会话（可再次 start） |
| 6 | liot_tts_exit() | 完全释放 TTS 引擎资源 |

## 附录：Aisound5 简单文本标注用户手册

为了 TTS 合成效果更好，以及用户可自行控制合成效果，我们提供了一套标记设置。通过这些标记可完善 TTS 合成效果，用户也可以自行设置如何合成。例如：123 合成数值还是数字，通过文本标注 `[n*]`，用户即可设置朗读方式。

详细情况如下：

### 1. 设置文本范围为非受限集

- **格式**：`[ ]`
- **说明**：默认为没有特殊处理。

### 2. 保留

- **格式**：`[c*]`（`*` = 数值）
- **说明**：请勿在文本中包含这样的标记。

### 3. 恢复默认的合成参数

- **格式**：`[d]`
- **说明**：不能恢复语种和发音人，其他参数都可以恢复。

### 4. 设置音效模式

- **格式**：`[e*]`（`*` = 0/1/2/3/4/5/6/7）
- **参数**：
  - `0` – 关闭
  - `1` – 忽远忽近
  - `2` – 回声
  - `3` – 机器人
  - `4` – 合唱
  - `5` – 水下
  - `6` – 混响
  - `7` – 阴阳怪气
- **说明**：默认为关闭。

### 5. 设置发音风格

- **格式**：`[f*]`（`*` = 0/1/2）
- **参数**：
  - `0` – 一字一顿
  - `1` – 平铺直叙
  - `2` – 有声有色
- **说明**：默认为平铺直叙风格。

### 6. 选择语种

- **格式**：`[g*]`（`*` = 0/1/2/3）
- **参数**：
  - `0` – 自动判断
  - `1` – 汉语普通话
  - `2` – 英语语种
  - `3` – 法语
- **说明**：默认语种为自动判断。

### 7. 设置单词发音方式

- **格式**：`[h*]`（`*` = 0/1/2）
- **参数**：
  - `0` – 自动判断单词发音方式
  - `1` – 字母发音方式
  - `2` – 单词发音方式
- **说明**：默认单词为自动判断。

### 8. 设置输入文本对汉语拼音/英语音标的识别

- **格式**：`[i*]`（`*` = 0/1）
- **参数**：
  - `0` – 不识别汉语拼音/英语音标
  - `1` – 将"英文单词+1位数字"识别为汉语拼音，其他字母和音标形式识别为英语音标
- **说明**：
  - 默认为不识别汉语拼音/英语音标。
  - 声调用后接一位数字 `1~5` 分别表示阴平、阳平、上声、去声和轻声 5 个声调。
  - 有些拼音的标注方法和正常写法不一致，如下：
    - `ê` – `eh`
    - `m` – `fm`
    - `n` – `fn`
    - `ng` – `fng`
  - 英语音标采取当前代码页的音标字母编码。

### 9. 保留

- **格式**：`[j*]`（`*` = 数值）
- **说明**：请勿在文本中包含这样的标记。

### 10. 模式控制标记

- **格式**：`[k*]`（`*` = 0/1/2/3）
- **参数**：
  - `0` – 设置为普通模式
  - `1` – 设置为导航模式
  - `2` – 设置为手机模式
  - `3` – 设置为教育模式
- **说明**：
  - 默认设置为客户定制模式。
  - 如果客户购买的资源里面有"普通模式"的资源，那么 `[k0]` 就能设置成功。
  - 如果客户购买的资源里面有"导航模式"的资源，那么 `[k1]` 就能设置成功。
  - 如果客户购买的资源里面有"手机模式"的资源，那么 `[k2]` 就能设置成功。
  - 如果客户购买的资源里面有"教育模式"的资源，那么 `[k3]` 就能设置成功。
  - 如果给定的应用模式的资源不存在，那么使用 `[k*]` 设置该应用模式无效。

### 11. 选择发音人

- **格式**：`[m*]`（`*` = 1~25 / 51~56 / 99）
- **参数**：

| 编号 | 发音人 | 编号 | 发音人 | 编号 | 发音人 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 1 | 天畅 | 13 | Bush | 51 | 许久 |
| 2 | 文静 | 14 | 晓蓉 | 52 | 许多 |
| 3 | 晓燕 | 15 | 晓美 | 53 | 晓萍 |
| 4 | 小峰 | 16 | 安妮 | 54 | 唐老鸭 |
| 5 | Sherri | 17 | John | 55 | 许宝宝 |
| 6 | 晓晋 | 18 | Anita | 56 | 大龙 |
| 7 | 楠楠 | 19 | Terry | 99 | 用户自定义 |
| 8 | 晓婧 | 20 | Catherine | | |
| 9 | 嘉嘉 | 21 | TerryW | | |
| 10 | 玉儿 | 22 | 晓琳 | | |
| 11 | 晓倩 | 23 | 晓梦 | | |
| 12 | 老马 | 24 | 小强 | | |
| | | 25 | 小坤 | | |

- **说明**：默认的发音人根据配置确定。

### 12. 选择中文发音人

- **格式**：`[mc*]`（`*` = 1~25 / 51~56 / 99）
- **说明**：设置中文（包括中英文混读）发音人，默认的发音人根据配置确定。

### 13. 选择英文发音人

- **格式**：`[me*]`（`*` = 1~25 / 51~56 / 99）
- **说明**：设置英文发音人，默认的发音人根据配置确定。

### 14. 设置数字处理策略

- **格式**：`[n*]`（`*` = 0/1/2）
- **参数**：
  - `0` – 自动判断
  - `1` – 数字作号码处理
  - `2` – 数字作数值处理
- **说明**：默认为自动判断。

### 15. 英文数字 0 的朗读设置

- **格式**：`[o*]`（`*` = 0/1）
- **参数**：
  - `0` – 英文数字 0 读做"O"
  - `1` – 英文数字 0 读做"zero"
- **说明**：
  - 默认为英文数字 0 读做"zero"。
  - 注意：0 只有作为号码朗读时，标记才会生效，0 处理为数值时，一律读作 zero。

### 16. 静音一段时间

- **格式**：`[p*]`（`*` = 无符号整数）
- **参数**：`*` – 静音的时间长度，单位：毫秒（ms）

### 17. 设置姓名读音策略

- **格式**：`[r*]`（`*` = 0/1）
- **参数**：
  - `0` – 自动判断姓名读音
  - `1` – 强制使用姓名读音规则
- **说明**：默认为自动判断姓名读音。

### 18. 设置语速

- **格式**：`[s*]`（`*` = 0~10）
- **参数**：
  - `0` 对应到 `-32765`
  - `5` 对应到 `0`
  - `10` 对应到 `+32765`
- **说明**：默认语速值为 5，语速的调节范围为默认语速的一半到两倍，即 0 的值比默认语速慢一半，10 的值比默认语速快一倍。

### 19. 设置语调

- **格式**：`[t*]`（`*` = 0~10）
- **参数**：
  - `0` 对应到 `-32765`
  - `5` 对应到 `0`
  - `10` 对应到 `+32765`
- **说明**：默认语调值为 5，语调的调节范围为默认语调基频下 64Hz 到上 128Hz。

### 20. 设置音量

- **格式**：`[v*]`（`*` = 0~10）
- **参数**：
  - `0` 对应到 `-32765`
  - `5` 对应到 `0`
  - `10` 对应到 `+32765`
- **说明**：音量的调节范围为静音到音频设备支持的最大值，默认值 5 为中间音量。

### 21. 设置提示音处理策略

- **格式**：`[x*]`（`*` = 0/1）
- **参数**：
  - `0` – 不使用提示音
  - `1` – 自动使用提示音
- **说明**：默认为自动使用提示音。

### 22. 设置汉语号码中"1"的读法

- **格式**：`[y*]`（`*` = 0/1）
- **参数**：
  - `0` – 合成号码时"1"读成"yāo"
  - `1` – 合成号码时"1"读成"yī"
- **说明**：默认合成号码时"1"读成"yāo"。

### 23. 设置韵律标注处理策略

- **格式**：`[z*]`（`*` = 0/1）
- **参数**：
  - `0` – 不处理韵律标注
  - `1` – 处理韵律标注
- **说明**：默认不处理韵律标注。韵律标注使用 `*` 标出音步划分位置，使用 `#` 标出呼吸群划分位置。

### 24. 为单个汉字/单词强制指定拼音/音标

- **格式**：`[=*]`（`*` = 拼音/音标）
- **参数**：`*` – 为前一个汉字/单词设定的拼音/音标
- **说明**：
  - **汉字**：声调用后接一位数字 `1~5` 分别表示阴平、阳平、上声、去声和轻声 5 个声调。该标记只能放在非汉语拼音的汉语音节之后指定拼音，连续出现时以最后一个为准。
  - 有些拼音的标注方法和正常写法不一致，如下：
    - `ê` – `eh`
    - `m` – `fm`
    - `n` – `fn`
    - `ng` – `fng`
  - **单词**：音标格式为国际音标（IPA）。
  - **示例**：
    - `"着[=zhuo2]手"`，"着"字将读作"zhuó"
    - `hello[=hə'lo]`

> **PS**：文本标记符全部是半角，字母必须是小写的英文字母，不符合要求的不作为文本标记。设置文本标记时，标记的位置很重要，如 `"[n1]读作800"` 就比 `"读[n1]作800"` 的合成效果好，所以在使用时需注意，尽量放在朗读中有停顿的位置。

