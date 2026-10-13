# 作业 2：CFR 实现

- 课程：15-888 Computational Game Solving（Fall 2025）
- 发布日期：2025 年 10 月 12 日；截止日期：2025 年 10 月 31 日
- 总分：100 分（第一题 20 分 + 第二题 30 分 + 第三题 50 分）

**提交要求**：在 Gradescope 上提交。提交**一个 pdf 文件**，其中**同时**包含你的书面解答**和**附在末尾的代码（例如使用 `verbatim` 环境附上）。你可以（但不强制）使用作业 `.zip` 中提供的 `.tex` 文件来排版书面解答。

## 题目

### 第一题：（粗）相关均衡与劣势动作（20 分）

如果对每一种可能的对手动作组合 $a_{-i}$ 都有 $u_i(a_i, a_{-i}) > u_i(a_i', a_{-i})$，则称动作 $a_i \in \mathcal{A}_i$ **严格占优**（strictly dominates）于动作 $a_i' \in \mathcal{A}_i$，此时称 $a_i'$ 为**严格劣势**（strictly dominated）动作。如果 $a_i$ 严格占优于其他所有动作，则称其为**严格占优（strictly dominant）动作**。

**问题 1.1（5 分）** 证明：如果动作 $\hat a_i \in \mathcal{A}_i$ 是严格占优动作，那么在每一个粗相关均衡（coarse correlated equilibrium, CCE）中，玩家 $i$ 以概率 $1$ 选择 $\hat a_i$。

**问题 1.2（5 分）** 证明：如果动作 $\hat a_i \in \mathcal{A}_i$ 是严格劣势动作，那么在每一个相关均衡（correlated equilibrium, CE）中，玩家 $i$ 以概率 $0$ 选择 $\hat a_i$。

**问题 1.3（10 分）** 证明：存在某个标准式博弈（normal-form game）以及该博弈中的某个 CCE，使得玩家 1 以严格正的概率选择一个严格劣势动作。

> 提示：考虑标准式博弈
>
> $$
> \begin{bmatrix}
> (2, 2) & (0, 0) \\
> (1, 1) & (1, 1) \\
> (0, 0) & (0, 0)
> \end{bmatrix}.
> $$
>
> 证明该博弈中存在具有所需性质的 CCE。

### 第二题：安全抽象（Safe Abstraction，30 分）

考虑按如下方式进行的双人零和扩展式博弈 $\Gamma$。

**第 1 步：**

- 每位玩家 $i \in \{1, 2\}$ 私下掷一枚公平的 $n$ 面骰子，并观察其结果 $\theta_i \in \{1, \dots, n\}$。
- 两位玩家同时从某个大小为 $m$ 的动作集 $\mathcal{A}$ 中选择动作 $a_1, a_2$。

**第 2 步：**

- 每位玩家 $i \in \{1, 2\}$ 再私下掷一枚公平的 $n$ 面骰子，并观察其结果 $\theta_i' \in \{1, \dots, n\}$。
- 两位玩家再次同时选择动作 $a_1, a_2 \in \mathcal{A}$。

玩家 1 的效用（这是零和博弈：玩家 2 的效用是玩家 1 的相反数）只依赖于两个和 $\theta_1 + \theta_1'$、$\theta_2 + \theta_2'$ 以及动作 $a_1, a_2, a_1', a_2'$。也就是说，每位玩家只关心自己两枚骰子的**和**，而不关心各自的点数。

注意，玩家 $i$ 的一个决策点（信息集，information set）可以用 $\theta_i$（第 1 步）或元组 $(\theta_i, \vec a, \theta'_i)$（第 2 步）来标识，其中 $\vec a = (a_1, a_2)$。

#### 2.1 热身

**问题 2.1（3 分）** 用 $m$ 和 $n$ 表示：这个博弈有多少个**终端节点**（terminal nodes）？每位玩家有多少个**信息集**？**序列**（sequences）又有多少？（无需证明，直接给出答案即可。）

#### 2.2 对称策略与 CFR

设 $j_i = (\theta_i, a_i, a_{-i}, \theta_i')$ 和 $\tilde j_i = (\tilde \theta_i, a_i, a_{-i}, \tilde \theta_i')$ 是同一玩家 $i$ 在第 2 步的两个信息集。如果 $\theta_i + \theta_i'= \tilde\theta_i + \tilde\theta_i'$（注意这迫使两个信息集中的动作集相同），则称 $j_i$ 与 $\tilde j_i$ **等价**（equivalent）。

如果等价的信息集具有相同的动作分布，即只要 $j_i, j_i'$ 等价就有 $\vec{b}_i(\cdot|j_i) = \vec{b}_i(\cdot|j_i')$，则称行为策略（behavioral strategy）$\vec{b}_i : \mathcal{J}_i \to \Delta(\mathcal{A})$ 为**对称的**（symmetric），其中 $\mathcal{J}_i$ 是玩家 $i$ 的信息划分。

假设两位玩家都运行使用同时（simultaneous，而非交替）更新的 CFR。设 $\vec{b}_i^{(t)}$ 为玩家 $i$ 在时刻 $t$ 所采用的行为策略。在 CFR 中，时刻 $t$ 传给信息集 $j_i \in \mathcal{J}_i$ 处遗憾最小化器的反事实效用为

$$
u_i^{(t)}(a_i|j_i) = \sum_{\substack{h \in j_i\\z \succeq ha}} \vec{b}_i^{(t)}(z|(h,a_i)) \cdot  \vec{b}_{-i}^{(t)}(z)\cdot c(z) \cdot u_i(z), \tag{1}
$$

其中

- $(h, a_i)$ 是从节点 $h$ 出发执行动作 $a_i$ 到达的子节点；
- 求和范围是所有以 $(h,a_i)$（$h \in j_i$）为祖先的终端节点 $z$；
- $\vec{b}_i(z|(h,a_i))$ 是玩家 $i$ 在 $(h, a_i) \to z$ 路径上执行所有动作的概率；
- $\vec{b}_{-i}(z)$（相应地 $c(z)$）是对手（相应地机会/chance）在从根节点到 $z$ 的路径上执行所有动作的概率；
- $u_i(z)$ 是终端节点 $z$ 对玩家 $i$ 的效用。

**问题 2.2（8 分）** 设 $\vec{b}_i^{(t)} : \mathcal{J}_i \to \Delta(\mathcal{A})$ 是 CFR 中玩家 $i$ 在时刻 $t$ 采用的行为策略。证明：如果 $\vec{b}_{-i}^{(1)}, \dots, \vec{b}_{-i}^{(t-1)}$ 都是对称的，那么 $\vec{b}_{i}^{(1)}, \dots, \vec{b}_{i}^{(t)}$ 也都是对称的。

> 提示：给定两个等价的信息集 $(\theta_i, \vec a, \theta_i')$、$(\tilde \theta_i, \vec a, \tilde \theta_i')$，证明这两个信息集在每个时刻 $t$ 都会观察到相同的反事实效用 $u_i^{(t)}(\cdot|j)$。

由归纳法可知，两位玩家在所有时刻都将采用对称策略。在本题剩余部分中请使用这一事实。

**问题 2.3（8 分）** 证明：在这个博弈中，CFR 每次迭代可以在 $O(n^2m^4)$ 时间内实现。简要讨论：这一时间复杂度与 CFR 的朴素实现（其运行时间与树中节点数呈线性关系）相比如何？

> 提示：由于你刚刚证明的对称性条件，许多信息集互为“副本”，你不需要存储同一信息集的多个副本。朴素计算是行不通的——你需要巧妙地跨信息集复用计算结果。

#### 2.3 不完美回忆抽象

现在考虑 $\Gamma$ 的不完美回忆（imperfect-recall）抽象：等价的信息集被合并成更大的信息集。也就是说，第 2 步的信息集现在由元组 $(\theta_i^*, \vec a)$ 标识，其中 $\theta_i^* = \theta_i + \theta_i'$。称这个博弈为 $\hat\Gamma$。我们用公式 (1) 来定义不完美回忆博弈中的 CFR。

一般来说，在不完美回忆的零和博弈上运行 CFR **并不**保证收敛到纳什均衡（即使是平均意义下），但你将证明：**在这一类特定的博弈中**，CFR 是有效的。

**问题 2.4（8 分）** 证明：当局部遗憾最小化器采用遗憾匹配（regret matching）时，在 $\hat\Gamma$ 上运行 CFR 产生的迭代序列与在 $\Gamma$ 上运行 CFR 相同。

> 提示：先做下一题再做本题。

**问题 2.5（3 分）** 你在上一题中的证明应当用到了（各类变体的）遗憾匹配特有的一个性质。这个性质是什么？假设我们改为在 $\Gamma$ 中的每个信息集处以正则化参数 $\eta$ 运行 FTRL（跟随正则化领导者）的 CFR。那么我们需要对 $\hat\Gamma$ 中的 $\eta$ 做什么修改，才能恢复相同的迭代序列？（无需证明——直接陈述修改即可。）

### 第三题：反事实遗憾最小化（50 分）

本题中，你将实现面向序列形式决策问题的 CFR 遗憾最小化器。

你将在三个博弈上运行你的 CFR 实现：石头-剪刀-超级剪刀（rock-paper-superscissors：石头-剪刀-布的一个简单变体，其中用剪刀赢布得到的收益是 $2$ 而不是 $1$），以及两个著名的扑克变体：Kuhn 扑克（Kuhn poker）和 Leduc 扑克（Leduc poker）。每个博弈的描述在作业的 zip 文件中给出，格式见下文“编程任务”一节；zip 中还包含一个帮助搭建实现的 Python stub 文件。

#### 3.1 学习最优反应

玩家 1 和玩家 2 各自面对一个树形序贯决策过程，设 $\mathcal{X}$ 和 $\mathcal{Y}$ 分别为二者对应的序列形式策略多胞形。

实现遗憾最小化算法时，一个好的冒烟测试（smoke test）是验证它们能学会最优反应（best respond）。特别地，你将验证：当玩家 2 采用**均匀**（uniform）策略——即在每个决策点以相等概率选取任一可用动作的策略——时，应用于玩家 1 决策问题的 CFR 实现能学会对玩家 2 的最优反应。

玩家 2 的策略“在每个决策点以相等概率选取每个可用动作”，其序列形式表示记为 $\vec{y}_{\text{uni}} \in \mathcal{Y}$。当玩家 2 按该策略行动时，玩家 1 的效用向量由 $\vec{u} \coloneqq \mathbf{A} \vec{y}_{\text{uni}}$ 给出，其中 $\mathbf{A}$ 是博弈的收益矩阵。

对每个博弈，取你应用于玩家 1 决策问题的 CFR 实现，让它输出策略 $\vec{x}^{(t)} \in \mathcal{X}$，同时在每个时刻 $t$ 都给予相同的效用向量 $\vec{u}$ 作为反馈。当 $T \to \infty$ 时，平均策略

$$
\bar{\vec{x}}^{(T)} \coloneqq \frac{1}{T} \sum_{t=1}^T \vec{x}^{(t)} \in \mathcal{X} \tag{2}
$$

将收敛到对均匀策略 $\vec{y}_{\text{uni}}$ 的最优反应，即

$$
\lim_{T\to\infty} \langle \bar{\vec{x}}^{(T)}, \mathbf{A} \vec{y}_{\text{uni}} \rangle = \max_{\hat{\vec{x}}\in \mathcal{X}}  \hat{\vec{x}}^\top \mathbf{A} \vec{y}_{\text{uni}}.
$$

如果上述收敛在实验中没有发生，说明你的实现有问题。

**问题 3.1.1（15 分）** 在每个博弈中，将你的 CFR 实现应用于玩家 1 的树形序贯决策问题，每个决策点处的局部遗憾最小化器使用遗憾匹配算法（第 4 讲）。在每个时刻 $t$，给算法的反馈都是同一个效用向量 $\vec{u} = \mathbf{A} \vec{y}_{\text{uni}}$，其中 $\vec{y}_{\text{uni}} \in \mathcal{Y}$ 是玩家 2 的均匀策略。运行算法 $1000$ 次迭代。每次迭代 $T = 1,\dots,1000$ 之后，计算数值 $v^{(T)} \coloneqq \langle \bar{\vec{x}}^{(T)}, \mathbf{A} \vec{y}_{\text{uni}} \rangle$，其中 $\bar{\vec{x}}^{(T)} \in \mathcal{X}$ 是式 (2) 定义的、CFR 迄今输出的平均策略。

画出 $v^{(T)}$ 随 $T$ 变化的图像。你从实验中观察到 $v^{(T)}$ 收敛到的极限是多少？

> 提示：
>
> - 把 $\mathbb{R}^{|\Sigma|}$ 上的向量（包括 CFR 输出的序列形式策略和传给 CFR 的效用向量）在内存中表示为从序列（元组 `(decision_point_id, action)`）到浮点数的字典。
> - 在石头-剪刀-超级剪刀中，$v^{(T)}$ 应接近 $\frac{1}{3}$；在 Kuhn 扑克中，应接近 $\frac{1}{2}$；在 Leduc 扑克中，应接近 $2.0875$。

答案中应包含三张图（每个博弈一张）和三个数值，并提交你的实现。

#### 3.2 学习纳什均衡

既然你已经确信自己的 CFR 实现是正确的，接下来你将用第 3 讲所述的**自对弈**（self-play）思想，让 CFR 收敛到纳什均衡。

在双人零和博弈中用遗憾最小化收敛到纳什均衡，其思想是实例化两个遗憾最小化算法 $\mathfrak{R}_\mathcal{X}$ 和 $\mathfrak{R}_\mathcal{Y}$，分别对应最大化问题和最小化问题的定义域。在每个时刻 $t$，两个遗憾最小化器分别输出策略 $\vec{x}^{(t)}$ 和 $\vec{y}^{(t)}$，然后分别收到反馈向量 $\vec{u}_\mathcal{X}^{(t)}, \vec{u}_\mathcal{Y}^{(t)}$：

$$
\vec{u}_\mathcal{X}^{(t)} \coloneqq \mathbf{A} \vec{y}^{(t)},\qquad\quad
\vec{u}_\mathcal{Y}^{(t)} \coloneqq -\mathbf{A}^\top \vec{x}^{(t)}, \tag{3}
$$

其中 $\mathbf{A}$ 是玩家 1 的收益矩阵。（即：每个遗憾最小化器输出策略，再观察以对方当前策略构造的效用向量，如此往复。）

如我们在课上所见，到任意时刻 $T$ 为止两个遗憾最小化器产生的平均策略对收敛到纳什均衡，收敛性通过**鞍点间隙**（saddle point gap）

$$
\max_{\hat{\vec{x}}\in\mathcal{X}} ( \hat{\vec{x}}^\top \mathbf{A} \vec{y}  )  - \min_{\hat{\vec{y}}\in\mathcal{Y}} ( \vec{x}^\top \mathbf{A} \hat{\vec{y}}  )
$$

来度量。点 $(\vec{x},\vec{y})\in \mathcal{X}\times\mathcal{Y}$ 的鞍点间隙为零，当且仅当它是该博弈的纳什均衡。

**问题 3.2.1（15 分）** 让玩家 1 和玩家 2 的树形序贯决策问题各自的 CFR 实现（每个决策点处的局部遗憾最小化器使用遗憾匹配）如上所述进行自对弈。

画出鞍点间隙以及平均策略的期望效用（对玩家 1 而言）随迭代次数 $T = 1,\dots,1000$ 变化的图像。

> 提示：
>
> - 把 $\mathbb{R}^{|\Sigma|}$ 上的向量在内存中表示为从序列（元组 `(decision_point_id, action)`）到浮点数的字典。
> - 计算鞍点间隙时，可以直接使用 Python stub 文件中提供的函数 `gap(game, strategy_pl1, strategy_pl2)`。
> - 鞍点间隙应趋于零。平均策略的期望效用在石头-剪刀-超级剪刀中应接近 $0$，在 Kuhn 扑克中应接近 $-0.055$，在 Leduc 扑克中应接近 $-0.085$。

答案中应包含六张图（每个博弈两张——一张鞍点间隙、一张效用），并提交你的实现。

#### 3.3 CFR+、交替迭代与线性平均

为了在学习双人零和博弈的纳什均衡时获得更好的实际性能，我们考虑对上一小节的设定做如下修改：

- 不再使用遗憾匹配，CFR 在每个决策点处改用遗憾匹配加强版（regret matching plus，RM$^+$）算法（见第 4 讲）。
- 不再使用上面描述的经典自对弈方案，两位玩家**交替**（alternate）迭代与反馈：效用向量 $\vec{u}_\mathcal{X}^{(t)}$ 仍按式 (3) 定义，而
$$
\tilde{\vec{u}}_\mathcal{Y}^{(t)} \coloneqq -\mathbf{A}^\top \vec{x}^{(t+1)}.
$$
- 最后，在计算鞍点间隙时，用策略的**加权平均**
$$
\bar{\bar{\vec{x}}}^{(T)} \coloneqq \frac{1}{\sum_{t=1}^{T} t^\gamma}\sum_{t=1}^{T} t^\gamma\vec{x}^{(t)}, \qquad
\bar{\bar{\vec{y}}}^{(T)} \coloneqq \frac{1}{\sum_{t=1}^{T} t^\gamma}\sum_{t=1}^{T} t^\gamma \vec{y}^{(t)}
$$
取代通常的平均。

上述修改后的设定统称为“运行 CFR+”。

**问题 3.3.1（20 分）** 修改你的 CFR 实现，使其同时支持以下每个变体：

1. **（10 分）** CFR+，交替迭代，$\gamma = 1$；
2. **（4 分）** DCFR（折扣 CFR，discounted CFR），交替迭代，参数 $\alpha = 1.5,\ \beta = 0,\ \gamma = 2$；
3. **（3 分）** PCFR+（预测式 CFR+，predictive CFR+），交替迭代，$\gamma = 2$；
4. **（3 分）** PCFR+，交替迭代，$\gamma = \infty$（即不做平均；只保留最后一次迭代）。

对每个变体，运行 $1000$ 次迭代，并在每次迭代 $T$ 之后画出平均策略 $\bar{\bar{\vec{x}}}^{(T)}, \bar{\bar{\vec{y}}}^{(T)}$ 对玩家 1 的期望效用和鞍点间隙。把这些曲线添加到你问题 3.2.1 的图中。

> 本题不需要单独书写解答：修改问题 3.2.1 的图，使它们同时包含这些变体的曲线即可。务必注明每张图对应哪个博弈、哪种算法。

## 编程任务

编程部分对应第三题（50 分）。材料位于 `cfr_files/`：三个博弈文件 `rock_paper_superscissors.json`、`kuhn_poker.json`、`leduc_poker.json`，以及 stub 文件 `stub.py`。

### 游戏文件格式

每个博弈编码为一个 JSON 文件，格式与作业 1 完全相同。根对象有三个键：

| 键 | 含义 |
|---|---|
| `decision_problem_pl1` | 玩家 1 面对的树形序贯决策过程（TFSDP）的描述（节点列表） |
| `decision_problem_pl2` | 玩家 2 面对的 TFSDP 的描述（节点列表） |
| `utility_pl1` | 玩家 1 的双线性效用函数的描述（零和博弈，玩家 2 的效用为其相反数） |

每个决策问题的树存储为节点列表（按自顶向下遍历顺序给出，反向读取即得自底向上顺序）。每个节点的字段：

| 字段 | 含义 |
|---|---|
| `id` | 节点标识符字符串；在同一玩家的节点中唯一 |
| `type` | `decision`（决策点）或 `observation`（观察点） |
| `actions` | （仅决策点）该节点可用的动作字符串集合 |
| `signals` | （仅观察点）该节点可观察到的信号字符串集合 |
| `parent_edge` | 父边；根节点为 `null`，否则为 `(parent_node_id, action_or_signal)` |
| `parent_sequence` | （仅决策点）父序列 $p_j$，即从根到 $j$ 的路径上遇到的最后一个序列（决策点-动作对） |

玩家 1 的双线性效用函数由收益矩阵 $\mathbf{A}$ 给出：$u_1(\vec{x}, \vec{y}) = \vec{x}^\top \mathbf{A}\vec{y}$，其中 $\vec{x}$、$\vec{y}$ 为双方的序列形式策略。文件中 $\mathbf{A}$ 以非零项列表表示，每个条目的字段为：

| 字段 | 含义 |
|---|---|
| `sequence_pl1` | `(decision_pt_id_pl1, action_pl1)`，玩家 1 的序列（矩阵行） |
| `sequence_pl2` | `(decision_pt_id_pl2, action_pl2)`，玩家 2 的序列（矩阵列） |
| `value` | 该矩阵项的非零浮点值 |

**示例：石头-剪刀-超级剪刀。** 每位玩家的决策问题只有一个决策点、三个动作（r、p、s），收益矩阵为

$$
\begin{pmatrix}
 0 & -1 &  1\\
 1 &  0 & -2\\
-1 &  2 &  0
\end{pmatrix},
$$

（行、列均按 r、p、s 顺序。该博弈的一个纳什均衡是：双方都以 $\frac{1}{2}$ 出石头、$\frac{1}{4}$ 出布、$\frac{1}{4}$ 出超级剪刀，博弈值为 $0$。）

### 已提供的辅助函数

stub 文件中以下函数**已经实现**，可直接使用（其中 `game` 是解析后的游戏 JSON，`tfsdp` 是 `game["decision_problem_pl1"]` 或 `game["decision_problem_pl2"]`）：

| 函数 | 功能 |
|---|---|
| `get_sequence_set(tfsdp)` | 返回给定 TFSDP 的所有序列组成的集合 |
| `is_valid_RSigma_vector(tfsdp, obj)` | 检查对象是否是以该 TFSDP 的序列集为键的字典 |
| `assert_is_valid_sf_strategy(tfsdp, obj)` | 检查对象是否是合法的序列形式策略向量 |
| `best_response_value(tfsdp, utility)` | 计算 $\max_{\vec{x} \in Q} \vec{x}^\top u$，其中 $Q$ 为该 TFSDP 的序列形式多胞形 |
| `compute_utility_vector_pl1(game, sf_strategy_pl2)` | 返回 $\mathbf{A}\vec{y}$（$\mathbf{A}$ 为收益矩阵，$\vec{y}$ 为给定的玩家 2 策略） |
| `compute_utility_vector_pl2(game, sf_strategy_pl1)` | 返回 $-\mathbf{A}^\top\vec{x}$（$\vec{x}$ 为给定的玩家 1 策略） |
| `gap(game, sf_strategy_pl1, sf_strategy_pl2)` | 计算给定双方序列形式策略的鞍点间隙 |

### 需要实现的函数

| 函数 / 类 | 任务 |
|---|---|
| `expected_utility_pl1(game, sf_strategy_pl1, sf_strategy_pl2)` | 返回双方按给定策略行动时玩家 1 的期望效用 |
| `uniform_sf_strategy(tfsdp)` | 返回给定 TFSDP 的均匀序列形式策略 |
| `RegretMatching` 类（`__init__`、`next_strategy`、`observe_utility`） | 遗憾匹配算法；`next_strategy` 建议返回从 `action_set` 中动作到选取概率的字典 |
| `RegretMatchingPlus` 类（同上接口） | 遗憾匹配加强版（RM$^+$）算法 |
| `Cfr` 类（`next_strategy`、`observe_utility`） | CFR 遗憾最小化器；构造时已为每个决策点实例化局部遗憾最小化器（`rm_class` 参数指定算法类） |
| `solve_problem_3_1(game)` | 问题 3.1.1：学习对均匀策略的最优反应 |
| `solve_problem_3_2(game)` | 问题 3.2.1：自对弈学习纳什均衡 |
| `solve_problem_3_3(game)` | 问题 3.3.1：CFR+ 及其变体 |

命令行入口：

```bash
python stub.py --game <游戏 JSON 路径> --problem {3.1, 3.2, 3.3}
```

程序会读取游戏文件、把所有序列从列表转换为元组（包括 `parent_edge`、`parent_sequence` 与 `utility_pl1` 中的 `sequence_pl1`/`sequence_pl2`），然后按 `--problem` 调用对应的 `solve_problem_3_*` 函数。

### 评测方式

本作业无自动评测脚本；按题目要求把图与数值写进提交的 pdf，并在 pdf 末尾附上完整代码。可用的自查数值：

- 问题 3.1.1：$v^{(T)}$ 在石头-剪刀-超级剪刀中应接近 $\frac{1}{3}$，Kuhn 扑克中接近 $\frac{1}{2}$，Leduc 扑克中接近 $2.0875$；
- 问题 3.2.1：鞍点间隙应趋于零；平均策略对玩家 1 的期望效用在三个博弈中应分别接近 $0$、$-0.055$、$-0.085$；
- 问题 3.3.1：在问题 3.2.1 的图上叠加 CFR+（$\gamma=1$）、DCFR（$\alpha=1.5,\beta=0,\gamma=2$）、PCFR+（$\gamma=2$）与 PCFR+（$\gamma=\infty$）四种变体的曲线。
