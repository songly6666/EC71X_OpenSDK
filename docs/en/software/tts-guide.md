# TTS Development Guide_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| Version | Date | Author | Changes |
| ---- | ---- | ---- | ---- |
| 1.0 | 2023-09-11 | LHL, YHP | Initial document |
| 1.1 | 2024-03-25 | sxx | Renamed document |
| 1.2 | 2024-09-11 | LHL | Added callback return description for `liot_tts_engine_init`, volume test data, 16K library usage; updated several API descriptions and demo examples, added GBK/Unicode playback and PWM/codec playback options |
| 1.3 | 2024-11-07 | zw | Formatting changes, removed demo |
| 1.4 | 2025-04-01 | zlc | Added external flash testing and burning guidance |
| 1.5 | 2025-08-29 | zlc | Added Aisound5 annotation user manual reference |
| 1.6 | 2025-12-30 | zlc | Modified method to enable different TTS sample rates |
| 1.7 | 2026-04-28 | mbb | Updated for separated base package version and added quick start guide |

## 1 Introduction

This document describes the TTS (Text-to-Speech) API for the LTE-EC71X platform. API declarations are located in `components/kernel/lierda_api/liot_tts/liot_tts.h`.

### 1.1 Default Demo Configuration

- Output format: default demo outputs PCM at 8 kHz and supports Chinese.
- Supported SDK resources: multiple sample-rate and language combinations are supported:
  - 8k Chinese (`8k_zh`)
  - 16k Chinese (`16k_zh`)
  - 8k English (`8k_en`)
  - 16k English (`16k_en`)
- Text encoding support: the TTS engine accepts input in the following encodings and can be configured via `liot_tts_set_config_param` with `LIOT_TTS_CONFIG_ENCODING`:
  - UTF-8 (default)
  - GBK
  - UCS-2

### 1.2 Resource Files

- Resource format: TTS resources are `.bin` files placed under `components/tts/`.
- Example resource files and approximate sizes:

| File | Sample rate / Language | Approx. Size |
| ---- | ---- | ---- |
| ttsRes_8k_zh.bin | 8k Chinese | ~527 KB |
| ttsRes_16k_zh.bin | 16k Chinese | ~603 KB |
| ttsRes_8k_en.bin | 8k English | ~603 KB |
| ttsRes_16k_en.bin | 16k English | ~590 KB |

- Resource loading: resource files are packed into the module's Flash TTS region at build time. At runtime, set a resource read callback via `liot_tts_set_resource`; the engine will read resource data from Flash on demand. Resources do not need to be loaded entirely into RAM.

### 1.3 SDK Configuration

To enable TTS and select resource types, perform these steps:

Step 1 — Enable TTS component compilation:

Edit `rules/Makefile.defs` and set:

```makefile
BUILD_COMP_TTS_EN ?= y
```

Step 2 — Choose TTS resource type:

In the same file set `TTS_RESOURCE_TYPE` to the desired sample-rate/language:

```makefile
# TTS_RESOURCE_TYPE values
# 8kzh     : 8K Chinese
# 16kzh    : 16K Chinese
# 8ken     : 8K English
# 16ken    : 16K English
TTS_RESOURCE_TYPE ?= 8kzh
```

For 16 kHz Chinese, set `TTS_RESOURCE_TYPE ?= 16kzh`. The build system will pick the correct resource files automatically.

Step 3 — (Optional) Enable TTS demo:

In `examples/demo/config` set:

```makefile
EXDEMO_TTS_EN ?= y
```

After these changes, rebuild; the corresponding `.bin` will be packaged into firmware.

### 1.4 Aisound5 Annotation Usage

Aisound5 is an annotation system provided by IFlyTek for fine-grained TTS control. Use it to control:

- Numeric reading style (e.g., treat "1200" as a number or as individual digits)
- Speaker switching within a text
- Local speed / pitch / volume adjustments per segment
- Disambiguation for polyphonic characters
- Special audio effects (echo, robot, chorus, etc.)
- Whether the digit "0" reads as "O" or "zero"

Annotations are embedded in text using bracketed tags like `[tag*]`. Examples:

- `[n1]1200` — read "1200" as digits ("one two zero zero")
- `[n2]1200` — read "1200" as a number ("one thousand two hundred")
- `[s8]text` — set speed to 8 for the following text
- `[m3]text` — use speaker ID 3 for the following text

When using Aisound5, ensure the input encoding matches the TTS configuration (`liot_tts_set_config_param(LIOT_TTS_CONFIG_ENCODING, LIOT_TTS_UTF8)` for UTF-8) and pass the annotated text to `liot_tts_start()`. See the appendix "Aisound5 Simple Annotation User Manual" for full syntax.

## 2 API Function Overview

| Function | Description |
| ---- | ---- |
| `liot_tts_engine_init` | Initialize the TTS engine |
| `liot_tts_set_config_param` | Set TTS configuration parameters before playback |
| `liot_tts_get_config_param` | Get TTS configuration parameters |
| `liot_tts_start` | Start TTS synthesis |
| `liot_tts_end` | End a TTS session and release session resources |
| `liot_tts_exit` | Exit TTS and free engine resources |
| `liot_tts_is_running` | Query whether TTS is running |
| `liot_tts_set_resource` | Set TTS resource and read callback |
| `liot_utf8_to_gbk_str` | Convert UTF-8 string to GBK string |

## 3 Type Definitions

### 3.1 `liot_tts_errcode_e`

TTS API return/error codes.

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

Descriptions: `LIOT_TTS_SUCCESS` = success, others indicate errors such as invalid parameter, engine init failure, resource error, start/stop/exit failures, etc.

### 3.2 `liot_tts_config_e`

TTS configuration keys.

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

Use annotations to control role, digit reading, polyphone handling; refer to the Aisound5 appendix for details.

### 3.3 `liot_tts_encoding_e`

Input encoding enum:

```c
typedef enum
{
	LIOT_TTS_GBK = 0,
	LIOT_TTS_UTF8,
	LIOT_TTS_UCS2
} liot_tts_encoding_e;
```

### 3.4 `liot_pUserCallback`

User callback type used by the TTS engine to deliver decoded audio data to the application.

```c
typedef int (*liot_pUserCallback)(void *context, int msg, int ds, int param2, int dSize, const void *dBuffer);
```

Parameters:
- `context`: user context pointer
- `msg`: message type (currently fixed to 0)
- `ds`: output data code
- `param2`: TTS config option (currently 0)
- `dSize`: size of output data
- `dBuffer`: pointer to output data buffer

Return value:
- Return 0 to continue normally.
- Return non-zero to stop conversion.

Note: Returning non-zero interrupts the TTS conversion; to stop audio playback as well, call the audio-related stop functions.

### 3.5 `liot_read_res_cb`

Resource read callback type:

```c
typedef bool (*liot_read_res_cb)(void *pParameter, void *pBuffer, uint32_t iPos, uint32_t nSize);
```

Parameters:
- `pParameter`: resource base address
- `pBuffer`: destination buffer for read data
- `iPos`: offset within resource
- `nSize`: number of bytes to read

Return: `true` on success, `false` on failure.

## 4 API Details

### 4.1 `liot_tts_engine_init`

Initialize the TTS engine.

```c
liot_tts_errcode_e liot_tts_engine_init(liot_pUserCallback mCallback);
```

- `mCallback`: [In] callback to receive decoded audio data after `liot_tts_start()` is called.

Returns `liot_tts_errcode_e`.

### 4.2 `liot_tts_set_config_param`

Set configuration parameters before playback.

```c
liot_tts_errcode_e liot_tts_set_config_param(liot_tts_config_e type, int value);
```

- `type`: config key (`liot_tts_config_e`)
- `value`: depends on `type`:
  - speed: -32768 ~ 32767
  - volume: -32768 ~ 32767
  - encoding: 0=GBK, 1=UTF-8, 2=Unicode

Returns `liot_tts_errcode_e`.

### 4.3 `liot_tts_get_config_param`

Get a TTS configuration value:

```c
int liot_tts_get_config_param(liot_tts_config_e type);
```

Returns the parameter value on success, or an error code on failure.

### 4.4 `liot_tts_start`

Start TTS conversion. This is a synchronous function; it blocks until all input data has been converted.

```c
liot_tts_errcode_e liot_tts_start(const char *textString, unsigned int textLen);
```

- `textString`: input string in UTF-8 / GBK / UCS-2 (default UTF-8)
- `textLen`: length of the input string

Returns `liot_tts_errcode_e`.

### 4.5 `liot_tts_end`

Call to end the current TTS session. After `liot_tts_end()` you can call `liot_tts_start()` again without re-initializing. Call this before `liot_tts_exit()`.

```c
liot_tts_errcode_e liot_tts_end(void);
```

### 4.6 `liot_tts_exit`

Exit and free TTS resources. To use TTS again after this, call `liot_tts_engine_init()`.

```c
liot_tts_errcode_e liot_tts_exit(void);
```

### 4.7 `liot_tts_is_running`

Query whether the TTS engine is running:

```c
int liot_tts_is_running(void);
```

- Returns `1` if running (engine remains running after `liot_tts_engine_init`).
- Returns `0` if not running (after `liot_tts_exit`).

### 4.8 `liot_tts_set_resource`

Set the resource base pointer and read callback:

```c
void liot_tts_set_resource(void *pParameter, liot_read_res_cb rd_res_cb);
```

- `pParameter`: resource base address
- `rd_res_cb`: resource read callback

### 4.9 `liot_utf8_to_gbk_str`

Convert a UTF-8 string to GBK:

```c
void liot_utf8_to_gbk_str(void *utf8, int inputlen, int *outputlen, void *gbk);
```

## 5 Volume Test Data

Test environment: NT26KCNB20NNA module, TM8211, 4Ω 3W speaker; 5-second playback, average dB over 5 seconds.

Each value is the average of three tests (manual measurement and device variance may cause differences).

Volume grows roughly 2x–3x when the setting increases by 10000; closer to extremes the change factor may be larger.

| Setting | Measured Level |
| ---- | ---- |
| 30000 | 76 dB |
| 20000 | 72 dB |
| 10000 | 68 dB |
| 0 | 65 dB |
| -10000 | 61 dB |
| -20000 | 56 dB |
| -30000 | 48 dB |

## 6 16k Library Usage

To use 16k sample-rate resources, simply change the resource type in `rules/Makefile.defs`:

```makefile
TTS_RESOURCE_TYPE ?= 16kzh  # options: 8kzh (default), 16kzh, 8ken, 16ken
```

Rebuild; the build system will package the corresponding resource automatically.

Note: When using 16k resources, ensure audio hardware configuration (e.g., `Liot_SndHwConfig_t.samples`) matches (`L_SND_16K_SAMPLES`).

## 7 Quick Start

This quick start is based on `examples/demo/src/demo_tts.c`.

### 7.1 Hardware Required

- EC71X module
- ES8311 audio codec
- I2C for codec control
- I2S for audio data output
- PA GPIO to control speaker power
- 4Ω 3W speaker

### 7.2 Software Configuration

1. Enable TTS in `rules/Makefile.defs`:

```makefile
BUILD_COMP_TTS_EN ?= y
TTS_RESOURCE_TYPE ?= 8kzh
```

2. Enable TTS demo in `examples/demo/config`:

```makefile
EXDEMO_TTS_EN ?= y
```

3. Ensure the demo project is selected in `examples/Makefile`:

```makefile
PROJECT ?= demo
```

### 7.3 Example Code

Example adapted from `demo_tts.c`:

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

### 7.4 Key Steps Summary

| Step | Function | Description |
| ---- | ---- | ---- |
| 1 | `Liot_SoundInit()` | Initialize audio hardware (I2C, I2S, codec) |
| 2 | `liot_tts_set_resource()` | Register TTS resource base and read callback |
| 3 | `liot_tts_engine_init()` | Initialize TTS engine and register audio callback |
| 4 | `liot_tts_start()` | Start TTS synthesis (synchronous) |
| 5 | `liot_tts_end()` | End current TTS session (can `start()` again) |
| 6 | `liot_tts_exit()` | Release TTS engine resources |

## Appendix: Aisound5 Simple Annotation User Manual

To improve synthesis quality and allow user control, use the annotation tags described below. Tags are half-width ASCII characters and must be lowercase letters where applicable. Place tags at natural pause points for best effect.

1. Unrestricted text range: `[ ]` — default no special handling.
2. Reserved: `[c*]` — do not include such tags in text.
3. Restore default synthesis parameters: `[d]` — does not restore language or speaker.
4. Audio effect: `[e*]` (`*` = 0..7) — 0:disable,1:distance,2:echo,3:robot,4:chorus,5:underwater,6:reverb,7:weird.
5. Speaking style: `[f*]` (`*`=0..2) — 0:staccato,1:neutral,2:expressive.
6. Language selection: `[g*]` (`*`=0..3) — 0:auto,1:Mandarin,2:English,3:French.
7. Word pronunciation mode: `[h*]` (`*`=0..2) — 0:auto,1:letter-pronounce,2:word-pronounce.
8. Pinyin/phoneme recognition: `[i*]` (`*`=0/1) — 1 enables mixed pinyin/phoneme recognition; see docs for mapping rules.
9. Reserved: `[j*]` — do not include.
10. Mode control: `[k*]` (`*`=0..3) — 0:normal,1:navigation,2:phone,3:education (resource-dependent).
11. Select speaker: `[m*]` (`*` = 1..25,51..56,99) — table of speaker IDs available in original doc.
12. Select Chinese speaker: `[mc*]` — sets Chinese speaker.
13. Select English speaker: `[me*]` — sets English speaker.
14. Digit handling: `[n*]` (`*`=0..2) — 0:auto,1:phone-style,2:value-style.
15. English zero: `[o*]` (`*`=0/1) — 0:"O",1:"zero" (only effective when reading as phone numbers).
16. Insert silence: `[p*]` (`*`=milliseconds) — silence duration in ms.
17. Name pronunciation policy: `[r*]` (`*`=0/1) — 0:auto,1:force name rules.
18. Speed: `[s*]` (`*`=0..10) — maps 0→-32765,5→0,10→+32765.
19. Pitch: `[t*]` (`*`=0..10) — maps 0→-32765,5→0,10→+32765.
20. Volume: `[v*]` (`*`=0..10) — maps 0→-32765,5→0,10→+32765.
21. Prompt tone policy: `[x*]` (`*`=0/1) — 0:disable,1:auto.
22. Chinese digit "1" reading: `[y*]` (`*`=0/1) — 0:"yāo",1:"yī" (default is "yāo" for phone-style reading).
23. Prosody annotation: `[z*]` (`*`=0/1) — 1 to process prosody markers (`*` for foot boundary, `#` for breath group).
24. Force pinyin or phoneme for a single character/word: `[=*]` — puts pinyin/phoneme for the previous character/word; examples: `着[=zhuo2]` or `hello[=hə'lo]`.

PS: Tags must be half-width ASCII and lowercase letters. Tag placement affects results — prefer putting tags at natural pause locations.

