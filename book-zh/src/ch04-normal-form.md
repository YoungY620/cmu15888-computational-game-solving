# 标准式博弈：LP、FTRL 与后悔匹配

本讲深入标准式博弈（normal-form game，又称策略式博弈）中的均衡计算：先用线性规划在多项式时间内求解二人零和博弈的极小极大均衡，再转向更适合大规模博弈的简单迭代算法，最终引出在线学习与后悔最小化框架——后续课程中求解大规模博弈的许多突破性结果都建立在后一类算法之上。

## 1 通过线性规划求极小极大均衡

### 标准式博弈回顾

标准式博弈可视为同时行动博弈的模型，尽管其底层的策略互动本身可以是序贯的。任何有限博弈都可以表示为标准式，但正如下一讲将讨论的，标准式表示往往是低效的。

形式化地，博弈中有 $n$ 个玩家。每个玩家 $i \in [n]$ 拥有有限的行动集合 $\mathcal{A}_i$，记 $m_i := |\mathcal{A}_i|$。玩家 $i$ 的效用函数 $u_i$ 把每个联合行动组合 $(a_1, \dots, a_n) \in \mathcal{A}_1 \times \cdots \times \mathcal{A}_n$ 映射到一个实数 $u_i(a_1, \dots, a_n)$。一种表示方式是显式给出每个玩家的收益张量，包含每种行动组合下的效用——其规模随玩家数指数增长。玩家可以通过指定行动上的概率分布来随机化。在联合策略 $(\boldsymbol{x}_1, \dots, \boldsymbol{x}_n) \in \Delta(\mathcal{A}_1) \times \cdots \times \Delta(\mathcal{A}_n)$ 下，玩家 $i$ 的期望效用为

$$
u_i(\boldsymbol{x}_1, \dots, \boldsymbol{x}_n) := \mathbb{E}_{(a_1,\dots,a_n)\sim(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)}\, u_i(a_1, \dots, a_n) = \sum_{(a_1,\dots,a_n)} \prod_{i'=1}^{n} \boldsymbol{x}_{i'}[a_{i'}]\, u_i(a_1, \dots, a_n).
$$

假定玩家都追求期望效用最大化。

### 零和博弈与极小极大定理

（二人）零和博弈（zero-sum game）是只有两个利益完全对立玩家的特例：对所有 $(a_1, a_2) \in \mathcal{A}_1 \times \mathcal{A}_2$ 有 $u_1(a_1, a_2) = -u_2(a_1, a_2)$——一方所赢即另一方所输。

设 $\boldsymbol{A} \in \mathbb{R}^{m_1 \times m_2}$ 为博弈的收益矩阵。站在行玩家（row player）的角度，考虑如下优化问题：

$$
\min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y} = \min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \sum_{a_1 \in \mathcal{A}_1} \sum_{a_2 \in \mathcal{A}_2} \boldsymbol{x}[a_1]\, \boldsymbol{A}[a_1, a_2]\, \boldsymbol{y}[a_2]. \tag{1}
$$

其含义是：行玩家先指定策略 $\boldsymbol{x}$，列玩家随后对该策略做出最优反应。关键在于行玩家**预先预料到**列玩家会最优反应，这使得 (1) 的解格外稳健——行玩家是否提前宣布自己的策略都无所谓。von Neumann 著名的极小极大定理（minimax theorem）表明，在最优对弈下后行动并不带来优势：

> **定理 1.1（von Neumann, 1928）** 对任意矩阵 $\boldsymbol{A} \in \mathbb{R}^{m_1 \times m_2}$，
>
> $$
> \min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y} = \max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y} = v. \tag{2}
> $$

极小极大定理还有更一般的版本（如 Sion, 1958）。式 (2) 中的 $v$ 称为博弈的**值**（value）。定理 1.1 表明零和博弈有良好定义的值；一般和博弈则不然。

> **注 1.2（极小极大均衡即纳什均衡）** 设 $\boldsymbol{x} \in \arg\min_{\boldsymbol{x}' \in \Delta^{m_1}} \max_{\boldsymbol{y}' \in \Delta^{m_2}} \langle \boldsymbol{x}', \boldsymbol{A}\boldsymbol{y}'\rangle$ 与 $\boldsymbol{y} \in \arg\max_{\boldsymbol{y}' \in \Delta^{m_2}} \min_{\boldsymbol{x}' \in \Delta^{m_1}} \langle \boldsymbol{x}', \boldsymbol{A}\boldsymbol{y}'\rangle$ 为一对极小极大策略，则 $(\boldsymbol{x}, \boldsymbol{y})$ 是纳什均衡。事实上，由定理 1.1，对任意 $\boldsymbol{y}'$ 有 $\langle \boldsymbol{x}, \boldsymbol{A}\boldsymbol{y}'\rangle \le v = \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y}$，对任意 $\boldsymbol{x}'$ 有 $\langle \boldsymbol{x}', \boldsymbol{A}\boldsymbol{y}\rangle \ge v = \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y}$；反方向也成立。因此我们将直接称 $(\boldsymbol{x}, \boldsymbol{y})$ 为均衡。

> **注 1.3（一般位置的零和博弈有唯一均衡）** 一个零和博弈可以有多个均衡，但具有唯一均衡的博弈集合测度为 1（van Damme, 1991）：非正式地说，若从某个博弈分布中随机采样一个博弈，它几乎必然有唯一均衡。

### 线性规划形式

此处的核心算法问题是：如何高效求解 (1)？事实上，零和博弈与线性规划在计算上是等价的（von Stengel, 2024），这里只讲“博弈归约到 LP”这一方向。

首先，(1) 等价于 $\min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \max_{a_2 \in \mathcal{A}_2} \boldsymbol{x}^\top \boldsymbol{A}[:, a_2]$，其中 $\boldsymbol{A}[:, a_2]$ 表示 $\boldsymbol{A}$ 中对应行动 $a_2$ 的列——因为列玩家总可以用**纯策略**做出最优反应。引入辅助变量 $t \in \mathbb{R}$，要求对所有 $a_2 \in \mathcal{A}_2$ 满足 $t \ge \boldsymbol{x}^\top \boldsymbol{A}[:, a_2]$。这意在实现 $\max_{a_2} \boldsymbol{x}^\top \boldsymbol{A}[:, a_2]$，但目前只保证了 $t \ge \max_{a_2} \boldsymbol{x}^\top \boldsymbol{A}[:, a_2]$；把目标函数取为 $\min t$，最优解处的 $t$ 就被迫恰好等于该最大值。综上得到线性规划：

$$
\begin{aligned}
\text{minimize}\quad & t \\
\text{subject to}\quad & t \ge \boldsymbol{x}^\top \boldsymbol{A}[:, a_2] \quad \forall a_2 \in \mathcal{A}_2, \\
& \sum_{a_1 \in \mathcal{A}_1} \boldsymbol{x}[a_1] = 1, \\
& \boldsymbol{x} \ge \boldsymbol{0}.
\end{aligned} \tag{P}
$$

可以断言：若 $(t, \boldsymbol{x})$ 是 (P) 的最优解，则 $\boldsymbol{x}$ 是 (1) 的解。同理，列玩家面临的问题 $\max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{y}$ 可写成：

$$
\begin{aligned}
\text{maximize}\quad & t \\
\text{subject to}\quad & t \le \boldsymbol{y}^\top \boldsymbol{A}[a_1, :] \quad \forall a_1 \in \mathcal{A}_1, \\
& \sum_{a_2 \in \mathcal{A}_2} \boldsymbol{y}[a_2] = 1, \\
& \boldsymbol{y} \ge \boldsymbol{0}.
\end{aligned} \tag{D}
$$

关键观察是：**(D) 正是 (P) 的对偶**。于是线性规划对偶直接蕴含定理 1.1——极小极大定理是 LP 对偶的推论。互补松弛性还能进一步读出均衡的结构：若最优解中某个纯行动 $a_1$ 以正概率进入行玩家的支撑集，则 (D) 中对应 $a_1$ 的约束必定取等，即该行动恰好取得对 $\boldsymbol{y}$ 的最高期望效用——支撑集中的每个纯行动都是对对手均衡策略的最优反应（Shoham and Leyton-Brown, 2009, §4.1）。

> **定理 1.4** 存在在多项式时间内求零和博弈（极小极大/纳什）均衡的算法。

遗憾的是，LP 求解器在大型博弈上扩展性不佳，这促使我们转向更简单的迭代算法。

## 2 简单迭代算法

用迭代算法求解零和博弈历史悠久，可追溯到 von Neumann 本人（Brown and von Neumann, 1950）。

### 2.1 最优反应动力学

最自然的思路莫过于让双方轮流对对方的策略做最优反应（best-response dynamics）。然而一般情形下它并不收敛——有些零和博弈甚至没有纯策略均衡，此时该算法注定失败。以石头剪刀布为例：记石头为 R、布为 P、剪刀为 S，从 $(R, P)$ 出发，一轮最优反应序列为

$$
(S, P) \to (S, R) \to (P, R) \to (P, S) \to (R, S) \to (R, P),
$$

恰好回到起点，于是无限循环下去：

![石头剪刀布中最优反应动力学的循环：双方轮流最优反应，六步后回到起点](assets/ch04-normal-form-1.png)

不过，若考察上例中的**平均策略**，它确实收敛到均衡——每个行动渐近地以 $1/3$ 的概率被使用。这一般成立吗？不然。例如可以微调石头剪刀布的收益，使得最优反应动力学的行为保持不变（行动的相对顺序不变），但均衡却不同：

> **命题 2.1** 存在这样的零和博弈：最优反应动力学下的平均策略不收敛到均衡。

### 2.2 虚拟博弈

更精巧的经典算法是**虚拟博弈**（fictitious play），由 Brown (1951) 提出、Robinson (1951) 证明收敛——这位 Julia Robinson 也为希尔伯特第十问题的解决做出过贡献。

虚拟博弈的流程如下：从任意初始策略 $(\boldsymbol{x}^{(1)}, \boldsymbol{y}^{(1)})$ 出发。记 $\bar{\boldsymbol{x}}^{(t)} = \sum_{\tau=1}^{t} \boldsymbol{x}^{(\tau)} / t$ 与 $\bar{\boldsymbol{y}}^{(t)}$ 为双方截至时刻 $t$ 的平均策略。在每个时刻 $t$，行玩家对对手迄今为止的平均策略做最优反应：

$$
\boldsymbol{x}^{(t)} \in \arg\min_{\boldsymbol{x} \in \Delta(\mathcal{A}_1)} \langle \boldsymbol{x}, \boldsymbol{A} \bar{\boldsymbol{y}}^{(t-1)} \rangle, \qquad \boldsymbol{y}^{(t)} \in \arg\max_{\boldsymbol{y} \in \Delta(\mathcal{A}_2)} \langle \bar{\boldsymbol{x}}^{(t-1)}, \boldsymbol{A} \boldsymbol{y} \rangle.
$$

可以把它理解为最基本的对手建模（opponent modeling）：我们不知道对手的下一步行动，但假想一个“虚拟”对手，其下一步遵循历史平均。与最优反应动力学不同，虚拟博弈的时间平均在任何零和博弈中都收敛：

> **定理 2.2（Robinson, 1951）** 虚拟博弈的时间平均在零和博弈中收敛。

Robinson 原文只证明了渐近收敛；其证明依赖一个精巧的归纳论证，可从中推出 $O\big(t^{-\frac{1}{m_1 + m_2 - 2}}\big)$ 的速率。Daskalakis and Pan (2014) 后来证明收敛速率确实可以指数级缓慢：对某个 $m \times m$ 收益矩阵——事实上就是单位矩阵——虚拟博弈的收敛速率为 $\Omega(t^{-1/m})$。该结果的一个保留条件是它只对**对抗性决胜规则**（adversarial tie-breaking）成立；非对抗决胜规则下虚拟博弈的收敛速率仍是公开问题（近期进展见 Wang, 2025）。

另一个问题是：虚拟博弈只有在**双方都**遵循该算法时才收敛；若对手知道我们在用虚拟博弈，我们就会被利用（exploitable）——下一节将形式化这一点。

## 3 在线学习、后悔最小化与自对弈

本节引入在线学习（online learning）与后悔最小化（regret minimization）框架，既回答上述问题，也给出比虚拟博弈收敛保证更强的算法。核心联系是：自对弈（self-play）中的后悔最小化会收敛到不同类型的均衡。

### 3.1 在线学习与后悔

考虑一个学习者，要在 $T$ 轮中与一个（可能对抗的）环境交互。每轮 $t \in [T]$，学习者先指定一个混合策略 $\boldsymbol{x}^{(t)} \in \Delta(\mathcal{A})$（更一般地，可从任意凸紧集中选取）；环境随后给出一个效用向量 $\boldsymbol{u}^{(t)}$，学习者本轮获得的效用为 $\langle \boldsymbol{x}^{(t)}, \boldsymbol{u}^{(t)} \rangle$。在线算法根据迄今观察到的反馈产生策略序列，目标是最大化累计收益。

如何衡量学习者的表现？最常用的基准是**后悔**（regret）：

$$
\mathrm{Reg}^{(T)} := \max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \left\{ \sum_{t=1}^{T} \langle \boldsymbol{x}, \boldsymbol{u}^{(t)} \rangle \right\} - \sum_{t=1}^{T} \langle \boldsymbol{x}^{(t)}, \boldsymbol{u}^{(t)} \rangle. \tag{3}
$$

第二项是学习者 $T$ 轮的累计效用，第一项是事后看来用某个**固定策略**能获得的最优效用。学习者自然希望最小化后悔。

> **注 3.1** 后悔可以为负，即所有固定策略的事后效用都不如学习者实际所得。一个简单的例子：当 $t$ 为偶数时 $\boldsymbol{x}^{(t)} = \boldsymbol{u}^{(t)} = (1, 0)$，当 $t$ 为奇数时 $\boldsymbol{x}^{(t)} = \boldsymbol{u}^{(t)} = (0, 1)$。这一观察在后续课程中会用到。

若一个在线算法在任意（可能对抗选取的）效用序列下都满足 $\mathrm{Reg}^{(T)} = o(T)$，则称其为**无后悔**（no-regret）算法；我们主要关注能产生形如 $T^{1-\alpha}$（常数 $\alpha \in (0, 1]$）的强次线性后悔的算法。

#### 虚拟博弈是无后悔的吗？

虚拟博弈也可以看作一个在线学习算法——在学习理论文献中它通常叫**跟随领导者**（follow the leader, FTL）：每轮 $t$ 选择

$$
\boldsymbol{x}^{(t)} \in \arg\max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \sum_{\tau=1}^{t-1} \langle \boldsymbol{x}, \boldsymbol{u}^{(\tau)} \rangle. \tag{4}
$$

它具有无后悔性质吗？答案是否定的。

> **命题 3.2** 存在效用序列 $(\boldsymbol{u}^{(t)})_{t=1}^{T}$ 使虚拟博弈蒙受 $\Omega(T)$（线性）后悔。

**证明思路。** 设虚拟博弈初始选择第一个行动，考虑如下效用序列：

$$
\boldsymbol{u}^{(t)} = \begin{cases}
(\epsilon, 0) & \text{若 } t = 1, \\
(0, 1) & \text{若 } t \equiv 0 \pmod 2, \\
(1, 0) & \text{否则}.
\end{cases}
$$

不难看出虚拟博弈在该序列下蒙受线性后悔：它只在第一轮获得非零效用 $\epsilon$，而事后看来任何固定策略大约能累计 $T/2$ 的效用。$\square$

命题 3.2 的构造可以大幅加强。**任何确定性**在线算法都无法避免线性后悔（Blum and Mansour, 2007, Theorem 4.3）：对抗方只需在每一轮给学习者所选行动赋予效用 0、其余行动效用 1，则学习者的累计效用恒为 0；而 $m$ 个行动中必有某个行动至多只被选中 $T/m$ 次，其累计效用至少 $(1 - 1/m)T$。这说明**随机化**是无后悔性质的本质要素。另一方面，即便允许随机化，把比较基准加强为事后最优的**行动序列**（而非固定策略）也是不可行的：对任意在线算法，对抗方每轮给概率最小的行动效用 1、其余行动效用 0，学习者每轮期望效用不超过 $1/m$，而逐轮取该行动的序列获得效用 $T$，故后悔至少 $(1 - 1/m)T$（Blum and Mansour, 2007, Theorem 4.1）。这解释了为什么后悔的定义 (3) 选取“最优固定策略”作为基准。

#### 跟随正则化领导者（FTRL）

为弥补虚拟博弈的这一缺陷，对 (4) 做一个小改动：

$$
\boldsymbol{x}^{(t)} = \arg\max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \left\{ \sum_{\tau=1}^{t-1} \langle \boldsymbol{x}, \boldsymbol{u}^{(\tau)} \rangle - \frac{1}{\eta} \mathcal{R}(\boldsymbol{x}) \right\}, \tag{5}
$$

其中 $\eta > 0$ 是**学习率**（learning rate），$\mathcal{R}$ 是严格凸的**正则化子**（regularizer）。算法 (5) 称为跟随正则化领导者（follow the regularized leader, FTRL）（Kalai and Vempala, 2005）；由于最大化问题是严格凹的，策略是良定义的。直观上，FTRL 用一个鼓励策略更加混合的正则化子来平衡虚拟博弈——向策略中注入更多随机性，使对手更难利用学习者；学习率 $\eta$ 调节混合的程度。当 $\eta = +\infty$ 时 (5) 退化为虚拟博弈。

> **例 3.3（乘性权重更新）** 取负熵正则化子 $\mathcal{R} : \boldsymbol{x} \mapsto \sum_{a \in \mathcal{A}} \boldsymbol{x}[a] \ln \boldsymbol{x}[a]$，不难证明 (5) 的解为 $\boldsymbol{x}^{(t)}[a] \propto \exp\big(\eta \sum_{\tau=1}^{t-1} \boldsymbol{u}^{(\tau)}[a]\big)$。这就是乘性权重更新（multiplicative weights update, MWU，又称指数权重或随机加权多数），也许是被研究得最透彻的在线算法。

> **例 3.4（欧几里得正则化）** 取 $\mathcal{R} : \boldsymbol{x} \mapsto \frac{1}{2} \sum_{a \in \mathcal{A}} (\boldsymbol{x}[a])^2 = \frac{1}{2} \|\boldsymbol{x}\|_2^2$，则 (5) 的解为 $\boldsymbol{x}^{(t)} = \Pi_{\Delta(\mathcal{A})}\big(\eta \sum_{\tau=1}^{t-1} \boldsymbol{u}^{(\tau)}\big)$，其中 $\Pi_{\Delta(\mathcal{A})}(\cdot)$ 表示欧几里得投影算子。

记 $R := \max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \mathcal{R}(\boldsymbol{x}) - \min_{\boldsymbol{x} \in \Delta(\mathcal{A})} \mathcal{R}(\boldsymbol{x})$ 为正则化子的**值域**（range），并假设 $\mathcal{R}$ 关于范数 $\|\cdot\|$ 是 1-强凸的。记 $\|\cdot\|_*$ 为对偶范数（dual norm）：$\|\boldsymbol{u}\|_* := \sup_{\|\boldsymbol{x}\| \le 1} \langle \boldsymbol{x}, \boldsymbol{u} \rangle$。例如 $\|\cdot\|_1$ 的对偶范数是 $\|\cdot\|_\infty$，$\|\cdot\|_2$ 的对偶范数是它自身；一般地，当 $1/p + 1/q = 1$ 时 $\|\cdot\|_p$ 与 $\|\cdot\|_q$ 互为对偶。在此设定下，FTRL 享有如下无后悔保证：

> **定理 3.5（Kalai and Vempala, 2005）** 对任意效用序列 $(\boldsymbol{u}^{(t)})_{t=1}^{T}$，FTRL 的后悔满足
>
> $$
> \mathrm{Reg}^{(T)} \le \frac{R}{\eta} + \eta \sum_{t=1}^{T} \|\boldsymbol{u}^{(t)}\|_*^2. \tag{6}
> $$
>
> 特别地，若对所有 $t$ 有 $\|\boldsymbol{u}^{(t)}\|_* \le B$，取 $\eta := \frac{1}{B}\sqrt{R/T}$，则 $\mathrm{Reg}^{(T)} \le 2B\sqrt{RT}$。

具体到 MWU（例 3.3）：熵正则化子的值域为 $\ln m$，故若效用满足 $\|\boldsymbol{u}^{(t)}\|_\infty \le 1$，MWU 保证 $\mathrm{Reg}^{(T)} \le 2\sqrt{T \ln m}$——这在对抗效用序列下已知是最优的。定理 3.5 中学习率的调节假设时间范围 $T$ 事先已知，但这并非必要：可以采用倍增技巧（doubling trick）（Shalev-Shwartz, 2012）。

定理 3.5 是一般框架的推论；对 MWU 还有一个更直接的**权重论证**（Littlestone and Warmuth, 1994；亦见 Blum and Mansour, 2007, Theorem 4.5）。改用损失记号 $\boldsymbol{\ell}^{(t)} \in [0, 1]^{\mathcal{A}}$（相当于对效用取负）表述最简洁：MWU 维护权重 $w^{(t)}[a] = (1 - \eta)^{\sum_{\tau < t} \boldsymbol{\ell}^{(\tau)}[a]}$ 并取 $\boldsymbol{x}^{(t)} \propto \boldsymbol{w}^{(t)}$。证明的关键构造是考察总权重 $W^{(t)} := \sum_{a} w^{(t)}[a]$ 的演化：记 $F^{(t)}$ 为时刻 $t$ 总权重中落在损失为 1 的行动上的比例（二元损失情形），它恰好等于算法当轮的期望损失，而每轮恰好有 $\eta F^{(t)}$ 比例的总权重被移除，即 $W^{(t+1)} = W^{(t)} (1 - \eta F^{(t)})$。另一方面，最优行动的权重给出下界 $W^{(T+1)} \ge (1 - \eta)^{L_{\min}}$，其中 $L_{\min}$ 为最优固定行动的累计损失。联立两式取对数，利用 $\ln(1 - z) \le -z$ 与 $-\ln(1 - z) \le z + z^2$（$0 \le z \le 1/2$），得 $L_{\mathrm{MWU}}^{(T)} \le (1 + \eta) L_{\min} + \frac{\ln m}{\eta}$；取 $\eta = \sqrt{\ln m / T}$ 即恢复 $2\sqrt{T \ln m}$ 量级的后悔界。同样的论证对 $[0, 1]$ 值损失成立（更新规则改为每轮把权重乘以 $1 - \eta\, \boldsymbol{\ell}^{(\tau)}[a]$），且可以进一步给出依赖最优行动损失二阶量的精细化界 $L^{(T)} \le L_{\min} + \eta Q_{\min} + \frac{\ln m}{\eta}$（多项式权重算法，Blum and Mansour, 2007, Theorem 4.6），在最优行动损失很小时表现更好。

MWU 的 $O(\sqrt{T \ln m})$ 界在两个方向上是紧的（Blum and Mansour, 2007, §4.3.4）。其一，当 $T < \log_2 m$ 时不存在次线性后悔保证：对抗方每轮从迄今累计损失为 0 的行动中随机保留一半继续赋损失 0、其余赋损失 1，则任何在线算法的期望损失都是 $T/2$，却始终存在一个总损失为 0 的行动。其二，即使 $m = 2$ 且损失序列由公平硬币独立生成（$(0, 1)$ 与 $(1, 0)$ 各以概率 $1/2$ 出现），任何在线算法的期望后悔也是 $\Omega(\sqrt{T})$——这来自二项分布中心项 $\sqrt{T}$ 量级的涨落。

#### 镜像下降

与 FTRL 密切相关的另一类算法是（在线）镜像下降（mirror descent, MD）。对正则化子 $\mathcal{R}$，其诱导的 Bregman 散度（Bregman divergence）定义为 $\mathcal{B}_{\mathcal{R}}(\boldsymbol{x}, \boldsymbol{x}') := \mathcal{R}(\boldsymbol{x}) - \mathcal{R}(\boldsymbol{x}') - \langle \nabla \mathcal{R}(\boldsymbol{x}'), \boldsymbol{x} - \boldsymbol{x}' \rangle$。例如：

- 欧几里得正则化子 $\mathcal{R} : \boldsymbol{x} \mapsto \frac{1}{2}\|\boldsymbol{x}\|_2^2$ 生成平方欧氏距离 $\mathcal{B}_{\mathcal{R}}(\boldsymbol{x}, \boldsymbol{x}') = \frac{1}{2}\|\boldsymbol{x} - \boldsymbol{x}'\|_2^2$；
- 负熵正则化子 $\mathcal{R} : \boldsymbol{x} \mapsto \sum_{a \in \mathcal{A}} \boldsymbol{x}[a] \ln \boldsymbol{x}[a]$ 生成 KL 散度 $\mathcal{B}_{\mathcal{R}}(\boldsymbol{x}, \boldsymbol{x}') = \sum_{a \in \mathcal{A}} \boldsymbol{x}[a] \ln \frac{\boldsymbol{x}[a]}{\boldsymbol{x}'[a]}$。

MD 的更新规则为：

$$
\boldsymbol{x}^{(t)} := \arg\max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \left\{ \langle \boldsymbol{x}, \boldsymbol{u}^{(t-1)} \rangle - \frac{1}{\eta} \mathcal{B}_{\mathcal{R}}(\boldsymbol{x}, \boldsymbol{x}^{(t-1)}) \right\}. \tag{7}
$$

MD 在“针对上一次观察到的效用 $\boldsymbol{u}^{(t-1)}$ 做优化”与“以 Bregman 散度度量、保持接近上一个策略 $\boldsymbol{x}^{(t-1)}$”之间取得平衡；$\eta = +\infty$ 的极端情形就是对上一次效用做最优反应。

在对 $\mathcal{R}$ 的一定假设下——即 $\mathcal{R}$ 是 Legendre 正则化子（Cesa-Bianchi and Lugosi, 2006）——已知 MD 与 FTRL 等价。例如 $\mathcal{R}$ 取负熵时，FTRL 与 MD 都产生 MWU。

> **例 3.6（在线梯度下降）** 取 $\mathcal{R} : \boldsymbol{x} \mapsto \frac{1}{2}\|\boldsymbol{x}\|_2^2$，(7) 变为 $\boldsymbol{x}^{(t)} = \Pi_{\Delta(\mathcal{A})}\big(\boldsymbol{x}^{(t-1)} + \eta \boldsymbol{u}^{(t-1)}\big)$，即在线梯度下降（online gradient descent）。

记 $R := \max_{\boldsymbol{x} \in \Delta(\mathcal{A})} \mathcal{B}_{\mathcal{R}}(\boldsymbol{x}, \boldsymbol{x}^{(1)})$。MD 享有与定理 3.5 几乎相同的无后悔保证：

> **定理 3.7** 对任意效用序列 $(\boldsymbol{u}^{(t)})_{t=1}^{T}$，MD 的后悔满足
>
> $$
> \mathrm{Reg}^{(T)} \le \frac{R}{\eta} + \eta \sum_{t=1}^{T} \|\boldsymbol{u}^{(t)}\|_*^2.
> $$

#### 后悔匹配

回到例 3.3，MWU 的更新规则可以等价地写成

$$
\boldsymbol{x}^{(t)}[a] \propto \exp\Big(\eta \sum_{\tau=1}^{t-1} \big(\boldsymbol{u}^{(\tau)}[a] - \langle \boldsymbol{x}^{(\tau)}, \boldsymbol{u}^{(\tau)} \rangle\big)\Big) = \exp\big(\eta \boldsymbol{r}^{(t-1)}[a]\big),
$$

其中 $\boldsymbol{r}^{(t)} := \sum_{\tau=1}^{t} \big(\boldsymbol{u}^{(\tau)} - \langle \boldsymbol{x}^{(\tau)}, \boldsymbol{u}^{(\tau)}\rangle \boldsymbol{1}\big)$ 是累计（反事实）后悔向量，$\boldsymbol{1}$ 为全 1 向量。类似地，带欧几里得正则化的 FTRL（例 3.4）可等价写成 $\boldsymbol{x}^{(t)} := \Pi_{\Delta(\mathcal{A})}\big(\eta \boldsymbol{r}^{(t-1)}\big)$。由此自然引出另一个算法：

$$
\boldsymbol{x}^{(t)} \propto \max\big(\boldsymbol{r}^{(t-1)}, \boldsymbol{0}\big) := \big[\boldsymbol{r}^{(t-1)}\big]^+,
$$

这正是**后悔匹配**（regret matching, RM）（Hart and Mas-Colell, 2000），见算法 1。它同样具有无后悔性质：

> **定理 3.8** 对任意取值于 $[0,1]^{\mathcal{A}}$ 的效用序列 $(\boldsymbol{u}^{(t)})_{t=1}^{T}$，RM 的后悔不超过 $\sqrt{mT}$。

```text
算法 1：后悔匹配（RM）                    算法 2：后悔匹配+（RM+）
 1  初始化累计后悔 r(0) := 0                1  初始化累计后悔 r(0) := 0
 2  for t = 1, ..., T do                   2  for t = 1, ..., T do
 3      θ(t) := max(r(t-1), 0)             3      θ(t) := r(t-1)
 4      if θ(t) = 0 then                   4      if θ(t) = 0 then
 5          任取 x(t) ∈ Δ(A)               5          任取 x(t) ∈ Δ(A)
 6      else                               6      else
 7          x(t) := θ(t) / ‖θ(t)‖₁          7          x(t) := θ(t) / ‖θ(t)‖₁
 8      输出策略 x(t) ∈ Δ(A)                8      输出策略 x(t) ∈ Δ(A)
 9      观察效用 u(t) ∈ [0,1]^A             9      观察效用 u(t) ∈ [0,1]^A
10      r(t) := r(t-1) + u(t)              10      r(t) := [r(t-1) + u(t)
            - ⟨x(t), u(t)⟩1                        - ⟨x(t), u(t)⟩1]⁺
```

**定理 3.8 的证明。** 对任意 $t$，

$$
\big\|\big[\boldsymbol{r}^{(t)}\big]^+\big\|_2^2 \le \big\|\big[\boldsymbol{r}^{(t-1)}\big]^+ + \boldsymbol{g}^{(t)}\big\|_2^2 \le \big\|\big[\boldsymbol{r}^{(t-1)}\big]^+\big\|_2^2 + \big\|\boldsymbol{g}^{(t)}\big\|_2^2 + 2\big\langle \big[\boldsymbol{r}^{(t-1)}\big]^+, \boldsymbol{g}^{(t)} \big\rangle,
$$

其中 $\boldsymbol{g}^{(t)} := \boldsymbol{u}^{(t)} - \langle \boldsymbol{x}^{(t)}, \boldsymbol{u}^{(t)} \rangle \boldsymbol{1}$ 为瞬时后悔（instantaneous regret）。由于 $\langle \boldsymbol{x}^{(t)}, \boldsymbol{g}^{(t)} \rangle = 0$，且由 RM 的定义 $\boldsymbol{x}^{(t)} \propto [\boldsymbol{r}^{(t-1)}]^+$，可得 $\big\langle [\boldsymbol{r}^{(t-1)}]^+, \boldsymbol{g}^{(t)} \big\rangle = 0$——**瞬时后悔始终与迄今累计的（正）后悔正交**。于是

$$
\big\|\big[\boldsymbol{r}^{(t)}\big]^+\big\|_2^2 \le \big\|\big[\boldsymbol{r}^{(t-1)}\big]^+\big\|_2^2 + \big\|\boldsymbol{g}^{(t)}\big\|_2^2.
$$

该求和形成伸缩级数（telescoping sum），故 $\big\|[\boldsymbol{r}^{(T)}]^+\big\|_2^2 \le \sum_{t=1}^{T} \|\boldsymbol{g}^{(t)}\|_2^2 \le mT$（因对所有 $t$ 有 $\|\boldsymbol{g}^{(t)}\|_\infty \le 1$）。$\square$

这就是“勾股引理”（Pythagorean lemma）：累计后悔的模长每轮最多按 $\sqrt{T}$ 增长，如下图所示：

![勾股引理示意：每个瞬时后悔 g(t) 与已累计的后悔正交，累计后悔的模长以 √T 的速度增长](assets/ch04-normal-form-2.png)

虽然这个后悔界不如 MWU 的 $2\sqrt{T \ln m}$，但 RM **无参数**且**尺度不变**（scale invariant），实践中表现往往相当出色（后续课程详述）。

值得指出，Hart and Mas-Colell (2000) 的原始结果针对的是比外部后悔更强的**内部后悔**（internal regret）。用修改规则（modification rule）的语言可以更精确地刻画这一层次（Blum and Mansour, 2007, §4.2）：一个（无记忆）修改规则 $F : \mathcal{A} \to \mathcal{A}$ 把学习者选出的行动 $a$ 事后替换为 $F(a)$；算法关于规则族 $\mathcal{F}$ 的后悔定义为 $\max_{F \in \mathcal{F}} \sum_{t=1}^{T} \sum_{a \in \mathcal{A}} \boldsymbol{x}^{(t)}[a]\, \big(\boldsymbol{u}^{(t)}[F(a)] - \boldsymbol{u}^{(t)}[a]\big)$。取 $\mathcal{F}$ 为 $m$ 个常值映射即回到（外部）后悔 (3)；取 $\mathcal{F}$ 为全部 $m(m-1)$ 个“单点交换”映射 $F_{a \to a'}$（只把 $a$ 换成 $a'$、其余不动）即得内部后悔；取全部 $m^m$ 个映射则得交换后悔（swap regret），它同时上界外部与内部后悔。Hart and Mas-Colell (2000) 正是基于逐行动的反事实后悔思想设计出无内部后悔的自适应过程——后悔匹配即源于此——而内部后悔次线性的自对弈会收敛到相关均衡（见第 3.3 节）。

对 RM 做一个小改动即得 **RM+**（算法 2），由 Tammelin (2014) 提出：唯一区别是每次更新时把负后悔截断为 0（第 10 行）。与定理 3.8 完全相同的证明表明 RM+ 享有类似的后悔保证，但实践中 RM+ 通常远优于 RM。Farina et al. (2021) 最近揭示了一个精巧的联系：在某个提升空间（lifted space）上操作时，RM+ 是 MD 的实例而 RM 是 FTRL 的实例——尽管 RM 与 RM+ 都是无参数的，不同于 FTRL 与 MD。这一联系围绕 Blackwell 可接近性（Blackwell approachability）框架（Blackwell, 1956）展开。RM+ 最初只是为加速 RM 而提出的简单启发式，而 Farina et al. (2021) 的结果表明 RM 与 RM+ 之间的差异是本质的。

### 3.2 零和博弈中的自对弈

后悔最小化与博弈均衡计算之间有一个著名的联系。先看零和博弈：让**双方都**采用后悔最小化算法——行玩家观察效用序列 $(-\boldsymbol{A}\boldsymbol{y}^{(t)})_{t=1}^{T}$，列玩家观察效用序列 $(\boldsymbol{A}^\top \boldsymbol{x}^{(t)})_{t=1}^{T}$。只要双方都是无后悔的，就能收敛到均衡（Freund and Schapire, 1999）；通常双方使用同一个后悔最小化算法，因此这一范式常被称为“自对弈”（self-play）。

称策略组合 $(\boldsymbol{x}, \boldsymbol{y})$ 为 **$\epsilon$-均衡**，若

$$
\max_{\boldsymbol{y}' \in \Delta(\mathcal{A}_2)} \langle \boldsymbol{y}', \boldsymbol{A}^\top \boldsymbol{x} \rangle - \min_{\boldsymbol{x}' \in \Delta(\mathcal{A}_1)} \langle \boldsymbol{x}', \boldsymbol{A} \boldsymbol{y} \rangle \le \epsilon; \tag{8}
$$

式 (8) 左端称为**对偶间隙**（duality gap）。

> **定理 3.9** 设行玩家在效用序列 $(-\boldsymbol{A}\boldsymbol{y}^{(t)})_{t=1}^{T}$ 下的后悔为 $\mathrm{Reg}_1^{(T)}$，列玩家在效用序列 $(\boldsymbol{A}^\top \boldsymbol{x}^{(t)})_{t=1}^{T}$ 下的后悔为 $\mathrm{Reg}_2^{(T)}$。则 $(\bar{\boldsymbol{x}}^{(T)}, \bar{\boldsymbol{y}}^{(T)})$ 是一个 $\epsilon$-均衡，其中 $\epsilon = \frac{1}{T}\big(\mathrm{Reg}_1^{(T)} + \mathrm{Reg}_2^{(T)}\big)$。

**证明。** 行玩家的后悔可写成

$$
\mathrm{Reg}_1^{(T)} = \max_{\boldsymbol{x}' \in \Delta(\mathcal{A}_1)} \sum_{t=1}^{T} \langle \boldsymbol{x}' - \boldsymbol{x}^{(t)}, -\boldsymbol{A}\boldsymbol{y}^{(t)} \rangle = \sum_{t=1}^{T} \langle \boldsymbol{x}^{(t)}, \boldsymbol{A}\boldsymbol{y}^{(t)} \rangle - T \min_{\boldsymbol{x}' \in \Delta(\mathcal{A}_1)} \langle \boldsymbol{x}', \boldsymbol{A} \bar{\boldsymbol{y}}^{(T)} \rangle. \tag{9}
$$

类似地，

$$
\mathrm{Reg}_2^{(T)} = \max_{\boldsymbol{y}' \in \Delta(\mathcal{A}_2)} \sum_{t=1}^{T} \langle \boldsymbol{y}' - \boldsymbol{y}^{(t)}, \boldsymbol{A}^\top \boldsymbol{x}^{(t)} \rangle = T \max_{\boldsymbol{y}' \in \Delta(\mathcal{A}_2)} \langle \boldsymbol{y}', \boldsymbol{A}^\top \bar{\boldsymbol{x}}^{(T)} \rangle - \sum_{t=1}^{T} \langle \boldsymbol{x}^{(t)}, \boldsymbol{A}\boldsymbol{y}^{(t)} \rangle. \tag{10}
$$

将 (9) 与 (10) 相加即得结论。$\square$

于是，若双方的后悔都是次线性的，平均策略的对偶间隙以 $O(1/\sqrt{T})$ 量级收敛到 0，即平均策略收敛到极小极大均衡。

### 3.3 一般和博弈中的自对弈

现在把上述联系推广到多人一般和博弈。后悔最小化算法未必收敛到纳什均衡，但会收敛到所谓的粗相关均衡。

> **定义 3.10（粗相关均衡）** 相关分布 $\boldsymbol{\mu} \in \Delta(\mathcal{A}_1 \times \cdots \times \mathcal{A}_n)$ 是一个 $\epsilon$-粗相关均衡（coarse correlated equilibrium, CCE），若对任意玩家 $i \in [n]$ 与偏离行动 $a_i' \in \mathcal{A}_i$，
>
> $$
> \mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i(a_1, \dots, a_n) \ge \mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i(a_i', a_{-i}) - \epsilon.
> $$

纳什均衡总是粗相关均衡，反之不然——纳什均衡可视为不相关的（粗）相关均衡，即 $\boldsymbol{\mu}$ 是乘积分布。

> **定理 3.11** 设每个玩家 $i \in [n]$ 在效用序列 $(\boldsymbol{u}_i^{(t)}(\boldsymbol{x}_{-i}^{(t)}))_{t=1}^{T}$ 下的后悔为 $\mathrm{Reg}_i^{(T)}$。则分布 $\boldsymbol{\mu} := \frac{1}{T} \sum_{t=1}^{T} \boldsymbol{x}_1^{(t)} \otimes \cdots \otimes \boldsymbol{x}_n^{(t)}$ 是一个 $\epsilon$-粗相关均衡，其中 $\epsilon = \frac{1}{T} \max_{1 \le i \le n} \mathrm{Reg}_i^{(T)}$。

几点说明：$\boldsymbol{x}_1^{(t)} \otimes \cdots \otimes \boldsymbol{x}_n^{(t)}$ 表示由 $(\boldsymbol{x}_1^{(t)}, \dots, \boldsymbol{x}_n^{(t)})$ 诱导的乘积分布，$\otimes$ 为张量积；因此定理 3.11 给出的相关分布 $\boldsymbol{\mu}$ 是 $T$ 个乘积分布的混合。另外，这里重载记号记 $\mathbb{R}^{\mathcal{A}_i} \ni \boldsymbol{u}_i^{(t)}(\boldsymbol{x}_{-i}) := \big(u_i(a_i, \boldsymbol{x}_{-i}^{(t)})\big)_{a_i \in \mathcal{A}_i}$。

粗相关均衡要求玩家在收到任何推荐**之前**就承诺不偏离；更强的**相关均衡**（correlated equilibrium, CE）则要求玩家在收到推荐行动 $a_i$ **之后**——即在以 $\boldsymbol{\mu}$ 为条件的后验下——仍不愿偏离。外部后悔的自对弈收敛到 CCE，而内部（或交换）后悔的自对弈收敛到 CE，这正是上节所述后悔层次的博弈论对应。与纳什均衡形成鲜明对照的是，一个 CE 样本可以用线性规划在多项式时间内求得（Shoham and Leyton-Brown, 2009, §4.6）：以每个纯行动组合的概率 $p(a_1, \dots, a_n)$ 为变量（变量数与标准式表示的规模同阶），激励约束为对所有玩家 $i$ 与所有 $a_i, a_i' \in \mathcal{A}_i$，

$$
\sum_{a_{-i} \in \mathcal{A}_{-i}} \big(u_i(a_i, a_{-i}) - u_i(a_i', a_{-i})\big)\, p(a_i, a_{-i}) \ge 0,
$$

即玩家 $i$ 被推荐 $a_i$ 时，遵从推荐的期望效用不劣于任何偏离；再配上 $p \ge \boldsymbol{0}$ 与 $\sum_{a} p(a) = 1$。该约束是线性的，因为 CE 只涉及对行动组合的**单一**联合随机化；相比之下，若把纳什均衡的定义直接写成可行性规划，约束中将出现 $\prod_{j} p_j(a_j)$ 这样的乘积项——各玩家**独立**随机化使约束双线性化，这正是 CE 可多项式时间求解、而一般和博弈的纳什均衡不能的本质原因。给该 LP 添加目标函数（如最大化社会福利 $\sum_{a} p(a) \sum_{i} u_i(a)$）还可以在多项式时间内选出具有所需性质的 CE；事实上，唯一性、Pareto 最优、保证收益、子集包含与包含于子集等判定问题对 CE 而言都在 P 中（Shoham and Leyton-Brown, 2009, Theorem 4.6.1）。

## 要点小结

- 二人零和博弈中，行玩家的极小极大问题 (1) 可写成线性规划 (P)；列玩家的对应问题 (D) 恰好是 (P) 的对偶，故 von Neumann 极小极大定理是 LP 对偶的推论，并给出求均衡的多项式时间算法（定理 1.4）。极小极大均衡即纳什均衡，且一般位置的零和博弈均衡唯一。
- 最优反应动力学一般不收敛（石头剪刀布中循环），其平均策略也可能不收敛（命题 2.1）。虚拟博弈（对对手历史平均策略做最优反应）的时间平均在零和博弈中总收敛（定理 2.2），但速率可慢至 $\Omega(t^{-1/m})$（Daskalakis–Pan，对抗性决胜规则下），且作为策略本身可被对手利用。
- 在线学习中，后悔衡量与事后最优固定策略的差距；虚拟博弈（跟随领导者）不是无后悔的（命题 3.2，线性后悔），且任何确定性算法都必然蒙受线性后悔，与事后最优行动序列竞争亦不可行——故“最优固定策略 + 随机化”是恰当的基准。
- FTRL 在累积效用目标上加入严格凸正则化子：取负熵得 MWU，取欧几里得正则化子得投影更新；其后悔界为 $R/\eta + \eta \sum_t \|\boldsymbol{u}^{(t)}\|_*^2$，最优调节学习率后为 $2B\sqrt{RT}$，MWU 特化为 $2\sqrt{T \ln m}$。MWU 另有以总权重为势函数的直接证明（权重每轮按期望损失比例衰减），且该界是紧的：$T < \log_2 m$ 时无次线性保证，$m = 2$ 时期望后悔 $\Omega(\sqrt{T})$。镜像下降用 Bregman 散度贴近上一策略，Legendre 正则化子下与 FTRL 等价，后悔界相同。
- 后悔匹配按 $[\boldsymbol{r}^{(t-1)}]^+$ 正比选策略，利用“瞬时后悔与累计后悔正交”的勾股引理证明 $\sqrt{mT}$ 的后悔界；RM+ 每步截断负后悔，实践中显著更好，且在提升空间上可视为 MD 的实例。后悔的层次可借修改规则刻画：外部后悔 ⊂ 内部后悔 ⊂ 交换后悔，Hart–Mas-Colell 的原始过程保证内部后悔次线性。
- 自对弈联系：零和博弈中双方均无后悔则平均策略收敛到 $\epsilon$-均衡，$\epsilon = (\mathrm{Reg}_1^{(T)} + \mathrm{Reg}_2^{(T)})/T$（定理 3.9）；一般和博弈中全体无（外部）后悔则平均相关分布收敛到粗相关均衡（定理 3.11），内部后悔则收敛到相关均衡。相关均衡还可用线性规划在多项式时间内求得（激励约束线性），与纳什均衡的双线性可行性约束形成对照。
