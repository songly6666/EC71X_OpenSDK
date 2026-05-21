# Audio Development Guide_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## 1 Revision History

| Version | Date | Author | Reviewer | Revision Content |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-01-29 | sxx | zlc | Document created |

## 2 Introduction

This document describes the LTE-EC71X Sound interface APIs, which are declared in the `liot_sound.h` file.

The Sound interface is a wrapper for Codec device audio interfaces that integrate I2S data transmission. Currently adapted hardware drivers include ES8311, TM8211, ES8374, and ES8375.

### 2.1 Sound Audio Control Logic

Upon receiving audio initialization, the system first matches the Codec type and performs Codec hardware initialization. For example, ES8311 first configures related registers via I2C, then initializes the I2S bus, and creates an audio playback queue. Audio playback is asynchronous — after calling `Liot_SoundPlay()`, a backup is created in the audio playback queue for playback. Theoretically, the queue length has no upper limit and is determined by the system's memory allocation limit.

MP3 and PCM playback first decodes the data source and then places it into the audio playback queue.

### 2.2 I2S Playback Principle

I2S (Inter-IC Sound) is a serial digital communication bus dedicated to audio, specifically designed for transmitting digital audio data between chips.

- MCLK: Master clock (system audio clock, commonly 256x sample rate)
- BCLK (SCK): Bit clock, transfers 1 bit per transition
- LRCK (WS): Channel clock. Low level = left channel; High level = right channel
- SDIN/SDOUT: Audio data serial line

Working logic:

1. Based on the sample rate (e.g., 44.1K, 48KHz), WS switches channels the corresponding number of times per second;
2. Within each WS cycle, BCLK shifts out 16/24/32-bit audio sample data bit by bit;
3. The transmitter sends data serially according to the clock, the receiver samples and parses synchronously, separates left and right channels, and restores digital audio;
4. Only pure audio data streams are transmitted; commands and configuration use separate I2C/SPI control.

## 3 API Function Overview

| Function | Description |
| ---- | ---- |
| `Liot_SoundInit` | Audio initialization interface |
| `Liot_SoundDeInit` | Audio deinitialization interface |
| `Liot_SoundSetVolume` | Set volume level |
| `Liot_SoundGetVolume` | Get volume level |
| `Liot_SoundSetMicVolume` | Set microphone volume |
| `Liot_SoundPlay` | Play audio |
| `Liot_SoundRecord` | Record audio |
| `Liot_SoundPlayPause` | Pause playback |
| `Liot_SoundPlayResume` | Resume playback |
| `Liot_SoundPlayMp3File` | Play MP3 file |

## 4 Type Descriptions

### 4.1 Liot_SndErr_e

1. Enum definition:

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

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_ERR_SUCCESS | Operation successful |
| L_SND_ERR_EXECUTE | General execution error |
| L_SND_ERR_INVALID_PARAM | Invalid input parameter |
| L_SND_ERR_OPEN | Failed to open |
| L_SND_ERR_CONFIG | Configuration interface failed |
| L_SND_ERR_PULL_SET | Pull-up setting failed |
| L_SND_ERR_NOMEM | Out of memory |
| L_SND_ERR_FILE | File operation failed |

### 4.2 Liot_SndDevice_e

1. Enum definition:

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

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_DEV_NONE | No audio device |
| L_SND_TM8211 | TM8211 |
| L_SND_ES8311 | ES8311 |
| L_SND_ES8374 | ES8374 |
| L_SND_ES8375 | ES8375 |
| L_SND_DEV_MAX | Maximum audio device enum value |

### 4.3 Liot_SndSample_e

Sample rate.

1. Enum definition:

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

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_08K_SAMPLES | 8KHz sample rate |
| L_SND_16K_SAMPLES | 16KHz sample rate |
| L_SND_22K_SAMPLES | 22.05KHz sample rate |
| L_SND_24K_SAMPLES | 24KHz sample rate |
| L_SND_32K_SAMPLES | 32KHz sample rate |
| L_SND_44K_SAMPLES | 44.1KHz sample rate |
| L_SND_48K_SAMPLES | 48KHz sample rate |
| L_SND_96K_SAMPLES | 96KHz sample rate |

### 4.4 Liot_SndFrameSize_e

Data frame format.

1. Enum definition:

```c
typedef enum
{
    L_SND_FRAMESIZE_16_16 = 0,  /*!< WordSize 16bit, SlotSize 16bit */
    L_SND_FRAMESIZE_16_32 = 1,  /*!< WordSize 16bit, SlotSize 32bit */
    L_SND_FRAMESIZE_24_32 = 2,  /*!< WordSize 24bit, SlotSize 32bit */
    L_SND_FRAMESIZE_32_32 = 3,  /*!< WordSize 32bit, SlotSize 32bit */
} Liot_SndFrameSize_e;
```

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_FRAMESIZE_16_16 | 16_16 frame format, word size 16, 16bit per frame |
| L_SND_FRAMESIZE_16_32 | 16_32 frame format, slot size 32, 16bit per frame |
| L_SND_FRAMESIZE_24_32 | 24_32 frame format, slot size 32, 24bit per frame |
| L_SND_FRAMESIZE_32_32 | 32_32 frame format, slot size 32, 32bit per frame |

### 4.5 Liot_SndMode_e

Audio data format.

1. Enum definition:

```c
typedef enum
{
    L_SND_MODE_MSB,  /*!< Left aligned mode */
    L_SND_MODE_LSB,  /*!< Right aligned mode */
    L_SND_MODE_I2S,  /*!< I2S mode */
    L_SND_MODE_PCM,  /*!< PCM mode */
} Liot_SndMode_e;
```

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_MODE_MSB | Audio data left-aligned |
| L_SND_MODE_LSB | Audio data right-aligned |
| L_SND_MODE_I2S | I2S data stream format |
| L_SND_MODE_PCM | PCM data stream format |

### 4.6 Liot_SndRole_e

Codec master/slave mode.

1. Enum definition:

```c
typedef enum
{
    L_SND_ROLE_MASTER,  /*!< I2S is master */
    L_SND_ROLE_SLAVE,   /*!< I2S is slave */
} Liot_SndRole_e;
```

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_ROLE_MASTER | Codec operates as master |
| L_SND_ROLE_SLAVE | Codec operates as slave |

### 4.7 Liot_SndChannel_e

Audio channel.

1. Enum definition:

```c
typedef enum
{
    L_SND_DUAL = 1,      /*!< Dual channel (stereo) */
    L_SND_MONO_LEFT,     /*!< Mono - left channel only */
    L_SND_MONO_RIGHT,    /*!< Mono - right channel only */
} Liot_SndChannel_e;
```

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_DUAL | Dual channel (stereo) audio |
| L_SND_MONO_LEFT | Mono left channel |
| L_SND_MONO_RIGHT | Mono right channel |

### 4.8 Liot_SndState_e

Audio state.

1. Enum definition:

```c
typedef enum
{
    L_SND_STA_DEINIT,   /*!< Driver deinitialized */
    L_SND_STA_IDLE,     /*!< Driver idle */
    L_SND_STA_PLAYING,  /*!< Audio playing */
    L_SND_STA_PAUSE,    /*!< Audio paused */
} Liot_SndState_e;
```

2. Enum description

| Variable | Description |
| ---- | ---- |
| L_SND_STA_DEINIT | Audio uninitialized state |
| L_SND_STA_IDLE | Audio idle state |
| L_SND_STA_PLAYING | Audio playing state |
| L_SND_STA_PAUSE | Audio paused state |

### 4.9 Liot_SndHwConfig_t

Hardware configuration structure.

1. Structure definition:

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

2. Structure member description

| Variable | Description |
| ---- | ---- |
| i2cNum | I2C bus number used for audio communication |
| i2sNum | I2S bus number used for audio communication |
| paGpioNum | GPIO number of the PA control pin used for audio |
| codecType | Audio Codec type |
| channel | Audio channel |
| role | Codec role |
| mode | Data stream format |
| frameSize | Data frame format |
| samples | Sample rate |

## 5 API Function Details

### 5.1 Liot_SoundInit

Audio initialization.

1. Declaration

```c
Liot_SndErr_e Liot_SoundInit(Liot_SndHwConfig_t *config);
```

2. Parameters

- **config:** [In] Audio format configuration.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.2 Liot_SoundDeInit

Audio deinitialization.

1. Declaration

```c
Liot_SndErr_e Liot_SoundDeInit(void);
```

2. Parameters

None.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.3 Liot_SoundSetVolume

Set volume level.

1. Declaration

```c
Liot_SndErr_e Liot_SoundSetVolume(int Volume);
```

2. Parameters

- **Volume:** [In] Volume value.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.4 Liot_SoundGetVolume

Get current volume.

1. Declaration

```c
Liot_SndErr_e Liot_SoundGetVolume(int *Volume);
```

2. Parameters

- **Volume:** [Out] Volume value.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.5 Liot_SoundSetMicVolume

Set microphone volume.

1. Declaration

```c
Liot_SndErr_e Liot_SoundSetMicVolume(uint8_t micGain, int micVolume);
```

2. Parameters

- **micGain:** [In] Microphone gain.
- **micVolume:** [In] Microphone volume value.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.6 Liot_SoundPlay

Play audio.

1. Declaration

```c
Liot_SndErr_e Liot_SoundPlay(uint8_t* data, int datalen);
```

2. Parameters

- **data:** [In] Audio data to play.
- **datalen:** [In] Data length.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.7 Liot_SoundRecord

Record audio.

1. Declaration

```c
Liot_SndErr_e Liot_SoundRecord(uint8_t* data, int datalen);
```

2. Parameters

- **data:** [In] Recording data buffer.
- **datalen:** [In] Data length.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.8 Liot_SoundPlayPause

Pause playback.

1. Declaration

```c
Liot_SndErr_e Liot_SoundPlayPause(void);
```

2. Parameters

None.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.9 Liot_SoundPlayResume

Resume playback.

1. Declaration

```c
Liot_SndErr_e Liot_SoundPlayResume(void);
```

2. Parameters

None.

3. Return value

Error code, see `Liot_SndErr_e`.

### 5.10 Liot_SoundPlayMp3File

Play MP3 file.

1. Declaration

```c
Liot_SndErr_e Liot_SoundPlayMp3File(char* fileName);
```

2. Parameters

- **fileName:** [In] File name.

3. Return value

Error code, see `Liot_SndErr_e`.

## 6 Code Example

Refer to the example code in `LSDK\examples\demo\src\demo_sound.c`.

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
    //audio source data
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
