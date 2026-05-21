# API入口_Rev1.0

{link_to_translation}`en:[English]`

## 文件修订历史

| **文档版本** | **变更日期** | **修订人** | **审核人** | **变更内容** |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 26-03-13 | zlc |  | 新增文档 |

## 1 引言

本章节主要内容介绍Lierda LTE-EC71X OPENCPU 底包分离已经支持的利尔达自研功能API列表，其他平台支持不在该文档内说明，基于此文档，方便客户在进行功能开发时进行参考。

## 2 API 功能说明

### 2.1 基本信息 API

#### 2.1.1 Dev API 

| **函数** | **说明** |
| ---- | ---- |
| `liot_dev_get_imei()` | 获取设备的 IMEI号 |
| `liot_dev_get_firmware_version()` | 获取设备的固件版本 |
| `liot_dev_get_sn()` | 获取设备序列号 |
| `liot_dev_get_product_id()` | 获取设备制造商 ID |
| `liot_dev_get_firmware_subversion()` | 用于获取设备的子固件版本 |
| `liot_dev_get_model()` | 获取设备型号 |
| `liot_dev_set_modem_fun()` | 设置设备 modem 功能 |
| `liot_dev_get_modem_fun()` | 获取设备 modem 功能 |
| `liot_dev_memory_size_query()` | 查询 heap 空间状态信息 |
| `liot_dev_cfg_wdt()` | 配置看门狗（定时器）开关 |
| `liot_dev_feed_wdt()` | 喂系统看门狗（将定时器清零） |
| `Liot_DevGetHardWareInfo()` | 获取硬件型号 |
| `Liot_DevSetBandMode()` | 设置可用频段 |
| `Liot_DevGetBandMode()` | 查询可用频段与支持频段列表 |
| `Liot_DevFreqConfig()` | 锁定频点、小区与清除优先频点 |
| `Liot_RRCRelease()` | 使能快速释放 |
| `Liot_DevSetDnsServersAddr()` | 设置主备DNS服务器地址 |
| `Liot_DevGetDnsServersAddr()` | 查询主备DNS服务器地址 |

#### 2.1.2 datacall API

| **函数** | **说明** |
| ---- | ---- |
| `liot_network_register_cereg_get()` | 获取网络注册状态 |
| `Liot_DataCallCfgDefaultEpsBearer()` | 设置或查询默认承载（CID 1）的 APN 和 IP 类型 |
| `Liot_PsEventCb()` | 注册系统事件通知回调。 |

#### 2.1.3 SIM API

| **函数** | **说明** |
| ---- | ---- |
| `liot_sim_get_imsi()` | 获取 SIM 卡的 IMSI |
| `liot_sim_get_iccid()` | 获取 SIM 卡的 ICCID |
| `liot_sim_get_phonenumber()` | 获取 SIM 卡本机号码 |
| `liot_sim_get_card_status()` | 获取 SIM 卡缓存状态信息 |

#### 2.1.4 NW API

| **函数** | **说明** |
| ---- | ---- |
| `liot_nw_get_csq()` | 查询csq信号强度信息 |
| `liot_nw_get_operator_name()` | 获取当前注网的运营商信息 |
| `liot_nw_get_reg_status()` | 获取当前网络注册信息 |
| `liot_nw_set_selection()` | 设置运营商 |
| `liot_nw_get_selection()` | 获取选择的运营商信息 |
| `liot_nw_get_signal_strength()` | 获取详细信号强度信息 |
| `liot_nw_get_nitz_time_info()` | 获取当前基站时间 |
| `liot_nw_get_cell_info()` | 获取当前服务及邻近小区信息 |
| `liot_nw_register_cb()` | 注册事件回调函数 |
| `liot_nw_get_data_count()` | 获取上行和下行数据计数 |
| `liot_nw_reset_data_count()` | 重置上行和下行数据计数 |
| `liot_nw_set_ctzu_switch()` | 设置基站时间同步开关 |
| `liot_nw_get_ctzu_switch()` | 获取基站时间同步开关状态 |

#### 2.1.5 SMS API

| **函数** | **说明** |
| ---- | ---- |
| `liot_sms_send_msg()` | 发送文本格式的短消息 |
| `liot_sms_send_pdu()` | 发送PDU格式的短消息 |
| `liot_sms_read_msg_list()` | 获取短消息列表 |
| `liot_sms_read_msg_ex()` | 读取单条短消息 |
| `liot_sms_delete_msg_ex()` | 删除单条消息 |
| `liot_sms_get_center_address()` | 获取短消息中心号码 |
| `liot_sms_set_center_address()` | 设置短消息中心号码 |
| `liot_sms_get_storage_info()` | 获取SM与ME的存储信息 |
| `liot_sms_set_storage()` | 设置短信存储位置 |
| `liot_sms_get_storage()` | 获取短信存储位置 |

#### 2.1.6 Custom AT API

| **函数** | **说明** |
| ---- | ---- |
| `liot_open_atcmd_init()` | 该函数用于AT功能的打开。 |
| `liot_atcmd_register()` | 该函数用于注册AT table表。 |
| `liot_atcmd_reply()` | 该指接口为AT的返回函数 |

### 2.2 Driver API列表

#### 2.2.1 OS API

##### 2.2.1.1 任务

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_task_create()` | 创建任务 |
| `liot_rtos_task_delete()` | 删除任务 |
| `liot_rtos_task_yield()` | 释放 CPU 使用权 |
| `liot_rtos_task_get_current_ref()` | 获取当前任务的任务句柄 |
| `liot_rtos_task_change_priority()` | 切换任务优先级 |
| `liot_rtos_task_get_status()` | 获取任务状态信息 |
| `liot_rtos_task_sleep_ms()` | 设置任务休眠时间 |
| `liot_rtos_task_sleep_s()` | 设置任务休眠时间 |
| `liot_rtos_task_get_stack_space()` | 获取任务堆栈空闲空间 |
| `liot_rtos_task_suspend()` | 任务挂起 |
| `liot_rtos_task_resume()` | 解除任务挂起，恢复为可调度的运行状态 |
| `liot_rtos_get_running_time()` | 获取 RTOS 系统的时钟节拍数转化的时间，单位ms |
| `liot_rtos_get_system_tick()` | 获取 RTOS 系统的时钟节拍数 |
| `liot_xPortGetTotalHeapSize()` | 获取 FreeRTOS 堆的总大小 |
| `liot_xPortGetFreeHeapSize()` | 获取 FreeRTOS 堆的空闲大小 |
| `liot_xPortGetMinimumEverFreeHeapSize()` | 获取 FreeRTOS 堆在运行过程中最小空闲大小 |
| `liot_xPortGetMaximumFreeBlockSize()` | 获取 FreeRTOS 最大可申请的内存块大小 |
| `liot_psram_xPortGetTotalHeapSize()` | 获取 PSRAM 的总大小 |
| `liot_psram_xPortGetFreeHeapSize()` | 获取 PSRAM 的空闲大小 |
| `liot_psram_xPortGetMinimumEverFreeHeapSize()` | 获取 PSRAM 在运行过程中最小空闲大小 |
| `liot_psram_xPortGetMaximumFreeBlockSize()` | 获取 PSRAM 在运行过程中最大可申请的内存块大小 |
| `liot_rtos_is_alive()` | 判断任务是否处于运行态 |
| `liot_rtos_task_create_static()` | 静态方式创建任务 |

##### 2.2.1.2 临界区

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_enter_critical()` | 进入临界区 |
| `liot_rtos_enter_critical_from_isr()` | 从中断中进入临界区 |
| `liot_rtos_exit_critical()` | 退出临界区 |
| `liot_rtos_exit_critical_from_isr()` | 从中断中退出临界区 |

##### 2.2.1.3 信号量

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_semaphore_create()` | 创建信号量 |
| `liot_rtos_semaphore_create_ex()` | 创建信号量 |
| `liot_rtos_semaphore_wait()` | 设置信号量等待时间 |
| `liot_rtos_semaphore_release()` | 释放信号量 |
| `liot_rtos_semaphore_get_cnt()` | 获取信号量值 |
| `liot_rtos_semaphore_delete()` | 删除信号量 |

##### 2.2.1.4 互斥锁

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_mutex_create()` | 创建互斥锁 |
| `liot_rtos_mutex_lock()` | 获取互斥锁，等待时间用户可以根据需求进行自定义 |
| `liot_rtos_mutex_try_lock()` | 尝试获得互斥锁，等待时间为永久等待 |
| `liot_rtos_mutex_unlock()` | 释放互斥锁 |
| `liot_rtos_mutex_delete()` | 删除互斥锁 |

##### 2.2.1.5 消息队列

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_queue_create()` | 创建消息队列 |
| `liot_rtos_queue_wait()` | 等待队列中的消息 |
| `liot_rtos_queue_release()` | 释放消息队列 |
| `liot_rtos_queue_get_cnt()` | 获取队列中的消息数量 |
| `liot_rtos_queue_delete()` | 删除消息队列 |
| `liot_rtos_queue_reset()` | 重置队列中的元素和更改队列长度 |
| `liot_rtos_queue_get_space()` | 查询队列中可用空间数量 |

##### 2.2.1.6 定时器

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_timer_create()` | 创建定时器 |
| `liot_rtos_timer_start()` | 开启定时器 |
| `liot_rtos_timer_is_running()` | 判断定时器是否处于运行态 |
| `liot_rtos_timer_stop()` | 停止定时器 |
| `liot_rtos_timer_delete()` | 删除定时器 |
| `liot_rtos_timer_stop_isr()` | 在中断中停止定时器 |

##### 2.2.1.7 事件组

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_flag_create()` | 创建事件组 |
| `liot_rtos_flag_get()` | 获取事件组当前的位状态 |
| `liot_rtos_flag_wait()` | 等待事件组的位满足指定的条件 |
| `liot_rtos_flag_release()` | 设置事件组中的事件位 |
| `liot_rtos_flag_clear()` | 清除事件组中的事件位 |
| `liot_rtos_flag_delete()` | 删除事件组 |

##### 2.2.1.8 PSRAM API

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_psram_malloc()` | 从PSRAM申请内存。 |
| `liot_rtos_psram_free()` | 释放从PSRAM申请的内存。 |
| `liot_rtos_psram_realloc()` | 重新调整之前调用 `liot_rtos_psram_malloc()`所分配的 ptr 所指向的内存块的大小。 |
| `liot_psram_xPortGetTotalHeapSize()` | 用于PSRAM总的HEAP大小。 |
| `liot_psram_xPortGetFreeHeapSize()` | 用于获取PSRAM剩余可用内存大小。 |

##### 2.2.1.9 其他

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtos_malloc()` | 动态申请空间 |
| `liot_rtos_calloc()` | 分配内存并初始化为 0 |
| `liot_rtos_free()` | 释放动态申请空间 |
| `liot_rtos_realloc()` | 重新分配内存 |
| `liot_true_rand()` | 硬件随机数 |

#### 2.2.2 UART API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_UartInit()` | Uart 初始化接口 |
| `Liot_UartDeinit()` | Uart 去初始化接口 |
| `Liot_UartSend()` | Uart 发送接口 |

#### 2.2.3 USB API

| **函数** | **说明** |
| ---- | ---- |
| `liot_usb_bind_hotplug_cb()` | 注册 USB 事件回调函数 |
| `liot_usb_get_hotplug_state()` | 获取 USB 插拔状态 |
| `liot_usb_drv_is_enabled()` | 获取 USB 初始化状态 |
| `liot_usb_drv_enable()` | 初始化 USB 驱动 |
| `liot_usb_drv_disable()` | 去初始化 USB 驱动 |

#### 2.2.4 ADC API

| **函数** | **说明** |
| ---- | ---- |
| `liot_adc_get_volt_raw()` | 读取 ADC 通道中的模拟电压值源数据 |

#### 2.2.5 GPIO API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_GpioInit()` | GPIO 初始化接口 |
| `Liot_GpioGetLevel()` | GPIO 去初始化接口。 |
| `Liot_GpioSetLevel()` | GPIO 设置电平 |
| `Liot_GpioIntEnable()` | 使能普通 gpio 中断源 |
| `Liot_GpioIntDisable()` | 关闭普通 gpio 中断源 |
| `Liot_AonPowerCtl()` | 控制 AGPIO 电源域开关 |
| `Liot_SetVoltage()` | 设置电源域电压 |
| `Liot_SetPinFunc()` | 设置模组引脚复用功能 |
| `Liot_GetPinFunc()` | 获取模组引脚复用功能 |
| `Liot_WakeupIntInit()` | 初始化 wakeup 引脚中断 |
| `Liot_WakeupIntDeinit()` | 去初始化 wakeup 引脚中断 |
| `Liot_WakeupPadGetLevel()` | 获取wakeup 引脚电平 |

#### 2.2.6 PWM API

| **函数** | **说明** |
| ---- | ---- |
| `liot_pwm_open()` | 打开 PWM 功能 |
| `liot_pwm_close()` | 关闭 PWM 功能 |
| `liot_pwm_enable()` | 使能 PWM 并配置 PWM 的脉冲周期和占空比 |
| `liot_pwm_disable()` | 暂停 PWM 功能 |
| `liot_pwm_set_duty_cycle()` | 设置PWM占空比 |

#### 2.2.7 APWM API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_ApwmCfg()` | 打开 PWM 功能 |
| `Liot_ApwmEnable()` | 关闭 PWM 功能 |

#### 2.2.8 I2C API

| **函数** | **说明** |
| ---- | ---- |
| `liot_I2cInit()` | 初始化 I2C 总线。 |
| `liot_I2cRelease()` | 释放 I2C 总线。 |
| `liot_I2cWrite()` | 向 I2C 总线写入数据，从设备的寄存器地址长度为 8 位。 |
| `liot_I2cRead()` | 从 I2C 总线读取数据，从设备的寄存器地址长度为 8 位。 |
| `liot_I2cWrite_16bit_addr()` | 向 I2C 总线写入数据，从设备的寄存器地址长度为 16 位。 |
| `liot_I2cRead_16bit_addr()` | 从 I2C 总线读取数据，从设备的寄存器地址长度为 16 位。 |

#### 2.2.9 FLASH API

| **函数** | **说明** |
| ---- | ---- |
| `liot_flash_erase()` | 擦除 flash 中的数据。 |
| `liot_flash_read()` | 从 flash 中读取数据。 |
| `liot_flash_write()` | 向 flash 中写入数据。 |

#### 2.2.10 RTC API

| **函数** | **说明** |
| ---- | ---- |
| `liot_rtc_set_time()` | 设置rtc时间 |
| `liot_rtc_get_time()` | 获取rtc时间 |
| `liot_rtc_get_time_s()` | 获取rtc时间转换成秒数 |
| `liot_rtc_get_localtime()` | 获取本地rtc时间 |
| `liot_rtc_set_timezone()` | 设置时区，以15分钟为单位 |
| `liot_rtc_get_timezone()` | 获取时区，以15分钟为单位 |
| `liot_rtc_print_time()` | 打印rtc时间 |
| `liot_rtc_set_alarm()` | 设置rtc alarm时间 |
| `liot_rtc_get_alarm()` | 获取rtc alarm时间 |
| `liot_rtc_enable_alarm()` | 打开和关闭rtc alarm |
| `liot_rtc_register_cb()` | 注册rtc alarm 回调函数 |
| `Liot_GetTimestamp()` | 获取rtc时间转换成毫秒数 |

#### 2.2.11 FS API

| **函数** | **说明** |
| ---- | ---- |
| `liot_fopen()` | 根据文件路径或文件名打开一个文件。 |
| `liot_fclose()` | 关闭一个已打开的文件。 |
| `liot_remove()` | 删除一个文件。 |
| `liot_fread()` | 读取文件内容。 |
| `liot_fwrite()` | 向文件写入内容。 |
| `liot_fseek()` | 设置文件指针位置。 |
| `liot_frewind()` | 将文件位置指针设置到文件的开头。 |
| `liot_ftell()` | 从文件指针位置截断数据。 |
| `liot_fstat()` | 根据文件描述符获取文件的状态。 |
| `liot_stat()` | 根据文件名获取文件信息。 |
| `liot_ftruncate()` | 将文件从指定长度截断。 |
| `liot_fsize()` | 获取文件大小。 |
| `liot_file_exist()` | 根据文件名判断文件是否存在。 |
| `liot_mkdir()` | 创建一个文件夹。 |
| `liot_opendir()` | 打开一个文件夹。 |
| `liot_closedir()` | 关闭一个已打开的文件夹。 |
| `liot_readdir()` | 获取文件夹信息。 |
| `liot_rename()` | 更改文件夹命名。 |
| `liot_fsync()` | 同步文件数据。 |
| `liot_internal_fs_free_size_get()` | 获取文件系统剩余大小。 |

#### 2.2.12 NV API

| **函数** | **说明** |
| ---- | ---- |
| `liot_nvm_fwrite()` | 写入简单配置文件 |
| `liot_nvm_fread()` | 读取简单配置文件 |
| `liot_cust_nvm_fwrite()` | 写入用户自定义简单配置文件 |
| `liot_cust_nvm_fread()` | 读取用户自定义简单配置文件 |

#### 2.2.13 低功耗相关

| **函数** | **说明** |
| ---- | ---- |
| `Liot_SleepSetMode()` | 设置功耗模式 |
| `Liot_SleepTimerStart()` | 开启低功耗定时器 |
| `Liot_SleepTimerStop()` | 停止低功耗定时器 |
| `Liot_SleepTimerCheck()` | 检测低功耗定时器是否在运行 |
| `Liot_SleepTimerGetID()` | 获取唤醒系统的低功耗ID |

#### 2.2.14 PowerKey API

| **函数** | **说明** |
| ---- | ---- |
| `liot_power_down()` | 模组关机 |
| `liot_power_reset()` | 模组复位 |
| `liot_get_pwrkey_status()` | 获取pwrkey电平状态 |
| `liot_pwrkey_callback_register()` | 注册pwrkey中断回调 |
| `liot_pwrkey_shutdown_time_set()` | 设置pwrkey关机超时时间 |
| `liot_get_powerup_reason()` | 获取复位原因 |
| `liot_set_pwrkey_pull()` | 设置pwrkey上下拉 |
| `liot_set_pwrkey_Init()` | 设置pwrkey初始化状态 |

#### 2.2.15 GNSS API

| **函数** | **说明** |
| ---- | ---- |
| `liot_gnss_config()` | 配置gnss模块参数 |
| `liot_agnss_config()` | 配置agnss功能参数 |
| `liot_gnss_open()` | 开启gnss模块 |
| `liot_gnss_close()` | 关闭gnss模块 |
| `liot_gnss_get_location()` | 获取定位信息 |
| `liot_gnss_get_nmea()` | 获取指令NMEA语句 |
| `liot_gnss_close_backup_power()` | 关闭GNSS芯片备用电源 |

#### 2.2.16 SPI API

| **函数** | **说明** |
| ---- | ---- |
| `liot_spi_init()` | 该函数用于初始化 SPI |
| `liot_spi_init_ext()` | 该函数用于初始化 SPI（配置 SPI 总线参数） |
| `liot_spi_write_read()` | 该函数用于设置通过 SPI 同时发送和接收数据 |
| `liot_spi_read()` | 该函数用于设置通过 SPI 接收数据 |
| `liot_spi_write()` | 该函数用于设置通过 SPI 发送数据 |
| `liot_spi_release()` | 该函数用于释放 SPI 总线 |

### 2.3 应用协议 API

#### 2.3.1 HTTP API

| **函数** | **说明** |
| ---- | ---- |
| `liot_httpc_new()` | 创建一个新的HTTP客户端句柄并初始化HTTP客户端资源 |
| `liot_httpc_perform()` | 发送 HTTP 请求 |
| `liot_httpc_stop()` | 停止HTTP请求 |
| `liot_httpc_release()` | 释放 HTTP 客户端资源 |
| `liot_httpc_setopt()` | 配置 HTTP 客户端属性 |
| `liot_httpc_getinfo()` | 获取HTTP消息头信息 |
| `liot_httpc_formadd()` | 配置 HTTP 表单属性。 |
| `liot_httpc_is_running()` | 判断HTTP客户端是否处于运行态 |
| `liot_httpc_url_parse()` | 解析URL |

#### 2.3.2 SSL API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_SSLSetCfg()` | 配置SSL相关参数配置 |
| `Liot_SSLSocketOpen()` | 创建SSL连接 |
| `Liot_SSLSocketSend()` | 发送数据 |
| `Liot_SSLSocketGetStatus()` | 查询SSL连接状态 |
| `Liot_SSLSocketClose()` | 关闭SSL连接 |

#### 2.3.3 MQTT API

| **函数** | **说明** |
| ---- | ---- |
| `liot_mqtt_client_init_ex()` | 初始化 MQTT 客户端资源并创建一个新的 MQTT 客户端句柄 |
| `liot_mqtt_connect()` | 配置 MQTT 上下文，并与服务器建立连接 |
| `liot_mqtt_publish()` | 向指定topic发布消息 |
| `liot_mqtt_sub_unsub()` | 订阅/取消订阅topic |
| `liot_mqtt_disconnect()` | 断开连接 |
| `liot_mqtt_set_inpub_callback()` | 设置接收服务器发布消息的处理回调函数 |
| `liot_mqtt_client_is_connected()` | 查询mqtt连接状态 |
| `liot_mqtt_client_deinit()` | 释放mqtt客户端资源 |
| `liot_mqtt_pingreq()` | 发送ping消息 |
| `liot_onenet_generate_auth_token()` | 获取onenet平台token |

#### 2.3.4 FTP API

| **函数** | **说明** |
| ---- | ---- |
| `liot_ftp_client_new()` | 创建FTP客户端 |
| `liot_ftp_client_release()` | 释放FTP客户端 |
| `liot_ftp_client_setopt()` | 设置客户端选项 |
| `liot_ftp_client_open()` | 连接FTP服务器 |
| `liot_ftp_client_close()` | 断开FTP服务器 |
| `liot_ftp_client_get_ex()` | 下载文件 |
| `liot_ftp_client_put_ex()` | 上传文件 |
| `liot_ftp_client_delete()` | 删除文件 |
| `liot_ftp_client_pwd()` | 获取当前目录路径 |
| `liot_ftp_client_cwd()` | 变更当前目录路径 |
| `liot_ftp_client_mkdir()` | 新建目录 |
| `liot_ftp_client_rmdir()` | 删除目录 |
| `liot_ftp_client_list()` | 获取目录信息 |
| `liot_ftp_client_size()` | 获取文件大小 |
| `liot_ftp_client_rename()` | 重命名文件 |
| `liot_ftp_client_FileTpye()` | 设置传输文件类型 |

#### 2.3.5 NTP API

| **函数** | **说明** |
| ---- | ---- |
| `liot_ntp_sync()` | 打开 NTP 同步时间的功能 |

#### 2.3.6 PING API

| **函数** | **说明** |
| ---- | ---- |
| `liot_ping_start()` | 启用ping功能 |

#### 2.3.7 LBS API

| **函数** | **说明** |
| ---- | ---- |
| `liot_lbs_get_position()` | 该函数用于请求获取定位信息。 |

#### 2.3.8 WifiScan API

| **函数** | **说明** |
| ---- | ---- |
| `liot_wifiscan_open()` | 启用 Wi-Fi Scan |
| `liot_wifiscan_close()` | 禁用 Wi-Fi Scan |
| `liot_wifiscan_option_set()` | 配置 Wi-Fi Scan 扫描参数 |
| `liot_wifiscan_do()` | 进行 Wi-Fi Scan 同步模式扫描 |
| `liot_wifiscan_register_cb()` | 开始 Wi-Fi Scan 异步模式扫描 |
| `liot_wifiscan_async()` | 注册回调函数 |

#### 2.3.9 FOTA API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_FotaUpgrade()` | 查分升级模组接口 |
| `liot_fota_image_verify()` | 用于校验文件系统中存储的升级包信息，校验后写入fota分区 |
| `liot_fota_clear()` | 用于初始化并清空模块升级区域 |
| `liot_fota_get_result()` | 用于获取 FOTA 升级结果 |
| `liot_fota_power_reset()` | 用于重启模块 |
| `liot_fota_nvm_init()` | 用于初始化并清空模块升级fota分区 |
| `liot_fota_nvm_write()` | 用于将模块文件直接写入fota分区 |
| `liot_fota_nvm_free_size_get()` | 用于获取fota分区大小 |
| `liot_fota_nvm_image_verify()` | 用于校验fota分区中存储的升级包信息 |

#### 2.3.10 APP OTA API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_FotaAppUpgradeCheck()` | 全量升级APP分区升级包检测接口 |

### 2.4 多媒体 API

#### 2.4.1 AUDIO API

| **函数** | **说明** |
| ---- | ---- |
| `Liot_SoundInit()` | 音频初始化接口 |
| `Liot_SoundDeInit()` | 音频去初始化接口。 |
| `Liot_SoundSetVolume()` | 设置音量大小 |
| `Liot_SoundGetVolume()` | 获取音量大小 |
| `Liot_SoundSetMicVolume()` | 设置麦克风音量 |
| `Liot_SoundPlay()` | 播放音频 |
| `Liot_SoundRecord()` | 录制音频 |
| `Liot_SoundPlayPause()` | 播放暂停 |
| `Liot_SoundPlayResume()` | 播放恢复 |
| `Liot_SoundPlayMp3File()` | 播放 MP3 文件 |

#### 2.4.2 TTS API \*

| **函数** | **说明** |
| ---- | ---- |
| `liot_tts_engine_init()` | 初始化 TTS 引擎 |
| `liot_tts_set_config_param()` | 播放 TTS 前设置配置选项 |
| `liot_tts_get_config_param()` | 获取 TTS 的配置选项 |
| `liot_tts_start()` | 开始播放TTS |
| `liot_tts_end()` | TTS 播放完成时释放占用资源 |
| `liot_tts_exit()` | 中断 TTS 播放并退出 TTS |
| `liot_tts_is_running()` | 返回TTS运行状态 |
| `liot_tts_set_resource()` | 设定TTS资源 |
| `liot_utf8_to_gbk_str()` | 将utf8编码字符串转成gbk编码字符串 |

#### 2.4.3 LCD API

| **函数** | **说明** |
| ---- | ---- |
| `liot_lcd_init()` | LCD初始化 |
| `liot_lcd_clear_screen()` | LCD全屏刷新 |
| `liot_lcd_draw_point()` | LCD画点 |
| `liot_lcd_draw_line()` | LCD画线 |
| `liot_lcd_draw_rectangle()` | LCD画矩形 |
| `liot_lcd_draw_circle()` | LCD画圆 |
| `liot_lcd_write()` | LCD显示图片 |
| `liot_lcd_set_brightness()` | LCD设置亮度 |
| `liot_lcd_display_on()` | LCD开启显示 |
| `liot_lcd_display_off()` | LCD关闭显示 |
| `liot_lcd_sleep_in()` | LCD进入休眠 |
| `liot_lcd_sleep_out()` | LCD退出休眠 |

#### 2.4.4 KeyPad API

| **函数** | **说明** |
| ---- | ---- |
| `liot_keypad_init()` | 初始化矩阵键盘 |
| `liot_keypad_state()` | 获取矩阵键盘状态 |

#### 2.4.5 Camera API

| **函数** | **说明** |
| ---- | ---- |
| `liot_CamInit()` | 初始化摄像头功能 |
| `liot_CamDeInit()` | 关闭摄像头功能 |
| `liot_CamCaptureImage()` | 获取一张图片 |
| `liot_CamPreview()` | 打开摄像头在LCD屏幕上预览（暂不支持） |
| `liot_CamStopPreview()` | 打开摄像头在LCD屏幕上预览（暂不支持） |

#### 2.4.6 Decode API

| **函数** | **说明** |
| ---- | ---- |
| `liot_decoder_set_auth_key()` | 设置解码库认证密钥 |
| `liot_get_decoder_version()` | 获取解码库版本信息 |
| `liot_decoder_init()` | 初始化解码库 |
| `liot_destroy_decoder()` | 关闭解码库 |
| `liot_image_decoder()` | 解码照片 |
| `liot_get_decoder_result()` | 获取解码结果 |

#### 2.4.7 Volte API

| **函数** | **说明** |
| ---- | ---- |
| `liot_volte_ims_reg_set()` | IMS注册状态上报 |
| `liot_volte_ims_reg_get()` | IMS注册状态获取 |
| `liot_volte_vdp_set()` | 设置语音域选项 |
| `liot_volte_vdp_get()` | 获取语音域选项 |
| `liot_volte_usage_set()` | 设置模块用途 |
| `liot_volte_usage_get()` | 获取模块用途 |
| `liot_volte_codec_type_set()` | 设置codec类型 |
| `liot_voice_auto_answer()` | 设置自动接听 |
| `liot_voice_call_start()` | 拨打电话 |
| `liot_voice_call_answer()` | 接听电话 |
| `liot_voice_call_end()` | 挂断电话 |
| `liot_voice_call_start_dtmf()` | 发送DTMF |
| `liot_voice_call_clcc()` | 获取当前电话列表 |
| `liot_voice_get_phone_num()` | 获取当前电话号码 |
| `liot_voice_call_callback_register()` | 注册回调函数 |

