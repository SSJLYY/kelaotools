# 氪佬工具箱 / Kelao Car Tools

## 中文说明

氪佬工具箱是一个面向新能源车主的微信小程序项目，聚合用车记录、充电费用计算、养车账本、顺风车收入、场景码、自定义音效、收藏管理和数据统计等常用功能。

本项目目前以原生微信小程序为主，数据主要存储在本地缓存中，适合作为个人工具、小程序学习项目或二次开发基础。

### 主要功能

- 首页数据概览
- 我的车辆管理
- 充电费用计算
- 充电记录与月度报表
- 养车账本：停车费、过路费、洗车、保养、保险、维修等记录
- 顺风车收入记录
- 数据统计：支出、收入、结余、充电概览和近 6 个月趋势
- 场景码列表与详情
- 自定义音效列表
- 我的收藏：场景码和音效收藏管理
- 功能介绍、添加到桌面指南、个人中心等页面

### 技术栈

- 微信小程序原生开发
- WXML / WXSS / JavaScript
- 本地缓存 `wx.getStorageSync` / `wx.setStorageSync`
- 自定义导航栏

### 目录结构

```text
.
├── miniprogram/              # 小程序源码
│   ├── pages/                # 主包页面
│   ├── subpkg/               # 分包页面
│   ├── utils/                # 工具函数
│   ├── assets/               # 静态资源
│   └── app.json              # 小程序页面与全局配置
├── cloudfunctions/           # 云函数目录，当前项目保留
├── docs/                     # 文档目录
├── project.config.json       # 微信开发者工具项目配置
└── README.md
```

### 本地运行

1. 安装并打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本仓库根目录。
4. `project.config.json` 中的 `appid` 当前为占位值：

```json
"appid": "your-appid-here"
```

如需上传或体验正式小程序，请替换为你自己的小程序 AppID。

5. 使用微信开发者工具编译、预览或上传。

### 数据说明

项目主要使用小程序本地缓存保存数据，常见 key 包括：

- `kt_my_car`：当前车辆
- `kt_my_cars`：车辆列表
- `kt_charging_logs`：充电记录
- `kt_maintenance_logs`：养车费用记录
- `kt_ride_logs`：顺风车收入记录
- `kt_fav_scenes`：收藏的场景码
- `kt_fav_sounds`：收藏的音效
- `kt_data_stats_budgets`：数据统计预算配置

二次开发时，可以根据业务需要改造为云数据库、服务端接口或其他持久化方案。

### 二次开发建议

- 将场景码、音效、车型参数等静态数据抽离为统一配置文件。
- 将本地缓存封装为独立的数据服务层。
- 接入云开发或自建服务端，实现多设备数据同步。
- 增加单元测试、端到端测试和构建脚本。
- 根据实际品牌和车型调整车辆参数、文案和功能入口。

### 开源协议

本项目采用 MIT License 开源。

你可以自由使用、复制、修改、合并、发布、分发、再授权或二次开发本项目，包括商业用途；但需要保留原始版权声明和许可证文本，以标明出处。

详细内容请查看根目录下的 `LICENSE` 文件。

### 免责声明

本项目为开源学习和个人工具项目。项目中的车辆参数、费用估算、场景码、音效码等内容仅供参考，请以实际车辆、官方平台和真实账单为准。使用本项目产生的任何风险和损失由使用者自行承担。

---

## English

Kelao Car Tools is a WeChat Mini Program project for new energy vehicle owners. It provides practical features such as charging cost calculation, charging logs, vehicle expense tracking, carpool revenue records, scene codes, custom sounds, favorites, and data statistics.

The project is currently built with native WeChat Mini Program technologies. Most data is stored in local Mini Program storage, making it suitable as a personal utility, a learning project, or a foundation for further development.

### Features

- Home dashboard
- Vehicle management
- Charging cost calculator
- Charging logs and monthly reports
- Vehicle expense ledger for parking, tolls, washing, maintenance, insurance, repairs, and more
- Carpool revenue records
- Data statistics for expenses, income, balance, charging overview, and recent 6-month trends
- Scene code list and detail pages
- Custom sound list
- Favorites management for scene codes and sounds
- Feature introduction, add-to-desktop guide, and profile pages

### Tech Stack

- Native WeChat Mini Program
- WXML / WXSS / JavaScript
- Local storage with `wx.getStorageSync` / `wx.setStorageSync`
- Custom navigation bar

### Project Structure

```text
.
├── miniprogram/              # Mini Program source code
│   ├── pages/                # Main package pages
│   ├── subpkg/               # Subpackage pages
│   ├── utils/                # Utility functions
│   ├── assets/               # Static assets
│   └── app.json              # Page and global configuration
├── cloudfunctions/           # Cloud functions directory, reserved for future use
├── docs/                     # Documentation directory
├── project.config.json       # WeChat DevTools project configuration
└── README.md
```

### Getting Started

1. Install and open WeChat DevTools.
2. Import this repository as a Mini Program project.
3. Select the repository root as the project directory.
4. The `appid` in `project.config.json` is currently a placeholder:

```json
"appid": "your-appid-here"
```

Replace it with your own Mini Program AppID if you need to preview, upload, or publish the Mini Program.

5. Compile, preview, or upload the project in WeChat DevTools.

### Data Storage

The project mainly stores data in local Mini Program storage. Common keys include:

- `kt_my_car`: current vehicle
- `kt_my_cars`: vehicle list
- `kt_charging_logs`: charging logs
- `kt_maintenance_logs`: vehicle expense records
- `kt_ride_logs`: carpool revenue records
- `kt_fav_scenes`: favorite scene codes
- `kt_fav_sounds`: favorite sounds
- `kt_data_stats_budgets`: budget settings for data statistics

For production or multi-device usage, you may replace local storage with cloud database, backend APIs, or another persistence solution.

### Development Suggestions

- Move static data such as scene codes, sounds, and vehicle specs into shared configuration files.
- Wrap local storage access in a dedicated data service layer.
- Integrate cloud development or a backend service for data synchronization.
- Add unit tests, end-to-end tests, and build scripts.
- Adjust vehicle specs, copywriting, and feature entries according to your target brand and use case.

### License

This project is open-sourced under the MIT License.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and develop derivative works, including for commercial purposes, as long as the original copyright notice and license text are retained to give proper attribution.

See the `LICENSE` file for details.

### Disclaimer

This project is provided as an open-source learning and personal utility project. Vehicle specs, cost estimates, scene codes, and sound codes in this project are for reference only. Please refer to actual vehicle data, official platforms, and real bills. Users are responsible for any risks or losses arising from the use of this project.

项目参考微信小程序"鹏友工具箱"
