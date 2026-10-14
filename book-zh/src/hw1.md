<!-- escape-math: v1 -->
# 作业 1：LP 均衡计算

- 课程：15-888 Computational Game Solving（Fall 2025）
- 发布日期：2025 年 9 月 28 日；截止日期：2025 年 10 月 10 日
- 总分：100 分（第一题 20 分 + 第二题 30 分 + 第三题 50 分）

**提交要求**：在 Gradescope 上提交。提交**一个 pdf 文件**，其中**同时**包含你的书面解答**和**附在末尾的代码（`stub.py`）（例如使用 `verbatim` 环境附上）。你可以（但不强制）使用作业 `.zip` 中提供的 `.tex` 文件来排版书面解答。

## 题目

### 第一题：基于后悔（regret）的最小最大定理证明（20 分）

设 $\mathcal{X} \subseteq \mathbb{R}^{m\_1}$ 与 $\mathcal{Y} \subseteq \mathbb{R}^{m\_2}$ 为凸紧集，$\mathbf{A} \in \mathbb{R}^{m\_1 \times m\_2}$。最小最大定理（minimax theorem）断言

$$
\min\_{\vec{x}\in\mathcal{X}} \max\_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle = \max\_{\vec{y}\in\mathcal{Y}} \min\_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle.
$$

本题中，你将证明：仅仅是（外部）后悔最小化（regret minimization）算法的**存在性**，就足以推出最小最大定理。

证明的一个方向（称为**弱对偶**（weak duality））很容易且非常一般。

**问题 1.1（5 分）** 证明

$$
\min\_{\vec{x}\in\mathcal{X}} \max\_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \geq \max\_{\vec{y}\in\mathcal{Y}} \min\_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle. \tag{1}
$$

为了证明反向不等式，我们将用后悔最小化来求解双线性鞍点问题 $\max\_{\vec{y}\in\mathcal{Y}} \min\_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle$。在每一时刻 $t$，让一个后悔最小化器 $\mathfrak{R}\_\mathcal{Y}$ 选择策略 $\vec{y}^{(t)} \in\mathcal{Y}$，而我们总是假设 $\vec{x}^{(t)} \in\mathcal{X}$ 由环境选为对 $\vec{y}^{(t)}$ 的最优反应（best response），即

$$
\vec{x}^{(t)} \in \arg\min\_{\vec{x} \in \mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y}^{(t)} \rangle .
$$

$\mathfrak{R}\_\mathcal{Y}$ 在每一时刻 $t$ 观察到的效用函数设为

$$
u^t\_\mathcal{Y} : \vec{y} \mapsto \langle \vec{x}^{(t)}, \mathbf{A} \vec{y} \rangle = \langle \vec{y}, \mathbf{A}^\top \vec{x}^{(t)} \rangle .
$$

我们假设 $\mathfrak{R}\_\mathcal{Y}$ 在任意效用序列下都保证**次线性后悔**（sublinear regret）；我们已经见过许多具有此性质的算法，例如 FTRL（跟随正则化领导者）和 RM（后悔匹配，regret matching）。

设 $\bar{\vec{x}}^{(T)} \in \mathcal{X}$ 与 $\bar{\vec{y}}^{(T)} \in \mathcal{Y}$ 为到时刻 $T$ 为止输出的平均策略，即

$$
\bar{\vec{x}}^{(T)} \coloneqq \frac{1}{T}\sum\_{t=1}^T \vec{x}^{(t)} \qquad \bar{\vec{y}}^{(T)} \coloneqq \frac{1}{T}\sum\_{t=1}^T \vec{y}^{(t)}.
$$

**问题 1.2（5 分）** 论证在任意 $T$ 下，

$$
\max\_{\vec{y} \in \mathcal{Y}} \min\_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \ge \frac{1}{T} \min\_{\vec{x}\in\mathcal{X}} \sum\_{t=1}^T \langle \vec{x}, \mathbf{A} \vec{y}^{(t)} \rangle  \ge \frac{1}{T}\sum\_{t=1}^T \langle \vec{x}^{(t)}, \mathbf{A} \vec{y}^{(t)} \rangle . \tag{2}
$$

> 提示：使用 $\bar{\vec{y}}^{(T)}$ 的定义。然后，利用你关于 $\vec{x}^{(t)}$ 的已知信息。

**问题 1.3（5 分）** 设 $R\_\mathcal{Y}^{(T)}$ 为 $\mathfrak{R}\_\mathcal{Y}$ 到时刻 $T$ 累积的后悔。利用式 (2)，论证在任意时刻 $T$，

$$
\max\_{\vec{y}\in\mathcal{Y}}\min\_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \ge \min\_{\vec{x}\in\mathcal{X}} \max\_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle - \frac{R^{(T)}\_\mathcal{Y}}{T}. \tag{3}
$$

> 提示：使用后悔 $R\_\mathcal{Y}^{(T)}$ 的定义。

**问题 1.4（5 分）** 利用式 (3) 和式 (1)，得出结论

$$
\max\_{\vec{y} \in \mathcal{Y}}\min\_{\vec{x} \in \mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle = \min\_{\vec{x}\in\mathcal{X}}\max\_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle.
$$

### 第二题：从后悔电路推导 CFR（30 分）

本题中，你将用后悔电路（regret circuits）推导 CFR（反事实后悔最小化，counterfactual regret minimization）。为方便起见，下面附上第 5 讲中计算反事实效用（counterfactual utilities）的子程序伪代码（算法 1）。本题的目标是证明：在树形决策问题（tree-form decision problem）上以自底向上的方式应用后悔电路，恰好产生 CFR。

回顾序列形式（sequence-form）策略集可以如下分解。第一，在任意观察点（observation point）$k \in \mathcal{K}$，设其子节点集合为 $\\{p\_1, \dots, p\_\nu \\} = \\{ \rho(k, s) : s \in \mathcal{S}\_k \\}$，则

$$
\mathcal{X}\_{k} = \mathcal{X}\_{p\_1} \times \mathcal{X}\_{p\_2} \times \dots \times \mathcal{X}\_{p\_\nu}, \tag{4}
$$

其中 $\mathcal{X}\_{p\_i}$ 是以点 $p\_i$ 为根的子树对应的序列形式多胞形。第二，在任意决策点（decision point）$j \in \mathcal{J}$，设其子节点集合为 $\\{ p\_1, \dots, p\_\nu \\} = \\{ \rho(j, a) : a \in \mathcal{A}\_j \\}$，则

$$
\mathcal{X}\_{j} \coloneqq \mathrm{co} \left\\{
\begin{pmatrix}
\vec{e}\_1 \\\
\mathcal{X}\_{p\_1} \\\
\vec{0} \\\
\vdots \\\
\vec{0}
\end{pmatrix},
\begin{pmatrix}
\vec{e}\_2 \\\
\vec{0} \\\
\mathcal{X}\_{p\_2} \\\
\vdots \\\
\vec{0}
\end{pmatrix},
 \dots,
 \begin{pmatrix}
\vec{e}\_\nu \\\
\vec{0} \\\
\vec{0} \\\
\vdots \\\
\mathcal{X}\_{p\_\nu}
\end{pmatrix}
\right\\}, \tag{5}
$$

其中 $\vec{e}\_i \in \mathbb{R}^{\mathcal{A}\_j}$ 是第 $i$ 个单位向量，$\mathrm{co}$ 表示凸包（convex hull）。

**算法 1：反事实后悔最小化（CFR）**

- **输入**：对树形决策过程的每个决策点 $j \in \mathcal{J}$，一个后悔最小化器 $\mathfrak{R}\_j$。
- $\textsc{ObserveUtility}(\vec{u}^{(t)} \in \mathbb{R}^{\Sigma})$：
  1. $V^{(t)}[\bot] \coloneqq 0$；
  2. 对树中每个节点 $p \in \mathcal{J} \cup \mathcal{K}$（按自底向上顺序）：
     - 若 $p \in \mathcal{J}$：令 $j = p$，$V^{(t)}[j] \coloneqq \sum\_{a \in \mathcal{A}\_j} b\_j^{(t)}[a] \cdot (\vec{u}^{(t)}[(j, a)] + V^{(t)}[\rho(j, a)])$；
     - 否则：令 $k = p$，$V^{(t)}[k] \coloneqq \sum\_{s \in \mathcal{S}\_k} V^{(t)}[\rho(k, s)]$；
  3. 对每个决策点 $j \in \mathcal{J}$：
     - 对每个动作 $a \in \mathcal{A}\_j$：$\vec{u}\_j^{(t)}[a] \coloneqq \vec{u}^{(t)}[(j, a)] + V^{(t)}[\rho(j, a)]$；
     - 调用 $\mathfrak{R}\_j.\textsc{ObserveUtility}(\vec{u}\_j^{(t)})$。

你将通过归纳法、以自底向上的方式证明 CFR 的正确性（soundness）。

**问题 2.1（5 分）** 论证在每个**终端**决策点（terminal decision point）$j \in \mathcal{J}$ 处，效用由 $\vec{u}^{(t)}\_j[a] = \vec{u}^{(t)}[(j, a)]$（对所有 $a \in \mathcal{A}\_j$）给出。

> 提示：这是归纳的基础。利用每个终端决策点处的策略集是概率单纯形（probability simplex）这一事实。注意到它与 CFR 在终端决策点处的效用相吻合。

**问题 2.2（5 分）** 在每个观察点 $p \in \mathcal{K}$ 应用笛卡尔积（Cartesian product）的后悔电路。推导作为输入传给 $p$ 的子节点的效用向量。

> 提示：使用式 (4) 给出的分解。

**问题 2.3（10 分）** 在每个决策点 $p \in \mathcal{J}$ 应用凸包的后悔电路。推导作为输入传给负责在 $\mathcal{A}\_j$ 上混合的后悔最小化器 $\mathfrak{R}\_j$ 的效用向量，并证明它与算法 1 中指定的效用一致。

> 提示：使用式 (5) 给出的分解。

**问题 2.4（10 分）** 证明 CFR 的后悔以 $\sum\_{j \in \mathcal{J}} \max\\{0, R\_j^{(T)} \\}$ 为上界，其中 $R\_j^{(T)}$ 是 $\mathfrak{R}\_j$ 的后悔。当每个 $\mathfrak{R}\_j$ 用 MWU（乘性权重更新，multiplicative weights update）实例化时，CFR 的后悔是多少？当每个 $\mathfrak{R}\_j$ 用 RM 实例化时呢？

> 提示：回顾后悔界依赖于效用的范数；论证该范数可以有多大。

### 第三题：用线性规划求解扩展式零和博弈，及其在扑克低随机化中的应用（50 分）

在许多博弈中，最优的纳什均衡（Nash equilibrium）要求所有玩家随机化其行动。以石头-剪刀-布为例：任何确定性策略（例如总是出石头）都严重次优。本题中，你将在三个博弈中量化“坚持只玩确定性策略”所损失的价值：石头-剪刀-超级剪刀（rock-paper-superscissors），以及两个著名的扑克变体——Kuhn 扑克（Kuhn poker）和 Leduc 扑克（Leduc poker）。每个博弈的描述在作业的 zip 文件中给出，格式见下文“编程任务”一节；zip 中还包含一个帮助搭建实现的 Python stub 文件。

#### 3.1 计算博弈的值（15 分）

作为热身，你将用商业求解器 Gurobi（<https://www.gurobi.com/>）实现第 5 讲中纳什均衡策略的线性规划（linear programming）形式。Gurobi 是面向线性与非线性优化问题的强大商业求解器，你可以从其官网下载求解器并申请免费的学术许可。Gurobi 的 Python 绑定 `gurobipy` 的安装说明见 Gurobi 官网文档。

**纳什均衡策略的线性规划形式。** 为方便起见，这里再次给出需要实现的线性规划——分别对应玩家 1 和玩家 2：

$$
\mathcal{P}\_1 : \begin{cases}
\max\ \vec{f}\_2^\top \vec{v} \\\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}\_2^\top \vec{v} \ge \vec{0} \\\
②\ \ \mathbf{F}\_1\vec{x} = \vec{f}\_1 \\\
③\ \ \vec{x} \ge \vec{0},\ \vec{v}\ \text{自由（free）},
\end{cases}
\qquad
\mathcal{P}\_2 : \begin{cases}
\max\ \vec{f}\_1^\top \vec{v} \\\[1mm]
\ \text{s.t.}\quad
①\ \ {-}\mathbf{A} \vec{y} - \mathbf{F}\_1^\top \vec{v} \ge \vec{0} \\\
②\ \ \mathbf{F}\_2\vec{y} = \vec{f}\_2 \\\
③\ \ \vec{y} \ge \vec{0},\ \vec{v}\ \text{自由},
\end{cases} \tag{6}
$$

其中 $\\{\vec{x}\in\mathbb{R}^{|\Sigma\_1|}: \mathbf{F}\_1 \vec{x} = \vec{f}\_1,\ \vec{x}\ge\vec{0}\\}$ 与 $\\{\vec{y}\in\mathbb{R}^{|\Sigma\_2|}: \mathbf{F}\_2 \vec{y} = \vec{f}\_2,\ \vec{y}\ge\vec{0}\\}$ 是两个玩家的序列形式多胞形，$\mathbf{A}$ 是玩家 1 的收益矩阵（payoff matrix）。方便的是，$\mathcal{P}\_1$ 和 $\mathcal{P}\_2$ 的目标值恰好是每个玩家在面对完全理性的对手时能够保证的期望效用。由于所有博弈都是零和的，$\mathcal{P}\_1$ 与 $\mathcal{P}\_2$ 的目标值之和为 $0$（如果不是，说明你的实现有 bug）。

**问题 3.1.1（15 分）** 实现用于计算玩家 1 和玩家 2 纳什均衡策略的线性规划。

对三个博弈（石头-剪刀-超级剪刀、Kuhn 扑克、Leduc 扑克）中的每一个、以及两位玩家中的每一位，报告 Gurobi 的输出。

> 提示：
>
> - 务必查看本文末尾的“Gurobi 提示与技巧”（见“编程任务”一节），其中包含调试常见问题的技巧。
> - 从石头-剪刀-超级剪刀开始，然后再转向更复杂的博弈。
> - 由于所有博弈都是零和的，$\mathcal{P}\_1$ 与 $\mathcal{P}\_2$ 的目标值之和必须为 $0$。
> - $\mathcal{P}\_1$ 的目标值应当为：石头-剪刀-超级剪刀 $0$，Kuhn 扑克 $-0.0555$，Leduc 扑克 $-0.0856$。

答案中应包含六份 Gurobi 输出（3 个游戏 × 每游戏 2 位玩家）。可以直接用 `verbatim` 环境原样转储输出，务必注明每份输出对应哪个游戏、哪位玩家。不要忘记在作业末尾附上代码。例如，石头-剪刀-超级剪刀中玩家 1 的输出大致如下：

```text
Gurobi Optimizer version 9.1.1 build v9.1.1rc0 (linux64)
Thread count: 8 physical cores, 16 logical processors, using up to 16 threads
Optimize a model with 4 rows, 4 columns and 12 nonzeros
Model fingerprint: 0x5264c0a3
Coefficient statistics:
    Matrix range     [1e+00, 2e+00]
    Objective range  [1e+00, 1e+00]
    Bounds range     [0e+00, 0e+00]
    RHS range        [1e+00, 1e+00]
Presolve removed 1 rows and 0 columns
Presolve time: 0.01s
Presolved: 3 rows, 4 columns, 11 nonzeros

Iteration    Objective       Primal Inf.    Dual Inf.      Time
        0    1.0000000e+00   1.000000e+00   0.000000e+00      0s
        2   -0.0000000e+00   0.000000e+00   0.000000e+00      0s

Solved in 2 iterations and 0.01 seconds
Optimal objective -0.000000000e+00
```

#### 3.2 计算最优确定性策略（15 分）

本小节研究：如果某位玩家（但对手不受此限）被限制只能玩确定性策略，他会差多少。为建模这一点，我们加入一个约束：式 (6) 中序列形式策略向量 $\vec{x}$ 和 $\vec{y}$ 的所有分量只能取 $\\{0, 1\\}$ 中的值。所得的**整数**规划——称为 $\tilde{\mathcal{P}}\_1$ 和 $\tilde{\mathcal{P}}\_2$——如下：

$$
\tilde{\mathcal{P}}\_1 : \begin{cases}
\max\ \vec{f}\_2^\top \vec{v} \\\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}\_2^\top \vec{v} \ge \vec{0} \\\
②\ \ \mathbf{F}\_1\vec{x} = \vec{f}\_1 \\\
③\ \ \vec{x} \in \\{0,1\\}^{|\Sigma\_1|},\ \vec{v}\ \text{自由},
\end{cases}
\qquad
\tilde{\mathcal{P}}\_2 : \begin{cases}
\max\ \vec{f}\_1^\top \vec{v} \\\[1mm]
\ \text{s.t.}\quad
①\ \ {-}\mathbf{A} \vec{y} - \mathbf{F}\_1^\top \vec{v} \ge \vec{0} \\\
②\ \ \mathbf{F}\_2\vec{y} = \vec{f}\_2 \\\
③\ \ \vec{y} \in \\{0,1\\}^{|\Sigma\_2|},\ \vec{v}\ \text{自由}.
\end{cases} \tag{7}
$$

**问题 3.2.1（15 分）** 实现式 (7) 给出的整数规划（integer program），用于计算玩家 1 和玩家 2 的最优确定性策略。

对三个博弈（石头-剪刀-超级剪刀、Kuhn 扑克、Leduc 扑克）中的每一个、以及两位玩家中的每一位，报告 Gurobi 的输出。

> 提示：
>
> - 务必查看“Gurobi 提示与技巧”。
> - 从石头-剪刀-超级剪刀开始，然后再转向更复杂的博弈。
> - 这里**不再保证** $\tilde{\mathcal{P}}\_1$ 的值与 $\tilde{\mathcal{P}}\_2$ 的值之和为 $0$！事实上，在所有博弈中这都不成立。

答案中应包含六份 Gurobi 输出（3 个游戏 × 每游戏 2 位玩家），注明每份输出对应的游戏与玩家，并在末尾附上代码。例如，Kuhn 扑克中玩家 1 的输出大致如下：

```text
Gurobi Optimizer version 9.1.1 build v9.1.1rc0 (linux64)
Thread count: 8 physical cores, 16 logical processors, using up to 16 threads
Optimize a model with 18 rows, 18 columns and 57 nonzeros
Model fingerprint: 0x57532587
Variable types: 6 continuous, 12 integer (12 binary)
Coefficient statistics:
    Matrix range     [2e-01, 1e+00]
    Objective range  [1e+00, 1e+00]
    Bounds range     [1e+00, 1e+00]
    RHS range        [1e+00, 1e+00]
Found heuristic solution: objective -0.3333335
Presolve removed 11 rows and 10 columns
Presolve time: 0.00s
Presolved: 7 rows, 8 columns, 22 nonzeros
Found heuristic solution: objective -0.3333333
Variable types: 0 continuous, 8 integer (5 binary)

Root relaxation: objective -5.555556e-02, 9 iterations, 0.00 seconds

    Nodes    |    Current Node    |     Objective Bounds      |     Work
 Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time

     0     0   -0.05556    0    3   -0.33333   -0.05556  83.3%     -    0s
H    0     0                      -0.1666667   -0.05556  66.7%     -    0s
     0     0   -0.05556    0    3   -0.16667   -0.05556  66.7%     -    0s

Explored 1 nodes (9 simplex iterations) in 0.00 seconds
Thread count was 16 (of 16 available processors)

Solution count 3: -0.166667 -0.333333 -0.333333
No other solutions better than -0.166667

Optimal solution found (tolerance 1.00e-04)
Best objective -1.666666666667e-01, best bound -1.666666666667e-01, gap 0.0000%
```

#### 3.3 控制确定性的程度（20 分）

在问题 3.1.1 中没有确定性约束；在另一个极端，问题 3.2.1 要求在所有决策点都遵循确定性策略。本小节将探索中间情形：对每个 $k$ 值，研究每位玩家在“至少在 $k$ 个决策点上必须确定性地行动”的约束下能够保证多少价值。当 $k=0$ 时，将恢复到问题 3.1.1 中的目标值；当 $k$ 等于该玩家在游戏中的决策点数量时，将恢复到问题 3.2.1 中的目标值。

**整数规划模型。** 玩家 1 在“至少 $k$ 个决策点必须规定确定性策略”约束下的最优策略，可以通过式 (8) 中的整数线性规划 $\mathcal{P}\_1(k)$ 的解得到。理解细节对本题并不重要，不过我们还是附上了每条约束含义的说明，供好奇者参考。

$$
\mathcal{P}\_1(k) : \begin{cases}
\max\ \vec{f}\_2^\top \vec{v} \\\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}\_2^\top \vec{v} \ge \vec{0} \\\[1mm]
②\ \ \mathbf{F}\_1\vec{x} = \vec{f}\_1 \\\[1mm]
③\ \ \vec{x}[(j,a)] \ge \vec{z}[(j,a)] \qquad\qquad\ \forall j\in\mathcal{J}\_1: p\_j = \varnothing,\ a\in \mathcal{A}\_j\\\[1mm]
④\ \ \vec{x}[(j,a)] \ge \vec{x}[p\_j] + \vec{z}[(j,a)] - 1 \qquad \forall j\in\mathcal{J}\_1: p\_j \neq \varnothing,\ a\in \mathcal{A}\_j\\\[1mm]
⑤\ \ \sum\_{a\in \mathcal{A}\_j} \vec{z}[(j,a)] \le 1 \qquad\qquad\quad\ \forall\\,j\in\mathcal{J}\_1\\\[1mm]
⑥\ \ \sum\_{j\in \mathcal{J}\_1} \sum\_{a\in \mathcal{A}\_j} \vec{z}[(j,a)]\ge k\\\[1mm]
⑦\ \ \vec{x} \ge \vec{0},\ \vec{z}\in\\{0,1\\}^{|\Sigma\_1|},\ \vec{v}\ \text{自由},
\end{cases} \tag{8}
$$

- $\vec{z} \in \\{0,1\\}^{|\Sigma\_1|}$ 是一个二元向量，对玩家 1 的每个策略（序列）$(j,a) \in \Sigma\_1$，决定是否在 $j$ 处以概率 $1$ 选取动作 $a$。由于策略向量 $\vec{x}$ 以序列形式表示，“在 $j$ 处以概率 $1$ 选取动作 $a$”通过约束 ③ 和 ④ 表达。
- 约束 ⑤ 断言：每个决策点至多有一个动作被强制以概率 $1$ 行动。
- 约束 ⑥ 断言：在至少 $k$ 个决策点中，恰好有一个动作被强制以概率 $1$ 行动。

玩家 2 的整数规划 $\mathcal{P}\_2(k)$ 类似。

**问题 3.3.1（15 分）** 实现上述整数线性规划 $\mathcal{P}\_1(k)$ 和 $\mathcal{P}\_2(k)$，用于在给定确定性程度下界时计算最优策略。

对三个博弈（石头-剪刀-超级剪刀、Kuhn 扑克、Leduc 扑克）中的每一个、以及两位玩家 $i$ 中的每一位，画出 $\mathcal{P}\_i(k)$ 的目标值作为 $k \in \\{0, \dots, |\mathcal{J}\_i|\\}$（$|\mathcal{J}\_i|$ 为玩家 $i$ 的决策点数量）的函数的图像。

> 提示：
>
> - 务必查看“Gurobi 提示与技巧”。
> - Gurobi 默认输出很冗长。本题中如果你想让 Gurobi 静默，可以使用 `m.setParam("OutputFlag", 0)`。
> - 对于 Leduc 扑克，如果 $k$ 较大时 Gurobi 优化耗时过长，可以在 `m.optimize()` 之前调用 `m.setParam("MIPGap", 0.01)` 降低求解精度。Leduc 扑克的运行时间预计可达一到五个小时，取决于你使用的机器性能。

答案中应包含六张图（3 个游戏 × 每游戏 2 位玩家），注明每张图对应的游戏与玩家，并在末尾附上代码。

**问题 3.3.2（5 分）** 评论你在本题中得到的结果：这三个小游戏中是否存在高度确定性的（highly-deterministic）策略？结果是否符合你的预期？如果是，结果证实了什么？如果不是，你认为该如何调和先前的直觉与实验发现？

## 编程任务

编程部分对应第三题（50 分）。材料位于 `lp_files/`：三个博弈文件 `rock_paper_superscissors.json`、`kuhn_poker.json`、`leduc_poker.json`，以及 stub 文件 `stub.py`。

### 游戏文件格式

每个博弈编码为一个 JSON 文件。根对象有三个键：

| 键 | 含义 |
|---|---|
| `decision_problem_pl1` | 玩家 1 面对的树形序贯决策过程（tree-form sequential decision process, TFSDP）的描述 |
| `decision_problem_pl2` | 玩家 2 面对的 TFSDP 的描述 |
| `utility_pl1` | 玩家 1 的双线性效用函数（作为双方序列形式策略的函数）的描述；博弈为零和，玩家 2 的效用为玩家 1 的相反数 |

每个决策问题的决策点与观察点构成的树存储为一个**节点列表**。每个节点的字段如下：

| 字段 | 含义 |
|---|---|
| `id` | 节点标识符字符串；在同一玩家的节点中唯一 |
| `type` | 字符串，`decision`（决策点）或 `observation`（观察点） |
| `actions` | （仅决策点）字符串集合，该决策点可用的动作 |
| `signals` | （仅观察点）字符串集合，该观察点可观察到的信号 |
| `parent_edge` | 节点的父边。若节点是树根则为 `null`；否则为二元组 `(parent_node_id, action_or_signal)`，前者是父节点的 `id`，后者是连接该节点与其父节点的动作或信号 |
| `parent_sequence` | （仅决策点）决策点的父序列 $p\_j$，即从决策过程的根到 $j$ 的路径上遇到的最后一个序列（决策点-动作对） |

> 注：TFSDP 的节点列表按**自顶向下**的遍历顺序给出；将节点列表反向读取即得自底向上的遍历顺序。

玩家 1 的双线性效用函数通过收益矩阵 $\mathbf{A}$ 给出，使得玩家 1 的（期望）效用可写为

$$
u\_1(\vec{x}, \vec{y}) = \langle \vec{x}, \mathbf{A} \vec{y} \rangle,
$$

其中 $\vec{x}$ 与 $\vec{y}$ 分别是玩家 1 和玩家 2 的序列形式策略。文件中 $\mathbf{A}$ 表示为**所有非零矩阵项**的列表，每项记录行下标、列下标和值。每个条目对象的字段为：

| 字段 | 含义 |
|---|---|
| `sequence_pl1` | 二元组 `(decision_pt_id_pl1, action_pl1)`，表示玩家 1 的序列（矩阵项的行） |
| `sequence_pl2` | 二元组 `(decision_pt_id_pl2, action_pl2)`，表示玩家 2 的序列（矩阵项的列） |
| `value` | 该矩阵项的非零浮点值 |

**示例：石头-剪刀-超级剪刀。** 在该游戏中，每位玩家面对的决策问题只有一个决策点、三个动作：出石头（r）、布（p）或超级剪刀（s）。因此每个 TFSDP 只有一个节点，且是决策点。博弈的收益矩阵为

$$
\begin{pmatrix}
 0 & -1 &  1\\\
 1 &  0 & -2\\\
-1 &  2 &  0
\end{pmatrix}
\ \begin{array}{l}\text{r}\\\text{p}\\\text{s}\end{array}
$$

（行、列均按 r、p、s 顺序；该矩阵对应 JSON 中 `utility_pl1` 的 6 个非零条目。）

### 需要实现的函数

`stub.py` 依赖 `gurobipy`，其命令行入口为：

```bash
python stub.py --game <游戏 JSON 路径> --problem {2.1, 2.2, 2.3}
```

程序会读取游戏文件、把所有序列从列表转换为元组，然后按 `--problem` 调用对应函数。需要补全的三个函数（均对 `player ∈ {1, 2}` 各建一个 Gurobi 模型）：

| 函数 | 对应题目 | 任务 |
|---|---|---|
| `solve_problem_2_1(game)` | 问题 3.1.1 | 实现式 (6) 的 LP $\mathcal{P}\_1$、$\mathcal{P}\_2$，求解并输出（模型名 `game_value_pl<玩家>`） |
| `solve_problem_2_2(game)` | 问题 3.2.1 | 实现式 (7) 的整数规划 $\tilde{\mathcal{P}}\_1$、$\tilde{\mathcal{P}}\_2$（模型名 `deterministic_pl<玩家>`） |
| `solve_problem_2_3(game)` | 问题 3.3.1 | 实现式 (8) 的 $\mathcal{P}\_1(k)$、$\mathcal{P}\_2(k)$，对每个 $k$ 求解并绘图 |

### 评测方式

本作业无自动评测脚本；按题目要求把 Gurobi 输出（问题 3.1.1、3.2.1 共 12 份）、六张目标值随 $k$ 变化的图（问题 3.3.1）以及结果评论（问题 3.3.2）写进提交的 pdf，并在 pdf 末尾附上完整代码。目标值可用于自查：$\mathcal{P}\_1$ 的目标值在三个游戏中应分别为 $0$（石头-剪刀-超级剪刀）、$-0.0555$（Kuhn 扑克）、$-0.0856$（Leduc 扑克），且 $\mathcal{P}\_1$ 与 $\mathcal{P}\_2$ 的目标值之和为 $0$。

### 附录：Gurobi 提示与技巧

**基本记号。** 设 `m` 为 Gurobi 模型对象，常用操作速查：

```python
# 添加连续自由变量
m.addVar(-GRB.INFINITY, GRB.INFINITY, vtype=GRB.CONTINUOUS, name="human_var_name_here")
# 添加连续非负变量
m.addVar(0.0, GRB.INFINITY, vtype=GRB.CONTINUOUS, name="human_var_name_here")
# 添加二元变量
m.addVar(0.0, 1.0, vtype=GRB.BINARY, name="human_var_name_here")
# 添加等式约束
m.addConstr(lhs == rhs)
# 添加不等式（≥）约束
m.addConstr(lhs >= rhs)
# 设置最大化目标
m.setObjective(obj, sense=GRB.MAXIMIZE)
```

**读取解。** 调用 `m.optimize()` 之后，目标值可通过

```python
m.getAttr(GRB.Attr.ObjVal)
```

获得。若要查看解：给定变量对象 `v`（即 `m.addVar` 返回的对象），可通过

```python
v.getAttr(GRB.Attr.X)
```

读取 `v` 在当前解中的取值。

**排错。** 首先，如果 Gurobi 出了问题，第一件事是让 Gurobi 把它“认为你在要求求解的模型”以人类可读格式转储到文件。*如果你在 `addVar` 时用 `name` 可选参数给变量起了名字，读模型文件会容易得多。* 转储模型可以这样写：

```python
m.write("/tmp/model.lp")
```

当然你可以指定别的路径，但重要的是保留 `.lp` 扩展名：Gurobi 可输出多种格式，它用文件扩展名判断你要哪种格式。

除上述一般规则外，请确认以下几点：

- 从石头-剪刀-超级剪刀开始。此时问题 3.1.1 中玩家 1 的 `/tmp/model.lp` 文件应当大致如下（变量名可能不同）：

```text
\ Model game_value_pl1
\ LP format - for model browsing. Use MPS format to capture full model detail.
Maximize
    v[d1_pl2]
Subject To
    R0: x[('d1_pl1',_'p')] - x[('d1_pl1',_'s')] - v[d1_pl2] >= 0
    R1: - x[('d1_pl1',_'r')] + 2 x[('d1_pl1',_'s')] - v[d1_pl2] >= 0
    R2: x[('d1_pl1',_'r')] - 2 x[('d1_pl1',_'p')] - v[d1_pl2] >= 0
    R3: x[('d1_pl1',_'r')] + x[('d1_pl1',_'p')] + x[('d1_pl1',_'s')] = 1
Bounds
    v[d1_pl2] free
End
```

  注：Gurobi 在 `Bounds` 段中不列出非负变量。

- 你记得指定这是一个**最大化**问题吗？（Gurobi 默认是最小化。）如果 Gurobi 报告模型无界（unbounded），很可能就是你忘了。
- 检查变量数和约束数是否符合预期；约束的方向（等式、$\le$、$\ge$）是否正确？
