# 图片共享平台 - 5 分钟演示演讲稿

## 开场介绍 (30 秒)

大家好，我是[您的姓名]。今天我将为大家演示我开发的图片共享平台解决方案。

这是一个基于云原生架构的图片管理系统，使用了 Microsoft Azure 云平台的各种服务。接下来我将展示：

1. 运行中的应用程序功能
2. Azure 后端资源配置
3. RESTful API 的 CRUD 操作
4. 高级功能的使用

---

## 第一部分：应用程序功能演示 (2 分钟)

### 1.1 用户注册和登录 (20 秒)

**操作：**

- 打开浏览器，访问前端应用
- 展示注册页面，注册一个新用户
- 展示登录功能，使用刚注册的账号登录

**说明：**
"首先，用户可以通过注册功能创建账号，然后登录系统。系统使用 Session 管理用户状态。"

### 1.2 图片上传功能 (30 秒)

**操作：**

- 点击"Upload"进入上传页面
- 拖拽或选择多张图片进行上传
- 展示上传进度和成功提示
- 上传后自动跳转到"My Pictures"页面

**说明：**
"用户可以通过拖拽或点击的方式上传图片。系统支持多文件同时上传，图片会被存储到 Azure Blob Storage 中，元数据保存到 MongoDB 数据库。"

### 1.3 图片浏览和搜索 (30 秒)

**操作：**

- 进入"Pictures"页面，展示所有公开图片
- 使用搜索框搜索图片（按名称、描述、分类）
- 使用分类筛选器筛选图片
- 展示分页功能

**说明：**
"用户可以在图片库中浏览所有公开图片，支持按名称、描述和分类进行搜索，还可以使用分类筛选和排序功能。"

### 1.4 CRUD 操作演示 (40 秒)

**创建（Create）：**

- 展示已上传的图片列表

**读取（Read）：**

- 点击一张图片，进入详情页
- 展示图片的完整信息：名称、描述、分类、大小、尺寸、格式、上传时间等

**更新（Update）：**

- 在详情页点击"Edit"按钮
- 修改图片的名称、描述和分类
- 保存更改，展示编辑功能

**删除（Delete）：**

- 在"My Pictures"页面选择图片
- 点击删除按钮，确认删除
- 展示批量删除功能（选择多张图片，批量删除）

**说明：**
"系统完整实现了 CRUD 操作。用户可以创建（上传）、读取（查看详情）、更新（编辑信息）和删除图片。还支持批量操作，提高管理效率。"

---

## 第二部分：Azure 后端资源展示 (1.5 分钟)

### 2.1 Azure Portal 资源概览 (30 秒)

**操作：**

- 切换到 Azure Portal
- 展示资源组中的所有资源

**说明：**
"现在让我展示 Azure 后端资源。在 Azure Portal 中，我们可以看到以下资源："

**展示的资源：**

1. **Azure App Service** - 后端应用服务

   - 名称：[您的 App Service 名称]
   - 状态：运行中
   - 部署位置：France Central

2. **Azure Blob Storage** - 图片存储

   - 容器名称：multimedia
   - 用于存储图片文件和缩略图

3. **Azure Cosmos DB (MongoDB API)** - 元数据存储

   - 数据库类型：MongoDB
   - 用于存储图片元数据、用户信息等

4. **Application Insights** - 应用监控（如果有）
   - 用于监控应用性能和错误

### 2.2 RESTful API 端点展示 (30 秒)

**操作：**

- 打开 API 文档或 Postman
- 展示主要的 API 端点

**说明：**
"系统提供了完整的 RESTful API，主要端点包括："

**用户相关 API：**

- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/get/login` - 获取当前登录用户
- `POST /api/user/logout` - 用户登出

**图片相关 API：**

- `POST /api/picture/upload` - 上传图片（Create）
- `GET /api/picture/get/vo?id={id}` - 获取图片详情（Read）
- `POST /api/picture/edit` - 编辑图片信息（Update）
- `POST /api/picture/delete` - 删除图片（Delete）
- `POST /api/picture/list/page/vo` - 分页获取图片列表
- `POST /api/picture/delete/batch` - 批量删除
- `POST /api/picture/edit/batch` - 批量编辑

**API 基础 URL：**

```
https://scaleblemultimediasharingbackend-whw-exf0gpd5fmgkd3er.francecentral-01.azurewebsites.net/api
```

### 2.3 数据库和存储展示 (30 秒)

**操作：**

- 展示 Azure Blob Storage 中的图片文件
- 展示 MongoDB 数据库中的集合和数据

**说明：**
"在 Azure Blob Storage 中，图片按照用户 ID 组织存储，每个用户有自己的目录。MongoDB 数据库中存储了图片的元数据，包括名称、描述、分类、大小、上传者等信息。"

---

## 第三部分：高级功能展示 (1 分钟)

### 3.1 CI/CD 功能 (30 秒)

**操作：**

- 展示 GitHub 仓库
- 展示 GitHub Actions 或 Azure DevOps 的 CI/CD 配置
- 展示部署历史

**说明：**
"系统实现了 CI/CD 自动化部署。当代码推送到 GitHub 主分支时，会自动触发构建和部署流程。这确保了代码更新的快速部署和一致性。"

**如果有 GitHub Actions：**

- 展示工作流文件
- 展示最近的部署记录

### 3.2 应用监控和日志 (30 秒)

**操作：**

- 打开 Application Insights（如果有）
- 展示应用性能指标
- 展示错误日志和请求追踪

**说明：**
"系统集成了 Application Insights 进行应用监控。可以实时查看："

- 应用性能指标（响应时间、吞吐量）
- 错误和异常追踪
- 用户请求分析
- 依赖项监控

**如果没有 Application Insights：**
"虽然系统支持 Application Insights 集成，但在当前部署中，我们主要使用 Azure App Service 的内置日志功能进行监控和故障排查。"

---

## 第四部分：技术架构总结 (30 秒)

### 技术栈总结

**前端：**

- Vue 3 + Vite
- Vue Router（路由管理）
- Pinia（状态管理）
- Axios（HTTP 客户端）

**后端：**

- Spring Boot (Java)
- MongoDB（数据存储）
- Azure Blob Storage（文件存储）

**云服务：**

- Azure App Service（应用托管）
- Azure Blob Storage（对象存储）
- Azure Cosmos DB（NoSQL 数据库）
- CI/CD（持续集成/部署）

**说明：**
"整个解决方案采用了云原生架构，充分利用了 Azure 的托管服务，实现了高可用性、可扩展性和自动化部署。"

---

## 结束语 (10 秒)

"以上就是我的图片共享平台解决方案的完整演示。系统实现了完整的 CRUD 功能，使用了 Azure 的多种云服务，并集成了 CI/CD 和监控功能。感谢大家的观看！"

---

## 演示检查清单

### 应用程序功能

- [ ] 用户注册和登录
- [ ] 图片上传（单张和多张）
- [ ] 图片浏览和搜索
- [ ] 图片详情查看
- [ ] 图片编辑（名称、描述、分类）
- [ ] 图片删除（单个和批量）
- [ ] 分类筛选和排序

### Azure 资源展示

- [ ] Azure App Service
- [ ] Azure Blob Storage
- [ ] Azure Cosmos DB (MongoDB)
- [ ] Application Insights（如果有）

### API 端点

- [ ] 展示主要 API 端点
- [ ] 展示 API 基础 URL
- [ ] 说明 CRUD 操作对应的 API

### 高级功能

- [ ] CI/CD 配置和部署历史
- [ ] Application Insights 或日志功能
- [ ] 其他高级功能（如果有）

---

## 演示技巧

1. **提前准备：**

   - 确保所有服务正常运行
   - 准备测试数据（几张示例图片）
   - 提前打开 Azure Portal 和 GitHub 页面

2. **演示流程：**

   - 按照演讲稿顺序进行
   - 如果某个功能出现问题，继续下一个，不要卡住
   - 保持流畅的节奏

3. **时间控制：**

   - 开场：30 秒
   - 功能演示：2 分钟
   - Azure 资源：1.5 分钟
   - 高级功能：1 分钟
   - 总结：30 秒
   - 总计：约 5 分钟

4. **注意事项：**
   - 说话清晰，语速适中
   - 操作时同步说明
   - 如果可能，打开摄像头
   - 不要播放第一部分的幻灯片
