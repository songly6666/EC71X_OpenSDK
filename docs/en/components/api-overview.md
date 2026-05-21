# API Overview_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## Document Revision History

| **Document Version** | **Revision Date** | **Revised By** | **Reviewed By** | **Changes** |
| ---- | ---- | ---- | ---- | ---- |
| Rev1.0 | 26-03-13 | zlc |  | Initial release |

## 1 Introduction

This chapter mainly introduces the Lierda LTE-EC71X OPENCPU base package separated API list of self-developed functions supported by Lierda. Other platform support is not covered in this document. This document serves as a reference for customers when developing features.

## 2 API Function Description

### 2.1 Basic Information APIs

#### 2.1.1 Dev API 

| **Function** | **Description** |
| ---- | ---- |
| `liot_dev_get_imei()` | Get device IMEI number |
| `liot_dev_get_firmware_version()` | Get device firmware version |
| `liot_dev_get_sn()` | Get device serial number |
| `liot_dev_get_product_id()` | Get device manufacturer ID |
| `liot_dev_get_firmware_subversion()` | Get device sub-firmware version |
| `liot_dev_get_model()` | Get device model |
| `liot_dev_set_modem_fun()` | Set device modem function |
| `liot_dev_get_modem_fun()` | Get device modem function |
| `liot_dev_memory_size_query()` | Query heap space status information |
| `liot_dev_cfg_wdt()` | Configure watchdog (timer) switch |
| `liot_dev_feed_wdt()` | Feed system watchdog (reset timer to zero) |
| `Liot_DevGetHardWareInfo()` | Get hardware model |
| `Liot_DevSetBandMode()` | Set available frequency bands |
| `Liot_DevGetBandMode()` | Query available bands and supported band list |
| `Liot_DevFreqConfig()` | Lock frequency point, cell and clear priority frequency points |
| `Liot_RRCRelease()` | Enable fast release |
| `Liot_DevSetDnsServersAddr()` | Set primary and backup DNS server addresses |
| `Liot_DevGetDnsServersAddr()` | Query primary and backup DNS server addresses |

#### 2.1.2 datacall API

| **Function** | **Description** |
| ---- | ---- |
| `liot_network_register_cereg_get()` | Get network registration status |
| `Liot_DataCallCfgDefaultEpsBearer()` | Set or query default bearer (CID 1) APN and IP type |
| `Liot_PsEventCb()` | Register system event notification callback |

#### 2.1.3 SIM API

| **Function** | **Description** |
| ---- | ---- |
| `liot_sim_get_imsi()` | Get SIM card IMSI |
| `liot_sim_get_iccid()` | Get SIM card ICCID |
| `liot_sim_get_phonenumber()` | Get SIM card phone number |
| `liot_sim_get_card_status()` | Get SIM card cached status information |

#### 2.1.4 NW API

| **Function** | **Description** |
| ---- | ---- |
| `liot_nw_get_csq()` | Query CSQ signal strength information |
| `liot_nw_get_operator_name()` | Get current registered network operator information |
| `liot_nw_get_reg_status()` | Get current network registration information |
| `liot_nw_set_selection()` | Set operator |
| `liot_nw_get_selection()` | Get selected operator information |
| `liot_nw_get_signal_strength()` | Get detailed signal strength information |
| `liot_nw_get_nitz_time_info()` | Get current base station time |
| `liot_nw_get_cell_info()` | Get current serving and neighboring cell information |
| `liot_nw_register_cb()` | Register event callback function |
| `liot_nw_get_data_count()` | Get uplink and downlink data count |
| `liot_nw_reset_data_count()` | Reset uplink and downlink data count |
| `liot_nw_set_ctzu_switch()` | Set base station time synchronization switch |
| `liot_nw_get_ctzu_switch()` | Get base station time synchronization switch status |

#### 2.1.5 SMS API

| **Function** | **Description** |
| ---- | ---- |
| `liot_sms_send_msg()` | Send text format short message |
| `liot_sms_send_pdu()` | Send PDU format short message |
| `liot_sms_read_msg_list()` | Get short message list |
| `liot_sms_read_msg_ex()` | Read single short message |
| `liot_sms_delete_msg_ex()` | Delete single message |
| `liot_sms_get_center_address()` | Get short message center number |
| `liot_sms_set_center_address()` | Set short message center number |
| `liot_sms_get_storage_info()` | Get SM and ME storage information |
| `liot_sms_set_storage()` | Set SMS storage location |
| `liot_sms_get_storage()` | Get SMS storage location |

#### 2.1.6 Custom AT API

| **Function** | **Description** |
| ---- | ---- |
| `liot_open_atcmd_init()` | This function is used to open AT functionality |
| `liot_atcmd_register()` | This function is used to register AT command table |
| `liot_atcmd_reply()` | This interface is for AT command response |

### 2.2 Driver API List

#### 2.2.1 OS API

##### 2.2.1.1 Tasks

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_task_create()` | Create task |
| `liot_rtos_task_delete()` | Delete task |
| `liot_rtos_task_yield()` | Release CPU usage rights |
| `liot_rtos_task_get_current_ref()` | Get current task handle |
| `liot_rtos_task_change_priority()` | Change task priority |
| `liot_rtos_task_get_status()` | Get task status information |
| `liot_rtos_task_sleep_ms()` | Set task sleep time in milliseconds |
| `liot_rtos_task_sleep_s()` | Set task sleep time in seconds |
| `liot_rtos_task_get_stack_space()` | Get task stack free space |
| `liot_rtos_task_suspend()` | Suspend task |
| `liot_rtos_task_resume()` | Resume suspended task, restore to schedulable running state |
| `liot_rtos_get_running_time()` | Get RTOS system clock ticks converted to time, unit: ms |
| `liot_rtos_get_system_tick()` | Get RTOS system clock ticks |
| `liot_xPortGetTotalHeapSize()` | Get total size of FreeRTOS heap |
| `liot_xPortGetFreeHeapSize()` | Get free size of FreeRTOS heap |
| `liot_xPortGetMinimumEverFreeHeapSize()` | Get minimum free size of FreeRTOS heap during runtime |
| `liot_xPortGetMaximumFreeBlockSize()` | Get maximum allocatable memory block size of FreeRTOS |
| `liot_psram_xPortGetTotalHeapSize()` | Get total size of PSRAM |
| `liot_psram_xPortGetFreeHeapSize()` | Get free size of PSRAM |
| `liot_psram_xPortGetMinimumEverFreeHeapSize()` | Get minimum free size of PSRAM during runtime |
| `liot_psram_xPortGetMaximumFreeBlockSize()` | Get maximum allocatable memory block size of PSRAM during runtime |
| `liot_rtos_is_alive()` | Check if task is in running state |
| `liot_rtos_task_create_static()` | Create task using static method |

##### 2.2.1.2 Critical Sections

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_enter_critical()` | Enter critical section |
| `liot_rtos_enter_critical_from_isr()` | Enter critical section from interrupt |
| `liot_rtos_exit_critical()` | Exit critical section |
| `liot_rtos_exit_critical_from_isr()` | Exit critical section from interrupt |

##### 2.2.1.3 Semaphores

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_semaphore_create()` | Create semaphore |
| `liot_rtos_semaphore_create_ex()` | Create semaphore (extended) |
| `liot_rtos_semaphore_wait()` | Set semaphore wait time |
| `liot_rtos_semaphore_release()` | Release semaphore |
| `liot_rtos_semaphore_get_cnt()` | Get semaphore count value |
| `liot_rtos_semaphore_delete()` | Delete semaphore |

##### 2.2.1.4 Mutexes

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_mutex_create()` | Create mutex |
| `liot_rtos_mutex_lock()` | Acquire mutex, wait time can be customized according to requirements |
| `liot_rtos_mutex_try_lock()` | Try to acquire mutex, wait time is permanent |
| `liot_rtos_mutex_unlock()` | Release mutex |
| `liot_rtos_mutex_delete()` | Delete mutex |

##### 2.2.1.5 Message Queues

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_queue_create()` | Create message queue |
| `liot_rtos_queue_wait()` | Wait for message in queue |
| `liot_rtos_queue_release()` | Release message queue |
| `liot_rtos_queue_get_cnt()` | Get number of messages in queue |
| `liot_rtos_queue_delete()` | Delete message queue |
| `liot_rtos_queue_reset()` | Reset elements in queue and change queue length |
| `liot_rtos_queue_get_space()` | Query available space count in queue |

##### 2.2.1.6 Timers

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_timer_create()` | Create timer |
| `liot_rtos_timer_start()` | Start timer |
| `liot_rtos_timer_is_running()` | Check if timer is running |
| `liot_rtos_timer_stop()` | Stop timer |
| `liot_rtos_timer_delete()` | Delete timer |
| `liot_rtos_timer_stop_isr()` | Stop timer in interrupt |

##### 2.2.1.7 Event Groups

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_flag_create()` | Create event group |
| `liot_rtos_flag_get()` | Get current bit status of event group |
| `liot_rtos_flag_wait()` | Wait for event group bits to meet specified conditions |
| `liot_rtos_flag_release()` | Set event bits in event group |
| `liot_rtos_flag_clear()` | Clear event bits in event group |
| `liot_rtos_flag_delete()` | Delete event group |

##### 2.2.1.8 PSRAM API

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_psram_malloc()` | Allocate memory from PSRAM |
| `liot_rtos_psram_free()` | Free memory allocated from PSRAM |
| `liot_rtos_psram_realloc()` | Resize the memory block previously allocated by `liot_rtos_psram_malloc()` |
| `liot_psram_xPortGetTotalHeapSize()` | Get total HEAP size of PSRAM |
| `liot_psram_xPortGetFreeHeapSize()` | Get remaining available memory size of PSRAM |

##### 2.2.1.9 Others

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtos_malloc()` | Dynamically allocate memory |
| `liot_rtos_calloc()` | Allocate memory and initialize to 0 |
| `liot_rtos_free()` | Free dynamically allocated memory |
| `liot_rtos_realloc()` | Reallocate memory |
| `liot_true_rand()` | Hardware random number |

#### 2.2.2 UART API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_UartInit()` | UART initialization interface |
| `Liot_UartDeinit()` | UART de-initialization interface |
| `Liot_UartSend()` | UART send interface |

#### 2.2.3 USB API

| **Function** | **Description** |
| ---- | ---- |
| `liot_usb_bind_hotplug_cb()` | Register USB event callback function |
| `liot_usb_get_hotplug_state()` | Get USB hot-plug state |
| `liot_usb_drv_is_enabled()` | Get USB initialization state |
| `liot_usb_drv_enable()` | Initialize USB driver |
| `liot_usb_drv_disable()` | De-initialize USB driver |

#### 2.2.4 ADC API

| **Function** | **Description** |
| ---- | ---- |
| `liot_adc_get_volt_raw()` | Read analog voltage raw data from ADC channel |

#### 2.2.5 GPIO API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_GpioInit()` | GPIO initialization interface |
| `Liot_GpioGetLevel()` | GPIO get level interface |
| `Liot_GpioSetLevel()` | GPIO set level |
| `Liot_GpioIntEnable()` | Enable general GPIO interrupt source |
| `Liot_GpioIntDisable()` | Disable general GPIO interrupt source |
| `Liot_AonPowerCtl()` | Control AGPIO power domain switch |
| `Liot_SetVoltage()` | Set power domain voltage |
| `Liot_SetPinFunc()` | Set module pin multiplexing function |
| `Liot_GetPinFunc()` | Get module pin multiplexing function |
| `Liot_WakeupIntInit()` | Initialize wakeup pin interrupt |
| `Liot_WakeupIntDeinit()` | De-initialize wakeup pin interrupt |
| `Liot_WakeupPadGetLevel()` | Get wakeup pin level |

#### 2.2.6 PWM API

| **Function** | **Description** |
| ---- | ---- |
| `liot_pwm_open()` | Open PWM function |
| `liot_pwm_close()` | Close PWM function |
| `liot_pwm_enable()` | Enable PWM and configure PWM pulse period and duty cycle |
| `liot_pwm_disable()` | Disable PWM function |
| `liot_pwm_set_duty_cycle()` | Set PWM duty cycle |

#### 2.2.7 APWM API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_ApwmCfg()` | Configure APWM function |
| `Liot_ApwmEnable()` | Enable APWM function |

#### 2.2.8 I2C API

| **Function** | **Description** |
| ---- | ---- |
| `liot_I2cInit()` | Initialize I2C bus |
| `liot_I2cRelease()` | Release I2C bus |
| `liot_I2cWrite()` | Write data to I2C bus, slave device register address length is 8 bits |
| `liot_I2cRead()` | Read data from I2C bus, slave device register address length is 8 bits |
| `liot_I2cWrite_16bit_addr()` | Write data to I2C bus, slave device register address length is 16 bits |
| `liot_I2cRead_16bit_addr()` | Read data from I2C bus, slave device register address length is 16 bits |

#### 2.2.9 FLASH API

| **Function** | **Description** |
| ---- | ---- |
| `liot_flash_erase()` | Erase data in flash |
| `liot_flash_read()` | Read data from flash |
| `liot_flash_write()` | Write data to flash |

#### 2.2.10 RTC API

| **Function** | **Description** |
| ---- | ---- |
| `liot_rtc_set_time()` | Set RTC time |
| `liot_rtc_get_time()` | Get RTC time |
| `liot_rtc_get_time_s()` | Get RTC time converted to seconds |
| `liot_rtc_get_localtime()` | Get local RTC time |
| `liot_rtc_set_timezone()` | Set timezone, in units of 15 minutes |
| `liot_rtc_get_timezone()` | Get timezone, in units of 15 minutes |
| `liot_rtc_print_time()` | Print RTC time |
| `liot_rtc_set_alarm()` | Set RTC alarm time |
| `liot_rtc_get_alarm()` | Get RTC alarm time |
| `liot_rtc_enable_alarm()` | Enable and disable RTC alarm |
| `liot_rtc_register_cb()` | Register RTC alarm callback function |
| `Liot_GetTimestamp()` | Get RTC time converted to milliseconds |

#### 2.2.11 FS API

| **Function** | **Description** |
| ---- | ---- |
| `liot_fopen()` | Open a file based on file path or filename |
| `liot_fclose()` | Close an opened file |
| `liot_remove()` | Delete a file |
| `liot_fread()` | Read file content |
| `liot_fwrite()` | Write content to file |
| `liot_fseek()` | Set file pointer position |
| `liot_frewind()` | Set file position pointer to the beginning of the file |
| `liot_ftell()` | Get current file pointer position |
| `liot_fstat()` | Get file status based on file descriptor |
| `liot_stat()` | Get file information based on filename |
| `liot_ftruncate()` | Truncate file to specified length |
| `liot_fsize()` | Get file size |
| `liot_file_exist()` | Check if file exists based on filename |
| `liot_mkdir()` | Create a directory |
| `liot_opendir()` | Open a directory |
| `liot_closedir()` | Close an opened directory |
| `liot_readdir()` | Get directory information |
| `liot_rename()` | Rename directory |
| `liot_fsync()` | Synchronize file data |
| `liot_internal_fs_free_size_get()` | Get remaining filesystem size |

#### 2.2.12 NV API

| **Function** | **Description** |
| ---- | ---- |
| `liot_nvm_fwrite()` | Write simple configuration file |
| `liot_nvm_fread()` | Read simple configuration file |
| `liot_cust_nvm_fwrite()` | Write user-defined simple configuration file |
| `liot_cust_nvm_fread()` | Read user-defined simple configuration file |

#### 2.2.13 Low Power Related

| **Function** | **Description** |
| ---- | ---- |
| `Liot_SleepSetMode()` | Set power mode |
| `Liot_SleepTimerStart()` | Start low power timer |
| `Liot_SleepTimerStop()` | Stop low power timer |
| `Liot_SleepTimerCheck()` | Check if low power timer is running |
| `Liot_SleepTimerGetID()` | Get low power ID that woke up the system |

#### 2.2.14 PowerKey API

| **Function** | **Description** |
| ---- | ---- |
| `liot_power_down()` | Module shutdown |
| `liot_power_reset()` | Module reset |
| `liot_get_pwrkey_status()` | Get pwrkey level status |
| `liot_pwrkey_callback_register()` | Register pwrkey interrupt callback |
| `liot_pwrkey_shutdown_time_set()` | Set pwrkey shutdown timeout time |
| `liot_get_powerup_reason()` | Get reset reason |
| `liot_set_pwrkey_pull()` | Set pwrkey pull-up/pull-down |
| `liot_set_pwrkey_Init()` | Set pwrkey initialization state |

#### 2.2.15 GNSS API

| **Function** | **Description** |
| ---- | ---- |
| `liot_gnss_config()` | Configure GNSS module parameters |
| `liot_agnss_config()` | Configure A-GNSS function parameters |
| `liot_gnss_open()` | Open GNSS module |
| `liot_gnss_close()` | Close GNSS module |
| `liot_gnss_get_location()` | Get location information |
| `liot_gnss_get_nmea()` | Get NMEA sentences |
| `liot_gnss_close_backup_power()` | Close GNSS chip backup power |

#### 2.2.16 SPI API

| **Function** | **Description** |
| ---- | ---- |
| `liot_spi_init()` | This function is used to initialize SPI |
| `liot_spi_init_ext()` | This function is used to initialize SPI (configure SPI bus parameters) |
| `liot_spi_write_read()` | This function is used to simultaneously send and receive data via SPI |
| `liot_spi_read()` | This function is used to receive data via SPI |
| `liot_spi_write()` | This function is used to send data via SPI |
| `liot_spi_release()` | This function is used to release SPI bus |

### 2.3 Application Protocol APIs

#### 2.3.1 HTTP API

| **Function** | **Description** |
| ---- | ---- |
| `liot_httpc_new()` | Create a new HTTP client handle and initialize HTTP client resources |
| `liot_httpc_perform()` | Send HTTP request |
| `liot_httpc_stop()` | Stop HTTP request |
| `liot_httpc_release()` | Release HTTP client resources |
| `liot_httpc_setopt()` | Configure HTTP client properties |
| `liot_httpc_getinfo()` | Get HTTP message header information |
| `liot_httpc_formadd()` | Configure HTTP form properties |
| `liot_httpc_is_running()` | Check if HTTP client is in running state |
| `liot_httpc_url_parse()` | Parse URL |

#### 2.3.2 SSL API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_SSLSetCfg()` | Configure SSL related parameters |
| `Liot_SSLSocketOpen()` | Create SSL connection |
| `Liot_SSLSocketSend()` | Send data |
| `Liot_SSLSocketGetStatus()` | Query SSL connection status |
| `Liot_SSLSocketClose()` | Close SSL connection |

#### 2.3.3 MQTT API

| **Function** | **Description** |
| ---- | ---- |
| `liot_mqtt_client_init_ex()` | Initialize MQTT client resources and create a new MQTT client handle |
| `liot_mqtt_connect()` | Configure MQTT context and establish connection with server |
| `liot_mqtt_publish()` | Publish message to specified topic |
| `liot_mqtt_sub_unsub()` | Subscribe/unsubscribe topic |
| `liot_mqtt_disconnect()` | Disconnect |
| `liot_mqtt_set_inpub_callback()` | Set callback function for receiving messages published by server |
| `liot_mqtt_client_is_connected()` | Query MQTT connection status |
| `liot_mqtt_client_deinit()` | Release MQTT client resources |
| `liot_mqtt_pingreq()` | Send ping message |
| `liot_onenet_generate_auth_token()` | Get OneNET platform token |

#### 2.3.4 FTP API

| **Function** | **Description** |
| ---- | ---- |
| `liot_ftp_client_new()` | Create FTP client |
| `liot_ftp_client_release()` | Release FTP client |
| `liot_ftp_client_setopt()` | Set client options |
| `liot_ftp_client_open()` | Connect to FTP server |
| `liot_ftp_client_close()` | Disconnect from FTP server |
| `liot_ftp_client_get_ex()` | Download file |
| `liot_ftp_client_put_ex()` | Upload file |
| `liot_ftp_client_delete()` | Delete file |
| `liot_ftp_client_pwd()` | Get current directory path |
| `liot_ftp_client_cwd()` | Change current directory path |
| `liot_ftp_client_mkdir()` | Create new directory |
| `liot_ftp_client_rmdir()` | Delete directory |
| `liot_ftp_client_list()` | Get directory information |
| `liot_ftp_client_size()` | Get file size |
| `liot_ftp_client_rename()` | Rename file |
| `liot_ftp_client_FileTpye()` | Set transfer file type |

#### 2.3.5 NTP API

| **Function** | **Description** |
| ---- | ---- |
| `liot_ntp_sync()` | Open NTP time synchronization function |

#### 2.3.6 PING API

| **Function** | **Description** |
| ---- | ---- |
| `liot_ping_start()` | Enable ping function |

#### 2.3.7 LBS API

| **Function** | **Description** |
| ---- | ---- |
| `liot_lbs_get_position()` | This function is used to request location information |

#### 2.3.8 WifiScan API

| **Function** | **Description** |
| ---- | ---- |
| `liot_wifiscan_open()` | Enable Wi-Fi Scan |
| `liot_wifiscan_close()` | Disable Wi-Fi Scan |
| `liot_wifiscan_option_set()` | Configure Wi-Fi Scan scan parameters |
| `liot_wifiscan_do()` | Perform Wi-Fi Scan synchronous mode scanning |
| `liot_wifiscan_register_cb()` | Start Wi-Fi Scan asynchronous mode scanning |
| `liot_wifiscan_async()` | Register callback function |

#### 2.3.9 FOTA API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_FotaUpgrade()` | Differential upgrade module interface |
| `liot_fota_image_verify()` | Verify upgrade package information stored in filesystem, write to FOTA partition after verification |
| `liot_fota_clear()` | Initialize and clear module upgrade area |
| `liot_fota_get_result()` | Get FOTA upgrade result |
| `liot_fota_power_reset()` | Restart module |
| `liot_fota_nvm_init()` | Initialize and clear module upgrade FOTA partition |
| `liot_fota_nvm_write()` | Write module file directly to FOTA partition |
| `liot_fota_nvm_free_size_get()` | Get FOTA partition size |
| `liot_fota_nvm_image_verify()` | Verify upgrade package information stored in FOTA partition |

#### 2.3.10 APP OTA API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_FotaAppUpgradeCheck()` | Full upgrade APP partition upgrade package detection interface |

### 2.4 Multimedia APIs

#### 2.4.1 AUDIO API

| **Function** | **Description** |
| ---- | ---- |
| `Liot_SoundInit()` | Audio initialization interface |
| `Liot_SoundDeInit()` | Audio de-initialization interface |
| `Liot_SoundSetVolume()` | Set volume level |
| `Liot_SoundGetVolume()` | Get volume level |
| `Liot_SoundSetMicVolume()` | Set microphone volume |
| `Liot_SoundPlay()` | Play audio |
| `Liot_SoundRecord()` | Record audio |
| `Liot_SoundPlayPause()` | Pause playback |
| `Liot_SoundPlayResume()` | Resume playback |
| `Liot_SoundPlayMp3File()` | Play MP3 file |

#### 2.4.2 TTS API \*

| **Function** | **Description** |
| ---- | ---- |
| `liot_tts_engine_init()` | Initialize TTS engine |
| `liot_tts_set_config_param()` | Set configuration options before playing TTS |
| `liot_tts_get_config_param()` | Get TTS configuration options |
| `liot_tts_start()` | Start playing TTS |
| `liot_tts_end()` | Release occupied resources when TTS playback is complete |
| `liot_tts_exit()` | Interrupt TTS playback and exit TTS |
| `liot_tts_is_running()` | Return TTS running status |
| `liot_tts_set_resource()` | Set TTS resources |
| `liot_utf8_to_gbk_str()` | Convert UTF-8 encoded string to GBK encoded string |

#### 2.4.3 LCD API

| **Function** | **Description** |
| ---- | ---- |
| `liot_lcd_init()` | LCD initialization |
| `liot_lcd_clear_screen()` | LCD full screen refresh |
| `liot_lcd_draw_point()` | LCD draw point |
| `liot_lcd_draw_line()` | LCD draw line |
| `liot_lcd_draw_rectangle()` | LCD draw rectangle |
| `liot_lcd_draw_circle()` | LCD draw circle |
| `liot_lcd_write()` | LCD display image |
| `liot_lcd_set_brightness()` | LCD set brightness |
| `liot_lcd_display_on()` | LCD enable display |
| `liot_lcd_display_off()` | LCD disable display |
| `liot_lcd_sleep_in()` | LCD enter sleep mode |
| `liot_lcd_sleep_out()` | LCD exit sleep mode |

#### 2.4.4 KeyPad API

| **Function** | **Description** |
| ---- | ---- |
| `liot_keypad_init()` | Initialize matrix keyboard |
| `liot_keypad_state()` | Get matrix keyboard status |

#### 2.4.5 Camera API

| **Function** | **Description** |
| ---- | ---- |
| `liot_CamInit()` | Initialize camera function |
| `liot_CamDeInit()` | Close camera function |
| `liot_CamCaptureImage()` | Capture one image |
| `liot_CamPreview()` | Open camera for preview on LCD screen (not currently supported) |
| `liot_CamStopPreview()` | Stop camera preview on LCD screen (not currently supported) |

#### 2.4.6 Decode API

| **Function** | **Description** |
| ---- | ---- |
| `liot_decoder_set_auth_key()` | Set decoder library authentication key |
| `liot_get_decoder_version()` | Get decoder library version information |
| `liot_decoder_init()` | Initialize decoder library |
| `liot_destroy_decoder()` | Close decoder library |
| `liot_image_decoder()` | Decode photo |
| `liot_get_decoder_result()` | Get decode result |

#### 2.4.7 VoLTE API

| **Function** | **Description** |
| ---- | ---- |
| `liot_volte_ims_reg_set()` | IMS registration status report |
| `liot_volte_ims_reg_get()` | IMS registration status get |
| `liot_volte_vdp_set()` | Set voice domain options |
| `liot_volte_vdp_get()` | Get voice domain options |
| `liot_volte_usage_set()` | Set module usage |
| `liot_volte_usage_get()` | Get module usage |
| `liot_volte_codec_type_set()` | Set codec type |
| `liot_voice_auto_answer()` | Set auto answer |
| `liot_voice_call_start()` | Make phone call |
| `liot_voice_call_answer()` | Answer phone call |
| `liot_voice_call_end()` | Hang up phone call |
| `liot_voice_call_start_dtmf()` | Send DTMF |
| `liot_voice_call_clcc()` | Get current call list |
| `liot_voice_get_phone_num()` | Get current phone number |
| `liot_voice_call_callback_register()` | Register callback function |
