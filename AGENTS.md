# AGENTS 指南
本指南面向在本仓库中运行的所有智能代理，说明构建、调试与编码风格要求。
默认语言为中文，如需对外展示英文内容请在 PR 描述中说明理由。

---

## 1. 使用范围
- 本文件适用于仓库根目录及其全部子目录，当前无额外子级 AGENTS 覆盖。
- 部分库提供的 `.llms.txt` 存放在 `.opencode/doc/` 下。
- 遇到新的指令文件时，需与本指南交叉验证后执行，就近优先。
- 若需覆盖本指南的特殊场景，请在对应目录新增更具体的 AGENTS。

## 2. 工具链与前置条件
- Node.js：建议使用 LTS（>=18），与 `@tsconfig/node-lts` 设置保持一致。
- 包管理器：锁定 `pnpm@10.28.0`，所有命令以 `pnpm` 开头。
- 依赖安装：初次克隆后运行 `pnpm install`，工作区依赖会按 `pnpm-workspace.yaml` 分发。
- 环境变量：服务端依赖 `DB_FILE_NAME`（SQLite/LibSQL 连接字符串），开发时可在根 `.env` 设置。

## 3. 仓库结构速览
- `packages/client`：Solid + UnoCSS 前端，使用 Vite。
- `packages/server`：Hono 服务 + Drizzle ORM + Vitest 测试。
- `vitest.config.ts`：跨包测试入口，自动聚合 `packages/*`。
- `biome.jsonc`：全局格式化与 Lint 规则，前端局部 `biome.jsonc` 仅做继承占位。
- `tsconfig.base.json`：严格 TypeScript 配置，客户端/服务端继承并增补。
- 其他工具：`drizzle.config.ts` 用于迁移输出，`unocss.config.ts` 控制原子类预设。

## 4. 常用运行命令
- 启动全栈开发：`pnpm dev`（并行运行 `dev:client` 与 `dev:server`）。
- 单独启动客户端：`pnpm dev:client`，默认端口 1337。
- 单独启动服务端：`pnpm dev:server`，遵循 Vite Hono Dev Server。
- 构建客户端：`pnpm -C packages/client build`，产物输出至 `packages/client/dist`。
- 构建服务端：`pnpm -C packages/server build`，产物由 `@hono/vite-build` 生成。
- 预览客户端：`pnpm -C packages/client preview`；服务端可使用 `pnpm -C packages/server preview` 验证。

## 5. 测试策略
- 全仓库测试：`pnpm vitest`，读取根 `vitest.config.ts` 并平行执行各项目测试。
- 针对工作区执行：`pnpm vitest packages/server` 会聚焦服务器包。
- 推荐在提交前执行最小必要测试，确保核心路由与 API 覆盖。
- 使用 `vitest --ui` 可启动内置 UI（如环境允许）。
- 端到端测试暂未接入，若需请在本指南更新章节中提案。

## 6. 运行单个测试
- 指定文件：`pnpm vitest packages/server/src/test/hello.test.ts`。
- 指定测试名：`pnpm vitest packages/server/src/test/hello.test.ts -t "hello"`。
- 观察值稳定性：Vitest 默认使用 in-memory 模式，可通过 `--runInBand` 控制顺序执行。
- 若测试依赖环境变量，建议在命令前临时导出：`DB_FILE_NAME=:memory: pnpm vitest ...`。
- 新增测试文件保持 `*.test.ts` 命名，存放于与实现同级或 `src/test` 目录。

## 7. Lint 与格式化
- 全局 Lint：`pnpm lint`（运行 `biome lint --write .`，会在安全场景下尝试自动修复）。
- 全局格式化：`pnpm format`（`biome format --write .`）。
- 避免使用 Prettier/ESLint 混合配置，统一交给 Biome。
- CI 未启用时，请本地运行 Lint/Format，避免 PR 中出现格式差异。
- Biome 已开启 `organizeImports`，无需手动排序。

## 8. Imports 与模块组织
- 导入顺序：外部依赖 → 工作区/相对模块 → 样式/资源。
- 同一来源的类型和值分离导入：`import type { Foo } from "...";` 与 `import { bar } ...`。
- `tsconfig` 开启 `verbatimModuleSyntax`，务必保持导入语句与导出形式一致。
- Solid 组件请使用相对路径并避免深层级 `../..`，可利用 `baseUrl`。
- 禁止隐式依赖 `node_modules` 中未声明的包——先在 `package.json` 中登记。

## 9. 格式化与语法细节
- 使用 2 空格缩进，行宽 120，行尾统一 LF。
- TypeScript 需显式 `async/await`，避免回调地狱；禁止裸 `any`，必要时以 `unknown` + 类型守卫替代。
- JSX 属性使用双引号，遵循 Biome `jsxQuoteStyle: "double"` 设置。
- 箭头函数始终包裹参数括号（Biome `arrowParentheses: "always"`）。
- 对象字面量保持简洁，必要时使用扩展运算符避免 `Object.assign`。

## 10. 命名约定
- 文件：React/Solid 组件使用帕斯卡命名（如 `UserCard.tsx`），工具与钩子使用骆驼命名。
- 常量使用 `const VALUE_NAME = ...` 并仅用于不可变数据。
- 类型与接口以 `PascalCase` 命名，如 `UserSession`；泛型参数使用单字母 + 描述（如 `TData`）。
- 路由路径保持小写短划线风格 `/user-profile`，Hono 端点返回结构需明确。
- 测试描述采用自然语言：`test("hello returns name", ...)`。

## 11. 错误处理与日志
- Hono 处理器应返回结构化错误（JSON 或文本），避免未捕获异常导致 500。
- 使用 `try/catch` 包裹外部 I/O（数据库、HTTP），记录 `logger` 中间件会自动输出基本信息。
- 对于客户端，优先通过 Solid 的 `ErrorBoundary` 或资源状态显示错误。
- 禁用 `console.log` 调试残留，若确需日志请使用 `console.error` 或 `logger`。
- 抛出错误时包含可读信息，遵循 `new Error("User not found")` 格式。

## 12. 客户端约定（packages/client）
- Solid 组件使用函数式写法并返回单根节点。
- 资源加载使用 `createResource`，确保提供回退 UI。
- 样式使用 UnoCSS 原子类；若需全局样式请在 `index.css` 或 `uno.config` 中新增。
- 保持 SSR 兼容：避免在顶层访问 `window`/`document`，在 `onMount` 内处理。
- 与服务器通信首选 `hc<AppType>()` 客户端，保持类型安全。

## 13. 服务端约定（packages/server）
- 路由通过 `new Hono()` 构建并以 `.route("/path", childApp)` 组合。
- 使用 `@hono/zod-validator` 验证请求参数，所有输入都需 Schema 约束。
- 导出 API 类型：`export type AppType = typeof app;`，供客户端生成强类型客户端。
- 中间件目录 `src/middleware` 目前为空，如新增请按用途命名文件。
- 测试基于 `testClient(app)`，优先覆盖路由及验证逻辑。

## 14. 数据访问与 Drizzle
- `src/db/driver.ts` 封装 Drizzle 连接，引用时直接 `import db from "db/driver"`。
- `DB_FILE_NAME` 可指向本地文件或 LibSQL 远程端点，注意敏感信息通过 `.env` 注入。
- Schema 建议集中在 `src/db/schema.ts`，拆分表结构时保持单一导出入口。
- 更新 Schema 后运行 `pnpm -C packages/server drizzle-kit generate`（若后续脚本添加）。
- 不要在路由中直接写 SQL 字符串，统一通过 Drizzle API。

## 15. CSS/UnoCSS 规范
- `uno.css` 需在入口导入一次，避免重复注入。
- Uno 预设当前仅启用 `presetMini`，如需自定义请在 `unocss.config.ts` 中扩展。
- 将语义化样式拆分为组合类，禁止在组件中散落硬编码颜色值。
- 若必需编写传统 CSS，请置于 `src/styles` 并在组件中按需引入。
- 不允许引入 Tailwind CLI，保持 UnoCSS 统一性。

## 16. TypeScript & 类型安全
- 严格模式已启用：`strict`, `noImplicitAny`, `exactOptionalPropertyTypes` 等，勿尝试放宽。
- 客户端 JSX `jsx: "preserve"` + `jsxImportSource: "solid-js"`，不要更改。
- 服务端禁止直接导入 TS 扩展（`allowImportingTsExtensions: false`），保持编译输出纯 ESM。
- 类型推导不明确时偏向显式注解，尤其是 API 响应与资源状态。
- 使用 `satisfies` 进行结构验证比 `as` 更安全，尽量避免类型断言。

## 17. 提交流程
- 在完成功能后：`pnpm lint && pnpm vitest`（或更小范围命令）确保无报错。
- Git 提交遵循英文动词短语（如 `feat: add hello route`），必要时在描述中附中文解释。
- 不要提交 `.env`、`dist`、数据库文件或 `pnpm-lock.yaml` 之外的锁定文件。
- PR 描述需列出运行过的命令，方便审查。
- 对于跨包变更请在描述中说明影响范围。

## 18. 文档与维护
- 如需更新本指南，请保持段落结构一致并注明新增章节。
- 任何偏离默认流程的工程脚本（如额外测试、生成步骤）都应在此记录。
- 若引入新的代码风格工具（如 ESLint、Prettier），必须在这里声明冲突解决策略。
- 变更后建议运行 `wc -l AGENTS.md` 确认长度仍在 ~150 行范围内。
- 本文档最后编辑日期应在 PR 描述中同步。

## 19. 常见问题
- Solid 组件无法获取 root：确认 `index.html` 中存在 `id="root"`。
- Hono 返回 404：检查路由是否使用 `.route` 或 `app.get("/path", handler)`。
- 测试无法连接数据库：可临时设置 `DB_FILE_NAME=:memory:` 使用内存 SQLite。
- Uno 样式不生效：确认 `uno.css` 已在入口导入并运行 `pnpm dev` 重新构建。
- Biome 无法运行：确保版本 `2.3.11` 已安装，`pnpm dlx biome --version` 可用于验证。

## 20. 后续扩展建议
- 若新增 E2E 测试，可在 `packages/tests-e2e` 建立新包并扩展 `vitest.config.ts`。
- 引入 Storybook/Playwright 等工具需在本文件添加专节以提醒其他代理。
- 推荐引入 GitHub Actions 运行 `pnpm lint` 与 `pnpm vitest`，届时在此说明。
- 若增加国际化或多主题支持，请补充相关样式与状态管理约定。
- 鼓励在 PR 中提出对本指南的改进点。
