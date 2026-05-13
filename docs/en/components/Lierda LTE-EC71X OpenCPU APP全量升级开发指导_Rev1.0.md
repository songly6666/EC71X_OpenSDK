# APPFull UpgradeDevelopment Guide\_Rev1.0

{link_to_translation}`zh_CN:[in文]`

## Document Revision History

| **Version** | **Date** | **Revised By** | **Reviewed By** | **Changes** |
| --- | --- | --- | --- | --- |
| Rev1.0 | 26-02-28 | zlc | ymx | Initial document |

## 1 Introduction

This section mainly introduces customer when using base package separation solution SDK, Full Upgrade user APP partition method, guide customer to quickly output APP image upgrade package, and complete APP partition image upgrade.

Currently through compile mode automatic script generates APP Full Upgrade package, contains fixed format data header, mainly is APP partition FLASH start address, APP complete data, APP MD5 check value.

Default SDK will not output APP Full Upgrade package, needModifiedMakefileinBUILD\_COMP\_OTA\_EN=y openThisafter macro, compile will automatically output APP upgrade package AppOTA.bin, Modified method as shown in following figure.

![](./_images/APPFull Upgrade1.png)

As shown in following figure: AppOTA.bin is APP image OTA upgrade package.

![](./_images/APPFull Upgrade2.png)

APPFull UpgradePrinciple Description

Upgrade execution process is in bootloader stage, This way if exception power loss during upgrade process, System will continue APP upgrade after start, ensure upgrade power loss system does not become bricked.

![](./_images/APPFull Upgrade3.png)

Complete upgrade process

**Description**

| APP stage: mainly download upgrade package to FileSystem, CallLiot\_FotaAppUpgradeCheck()Interfaceperformupgradepackage integrity check. Then reset module. <br>Bootloader stage: Mount FileSystem, If AppOTA.bin upgrade file exists in FileSystem, then start reading image content in upgrade file, Erase and update APP partition. After update ends will continue to start system. <br>Upgrade package need to be placed in FileSystem, Base package will reserve enough space, User does not need to concern. |
| --- |

## 2 API Function Overview

| **Function** | **Description** |
| --- | --- |
| Liot\_FotaAppUpgradeCheck | Full Upgrade APP partition upgrade package detection interface |

## 3 API Function Details

### 3.1 liot\_fota\_errcode\_e

FOTA Error Codes are composed of related component ID and standard error codes, Among them component ID is high 16 bits, Standard error codes are low 16 bits.

1. Declaration


```c
typedef enum{
LIOT_FOTA_UPGRADE_SUCCESS = 0, /*!< Indicates that the FOTA upgrade was successful.*/
LIOT_FOTA_UPGRADE_FAI L = 504 | LIOT_FOTA_ERRCODE_BASE, /*!< General FOTA upgrade failure.*/
LIOT_FOTA_UPGRADE_CHECK_FAI L = 505 | LIOT_FOTA_ERRCODE_BASE, /*!< FOTA upgrade check failed.*/
LIOT_FOTA_UPGRADE_MD5_FAI L = 506 | LIOT_FOTA_ERRCODE_BASE, /*!< MD5 checksum verification of the FOTA package failed.*/
LIOT_FOTA_UPGRADE_MAT CH_FAI L = 507 | LIOT_FOTA_ERRCODE_BASE, /*!< FOTA package does not match the device requirements.*/
LIOT_FOTA_UPGRADE_NO_FILE_FAI L = 508 | LIOT_FOTA_ERRCODE_BASE, /*!< FOTA file not found or missing.*/
LIOT_FOTA_UPGRADE_OPENFILE_FAI L = 509 | LIOT_FOTA_ERRCODE_BASE, /*!< Failed to open the FOTA upgrade file.*/
LIOT_FOTA_UPGRADE_FILESIZE_FAI L = 510 | LIOT_FOTA_ERRCODE_BASE, /*!< Invalid or unsupported FOTA file size.*/
LIOT_FOTA_UPGRADE_LFS_MOUNT_FAI L = 511 | LIOT_FOTA_ERRCODE_BASE, /*!< Failed to mount LittleFS (LFS) for FOTA.*/
LIOT_FOTA_UPGRADE_PARAM_FAI L = 512 | LIOT_FOTA_ERRCODE_BASE, /*!< Invalid input parameters for FOTA upgrade.*/
LIOT_FOTA_UPGRADE_PROJECT_MAT CH_FAI L = 552 | LIOT_FOTA_ERRCODE_BASE, /*!< Project name in FOTA package does not match the device.*/
LIOT_FOTA_UPGRADE_BASELINE_MAT CH_FAI L = 553 | LIOT_FOTA_ERRCODE_BASE, /*!< Baseline version in FOTA package does not match the device.*/
LIOT_FOTA_UPGRADE_POINT_NULL_ERR = 570 | LIOT_FOTA_ERRCODE_BASE, /*!< Null pointer error during FOTA upgrade.*/
LIOT_FOTA_UPGRADE_FLAG_SET_ERR = 571 | LIOT_FOTA_ERRCODE_BASE, /*!< Failed to set the upgrade flag during FOTA.*/
} liot_fota_errcode_e;
```

2. Parameter


| **Parameter** | **Description** |
| --- | --- |
| LIOT\_FOTA\_UPGRADE\_SUCCESS | ExecuteSuccess |
| LIOT\_FOTA\_UPGRADE\_FAI L | ExecuteFailure |
| LIOT\_FOTA\_UPGRADE\_CHECK\_FAI L | FOTA upgrade package check failure |
| LIOT\_FOTA\_UPGRADE\_MD5\_FAI L | FOTA upgrade package MD5 check failure |
| LIOT\_FOTA\_UPGRADE\_MAT CH\_FAI L | FOTA upgrade match file failure |
| LIOT\_FOTA\_UPGRADE\_NO\_FILE\_FAI L | No upgrade package file |
| LIOT\_FOTA\_UPGRADE\_OPENFILE\_FAI L | Open file failure |
| LIOT\_FOTA\_UPGRADE\_FILESIZE\_FAI L | Upgrade package file length exceeds limit |
| LIOT\_FOTA\_UPGRADE\_LFS\_MOUNT\_FAI L | FileSystemLoadFailure |
| LIOT\_FOTA\_UPGRADE\_PARAM\_FAI L | ParameterError |
| LIOT\_FOTA\_UPGRADE\_PROJECT\_MAT CH\_FAI L | Project mismatch |
| LIOT\_FOTA\_UPGRADE\_BASELINE\_MAT CH\_FAI L | Baseline mismatch |
| LIOT\_FOTA\_UPGRADE\_POINT\_NULL\_ERR | Pointer is NULL |
| LIOT\_FOTA\_UPGRADE\_FLAG\_SET\_ERR | Flag bit set error |

### 3.2 Liot\_FotaAppUpgradeCheck

This function is used to check whether APP Full Upgrade package is legal, and after detection completes automatically rename AppOTA.bin. The reason for automatic renaming is , upgradeProcessoccurs inbootloaderstage, willAutomaticMount FileSystem, then indexAppOTA.binFileperformupgrade.

Currently only supports saving upgrade package in FileSystem, External flash mode upgrade is not supported yet. When generating upgrade package, we have internally logged fixed header and APP image MD5 value. ThisFunctionmainly Functionthen is Checkfixed header, and verifyMD5value. upgrade CompleteProcess is inbootloaderinExecute , ifupgradeencounter during processExceptionpower off, after power on still is willContinueupgrade.

**Note**

| * ThisInterfaceCallnotneedNetworkDisconnect<br> <br>* becauseFileonlyneed2Kspace, ThisInterfaceCallnotwillcause watchdogTimeoutetc.Issue<br> <br>* only is memoryRequestFailureafter oneError Codes, userCanaccording toReturn ValueperformExceptionHandle |
| --- |

1. Declaration


```c
liot_fota_errcode_e Liot_FotaAppUpgradeCheck(const char *file_name, BOOL is_reboot);
```

2. Parameter


* file\_name: \[In\] APP upgrade package name.

* is\_reboot: \[In\]  whether to immediately restart for upgrade true: Immediately reset module for APP image upgrade, false: Do not immediately reset, Wait until next reset for APPpartitionupgrade.


3. Return Value


* liot\_fota\_errcode\_e: Execution result codes, canReturnAs followsError Codes.


LIOT\_FOTA\_UPGRADE\_PARAM\_FAI L  ParameterError

LIOT\_FOTA\_UPGRADE\_NO\_FILE\_FAI L  File does not exist

LIOT\_FOTA\_UPGRADE\_OPENFILE\_FAI L Open file or read file failure

LIOT\_FOTA\_UPGRADE\_CHECK\_FAI L upgradepackage headerCheckFailure

LIOT\_FOTA\_UPGRADE\_FAI L underlyingMemory request failure.

LIOT\_FOTA\_UPGRADE\_MD5\_FAI L upgradepackageMD5verifyFailure.

LIOT\_FOTA\_UPGRADE\_SUCCESS  upgradepackage checkSuccess.

## 4 CodeExample

Example code reference LSDK/example/src/demo\_app\_fota.c.

demoloop infixedFilename(upgrade.bin) upgradepackage check,

localTestcanExportModulein FileSystem, and willCompilegenerate AppOTA.binFiletoupgrade.bin name methodAddtoFileSystemin, reflashFileSystemtodevicein, thenResetdevice, SystemwillAutomaticperformThisFile Checkand verifyupgradepackageMD5value, upgradeprocess logcanthroughdebugport to view.

**Note**

| demo SourceCodes specific location atdevelopmentdevelopmentguide alreadyDescription, Thisnot repeating<br>lfsutil.exe please check belowToolConnect<br>demoloop inupgrade.binnotwillhigh frequencyoperation Flash FileSystem, only is CheckFile |
| --- |

1.TestpleaseEnableThisdemo

![](./_images/APPFull Upgrade4.png)

2.Exportwhen FileSystemAddressview method:

![](./_images/APPFull Upgrade5.png)

3.ExportFileafter system willAppOTA.binWriteFileSystem.

Toollink: [please check attachment in DingTalk document"FileSystem read/write Tool"](https://alidocs.dingtalk.com/i/nodes/G53mjyd80p7vr7OLuv4lg7Qo86zbX04v?iframeQuery=anchorId%3DX02mm91i4o8sjqtr6w3ui)

![](./_images/APPFull Upgrade6.png)

4.new FileSystembinflash toSystemin.

![](./_images/APPFull Upgrade7.png)

5.Resetdeviceperform packageCheck.

![](./_images/APPFull Upgrade8.png)

6.debugport log, HintupgradeSuccess.

![](./_images/APPFull Upgrade9.png)

## 5 Common Issues

1, thenTestduring processFileSystem Addressdecide based on base package, please according to actual use base package selection.

2, APPimage hasSizeupper limit, ifCodemore, APPinsufficient space, thenneedcontactFAEfeedback internal base package partition repartition. following figurecancheckCurrentbase package correspondingAPPpartition upper limitSize.

![](./_images/APPFull Upgrade10.png)

3, then create package ensures whenAPPimageSize upper limit, exceedswillearly warning

4. temporarily notSupportrollbackmechanism