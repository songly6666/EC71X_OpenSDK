# LCD 开发指导_Rev1.0

{link_to_translation}`en:[English]`

# LCD开发指导

## 1 修订记录

| **版本** | **日期** | **作者** | 审核 | **修订内容** |
| --- | --- | --- | --- | --- |
| 1.0 | 2023-12-7 | Chenhz | zlc | 创建文档 |
| 1.1 | 2024-03-25 | sxx |  | 更改文档名称 |
| 1.2 | 2024-03-28 | Chenhz |  | 文档新增SPI接口参数介绍、新增refresh API描述、API描述更新、预置LCD更新 |
| 1.3 | 2024-11-15 | zw |  | 更改文档格式，删除demo |
| 1.4 | 2026-04-29 | zxq |  | 根据底包分离最新代码修改 |

## 2 简介

本文档介绍 LTE-EC71X LCD 接口 API 情况， API 接口位于 LSDK/components/kernel/lierda\_api/liot\_lcd/liot\_lcd.h 文件声明。

LTE-EC71X 系列模组支持LCD进行显示。

### 2.1 LCD接口介绍

LTE-EC71X系列模组支持通过多种接口（当前开放LSPI接口、SPI接口）驱动LCD进行显示，其中包括为LCD驱动专门优化的LSPI接口，其最大速度可支持到51Mhz，并且支持3-line-spi与2-data-lane模式，可以满足多种LCD开发需求。

LSPI接口由USP1和USP2复用，详情参考:

请至钉钉文档查看附件《Lierda NT26-FCN OpenCPU 引脚复用表.xlsx》。

在设置USP1为Camera，设置USP2为LSPI时，可以实现摄像头在LCD屏的加速预览。

### 2.2 LCD显示定义

LCD可以进行旋转显示等，为了更好地进行开发，OpenCPU LCD API对LCD的方向坐标作出如下定义：

在LCD默认状态下，LCD横向像素数量定义为width，纵向像素数量定义为height。该值在LCD驱动中需要进行设置，详见

在LCD当前显示的方向下，LCD横向定义为X轴，纵向定义为Y轴，原点为于屏幕左上角（因屏而异）

竖屏模式：

<div align="center">

<img src="_images/LCD开发指导/image_1.png" width="600"/>

</div>

横屏模式：

<div align="center">

<img src="_images/LCD开发指导/image_2.png" width="600"/>

</div>

## 3 API 函数概览

| **函数** | **说明** |
| --- | --- |
| liot\_lcd\_init() | LCD初始化 |
| liot\_lcd\_clear\_screen() | LCD全屏刷新 |
| liot\_lcd\_draw\_point() | LCD画点 |
| liot\_lcd\_draw\_line() | LCD画线 |
| liot\_lcd\_draw\_rectangle() | LCD画矩形 |
| liot\_lcd\_draw\_circle() | LCD画圆 |
| liot\_lcd\_write() | LCD显示图片 |
| liot\_lcd\_set\_brightness() | LCD设置亮度 |
| liot\_lcd\_display\_on() | LCD开启显示 |
| liot\_lcd\_display\_off() | LCD关闭显示 |
| liot\_lcd\_sleep\_in() | LCD进入休眠 |
| liot\_lcd\_sleep\_out() | LCD退出休眠 |

## 4 类型说明

### 4.1 liot\_lcd\_errcode\_e

LCD API 执行结果错误码。

* 声明

```c
typedef enum {    
    LIOT_LCD_OK = 0,    
    LIOT_LCD_ERROR,    
    LIOT_LCD_NO_MEM,    
    LIOT_LCD_INVALID_PARAM,    
    LIOT_LCD_INVALID_HANDLE,    
    LIOT_LCD_INVALID_INTERFACE,
    LIOT_LCD_LOCATION_OVERFLOW,
}liot_lcd_errcode_e;
```

* 参数
* LIOT\_LCD\_OK ：执行成功
* LIOT\_LCD\_ERROR：未知错误
* LIOT\_LCD\_NO\_MEM：内存不足
* LIOT\_LCD\_INVALID\_PARAM：无效参数
* LIOT\_LCD\_INVALID\_HANDLE：无效句柄
* LIOT\_LCD\_INVALID\_INTERFACE：无效接口
* LIOT\_LCD\_LOCATION\_OVERFLOW：位置越界

## 5 API 函数详解

### 5.1 liot\_lcd\_init

该函数用于初始化LCD屏幕。

1. 声明

```c
liot_lcd_handle_t liot_lcd_init(liot_lcd_config_t *config);
```

2. 参数

config：\[in\] LCD配置参数；

3. 返回值

liot\_lcd\_handle\_t LCD句柄

#### 5.1.1 liot\_lcd\_config\_t

1. LCD配置参数结构体定义

```c
typedef liot_hal_lcd_config_t liot_lcd_config_t;

typedef struct{       
    liot_hal_lcd_interface_t interface;    
    liot_hal_lcdDev_t *lcdDev;
}liot_hal_lcd_config_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_hal\_lcd\_interface\_t | interface | LCD接口配置 |
| liot\_hal\_lcdDev\_t | lcdDev | LCD驱动，所使用的LCD驱动接口由此设置 |

#### 5.1.2 liot\_lcd\_interface\_t

1. LCD接口配置结构体定义

```c
typedef struct{    
    liot_hal_lcd_interface_type_e type;             
    union           
    {        
        liot_hal_lcd_interface_lspi_t lspi;             
        liot_hal_lcd_interface_spi_t spi;               
        liot_hal_lcd_interface_i2c_t i2c;               
        liot_hal_lcd_interface_8080_t l8080;            
        liot_hal_lcd_interface_8080_t l6800;       
    };  
    liot_hal_lcd_blk_t blk;                        
    int8_t rst_pin;                          
}liot_hal_lcd_interface_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_hal\_lcd\_interface\_type\_e | interface | LCD接口类型 |
| liot\_hal\_lcd\_interface\_lspi\_t | lspi | LSPI配置项 |
| liot\_hal\_lcd\_interface\_spi\_t | spi | SPI配置项，支持，暂不完善 |
| liot\_hal\_lcd\_interface\_i2c\_t | i2c | I2C配置项，暂不支持 |
| liot\_hal\_lcd\_interface\_8080\_t | l8080 | 8080配置项，暂不支持 |
| liot\_hal\_lcd\_interface\_6800\_t | l6800 | 6800配置项，暂不支持 |
| liot\_hal\_lcd\_blk\_t | blk | 背光BLK配置项 |
| int8\_t | rst\_pin | LCD复位引脚 |

#### 5.1.3 liot\_lcd\_interface\_lspi\_t

1. LCD接口配置结构体定义

```c
typedef struct{    
    liot_lspi_port_e num;               
    bool lcd_3_line_spi;                   
    bool lcd_2_data_lane;               
    liot_hal_lspi_busspeed_e speed;
    bool sync;                 
    liot_lspi_cs_e cs; 
    liot_hal_lcd_event_cb cb;      
}liot_hal_lcd_interface_lspi_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_lspi\_port\_e | num | lspi编号 |
| bool | lcd\_3\_line\_spi | lspi是否启用3线模式，该影响DCX引脚是否使用 |
| bool | lcd\_2\_data\_lane | lspi是否启用2-data-lane，启用该项需启用DCX引脚 |
| liot\_hal\_lspi\_busspeed\_e | speed | lspi总线速度 |
| bool | sync | 是否开启异步模式 |
| liot\_lspi\_cs\_e | cs | lspi cs引脚，718M特定引脚支持 |
| liot\_hal\_lcd\_event\_cb | cb | lspi事件回调，LSPI完成一次传输会触发一次 |

#### 5.1.4 liot\_lcd\_interface\_spi\_t

1. LCD接口配置结构体定义

```c
typedef struct{    
    liot_spi_port_e num;    
    liot_spi_cpol_pol_e cpol;    
    liot_spi_cpha_pol_e cpha;    
    int8_t lcd_dc;    
    int8_t cs;    
    liot_spi_clk_e speed;    
    bool dma_en;                      
    liot_hal_lcd_event_cb cb;    
}liot_hal_lcd_interface_spi_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_spi\_port\_e | num | SPI编号 |
| liot\_spi\_cpol\_pol\_e | cpol | SPI极性 |
| liot\_spi\_cpha\_pol\_e | cpha | SPI相位 |
| int8\_t | lcd\_dc | LCD命令/数据引脚 |
| cs | cs | SPI片选引脚 |
| liot\_spi\_clk\_e | speed | SPI总线速度 |
| bool | dma\_en | SPI的dma是否启用，不完善 |
| liot\_hal\_lcd\_event\_cb | cb | SPI事件回调，SPI配合dma完成一次传输会触发一次 |

#### 5.1.5 liot\_lcd\_blk\_t

1. LCD BLK背光配置结构体定义

```c
typedef struct{    
    liot_hal_lcd_blk_type_e type;       
    int8_t pin;                         
    liot_pwm_sel_e pwm_num;         
}liot_hal_lcd_blk_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_hal\_lcd\_blk\_type\_e | type | 背光BLK类型 |
| int8\_t | pin | 背光BLK引脚 |
| liot\_pwm\_sel\_e | pwm\_num | 若背光类型设置为PWM，则指定PWM通道 |

#### 5.1.6 liot\_lcdDev\_t

1. LCD 驱动配置结构体，具体使用详见LCD驱动新增指导

```c
typedef struct{    
    liot_hal_lcdDev_func_t func;        
    liot_hal_lcdDev_info_t info;    
}liot_hal_lcdDev_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_hal\_lcdDev\_func\_t | func | LCD驱动函数 |
| liot\_hal\_lcdDev\_info\_t | info | LCD驱动配置信息 |

### 5.2 liot\_lcd\_clear\_screen

该函数用于LCD全屏刷新

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的full接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_clear_screen(liot_lcd_handle_t handle, 
                      uint16_t color);
```

2. 参数

handle：\[in\] LCD句柄；

color：\[in\] 颜色；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.3 liot\_lcd\_draw\_point

该函数用于LCD画点

1. 声明

```c
liot_lcd_errcode_e liot_lcd_draw_point(liot_lcd_handle_t handle,         
                      uint32_t x,                                       
                      uint32_t y,                                       
                      uint16_t color);
```

2. 参数

handle：\[in\] LCD句柄；

x: \[in\] X轴坐标；

y: \[in\] Y轴坐标；

color：\[in\] 颜色；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.4 liot\_lcd\_draw\_line

该函数用于LCD画线

1. 声明

```c
liot_lcd_errcode_e liot_lcd_draw_line(liot_lcd_handle_t handle,          
                      uint16_t sx,                                       
                      uint16_t sy,                                       
                      uint16_t ex,                                      
                      uint16_t ey,                                      
                      uint16_t color);
```

2. 参数

handle：\[in\] LCD句柄；

sx：\[in\] X轴起始坐标；

sy：\[in\] Y轴起始坐标；

ex：\[in\] X轴终止坐标；

ey：\[in\] Y轴终止坐标；

color：\[in\]颜色；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.5 liot\_lcd\_draw\_rectangle

该函数用于LCD画矩形

1. 声明

```c
liot_lcd_errcode_e liot_lcd_draw_rectangle(liot_lcd_handle_t handle,    
                      uint16_t sx,                                  
                      uint16_t sy,                                      
                      uint16_t ex,                                      
                      uint16_t ey,                                       
                      uint16_t color);
```

2. 参数

handle：\[in\] LCD句柄；

sx：\[in\] X轴起始坐标；

sy：\[in\] Y轴起始坐标；

ex：\[in\] X轴终止坐标；

ey：\[in\] Y轴终止坐标；

color：\[in\]颜色；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.6 liot\_lcd\_draw\_circle

该函数用于LCD显示图片

1. 声明

```c
liot_lcd_errcode_e liot_lcd_draw_circle(liot_lcd_handle_t handle,        
                      uint16_t sx,
                      uint16_t sy,
                      uint16_t r,
                      uint16_t color);
```

2. 参数

handle：\[in\] LCD句柄；

sx：\[in\] 圆心X轴坐标；

sy：\[in\] 圆心Y轴坐标；

r：\[in\] 半径；

color：\[in\]颜色；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.7 liot\_lcd\_write

该函数用于LCD显示图片

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的fill接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_write(liot_lcd_handle_t handle,             
                      uint16_t sx,
                      uint16_t sy,
                      uint16_t ex,
                      uint16_t ey,
                      uint8_t *buf);
```

2. 参数

handle：\[in\] LCD句柄；

sx：\[in\] X轴起始坐标；

sy：\[in\] Y轴起始坐标；

ex：\[in\] X轴终止坐标；

ey：\[in\] Y轴终止坐标；

buf：\[in\]图像数据存放地址；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.8 liot\_lcd\_set\_brightness

该函数用于LCD设置亮度

当LCD配置背光类型为 LIOT\_LCD\_BACKLIGHT\_PWM 时，背光亮度等级可设置0-100

当LCD配置背光类型为 LIOT\_LCD\_BACKLIGHT\_GPIO 时，背光亮度仅可设置0-1即关或开，超过1的数均视为1

当LCD配置背光类型为 LIOT\_LCD\_NO\_BACKLIGHT 时，该配置项无效

1. 声明

```c
liot_lcd_errcode_e liot_lcd_set_brightness(liot_lcd_handle_t handle, 
                      uint8_t level);
```

2. 参数

handle：\[in\] LCD句柄；

level：\[in\] 亮度等级 0-100

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.9 liot\_lcd\_display\_on

该函数用于LCD开启显示

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的display\_on接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_display_on(liot_lcd_handle_t handle);
```

2. 参数

handle：\[in\] LCD句柄；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.10 liot\_lcd\_display\_off

该函数用于LCD关闭显示

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的display\_on接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_display_off(liot_lcd_handle_t handle);
```

2. 参数

handle：\[in\] LCD句柄；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.11 liot\_lcd\_sleep\_in

该函数用于LCD进入休眠

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的sleep\_in接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_sleep_in(liot_lcd_handle_t handle);
```

2. 参数

handle：\[in\] LCD句柄；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.12 liot\_lcd\_sleep\_out

该函数用于LCD退出休眠

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的sleep\_in接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_sleep_out(liot_lcd_handle_t handle);
```

2. 参数

handle：\[in\] LCD句柄；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

### 5.13 liot\_lcd\_refresh

该函数用于LCD刷新显示，非必要接口，适用于需要手动刷新的LCD屏幕，例如创建了buffer的SSD1306

该接口最终导向**liot\_hal\_lcdDev\_func\_t**中的refresh接口

1. 声明

```c
liot_lcd_errcode_e liot_lcd_refresh(liot_lcd_handle_t handle);
```

2. 参数

handle：\[in\] LCD句柄；

3. 返回值

liot\_lcd\_errcode\_e：错误码，详见4.1

## 六、LCD驱动新增指导

为了更好地满足用户对于LCD开发，LTE-EC71X系列模组OpenCPU SDK内已预置部分常用LCD的驱动。为了满足用户对于自定义LCD屏幕的开发需求，LTE-EC71X系列模组OpenCPU SDK支持添加自定义的LCD驱动。

### 6.1 预置的LCD驱动

LTE-EC71X系列模组OpenCPU SDK预置LCD驱动路径为LSDK/components/driver/lcd/src/，当前已预置的LCD驱动如表所示，其中各项均为开发测试数据，请以实际开发为准：

| LCD驱动芯片 | LCD接口支持 | 颜色格式 | 分辨率 |
| --- | --- | --- | --- |
| ST7789 | LSPI/SPI | RGB565 | 320\*240 |
| GC9A01 | LSPI/SPI | RGB565 | 240\*240 |
| ST7735 | LSPI/SPI | RGB565 | 160\*128 |
| SSD1306 | SPI | 单色 | 128\*64 |
| GC9D01 | LSPI/SPI | RGB565 | 160\*160 |
| ST7567 | LSPI/SPI | 单色 | 128\*64 |

### 6.2 新增LCD驱动

#### 6.2.1 新增LCD驱动源码文件

用户需要创建LCD驱动源码文件，可以存放在预置LCD驱动路径，也可以存放在用户工程文件夹中，无论哪种方式，都需要在对应文件夹的Makefile文件中进行声明，以确保LCD驱动源码文件能被顺利编译。

以预置LCD驱动路径LSDK/components/driver/lcd/src/为例，用户将对应的Custom\_lcd.c放在该目录下后，需要在管理该目录的Makefile文件LSDK/components/driver/lcd/Makefile中添加该文件的编译目标文件Custom\_lcd.o

```makefile
C++LCDDRV_DIR := $(DRIVER_DIR)/lcd
LCDDRV_SRC := $(LCDDRV_DIR)/src

CFLAGS_INC    += -I $(TOP)/$(LCDDRV_DIR)/inc

LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_GC9A01.o
LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_GC9D01.o
LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_SSD1306.o
LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_ST7567.o
LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_ST7735.o
LCDDRV_COBJS += $(LCDDRV_SRC)/liot_lcdDev_ST7789.o
LCDDRV_COBJS += $(LCDDRV_SRC)/Custom_lcd.o
LCDDRV_COBJS := $(addprefix $(BUILDDIR)/, $(LCDDRV_COBJS))

ifeq ($(TOOLCHAIN),GCC)
libusr-y += lib_lcddrv.a

$(BUILDDIR)/lib/libusr/lib_lcddrv.a: $(LCDDRV_COBJS)
    @mkdir -p $(dir $@)
    $(ECHO) AR $@
    $(Q)$(AR) -cr $@ $^
endif
```

#### 6.2.2 建立LCD驱动结构体

LCD驱动配置通过liot\_hal\_lcdDev\_t结构体来管理其各项接口与参数

##### 6.2.2.1 liot\_hal\_lcdDev\_t

1. LCD 驱动配置结构体

该结构体分为两个部分，分别是LCD驱动函数与LCD驱动信息。其中LCD驱动函数定义了配置控制LCD的函数，LCD驱动信息记录了该LCD的分辨率、显示方向等信息。

```c
typedef struct{    
    liot_hal_lcdDev_func_t func;        
    liot_hal_lcdDev_info_t info;    
}liot_hal_lcdDev_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| liot\_hal\_lcdDev\_func\_t | func | LCD驱动函数 |
| liot\_hal\_lcdDev\_info\_t | info | LCD驱动配置信息 |

##### 6.2.2.2 liot\_hal\_lcdDev\_info\_t

1. LCD 驱动信息结构体

LCD在程序运行后显示的分辨率、方向、颜色等，均由该结构体中对应的值来控制

```c
typedef struct{    
    uint16_t id;                                    
    uint32_t interface;                             
    uint32_t width;                                 
    uint32_t height;                                
    liot_hal_lcdDev_dir_e direction;                
    liot_hal_lcdDev_color_depth_e color_depth;    
}liot_hal_lcdDev_info_t;
```

2. 参数

| 类型 | 参数 | 描述 |
| --- | --- | --- |
| uint16\_t | id | LCD驱动id |
| uint32\_t | interface | LCD所支持的接口，通过位或来记录支持的LCD接口 |
| uint32\_t | width | LCD在初始默认状态下横向像素数 |
| uint32\_t | height | LCD在初始默认状态下纵向像素数 |
| liot\_hal\_lcdDev\_dir\_e | direction | LCD显示逆时针旋转的方向 |
| liot\_hal\_lcdDev\_color\_depth\_e | color\_depth | LCD色深 |

##### 6.2.2.3 liot\_hal\_lcdDev\_func\_t

1. LCD 驱动函数结构体

为保证自定义LCD能够正常使用，用户需要在该结构体内定义必要的函数。其中各类I2C接口的LCD屏幕的命令/数据的传输方式不尽相同，所以预留出接口来提供用户自定义。

```c
typedef struct{    
int (*init)(liot_hal_lcd_handle_t handle);

int (*addrSet)(liot_hal_lcd_handle_t handle,uint16_t sx, uint16_t sy, 
        uint16_t ex, uint16_t ey);

int (*fill)(liot_hal_lcd_handle_t handle, uint16_t sx, uint16_t sy, 
        uint16_t ex, uint16_t ey, void* buf);

int (*full)(liot_hal_lcd_handle_t handle, uint16_t sx, uint16_t sy, 
        uint16_t ex, uint16_t ey, uint16_t color); 

int (*strWrite)(liot_hal_lcd_handle_t handle, uint16_t sx, uint16_t sy, 
        uint16_t ex, uint16_t ey, char* str);

int (*display_on)(liot_hal_lcd_handle_t handle, bool on);

int (*sleep_in)(liot_hal_lcd_handle_t handle, bool in);

int (*refresh)(liot_hal_lcd_handle_t handle);

// 以下为I2C类LCD用户自定义接口，若不为NULL，将取代程序内原有接口执行    
int (*custom_i2c_cmd_send)(liot_hal_lcd_handle_t handle, uint8_t *cmd, 
        uint32_t len);

int (*custom_i2c_data_send)(liot_hal_lcd_handle_t handle, 
        uint8_t *data, uint32_t len);

}liot_hal_lcdDev_func_t;
```

2. 参数

| 类型 | 必要性 | 描述 |
| --- | --- | --- |
| int (\*init) | 必要 | LCD驱动初始化函数，用于初始化配置LCD寄存器 |
| int (\*addrSet) | 必要 | LCD设置显示坐标 |
| int (\*fill) | 必要 | LCD指定区域显示图片 |
| int (\*full) | 必要 | LCD指定区域显示一种颜色 |
| int (\*strWrite) | 非必要 | LCD指定区域显示文字，该接口适用于自带字库的LCD屏幕 |
| int (\*display\_on) | 非必要 | LCD开启/关闭显示 |
| int (\*sleep\_in) | 非必要 | LCD进入/离开休眠 |
| int (\*refresh) | 非必要 | LCD刷新显示，该接口适用于带buffer的屏幕，例如SSD1306 |
| int (\*custom\_i2c\_cmd\_send) | 非必要 | I2C类LCD用户自定义命令发送接口 |
| int (\*custom\_i2c\_data\_send) | 非必要 | I2C类LCD用户自定义数据发送接口 |

##### 6.2.2.4 新增LCD驱动结构体信息补全

以预置的ST7789驱动为例，根据实际所使用的LCD屏幕补全驱动信息与驱动函数

```c
liot_hal_lcdDev_t liot_st7789_dev = {    
    .func = {        
        .init = liot_st7789_init,        
        .addrSet = liot_st7789_addrset,        
        .fill = liot_st7789_fill,        
        .full = liot_st7789_full,        
        .strWrite = NULL,        
        .display_on = liot_st7789_display_on,        
        .sleep_in = liot_st7789_sleep_in,        
        .refresh = NULL,    
    },    
    .info = {        
          .id = 0x7789,        
          .interface = LIOT_LCD_INTERFACE_LSPI | 
                        LIOT_LCD_INTERFACE_SPI | 
                        LIOT_LCD_INTERFACE_8080,        
          .width = 240,        
          .height = 320,        
          .direction = LIOT_LCD_DIR_90_ANGLE,        
          .color_depth = LIOT_LCD_COLOR_RGB565,    
    },
};
```

#### 6.2.3 LCD驱动函数编写

在 liot\_hal\_lcdDev\_func\_t 中定义LCD驱动所需要的函数，此处定义的函数将在用户执行liot\_lcd\_init、liot\_lcd\_write等函数时进行引用。

以预置的ST7789驱动为例，其init函数如下，其中 liot\_hal\_lcd\_write\_cmd、liot\_hal\_lcd\_transmit\_cmd为HAL LCD API，在LSDK/components/driver/lcd/inc/liot\_lcdDev.h中定义。

```c
static int liot_st7789_init(liot_hal_lcd_handle_t handle)
{
    
    liot_hal_lcd_write_cmd(handle, 0x11, 0x00);

    switch(liot_st7789_dev.info.direction)
    {
        case LIOT_LCD_DIR_0_ANGLE: 
          liot_hal_lcd_write_cmd(handle, 0x36, 0x00); break;
        case LIOT_LCD_DIR_90_ANGLE: 
          liot_hal_lcd_write_cmd(handle, 0x36, 0x70); break;
        case LIOT_LCD_DIR_180_ANGLE: 
          liot_hal_lcd_write_cmd(handle, 0x36, 0xA0); break;
        case LIOT_LCD_DIR_270_ANGLE: 
          liot_hal_lcd_write_cmd(handle, 0x36, 0xC0); break;
        default: liot_hal_lcd_write_cmd(handle, 0x36, 0x00); break;
    }

    if(((liot_hal_lcd_config_t*)handle)->interface.type == LIOT_LCD_INTERFACE_LSPI && 
        ((liot_hal_lcd_config_t*)handle)->interface.lspi.lcd_2_data_lane == true)
    {
        liot_hal_lcd_write_cmd(handle, 0xE7, 0x10);
    }

    // liot_hal_lcd_write_cmd(handle, 0x20, 0x00);
    liot_hal_lcd_write_cmd(handle, 0x21, 0x00);

    liot_hal_lcd_write_cmd(handle, 0x3A, 0x05);

    uint8_t set_rate_cmd[] = {0x0c,0x0c,0x00,0x33,0x33};
    liot_hal_lcd_transmit_cmd(handle, 0xB2, set_rate_cmd, sizeof(set_rate_cmd));

    liot_hal_lcd_write_cmd(handle, 0xB7, 0x35);
    liot_hal_lcd_write_cmd(handle, 0xBB, 0x20);
    liot_hal_lcd_write_cmd(handle, 0xC0, 0x2C);
    liot_hal_lcd_write_cmd(handle, 0xC2, 0x01);
    liot_hal_lcd_write_cmd(handle, 0xC3, 0x0B);
    liot_hal_lcd_write_cmd(handle, 0xC4, 0x20);
    liot_hal_lcd_write_cmd(handle, 0xC6, 0x0F);

    uint8_t reg_PWCTRL1[] = {0xa4,0xa1};
    liot_hal_lcd_transmit_cmd(handle, 0xD0, reg_PWCTRL1, sizeof(reg_PWCTRL1));

    uint8_t reg_PVGAMCTRL[] = {0xd0,0x03,0x09,0x0e,0x11,0x3d,0x47,0x55,
                                0x53,0x1a,0x16,0x14,0x1f,0x22};  //Positive voltage gamma
    liot_hal_lcd_transmit_cmd(handle, 0xE0, reg_PVGAMCTRL, sizeof(reg_PVGAMCTRL));

    uint8_t reg_NVGAMCTRL[] = {0xd0,0x02,0x08,0x0d,0x12,0x2c,0x43,0x55,
                                0x53,0x1e,0x1b,0x19,0x20,0x22};  //Negative voltage gamma
    liot_hal_lcd_transmit_cmd(handle, 0xE1, reg_NVGAMCTRL, sizeof(reg_NVGAMCTRL));

    liot_hal_lcd_write_cmd(handle, 0x29, 0x00);

    return 0;
}
```

#### 6.2.4 声明LCD驱动结构体并引用

在LCD驱动结构体创建完毕并填充对应的信息后，需要在用户工程中声明该结构体

```c
LIOT_ADD_DISPLAY(liot_st7789_dev);
```

使用liot\_lcd\_init初始化时在多定义的liot\_lcd\_config\_t的lcdDev成员设置为所声明的LCD驱动结构体

```c
liot_lcd_config_t cfg = {    
    .interface = {        
        .type = LIOT_LCD_INTERFACE_LSPI,        
        .lspi.num = LIOT_LSPI_PORT2,        
        .lspi.lcd_3_line_spi = false,        
        .lspi.lcd_2_data_lane = false,        
        .lspi.speed = LIOT_LSPI_51MHZ,        
        .lspi.cb = lcd_event_callback,        
        .blk.type = LIOT_LCD_BACKLIGHT_PWM,        
        .blk.pin = 102,        
        .blk.pwm_num = LIOT_PWM_3,        
        .rst_pin = 49,    
    },    
    .lcdDev = liot_st7789_dev,
};

liot_lcd_handle_t lcd = liot_lcd_init(&cfg);
```

至此，新增LCD驱动已创建完毕，可以使用LCD API在LCD屏幕上进行显示

## 七、Demo示例

### 7.1 demo源码

```c
/**
 * @File Name: liot_lcd_demo.c
 * @brief   LCD显示demo, 演示liot_lcd框架的完整使用流程
 * @Author : Chenhz 
 * @Email : ciot_iot_support@lierda.com
 * @Version : 1.0
 * @Creat Date : 2023-11-29
 * 
 * @copyright Copyright (c) 2023 Lierda Science & Technology Group Co., Ltd.
 * 
 * 使用流程:
 *   1. 用LIOT_ADD_DISPLAY宏声明LCD驱动
 *   2. 构造liot_lcd_config_t配置 (接口类型/引脚/背光/复位等)
 *   3. liot_lcd_init初始化LCD
 *   4. 调用绘图API (clear_screen/draw_line/draw_circle/write等)
 *   5. liot_lcd_refresh刷新到屏幕
 */
#include <stdio.h>
#include <string.h>
#include "cmsis_os2.h"
#include "stdlib.h"
#include "lierda_app_main.h"
#include "liot_os.h"
#include "liot_gpio.h"
#include "slpman.h"
#include "fastmath.h"

#include "liot_lcd.h"

/* Lierda Logo图片数据, 格式: RGB565, 尺寸: 100x60像素
 * 由图像取模工具生成, 每2字节表示1个像素(R5-G6-B5)
 * 总大小 = 100 * 60 * 2 = 12000 字节
 */
// 100*60
const uint8_t Lierda_logo[12000] = { /* 0X10,0X10,0X00,0X64,0X00,0X3C,0X01,0X39, */
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X11,0XF6,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X11,0XF6,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X8E,0XED,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF3,0XFE,0X20,0XFD,0X20,0XFD,0X20,0XFD,
0X20,0XFD,0X57,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X3A,0XFF,0XA9,0XE4,0XA9,0XE4,0XA9,0XE4,0XA9,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X8F,0XFE,0X20,0XFD,0X20,0XFD,0X20,0XFD,0X20,0XFD,0XDD,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XD0,0XED,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X24,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X6E,0XFE,0X20,0XFD,0X20,0XFD,0X20,0XFD,
0X20,0XFD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XE8,0XFD,0X20,0XFD,0X20,0XFD,0X20,0XFD,0X42,0XFD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X4C,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X79,0XFF,0X57,0XFF,0X57,0XFF,0X57,0XFF,
0X79,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XD0,0XED,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X7B,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X67,0XE4,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X12,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X39,0XFF,0XF7,0XF6,
0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,
0X7B,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XBD,0XFF,0X53,0XF6,
0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XEA,0XE4,0X53,0XF6,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X8E,0XED,0XA8,0XE4,0XA8,0XE4,
0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0X8E,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0X8E,0XED,0X25,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0X67,0XE4,0X54,0XF6,0XFF,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XF8,0XF6,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0X4C,0XED,0X25,0XE4,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X67,0XE4,0X54,0XF6,0XFF,0XFF,0XA9,0XE4,0XA9,0XE4,
0XA9,0XE4,0XA9,0XE4,0X3A,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X95,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X95,0XF6,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X95,0XF6,0X24,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0XA8,0XE4,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XE2,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X8E,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XD0,0XED,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X4C,0XED,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XF8,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0X0B,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X7C,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X4C,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XBE,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0X95,0XF6,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XE2,0XDB,0XA8,0XE4,0X66,0XE4,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X53,0XF6,0XFF,0XFF,0XFF,0XFF,
0XBD,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XD0,0XED,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XEA,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X39,0XFF,0XFF,0XFF,0XBD,0XFF,0X24,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XE2,0XDB,
0X95,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0XE2,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X24,0XE4,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X66,0XE4,0XA8,0XE4,0XA8,0XE4,0X39,0XFF,0XFF,0XFF,0X7C,0XFF,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0X7C,0XFF,0XFF,0XFF,0XBE,0XFF,
0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X25,0XE4,0XFF,0XFF,
0XFF,0XFF,0X7C,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XE3,0XE3,0XD0,0XED,
0X7C,0XFF,0XFF,0XFF,0XBE,0XFF,0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X7B,0XFF,0XFF,0XFF,
0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X3A,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X96,0XF6,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XE3,0XE3,0X3A,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X54,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X24,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X24,0XE4,0XCF,0XED,
0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XE3,0XE3,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X25,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,
0XFF,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X25,0XE4,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0X8E,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X66,0XE4,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,
0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X3A,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X7C,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA9,0XE4,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0XFF,0XFF,0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XBE,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X4C,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X66,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XA8,0XE4,
0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0X4C,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XD0,0XED,0XFF,0XFF,
0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X67,0XE4,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0X12,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X4C,0XED,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,
0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X66,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0X96,0XF6,0XFF,0XFF,0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X7C,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XF8,0XF6,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X11,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X66,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0X54,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X0B,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XF8,0XF6,0XFF,0XFF,
0XF8,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X54,0XF6,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X0B,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XF8,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X11,0XF6,0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,
0XF7,0XF6,0XF7,0XF6,0XF7,0XF6,0X7B,0XFF,0XFF,0XFF,0XFF,0XFF,0X39,0XFF,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0XE2,0XDB,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X7B,0XFF,0X66,0XE4,0X4C,0XED,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X4C,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XE3,0XE3,0XF8,0XF6,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XBE,0XFF,0X0B,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0X3A,0XFF,0XFF,0XFF,0XBE,0XFF,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XE3,0XE3,0XF8,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0X0B,0XED,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,
0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XEA,0XE4,0XCF,0XED,0XCF,0XED,0XEA,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XE2,0XDB,
0X11,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X67,0XE4,0XA9,0XE4,0XA9,0XE4,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X0B,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X67,0XE4,
0XA9,0XE4,0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X8E,0XED,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X66,0XE4,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X4C,0XED,0XFF,0XFF,0XFF,0XFF,0X39,0XFF,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0XE3,0XE3,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X3A,0XFF,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X25,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,
0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XBD,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XBD,0XFF,0X66,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X96,0XF6,
0XE3,0XE3,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XE3,0XE3,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X54,0XF6,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X67,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,
0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XCF,0XED,0X24,0XE4,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XEA,0XE4,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X3A,0XFF,0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X25,0XE4,0X96,0XF6,0XD0,0XED,0XA1,0XDB,0XA1,0XDB,
0XA1,0XDB,0XA9,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X3A,0XFF,
0XA9,0XE4,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X67,0XE4,0XF8,0XF6,
0XD0,0XED,0XA1,0XDB,0XA1,0XDB,0XA1,0XDB,0X0B,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X39,0XFF,
0XF7,0XF6,0X11,0XF6,0X95,0XF6,0XF7,0XF6,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0XF8,0XF6,0XD0,0XED,0XF8,0XF6,0X3A,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X7C,0XFF,0XF8,0XF6,0X12,0XF6,
0XF8,0XF6,0X7C,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X7B,0XFF,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0XCF,0XED,0X7B,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X7B,0XFF,0XCF,0XED,
0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0XCF,0XED,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XCF,0XED,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X53,0XF6,0XA8,0XE4,0XCF,0XED,0X80,0XDB,
0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X11,0XF6,0X80,0XDB,0XE2,0XDB,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,
0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XEA,0XE4,0X80,0XDB,
0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,
0XA8,0XE4,0XE2,0XDB,0XEA,0XE4,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X66,0XE4,0X80,0XDB,
0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0X24,0XE4,0X80,0XDB,
0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X39,0XFF,0XF7,0XF6,0X95,0XF6,0XCF,0XED,0XCF,0XED,0XCF,0XED,
0X80,0XDB,0X24,0XE4,0XCF,0XED,0XCF,0XED,0XCF,0XED,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X66,0XE4,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0XA8,0XE4,0XA8,0XE4,0XA8,0XE4,0X80,0XDB,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X7B,0XFF,0X80,0XDB,0X24,0XE4,0XFF,0XFF,0XFF,0XFF,0X8E,0XED,0XA8,0XE4,
0X39,0XFF,0XFF,0XFF,0XEA,0XE4,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,
0X4C,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XCF,0XED,0XCF,0XED,0XA8,0XE4,0X80,0XDB,0X4C,0XED,0XCF,0XED,0XCF,0XED,
0XE2,0XDB,0XA8,0XE4,0X24,0XE4,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X95,0XF6,0XA8,0XE4,0X11,0XF6,
0XFF,0XFF,0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0X8E,0XED,0XA8,0XE4,
0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X24,0XE4,
0X80,0XDB,0XA8,0XE4,0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X4C,0XED,0X80,0XDB,0X66,0XE4,
0X80,0XDB,0XCF,0XED,0X80,0XDB,0XF7,0XF6,0X80,0XDB,0X8E,0XED,0X80,0XDB,0X66,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0XCF,0XED,0X7B,0XFF,0XFF,0XFF,0X66,0XE4,0X80,0XDB,
0XFF,0XFF,0X7B,0XFF,0XCF,0XED,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0XA8,0XE4,
0XFF,0XFF,0XFF,0XFF,0X11,0XF6,0X80,0XDB,0XE2,0XDB,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X66,0XE4,0X24,0XE4,0XA8,0XE4,0X80,0XDB,0XCF,0XED,0X80,0XDB,0X95,0XF6,
0X80,0XDB,0XCF,0XED,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XE2,0XDB,0X80,0XDB,
0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X80,0XDB,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X7B,0XFF,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XBD,0XFF,0XE2,0XDB,0X80,0XDB,
0XF7,0XF6,0XE2,0XDB,0X80,0XDB,0X7B,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0XEA,0XE4,0XE2,0XDB,
0X80,0XDB,0XCF,0XED,0X80,0XDB,0XCF,0XED,0X80,0XDB,0XEA,0XE4,0X80,0XDB,0XEA,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X39,0XFF,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0X66,0XE4,
0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X4C,0XED,
0XFF,0XFF,0XCF,0XED,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X4C,0XED,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XF7,0XF6,0X80,0XDB,0XCF,0XED,0X80,0XDB,0XE2,0XDB,0XCF,0XED,0X80,0XDB,0XCF,0XED,
0X80,0XDB,0XCF,0XED,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X11,0XF6,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XA8,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0X95,0XF6,0X80,0XDB,0XCF,0XED,0X7B,0XFF,0X80,0XDB,0X80,0XDB,0X7B,0XFF,
0XFF,0XFF,0X7B,0XFF,0X80,0XDB,0XE2,0XDB,0XBD,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0X80,0XDB,0X95,0XF6,0X80,0XDB,
0XA8,0XE4,0XCF,0XED,0X80,0XDB,0XCF,0XED,0XCF,0XED,0X8E,0XED,0X80,0XDB,0XCF,0XED,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XA8,0XE4,0X80,0XDB,0X39,0XFF,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0X4C,0XED,
0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XA8,0XE4,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X11,0XF6,
0XF7,0XF6,0XCF,0XED,0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X53,0XF6,0XCF,0XED,
0X39,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0X8E,0XED,0X80,0XDB,0X95,0XF6,0X80,0XDB,0XA8,0XE4,0XCF,0XED,0X80,0XDB,0XFF,0XFF,
0X8E,0XED,0X24,0XE4,0X80,0XDB,0XF7,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0X80,0XDB,0XE2,0XDB,0XFF,0XFF,
0XE2,0XDB,0X80,0XDB,0X80,0XDB,0XCF,0XED,0XFF,0XFF,0XF7,0XF6,0X80,0XDB,0XA8,0XE4,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XCF,0XED,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,
0X80,0XDB,0X80,0XDB,0X80,0XDB,0X80,0XDB,0X53,0XF6,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,0XFF,
};

/* ================= LCD驱动声明 =================
 * LIOT_ADD_DISPLAY宏: 将LCD驱动实例注册到框架, 框架会自动链接对应的驱动代码
 * 可同时声明多个驱动, 运行时通过lcdDev指针选择使用哪一个
 * 每个驱动对应一种LCD控制IC, 如:
 *   liot_st7789_dev  - ST7789  (常用1.3寸/1.54寸彩屏)
 *   liot_gc9a01_dev  - GC9A01  (常用1.28寸圆形屏)
 *   liot_st7735_dev  - ST7735  (常用0.96寸/1.8寸彩屏)
 *   liot_ssd1306_12864_dev - SSD1306 (0.96寸单色OLED, 128x64)
 *   liot_gc9d01_dev  - GC9D01  (小尺寸彩屏)
 *   liot_st7567_dev  - ST7567  (单色LCD)
 *   liot_gc9307_dev  - GC9307  (常用2.4寸彩屏)
 */
LIOT_ADD_DISPLAY(liot_st7789_dev);  //添加LCD驱动
LIOT_ADD_DISPLAY(liot_gc9a01_dev);  //添加LCD驱动
LIOT_ADD_DISPLAY(liot_st7735_dev);  //添加LCD驱动
LIOT_ADD_DISPLAY(liot_ssd1306_12864_dev); //添加LCD驱动
LIOT_ADD_DISPLAY(liot_gc9d01_dev); //添加LCD驱动
LIOT_ADD_DISPLAY(liot_st7567_dev); //添加LCD驱动
LIOT_ADD_DISPLAY(liot_gc9307_dev);

/* ================= 接口和硬件配置 =================
 * LIOT_LCD_DEMO_TEST_LSPI: 使用LSPI接口(Low-Speed SPI, EC718专用LCD接口, 支持DMA2D加速)
 * LIOT_LCD_DEMO_TEST_SPI:  使用普通SPI接口(通用性更好, 但速度较慢)
 * 两者只能选一个, 通过1/0切换
 * 注意: EC716系列不支持LSPI, 必须用SPI
 */
#define LIOT_LCD_DEMO_TEST_LSPI     1       // 使用LSPI接口驱动LCD，716系列不支持LSPI
#define LIOT_LCD_DEMO_TEST_SPI      0       // 使用SPI接口驱动LCD

/* LCD数量: 1=单屏, 2=双屏(双屏目前仅支持LSPI接口)
 * 双屏时需准备第二份cfg1配置, 并取消代码中 #if LIOT_LCD_DEMO_NUM >= 2 的分支
 */
#define LIOT_LCD_DEMO_NUM           1       // 驱动LCD数量，1或2，双屏目前仅支持LSPI

/* LSPI传输完成回调函数 (DMA异步传输结束时触发)
 * 当前为空实现, 如需在传输完成后做处理可在此添加
 * 注意: 此函数在中断上下文中执行, 不可做耗时操作
 */
static void lcd_event_callback(void)
{
    
}

void liot_lcd_demo_thread(void *argv)
{
    uint16_t i = 0, j = 0, k = 0;
    uint32_t lcdticks = 0;
    uint32_t width = 0, height = 0;

    /* ====== 第1步: 选择LCD驱动 ======
     * 指向上面LIOT_ADD_DISPLAY声明的某个驱动实例
     * 不同IC的初始化序列/分辨率/方向不同, 驱动内部会处理
     * 切换屏幕只需改这一行即可
     */
    liot_hal_lcdDev_t *lcdDev = &liot_gc9307_dev;

    /* ====== 第2步: 构造LCD配置 ======
     * interface: 通信接口配置
     *   .type  - 接口类型: LIOT_LCD_INTERFACE_LSPI(高速) 或 LIOT_LCD_INTERFACE_SPI(通用)
     *   .lspi.num - LSPI端口号: EC718支持LSPI_PORT0/PORT1/PORT2, 需与硬件引脚对应
     *   .lspi.lcd_3_line_spi - 3线SPI模式(无DC引脚, 用9bit命令), false=4线(有DC引脚)
     *   .lspi.lcd_2_data_lane - 双数据通道(需硬件支持), false=单通道
     *   .lspi.speed - LSPI时钟频率: LIOT_LSPI_25MHZ等, 越高刷屏越快, 但需屏IC支持
     *   .lspi.sync - true=同步传输(等完成才返回), false=异步(DMA, 需配合回调)
     *   .lspi.cb - 异步传输完成回调, sync=false时有效
     *   .lspi.cs - 片选: LIOT_LSPI_CS0/CS1, 双屏时第二个屏用CS1
     * blk: 背光配置
     *   .type - LIOT_LCD_BACKLIGHT_PWM(PWM调光) 或 LIOT_LCD_BACKLIGHT_GPIO(开关)
     *   .pin  - 背光控制引脚号
     *   .pwm_num - PWM通道号(type=PWM时有效)
     * rst: 复位配置
     *   .pin   - RST引脚号
     *   .delay - 复位后延时(ms), 等待LCD IC稳定
     */
    liot_lcd_config_t cfg = {
        .interface = {  
            .type = LIOT_LCD_INTERFACE_LSPI,
            .lspi.num = LIOT_LSPI_PORT2,
            .lspi.lcd_3_line_spi = false,
            .lspi.lcd_2_data_lane = false,
            .lspi.speed = LIOT_LSPI_25MHZ,
            .lspi.sync = true,
            .lspi.cb = lcd_event_callback,
            .lspi.cs = LIOT_LSPI_CS0,
            .blk.type = LIOT_LCD_BACKLIGHT_PWM,
            .blk.pin = 100,
            .blk.pwm_num = LIOT_PWM_0,
            .rst.pin = 49,
            .rst.delay = 100,
        },
        .lcdDev = lcdDev,
    };

    /* ====== 第3步: 上电等待 + 电源配置 ======
     * osDelay(5000): 等待系统稳定, 确保各外设初始化完成
     * liot_aon_power_on(): 开启AON(Always-On)域供电, 部分模组LCD由AON供电
     * liot_gpio_set_voltage: 设置GPIO电压3.3V, 需与LCD IO电平匹配
     * slpManSetPmuSleepMode: 关闭深度休眠, 避免LCD刷新过程中MCU意外休眠
     */
    osDelay(5000);

    liot_aon_power_on();
    liot_gpio_set_voltage(LIOT_VOL_3_30V);
    slpManSetPmuSleepMode(true, SLP_ACTIVE_STATE, false);

    /* ====== 第4步: 初始化LCD ======
     * liot_lcd_init: 根据cfg配置初始化接口+复位+背光+发送IC初始化命令
     * 返回lcd句柄, 后续所有绘图API都通过此句柄操作
     */
    liot_lcd_handle_t lcd = liot_lcd_init(&cfg);
#if LIOT_LCD_DEMO_NUM >= 2
    liot_lcd_handle_t lcd1 = liot_lcd_init(&cfg1);
#endif

    /* ====== 第5步: 获取屏幕有效分辨率 ======
     * 根据屏幕旋转方向(0°/90°/180°/270°)调整宽高
     * 0°/180°: 原始宽高; 90°/270°: 宽高互换
     * 后续绘图坐标基于此width/height计算
     */
    if(lcdDev->info.direction == LIOT_LCD_DIR_0_ANGLE || lcdDev->info.direction == LIOT_LCD_DIR_180_ANGLE)
    {
        width = lcdDev->info.width;
        height = lcdDev->info.height;
    }
    else
    {
        width = lcdDev->info.height;
        height = lcdDev->info.width;
    }

    /* ====== 第6步: 背光亮度渐变测试 ======
     * liot_lcd_set_brightness: 设置背光亮度(0~100), 需背光类型为PWM才有效
     * 依次设置 100→80→60→40→20, 每次间隔1s, 观察亮度渐变
     */
    // 背光亮度测试
    liot_lcd_set_brightness(lcd, 100);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd, 80);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd, 60);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd, 40);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd, 20);
    liot_rtos_task_sleep_ms(1000);
#if LIOT_LCD_DEMO_NUM >= 2
    liot_lcd_set_brightness(lcd1, 100);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd1, 80);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd1, 60);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd1, 40);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_set_brightness(lcd1, 20);
    liot_rtos_task_sleep_ms(1000);
#endif

    /* ====== 第7步: 全屏清色测试 ======
     * liot_lcd_clear_screen: 将帧缓冲填充为指定颜色(不立即刷新到屏幕)
     * liot_lcd_refresh: 将帧缓冲数据通过LSPI/SPI发送到LCD显存, 屏幕才会更新
     * 依次显示 红→绿→蓝→白, 验证RGB三通道是否正常
     * 颜色定义在liot_lcd.h中: RED=0xF800, GREEN=0x07E0, BLUE=0x001F, WHITE=0xFFFF
     */
    // 全屏颜色刷屏测试
    liot_lcd_clear_screen(lcd, RED);
    liot_lcd_refresh(lcd);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd, GREEN);
    liot_lcd_refresh(lcd);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd, BLUE);
    liot_lcd_refresh(lcd);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd, WHITE);
    liot_lcd_refresh(lcd);
    liot_rtos_task_sleep_ms(1000);

#if LIOT_LCD_DEMO_NUM >= 2
    liot_lcd_clear_screen(lcd1, GREEN);
    liot_lcd_refresh(lcd1);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd1, BLUE);
    liot_lcd_refresh(lcd1);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd1, RED);
    liot_lcd_refresh(lcd1);
    liot_rtos_task_sleep_ms(1000);
    liot_lcd_clear_screen(lcd1, WHITE);
    liot_lcd_refresh(lcd1);
    liot_rtos_task_sleep_ms(1000);
#endif

    /* ====== 第8步: 画线测试 ======
     * liot_lcd_draw_line: 在帧缓冲中画一条线(起点到终点, 指定颜色)
     * 这里画了两条线: 水平中线 + 垂直中线, 将屏幕分为四象限
     */
    // 画线
    liot_lcd_draw_line(lcd, 0, height / 2, width, height / 2, BLUE);
    liot_lcd_draw_line(lcd, width / 2, 0, width / 2, height, BLUE);
    liot_lcd_refresh(lcd);

#if LIOT_LCD_DEMO_NUM >= 2
    liot_lcd_draw_line(lcd1, 0, height / 2, width, height / 2, BLUE);
    liot_lcd_draw_line(lcd1, width / 2, 0, width / 2, height, BLUE);
    liot_lcd_refresh(lcd1);
#endif

    /* ====== 第9步: 显示图片 ======
     * liot_lcd_write: 将RGB565格式的图片数据写入帧缓冲指定区域
     * 参数: (handle, 起始x, 起始y, 结束x, 结束y, 图片数据指针)
     * 坐标范围: 0~(宽/高-1), 即100x60的图片, x范围0~99, y范围0~59
     * SSD1306是单色屏, RGB565图片不适用, 所以跳过
     */
    // 显示图片
    if(lcdDev != &liot_ssd1306_12864_dev)
        liot_lcd_write(lcd, 0, 0, 100-1, 60-1, (uint8_t *)Lierda_logo);
#if LIOT_LCD_DEMO_NUM >= 2
    if(lcdDev != &liot_ssd1306_12864_dev)
        liot_lcd_write(lcd1, 0, 0, 100-1, 60-1, (uint8_t *)Lierda_logo);
#endif


    /* ====== 第10步: 正弦曲线绘制 ======
     * 逐点计算正弦函数y值并画线连接, 形成动态正弦波动画
     * 公式: y = (height/2)*sin(1/(width/4)*π*i) + height/2
     * sin函数参数为弧度, 3.14近似π, width/4控制波形周期数
     * 每画一个点延时10ms, 形成从左到右逐步绘制的效果
     * k保存上一次y值, 用于连线
     */
    // 画点 点与点之间连线
    for(i = 0; i < width; i++)
    {
        j = ( (float)((height) / 2) * (float)sin((float)( (float)1 / (float)(width / 4) ) * 3.14 * i)) + ((height) / 2);
        if(i != 0)  liot_lcd_draw_point(lcd, i, j, BLUE);
#if LIOT_LCD_DEMO_NUM >= 2
        if(i != 0)  liot_lcd_draw_point(lcd1, i, j, RED);
#endif
        liot_lcd_draw_line(lcd, i, k, i, j, BLUE);
#if LIOT_LCD_DEMO_NUM >= 2
        liot_lcd_draw_line(lcd1, i, k, i, j, RED);
#endif
        k = j;
        liot_lcd_refresh(lcd);
#if LIOT_LCD_DEMO_NUM >= 2
        liot_lcd_refresh(lcd1);
#endif
        osDelay(10);
    }

    /* ====== 第11步: 画圆和矩形 ======
     * liot_lcd_draw_circle: 画空心圆 (圆心x, 圆心y, 半径, 颜色)
     * liot_lcd_draw_rectangle: 画空心矩形 (左上x, 左上y, 右下x, 右下y, 颜色)
     * 以屏幕中心为基准, 画两组同心圆(半径30和60)和矩形(30x30和60x60)
     */
    // 画圆形/矩形
    liot_lcd_draw_circle(lcd, width / 2, height / 2, 30, GREEN);
    liot_lcd_draw_circle(lcd, width / 2, height / 2, 60, GREEN);
    liot_lcd_draw_rectangle(lcd, (width / 2) - 30, (height / 2) - 30, (width / 2) + 30, (height / 2) + 30, BLACK);
    liot_lcd_draw_rectangle(lcd, (width / 2) - 60, (height / 2) - 60, (width / 2) + 60, (height / 2) + 60, BLACK);
    liot_lcd_refresh(lcd);

#if LIOT_LCD_DEMO_NUM >= 2
    liot_lcd_draw_circle(lcd1, width / 2, height / 2, 30, BLUE);
    liot_lcd_draw_circle(lcd1, width / 2, height / 2, 60, BLUE);
    liot_lcd_draw_rectangle(lcd1, (width / 2) - 30, (height / 2) - 30, (width / 2) + 30, (height / 2) + 30, BLACK);
    liot_lcd_draw_rectangle(lcd1, (width / 2) - 60, (height / 2) - 60, (width / 2) + 60, (height / 2) + 60, BLACK);
    liot_lcd_refresh(lcd1);
#endif

    liot_rtos_task_sleep_ms(3000);

    /* ====== 第12步: 帧率测试 ======
     * 循环 红→绿→蓝 刷屏, 测量每帧耗时和FPS
     * liot_rtos_get_running_time: 获取系统运行时间(ms)
     * FPS = 1000 / 单帧耗时(ms)
     * 注意: 刷屏会闪烁, 调试时注意
     * 影响帧率的因素: LSPI时钟频率/是否双通道/屏幕分辨率/同步vs异步
     */
    // 刷屏帧率测试（屏闪注意）
    while (1)
    {
        for(i = 0; i < 3; i++)
        {
            lcdticks = liot_rtos_get_running_time();
            if(i == 0)
            {
                liot_lcd_clear_screen(lcd, RED);
                liot_lcd_refresh(lcd);
#if LIOT_LCD_DEMO_NUM >= 2
                liot_lcd_clear_screen(lcd1, GREEN);
                liot_lcd_refresh(lcd1);
#endif
            }
            else if(i == 1)
            {
                liot_lcd_clear_screen(lcd, GREEN);
                liot_lcd_refresh(lcd);
#if LIOT_LCD_DEMO_NUM >= 2
                liot_lcd_clear_screen(lcd1, BLUE);
                liot_lcd_refresh(lcd1);
#endif
            }
            else if(i == 2)
            {
                liot_lcd_clear_screen(lcd, BLUE);
                liot_lcd_refresh(lcd);
#if LIOT_LCD_DEMO_NUM >= 2
                liot_lcd_clear_screen(lcd1, RED);
                liot_lcd_refresh(lcd1);
#endif
            }
            lcdticks = liot_rtos_get_running_time() - lcdticks;
            liot_trace("LCD loop %dms, %dFPS", lcdticks, lcdticks == 0 ? 0 : 1000/lcdticks);
        }   
    }   
}
```

### 7.2 demo效果

demo正常运行之后，会有如下过程显示：

#### 7.2.1 亮度测试

* 背光亮度从 100% 逐级递减至 20%
* 每级持续 1 秒：100% → 80% → 60% → 40% → 20%

#### 7.2.2 十字线显示

* 清屏白色
* 屏幕中心绘制蓝色十字线
* 刷新显示

#### 7.2.3 Logo 与几何图形

* 左上角显示 Lierda Logo（100×60）
* 中心绘制两个绿色同心圆（半径 30、60）
* 绘制两个黑色同心矩形
* 刷新显示，保持 3 秒

#### 7.2.4 循环颜色测试

* 每 1 秒切换全屏颜色
* 顺序：红 → 绿 → 蓝 → 白 → 循环

