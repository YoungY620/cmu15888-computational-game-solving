# 相关均衡与 Φ-后悔

前面几讲已经给出在线环境中最小化后悔的高效算法。本讲转向一般和博弈：当所有玩家都采用无悔学习更新策略时，结果会收敛到什么？答案是相关均衡（correlated equilibrium, CE）与粗相关均衡（coarse correlated equilibrium, CCE）——一类比纳什均衡更易计算的解概念；连接两者的桥梁是 Φ-后悔（Φ-regret），而最小化 Φ-后悔可以归结为 Gordon 等人的通用框架与 Blum–Mansour 算法。

## 1 相关均衡与粗相关均衡

对纳什均衡的一个主要批评是：尽管它总是存在，但在一般和博弈中计算一个纳什均衡是困难的（PPAD 完全），更不必说计算最优的那个；此外还有均衡选择问题——一个博弈可能有多个差异很大的均衡。因此，我们不应期望在线梯度下降、后悔匹配这类简单的无悔算法收敛到纳什均衡。那么，无悔动态在一般和博弈中究竟收敛到什么？我们将讨论限制在标准式博弈（normal-form game）。

纳什均衡的一个关键前提是玩家**独立地**随机化。如果结果的分布是相关的呢？考虑某 $2\times 2$ 双矩阵博弈上的两个分布：

$$
\boldsymbol{\mu} = \begin{bmatrix} 1/2 & 0 \\ 0 & 1/2 \end{bmatrix}, \qquad
\boldsymbol{\mu}' = \begin{bmatrix} 1/6 & 1/6 \\ 1/3 & 1/3 \end{bmatrix}.
$$

两者都是 $\mathcal{A}_1\times\mathcal{A}_2=\{1,2\}\times\{1,2\}$ 上的分布，但只有 $\boldsymbol{\mu}'$ 是乘积分布：行玩家取 $(1/3,\,2/3)$、列玩家取 $(1/2,\,1/2)$ 时恰好诱导出 $\boldsymbol{\mu}'$；而没有任何一对独立策略能产生 $\boldsymbol{\mu}$。

> **定义 1.1（粗相关均衡，CCE）.** 相关分布 $\boldsymbol{\mu}\in\Delta(\mathcal{A}_1\times\cdots\times\mathcal{A}_n)$ 称为 $\epsilon$-粗相关均衡，如果对任意玩家 $i\in[n]$ 和偏移动作 $a_i'\in\mathcal{A}_i$，
> $$\mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i(a_1,\dots,a_n) \;\ge\; \mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i(a_i',\, a_{-i}) - \epsilon.$$

该定义与纳什均衡类似，但允许底层分布 $\boldsymbol{\mu}$ 相关。由此立得：纳什均衡总是 CCE——纳什均衡就是一个“不相关的”（粗）相关均衡。但 CCE 的集合可以带来新的、有时更理想的结果。

> **定义 1.2（相关均衡，CE，Aumann 1974）.** 相关分布 $\boldsymbol{\mu}\in\Delta(\mathcal{A}_1\times\cdots\times\mathcal{A}_n)$ 称为 $\epsilon$-相关均衡，如果对任意玩家 $i\in[n]$ 和偏移函数 $\phi_i:\mathcal{A}_i\to\mathcal{A}_i$，
> $$\mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i(a_1,\dots,a_n) \;\ge\; \mathbb{E}_{(a_1,\dots,a_n)\sim\boldsymbol{\mu}}\, u_i\big(\phi_i(a_i),\, a_{-i}\big) - \epsilon.$$

CE 中的偏移类比 CCE 更丰富：CCE 只允许常值偏移（把整个策略换成某个固定动作），CE 允许任意依赖于所推荐动作的交换偏移（swap deviation）。因此 CE 是更强的概念——任何 CE 也是 CCE，即 Nash $\subseteq$ CE $\subseteq$ CCE，如下图所示。

![三类解概念的包含关系：纳什均衡 ⊂ 相关均衡 ⊂ 粗相关均衡（Jason Marden 绘）](assets/ch06-phi-regret-1-06.png)

两个定义都可以通过一个可信第三方——**调解人（mediator）或相关装置（correlation device）**——来解释：调解人先从 $\boldsymbol{\mu}$ 中采样一个联合动作剖面 $(a_1,\dots,a_n)$，再把对应的 $a_i$ 作为建议私下告诉每位玩家 $i$。均衡的含义是：没有玩家有动机偏离建议。区别在于，CE 中玩家在**看到建议之后**再决定是否偏离（偏移 $\phi_i(a_i)$ 可以依赖建议本身），而 CCE 中玩家必须在看到建议**之前**就承诺是否跟随。从这个角度看，CCE 较难自圆其说——若没有某种有约束力的机制（binding mechanism），玩家看到建议后仍可能偏离。

### 例子：斗鸡博弈（game of chicken）

两名司机从不同街道快速驶向同一个十字路口，每人可以选择停（Stop）或行（Go）。若两人都选 Go 则撞车，对双方都是坏结果；若一人停下则他从博弈中得不到效用；若一人前行而另一人停下，前行者因快速通过路口获得效用 1。收益矩阵如下（左为行玩家收益）：

|  | Stop | Go |
|---|---|---|
| **Stop** | $0,\ 0$ | $0,\ 1$ |
| **Go** | $1,\ 0$ | $-5,\ -5$ |

![斗鸡博弈：两名司机驶向十字路口](assets/ch06-phi-regret-2-08.png)

该博弈恰好有三个纳什均衡：(Go, Stop)、(Stop, Go)，以及混合均衡 $((5/6,\,1/6),\,(5/6,\,1/6))$（两人都以概率 $5/6$ 选 Stop）。前两个不公平——偏袒一方；第三个更糟——以不可忽略的概率撞车，以至于双方的期望效用都是 0。纳什均衡在这里不能令人满意。

(C)CE 解锁了更好的结果。考虑相关分布 $\tfrac12(\text{Go},\text{Stop}) + \tfrac12(\text{Stop},\text{Go})$：容易验证它是 CE（从而也是 CCE），双方各得期望效用 $1/2$。这个结果有一个自然的解释：**红绿灯**就是相关装置。若玩家 1 被建议 Stop，意味着玩家 2 将以概率 1 选 Go，故停下符合玩家 1 的利益；若被建议 Go，意味着玩家 2 将以概率 1 选 Stop，前行是安全的。换言之，在 CE 中玩家观察到的信号会更新他对其他玩家行为的信念；纳什均衡是角落情形——由于玩家独立行动，信号不携带任何信息。

### 例子：CE 与 CCE 的差别

考虑如下 $4\times4$ 双矩阵博弈，行、列玩家的收益矩阵分别为

$$
R = \begin{bmatrix} 2&0&0&0\\ 0&2&0&0\\ 3&0&0&0\\ 0&3&0&0 \end{bmatrix},
\qquad
C = \begin{bmatrix} 2&0&3&0\\ 0&2&0&3\\ 0&0&0&0\\ 0&0&0&0 \end{bmatrix}.
$$

动作编号为 $1,2,3,4$。考虑分布 $\boldsymbol{\mu}=\tfrac12(1,1)+\tfrac12(2,2)$（这不是乘积分布）。可以验证 $\boldsymbol{\mu}$ 是精确 CCE：它对常值偏移是稳健的。但它不是 CE——其 CE 间隙为 1。取交换偏移 $\phi$：$1\mapsto 3$，$2\mapsto 4$（其余动作的映射无关紧要，因为在 $\boldsymbol{\mu}$ 下几乎必然不被使用）。在 $\boldsymbol{\mu}$ 下每位玩家得效用 2，而按 $\phi$ 偏移可得效用 3。这个例子说明：CE 中“看到建议后再决定如何偏移”的能力是有实质内容的。

### 计算性质

CCE 与 CE 不仅带来新结果，计算性质也优于纳什均衡：(C)CE 的集合是凸的，且可以用线性规划描述。

> **命题 1.5.** 存在一个具有 $\prod_{i=1}^{n}|\mathcal{A}_i|$ 个变量和 $\sum_{i=1}^{n}|\mathcal{A}_i|\,(|\mathcal{A}_i|-1)$ 个约束的线性规划，其解是博弈的一个精确相关均衡。

虽然玩家 $i$ 的交换偏移总数达 $|\mathcal{A}_i|^{|\mathcal{A}_i|}$，但只需考虑仅改变单个动作的偏移——称为**内部偏移（internal deviation）**，数目为 $|\mathcal{A}_i|(|\mathcal{A}_i|-1)$；证明留作练习。命题 1.5 的关键缺陷是：LP 的规模随玩家数指数增长，因为多人博弈中的相关分布本身就是指数对象——需要指定 $\prod_{i=1}^n|\mathcal{A}_i|-1$ 个坐标。因此该方法只适用于玩家数为常数的博弈；但至少我们知道常数玩家博弈中可以高效计算 CE。此外，还可以在该 LP 中加入任意线性目标函数，例如社会福利（玩家效用之和）。

## 2 Φ-后悔及其与相关均衡的联系

### Φ-后悔的定义

为把相关均衡与后悔最小化联系起来，引入 Φ-后悔：它由一族策略偏移 $\Phi$ 参数化。在通常的在线学习设定中，每轮 $t\in[T]$ 学习者先给出策略 $\boldsymbol{x}^{(t)}\in\mathcal{X}$（$\mathcal{X}$ 为凸紧集），随后环境给出线性效用函数 $\boldsymbol{x}\mapsto\langle\boldsymbol{x},\boldsymbol{u}^{(t)}\rangle$。对由函数 $\phi:\mathcal{X}\to\mathcal{X}$ 组成的偏移集 $\Phi$，定义

$$
\Phi\mathrm{Reg}^{(T)} := \max_{\phi\in\Phi}\left\{\sum_{t=1}^{T}\big\langle\phi(\boldsymbol{x}^{(t)}),\,\boldsymbol{u}^{(t)}\big\rangle\right\} - \sum_{t=1}^{T}\big\langle\boldsymbol{x}^{(t)},\,\boldsymbol{u}^{(t)}\big\rangle.
$$

此前的讲座关注过特例：$\Phi$ 只含常值偏移，即 $\Phi_{\mathrm{const}}=\{\phi:\exists\,\boldsymbol{x}'\in\mathcal{X},\ \phi(\boldsymbol{x})=\boldsymbol{x}'\}$，这就是在线学习中最标准的**外部后悔（external regret）**。关键点是：偏移集 $\Phi$ 越丰富，诱导的“事后理性”（hindsight rationality）概念越强。谱系的另一端是 $\Phi$ 包含所有可能的偏移 $\mathcal{X}\to\mathcal{X}$，称为**交换后悔（swap regret）**。

外部与交换之间还有一个经典概念：**内部后悔（internal regret）**，由 Foster 与 Vohra 提出。内部后悔只允许“把某个动作 $i$ 一律换成另一个动作 $j$”的偏移（其余动作不变），这样的偏移连同恒等映射共 $|\mathcal{A}|(|\mathcal{A}|-1)+1$ 个；交换后悔则允许全部 $|\mathcal{A}|^{|\mathcal{A}|}$ 个映射。由于任一交换偏移的增益可以按“原先动作”分解到各对 $(i,j)$ 上，交换后悔至多为内部后悔的 $|\mathcal{A}|$ 倍（Blum & Mansour, 2007）——因此在“是否次线性”的意义上两者等价，“无悔动态收敛到相关均衡”的结论用内部后悔陈述即可。

更一般地，在凸博弈（convex game，即策略集为凸紧集、效用函数多重线性的博弈）中，Gordon、Greenwald 与 Marks（2008）指出外部后悔与交换后悔之间存在一条严格加细的谱系：

$$
\Phi_{\mathrm{EXT}} \;\subset\; \Phi_{\mathrm{EF}} \;\subset\; \Phi_{\mathrm{LIN}} \;\subset\; \Phi_{\mathrm{FE}} \;\subset\; \Phi_{\mathrm{SWAP}},
$$

且各层互不重合（例如存在无 $\Phi_{\mathrm{LIN}}$-后悔但 $\Phi_{\mathrm{FE}}$-后悔为正的情形）。其中：**线性后悔（linear regret）**取 $\Phi$ 为全体把 $\mathcal{X}$ 映入自身的线性映射；**有限元后悔（finite-element regret）**先把多面体策略集三角剖分，再用重心坐标（barycentric coordinates）把连续偏移表示为高维空间中的线性映射——Gordon 等人证明，在多面体凸博弈中无有限元后悔即足以使经验分布收敛到相关均衡；**扩展式后悔（extensive-form regret）**对应扩展式博弈中“原策略即将在某个选择点行动时改为执行另一子策略”的偏移，无扩展式后悔的动态收敛到**扩展式相关均衡**（extensive-form correlated equilibrium，Forges & von Stengel, 2002）。本讲只在外部与交换两端展开；其余各层的高效算法见 Gordon 等人的论文。

外部后悔小并不意味着交换后悔小。设学习者在三个动作 $1,2,3$ 上选分布，效用与所选动作按下图模式循环（$T\equiv 0 \pmod 3$，第 $i$ 行是动作 $i$ 在各轮获得的效用）：

| 动作 \ 轮次 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 2 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| 3 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 |

学习者依次选动作 $3,2,1,3,2,1,\dots$，总效用 $T/3$，恰好等于事后最优固定动作的收益，故外部后悔为 0。但考虑交换偏移

$$
\phi:\ a\mapsto\begin{cases} 2 & a=1,\\ 1 & a=2,\\ 3 & a=3, \end{cases}
$$

按此偏移学习者每轮都拿到最大效用，交换后悔为 $2T/3=\Omega(T)$。事实上已知 MWU（乘性权重更新）的交换后悔可以线性增长，因此最小化交换后悔需要新的算法思想。

### 与均衡概念的对应

把定义 1.2 推广到一般多重线性博弈（multilinear game）：每位玩家 $i$ 从凸紧集 $\mathcal{X}_i$ 中选策略 $\boldsymbol{x}_i$，效用可写成 $u_i(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)=\langle\boldsymbol{x}_i,\, \boldsymbol{u}_i(\boldsymbol{x}_{-i})\rangle$，其中 $\boldsymbol{u}_i$ 不依赖 $\boldsymbol{x}_i$。这一抽象同时涵盖标准式博弈与序列形式表示下的扩展式博弈。

> **定义 1.7（Φ-均衡）.** 相关分布 $\boldsymbol{\mu}\in\Delta(\mathcal{X}_1\times\cdots\times\mathcal{X}_n)$ 称为 $\epsilon$-Φ-均衡，如果对任意玩家 $i\in[n]$ 和偏移函数 $\Phi_i\ni\phi_i:\mathcal{X}_i\to\mathcal{X}_i$，
> $$\mathbb{E}_{(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)\sim\boldsymbol{\mu}}\, u_i(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n) \;\ge\; \mathbb{E}_{(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)\sim\boldsymbol{\mu}}\, u_i\big(\phi_i(\boldsymbol{x}_i),\, \boldsymbol{x}_{-i}\big) - \epsilon.$$

> **定理 1.8.** 设每位玩家 $i\in[n]$ 在效用序列 $(\boldsymbol{u}_i(\boldsymbol{x}_{-i}^{(t)}))_{t=1}^{T}$ 下产生 $\Phi_i$-后悔 $\Phi\mathrm{Reg}_i^{(T)}$。则平均相关博弈分布
> $$\bar{\boldsymbol{\mu}} := \frac{1}{T}\sum_{t=1}^{T}\boldsymbol{x}_1^{(t)}\otimes\cdots\otimes\boldsymbol{x}_n^{(t)}$$
> 是一个 $\epsilon$-Φ-均衡，其中 $\epsilon=\frac{1}{T}\max_{1\le i\le n}\Phi\mathrm{Reg}_i^{(T)}$。

这里 $\boldsymbol{x}_1^{(t)}\otimes\cdots\otimes\boldsymbol{x}_n^{(t)}$ 是 $(\boldsymbol{x}_1^{(t)},\dots,\boldsymbol{x}_n^{(t)})$ 诱导的乘积分布（$\otimes$ 为张量积），故 $\bar{\boldsymbol{\mu}}$ 是 $T$ 个乘积分布的混合——相关性正是通过多轮博弈产生的。作为特例：最小化交换后悔的玩家（按平均相关博弈分布）收敛到相关均衡，而外部后悔对应粗相关均衡。

**证明.** 对任意玩家 $i$，由多重线性性，

$$
\Phi\mathrm{Reg}_i^{(T)} = \max_{\phi_i\in\Phi_i}\left\{\sum_{t=1}^{T}\big\langle\phi_i(\boldsymbol{x}_i^{(t)}),\,\boldsymbol{u}_i^{(t)}\big\rangle\right\} - \sum_{t=1}^{T}\big\langle\boldsymbol{x}_i^{(t)},\,\boldsymbol{u}_i^{(t)}\big\rangle
= \max_{\phi_i\in\Phi_i}\left\{\sum_{t=1}^{T} u_i\big(\phi_i(\boldsymbol{x}_i^{(t)}),\,\boldsymbol{x}_{-i}^{(t)}\big)\right\} - \sum_{t=1}^{T} u_i\big(\boldsymbol{x}_1^{(t)},\dots,\boldsymbol{x}_n^{(t)}\big).
$$

令 $\bar{\boldsymbol{\mu}}=\frac1T\sum_{t=1}^{T}\bigotimes_{i=1}^{n}\boldsymbol{x}_i^{(t)}$，上式两边除以 $T$ 即得

$$
\frac{1}{T}\Phi\mathrm{Reg}_i^{(T)} = \max_{\phi_i\in\Phi_i}\; \mathbb{E}_{(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)\sim\bar{\boldsymbol{\mu}}}\, u_i\big(\phi_i(\boldsymbol{x}_i),\,\boldsymbol{x}_{-i}\big) - \mathbb{E}_{(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n)\sim\bar{\boldsymbol{\mu}}}\, u_i(\boldsymbol{x}_1,\dots,\boldsymbol{x}_n),
$$

这正是 Φ-均衡的定义式，且 $\epsilon$ 取各玩家 $\frac1T\Phi\mathrm{Reg}_i^{(T)}$ 的最大值即可对所有玩家同时成立。$\square$

## 3 最小化 Φ-后悔的框架：从 Φ-后悔归约到外部后悔

下面介绍 Gordon 等人（2008）的优雅框架：把 Φ-后悔最小化**归约**为外部后悔最小化。设 $\Phi$ 为凸紧集，框架要求两个基本子程序：

1. **不动点预言机（fixed-point oracle）**：对任意偏移 $\phi\in\Phi$，输出不动点 $\mathcal{X}\ni\boldsymbol{x}=\phi(\boldsymbol{x})$。
2. **外部后悔最小化算法 $\mathfrak{R}_\Phi$**：在偏移集 $\Phi$ 上最小化外部后悔。

关于第 1 条：先假设 $\Phi$ 由连续函数组成，从而由 Brouwer 不动点定理保证不动点存在。但“存在”不等于“能高效计算”——已知计算一般函数的近似不动点等价于求纳什均衡，那就本末倒置了。因此需要 $\Phi$ 有足够结构，例如 $\Phi$ 只含线性偏移时不动点容易计算：对 $\phi(\boldsymbol{x})=M\boldsymbol{x}$，不动点方程 $(M-I)\boldsymbol{x}=\boldsymbol{0}$ 归结为在约束 $\boldsymbol{x}\in\mathcal{X}$ 下求 $M-I$ 零空间中的点，多项式时间可解。另外，用近似不动点（$\|\boldsymbol{x}-\phi(\boldsymbol{x})\|\le\epsilon$）也足够：Gordon 等人取第 $t$ 轮的精度 $\epsilon_t=1/\sqrt{t}$，若效用的（次）梯度一致有界，则由 Hölder 不等式，以近似不动点代替精确不动点每轮至多额外引入 $O(\epsilon_t)$ 的误差，累计 $O\big(\sum_{t}\epsilon_t\big)=O(\sqrt{T})$，恰好被后悔界吸收。关于第 2 条：外部后悔算法作用的集合从 $\mathcal{X}$ 换成了偏移集 $\Phi$，后者显著更复杂——这正是高效 Φ-后悔算法的关键难点所在。

**Gordon 等人的算法**（输入：偏移集 $\Phi$ 上的外部后悔最小化器 $\mathfrak{R}_\Phi$）：

```text
NextStrategy():
    φ^(t) := R_Φ.NextStrategy()
    return x^(t) ∈ X 满足 x^(t) = φ^(t)(x^(t))   // 通过不动点预言机

ObserveUtility(u^(t)):
    设置效用函数 u_Φ^(t) : φ ↦ ⟨φ(x^(t)), u^(t)⟩
    R_Φ.ObserveUtility(u_Φ^(t))
```

即：每轮先取 $\mathfrak{R}_\Phi$ 给出的下一个偏移 $\phi^{(t)}$，输出其任一不动点 $\boldsymbol{x}^{(t)}$ 作为自己的策略；观测到 $\boldsymbol{u}^{(t)}$ 后，把“偏移层面的效用” $u_\Phi^{(t)}:\phi\mapsto\langle\phi(\boldsymbol{x}^{(t)}),\boldsymbol{u}^{(t)}\rangle$ 反馈给 $\mathfrak{R}_\Phi$。

> **定理 2.1（Gordon et al., 2008）.** 若 $\mathrm{Reg}^{(T)}$ 是 $\mathfrak{R}_\Phi$ 的外部后悔，$\Phi\mathrm{Reg}^{(T)}$ 是上述算法的 Φ-后悔，则 $\mathrm{Reg}^{(T)}=\Phi\mathrm{Reg}^{(T)}$。

**证明.** 因为 $\boldsymbol{x}^{(t)}=\phi^{(t)}(\boldsymbol{x}^{(t)})$（不动点），

$$
\Phi\mathrm{Reg}^{(T)} = \max_{\phi\in\Phi}\left\{\sum_{t=1}^{T}\big\langle\phi(\boldsymbol{x}^{(t)}),\boldsymbol{u}^{(t)}\big\rangle\right\} - \sum_{t=1}^{T}\big\langle\boldsymbol{x}^{(t)},\boldsymbol{u}^{(t)}\big\rangle
= \max_{\phi\in\Phi}\left\{\sum_{t=1}^{T}\big\langle\phi(\boldsymbol{x}^{(t)}),\boldsymbol{u}^{(t)}\big\rangle\right\} - \sum_{t=1}^{T}\big\langle\phi^{(t)}(\boldsymbol{x}^{(t)}),\boldsymbol{u}^{(t)}\big\rangle.
$$

按 $u_\Phi^{(t)}$ 的定义，右端即

$$
\Phi\mathrm{Reg}^{(T)} = \max_{\phi\in\Phi}\left\{\sum_{t=1}^{T} u_\Phi^{(t)}(\phi)\right\} - \sum_{t=1}^{T} u_\Phi^{(t)}\big(\phi^{(t)}\big) = \mathrm{Reg}^{(T)}. \qquad \square
$$

### Blum–Mansour 算法：标准式博弈中的交换后悔

现在把上述框架用于最小化标准式博弈的交换后悔，得到 Blum–Mansour 算法（Stoltz–Lugosi 有密切相关的算法）。关键是弄清偏移集 $\Phi$ 的结构：标准式博弈中只需考虑把 $\Delta(\mathcal{A})$ 映到自身的线性函数，它有简单的组合刻画。

> **引理 2.2.** 任意线性函数 $\phi:\Delta(\mathcal{A})\to\Delta(\mathcal{A})$ 都可等价写成 $\boldsymbol{x}\mapsto M\boldsymbol{x}$，其中 $M$ 是（列）随机矩阵（stochastic matrix）。

证明：$\phi$ 线性，故可写成 $\boldsymbol{x}\mapsto M\boldsymbol{x}$；$M$ 的每一列等于 $\phi$ 在“全部概率集中在对应动作”的分布上的输出，而 $\phi$ 的值域在 $\Delta(\mathcal{A})$ 内，故每列都是概率分布。

据此实现框架要求的两个预言机。**第 1 条（不动点）**：随机矩阵诱导 $\mathcal{A}$ 上的一个马尔可夫链（Markov chain，如下图所示），其任一平稳分布（stationary distribution）都是不动点，而解平稳分布只是解线性方程组，可高效计算。（更一般地，当 $\mathcal{X}$ 是多面体且 $\Phi$ 由线性偏移组成时，求不动点归结为线性规划，多项式时间可解。）

![随机矩阵诱导的马尔可夫链：状态为动作，转移概率为矩阵元](assets/ch06-phi-regret-3-20.png)

**第 2 条（在随机矩阵集合上做外部后悔）**：随机矩阵集合按定义是单纯形的笛卡尔积——每列一个概率分布：

$$
\big\{[(\boldsymbol{x}_a)_{a\in\mathcal{A}}]:\ \boldsymbol{x}_a\in\Delta(\mathcal{A})\ \ \forall a\in\mathcal{A}\big\},
$$

其中 $[\,(\boldsymbol{x},\boldsymbol{x}')\,]$ 表示以 $\boldsymbol{x},\boldsymbol{x}'$ 为列的矩阵。上一讲的**后悔电路（regret circuit）**正好处理笛卡尔积：对每一列各设一个独立的后悔最小化器即可。

> **引理 2.3.** 存在高效的无悔算法在随机矩阵集合上最小化外部后悔。

**Blum–Mansour 算法**（输入：每个动作 $a\in\mathcal{A}$ 一个后悔最小化器 $\mathfrak{R}_a$，各自作用于 $\Delta(\mathcal{A})$）：

```text
NextStrategy():
    for each a ∈ A:
        x_a^(t) := R_a.NextStrategy()
    M^(t) := [(x_a^(t))_{a∈A}]          // 第 a 列取第 a 个最小化器的策略
    return x^(t) ∈ Δ(A) 满足 x^(t) = M^(t) x^(t)   // M^(t) 的任一不动点（平稳分布）

ObserveUtility(u^(t) ∈ R^A):
    for each a ∈ A:
        u_a^(t) := x^(t)[a] · u^(t)
        R_a.ObserveUtility(u_a^(t))
```

解释第二部分：按定理 2.1 的构造，$\mathfrak{R}_\Phi$ 观测到的效用可改写为

$$
u_\Phi^{(t)}(\phi)=\big\langle\phi(\boldsymbol{x}^{(t)}),\,\boldsymbol{u}^{(t)}\big\rangle=\big\langle M\boldsymbol{x}^{(t)},\,\boldsymbol{u}^{(t)}\big\rangle=\big\langle M,\ \boldsymbol{u}^{(t)}\otimes\boldsymbol{x}^{(t)}\big\rangle,
$$

即 $\mathfrak{R}_\Phi$ 观测的是效用矩阵 $\boldsymbol{u}^{(t)}\otimes\boldsymbol{x}^{(t)}$；按笛卡尔积后悔电路，应把对应分量 $\boldsymbol{x}^{(t)}[a]\,\boldsymbol{u}^{(t)}$ 转发给 $\mathfrak{R}_a$。将每个 $\mathfrak{R}_a$ 实例化为 MWU 并应用定理 2.1，得到：

> **定理 2.4.** 存在在线算法，其交换后悔以 $O\big(\sqrt{T\,|\mathcal{A}|\log|\mathcal{A}|}\big)$ 为界。

朴素论证只给出 $O\big(|\mathcal{A}|\sqrt{T\log|\mathcal{A}|}\big)$——每个 MWU 的外部后悔为 $O(\sqrt{T\log|\mathcal{A}|})$，共 $|\mathcal{A}|$ 个。改进界利用了观测效用的结构：对任意 $t\in[T]$，

$$
\sum_{a\in\mathcal{A}}\big\|\boldsymbol{u}_a^{(t)}\big\|_\infty^2 = \big\|\boldsymbol{u}^{(t)}\big\|_\infty^2\sum_{a\in\mathcal{A}}\big(\boldsymbol{x}^{(t)}[a]\big)^2 \;\le\; \big\|\boldsymbol{u}^{(t)}\big\|_\infty^2.
$$

于是由 MWU 的后悔界与定理 2.1，

$$
\Phi\mathrm{Reg}^{(T)} \;\le\; \frac{|\mathcal{A}|\log|\mathcal{A}|}{\eta} + \eta\sum_{t=1}^{T}\big\|\boldsymbol{u}^{(t)}\big\|_\infty^2 \;\le\; \frac{|\mathcal{A}|\log|\mathcal{A}|}{\eta} + \eta T.
$$

对学习率 $\eta$ 取最优即得定理结论。结合定理 1.8，所有玩家各自运行 Blum–Mansour 算法时，平均相关博弈分布收敛到相关均衡。

值得一提的是，Blum 与 Mansour 的原始表述并未经过 Gordon 等人的框架，而是一个直接的黑盒归约：$|\mathcal{A}|$ 个外部后悔算法各自输出分布 $\boldsymbol{q}_a^{(t)}$，组成矩阵 $Q^{(t)}$，主算法取其平稳分布 $\boldsymbol{p}^{(t)}=\boldsymbol{p}^{(t)}Q^{(t)}$ 作为自己的策略——等价于“以概率 $\boldsymbol{p}^{(t)}[a]$ 选中子算法 $\mathfrak{R}_a$ 再按之行动”；观测到效用后把 $\boldsymbol{p}^{(t)}[a]\,\boldsymbol{u}^{(t)}$ 分发给 $\mathfrak{R}_a$。归约成立的关键恒等式是：各子算法感知到的损失之和恰等于主算法的真实损失，

$$
\sum_{a\in\mathcal{A}} \boldsymbol{p}^{(t)}[a]\,\big\langle\boldsymbol{q}_a^{(t)},\,\boldsymbol{u}^{(t)}\big\rangle \;=\; \boldsymbol{p}^{(t)}Q^{(t)}\boldsymbol{u}^{(t)} \;=\; \boldsymbol{p}^{(t)}\boldsymbol{u}^{(t)},
$$

于是交换后悔被 $|\mathcal{A}|$ 个外部后悔之和控制。原文用另一条估计路线得到同一界 $O\big(\sqrt{T|\mathcal{A}|\log|\mathcal{A}|}\big)$：设 $L_a^{\min}$ 为转发给 $\mathfrak{R}_a$ 的（缩放后）效用序列中最优动作的累计损失，则 $\sum_a L_a^{\min}\le T$，由平方根的凹性 $\sum_a\sqrt{L_a^{\min}}\le\sqrt{|\mathcal{A}|\,T}$，代入专家算法 $O\big(\sqrt{L_a^{\min}\log|\mathcal{A}|}\big)$ 型的后悔界即得。

这个界在动作数上的依赖还能改进吗？Blum–Mansour 给出了部分否定答案：当交换后悔相对于**实际采样的动作**（而非分布 $\boldsymbol{p}^{(t)}$ 本身）定义、且对手是**自适应的**（adaptive adversary，其选择可依赖学习者以往的动作）时，任何随机化算法的期望交换后悔都存在 $\Omega\big(\sqrt{T|\mathcal{A}|}\big)$ 的下界——换言之，达到平均每轮 $\epsilon$ 的交换后悔需要 $\Omega(|\mathcal{A}|/\epsilon)$ 轮，对动作数的线性依赖在该模型下不可避免。（在后悔相对于分布定义的设定下，能否达到对 $|\mathcal{A}|$ 仅对数级依赖，仍是公开问题。）此外，Blum–Mansour 还把归约推广到部分信息（bandit）模型——学习者每轮只观测到所选动作的效用，此时对基算法需要额外的平滑性假设（Auer 等人的 MAB 算法满足），所得交换后悔界为 $O\big(|\mathcal{A}|\sqrt{T\,|\mathcal{A}|\log|\mathcal{A}|}\big)$；Stoltz（2005）随后将其改进到 $O\big(\sqrt{T\,|\mathcal{A}|\log|\mathcal{A}|}\big)$。

## 要点小结

- **CCE**：相关分布 $\boldsymbol{\mu}$ 下没有玩家能通过常值偏移获益；**CE**：偏移函数可以依赖所推荐的动作（交换偏移）。包含关系 Nash $\subseteq$ CE $\subseteq$ CCE，两者都可用调解人/相关装置解释；CCE 要求看到建议前承诺，缺乏约束力机制时较难辩护。
- 斗鸡博弈中，$\tfrac12(\text{Go},\text{Stop})+\tfrac12(\text{Stop},\text{Go})$ 是 CE，公平且避免撞车，可解释为红绿灯；$4\times4$ 例子表明 CCE 可以有很大的 CE 间隙。
- **计算**：(C)CE 集合是凸的，可用 LP 描述（$\prod_i|\mathcal{A}_i|$ 个变量、$\sum_i|\mathcal{A}_i|(|\mathcal{A}_i|-1)$ 个约束——只需内部偏移），但随玩家数指数增长，仅适合常数玩家；可叠加社会福利等线性目标。
- **Φ-后悔**以偏移族 $\Phi$ 参数化事后理性：常值偏移 $\to$ 外部后悔（对应 CCE），全部偏移 $\to$ 交换后悔（对应 CE）。两者之间还有内部后悔（交换后悔 $\le|\mathcal{A}|\times$ 内部后悔，次线性意义下等价），以及凸博弈中的谱系 $\Phi_{\mathrm{EXT}}\subset\Phi_{\mathrm{EF}}\subset\Phi_{\mathrm{LIN}}\subset\Phi_{\mathrm{FE}}\subset\Phi_{\mathrm{SWAP}}$（扩展式后悔对应扩展式相关均衡）。外部后悔为零时交换后悔可达 $\Omega(T)$（如 MWU）。
- **定理 1.8**：若每位玩家的 $\Phi_i$-后悔为 $\Phi\mathrm{Reg}_i^{(T)}$，则平均相关博弈分布 $\bar{\boldsymbol{\mu}}=\frac1T\sum_t\bigotimes_i\boldsymbol{x}_i^{(t)}$ 是 $\epsilon$-Φ-均衡，$\epsilon=\frac1T\max_i\Phi\mathrm{Reg}_i^{(T)}$。
- **Gordon 等人的框架**：以“不动点预言机 + 偏移集 $\Phi$ 上的外部后悔最小化器”为子程序，输出 $\phi^{(t)}$ 的不动点为策略、反馈 $u_\Phi^{(t)}:\phi\mapsto\langle\phi(\boldsymbol{x}^{(t)}),\boldsymbol{u}^{(t)}\rangle$，则 Φ-后悔恰等于 $\mathfrak{R}_\Phi$ 的外部后悔（定理 2.1）。
- **Blum–Mansour 算法**：线性偏移 $\leftrightarrow$ 列随机矩阵（引理 2.2）；不动点 $=$ 马尔可夫链平稳分布（原文取 $N$ 个子算法的合成矩阵 $Q^{(t)}$ 的平稳分布，关键恒等式：子算法感知损失之和 $=$ 主算法真实损失）；随机矩阵集合是单纯形的笛卡尔积，用后悔电路为每列配一个 MWU；交换后悔界 $O\big(\sqrt{T|\mathcal{A}|\log|\mathcal{A}|}\big)$（定理 2.4），从而收敛到相关均衡。自适应对手下的下界 $\Omega\big(\sqrt{T|\mathcal{A}|}\big)$；bandit 模型中归约仍成立（Stoltz 改进到同一 $O\big(\sqrt{T|\mathcal{A}|\log|\mathcal{A}|}\big)$ 界）。
