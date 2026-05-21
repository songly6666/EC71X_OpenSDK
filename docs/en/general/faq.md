# SDK Feedback Guide_Rev1.0

{link_to_translation}`zh_CN:[Chinese]`

## 1 Revision History

| Version | Date | Author | Changes |
| ---- | ---- | ---- | ---- |
| Rev1.0 | 2026-04-22 | MBB | Created document |

## 2 Introduction

This document describes how to report issues when using the Lierda LTE-EC71X OpenCPU SDK. We welcome your feedback.

## 3 Project Overview

Lierda LTE-EC71X OpenCPU SDK is an OpenCPU development kit for the EC71X module series. The SDK allows developers to run custom applications directly on the module without an external MCU.

Key features:

| Feature | Description |
| ---- | ---- |
| Supported chips | F6B_A, F6D_A, F7B_A, K2B_A, K2F_A, etc. |
| OS | FreeRTOS real-time operating system |
| API standard | CMSIS-RTOS2 standard API |
| Middleware | MQTT, HTTP, LwIP, mbedTLS, LittleFS, etc. |
| Toolchains | GCC, Keil |
| System interfaces | Filesystem, GPIO, UART, low-power management, etc. |

## 4 Issue Reporting

### 4.1 Types of Feedback

| Type | Description | Example |
| ---- | ---- | ---- |
| Bug report | Functional exception, crash, error | Build failure, runtime crash, unexpected behavior |
| Feature request | New feature or improvement | Request support for protocol X, optimize interface Y |
| Documentation issue | Errors, omissions, unclear explanations | Incorrect API doc, missing usage example |
| Usage question | Questions during usage | How to implement feature X, meaning of parameter Y |

### 4.2 Report Template

Please use the following template when submitting an issue:

1. **Issue Type**
   Bug report / Feature request / Documentation issue / Usage question (choose one)
2. **Description**
   Clearly describe the observed problem
3. **Environment**
   SDK version:
   Chip model: F6B_A/F6D_A/F7B_A/K2B_A/K2F_A (choose one or more)
   Toolchain version:
   Operating system:
4. **Reproduction steps**
   Detailed steps to reproduce
5. **Logs**
   Build logs or runtime logs
6. **Expected behavior**
   Describe the expected correct behavior

### 4.3 Additional Notes for Feature Requests

When submitting feature requests, please additionally provide:

- Use-case scenarios
- Expected implementation approach
- Compatibility considerations with other features

## 5 Contact

| Channel | Description |
| ---- | ---- |
| Issue tracker | https://github.com/orgs/lierda-iot/repositories |
| Technical discussion | Scan the QR code below to join the discussion group |
| Email | yumx@lierda.com, liangj@lierda.com |

<div align="center">

<img src="_images/SDK_issue_feedback/image_1.png" width="600"/>

</div>

## 6 Acknowledgements

Thanks to all contributors to this project.
