---
title: 如何增加esp-idf的烧录速度
description: '适用于UART烧录模式'
publishDate: 2026-02-01 17:55
tags:
  - 技术
  - 软件
  - 硬件
  - 单片机
  - ESP系列
---

在vscode的设置（不是menuconfig！）中把`idf.flashBaudRate`设置为$921600$。

也许可以更快？但稳定性如何？还没试。