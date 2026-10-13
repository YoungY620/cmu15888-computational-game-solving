# Homework 1: LP Equilibrium Computation

- Course: 15-888 Computational Game Solving (Fall 2025)
- Released: September 28, 2025; Due: October 10, 2025
- Total: 100 points (Problem 1: 20 + Problem 2: 30 + Problem 3: 50)

**Submission instructions.** Submit your homework on Gradescope. Submit a single `pdf` file containing **both** your written solutions **and** your code (`stub.py`) attached to the end (for example, using a `verbatim` environment). You can (but are not required to) typeset your written solutions in the `.tex` file provided in the homework `.zip`.

## Problems

### Problem 1: A Regret-Based Proof of the Minimax Theorem (20 points)

Let $\mathcal{X} \subseteq \mathbb{R}^{m_1}$ and $\mathcal{Y} \subseteq \mathbb{R}^{m_2}$ be convex and compact sets, and $\mathbf{A} \in \mathbb{R}^{m_1 \times m_2}$. The minimax theorem asserts that

$$
\min_{\vec{x}\in\mathcal{X}} \max_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle = \max_{\vec{y}\in\mathcal{Y}} \min_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle.
$$

In this problem, you will show that the mere existence of (external) regret minimization algorithms is powerful enough to imply the minimax theorem.

One direction of the proof (called **weak duality**) is easy and very general.

**Problem 1.1 (5 points).** Show that

$$
\min_{\vec{x}\in\mathcal{X}} \max_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \geq \max_{\vec{y}\in\mathcal{Y}} \min_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle. \tag{1}
$$

To show the reverse inequality, we will employ regret minimization to solve the bilinear saddle point problem $\max_{\vec{y}\in\mathcal{Y}} \min_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle$. At each time $t$, we let a regret minimizer $\mathfrak{R}_\mathcal{Y}$ pick strategies $\vec{y}^{(t)} \in\mathcal{Y}$, while the environment always chooses $\vec{x}^{(t)} \in\mathcal{X}$ to best respond to $\vec{y}^{(t)}$, that is,

$$
\vec{x}^{(t)} \in \arg\min_{\vec{x} \in \mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y}^{(t)} \rangle .
$$

The utility function observed by $\mathfrak{R}_\mathcal{Y}$ at each time $t$ is set to

$$
u^t_\mathcal{Y} : \vec{y} \mapsto \langle \vec{x}^{(t)}, \mathbf{A} \vec{y} \rangle = \langle \vec{y}, \mathbf{A}^\top \vec{x}^{(t)} \rangle .
$$

We will assume that $\mathfrak{R}_\mathcal{Y}$ guarantees **sublinear regret** under any sequence of utilities; we have seen many algorithms with this property, such as FTRL and RM.

Let $\bar{\vec{x}}^{(T)} \in \mathcal{X}$ and $\bar{\vec{y}}^{(T)} \in \mathcal{Y}$ be the average strategies output up to time $T$, that is,

$$
\bar{\vec{x}}^{(T)} \coloneqq \frac{1}{T}\sum_{t=1}^T \vec{x}^{(t)} \qquad \bar{\vec{y}}^{(T)} \coloneqq \frac{1}{T}\sum_{t=1}^T \vec{y}^{(t)}.
$$

**Problem 1.2 (5 points).** Argue that at all $T$,

$$
\max_{\vec{y} \in \mathcal{Y}} \min_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \ge \frac{1}{T} \min_{\vec{x}\in\mathcal{X}} \sum_{t=1}^T \langle \vec{x}, \mathbf{A} \vec{y}^{(t)} \rangle  \ge \frac{1}{T}\sum_{t=1}^T \langle \vec{x}^{(t)}, \mathbf{A} \vec{y}^{(t)} \rangle . \tag{2}
$$

> Hint: use the definition of $\bar{\vec{y}}^{(T)}$. Then, use the information you have on $\vec{x}^{(t)}$.

**Problem 1.3 (5 points).** Let $R_\mathcal{Y}^{(T)}$ be the regret accumulated by $\mathfrak{R}_\mathcal{Y}$ up to time $T$. Using (2), argue that at all times $T$

$$
\max_{\vec{y}\in\mathcal{Y}}\min_{\vec{x}\in\mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle \ge \min_{\vec{x}\in\mathcal{X}} \max_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle - \frac{R^{(T)}_\mathcal{Y}}{T}. \tag{3}
$$

> Hint: use the definition of regret $R_\mathcal{Y}^{(T)}$.

**Problem 1.4 (5 points).** Use (3) and (1) to conclude that

$$
\max_{\vec{y} \in \mathcal{Y}}\min_{\vec{x} \in \mathcal{X}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle = \min_{\vec{x}\in\mathcal{X}}\max_{\vec{y}\in\mathcal{Y}} \langle \vec{x}, \mathbf{A} \vec{y} \rangle.
$$

### Problem 2: Deriving CFR from Regret Circuits (30 points)

In this problem, you will derive CFR using regret circuits. For your convenience, we include the pseudocode from Lecture 5 for the subroutine that computes the counterfactual utilities (Algorithm 1). The goal of this problem is to show that applying regret circuits in a bottom-up fashion in a tree-form decision problem produces CFR.

Recall that the sequence-form strategy set can be decomposed as follows. First, in any observation point $k \in \mathcal{K}$ with a set of children $\{p_1, \dots, p_\nu \} = \{ \rho(k, s) : s \in \mathcal{S}_k \}$,

$$
\mathcal{X}_{k} = \mathcal{X}_{p_1} \times \mathcal{X}_{p_2} \times \dots \times \mathcal{X}_{p_\nu}, \tag{4}
$$

where $\mathcal{X}_{p_i}$ is the sequence-form polytope corresponding to the subtree rooted at point $p_i$. Second, in any decision point $j \in \mathcal{J}$ with a set of children $\{ p_1, \dots, p_\nu \} = \{ \rho(j, a) : a \in \mathcal{A}_j \}$,

$$
\mathcal{X}_{j} \coloneqq \mathrm{co} \left\{
\begin{pmatrix}
\vec{e}_1 \\
\mathcal{X}_{p_1} \\
\vec{0} \\
\vdots \\
\vec{0}
\end{pmatrix},
\begin{pmatrix}
\vec{e}_2 \\
\vec{0} \\
\mathcal{X}_{p_2} \\
\vdots \\
\vec{0}
\end{pmatrix},
 \dots,
 \begin{pmatrix}
\vec{e}_\nu \\
\vec{0} \\
\vec{0} \\
\vdots \\
\mathcal{X}_{p_\nu}
\end{pmatrix}
\right\}, \tag{5}
$$

where $\vec{e}_i \in \mathbb{R}^{\mathcal{A}_j}$ is the $i$th unit vector and $\mathrm{co}$ denotes the convex hull.

**Algorithm 1: Counterfactual regret minimization (CFR).**

- **Input:** A regret minimizer $\mathfrak{R}_j$ for each decision point $j \in \mathcal{J}$ of the tree-form decision process.
- $\textsc{ObserveUtility}(\vec{u}^{(t)} \in \mathbb{R}^{\Sigma})$:
  1. $V^{(t)}[\bot] \coloneqq 0$;
  2. for each node in the tree $p \in \mathcal{J} \cup \mathcal{K}$ in bottom-up order:
     - if $p \in \mathcal{J}$: let $j = p$ and set $V^{(t)}[j] \coloneqq \sum_{a \in \mathcal{A}_j} b_j^{(t)}[a] \cdot (\vec{u}^{(t)}[(j, a)] + V^{(t)}[\rho(j, a)])$;
     - else: let $k = p$ and set $V^{(t)}[k] \coloneqq \sum_{s \in \mathcal{S}_k} V^{(t)}[\rho(k, s)]$;
  3. for each decision point $j \in \mathcal{J}$:
     - for each action $a \in \mathcal{A}_j$: $\vec{u}_j^{(t)}[a] \coloneqq \vec{u}^{(t)}[(j, a)] + V^{(t)}[\rho(j, a)]$;
     - call $\mathfrak{R}_j.\textsc{ObserveUtility}(\vec{u}_j^{(t)})$.

You will prove soundness of CFR by induction, proceeding in a bottom-up fashion.

**Problem 2.1 (5 points).** Argue that the utility at every **terminal** decision point $j \in \mathcal{J}$ is given by $\vec{u}^{(t)}_j[a] = \vec{u}^{(t)}[(j, a)]$ for all $a \in \mathcal{A}_j$.

> Hint: this is the basis of the induction. Use the fact that the strategy set at each terminal decision point is a probability simplex. Observe that this matches the utilities of CFR at the terminal decision nodes.

**Problem 2.2 (5 points).** Apply the regret circuit for the Cartesian product in each observation node $p \in \mathcal{K}$. Derive the utility vectors given as input to the children of $p$.

> Hint: use the decomposition given in (4).

**Problem 2.3 (10 points).** Apply the regret circuit for the convex hull in each decision node $p \in \mathcal{J}$. Derive the utility vector given as input to the regret minimizer $\mathfrak{R}_j$ that is responsible for mixing over $\mathcal{A}_j$, and show that it matches the utilities specified in Algorithm 1.

> Hint: use the decomposition given in (5).

**Problem 2.4 (10 points).** Show that the regret of CFR is bounded by $\sum_{j \in \mathcal{J}} \max\{0, R_j^{(T)} \}$, where $R_j^{(T)}$ is the regret of $\mathfrak{R}_j$. What is the regret of CFR when each $\mathfrak{R}_j$ is instantiated using MWU? What is the regret of CFR when each $\mathfrak{R}_j$ is instantiated using RM?

> Hint: recall that the regret bound depends on the norm of the utility; argue about how large that norm can be.

### Problem 3: Linear Programming for Solving Extensive-Form Zero-Sum Games, and Application to Low Randomization in Poker (50 points)

In many games, the optimal Nash equilibrium requires that all players randomize their moves. As an example, consider rock-paper-scissors: any deterministic strategy (for example, always playing rock) is heavily suboptimal. In this problem, you will quantify how much value is lost by insisting on playing deterministic strategies in three games: rock-paper-superscissors and two well-known poker variants (Kuhn poker and Leduc poker). A description of each game is given in the zip of this homework, in the format described in the "Programming Assignment" section below. The zip also contains a stub Python file to help you set up your implementation.

#### 3.1 Computing the Value of the Game (15 points)

As a warm-up, you will implement the linear program formulation of Nash equilibrium strategies seen in Lecture 5 using the solver Gurobi (<https://www.gurobi.com/>). Gurobi is a powerful commercial solver for linear and non-linear optimization problems. You can download the solver and request a free license for academic use from their website; installation instructions for the Python bindings `gurobipy` are available in the Gurobi documentation.

**Linear programming formulation of Nash equilibrium strategies.** For your convenience, here are again the linear programs, for Player 1 and Player 2 respectively, that you need to implement:

$$
\mathcal{P}_1 : \begin{cases}
\max\ \vec{f}_2^\top \vec{v} \\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}_2^\top \vec{v} \ge \vec{0} \\
②\ \ \mathbf{F}_1\vec{x} = \vec{f}_1 \\
③\ \ \vec{x} \ge \vec{0},\ \vec{v}\ \text{free},
\end{cases}
\qquad
\mathcal{P}_2 : \begin{cases}
\max\ \vec{f}_1^\top \vec{v} \\[1mm]
\ \text{s.t.}\quad
①\ \ {-}\mathbf{A} \vec{y} - \mathbf{F}_1^\top \vec{v} \ge \vec{0} \\
②\ \ \mathbf{F}_2\vec{y} = \vec{f}_2 \\
③\ \ \vec{y} \ge \vec{0},\ \vec{v}\ \text{free},
\end{cases} \tag{6}
$$

where $\{\vec{x}\in\mathbb{R}^{|\Sigma_1|}: \mathbf{F}_1 \vec{x} = \vec{f}_1,\ \vec{x}\ge\vec{0}\}$ and $\{\vec{y}\in\mathbb{R}^{|\Sigma_2|}: \mathbf{F}_2 \vec{y} = \vec{f}_2,\ \vec{y}\ge\vec{0}\}$ are the sequence-form polytopes of the two players, and $\mathbf{A}$ is the payoff matrix for Player 1. Conveniently, the objective values of $\mathcal{P}_1$ and $\mathcal{P}_2$ will be the exact expected utility that each player can secure by playing against a perfectly rational opponent. Since all games are zero sum, the objective values of $\mathcal{P}_1$ and $\mathcal{P}_2$ will sum to $0$ (if they do not, you must have a bug somewhere).

**Problem 3.1.1 (15 points).** Implement the linear program for computing Nash equilibrium strategies for both Player 1 and Player 2.

For each of the three games (rock-paper-superscissors, Kuhn poker, and Leduc poker), and for each of the two players, report Gurobi's output.

> Hints:
>
> - Make sure to take a look at the "Gurobi tips and tricks" at the end of this document (see the "Programming Assignment" section). It includes some tips as to how to debug common issues.
> - Start from rock-paper-superscissors, and only then move to the more complex games.
> - Since all games are zero-sum, the objective values of $\mathcal{P}_1$ and $\mathcal{P}_2$ must sum to $0$.
> - The objective value for $\mathcal{P}_1$ should be $0$ for rock-paper-superscissors, $-0.0555$ for Kuhn poker, and $-0.0856$ for Leduc poker.

Your solution should include six Gurobi outputs (3 games, 2 players per game). Feel free to use a `verbatim`-style dump of the output, but make sure to specify what game and what player each Gurobi output refers to. Do not forget to include your code at the end of your homework. For example, your output in the case of rock-paper-superscissors for Player 1 should look roughly like this:

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

#### 3.2 Computing Optimal Deterministic Strategies (15 points)

In this subsection we study how much worse each player is if they (but not the opponent) are restricted to playing deterministic strategies only. To model this, we will add a constraint saying that all entries of the sequence-form strategy vectors $\vec{x}$ and $\vec{y}$ in (6) can only take values in $\{0, 1\}$. The resulting **integer** programs, which we call $\tilde{\mathcal{P}}_1$ and $\tilde{\mathcal{P}}_2$, are given next.

$$
\tilde{\mathcal{P}}_1 : \begin{cases}
\max\ \vec{f}_2^\top \vec{v} \\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}_2^\top \vec{v} \ge \vec{0} \\
②\ \ \mathbf{F}_1\vec{x} = \vec{f}_1 \\
③\ \ \vec{x} \in \{0,1\}^{|\Sigma_1|},\ \vec{v}\ \text{free},
\end{cases}
\qquad
\tilde{\mathcal{P}}_2 : \begin{cases}
\max\ \vec{f}_1^\top \vec{v} \\[1mm]
\ \text{s.t.}\quad
①\ \ {-}\mathbf{A} \vec{y} - \mathbf{F}_1^\top \vec{v} \ge \vec{0} \\
②\ \ \mathbf{F}_2\vec{y} = \vec{f}_2 \\
③\ \ \vec{y} \in \{0,1\}^{|\Sigma_2|},\ \vec{v}\ \text{free}.
\end{cases} \tag{7}
$$

**Problem 3.2.1 (15 points).** Implement the integer programs given in (7) for computing optimal deterministic strategies for both Player 1 and Player 2.

For each of the three games (rock-paper-superscissors, Kuhn poker, and Leduc poker), and for each of the two players, report Gurobi's output.

> Hints:
>
> - Make sure to take a look at the "Gurobi tips and tricks".
> - Start from rock-paper-superscissors, and only then move to the more complex games.
> - Here there are **no guarantees** that the value of $\tilde{\mathcal{P}}_1$ and the value of $\tilde{\mathcal{P}}_2$ sum to $0$ anymore! In fact, that will be false in all games.

Your solution should include six Gurobi outputs (3 games, 2 players per game), each labeled with the game and the player it refers to, and your code at the end. For example, your output in the case of Kuhn poker for Player 1 should look roughly like this:

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

#### 3.3 Controlling the Amount of Determinism (20 points)

In Problem 3.1.1 no determinism constraint was present. At the other extreme, in Problem 3.2.1 we insisted that at all decision points a deterministic strategy be followed. In this last subsection we will explore intermediate cases: for each value of $k$, we will study how much value each player can secure if they are constrained to play deterministically in at least $k$ decision points. When $k=0$, we will recover the objective values seen in Problem 3.1.1. When $k$ is equal to the number of decision points of the player in the game, we will recover the objective values seen in Problem 3.2.1.

**Integer programming model.** The solution to the integer linear program $\mathcal{P}_1(k)$ given in (8) is an optimal strategy for Player 1 subject to the constraint that at least $k$ decision points must prescribe a deterministic strategy. Understanding the details is not important for this problem, though we included a description of the meaning of each constraint just in case you are curious.

$$
\mathcal{P}_1(k) : \begin{cases}
\max\ \vec{f}_2^\top \vec{v} \\[1mm]
\ \text{s.t.}\quad
①\ \ \mathbf{A}^\top \vec{x} - \mathbf{F}_2^\top \vec{v} \ge \vec{0} \\[1mm]
②\ \ \mathbf{F}_1\vec{x} = \vec{f}_1 \\[1mm]
③\ \ \vec{x}[(j,a)] \ge \vec{z}[(j,a)] \qquad\qquad\ \forall j\in\mathcal{J}_1: p_j = \varnothing,\ a\in \mathcal{A}_j\\[1mm]
④\ \ \vec{x}[(j,a)] \ge \vec{x}[p_j] + \vec{z}[(j,a)] - 1 \qquad \forall j\in\mathcal{J}_1: p_j \neq \varnothing,\ a\in \mathcal{A}_j\\[1mm]
⑤\ \ \sum_{a\in \mathcal{A}_j} \vec{z}[(j,a)] \le 1 \qquad\qquad\quad\ \forall\,j\in\mathcal{J}_1\\[1mm]
⑥\ \ \sum_{j\in \mathcal{J}_1} \sum_{a\in \mathcal{A}_j} \vec{z}[(j,a)]\ge k\\[1mm]
⑦\ \ \vec{x} \ge \vec{0},\ \vec{z}\in\{0,1\}^{|\Sigma_1|},\ \vec{v}\ \text{free},
\end{cases} \tag{8}
$$

- $\vec{z} \in \{0,1\}^{|\Sigma_1|}$ is a binary vector that decides, for each strategy $(j,a) \in \Sigma_1$ of Player 1, whether to pick action $a$ at $j$ with probability $1$. Since the strategy vector $\vec{x}$ is expressed in sequence form, picking action $a$ with probability $1$ at $j$ is expressed through constraints ③ and ④.
- Constraint ⑤ asserts that no more than one action at each decision point can be forced to be played with probability $1$.
- Constraint ⑥ asserts that in at least $k$ decision points, exactly one of the actions will be forced to be played with probability $1$.

The integer program $\mathcal{P}_2(k)$ for Player 2 is analogous.

**Problem 3.3.1 (15 points).** Implement the integer linear programs $\mathcal{P}_1(k)$ and $\mathcal{P}_2(k)$, described above, for computing optimal strategies with a given lower bound on the amount of determinism.

For each of the three games (rock-paper-superscissors, Kuhn poker, and Leduc poker), and for each of the two players $i$, plot the objective value of $\mathcal{P}_i(k)$ as a function of $k \in \{0, \dots, |\mathcal{J}_i|\}$ (number of decision points of Player $i$).

> Hints:
>
> - Make sure to take a look at the "Gurobi tips and tricks".
> - Gurobi can be pretty verbose by default. For this problem, if you would like to silence Gurobi you can use `m.setParam("OutputFlag", 0)`.
> - For Leduc poker, if Gurobi is taking too long to optimize when $k$ is large, you can lower the solution precision by calling `m.setParam("MIPGap", 0.01)` before `m.optimize()`. Expect a runtime of up to one to five hours for Leduc poker, depending on how powerful your machine is.

Your solution should include six plots (3 games, 2 players per game). Make sure to specify what game and what player each plot refers to. Do not forget to include your code at the end of your homework.

**Problem 3.3.2 (5 points).** Comment on the results you obtained in this problem: do highly-deterministic strategies for the three small games exist? Are the results what you expected? If yes, what did the results confirm? If not, how do you think you can reconcile your previous intuition with the experimental findings?

## Programming Assignment

The programming part corresponds to Problem 3 (50 points). The materials live in `lp_files/`: the three game files `rock_paper_superscissors.json`, `kuhn_poker.json`, `leduc_poker.json`, and the stub file `stub.py`.

### Game File Format

Each game is encoded as a JSON file. The root object has three keys:

| Key | Meaning |
|---|---|
| `decision_problem_pl1` | Description of the tree-form sequential decision process (TFSDP) faced by Player 1 |
| `decision_problem_pl2` | Description of the TFSDP faced by Player 2 |
| `utility_pl1` | Description of the bilinear utility function for Player 1 as a function of the sequence-form strategies of each player; since the games are zero-sum, the utility for Player 2 is the opposite of the utility of Player 1 |

The tree of decision points and observation points of each decision problem is stored as a **list of nodes**. Each node has the following fields:

| Field | Meaning |
|---|---|
| `id` | A string identifier of the node; unique among the nodes of the same player |
| `type` | A string, either `decision` (decision point) or `observation` (observation point) |
| `actions` | (decision points only) A set of strings: the actions available at the decision node |
| `signals` | (observation points only) A set of strings: the signals that can be observed at the observation node |
| `parent_edge` | The parent edge of the node. `null` if the node is the root of the tree; otherwise a pair `(parent_node_id, action_or_signal)`, where the first member is the `id` of the parent node and `action_or_signal` is the action or signal connecting the node to its parent |
| `parent_sequence` | (decision points only) The parent sequence $p_j$ of the decision point: the last sequence (that is, decision point–action pair) encountered on the path from the root of the decision process to $j$ |

> Note: the list of nodes of the TFSDP is given in **top-down** traversal order. The bottom-up traversal order can be obtained by reading the list of nodes backwards.

The bilinear utility function for Player 1 is given through the payoff matrix $\mathbf{A}$ such that the (expected) utility of Player 1 can be written as

$$
u_1(\vec{x}, \vec{y}) = \langle \vec{x}, \mathbf{A} \vec{y} \rangle,
$$

where $\vec{x}$ and $\vec{y}$ are sequence-form strategies for Players 1 and 2 respectively. We represent $\mathbf{A}$ in the file as a list of **all non-zero matrix entries**, storing for each the row index, column index, and value. Each entry is an object with the fields:

| Field | Meaning |
|---|---|
| `sequence_pl1` | A pair `(decision_pt_id_pl1, action_pl1)` representing the sequence of Player 1 (row of the entry in the matrix) |
| `sequence_pl2` | A pair `(decision_pt_id_pl2, action_pl2)` representing the sequence of Player 2 (column of the entry in the matrix) |
| `value` | The non-zero float value of the matrix entry |

**Example: rock-paper-superscissors.** In this game, the decision problem faced by each of the players has only one decision point with three actions: playing rock (r), paper (p), or superscissors (s). So each TFSDP only has a single node, which is a decision node. The payoff matrix of the game is

$$
\begin{pmatrix}
 0 & -1 &  1\\
 1 &  0 & -2\\
-1 &  2 &  0
\end{pmatrix}
\ \begin{array}{l}\text{r}\\\text{p}\\\text{s}\end{array}
$$

(rows and columns are both in r, p, s order; the matrix corresponds to the 6 non-zero entries of `utility_pl1` in the JSON).

### Functions to Implement

`stub.py` depends on `gurobipy`. Its command-line entry point is:

```bash
python stub.py --game <path to game JSON> --problem {2.1, 2.2, 2.3}
```

The program reads the game file, converts all sequences from lists to tuples, and then dispatches on `--problem` to the corresponding function. The three functions to fill in (each builds one Gurobi model per `player ∈ {1, 2}`):

| Function | Problem | Task |
|---|---|---|
| `solve_problem_2_1(game)` | Problem 3.1.1 | Implement the LPs $\mathcal{P}_1$, $\mathcal{P}_2$ of (6), solve and report (model name `game_value_pl<player>`) |
| `solve_problem_2_2(game)` | Problem 3.2.1 | Implement the integer programs $\tilde{\mathcal{P}}_1$, $\tilde{\mathcal{P}}_2$ of (7) (model name `deterministic_pl<player>`) |
| `solve_problem_2_3(game)` | Problem 3.3.1 | Implement $\mathcal{P}_1(k)$, $\mathcal{P}_2(k)$ of (8), solve for each $k$ and plot |

(The stub function names refer to "Problem 2.x", which is the numbering in the original handout's problem environment; they correspond to Problems 3.1.1, 3.2.1, 3.3.1 here.)

### Grading

There is no autograder script for this homework. As required by the problems, put the Gurobi outputs (12 in total, for Problems 3.1.1 and 3.2.1), the six plots of objective value as a function of $k$ (Problem 3.3.1), and your discussion of the results (Problem 3.3.2) into the submitted pdf, and attach the complete code at the end of the pdf. You can use the objective values for self-checking: the objective value of $\mathcal{P}_1$ should be $0$ for rock-paper-superscissors, $-0.0555$ for Kuhn poker, and $-0.0856$ for Leduc poker, and the objective values of $\mathcal{P}_1$ and $\mathcal{P}_2$ must sum to $0$.

### Appendix: Gurobi Tips and Tricks

**Basic notation.** Let `m` denote the Gurobi model object. Here is a quick cookbook:

```python
# Add a continuous free variable
m.addVar(-GRB.INFINITY, GRB.INFINITY, vtype=GRB.CONTINUOUS, name="human_var_name_here")
# Add a continuous nonnegative variable
m.addVar(0.0, GRB.INFINITY, vtype=GRB.CONTINUOUS, name="human_var_name_here")
# Add a binary variable
m.addVar(0.0, 1.0, vtype=GRB.BINARY, name="human_var_name_here")
# Add an equality constraint
m.addConstr(lhs == rhs)
# Add an inequality (≥) constraint
m.addConstr(lhs >= rhs)
# Set a maximization objective
m.setObjective(obj, sense=GRB.MAXIMIZE)
```

**Accessing the solution.** After calling `m.optimize()`, you can obtain the objective value by calling

```python
m.getAttr(GRB.Attr.ObjVal)
```

If you want to inspect the solution, given a variable object `v` (the object returned by `m.addVar`), you can access the value of `v` in the current solution by calling

```python
v.getAttr(GRB.Attr.X)
```

**Troubleshooting.** If you run into a problem with Gurobi, the first thing to try is asking Gurobi to dump the model it thinks you are asking it to solve to a file in a human-readable format. *Reading the model file will be so much easier if you gave names to the variables in your model, using the `name` optional argument of `addVar`.* To have Gurobi dump the model, you can use something like this:

```python
m.write("/tmp/model.lp")
```

You can specify a different path, but keep the `.lp` extension: Gurobi can output multiple formats, and it uses the file extension to guess which one you want.

Beyond the general rule of thumb above, make sure of the following:

- Start from rock-paper-superscissors. There, the `/tmp/model.lp` file for Player 1 for Problem 3.1.1 should look something like this (probably with different variable names):

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

  Note: Gurobi omits listing nonnegative variables in the `Bounds` section.

- Did you remember to specify that you want a **maximization** problem? (Gurobi's default is minimization.) If Gurobi says that the model is unbounded, chances are you forgot.
- Check that the number of variables and constraints is what you expect. Are the senses of the constraints (equality, $\le$, $\ge$) what you wanted?
