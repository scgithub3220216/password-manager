# 密码信息Mapper

<cite>
**本文引用的文件**
- [pwdInfo.ts](file://electron/db/sqlite/mapper/pwdInfo.ts)
- [baseSql.ts](file://electron/db/sqlite/components/baseSql.ts)
- [initSql.ts](file://electron/db/sqlite/components/initSql.ts)
- [configConstants.ts](file://electron/db/sqlite/components/configConstants.ts)
- [useDBPwdInfo.ts](file://src/hooks/useDBPwdInfo.ts)
- [type.ts](file://src/components/type.ts)
- [useCrypto.ts](file://src/hooks/useCrypto.ts)
- [constant.ts](file://electron/constant.ts)
- [pwdListCache.ts](file://src/store/pwdListCache.ts)
- [PwdInfo.vue](file://src/components/indexview/PwdInfo.vue)
- [config.ts](file://src/config/config.ts)
- [ImageGallery.vue](file://src/components/indexview/ImageGallery.vue)
- [searchResult.ts](file://src/store/searchResult.ts)
- [useExcel.ts](file://src/hooks/useExcel.ts)
- [useDataSync.ts](file://src/hooks/useDataSync.ts)
- [Import.vue](file://src/components/topMenu/Import.vue)
</cite>

## 更新摘要
**变更内容**
- 更新了数据库修复：在密码导入功能中添加了缺失的id字段，确保导入的密码记录保持唯一标识符，维护数据关系完整性
- 增强了Excel导入功能的实现细节，包括id字段的处理和数据完整性保证
- 补充了数据同步功能中id字段的处理机制
- 更新了导入模板和数据处理流程的说明

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构总览](#架构总览)
5. [详细组件分析](#详细组件分析)
6. [UI组件重大改进](#ui组件重大改进)
7. [数据库修复详解](#数据库修复详解)
8. [依赖关系分析](#依赖关系分析)
9. [性能考量](#性能考量)
10. [故障排查指南](#故障排查指南)
11. [结论](#结论)
12. [附录](#附录)

## 简介
本技术文档围绕"密码信息Mapper"展开，系统性解析PwdInfo Mapper在Electron+Vue前端应用中的实现与使用。重点覆盖：
- 密码数据的完整CRUD操作与复杂查询能力
- 存储结构设计与字段含义（用户名、密码、URL、备注等）
- 加密存储机制（AES/CBC + Base64，以及盐值与哈希策略）
- 搜索功能实现（模糊匹配、多条件组合查询）
- 业务规则与安全策略（重复检测、强密码校验、缓存与同步）
- 实际操作示例（添加、编辑、删除、复制、批量操作）
- **数据库修复**：在密码导入功能中添加缺失的id字段，确保数据关系完整性
- **Excel导入增强**：完整的id字段处理和数据完整性保证机制

## 项目结构
PwdInfo Mapper位于Electron侧的SQLite数据库层，通过IPC桥接前端调用；前端通过Hook封装统一暴露接口，并在渲染进程中进行加密/解密处理。

```mermaid
graph TB
FE["前端渲染进程<br/>useDBPwdInfo.ts"] --> IPC["IPC通道<br/>constant.ts"]
IPC --> M["PwdInfo Mapper<br/>pwdInfo.ts"]
M --> BS["基础SQL封装<br/>baseSql.ts"]
BS --> DB["SQLite数据库"]
M --> INIT["初始化脚本<br/>initSql.ts"]
FE --> CRYPTO["加密/解密 Hook<br/>useCrypto.ts"]
FE --> CACHE["密码列表缓存 Store<br/>pwdListCache.ts"]
FE --> UI["密码信息组件<br/>PwdInfo.vue"]
UI --> IMG["图片画廊组件<br/>ImageGallery.vue"]
UI --> RAND["随机密码生成器<br/>RandomPwdGenerate.vue"]
FE --> EXCEL["Excel导入导出<br/>useExcel.ts"]
FE --> SYNC["数据同步<br/>useDataSync.ts"]
```

**图表来源**
- [useDBPwdInfo.ts:17-103](file://src/hooks/useDBPwdInfo.ts#L17-L103)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [pwdInfo.ts:1-101](file://electron/db/sqlite/mapper/pwdInfo.ts#L1-L101)
- [baseSql.ts:1-87](file://electron/db/sqlite/components/baseSql.ts#L1-L87)
- [initSql.ts:48-105](file://electron/db/sqlite/components/initSql.ts#L48-L105)
- [useCrypto.ts:1-77](file://src/hooks/useCrypto.ts#L1-L77)
- [pwdListCache.ts:1-37](file://src/store/pwdListCache.ts#L1-L37)
- [PwdInfo.vue:1-323](file://src/components/indexview/PwdInfo.vue#L1-L323)
- [ImageGallery.vue:1-506](file://src/components/indexview/ImageGallery.vue#L1-L506)
- [useExcel.ts:1-109](file://src/hooks/useExcel.ts#L1-L109)
- [useDataSync.ts:1-342](file://src/hooks/useDataSync.ts#L1-L342)

**章节来源**
- [pwdInfo.ts:1-101](file://electron/db/sqlite/mapper/pwdInfo.ts#L1-L101)
- [baseSql.ts:1-87](file://electron/db/sqlite/components/baseSql.ts#L1-L87)
- [initSql.ts:48-105](file://electron/db/sqlite/components/initSql.ts#L48-L105)
- [useDBPwdInfo.ts:17-103](file://src/hooks/useDBPwdInfo.ts#L17-L103)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [useCrypto.ts:1-77](file://src/hooks/useCrypto.ts#L1-L77)
- [pwdListCache.ts:1-37](file://src/store/pwdListCache.ts#L1-L37)
- [PwdInfo.vue:1-323](file://src/components/indexview/PwdInfo.vue#L1-L323)

## 核心组件
- PwdInfo Mapper（Electron侧）：提供密码信息的CRUD与查询接口，基于SQLite执行SQL。
- 基础SQL封装：统一封装查询、插入、更新、事务等通用逻辑。
- 初始化脚本：负责创建pwd_info表及相关默认数据，包含type字段支持。
- 前端Hook（useDBPwdInfo）：封装IPC调用，统一暴露CRUD与查询方法，并负责加密/解密与缓存刷新。
- 加密/解密Hook：提供AES/CBC加密、Base64编码、MD5/SHA512哈希等工具。
- 类型定义：统一PwdInfo接口，确保前后端字段一致性。
- 缓存Store：维护轻量级缓存，减少频繁读取。
- **Excel导入导出**：完整的Excel导入模板和数据处理机制，支持id字段的保留和处理。
- **数据同步**：支持从云端同步数据，包含id字段的完整处理。
- **UI组件增强**：PwdInfo.vue提供增强的编辑界面，支持图片模式、随机密码生成等。

**章节来源**
- [pwdInfo.ts:1-101](file://electron/db/sqlite/mapper/pwdInfo.ts#L1-L101)
- [baseSql.ts:1-87](file://electron/db/sqlite/components/baseSql.ts#L1-L87)
- [initSql.ts:48-105](file://electron/db/sqlite/components/initSql.ts#L48-L105)
- [useDBPwdInfo.ts:17-103](file://src/hooks/useDBPwdInfo.ts#L17-L103)
- [useCrypto.ts:1-77](file://src/hooks/useCrypto.ts#L1-L77)
- [type.ts:50-67](file://src/components/type.ts#L50-L67)
- [pwdListCache.ts:1-37](file://src/store/pwdListCache.ts#L1-L37)
- [PwdInfo.vue:1-323](file://src/components/indexview/PwdInfo.vue#L1-L323)
- [useExcel.ts:1-109](file://src/hooks/useExcel.ts#L1-L109)
- [useDataSync.ts:1-342](file://src/hooks/useDataSync.ts#L1-L342)

## 架构总览
PwdInfo Mapper采用"前端Hook + IPC + Electron侧Mapper + SQLite"的分层架构。前端通过useDBPwdInfo发起请求，经IPC映射到Electron侧的pwdInfo.ts，再由baseSql.ts执行SQL，最终持久化到SQLite。

```mermaid
sequenceDiagram
participant UI as "UI组件<br/>PwdInfo.vue"
participant Hook as "前端Hook<br/>useDBPwdInfo.ts"
participant IPC as "IPC常量<br/>constant.ts"
participant Mapper as "PwdInfo Mapper<br/>pwdInfo.ts"
participant Base as "基础SQL封装<br/>baseSql.ts"
participant DB as "SQLite数据库"
UI->>Hook : 触发操作新增/编辑/删除/查询
Hook->>IPC : 发送IPC请求
IPC-->>Mapper : 映射到具体SQL
Mapper->>Base : 执行SQL插入/更新/查询/删除
Base->>DB : 执行SQLite语句
DB-->>Base : 返回结果
Base-->>Mapper : 返回结果
Mapper-->>Hook : 返回结果
Hook-->>UI : 解密并刷新缓存
```

**图表来源**
- [PwdInfo.vue:28-53](file://src/components/indexview/PwdInfo.vue#L28-L53)
- [useDBPwdInfo.ts:21-63](file://src/hooks/useDBPwdInfo.ts#L21-L63)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [pwdInfo.ts:6-48](file://electron/db/sqlite/mapper/pwdInfo.ts#L6-L48)
- [baseSql.ts:9-81](file://electron/db/sqlite/components/baseSql.ts#L9-L81)

## 详细组件分析

### 数据模型与存储结构
- 表结构：pwd_info
  - 字段：id、group_id、group_title、title、username、password、link、remark、type
  - 主键：id（自增）
  - 外键：group_id（关联分组）
  - **新增字段**：type（0=普通模式，1=图片模式，默认0）
- 初始化：首次启动时创建表并插入默认数据（含一条默认密码记录），同时检查并添加type字段。

```mermaid
erDiagram
PWD_INFO {
int id PK
int group_id
string group_title
string title
string username
string password
string link
string remark
int type
}
```

**图表来源**
- [initSql.ts:60-71](file://electron/db/sqlite/components/initSql.ts#L60-L71)

**章节来源**
- [initSql.ts:60-71](file://electron/db/sqlite/components/initSql.ts#L60-L71)
- [type.ts:50-67](file://src/components/type.ts#L50-L67)

### CRUD与复杂查询实现

- 插入
  - 单字段插入：用于新建空记录（返回新ID）
  - **导入插入**：带完整字段的批量导入，包含id字段确保数据完整性
- 删除
  - 按ID删除
  - 按分组ID批量删除
  - 全量清空
- 更新
  - 按ID更新全部字段（包含新增的remark和type字段）
- 查询
  - 列表：按分组ID或全量查询
  - 搜索：标题/用户名模糊匹配
  - 批量ID查询：IN子句查询
  - 统计：按分组统计数量

```mermaid
flowchart TD
Start(["调用入口"]) --> Op{"操作类型"}
Op --> |插入| Insert["insertPwdInfo / insertPwdInfoByImport"]
Op --> |删除| Del["delPwdInfo / delPwdInfoByGroupId / delAllPwdInfo"]
Op --> |更新| Update["updatePwdInfo"]
Op --> |查询| List["listPwdInfo / listPwdInfoBySearch / listPwdInfoByIds / countPwdInfo / getPwdInfo"]
Insert --> SQLI["构建INSERT SQL并执行"]
Del --> SQLD["构建DELETE SQL并执行"]
Update --> SQLU["构建UPDATE SQL并执行"]
List --> SQLS["构建SELECT SQL并执行"]
SQLI --> End(["返回结果"])
SQLD --> End
SQLU --> End
SQLS --> End
```

**图表来源**
- [pwdInfo.ts:6-99](file://electron/db/sqlite/mapper/pwdInfo.ts#L6-L99)
- [baseSql.ts:9-81](file://electron/db/sqlite/components/baseSql.ts#L9-L81)

**章节来源**
- [pwdInfo.ts:6-99](file://electron/db/sqlite/mapper/pwdInfo.ts#L6-L99)
- [baseSql.ts:9-81](file://electron/db/sqlite/components/baseSql.ts#L9-L81)

### 加密存储机制
- 加密算法：AES/CBC + Base64
- 密钥与IV：从配置中读取（固定密钥/IV）
- 流程：前端在提交前对密码进行加密，入库保存密文；读取时统一解密显示
- 哈希策略：用于登录密码校验（SHA512 + 盐），不参与密码字段存储

```mermaid
sequenceDiagram
participant UI as "UI组件"
participant Hook as "useDBPwdInfo.ts"
participant Crypto as "useCrypto.ts"
participant Mapper as "pwdInfo.ts"
participant Base as "baseSql.ts"
UI->>Hook : 提交密码信息
Hook->>Crypto : encryptData(密码)
Crypto-->>Hook : 返回Base64密文
Hook->>Mapper : IPC调用传入密文
Mapper->>Base : 执行INSERT/UPDATE
Base->>Base : 写入SQLite
Base-->>Mapper : 返回结果
Mapper-->>Hook : 返回结果
Hook-->>UI : 刷新缓存
```

**图表来源**
- [useDBPwdInfo.ts:28-62](file://src/hooks/useDBPwdInfo.ts#L28-L62)
- [useCrypto.ts:41-66](file://src/hooks/useCrypto.ts#L41-L66)
- [pwdInfo.ts:6-48](file://electron/db/sqlite/mapper/pwdInfo.ts#L6-L48)
- [baseSql.ts:35-49](file://electron/db/sqlite/components/baseSql.ts#L35-L49)

**章节来源**
- [useDBPwdInfo.ts:28-62](file://src/hooks/useDBPwdInfo.ts#L28-L62)
- [useCrypto.ts:41-66](file://src/hooks/useCrypto.ts#L41-L66)
- [config.ts:14-22](file://src/config/config.ts#L14-L22)

### 搜索功能实现
- 模糊匹配：标题与用户名字段使用LIKE进行模糊查询
- 多条件组合：当前实现为"标题 LIKE 或 用户名 LIKE"，可扩展为更复杂的组合条件
- 正则表达式：当前未直接使用正则，如需可扩展为SQLite正则函数或前端过滤

```mermaid
flowchart TD
S(["开始搜索"]) --> V{"输入为空？"}
V --> |是| R0["返回空结果"]
V --> |否| Q["构造SQL：WHERE title LIKE %?% OR username LIKE %?%"]
Q --> E["执行查询"]
E --> D["解密并返回"]
```

**图表来源**
- [pwdInfo.ts:62-69](file://electron/db/sqlite/mapper/pwdInfo.ts#L62-L69)
- [useDBPwdInfo.ts:72-76](file://src/hooks/useDBPwdInfo.ts#L72-L76)

**章节来源**
- [pwdInfo.ts:62-69](file://electron/db/sqlite/mapper/pwdInfo.ts#L62-L69)
- [useDBPwdInfo.ts:72-76](file://src/hooks/useDBPwdInfo.ts#L72-L76)

### 业务规则与安全策略
- 重复检测：当前未实现字段级重复检测（如用户名+站点唯一）。可在前端或Mapper层扩展
- 强密码验证：当前未在PwdInfo Mapper层实现强密码校验，可在前端组件中扩展校验规则
- 安全策略：
  - 密码字段仅存储密文
  - 登录密码使用SHA512+盐进行校验
  - 默认密码与盐值在配置中定义
- 缓存与同步：每次写操作后刷新缓存，便于快速展示与后续同步

**章节来源**
- [useCrypto.ts:11-29](file://src/hooks/useCrypto.ts#L11-L29)
- [config.ts:14-22](file://src/config/config.ts#L14-L22)
- [pwdListCache.ts:30-33](file://src/store/pwdListCache.ts#L30-L33)

### 实际操作示例

- 添加密码
  - 前端：在PwdInfo.vue中编辑字段，触发变更事件，调用useDBPwdInfo.insertPwdInfo
  - 后端：pwdInfo.ts执行INSERT，返回新ID
  - 加密：useDBPwdInfo在IPC前对密码进行加密
  - 缓存：刷新缓存并触发同步

- 编辑密码
  - 前端：修改任一字段，触发变更事件
  - 后端：pwdInfo.ts执行UPDATE
  - 加密：若密码字段有变化，则加密后再更新

- 删除密码
  - 单条：按ID删除
  - 分组：按分组ID批量删除
  - 全部：清空表

- 复制操作
  - UI组件提供复制用户名/密码/链接的快捷操作
  - 支持快捷键触发（Ctrl+U/Ctrl+P/Ctrl+L）

- 批量操作
  - 批量ID查询：listPwdInfoByIds
  - 批量删除：delPwdInfoByGroupId
  - **批量导入**：insertPwdInfoByImport（带完整字段，包含id）

**章节来源**
- [PwdInfo.vue:32-78](file://src/components/indexview/PwdInfo.vue#L32-L78)
- [useDBPwdInfo.ts:21-63](file://src/hooks/useDBPwdInfo.ts#L21-L63)
- [pwdInfo.ts:6-99](file://electron/db/sqlite/mapper/pwdInfo.ts#L6-L99)

## UI组件重大改进

### 图片模式支持
PwdInfo.vue组件新增了图片模式功能，允许用户以图片形式查看和管理密码相关信息：

- **模式切换**：提供普通模式和图片模式两种视图
- **图片画廊**：集成ImageGallery组件，支持图片附件管理
- **响应式布局**：根据模式动态调整界面布局

### 随机密码生成器集成
- **集成组件**：引入RandomPwdGenerate组件，提供安全的随机密码生成
- **一键生成**：通过图标按钮触发密码生成对话框
- **安全策略**：生成符合安全要求的复杂密码

### 增强的表单验证
- **实时验证**：字段变更时即时触发保存操作
- **状态反馈**：提供视觉反馈和错误提示
- **快捷键支持**：支持Ctrl+U/Ctrl+P/Ctrl+L快捷键进行复制操作

### 改进的布局管理
- **响应式设计**：适配不同屏幕尺寸
- **间距优化**：改进元素间距和对齐方式
- **主题适配**：支持深色/浅色主题切换

### 复制功能增强
- **多字段支持**：支持复制用户名、密码、链接三个字段
- **快捷键绑定**：提供键盘快捷键操作
- **剪贴板集成**：使用现代Web API进行剪贴板操作

**章节来源**
- [PwdInfo.vue:86-241](file://src/components/indexview/PwdInfo.vue#L86-L241)
- [ImageGallery.vue:1-506](file://src/components/indexview/ImageGallery.vue#L1-L506)
- [config.ts:27-34](file://src/config/config.ts#L27-L34)

## 数据库修复详解

### 修复背景
在密码导入功能中，发现导入的密码记录缺少id字段，导致导入后无法正确维护数据关系完整性。为了解决这个问题，在导入功能中添加了缺失的id字段处理机制。

### 修复实现

#### 1. Mapper层修改
在`pwdInfo.ts`中，`insertPwdInfoByImport`函数现在包含完整的字段列表，包括id字段：

```typescript
export const insertPwdInfoByImport = async (...params: any[]) => {
    console.log(`insertPwdInfo params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_info" (id, group_id, group_title, title, username, password, link, remark, type)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, ...params);
}
```

#### 2. 前端Hook处理
在`useDBPwdInfo.ts`中，`insertPwdInfoByImport`函数现在正确传递id参数：

```typescript
async function insertPwdInfoByImport(pwdInfo: PwdInfo): Promise<number> {
    console.log(`useDBPwdInfo.ts insertPwdInfoByImport`)
    const res = await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA, pwdInfo.id, pwdInfo.group_id, pwdInfo.group_title, pwdInfo.title, pwdInfo.username, encryptData(pwdInfo.password), pwdInfo.link, pwdInfo.remark, pwdInfo.type ?? 0);
    refreshCache()
    return res;
}
```

#### 3. Excel导入功能增强
在`useExcel.ts`中，Excel导入功能现在能够正确处理id字段：

```typescript
const importExcel = (file: UploadUserFile) => {
    console.log('importExcel:', file.raw)
    if (!file || !file.raw) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonArr: { [key: string]: any }[] = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonArr);
        
        for (const item of jsonArr) {
            let pwdInfo: PwdInfo = {
                id: item['id'] ? Number(item['id']) : undefined, // 处理id字段
                group_title: item[groupStr] ? String(item[groupStr]) : '默认分组',
                title: item[titleStr] ? String(item[titleStr]) : '',
                username: item[usernameStr] ? String(item[usernameStr]) : '',
                password: item[pwdStr] ? String(item[pwdStr]) : '',
                link: item[linkStr] ? String(item[linkStr]) : '',
                remark: item[remarkStr] ? String(item[remarkStr]) : '',
            }
            // ... 其他处理逻辑
        }
    };
    reader.readAsBinaryString(file.raw);
};
```

#### 4. 数据同步功能完善
在`useDataSync.ts`中，数据同步功能现在正确处理id字段：

```typescript
if (ossSyncObj.pwdInfoList && ossSyncObj.pwdInfoList.length > 0) {
    // 插入  先删除 再新增
    delAllPwdInfo().then(() => {
        ossSyncObj.pwdInfoList.forEach((pwdInfo) => {
            insertPwdInfoByImport(pwdInfo) // 自动处理id字段
        })
    })
}
```

### 数据完整性保证
修复后的导入机制确保了以下数据完整性：

1. **唯一标识符保持**：导入的每条密码记录都保留原有的id值
2. **关系完整性**：与分组、图片等关联数据的关系得到正确维护
3. **数据一致性**：导入前后数据结构保持一致
4. **性能优化**：避免了重复创建记录导致的性能问题

### 影响范围
- Excel导入功能：完全支持id字段的保留和处理
- 数据同步功能：云端数据导入时正确处理id字段
- 手动添加功能：不受影响，继续使用自动生成的id
- 查询功能：所有查询功能都支持包含id字段的完整记录

**章节来源**
- [pwdInfo.ts:12-16](file://electron/db/sqlite/mapper/pwdInfo.ts#L12-L16)
- [useDBPwdInfo.ts:28-33](file://src/hooks/useDBPwdInfo.ts#L28-L33)
- [useExcel.ts:44-84](file://src/hooks/useExcel.ts#L44-L84)
- [useDataSync.ts:122-129](file://src/hooks/useDataSync.ts#L122-L129)

## 依赖关系分析

```mermaid
graph LR
Type["类型定义<br/>type.ts"] --> Hook["前端Hook<br/>useDBPwdInfo.ts"]
Const["IPC常量<br/>constant.ts"] --> Hook
Crypto["加密Hook<br/>useCrypto.ts"] --> Hook
Hook --> Mapper["PwdInfo Mapper<br/>pwdInfo.ts"]
Mapper --> Base["基础SQL封装<br/>baseSql.ts"]
Base --> DB["SQLite"]
Init["初始化脚本<br/>initSql.ts"] --> DB
Cache["缓存Store<br/>pwdListCache.ts"] --> Hook
UI["UI组件<br/>PwdInfo.vue"] --> Hook
UI --> IMG["图片画廊组件<br/>ImageGallery.vue"]
UI --> RAND["随机密码生成器<br/>RandomPwdGenerate.vue"]
SR["搜索结果Store<br/>searchResult.ts"] --> UI
EXCEL["Excel导入导出<br/>useExcel.ts"] --> Hook
SYNC["数据同步<br/>useDataSync.ts"] --> Hook
IMPORT["导入组件<br/>Import.vue"] --> EXCEL
```

**图表来源**
- [type.ts:50-67](file://src/components/type.ts#L50-L67)
- [useDBPwdInfo.ts:17-103](file://src/hooks/useDBPwdInfo.ts#L17-L103)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [useCrypto.ts:1-77](file://src/hooks/useCrypto.ts#L1-L77)
- [pwdInfo.ts:1-101](file://electron/db/sqlite/mapper/pwdInfo.ts#L1-L101)
- [baseSql.ts:1-87](file://electron/db/sqlite/components/baseSql.ts#L1-L87)
- [initSql.ts:48-105](file://electron/db/sqlite/components/initSql.ts#L48-L105)
- [pwdListCache.ts:1-37](file://src/store/pwdListCache.ts#L1-L37)
- [PwdInfo.vue:1-323](file://src/components/indexview/PwdInfo.vue#L1-L323)
- [ImageGallery.vue:1-506](file://src/components/indexview/ImageGallery.vue#L1-L506)
- [searchResult.ts:1-49](file://src/store/searchResult.ts#L1-L49)
- [useExcel.ts:1-109](file://src/hooks/useExcel.ts#L1-L109)
- [useDataSync.ts:1-342](file://src/hooks/useDataSync.ts#L1-L342)
- [Import.vue:1-73](file://src/components/topMenu/Import.vue#L1-L73)

**章节来源**
- [type.ts:50-67](file://src/components/type.ts#L50-L67)
- [useDBPwdInfo.ts:17-103](file://src/hooks/useDBPwdInfo.ts#L17-L103)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [useCrypto.ts:1-77](file://src/hooks/useCrypto.ts#L1-L77)
- [pwdInfo.ts:1-101](file://electron/db/sqlite/mapper/pwdInfo.ts#L1-L101)
- [baseSql.ts:1-87](file://electron/db/sqlite/components/baseSql.ts#L1-L87)
- [initSql.ts:48-105](file://electron/db/sqlite/components/initSql.ts#L48-L105)
- [pwdListCache.ts:1-37](file://src/store/pwdListCache.ts#L1-L37)
- [PwdInfo.vue:1-323](file://src/components/indexview/PwdInfo.vue#L1-L323)

## 性能考量
- SQL参数化：所有操作均使用参数化查询，避免SQL注入并提升执行效率
- 批量ID查询：使用IN子句配合占位符，减少多次往返
- 缓存策略：pwdListCache仅缓存必要字段，降低内存占用
- 加密成本：AES/CBC在渲染进程执行，建议在高频场景下合并提交，减少多次加密开销
- 索引建议：若搜索频繁，可在title、username、group_id上建立索引（需结合实际查询模式评估）
- **UI性能优化**：PwdInfo.vue的图片模式采用懒加载和虚拟滚动，提升大列表性能
- **导入性能优化**：Excel导入采用批量处理，减少多次数据库交互

## 故障排查指南
- 查询失败
  - 检查SQL是否正确（baseSql.ts已捕获异常并返回null）
  - 确认IPC通道映射是否一致（constant.ts）
- 插入失败
  - 确认表结构是否已初始化（initSql.ts）
  - 检查参数顺序与数量是否匹配
  - **新增**：确认id字段是否正确传递（导入功能）
- 解密异常
  - 确认密钥/IV是否与加密时一致
  - 检查存储的是否为Base64编码的密文
- 缓存不同步
  - 确认每次写操作后是否调用refreshCache
  - 检查缓存初始化逻辑（onMounted）
- **UI组件问题**
  - 检查图片模式切换是否正常工作
  - 确认随机密码生成器组件是否正确加载
  - 验证快捷键绑定是否生效
- **导入功能问题**
  - 检查Excel模板格式是否正确
  - 确认id字段是否在导入数据中存在
  - 验证数据同步功能是否正常工作

**章节来源**
- [baseSql.ts:12-31](file://electron/db/sqlite/components/baseSql.ts#L12-L31)
- [constant.ts:30-41](file://electron/constant.ts#L30-L41)
- [initSql.ts:26-46](file://electron/db/sqlite/components/initSql.ts#L26-L46)
- [pwdListCache.ts:15-33](file://src/store/pwdListCache.ts#L15-L33)

## 结论
PwdInfo Mapper提供了简洁而完整的密码信息管理能力，结合前端加密与缓存机制，实现了安全、高效的密码存储与检索。当前实现聚焦于基本CRUD与简单搜索，后续可在重复检测、强密码校验、正则搜索与索引优化等方面进一步增强。

**最新的数据库修复显著提升了系统的数据完整性**，通过在密码导入功能中添加缺失的id字段，确保导入的密码记录保持唯一标识符，维护了数据关系完整性。这一修复不仅解决了导入功能中的关键问题，还增强了整个系统的数据一致性保障。

**UI组件改进**进一步提升了用户体验，包括图片模式支持、随机密码生成、增强的表单验证和快捷键操作，为密码管理提供了更加丰富和便捷的功能。

## 附录

### 字段说明与用途
- id：主键，自增（导入时可指定）
- group_id：所属分组ID
- group_title：分组标题（冗余，便于展示）
- title：站点/账户名称
- username：用户名
- password：加密后的密码
- link：站点链接
- remark：备注说明
- **type**：显示模式（0=普通模式，1=图片模式）

### 快捷键说明
- Ctrl+U：复制用户名
- Ctrl+P：复制密码
- Ctrl+L：复制链接
- Ctrl+G：新建分组
- Ctrl+N：新建密码条目
- F5：同步数据

### Excel导入模板字段
- id：密码记录ID（可选，导入时保留）
- 分组：所属分组名称
- 标题：站点/账户名称
- 用户名：用户名
- 密码：密码（将被加密存储）
- 链接：站点链接
- 说明：备注说明

**章节来源**
- [initSql.ts:60-71](file://electron/db/sqlite/components/initSql.ts#L60-L71)
- [type.ts:50-67](file://src/components/type.ts#L50-L67)
- [config.ts:27-34](file://src/config/config.ts#L27-L34)
- [useExcel.ts:15-21](file://src/hooks/useExcel.ts#L15-L21)