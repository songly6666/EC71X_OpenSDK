# SOUND 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 1 修订记录

| 版本 | 日期 | 作者 | 审核 | 修订内容 |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | 创建文档 |

## 2 简介

本文档介绍 LTE-EC71X Sound 接口 API 情况，API 接口位于 `liot_sound.h` 文件声明。

Sound 接口是集成 I2S 数据传输类的 Codec 设备音频接口的封装。目前适配了 ES8311、TM8211、ES8374、ES8375 硬件驱动。

### 2.1 Sound 音频控制逻辑

在接收到音频初始化时首先会匹配 Codec 类型并进行 Codec 硬件初始化，如 ES8311 先通过 I2C 配置相关寄存器，然后初始化 I2S 总线，再创建音频播放队列。音频播放属于异步播放，在调用 `Liot_SoundPlay()` 后会创建备份到音频播放队列中进行播放，理论上队列长度无上限，由系统申请内存上限决定。

MP3 和 PCM 播放则先对数据源进行解码然后放到音频播放队列中。

### 2.2 I2S 播放原理介绍

I2S（Inter-IC Sound）是音频专用的串行数字通信总线，专门用来在芯片之间传输数字音频数据。

- MCLK：主时钟（系统音频时钟，常用 256× 采样率）
- BCLK (SCK)：位时钟，每跳变一次传输 1bit
- LRCK (WS)：声道时钟。低电平 = 左声道；高电平 = 右声道
- SDIN/SDOUT：音频数据串行线

工作逻辑:

1. 以采样率（如 44.1K、48KHz）为基础，WS 每秒切换对应次数声道；
2. 在每个 WS 周期内，BCLK 逐位移位输出 16/24/32 位的音频采样数据；
3. 发送端按时钟串行发数据，接收端同步采样解析，分离左右声道，还原数字音频；
4. 只传纯音频数据流，命令、配置用另外的 I2C/SPI 控制。

## 3 API 函数概览

| 函数 | 说明 |
| ---- | ---- |
| `Liot_SoundInit` | 音频初始化接口 |
| `Liot_SoundDeInit` | 音频去初始化接口 |
| `Liot_SoundSetVolume` | 设置音量大小 |
| `Liot_SoundGetVolume` | 获取音量大小 |
| `Liot_SoundSetMicVolume` | 设置麦克风音量 |
| `Liot_SoundPlay` | 播放音频 |
| `Liot_SoundRecord` | 录制音频 |
| `Liot_SoundPlayPause` | 播放暂停 |
| `Liot_SoundPlayResume` | 播放恢复 |
| `Liot_SoundPlayMp3File` | 播放 MP3 文件 |

## 4 类型说明

### 4.1 Liot_SndErr_e

1. 枚举定义：

```c
typedef enum {
    L_SND_ERR_SUCCESS  = 0,     /*!< Operation was successful */
    L_SND_ERR_EXECUTE,          /*!< General execution error */
    L_SND_ERR_INVALID_PARAM,    /*!< Invalid input parameter */
    L_SND_ERR_OPEN,             /*!< Failed to open device */
    L_SND_ERR_CONFIG,           /*!< Configuration failed */
    L_SND_ERR_PULL_SET,         /*!< Pull resistor setup failed */
    L_SND_ERR_CALLBACK,         /*!< Callback registration failed */
    L_SND_ERR_LEVEL_TRIGGER,    /*!< Level trigger configuration failed */
    L_SND_ERR_NOMEM,            /*!< Out of memory */
    L_SND_ERR_FILE,             /*!< File operation error */
} Liot_SndErr_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_ERR_SUCCESS | 执行成功 |
| L_SND_ERR_EXECUTE | 通用异常错误 |
| L_SND_ERR_INVALID_PARAM | 输入参数无效 |
| L_SND_ERR_OPEN | 打开失败 |
| L_SND_ERR_CONFIG | 配置接口失败 |
| L_SND_ERR_PULL_SET | 设置上拉失败 |
| L_SND_ERR_NOMEM | 内存不足 |
| L_SND_ERR_FILE | 文件操作失败 |

### 4.2 Liot_SndDevice_e

1. 枚举定义：

```c
typedef enum {
    L_SND_DEV_NONE,     /*!< No sound device */
    L_SND_TM8211,       /*!< TM8211 audio codec */
    L_SND_ES8311,       /*!< ES8311 audio codec */
    L_SND_ES8374,       /*!< ES8374 audio codec */
    L_SND_ES8375,       /*!< ES8375 audio codec */
    L_SND_DEV_MAX,      /*!< Maximum number of supported devices */
} Liot_SndDevice_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_DEV_NONE | 无音频设备 |
| L_SND_TM8211 | TM8211 |
| L_SND_ES8311 | ES8311 |
| L_SND_ES8374 | ES8374 |
| L_SND_ES8375 | ES8375 |
| L_SND_DEV_MAX | 音频设备枚举最大值 |

### 4.3 Liot_SndSample_e

采样率。

1. 枚举定义：

```c
typedef enum
{
    L_SND_08K_SAMPLES,  /*!< 8 kHz sample rate */
    L_SND_16K_SAMPLES,  /*!< 16 kHz sample rate */
    L_SND_22K_SAMPLES,  /*!< 22.05 kHz sample rate */
    L_SND_24K_SAMPLES,  /*!< 24 kHz sample rate */
    L_SND_32K_SAMPLES,  /*!< 32 kHz sample rate */
    L_SND_44K_SAMPLES,  /*!< 44.1 kHz sample rate */
    L_SND_48K_SAMPLES,  /*!< 48 kHz sample rate */
    L_SND_96K_SAMPLES,  /*!< 96 kHz sample rate */
} Liot_SndSample_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_08K_SAMPLES | 8KHz 采样率 |
| L_SND_16K_SAMPLES | 16KHz 采样率 |
| L_SND_22K_SAMPLES | 22.05KHz 采样率 |
| L_SND_24K_SAMPLES | 24KHz 采样率 |
| L_SND_32K_SAMPLES | 32KHz 采样率 |
| L_SND_44K_SAMPLES | 44.1KHz 采样率 |
| L_SND_48K_SAMPLES | 48KHz 采样率 |
| L_SND_96K_SAMPLES | 96KHz 采样率 |

### 4.4 Liot_SndFrameSize_e

数据帧格式。

1. 枚举定义：

```c
typedef enum
{
    L_SND_FRAMESIZE_16_16 = 0,  /*!< WordSize 16bit, SlotSize 16bit */
    L_SND_FRAMESIZE_16_32 = 1,  /*!< WordSize 16bit, SlotSize 32bit */
    L_SND_FRAMESIZE_24_32 = 2,  /*!< WordSize 24bit, SlotSize 32bit */
    L_SND_FRAMESIZE_32_32 = 3,  /*!< WordSize 32bit, SlotSize 32bit */
} Liot_SndFrameSize_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_FRAMESIZE_16_16 | 16_16 帧格式，位宽 16，每帧 16bit |
| L_SND_FRAMESIZE_16_32 | 16_32 帧格式，位宽 32，每帧 16bit |
| L_SND_FRAMESIZE_24_32 | 24_32 帧格式，位宽 32，每帧 24bit |
| L_SND_FRAMESIZE_32_32 | 32_32 帧格式，位宽 32，每帧 32bit |

### 4.5 Liot_SndMode_e

音频数据格式。

1. 枚举定义：

```c
typedef enum
{
    L_SND_MODE_MSB,  /*!< Left aligned mode */
    L_SND_MODE_LSB,  /*!< Right aligned mode */
    L_SND_MODE_I2S,  /*!< I2S mode */
    L_SND_MODE_PCM,  /*!< PCM mode */
} Liot_SndMode_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_MODE_MSB | 音频数据左对齐 |
| L_SND_MODE_LSB | 音频数据右对齐 |
| L_SND_MODE_I2S | I2S 数据流格式 |
| L_SND_MODE_PCM | PCM 数据流格式 |

### 4.6 Liot_SndRole_e

Codec 主从模式。

1. 枚举定义：

```c
typedef enum
{
    L_SND_ROLE_MASTER,  /*!< I2S is master */
    L_SND_ROLE_SLAVE,   /*!< I2S is slave */
} Liot_SndRole_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_ROLE_MASTER | Codec 作为主机模式 |
| L_SND_ROLE_SLAVE | Codec 作为从机模式 |

### 4.7 Liot_SndChannel_e

音频声道。

1. 枚举定义：

```c
typedef enum
{
    L_SND_DUAL = 1,      /*!< Dual channel (stereo) */
    L_SND_MONO_LEFT,     /*!< Mono - left channel only */
    L_SND_MONO_RIGHT,    /*!< Mono - right channel only */
} Liot_SndChannel_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_DUAL | 双声道音频 |
| L_SND_MONO_LEFT | 单声道左 |
| L_SND_MONO_RIGHT | 单声道右 |

### 4.8 Liot_SndState_e

音频状态。

1. 枚举定义：

```c
typedef enum
{
    L_SND_STA_DEINIT,   /*!< Driver deinitialized */
    L_SND_STA_IDLE,     /*!< Driver idle */
    L_SND_STA_PLAYING,  /*!< Audio playing */
    L_SND_STA_PAUSE,    /*!< Audio paused */
} Liot_SndState_e;
```

2. 枚举说明

| 变量 | 说明 |
| ---- | ---- |
| L_SND_STA_DEINIT | 音频未初始化状态 |
| L_SND_STA_IDLE | 音频空闲状态 |
| L_SND_STA_PLAYING | 音频播放中状态 |
| L_SND_STA_PAUSE | 音频暂停状态 |

### 4.9 Liot_SndHwConfig_t

硬件配置结构体。

1. 结构体定义：

```c
typedef struct
{
    int8_t i2cNum;               /*!< I2C bus number */
    int8_t i2sNum;               /*!< I2S interface number */
    int8_t paGpioNum;            /*!< Power Amplifier GPIO number */
    Liot_SndDevice_e codecType;  /*!< Audio codec type */
    Liot_SndChannel_e channel;   /*!< Audio channel configuration */
    Liot_SndRole_e role;         /*!< I2S master/slave role */
    Liot_SndMode_e mode;         /*!< I2S interface mode */
    Liot_SndFrameSize_e frameSize; /*!< Audio frame size configuration */
    Liot_SndSample_e samples;    /*!< Audio sample rate */
} Liot_SndHwConfig_t;
```

2. 结构体变量说明

| 变量 | 说明 |
| ---- | ---- |
| i2cNum | 音频通信使用 I2C 号 |
| i2sNum | 音频通信使用 I2S 号 |
| paGpioNum | 音频通信使用 PA 控制引脚的 GPIO 号 |
| codecType | 音频 Codec 类型 |
| channel | 音频声道通道 |
| role | Codec 角色 |
| mode | 数据流格式 |
| frameSize | 数据帧格式 |
| samples | 采样率 |

## 5 API 函数详解

### 5.1 Liot_SoundInit

音频初始化。

1. 声明

```c
Liot_SndErr_e Liot_SoundInit(Liot_SndHwConfig_t *config);
```

2. 参数

- **config：** [In] 音频格式配置。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.2 Liot_SoundDeInit

音频去初始化。

1. 声明

```c
Liot_SndErr_e Liot_SoundDeInit(void);
```

2. 参数

无。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.3 Liot_SoundSetVolume

设置音量大小。

1. 声明

```c
Liot_SndErr_e Liot_SoundSetVolume(int Volume);
```

2. 参数

- **Volume：** [In] 音量值。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.4 Liot_SoundGetVolume

获取当前音量。

1. 声明

```c
Liot_SndErr_e Liot_SoundGetVolume(int *Volume);
```

2. 参数

- **Volume：** [Out] 音量值。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.5 Liot_SoundSetMicVolume

设置麦克风音量值。

1. 声明

```c
Liot_SndErr_e Liot_SoundSetMicVolume(uint8_t micGain, int micVolume);
```

2. 参数

- **micGain：** [In] 麦克风增益。
- **micVolume：** [In] 麦克风音量值。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.6 Liot_SoundPlay

播放音频。

1. 声明

```c
Liot_SndErr_e Liot_SoundPlay(uint8_t* data, int datalen);
```

2. 参数

- **data：** [In] 播放的数据。
- **datalen：** [In] 数据长度。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.7 Liot_SoundRecord

录音。

1. 声明

```c
Liot_SndErr_e Liot_SoundRecord(uint8_t* data, int datalen);
```

2. 参数

- **data：** [In] 录音的数据。
- **datalen：** [In] 数据长度。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.8 Liot_SoundPlayPause

播放暂停。

1. 声明

```c
Liot_SndErr_e Liot_SoundPlayPause(void);
```

2. 参数

无。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.9 Liot_SoundPlayResume

暂停恢复。

1. 声明

```c
Liot_SndErr_e Liot_SoundPlayResume(void);
```

2. 参数

无。

3. 返回值

错误码，见 `Liot_SndErr_e`。

### 5.10 Liot_SoundPlayMp3File

播放 MP3 文件。

1. 声明

```c
Liot_SndErr_e Liot_SoundPlayMp3File(char* fileName);
```

2. 参数

- **fileName：** [In] 文件名称。

3. 返回值

错误码，见 `Liot_SndErr_e`。

## 6 代码示例

示例代码参考 `LSDK\examples\demo\src\demo_sound.c` 文件。

```c
#include "liot_type.h"
#include "liot_sound.h"
#include "liot_log.h"
#include "liot_os.h"
#include "liot_gpio2.h"

#define TEST_PLAY
//#define TEST_RECORD

#ifdef TEST_PLAY
__attribute__((aligned(16))) uint8_t audio16k_16[] = {
    //音频源码
}
#endif

#ifdef TEST_RECORD
#define TEST_CACHE_LEN (1280)
__attribute__((aligned(16))) uint8_t audioRecord[TEST_CACHE_LEN] = {0};
#endif

void liot_sound_demo_thread(void *argv)
{
    liot_rtos_task_sleep_ms(2000);

    Liot_AonPowerCtl(TRUE);
    Liot_SetVoltage(L_DOMAIN_ALL, L_VOLT_3_30V );

    Liot_SndHwConfig_t cfg ={
        .i2cNum = 1,
        .i2sNum = 0,
        .paGpioNum = 0,
        .codecType = L_SND_ES8311,
        .channel = L_SND_MONO_RIGHT,
        .role = L_SND_ROLE_SLAVE,
        .mode = L_SND_MODE_I2S,
        .frameSize = L_SND_FRAMESIZE_16_16,
        .samples = L_SND_16K_SAMPLES,
    };

    liot_trace("Liot_SoundInit");
    Liot_SoundInit(&cfg);

    liot_trace("Liot_SoundSetVolume");
    Liot_SoundSetVolume(50);
    Liot_SoundSetMicVolume(8, 200);

    while(1)
    {
        #ifdef TEST_PLAY
        liot_trace("Liot_SoundPlay ...");
        Liot_SoundPlay(audio16k_16, sizeof(audio16k_16));
        liot_rtos_task_sleep_ms(5000);
        #endif

        #ifdef TEST_RECORD
        liot_trace("Liot_SoundRecord ...");
        Liot_SoundRecord(audioRecord, TEST_CACHE_LEN);
        Liot_SoundPlay(audioRecord, TEST_CACHE_LEN);
        liot_rtos_task_sleep_ms(1);
        #endif
    }
    Liot_SoundDeInit();
    liot_rtos_task_delete(0);
}
```

