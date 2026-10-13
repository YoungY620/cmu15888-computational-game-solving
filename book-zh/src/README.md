# CMU 15-888 计算博弈求解

> 本书是卡内基梅隆大学课程 **15-888 Computational Game Solving**（2025 秋季学期，Tuomas Sandholm 教授）的中文精读版。内容全部来源于课程公开发布的材料——讲座幻灯片、课程讲义、每讲指派的 readings（教材章节与论文的开放获取版本）以及作业原文——按原课程结构如实重组：保留全部知识点（定义、定理、证明思路、算法、复杂度界），删去过渡与重复。原始材料的版权属于 CMU 与各位作者；本书仅供学习使用。
>
> English version: click "English" in the top bar.

## 关于这门课

现实世界中的战略交互大多是多步不完全信息博弈——谈判、拍卖、扑克、安全对抗莫不如此。这类博弈引出了完全信息博弈（象棋、围棋）所没有的问题：信号、欺骗、以及对他人欺骗的理解。本课讲授求解这类博弈的基础与最前沿技术：从线性规划与后悔最小化，到 CFR 及其加速、博弈抽象，再到 Libratus、Pluribus 等超人扑克 AI 的完整技术栈，以及深度学习、团队博弈与自动化机制设计等前沿专题。

每讲除幻灯片外还配有课程讲义与指派的 readings（MAS/AGT 教材章节与原始论文）；本书已将这些材料的内容消化后合并进对应章节。

## 章节导览

| 部分 | 内容 |
|---|---|
| 基础（L1–L4） | 博弈表示与解概念；完全信息博弈的树搜索、α-β 剪枝、MCTS 与 AlphaGo/AlphaZero；标准式博弈的 LP 求解、FTRL 与后悔匹配 |
| 不完全信息博弈（L5–L11） | 展开式博弈与 CFR 的构造及收敛证明；相关均衡与 Φ-后悔；乐观主义与最终迭代收敛；CFR 加速（交替、重加权、剪枝、热启动）；博弈抽象（GameShrink、势能感知、带界抽象） |
| 扑克 AI 前沿（L12–L16） | Libratus 三部曲（历史与蓝图、子博弈求解、自我改进器）；知识受限子博弈求解与战争迷雾象棋；Pluribus 多人扑克 |
| 前沿专题（L17–L21） | MCCFR 与 Deep CFR、ESCHER；团队博弈与 TB-DAG；自动化机制设计与信息设计；双预言机、PSRO、AlphaStar 与 OpenAI Five |
| 作业 | HW1：LP 均衡计算（含编程）；HW2：CFR 实现（含编程） |

说明：L20（嘉宾讲座：博弈论 LLM 训练与 DeepNash）未公开幻灯片，本书未收录，其 readings 为 [Perolat et al., Science 2022](https://www.science.org/doi/10.1126/science.add4679)（DeepNash）、[Perolat et al., ICML 2021](https://arxiv.org/abs/2106.00617) 与 [Sokota et al., ICLR 2023](https://arxiv.org/abs/2206.05825)；L22 为期末考试，L23–L26 为学生项目展示。

## 原始资源

- [CMU 15-888 F25 课程主页](https://www.cs.cmu.edu/~sandholm/cs15-888F25/)（幻灯片、讲义、作业）
- 姊妹篇：[MIT 15.S50 扑克理论与分析](https://youngy620.github.io/mit15s50-poker-theory/)（入门向，本课的扑克应用背景）
