# RTOS 开发指导_Rev1.0

{link_to_translation}`en:[English]`

## 修订记录

| 版本 | 日期 | 作者 | 修订内容 |
| ---- | ---- | ---- | ---- |
| Rev1.0 | 23-09-12 | CLY | 创建文档 |
| Rev1.1 | 24-03-25 | sxx | 更改文档名称 |
| Rev1.2 | 24-10-08 | ymx | 优化文档结构增加liot_rtos_task_delete()参数NULL说明删除最后章节完整Demo代码示例 |
| Rev1.3 | 24-12-12 | ymx | 取消所有函数链接，解决钉钉链接飞书问题 |
| Rev1.4 | 26-01-27 | ljz | 新增接口liot_rtos_calloc() |
| Rev1.5 | 26-04-22 | mbb | 重新排版，增加平台RTOS架构说明、RTOS的核心概、demo示例、快速上手指南 |

## 1 引言

本文档介绍 LTE-EC71X RTOS信息接口 API 情况， API 接口位于LSDK\components\kernel\lierda_api\liot_os\liot_os.h文件声明。

### 1.1 RTOS 核心架构

#### 1.1.1 总体架构概览

RTOS 软件栈采用分层设计，自下而上依次为硬件适配层、内核层、抽象封装层，各层职责清晰，兼顾了底层硬件的极致性能与上层应用的开发效率。

```plaintext
┌─────────────────────────────────────────────────────────┐
│                    应用层 (Application)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  业务任务 1  │  │  业务任务 2  │  │    业务任务 N    │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│          Lierda 应用抽象层 (liot_os / OSAL)              │
│     (屏蔽底层差异，提供类型安全、易用的标准化 API)           │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│           移芯平台适配层 (BSP 修改版 FreeRTOS)             │
│      (基于 Kernel V9.0.0a，针对 EC Cat.1 硬件深度定制)     │
└─────────────────────────────────────────────────────────┘
```

#### 1.1.2 两层架构详解

##### 1.1.2.1 平台适配层：FreeRTOS 内核定制

* 位置：PLAT/os/freertos/ 目录
* 基线版本：FreeRTOS Kernel V9.0.0a
* 定制目标：深度适配移芯 EC CAT1 系列芯片的硬件特性及系统资源约束。

主要修改内容：

* 内存管理子系统增强：

集成内存调试钩子，支持堆内存泄漏检测与越界监控。实现标准 TLSF 算法，专用于外部 RAM 的高效动态管理。针对EC718PM 型号的 PSRAM 特性进行定制优化，扩展可用内存空间，并集成异常处理流程。

* 调试与可观测性支持：

集成统一调试日志接口，提供 CMSIS-RTOS v2 兼容层，便于生态工具链集成。

* 平台硬件抽象定义：

定义平台特定配置宏及内存布局，预留多核架构支持接口。

##### 1.1.2.2 应用抽象层：Lierda封装接口

* 位置：PLAT\middleware\lierda_open\lierda_api\liot_os\目录
* 设计目标：为终端开发者提供一套标准化、类型安全且易于集成的操作系统抽象层。

核心特性：

* 接口契约简化：减少必填参数，定义统一错误码返回机制。
* 强类型约束：引入不透明句柄类型（如 liot_task_t），防止直接操作内核数据结构。
* 文档规范化：遵循 Doxygen 注释规范，提供详尽的中文说明及用例。
* 平台无关性：封装底层调用细节，提升跨平台移植效率。

##### 1.1.2.3 两层架构和原生的FreeRTOS对比分析

| 维度 | 原生 FreeRTOS 接口 | 移芯硬件适配层 (BSP) | 移芯应用抽象层 (Lierda OSAL) |
| ---- | ---- | ---- | ---- |
| 抽象层级 | 内核级 | 板级支持包 | 应用框架层 |
| 使用复杂度 | 较高 | 中等 | 较低 |
| 配置灵活性 | 极高 | 中等（受限于硬件特性） | 较低（聚焦应用逻辑） |
| 易用性与安全性 | 较低（需深入理解内核） | 中等（需了解内存映射） | 较高（强类型与默认参数保护） |
| 典型适用场景 | 内核开发、极致调优 | 驱动移植、板级管理 | 业务逻辑开发、快速原型验证 |

### 1.2 RTOS 核心概念

RTOS是嵌入式系统的实时操作系统内核，本模组基于FreeRTOS封装实现，核心概念如下：

#### 1.2.1 任务调度机制

任务是 RTOS 的基本执行单元，所有用户业务代码均应在任务中运行，核心调度规则如下：

* **抢占式优先级调度：**高优先级任务一旦就绪，立即抢占当前正在运行的低优先级任务的 CPU 使用权。
* **同优先级时间片轮转：**同优先级任务之间采用时间片轮询调度，时间片粒度为 1 ms。中断触发调度：中断服务程序（ISR）执行完毕后，若唤醒了更高优先级任务，则立即触发上下文切换。
* **API 触发调度**：调用liot_rtos_task_yield()（主动让出）、liot_rtos_task_sleep_ms()/liot_rtos_task_sleep_s()（休眠）等 API 时会触发调度器重新选择最高优先级就绪任务执行。
* **任务优先级限制：**若任务涉及音频相关操作，其优先级不得超过 23；不涉及音频相关操作，其优先级不得超过 25。禁止在 ISR 中执行复杂业务逻辑，避免阻塞系统。

#### 1.2.2 阻塞型 API 与非阻塞型 API

| 类型 | 特征 | 典型 API | 使用场景 |
| ---- | ---- | ---- | ---- |
| 阻塞型 | 若条件不满足，任务会挂起等待，直到条件满足或超时 | liot_rtos_semaphore_wait(..., timeout)、liot_rtos_mutex_lock(..., timeout)、liot_rtos_queue_wait(..., timeout)、liot_rtos_flag_wait(..., timeout)、liot_rtos_task_sleep_ms() | 任务间同步、数据接收、定时休眠 |
| 非阻塞型 | 若条件不满足，立即返回错误码，任务继续执行 | liot_rtos_semaphore_wait(...,LIOT_NO_WAIT)、liot_rtos_mutex_lock(..., LIOT_NO_WAIT)、liot_rtos_semaphore_get_cnt()、liot_rtos_flag_get() | 轮询检查状态、快速判断资源是否可用 |

#### 1.2.3 进程间通信机制与选择原则

1. **信号量 (Semaphore)**

**主要功能：**同步与计数。

**场景：**

* 二值信号量：用于任务间的"通知"或"触发"。例如：中断服务程序（ISR）发出信号，告知某个处理任务数据已就绪。
* 计数信号量：用于管理多个共享资源。例如：限制同时访问某个硬件外设的任务数量。

2. **互斥锁 (Mutex)**
   
   **主要功能**：资源保护与互斥访问。
   
   **场景：**用于确保在同一时刻只有一个任务能访问共享资源（如全局变量、串口打印、I2C 总线）。
   
   **特性：**相比信号量，互斥锁拥有优先级继承机制，能有效防止 RTOS 中的"优先级反转"风险。
3. **消息队列 (Message Queue)**
   
   **主要功能：**数据传递。
   
   **场景：**当一个任务需要将具体数据（而不只是一个信号）发送给另一个任务时使用。它支持异步通信，任务可以将消息存入队列后继续执行，而不需要等待接收方立即处理。
4. **事件组 (Flag)**

**主要功能：**多事件逻辑同步与通知（多对一同步），与信号量只能处理单一事件不同，事件组可以利用位（Bit）操作处理与（AND）和或（OR）的逻辑关系，允许一个任务同时等待多个事件的组合。

**场景：**

* 与（AND）逻辑同步：任务需要满足所有条件才运行。
* 或（OR）逻辑同步：任务接收到任一触发就运行。
* 事件广播：一个事件发生后，可以同时唤醒多个在等待该事件组中不同标志位的任务。

#### 1.2.4 同步机制选择原则

在实际开发中，应根据不同的业务场景选择合适的同步机制。以下决策表可供参考：

| 业务场景 | 推荐机制 | 原因 |
| ---- | ---- | ---- |
| ISR 通知任务（单一事件） | 信号量(liot_rtos_semaphore_release / wait) | ISR 中可安全释放，任务阻塞等待，开销最小 |
| ISR 向任务传递数据 | 消息队列(liot_rtos_queue_release / wait) | 支持传递具体数据内容，缓冲多个中断事件 |
| 多条件同步（任一条件满足） | 事件组 OR (liot_rtos_flag_wait(...,LIOT_FLAG_OR_CLEAR)) | 一个任务可同时监听多个事件源，任一触发即唤醒 |
| 多条件同步（全部条件满足） | 事件组 AND(liot_rtos_flag_wait(...,LIOT_FLAG_AND_CLEAR)) | 任务需等待所有前置条件就绪后才执行 |
| 共享资源保护 | 互斥锁(liot_rtos_mutex_lock/unlock) | 具有优先级继承机制，防止优先级反转，确保同一时刻只有一个任务访问资源 |
| 多任务共享同一通知 | 事件组广播(liot_rtos_flag_release(...,LIOT_FLAG_OR)) | 一次设置可同时唤醒多个等待不同标志位的任务 |
| 计数/限流场景 | 计数信号量(liot_rtos_semaphore_create_ex) | 可限制同时访问某资源的任务数量，如连接池管理 |

#### 1.2.5 堆内存 (Heap)

当前堆内存分配情况如下：

| 底包型号 | F6B_A | F6D_A | F7B_A | K2B_A | K2F_A |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 支持模组型号 | NT26FCNB60WNA | NT26FCND60NNANT26FEUD60NNANT26F6D0 | NT26FCNB70WNA | NT26K2B1 | NT26KCNF20NNA |
| 芯片型号 | EC718pm | EC718pm | EC718pm | EC716e | EC716e |
| RAM 总量 | 4 MB | 4 MB | 4 MB | 2 MB | 2MB |
| RAM 可用 | 1 MB | 1 MB | 1 MB | 512 KB | 512 KB |
| PSRAM | 支持 | 支持 | 支持 | 不支持 | 不支持 |

### 1.3 中断上下文开发约束

中断服务程序与任务的交互是嵌入式开发的关键环节。Lierda OS 封装层已实现中断上下文自动检测，调用 API 时会自动适配FromISR版本。

#### 1.3.1 ISR 中允许调用的 API

| 类别 | 可用 API | 行为说明 |
| ---- | ---- | ---- |
| 信号量 | release(),wait(LIOT_NO_WAIT), get_cnt() | 非阻塞获取，可安全释放唤醒任务 |
| 消息队列 | release(),wait(LIOT_NO_WAIT), get_cnt() | 发送数据到队列，非阻塞接收 |
| 事件组 | release(), clear(), get() | 设置/清除标志位 |
| 系统 | get_system_tick(), enter/exit_critical_from_isr() | 获取时间，临界区保护 |

#### 1.3.2 ISR 中禁止调用的 API

以下 API 涉及内存分配、任务调度或阻塞操作，禁止在ISR中调用：

* 创建/删除类：create, delete (涉及动态内存分配，中断中不安全)。
* 阻塞类：sleep, mutex_lock, flag_wait(ISR 不允许阻塞或休眠)。
* 控制类：task_suspend, task_resume, change_priority (涉及任务列表遍历)。

#### 1.3.3 典型 ISR 与任务交互模式

最佳实践：

* ISR 中只做最少工作：读取寄存器、释放信号量/发送队列/设置事件标志。
* 复杂处理在任务中完成：由 ISR 通过 IPC 机制唤醒业务任务执行耗时运算。

### 1.4 快速上手指南

#### 1.4.1 典型开发流程

1. **创建任务：**使用 liot_rtos_task_create() 创建主业务任务
2. **创建同步机制：**根据需求创建信号量、互斥锁或事件组
3. **创建消息队列：**如需任务间传递数据，创建消息队列
4. **业务循环：**在任务中实现业务逻辑，使用 IPC 机制进行同步和通信
5. **资源清理：**在任务退出前删除创建的 RTOS 对象

#### 1.4.2 使用示例（最小 Demo）

```c
#include "liot_os.h"

// 任务句柄
static liot_task_t main_task_handle = NULL;
static liot_sem_t work_sem = NULL;

// 工作任务函数
void liot_worker_task(void *pvParameters)
{
    for (;;)
    {
        // 等待信号量
        if (liot_rtos_semaphore_wait(work_sem, LIOT_WAIT_FOREVER) == LIOT_OSI_SUCCESS)
        {
            // 执行业务逻辑
            liot_trace("Worker task received signal");
            // ... 业务处理代码 ...
        }
    }
}

// 主任务函数
void liot_main_task(void *pvParameters)
{
    // 创建信号量
    liot_rtos_semaphore_create(&work_sem, 0);

    // 创建工作任务
    liot_rtos_task_create(&main_task_handle,
                          2048,                    // 栈大小 (字节)
                          LIOT_APP_TASK_PRIORITY,  // 优先级
                          "Worker",                // 任务名
                          liot_worker_task,        // 任务入口
                          NULL);                   // 参数

    // 主循环
    for (;;)
    {
        // 释放信号量，唤醒工作任务
        liot_rtos_semaphore_release(work_sem);

        // 休眠 1 秒
        liot_rtos_task_sleep_s(1);
    }
}
```

## 2 API 函数概览

### 2.1 任务

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_task_create() | 创建任务 |
| liot_rtos_task_delete() | 删除任务 |
| liot_rtos_task_yield() | 释放 CPU 使用权 |
| liot_rtos_task_get_current_ref() | 获取当前任务的任务句柄 |
| liot_rtos_task_change_priority() | 切换任务优先级 |
| liot_rtos_task_get_status() | 获取任务状态信息 |
| liot_rtos_task_sleep_ms() | 设置任务休眠时间 |
| liot_rtos_task_sleep_s() | 设置任务休眠时间 |
| liot_rtos_task_get_stack_space() | 获取任务堆栈空闲空间 |
| liot_rtos_task_suspend() | 任务挂起 |
| liot_rtos_task_resume() | 解除任务挂起，恢复为可调度的运行状态 |
| liot_rtos_get_running_time() | 获取 RTOS 系统的时钟节拍数转化的时间，单位ms |
| liot_rtos_get_system_tick() | 获取 RTOS 系统的时钟节拍数 |
| liot_rtos_is_alive() | 判断任务是否处于运行态 |
| liot_rtos_task_create_static() | 静态方式创建任务 |

### 2.2 内存管理

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_malloc() | 动态申请空间 |
| liot_rtos_free() | 释放动态申请空间 |
| liot_rtos_realloc() | 重新分配内存 |
| liot_rtos_calloc() | 动态申请空间并初始化为0 |
| liot_xPortGetTotalHeapSize() | 获取 FreeRTOS 堆的总大小 |
| liot_xPortGetFreeHeapSize() | 获取 FreeRTOS 堆的空闲大小 |
| liot_xPortGetMinimumEverFreeHeapSize() | 获取 FreeRTOS 堆在运行过程中最小空闲大小 |
| liot_xPortGetMaximumFreeBlockSize() | 获取 FreeRTOS 最大可申请的内存块大小 |
| liot_psram_xPortGetTotalHeapSize() | 获取 PSRAM 的总大小 |
| liot_psram_xPortGetFreeHeapSize() | 获取 PSRAM 的空闲大小 |
| liot_psram_xPortGetMinimumEverFreeHeapSize() | 获取 PSRAM 在运行过程中最小空闲大小 |
| liot_psram_xPortGetMaximumFreeBlockSize() | 获取 PSRAM 在运行过程中最大可申请的内存块大小 |

### 2.3 临界区

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_enter_critical() | 进入临界区 |
| liot_rtos_enter_critical_from_isr() | 从中断中进入临界区 |
| liot_rtos_exit_critical() | 退出临界区 |
| liot_rtos_exit_critical_from_isr() | 从中断中退出临界区 |

### 2.4 信号量

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_semaphore_create() | 创建二值信号量 |
| liot_rtos_semaphore_create_ex() | 创建计数信号量 |
| liot_rtos_semaphore_wait() | 设置信号量等待时间 |
| liot_rtos_semaphore_release() | 释放信号量 |
| liot_rtos_semaphore_get_cnt() | 获取信号量值 |
| liot_rtos_semaphore_delete() | 删除信号量 |

### 2.5 互斥锁

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_mutex_create() | 创建互斥锁 |
| liot_rtos_mutex_lock() | 获取互斥锁，等待时间用户可以根据需求进行自定义 |
| liot_rtos_mutex_try_lock() | 尝试获得互斥锁，等待时间为永久等待 |
| liot_rtos_mutex_unlock() | 释放互斥锁 |
| liot_rtos_mutex_delete() | 删除互斥锁 |

### 2.6 消息队列

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_queue_create() | 创建消息队列 |
| liot_rtos_queue_wait() | 等待队列中的消息 |
| liot_rtos_queue_release() | 释放消息队列 |
| liot_rtos_queue_get_cnt() | 获取队列中的消息数量 |
| liot_rtos_queue_delete() | 删除消息队列 |
| liot_rtos_queue_reset() | 重置队列中的元素和更改队列长度 |
| liot_rtos_queue_get_space() | 查询队列中可用空间数量 |

### 2.7 定时器

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_timer_create() | 创建定时器 |
| liot_rtos_timer_start() | 开启定时器 |
| liot_rtos_timer_is_running() | 判断定时器是否处于运行态 |
| liot_rtos_timer_stop() | 停止定时器 |
| liot_rtos_timer_delete() | 删除定时器 |
| liot_rtos_timer_stop_isr() | 在中断中停止定时器 |

### 2.8 事件组

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_flag_create() | 创建事件组 |
| liot_rtos_flag_get() | 获取事件组当前的位状态 |
| liot_rtos_flag_wait() | 等待事件组的位满足指定的条件 |
| liot_rtos_flag_release() | 设置事件组中的事件位 |
| liot_rtos_flag_clear() | 清除事件组中的事件位 |
| liot_rtos_flag_delete() | 删除事件组 |

### 2.9 其他

| 函数 | 说明 |
| ---- | ---- |
| liot_rtos_rand() | 软件随机数 |
| liot_true_rand() | 硬件随机数 |

## 3 类型说明

### 3.1 LiotOSStatus_t

1. **声明**

```c
typedef int LiotOSStatus_t;
```

2. **说明**

RTOS API 返回值的数据类型。

| 返回值 | 说明 |
| ---- | ---- |
| LIOT_OSI_SUCCESS | 成功 |
| LIOT_OSI_TASK_PARAM_INVALID | 任务参数无效 |
| LIOT_OSI_TASK_CREATE_FAIL | 任务创建失败 |
| LIOT_OSI_NO_MEMORY | 任务空间不足 |
| LIOT_OSI_TASK_DELETE_FAIL | 任务删除失败 |
| LIOT_OSI_TASK_PRIO_INVALID | 任务优先级无效 |
| LIOT_OSI_TASK_NAME_INVALID | 任务名称长度无效 |
| LIOT_OSI_INVALID_TASK_REF | 无效任务句柄 |
|  |  |
| LIOT_OSI_SEMA_CREATE_FAILE | 信号量创建失败 |
| LIOT_OSI_SEMA_DELETE_FAIL | 信号量删除失败 |
| LIOT_OSI_SEMA_IS_FULL | 信号量是否满 |
| LIOT_OSI_SEMA_RELEASE_FAIL | 信号量释放失败 |
| LIOT_OSI_SEMA_GET_FAIL | 信号量获取失败 |
| LIOT_OSI_SEMA_FAIL | 信号量失败 |
|  |  |
| LIOT_OSI_MUTEX_CREATE_FAIL | 互斥锁创建失败 |
| LIOT_OSI_MUTEX_DELETE_FAIL | 互斥锁删除失败 |
| LIOT_OSI_MUTEX_LOCK_FAIL | 互斥锁加锁失败 |
| LIOT_OSI_MUTEX_UNLOCK_FAIL | 互斥锁解锁失败 |
|  |  |
| LIOT_OSI_TIMER_CREATE_FAIL | 定时器创建失败 |
| LIOT_OSI_TIMER_START_FAIL | 定时器开启失败 |
| LIOT_OSI_TIMER_STOP_FAIL | 定时器停止失败 |
| LIOT_OSI_TIMER_DELETE_FAIL | 定时器删除失败 |
| LIOT_OSI_TIMER_BIND_TASK_FAIL | 定时器绑定任务失败 |
|  |  |
| LIOT_OSI_QUEUE_CREATE_FAIL | 消息队列创建失败 |
| LIOT_OSI_QUEUE_DELETE_FAIL | 消息队列删除失败 |
| LIOT_OSI_QUEUE_IS_FULL | 消息队列满 |
| LIOT_OSI_QUEUE_RELEASE_FAIL | 消息队列释放失败 |
| LIOT_OSI_QUEUE_RECEIVE_FAIL | 消息队列接收失败 |
| LIOT_OSI_QUEUE_GET_CNT_FAIL | 获取消息队列数量失败 |
| LIOT_OSI_QUEUE_IS_FAIL | 消息队列失败 |
| LIOT_OSI_QUEUE_RESET_FAIL | 消息队列重启失败 |

### 3.2 liot_task_t

1. **声明**

```c
typedef void *liot_task_t;
```

2. **说明**

任务句柄类型。

### 3.3 liot_sem_t

1. **声明**

```c
typedef void *liot_sem_t;
```

2. **说明**

信号量句柄类型。

### 3.4 liot_mutex_t

1. **声明**

```c
typedef void *liot_mutex_t;
```

2. **说明**

互斥锁句柄类型。

### 3.5 liot_queue_t

1. **声明**

```c
typedef void *liot_queue_t;
```

2. **说明**

消息队列句柄类型。

### 3.6 liot_timer_t

1. **声明**

```c
typedef void *liot_timer_t;
```

2. **说明**

定时器句柄类型。

### 3.7 liot_wait_e

1. **声明**

```c
typedef enum
{
    LIOT_WAIT_FOREVER = 0xFFFFFFFFUL,
    LIOT_NO_WAIT      = 0
} liot_wait_e;
```

2. **参数**

* LIOT_WAIT_FOREVER ：永久等待
* LIOT_NO_WAIT      ：不等待

### 3.8 liot_timertype_e

定时器模式。

1. **声明**

```c
typedef enum
{
    LIOT_TimerOnce     = 0, ///< One-shot timer.
    LIOT_TimerPeriodic = 1  ///< Repeating timer.
} liot_timertype_e;
```

2. **参数**

* LIOT_TimerOnce     ：单次模式
* LIOT_TimerPeriodic ：启用循环模式

### 3.9 liot_task_state_e

任务状态。

1. **声明**

```c
typedef enum
{
    LIOT_Running = 0, /* A task is querying the state of itself, so must be running. */
    LIOT_Ready,       /* The task being queried is in a read or pending ready list. */
    LIOT_Blocked,     /* The task being queried is in the Blocked state. */
    LIOT_Suspended,   /* The task being queried is in the Suspended state, or is in the Blocked state with an infinite
                         time out. */
    LIOT_Deleted,     /* The task being queried has been deleted, but its TCB has not yet been freed. */
    LIOT_Invalid      /* Used as an 'invalid state' value. */
} liot_task_state_e;
```

2. **参数**

* LIOT_Running ： 运行态
* LIOT_Ready：准备态
* LIOT_Blocked：阻塞态
* LIOT_Suspended：挂起态
* LIOT_Deleted：已删除状态
* LIOT_Invalid：不合法状态

### 3.10 liot_flag_op_e

事件组标志状态。

1. **声明**

```c
typedef enum
{
    LIOT_FLAG_AND = 5, ///< Wait for all bits in the input event to be set. Do not clear the event flag after the event
                       ///< is processed.
    LIOT_FLAG_AND_CLEAR = 6, ///< Wait for all bits in the input event to be set. Clear the event flag after the event
                             ///< is processed.
    LIOT_FLAG_OR = 7, ///< Wait for any bit in the input event to be set. Do not clear the event flag after the task is
                      ///< finished processing the event.
    LIOT_FLAG_OR_CLEAR = 8 ///< Wait for any bit in the input event to be set. After the task is finished processing
                           ///< the event, clear the event flag.
} liot_flag_op_e;
```

2. **参数**

* LIOT_FLAG_AND:              等待输入事件中的所有位被设置。在事件处理后，不要清除事件标志。
* LIOT_FLAG_AND_CLEAR:   等待输入事件中的所有位被设置。在事件处理后，清除事件标志。
* LIOT_FLAG_OR:                等待输入事件中的任何位被设置。在任务处理完事件后，不要清除事件标志。
* LIOT_FLAG_OR_CLEAR:     等待输入事件中的任何位被设置。在任务处理完事件后，清除事件标志。

### 3.11 liot_StaticTask_t

1. **声明**

```c
typedef void *liot_StaticTask_t;
```

2. **说明**

静态任务数据结构体。

## 4 API 函数详解

### 4.1 任务相关API

#### 4.1.1 liot_rtos_task_create

创建任务。该函数不支持创建事件。任务优先级不能过高，若任务涉及音频相关操作，其优先级不得超过 23，不涉及音频相关操作，其优先级不得超过 25。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_create(liot_task_t *taskRef,      /* OS task reference */
                                            uint32 stackSize,          /* number of bytes in task stack area */
                                            uint8 priority,            /* task priority, 1 ~ 30 */
                                            char *taskName,            /* task name */
                                            void (*taskStart)(void *), /* pointer to task entry point */
                                            void *argv,                /* task entry argument pointer */
                                            ...);
```

2. **参数**

* taskRef：[Out] 任务句柄。
* stackSize：[In] 任务栈大小，根据任务代码而定。最大值：128 * 1024 Byte；单位：字节。
* priority：[In] 任务优先级。范围：0 ~ 30。

推荐使用预定义的优先级：

| 优先级名称 | 值 | 说明 |
| ---- | ---- | ---- |
| APP_PRIORITY_IDLE | 1 | 空闲任务优先级（保留） |
| APP_PRIORITY_LOW | 4 | 低优先级 |
| APP_PRIORITY_BELOW_NORMAL | 8 | 低于正常优先级 |
| APP_PRIORITY_NORMAL | 12 | 正常优先级（默认推荐） |
| APP_PRIORITY_ABOVE_NORMAL | 16 | 高于正常优先级 |
| APP_PRIORITY_HIGH | 25 | 高优先级 |
| APP_PRIORITY_REALTIME | 30 | 实时优先级（最高） |

* taskName：[In] 任务名称。最大值：32；单位：字节。
* taskStart：[In] 任务的入口函数。
* argv：[In] 传递给任务的参数。

3. **返回值**

参考第3.1章。

**注意：** 上述 23 / 25 的优先级上限为开发建议值，SDK 创建任务时仅校验优先级不超过 30，不会区分任务是否涉及音频。开发者需根据实际业务场景自行遵守上述限制，避免因任务优先级过高影响系统稳定性。

#### 4.1.2 liot_rtos_task_delete

删除任务。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_delete(liot_task_t taskRef);
```

2. **参数**

* taskRef：[In] 任务句柄。当参数为NULL时删除当前task，其他task正常运行。

3. **返回值**

参考第3.1章。

**注意：**

* 删除当前任务后的行为：当 `taskRef` 为 NULL 时，将删除调用该函数的当前任务。删除后该任务后续的代码将不再执行，任务占用的堆栈空间会被自动回收。
* 堆栈回收机制：动态创建的任务（通过 `liot_rtos_task_create`）：删除时，任务栈和 TCB（任务控制块）会自动释放回堆内存。

#### 4.1.3 liot_rtos_task_yield

释放 CPU 使用权。

1. **声明**

```c
extern void liot_rtos_task_yield(void);
```

2. **参数**

无。

3. **返回值**

无。

#### 4.1.4 liot_rtos_task_get_current_ref

获取当前任务的任务句柄。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_get_current_ref(liot_task_t *taskRef);
```

2. **参数**

* taskRef：[Out] 任务句柄。

3. **返回值**

参考第3.1章。

#### 4.1.5 liot_rtos_task_change_priority

设置任务优先级。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_change_priority(liot_task_t taskRef, uint8 new_priority, uint8 *old_priority);
```

2. **参数**

* taskRef：[In] 任务句柄。
* new_priority：[In] 目标任务优先级。
* old_priority：[Out]任务原优先级。

3. **返回值**

参考第3.1章。

#### 4.1.6 liot_rtos_task_get_status

获取任务状态信息。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_get_status(liot_task_t task_ref, liot_task_status_s *status);
```

2. **参数**

* task_ref：[In] 任务句柄。
* status：[Out] 任务状态信息。详情见第4.1.6.1章。

3. **返回值**

参考第3.1章。

#### 4.1.7 liot_task_status_s

1. **详细信号强度信息结构体定义**

```c
typedef struct
{
  liot_task_t xHandle;    /* The handle of the task to which the rest of the information in the structure relates. */
  const char *pcTaskName; /* A pointer to the task's name.  This value will be invalid if the task was deleted since the structure was populated! */
  liot_task_state_e eCurrentState; /* The state in which the task existed when the structure was populated. */
  unsigned long uxCurrentPriority; /* The priority at which the task was running (may be inherited) when the structure was populated. */
  uint16 usStackHighWaterMark; /* The minimum amount of stack space that has remained for the task since the task was created.  The closer this value is to zero the closer the task has come to                                    overflowing its stack. */
}liot_task_status_s;
```

2. **参数**

| 类型 | 参数 | 描述 |
| ---- | ---- | ---- |
| liot_task_t | xHandle | 任务句柄 |
| char * | pcTaskName | 任务名称 |
| liot_task_state_e | eCurrentState | 任务状态 |
| unsigned long | uxCurrentPriority | 任务优先级 |
| uint16 | usStackHighWaterMark | 任务堆栈的高水位标记，是判断堆栈是否可能溢出的关键指标 |

#### 4.1.8 liot_rtos_task_sleep_ms

设置任务休眠时间，单位毫秒。

1. **声明**

```c
extern void liot_rtos_task_sleep_ms(uint32 ms);
```

2. **参数**

* ms：[In] 休眠时间，单位毫秒。

3. **返回值**

无。

#### 4.1.9 liot_rtos_task_sleep_s

设置任务休眠时间，单位秒。

1. **声明**

```c
extern void liot_rtos_task_sleep_s(uint32 s);
```

2. **参数**

* s：[In] 休眠时间，单位秒。

3. **返回值**

无。

#### 4.1.10 liot_rtos_task_get_stack_space

获取当前任务空闲堆栈。

1. **声明**

```c
extern uint32_t liot_rtos_task_get_stack_space(liot_task_t task_ref);
```

2. **参数**

* task_ref：[In] 任务句柄。

3. **返回值**

当前任务空闲堆栈。

#### 4.1.11 liot_rtos_task_suspend

该函数用于挂起指定任务。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_suspend(liot_task_t taskRef);
```

2. **参数**

* taskRef：[In] 任务句柄。

3. **返回值**

参考第3.1章。

#### 4.1.12 liot_rtos_task_resume

该函数用于恢复被挂起（suspended）的任务。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_resume(liot_task_t taskRef);
```

2. **参数**

* taskRef：[In] 任务句柄。

3. **返回值**

参考第3.1章。

#### 4.1.13 liot_rtos_get_running_time

该函数为获取模组自开机后的运行时间，单位是毫秒。

1. **声明**

```c
extern uint32_t liot_rtos_get_running_time(void);
```

2. **参数**

无。

3. **返回值**

模组自开机后的运行时间，单位是毫秒

#### 4.1.14 liot_rtos_get_system_tick

该函数为获取模组自开机后的运行的节拍数。

1. **声明**

```c
extern uint32 liot_rtos_get_system_tick(void);
```

2. **参数**

无。

3. **返回值**

模组自开机后的运行节拍数。

#### 4.1.15 liot_rtos_is_alive

该函数用于判断任务是否处于运行状态。

1. **声明**

```c
extern bool liot_rtos_is_alive(liot_task_t taskRef);
```

2. **参数**

* taskRef：[In] 任务句柄。

3. **返回值**

* true : 任务处于运行状态。
* false:任务处于非运行状态。

#### 4.1.16 liot_rtos_task_create_static

以静态方式创建任务。该接口为静态创建任务，占用堆内存，需要提前手动分配（比如全局数组/静态变量），该函数只负责"使用"这些内存，不会动态分配。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_task_create_static(liot_task_t *taskRef,
                                                   uint32 stackSize,
                                                   uint8 priority,
                                                   char *taskName,
                                                   void (*taskStart)(void *),
                                                   void *stackMem,
                                                   void *StaticTask,
                                                   void *argv,
                                                   ...);
```

2. **参数**

* taskRef：[Out] 任务句柄。
* stackSize：[In] 为参数stackMem所指向空间长度。单位：字节。
* priority：[In] 任务优先级。范围：0 ~ 30。
* taskName：[In] 任务名称。最大值：32；单位：字节。
* taskStart：[In] 任务的入口函数。
* stackMem：[In] 必须指向至少具有 stackSize 长度的数组空间（请参阅上面的 stackSize参数），该数组用作任务的堆栈，因此必须是永久性的（而不是在函数的堆栈上声明）。
* StaticTask：[In] 该变量用于保存新任务的数据结构体。必须指向liot_StaticTask_t类型的变量。
* argv：[In] 传递给任务的参数。

3. **返回值**

参考第3.1章。

### 4.2 内存管理

#### 4.2.1 liot_rtos_malloc

该函数用于动态申请空间，liot_rtos_malloc是线程安全的，内部基于 FreeRTOS 的内存管理实现，在多任务并发调用时会自动进行临界区保护。

1. **声明**

```c
extern void *liot_rtos_malloc(size_t size);
```

2. **参数**

* size：[In] 要申请空间大小。

3. **返回值**

申请成功的空间地址。

#### 4.2.2 liot_rtos_free

该函数用于释放动态申请空间。

1. **声明**

```c
extern void liot_rtos_free(void *ptr);
```

2. **参数**

* p：[In] 释放空间的地址。

3. **返回值**

无。

#### 4.2.3 liot_rtos_realloc

该函数用于重新分配已动态分配的内存块的大小。

1. **声明**

```c
extern void *liot_rtos_realloc(void *ptr, size_t size);
```

2. **参数**

* ptr：[In] 原始内存块的指针。
* size：[In] 重新分配新的大小。

3. **返回值**

无。

#### 4.2.4 liot_rtos_calloc

该函数用于动态申请空间并初始化为0。

该函数自动将分配的内存空间全部初始化为 0（这是它和 malloc 最核心的区别，malloc 分配的内存是未初始化的）。因此该函数适合需要分配数组类连续内存且要求初始值为 0 的场景（比如数组、结构体数组）。

1. **声明**

```c
extern void *liot_rtos_calloc(size_t n, size_t Size);
```

2. **参数**

* n：[In] 要分配的元素个数。
* size：[In] 每个元素的字节大小。

3. **返回值**

申请成功的空间地址，失败返回NULL。

#### 4.2.5 liot_xPortGetTotalHeapSize

该函数用于获取 FreeRTOS 堆的总大小。

1. **声明**

```c
extern size_t liot_xPortGetTotalHeapSize(void);
```

2. **参数**

无。

3. **返回值**

堆的总字节数。

#### 4.2.6 liot_xPortGetFreeHeapSize

该函数用于获取系统堆（heap）的剩余空闲大小。

1. **声明**

```c
extern size_t liot_xPortGetFreeHeapSize(void);
```

2. **参数**

无。

3. **返回值**

系统堆（heap）的剩余空闲大小。

#### 4.2.7 liot_xPortGetMinimumEverFreeHeapSize

该函数用于获取系统堆（heap）在运行过程中的最小剩余空闲大小。

1. **声明**

```c
extern size_t liot_xPortGetMinimumEverFreeHeapSize(void);
```

2. **参数**

无。

3. **返回值**

系统堆（heap）在运行过程中的最小剩余空闲大小。

#### 4.2.8 liot_xPortGetMaximumFreeBlockSize

该函数用于获取系统堆（heap）在运行过程中最大可申请的内存块大小。

1. **声明**

```c
extern size_t liot_xPortGetMaximumFreeBlockSize(void);
```

2. **参数**

无。

3. **返回值**

系统堆（heap）在运行过程中最大可申请的内存块大小。

#### 4.2.9 liot_psram_xPortGetTotalHeapSize

该函数用于获取PSRAM的总大小。

1. **声明**

```c
size_t liot_psram_xPortGetTotalHeapSize(void);
```

2. **参数**

无。

3. **返回值**

PSRAM的总大小。

#### 4.2.10 liot_psram_xPortGetFreeHeapSize

该函数用于获取PSRAM的剩余空闲大小。

1. **声明**

```c
size_t liot_psram_xPortGetFreeHeapSize(void);
```

2. **参数**

无。

3. **返回值**

PSRAM的剩余空闲大小。

#### 4.2.11 liot_psram_xPortGetMinimumEverFreeHeapSize

该函数用于获取PSRAM在运行过程中的最小剩余空闲大小。

1. **声明**

```c
size_t liot_psram_xPortGetMinimumEverFreeHeapSize(void);
```

2. **参数**

无。

3. **返回值**

PSRAM在运行过程中的最小剩余空闲大小。

#### 4.2.12 liot_psram_xPortGetMaximumFreeBlockSize

该函数用于获取PSRAM在运行过程中最大可申请的内存块大小。

1. **声明**

```c
size_t liot_psram_xPortGetMaximumFreeBlockSize(void);
```

2. **参数**

无。

3. **返回值**

PSRAM在运行过程中最大可申请的内存块大小。

### 4.3 临界区

#### 4.3.1 liot_rtos_enter_critical

该函数用于进入临界区保护。

1. **声明**

```c
extern void liot_rtos_enter_critical(void);
```

2. **参数**

无。

3. **返回值**

无。

#### 4.3.2 liot_rtos_enter_critical_from_isr

该函数用于从中断中进入临界区保护。

1. **声明**

```c
extern uint32_t liot_rtos_enter_critical_from_isr(void);
```

2. **参数**

无。

3. **返回值**

中断返回值。

#### 4.3.3 liot_rtos_exit_critical

该函数用于退出临界区保护。

1. **声明**

```c
extern void liot_rtos_exit_critical(void);
```

2. **参数**

无。

3. **返回值**

无。

#### 4.3.4 liot_rtos_exit_critical_from_isr

该函数用于从中断中退出临界区保护。

1. **声明**

```c
extern void liot_rtos_exit_critical_from_isr(uint32_t isrm);
```

2. **参数**

* isrm：[In] 对应liot_rtos_enter_critical_from_isr()函数的返回值。

3. **返回值**

无。

### 4.4 信号量

#### 4.4.1 liot_rtos_semaphore_create

该函数用于创建信号量。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_create(liot_sem_t *semaRef, uint32 initialCount);
```

2. **参数**

* semaRef：[Out] 信号量句柄。
* initialCount：[In] 信号量的初始计数值。

3. **返回值**

参考第3.1章。

**注意：**禁止在中断中创建信号量

#### 4.4.2 liot_rtos_semaphore_create_ex

该函数用于创建信号量，信号量创建涉及内存分配等操作，这些操作在中断上下文中是不安全的，信号量应在任务初始化阶段创建，中断中只能释放信号量

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_create_ex(liot_sem_t *semaRef, uint32 initialCount, uint32 max_cnt);
```

2. **参数**

* semaRef：Out] 信号量句柄。
* initialCount：[In] 信号量的初始计数值。
* maxCnt：[In] 信号量的最大计数值。

3. **返回值**

参考第3.1章。

#### 4.4.3 liot_rtos_semaphore_wait

该函数用于设置信号量等待时间。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_wait(liot_sem_t semaRef, uint32 timeout);
```

2. **参数**

* semaRef：[In] 信号量句柄。
* timeout：[In] 信号量等待的时间。单位：毫秒。0xFFFFFFFF 表示永久等待。

3. **返回值**

参考第3.1章。

调用场景说明

| 场景 | timeout 选择 | 说明 |
| ---- | ---- | ---- |
| 任务同步 | LIOT_WAIT_FOREVER (0xFFFFFFFF) | 等待另一个任务的通知，如等待数据处理完成 |
| 中断后处理 | LIOT_WAIT_FOREVER (0xFFFFFFFF) | 等待中断服务程序释放信号量，触发数据处理 |
| 超时保护 | 自定义超时时间 (ms) | 需要在指定时间内响应，避免无限等待导致任务挂起 |
| 非阻塞检查 | LIOT_NO_WAIT (0) | 立即检查信号量状态，不阻塞任务 |

**timeout 选择建议：**

* 关键业务同步：使用 `LIOT_WAIT_FOREVER`，确保操作完成后才继续执行。
* 有时间要求的场景：设置合理的超时时间，超时后进行错误处理或重试。
* 轮询检查：使用 `LIOT_NO_WAIT` 配合任务休眠，实现定时检查。

#### 4.4.4 liot_rtos_semaphore_release

该函数用于设置释放信号量。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_release(liot_sem_t semaRef);
```

2. **参数**

* semaRef：[In] 信号量句柄。

3. **返回值**

参考第3.1章。

#### 4.4.5 liot_rtos_semaphore_get_cnt

该函数用于获取信号量的值。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_get_cnt(liot_sem_t semaRef, uint32 *cntPtr);
```

2. **参数**

* semaRef：[In] 信号量句柄。
* cntPtr：[Out] 信号量的值。

3. **返回值**

参考第3.1章。

#### 4.4.6 liot_rtos_semaphore_delete

该函数用于删除信号量。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_semaphore_delete(liot_sem_t semaRef);
```

2. **参数**

semaRef：[In] 信号量句柄。

3. **返回值**

参考第3.1章。

### 4.5 互斥锁

#### 4.5.1 liot_rtos_mutex_create

该函数用于创建互斥锁。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_mutex_create(liot_mutex_t *mutexRef);
```

2. **参数**

mutexRef ：[Out] 互斥锁句柄。

3. **返回值**

参考第3.1章。

#### 4.5.2 liot_rtos_mutex_lock

该函数用于获取互斥锁，等待时间用户可以根据需求进行自定义。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_mutex_lock(liot_mutex_t mutexRef, uint32 timeout);
```

2. **参数**

mutexRef：[In] 互斥锁句柄。

timeout：[In] 信号量等待的时间。单位：毫秒。0xFFFFFFFF 表示永久等待。

3. **返回值**

参考第3.1章。

#### 4.5.3 liot_rtos_mutex_try_lock

该函数用于尝试获得互斥锁，等待时间为永久等待。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_mutex_try_lock(liot_mutex_t mutexRef);
```

2. **参数**

mutexRef ：[In] 信号量句柄。

3. **返回值**

参考第3.1章。

#### 4.5.4 liot_rtos_mutex_unlock

该函数用于释放互斥锁。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_mutex_unlock(liot_mutex_t mutexRef);
```

2. **参数**

mutexRef：[In] 信号量句柄。

3. **返回值**

参考第3.1章。

#### 4.5.5 liot_rtos_mutex_delete

该函数用于删除互斥锁。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_mutex_delete(liot_mutex_t mutexRef)
```

2. **参数**

mutexRef：[In] 信号量句柄。

3. **返回值**

参考第3.1章。

### 4.6 消息队列

#### 4.6.1 liot_rtos_queue_create

该函数用于创建消息队列。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_create(liot_queue_t *msgQRef, uint32 maxSize, uint32 maxNumber);
```

2. **参数**

* msgQRef：[Out] 消息队列句柄。
* maxSize：[In] 每个元素的大小（以字节为单位）。
* maxNumber：[In] 队列长度，即最多可以存储多少个元素。

3. **返回值**

参考第3.1章。

#### 4.6.2 liot_rtos_queue_wait

该函数用于等待队列中的消息。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_wait(liot_queue_t msgQRef, /* message queue reference */
                                           uint8 *recvMsg,       /* pointer to the message received */
                                           uint32 size,          /* size of the message */
                                           uint32 timeout        /* LIOT_WAIT_FOREVER, LIOT_NO_WAIT, or timeout */
);
```

2. **参数**

* msgQRef：[In] 要接收元素的消息队列句柄。
* recvMsg：[Out] 指向一个用于保存接收到的元素的缓冲区的指针。
* size：[In] 本参数无效，仅为兼容本司其他模块，该参数大小固定为创建队列时的 maxSize 大小。
* timeout：[In] 信号量等待的时间。单位：毫秒。0xFFFFFFFF 表示永久等待。

3. **返回值**

参考第3.1章。

#### 4.6.3 liot_rtos_queue_release

该函数用于释放消息队列。支持从中断中释放消息队列功能。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_release(liot_queue_t msgQRef, /* message queue reference */
                                              uint32 size,          /* size of the message */
                                              uint8 *msgPtr,        /* start address of the data to be sent */
                                              uint32 timeout        /* LIOT_WAIT_FOREVER, LIOT_NO_WAIT, or timeout */
);
```

2. **参数**

* msgQRef：[In] 要接收元素的消息队列句柄。
* msgPtr：[In] 指向一个用于保存接收到的元素的缓冲区的指针。
* size：[In] 本参数无效，仅为兼容本司其他模块，该参数大小固定为创建队列时的 maxSize 大小。
* timeout：[In] 信号量等待的时间。单位：毫秒。0xFFFFFFFF 表示永久等待。用户还可自定义外，还可以参考第 4.8 章。

3. **返回值**

参考第3.1章。

**注意：**等待时间timeout为0时如果队列未满，消息立即入队 ，若队列已满函数返回错误，不会阻塞等待。

#### 4.6.4 liot_rtos_queue_get_cnt

该函数用于获取队列中的消息数量。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_get_cnt(liot_queue_t msgQRef, uint32 *cntPtr);
```

2. **参数**

* msgQRef：[In] 消息队列句柄。
* cntPtr：[Out] 队列中保存的消息条数。

3. **返回值**

参考第3.1章。

#### 4.6.5 liot_rtos_queue_delete

该函数用于删除消息队列。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_delete(liot_queue_t msgQRef);
```

2. **参数**

* msgQRef：[In] 消息队列句柄。

3. **返回值**

参考第3.1章。

#### 4.6.6 liot_rtos_queue_reset

该函数用于重置消息队列。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_queue_reset(liot_queue_t msgQRef);
```

2. **参数**

* msgQRef：[In] 消息队列句柄。

3. **返回值**

参考第3.1章。

#### 4.6.7 liot_rtos_queue_get_space

该函数用于查询队列中可用空间数量。

1. **声明**

```c
extern uint32_t liot_rtos_queue_get_space(liot_queue_t msgQRef);
```

2. **参数**

* msgQRef：[In] 消息队列句柄。

3. **返回值**

参考第3.1章。

### 4.7 定时器

#### 4.7.1 liot_rtos_timer_create

该函数用于创建rtos系统(软件)定时器。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_create(liot_timer_t *timerRef,
                                             liot_timertype_e cyclicalEn,
                                             void (*callBackRoutine)(void*),
                                             void *timerArgc
);
```

2. **参数**

* timerRef：[Out] 定时器句柄。
* cyclicalEn：[In] 是否启用循环模式。
* callBackRoutine：[In] 定时器回调函数。
* timerArgc：[In] 定时器回调函数的参数。

3. **返回值**

参考第3.1章。

#### 4.7.2 liot_rtos_timer_start

该函数用于启动定时器，时间精度为毫秒。支持从中断中开启定时器。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_start(liot_timer_t timerRef,uint32 setTime);
```

2. **参数**

* timerRef：[In] 定时器句柄。
* setTime：[In] 定时器超时时间。单位：毫秒。

3. **返回值**

参考第3.1章。

#### 4.7.3 liot_rtos_timer_is_running

该函数用于判断定时器是否正在计时。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_is_running(liot_timer_t timerRef);
```

2. **参数**

* timerRef：[In] 定时器句柄。

3. **返回值**

0：定时器不在计时。

1：定时器正在计时。

#### 4.7.4 liot_rtos_timer_stop

该函数用于停止定时器。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_stop(liot_timer_t timerRef);
```

2. **参数**

* timerRef：[In] 定时器句柄。

3. **返回值**

参考第3.1章。

#### 4.7.5 liot_rtos_timer_delete

该函数用于删除定时器。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_delete(liot_timer_t timerRef);
```

2. **参数**

* timerRef：[In] 定时器句柄。

3. **返回值**

参考第3.1章。

#### 4.7.6 liot_rtos_timer_stop_isr

该函数用于在中断中停止定时器。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_timer_stop_isr(liot_timer_t timerRef);
```

2. **参数**

* timerRef：[In] 定时器句柄。

3. **返回值**

参考第3.1章。

### 4.8 事件标志组

#### 4.8.1 liot_rtos_flag_create

该函数用于创建事件组(Event Group)。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_flag_create(liot_flag_t *flagRef);
```

2. **参数**

* flagRef：[Out] 事件组句柄。

3. **返回值**

参考第3.1章。

#### 4.8.2 liot_rtos_flag_get

该函数用于获取事件组(Event Group)的当前状态。

1. **声明**

```c
extern uint32 liot_rtos_flag_get(liot_flag_t flagRef);
```

2. **参数**

* flagRef：[In] 事件组句柄。

3. **返回值**

事件组标志。

#### 4.8.3 liot_rtos_flag_wait

该函数用于等待事件组(Event Group)的特定位被设置的函数。它允许任务阻塞等待事件组中指定位被设置，直到满足指定的条件。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_flag_wait(liot_flag_t flagRef, UINT32 mask, liot_flag_op_e operation, UINT32 *flag, UINT32 timeout);
```

2. **参数**

* flagRef：[In] 事件组句柄。
* mask：[In] 要等待的事件组位的掩码，用于指定哪些位需要在等待期间被设置。
* operation：[In] 事件组标志的处理。参考第4.10章。
* Flag：[Out] 表示满足等待条件的事件组位。
* Timeout：[In] 等待超时时间。

3. **返回值**

参考第3.1章。

#### 4.8.4 liot_rtos_flag_release

该函数用于设置事件组(Event Group)中特定位的函数。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_flag_release(liot_flag_t flagRef, UINT32 mask, liot_flag_op_e operation);
```

2. **参数**

* flagRef：[In] 事件组句柄。
* mask：[In] 要等待的事件组位的掩码，用于指定哪些位需要在等待期间被设置。
* operation：[In] 事件组标志的处理。参考第4.10章。

3. **返回值**

参考第3.1章。

#### 4.8.5 liot_rtos_flag_clear

该函数用于清除事件组(Event Group)中特定位的函数。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_flag_clear(liot_flag_t flagRef, UINT32 mask);
```

2. **参数**

* flagRef：[In] 事件组句柄。
* mask：[In] 要等待的事件组位的掩码，用于指定哪些位需要在等待期间被设置。

3. **返回值**

参考第3.1章。

#### 4.8.6 liot_rtos_flag_delete

该函数用于删除事件组(Event Group)。

1. **声明**

```c
extern LiotOSStatus_t liot_rtos_flag_delete(liot_flag_t flagRef);
```

2. **参数**

* flagRef：[In] 事件组句柄。

3. **返回值**

参考第3.1章。

### 4.9 其他

#### 4.9.1 liot_rtos_rand

该函数用于生成一个随机数。

1. **声明**

```c
extern uint32 liot_rtos_rand(void);
```

2. **参数**

无。

3. **返回值**

返回生成的随机数。

#### 4.9.2 liot_true_rand

该函数用于生成硬件随机数，是真随机数，具有更高的安全性。

1. **声明**

```c
uint32 liot_true_rand(void);
```

2. **参数**

无。

3. **返回值**

返回生成的随机数。

## 5 代码示例

### 5.1 完整示例代码

本示例展示了 RTOS API 的综合使用，包括任务创建、信号量、消息队列、定时器和事件组的使用。

示例代码位置：PLAT/project/ec7xx_0h00/ap/apps/lierda_app/lierda_examples/liot_os_demo.c

#### 5.1.1 示例说明

该示例演示了以下功能：

1. 创建主任务和子任务
2. 使用信号量进行任务同步
3. 使用消息队列进行任务间通信
4. 使用定时器触发周期性操作
5. 使用事件组实现多任务同步
6. 获取系统运行时间和内存使用情况

#### 5.1.2 完整代码

```c
/**
 * @File Name: liot_os_demo.c
 * @brief RTOS API 综合使用示例
 */

#include <stdio.h>
#include <string.h>

#include "lierda_app_main.h"
#include "liot_os.h"
#include "liot_type.h"

/*
   本示例展示 OS 的使用方法。在该示例中，我们创建两个任务、一个信号量和一个消息队列。
   主任务首先被创建，子任务在主任务创建后向主任务发送消息。
   主任务打印接收到的消息。
   测试运行 10 个周期后结束。
 */

#define MSG_MAX_SIZE 64
#define MSG_MAX_NUM  10
#define MSG_TO_QUEUE "message from sub task to main task"

static liot_sem_t rtos_test_sem      = NULL;
static liot_queue_t rtos_test_queue  = NULL;
static liot_timer_t rtos_timer_queue = NULL;
static int test_count                = 0;

// 定时器回调函数
void liot_os_demo_timer_cb(void *argv)
{
    liot_rtos_semaphore_release(rtos_test_sem); // 通知子任务主任务已启动
    liot_trace("TIMER_task start");

    liot_rtos_queue_release(rtos_test_queue, strlen(MSG_TO_QUEUE), (u8 *)MSG_TO_QUEUE, 0);

    liot_trace("TIMER_task send msg");
}

// 定义事件组句柄
liot_flag_t xEventGroupHandle;

// 定义事件位
#define TASK_1_EVENT (1 << 0) // 0x01
#define TASK_2_EVENT (1 << 1) // 0x02
#define TASK_3_EVENT (1 << 2) // 0x04
#define ALL_TASKS_EVENT (TASK_1_EVENT | TASK_2_EVENT | TASK_3_EVENT) // 0x07

// 任务 1 函数
void vTask1(void *pvParameters) {

    liot_trace("Task1 in");
    UINT32 uxBits;
    for (;;) {
        liot_trace("Task1 1111Received event, starting task...");
        // 等待事件
        LiotOSStatus_t result = liot_rtos_flag_wait(xEventGroupHandle, TASK_1_EVENT, LIOT_FLAG_AND_CLEAR, &uxBits, LIOT_WAIT_FOREVER);
        if (0 == result)
        {
            if(uxBits & TASK_1_EVENT) {
                liot_trace("Task1 Received event, starting task...");
                // 执行任务
                // ...
            }
        }
    }
}

// 任务 2 函数
void vTask2(void *pvParameters) {

    liot_trace("Task2 in");
    UINT32 uxBits;

    for (;;) {
        liot_trace("Task2 22222Received event, starting task...");
        // 等待事件
        LiotOSStatus_t result = liot_rtos_flag_wait(xEventGroupHandle, TASK_2_EVENT, LIOT_FLAG_AND_CLEAR, &uxBits, LIOT_WAIT_FOREVER);
        if (0 == result)
        {
            if(uxBits & TASK_2_EVENT) {
                liot_trace("Task2 Received event, starting task...");
                // 执行任务
                // ...
            }
        }
    }
}

// 任务 3 函数
void vTask3(void *pvParameters) {

    liot_trace("Task3 in");
    UINT32 uxBits;

    for (;;) {
        // 等待事件
        liot_trace("Task3 333 Received event, starting task...");

        LiotOSStatus_t result = liot_rtos_flag_wait(xEventGroupHandle, TASK_3_EVENT, LIOT_FLAG_AND_CLEAR, &uxBits, LIOT_WAIT_FOREVER);
        if (0 == result)
        {
            if(uxBits & TASK_3_EVENT) {
                liot_trace("Task3 Received event, starting task...");
                // 执行任务
                // ...
            }
        }
    }
}

// 定时器回调函数
void vTimerCallback(void *ctx) {
    // 释放事件
    liot_rtos_flag_release(xEventGroupHandle, ALL_TASKS_EVENT, LIOT_FLAG_OR);
    liot_trace("Released event, notifying all tasks...");
}

/*!
 * @brief 测试事件组用于任务同步的功能。
 *
 * @details 该函数演示如何使用事件组通过标志同步多个任务。
 *          执行步骤：
 *          1. 使用 liot_rtos_flag_create 创建事件组。
 *          2. 创建三个任务（vTask1、vTask2 和 vTask3），这些任务等待特定的事件标志。
 *          3. 创建一个周期性定时器，每 10 秒释放所有事件标志以触发任务。
 *          每个任务等待各自的事件标志，收到后执行并清除标志。
 *          定时器回调使用 LIOT_FLAG_OR 逻辑释放所有标志。
 *
 * @note 该函数用于测试和演示目的。
 *       假设事件组和任务在执行期间不会被重用。
 *
 * @return 无
 */
void liot_group_event_test()
{
    // 创建事件组
    LiotOSStatus_t result = liot_rtos_flag_create(&xEventGroupHandle);
    if (0 != result) {
        liot_trace("main Failed to create event group");
        return;
    }

    liot_trace("main create flag event group");

    // 创建任务 1
    liot_task_t task1_handle = NULL;
    result = liot_rtos_task_create(&task1_handle, 1024, LIOT_APP_TASK_PRIORITY, "Task1", &vTask1, NULL);
    if(result == 0)
    {
        liot_trace("Task1 task create success %d", result);
    }
    else
    {
        liot_trace("Task1 task create fail %d", result);
    }
    // 创建任务 2
    liot_task_t task2_handle = NULL;
    result = liot_rtos_task_create(&task2_handle, 1024, LIOT_APP_TASK_PRIORITY, "Task2", &vTask2, NULL);
    if(result == 0)
    {
        liot_trace("Task2 task create success %d", result);
    }
    else
    {
        liot_trace("Task2 task create fail %d", result);
    }
    // 创建任务 3
    liot_task_t task3_handle = NULL;
    result = liot_rtos_task_create(&task3_handle, 1024, LIOT_APP_TASK_PRIORITY, "Task3", &vTask3, NULL);
    if(result == 0)
    {
        liot_trace("Task3 task create success %d", result);
    }
    else
    {
        liot_trace("Task3 task create fail %d", result);
    }

    liot_trace("main create task success");

    // 创建定时器
    liot_timer_t timer_handle;
    liot_rtos_timer_create(&timer_handle, LIOT_TimerPeriodic, vTimerCallback, NULL);
    liot_rtos_timer_start(timer_handle, 10000); // 10 秒
}

// 主测试任务
void liot_os_demo_thread(void *argv)
{
    test_count = 0;
    liot_rtos_task_sleep_ms(5000);
    char *msg = liot_rtos_malloc(MSG_MAX_SIZE);
    if (msg == NULL)
    {
        return;
    }
    memset(msg, 0, MSG_MAX_SIZE);

    liot_task_status_s xTaskStatus;

    liot_rtos_task_get_status(NULL, &xTaskStatus);

    // 获取当前任务信息
    liot_trace("------------Get Task Info------------ ");
    liot_trace("eCurrentState = %d ", xTaskStatus.eCurrentState);
    liot_trace("pcTaskName = %s ", xTaskStatus.pcTaskName);
    liot_trace("usStackHighWaterMark = %d ", xTaskStatus.usStackHighWaterMark);
    liot_trace("uxCurrentPriority = %ld ", xTaskStatus.uxCurrentPriority);
    liot_trace("xHandle = %x ", (void *)xTaskStatus.xHandle);

    liot_trace("========== rtos systick:%ld", liot_rtos_get_system_tick());
    liot_trace("========== rtos run systick:%ld", liot_rtos_get_running_time());
    liot_trace("========== rtos rand:%ld", liot_rtos_rand());
    liot_trace("========== rtos task is running:%d", liot_rtos_is_alive(NULL));

    // 打印 SRAM 信息
    liot_trace("========== rtos Get TotalHeapSize:%dKB,FreeHeapSize:%dKB,MinFreeHeapSize:%dKB,MaxFreeBlockSize:%dKB",
        (liot_xPortGetTotalHeapSize()) >> 10, (liot_xPortGetFreeHeapSize()) >> 10,
        (liot_xPortGetMinimumEverFreeHeapSize()) >> 10, (liot_xPortGetMaximumFreeBlockSize()) >> 10);
    #if defined (PSRAM_FEATURE_ENABLE) && (PSRAM_EXIST==1)
    // 打印 PSRAM 信息
    liot_trace("========== rtos GetPsram TotalHeapSize:%dKB,FreeHeapSize:%dKB,MinFreeHeapSize:%dKB,MaxFreeBlockSize:%dKB",
        (liot_psram_xPortGetTotalHeapSize()) >> 10, (liot_psram_xPortGetFreeHeapSize()) >> 10,
        (liot_psram_xPortGetMinimumEverFreeHeapSize()) >> 10, (liot_psram_xPortGetMaximumFreeBlockSize()) >> 10);
    #endif

    // 创建信号量
    liot_rtos_semaphore_create(&rtos_test_sem, 0);
    // 创建消息队列
    liot_rtos_queue_create(&rtos_test_queue, MSG_MAX_SIZE, MSG_MAX_NUM);
    // 创建定时器
    liot_rtos_timer_create(&rtos_timer_queue, 1, liot_os_demo_timer_cb, NULL);
    liot_rtos_timer_start(rtos_timer_queue, 5000);

    // 主循环
    while (test_count <= 10)
    {
        liot_trace("main_task start");
        liot_rtos_semaphore_wait(rtos_test_sem, 0xFFFFFFFF); // 等待主任务启动

        liot_rtos_queue_wait(
            rtos_test_queue, (u8 *)msg, MSG_MAX_SIZE, 0xFFFFFFFF); // 等待来自子任务的消息
        liot_trace("main_task recv msg: %s,test_count %d", msg, test_count);
        test_count += 1;
        memset(msg, 0, MSG_MAX_SIZE);
        liot_rtos_task_sleep_ms(1000);
    }

    // 获取任务状态
    liot_rtos_task_get_status(NULL, &xTaskStatus);

    liot_trace("------------Get Task Info------------ ");
    liot_trace("eCurrentState = %d ", xTaskStatus.eCurrentState);
    liot_trace("pcTaskName = %s ", xTaskStatus.pcTaskName);
    liot_trace("usStackHighWaterMark = %d ", xTaskStatus.usStackHighWaterMark);
    liot_trace("uxCurrentPriority = %ld ", xTaskStatus.uxCurrentPriority);
    liot_trace("xHandle = %x ", (void *)xTaskStatus.xHandle);
    liot_trace("------------Get Task Info------------ ");

    // 释放资源
    liot_rtos_free(msg);
    liot_trace("delete main task");
    liot_rtos_semaphore_delete(rtos_test_sem);
    rtos_test_sem = NULL;
    liot_rtos_queue_delete(rtos_test_queue);
    rtos_test_queue = NULL;
    liot_rtos_timer_delete(rtos_timer_queue);
    rtos_timer_queue = NULL;

    // 事件组测试
    liot_group_event_test();

    // 保持运行
    while(1)
    {
        liot_rtos_task_sleep_ms(1000);
    }
}
```

#### 5.1.3 运行结果

<div align="center"><img src="_images/RTOS开发指导/image_1.png" width="600"/></div>

