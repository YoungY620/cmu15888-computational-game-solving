# Homework 2: CFR Implementation

- Course: 15-888 Computational Game Solving (Fall 2025)
- Released: October 12, 2025; Due: October 31, 2025
- Total: 100 points (Problem 1: 20 + Problem 2: 30 + Problem 3: 50)

**Submission instructions.** Submit your homework on Gradescope. Submit a single `pdf` file containing **both** your written solutions **and** your code attached to the end (for example, using a `verbatim` environment). You can (but are not required to) typeset your written solutions in the `.tex` file provided in the homework `.zip`.

## Problems

### Problem 1: (Coarse) Correlated Equilibria and Dominated Actions (20 points)

An action $a_i \in \mathcal{A}_i$ **strictly dominates** another action $a_i' \in \mathcal{A}_i$ if $u_i(a_i, a_{-i}) > u_i(a_i', a_{-i})$ for every possible opponent action profile $a_{-i}$. In this case, we call $a_i'$ **strictly dominated**. If $a_i$ strictly dominates every other action, then we call it **strictly dominant**.

**Problem 1.1 (5 points).** Prove that if an action $\hat a_i \in \mathcal{A}_i$ is **strictly dominant**, then Player $i$ plays $\hat a_i$ with probability $1$ in every coarse correlated equilibrium (CCE).

**Problem 1.2 (5 points).** Prove that if an action $\hat a_i \in \mathcal{A}_i$ is **strictly dominated**, then Player $i$ plays $\hat a_i$ with probability $0$ in every correlated equilibrium (CE).

**Problem 1.3 (10 points).** Show that there is a normal-form game with a CCE in which Player 1 plays a strictly dominated action with strictly positive probability.

> Hint: consider the normal-form game
>
> $$
> \begin{bmatrix}
> (2, 2) & (0, 0) \\
> (1, 1) & (1, 1) \\
> (0, 0) & (0, 0)
> \end{bmatrix}.
> $$
>
> Show that there is a CCE in this game with the desired property.

### Problem 2: Safe Abstraction (30 points)

Consider a two-player zero-sum extensive-form game $\Gamma$ that proceeds as follows.

**Step 1:**

- Each player $i \in \{1, 2\}$ privately rolls a fair $n$-sided die, and observes its outcome $\theta_i \in \{1, \dots, n\}$.
- Both players simultaneously pick actions $a_1, a_2$ from some action set $\mathcal{A}$ of size $m$.

**Step 2:**

- Each player $i \in \{1, 2\}$ privately rolls another fair $n$-sided die, and observes its outcome $\theta_i' \in \{1, \dots, n\}$.
- Both players again simultaneously pick actions $a_1, a_2 \in \mathcal{A}$.

The utility of Player 1 (this is a zero-sum game: Player 2's utility is the negative of Player 1's) depends only on the sums $\theta_1 + \theta_1'$ and $\theta_2 + \theta_2'$ and the actions $a_1, a_2, a_1', a_2'$. That is, each player only cares about the **sum** of their two dice, not their individual values.

Note that we can identify a decision point (information set) of player $i$ by specifying either $\theta_i$ (for Step 1), or a tuple $(\theta_i, \vec a, \theta'_i)$ (for Step 2), where $\vec a = (a_1, a_2)$.

#### 2.1 Warm-Up

**Problem 2.1 (3 points).** In terms of $m$ and $n$, how many **terminal nodes** does this game have? How many **information sets** does each player have? How about **sequences**? (No proofs required; just state the answers.)

#### 2.2 Symmetric Strategies and CFR

Let $j_i = (\theta_i, a_i, a_{-i}, \theta_i')$ and $\tilde j_i = (\tilde \theta_i, a_i, a_{-i}, \tilde \theta_i')$ be two infosets of the same player $i$ in Step 2. We say that $j_i$ and $\tilde j_i$ are **equivalent** if $\theta_i + \theta_i'= \tilde\theta_i + \tilde\theta_i'$ (note that this forces the set of actions to be the same in both infosets).

Call a behavioral strategy $\vec{b}_i : \mathcal{J}_i \to \Delta(\mathcal{A})$, where $\mathcal{J}_i$ is player $i$'s information partition, **symmetric** if equivalent infosets have identical action distributions, that is, $\vec{b}_i(\cdot|j_i) = \vec{b}_i(\cdot|j_i')$ whenever $j_i, j_i'$ are equivalent.

Suppose both players run CFR with simultaneous (as opposed to alternating) updates. Let $\vec{b}_i^{(t)}$ be the behavioral strategy played by player $i$ at time $t$. In CFR, the counterfactual utility that the regret minimizer at infoset $j_i \in \mathcal{J}_i$ receives at time $t$ is given by

$$
u_i^{(t)}(a_i|j_i) = \sum_{\substack{h \in j_i\\z \succeq ha}} \vec{b}_i^{(t)}(z|(h,a_i)) \cdot  \vec{b}_{-i}^{(t)}(z)\cdot c(z) \cdot u_i(z), \tag{1}
$$

where

- $(h, a_i)$ is the child of node $h$ reached by playing action $a_i$,
- the sum is over terminal nodes $z$ that are descendants of nodes $(h,a_i)$ for $h \in j_i$,
- $\vec{b}_i(z|(h,a_i))$ is the probability that player $i$ plays all actions on the $(h, a_i) \to z$ path,
- $\vec{b}_{-i}(z)$ (resp. $c(z)$) is the probability that the opponent (resp. chance) plays all actions on the path from the root node to $z$, and
- $u_i(z)$ is the utility of terminal node $z$ for player $i$.

**Problem 2.2 (8 points).** Let $\vec{b}_i^{(t)} : \mathcal{J}_i \to \Delta(\mathcal{A})$ be the behavioral strategy played by player $i$ at time $t$ in CFR. Show that if $\vec{b}_{-i}^{(1)}, \dots, \vec{b}_{-i}^{(t-1)}$ are all symmetric, then $\vec{b}_{i}^{(1)}, \dots, \vec{b}_{i}^{(t)}$ are also symmetric.

> Hint: given two equivalent infosets $(\theta_i, \vec a, \theta_i')$, $(\tilde \theta_i, \vec a, \tilde \theta_i')$, show that these two infosets will observe the same counterfactual utility $u_i^{(t)}(\cdot|j)$ at every timestep $t$.

It follows by induction that both players will play symmetric strategies at all timesteps. Use this fact for the remainder of the problem.

**Problem 2.3 (8 points).** Show that, in this game, CFR can be implemented in $O(n^2m^4)$ time per iteration. Briefly discuss: how does this time complexity compare to that of the naive implementation of CFR, whose runtime would be linear in the number of nodes in the tree?

> Hint: because of the symmetry condition that you have just proven, many infosets are "copies" of each other, and you don't need to do the work of storing multiple copies of the same infoset. The naive computation will not work; you have to be a bit clever about saving reusable work across infosets.

#### 2.3 Imperfect-Recall Abstraction

Now consider the imperfect-recall abstraction of $\Gamma$ in which equivalent information sets have been merged into larger infosets. That is, infosets in Step 2 are now identified by tuples $(\theta_i^*, \vec a)$ where $\theta_i^* = \theta_i + \theta_i'$. Call this game $\hat\Gamma$. We define CFR in imperfect-recall games using formula (1).

CFR on imperfect-recall zero-sum games is **not** generally guaranteed to converge to Nash equilibrium, even in averages, but you will show that **in this particular class of games** CFR works.

**Problem 2.4 (8 points).** Show that, when the local regret minimizer is regret matching, running CFR on $\hat\Gamma$ produces the same iterates as running CFR on $\Gamma$.

> Hint: read the next problem before solving this one.

**Problem 2.5 (3 points).** Your proof in the previous problem should have used a property specific to (variants of) regret matching. What is that property? Suppose we instead ran CFR on $\Gamma$ with FTRL at each infoset and regularization parameter $\eta$. What would we need to do to $\eta$ in $\hat\Gamma$ to recover the same iterates? (No proof required: just state the change.)

### Problem 3: Counterfactual Regret Minimization (50 points)

In this problem, you will implement the CFR regret minimizer for sequence-form decision problems.

You will run your CFR implementation on three games: rock-paper-superscissors (a simple variant of rock-paper-scissors, in which beating paper with scissors gives a payoff of $2$ instead of $1$) and two well-known poker variants: Kuhn poker and Leduc poker. A description of each game is given in the zip of this homework, according to the format described in the "Programming Assignment" section below. The zip also contains a stub Python file to help you set up your implementation.

#### 3.1 Learning to Best Respond

Let $\mathcal{X}$ and $\mathcal{Y}$ be the sequence-form strategy polytopes corresponding to the tree-form sequential decision problems faced by Players 1 and 2 respectively.

A good smoke test when implementing regret minimization algorithms is to verify that they learn to best respond. In particular, you will verify that your implementation of CFR applied to the decision problem of Player 1 learns a best response against Player 2 when Player 2 plays the **uniform** strategy, that is, the strategy that at each decision point picks any of the available actions with equal probability.

Let $\vec{y}_{\text{uni}} \in \mathcal{Y}$ be the sequence-form representation of the strategy for Player 2 that at each decision point selects each of the available actions with equal probability. When Player 2 plays according to that strategy, the utility vector for Player 1 is given by $\vec{u} \coloneqq \mathbf{A} \vec{y}_{\text{uni}}$, where $\mathbf{A}$ is the payoff matrix of the game.

For each of the three games, take your CFR implementation for the decision problem of Player 1, and let it output strategies $\vec{x}^{(t)} \in \mathcal{X}$ while giving as feedback at each time $t$ the same utility vector $\vec{u}$. As $T \to \infty$, the average strategy

$$
\bar{\vec{x}}^{(T)} \coloneqq \frac{1}{T} \sum_{t=1}^T \vec{x}^{(t)} \in \mathcal{X} \tag{2}
$$

will converge to a best response to the uniform strategy $\vec{y}_{\text{uni}}$, that is,

$$
\lim_{T\to\infty} \langle \bar{\vec{x}}^{(T)}, \mathbf{A} \vec{y}_{\text{uni}} \rangle = \max_{\hat{\vec{x}}\in \mathcal{X}}  \hat{\vec{x}}^\top \mathbf{A} \vec{y}_{\text{uni}}.
$$

If the above doesn't happen empirically, something is wrong with your implementation.

**Problem 3.1.1 (15 points).** In each of the three games, apply your CFR implementation to the tree-form sequential decision problem of Player 1, using as local regret minimizer at each decision point the regret matching algorithm (Lecture 4). At each time $t$, give as feedback to the algorithm the same utility vector $\vec{u} = \mathbf{A} \vec{y}_{\text{uni}}$, where $\vec{y}_{\text{uni}} \in \mathcal{Y}$ is the uniform strategy for Player 2. Run the algorithm for $1000$ iterations. After each iteration $T = 1,\dots,1000$, compute the value $v^{(T)} \coloneqq \langle \bar{\vec{x}}^{(T)}, \mathbf{A} \vec{y}_{\text{uni}} \rangle$ where $\bar{\vec{x}}^{(T)} \in \mathcal{X}$ is the average strategy output so far by CFR, as defined in (2).

Plot $v^{(T)}$ as a function of $T$. Empirically, what limit do you observe $v^{(T)}$ converging to?

> Hints:
>
> - Represent vectors on $\mathbb{R}^{|\Sigma|}$ (including the sequence-form strategies output by CFR and utility vectors given to CFR) in memory as dictionaries from sequences (tuples `(decision_point_id, action)`) to floats.
> - In rock-paper-superscissors, $v^{(T)}$ should approach the value $\frac{1}{3}$. In Kuhn poker, the value $\frac{1}{2}$. In Leduc poker, the value $2.0875$.

Your solution should include three plots (one for each game) and three values. Don't forget to turn in your implementation.

#### 3.2 Learning a Nash Equilibrium

Now that you are confident that your implementation of CFR is correct, you will use CFR to converge to Nash equilibrium via the self-play idea described in Lecture 3.

The idea behind using regret minimization to converge to Nash equilibrium in a two-player zero-sum game is **self play**. We instantiate two regret minimization algorithms, $\mathfrak{R}_\mathcal{X}$ and $\mathfrak{R}_\mathcal{Y}$, for the domains of the maximization and minimization problem, respectively. At each time $t$ the two regret minimizers output strategies $\vec{x}^{(t)}$ and $\vec{y}^{(t)}$, respectively. Then they receive as feedback the vectors $\vec{u}_\mathcal{X}^{(t)}, \vec{u}_\mathcal{Y}^{(t)}$ defined as

$$
\vec{u}_\mathcal{X}^{(t)} \coloneqq \mathbf{A} \vec{y}^{(t)},\qquad\quad
\vec{u}_\mathcal{Y}^{(t)} \coloneqq -\mathbf{A}^\top \vec{x}^{(t)}, \tag{3}
$$

where $\mathbf{A}$ is Player 1's payoff matrix. (That is: each regret minimizer outputs a strategy, then observes the utility vector constructed from the opponent's current strategy, and so on.)

As we saw in class, the pair of average strategies produced by the regret minimizers up to any time $T$ converges to a Nash equilibrium, where convergence is measured via the **saddle point gap**

$$
\max_{\hat{\vec{x}}\in\mathcal{X}} ( \hat{\vec{x}}^\top \mathbf{A} \vec{y}  )  - \min_{\hat{\vec{y}}\in\mathcal{Y}} ( \vec{x}^\top \mathbf{A} \hat{\vec{y}}  ).
$$

A point $(\vec{x},\vec{y})\in \mathcal{X}\times\mathcal{Y}$ has zero saddle point gap if and only if it is a Nash equilibrium of the game.

**Problem 3.2.1 (15 points).** Let the CFR implementation (using regret matching as the local regret minimizer at each decision point) for Player 1's and Player 2's tree-form sequential decision problems play against each other in self play, as described above.

Plot the saddle point gap and the expected utility (for Player 1) of the average strategies as a function of the number of iterations $T = 1,\dots,1000$.

> Hints:
>
> - Represent vectors on $\mathbb{R}^{|\Sigma|}$ (including the sequence-form strategies output by CFR and utility vectors given to CFR) in memory as dictionaries from sequences (tuples `(decision_point_id, action)`) to floats.
> - To compute the saddle point gap, feel free to use the function `gap(game, strategy_pl1, strategy_pl2)` provided in the Python stub file.
> - The saddle point gap should be going to zero. The expected utility of the average strategies in rock-paper-superscissors should approach the value $0$. In Kuhn poker it should approach $-0.055$. In Leduc poker it should approach $-0.085$.

Your solution should include six plots (two for each game: one for the saddle point gap and one for the utility). Don't forget to turn in your implementation.

#### 3.3 CFR+, Alternating Iterates, and Linear Averaging

To achieve better performance in practice when learning Nash equilibria in two-player zero-sum games, we consider the following modifications to the setup of the previous subsection.

- Instead of regret matching, CFR is set up to use the regret matching plus (RM$^+$) algorithm (see Lecture 4) at each decision point.
- Instead of the classical self-play scheme described above, players **alternate** the iterates and feedback: the utility vector $\vec{u}_\mathcal{X}^{(t)}$ is as defined in (3), whereas
$$
\tilde{\vec{u}}_\mathcal{Y}^{(t)} \coloneqq -\mathbf{A}^\top \vec{x}^{(t+1)}.
$$
- Finally, the output is a weighted average of the strategies,
$$
\bar{\bar{\vec{x}}}^{(T)} \coloneqq \frac{1}{\sum_{t=1}^{T} t^\gamma}\sum_{t=1}^{T} t^\gamma\vec{x}^{(t)}, \qquad
\bar{\bar{\vec{y}}}^{(T)} \coloneqq \frac{1}{\sum_{t=1}^{T} t^\gamma}\sum_{t=1}^{T} t^\gamma \vec{y}^{(t)}
$$
which is considered instead of the regular averages when computing the saddle point gap.

Collectively, we refer to the modified setup just described as "running CFR+".

**Problem 3.3.1 (20 points).** Modify your implementation of CFR so that it also supports each of the following variants.

1. **(10 points)** CFR+, with alternating iterates and $\gamma = 1$;
2. **(4 points)** DCFR, with alternating iterates and parameters $\alpha = 1.5,\ \beta = 0,\ \gamma = 2$;
3. **(3 points)** PCFR+, with alternating iterates and $\gamma = 2$; and
4. **(3 points)** PCFR+, with alternating iterates and $\gamma = \infty$ (i.e., do not average; keep only the last iterate).

For each variant, run it for $1000$ iterations, plotting the expected utility for Player 1 and the saddle point gap of the averages $\bar{\bar{\vec{x}}}^{(T)}, \bar{\bar{\vec{y}}}^{(T)}$ after each iteration $T$. Add these lines to your plots from Problem 3.2.1.

> Do not write a separate solution for this problem. Instead, modify your plots in Problem 3.2.1 so that they also contain each of these variants. Make sure to specify which game and which algorithm each plot refers to.

## Programming Assignment

The programming part corresponds to Problem 3 (50 points). The materials live in `cfr_files/`: the three game files `rock_paper_superscissors.json`, `kuhn_poker.json`, `leduc_poker.json`, and the stub file `stub.py`.

### Game File Format

Each game is encoded as a JSON file, in exactly the same format as in Homework 1. The root object has three keys:

| Key | Meaning |
|---|---|
| `decision_problem_pl1` | Description of the tree-form sequential decision process (TFSDP) faced by Player 1 (list of nodes) |
| `decision_problem_pl2` | Description of the TFSDP faced by Player 2 (list of nodes) |
| `utility_pl1` | Description of the bilinear utility function for Player 1 (zero-sum: Player 2's utility is its opposite) |

The tree of each decision problem is stored as a list of nodes (given in top-down traversal order; reading the list backwards yields the bottom-up order). Each node has the fields:

| Field | Meaning |
|---|---|
| `id` | A string identifier of the node; unique among the nodes of the same player |
| `type` | Either `decision` (decision point) or `observation` (observation point) |
| `actions` | (decision points only) The set of action strings available at the node |
| `signals` | (observation points only) The set of signal strings that can be observed at the node |
| `parent_edge` | The parent edge; `null` for the root, otherwise a pair `(parent_node_id, action_or_signal)` |
| `parent_sequence` | (decision points only) The parent sequence $p_j$: the last sequence (decision point–action pair) encountered on the path from the root to $j$ |

The bilinear utility function for Player 1 is given through the payoff matrix $\mathbf{A}$: $u_1(\vec{x}, \vec{y}) = \vec{x}^\top \mathbf{A}\vec{y}$, where $\vec{x}$, $\vec{y}$ are the players' sequence-form strategies. In the file, $\mathbf{A}$ is represented as a list of all non-zero entries, each with the fields:

| Field | Meaning |
|---|---|
| `sequence_pl1` | A pair `(decision_pt_id_pl1, action_pl1)`: the sequence of Player 1 (matrix row) |
| `sequence_pl2` | A pair `(decision_pt_id_pl2, action_pl2)`: the sequence of Player 2 (matrix column) |
| `value` | The non-zero float value of the matrix entry |

**Example: rock-paper-superscissors.** The decision problem faced by each player has only one decision point with three actions (r, p, s), and the payoff matrix of the game is

$$
\begin{pmatrix}
 0 & -1 &  1\\
 1 &  0 & -2\\
-1 &  2 &  0
\end{pmatrix},
$$

(Rows and columns are both in r, p, s order. A Nash equilibrium of the game is reached when all players play rock with probability $\frac{1}{2}$, paper with probability $\frac{1}{4}$, and superscissors with probability $\frac{1}{4}$; correspondingly, the game value is $0$.)

### Provided Helper Functions

The following functions in the stub file are **already implemented** and can be used directly (here `game` is the parsed game JSON, and `tfsdp` is either `game["decision_problem_pl1"]` or `game["decision_problem_pl2"]`):

| Function | Purpose |
|---|---|
| `get_sequence_set(tfsdp)` | Returns the set of all sequences in the given TFSDP |
| `is_valid_RSigma_vector(tfsdp, obj)` | Checks that the object is a dictionary keyed on the sequence set of the given TFSDP |
| `assert_is_valid_sf_strategy(tfsdp, obj)` | Checks whether the object represents a valid sequence-form strategy vector |
| `best_response_value(tfsdp, utility)` | Computes $\max_{\vec{x} \in Q} \vec{x}^\top u$, where $Q$ is the sequence-form polytope of the given TFSDP |
| `compute_utility_vector_pl1(game, sf_strategy_pl2)` | Returns $\mathbf{A}\vec{y}$ ($\mathbf{A}$ is the payoff matrix, $\vec{y}$ the given Player 2 strategy) |
| `compute_utility_vector_pl2(game, sf_strategy_pl1)` | Returns $-\mathbf{A}^\top\vec{x}$ ($\vec{x}$ the given Player 1 strategy) |
| `gap(game, sf_strategy_pl1, sf_strategy_pl2)` | Computes the saddle point gap of the given sequence-form strategies for the players |

### Functions to Implement

| Function / Class | Task |
|---|---|
| `expected_utility_pl1(game, sf_strategy_pl1, sf_strategy_pl2)` | Returns the expected utility for Player 1 when the two players play according to the given strategies |
| `uniform_sf_strategy(tfsdp)` | Returns the uniform sequence-form strategy for the given TFSDP |
| `RegretMatching` class (`__init__`, `next_strategy`, `observe_utility`) | The regret matching algorithm; `next_strategy` should return a dictionary mapping each action in `action_set` to its selection probability |
| `RegretMatchingPlus` class (same interface) | The regret matching plus (RM$^+$) algorithm |
| `Cfr` class (`next_strategy`, `observe_utility`) | The CFR regret minimizer; the constructor already instantiates a local regret minimizer for each decision point (the algorithm class is given by the `rm_class` parameter) |
| `solve_problem_3_1(game)` | Problem 3.1.1: learning to best respond to the uniform strategy |
| `solve_problem_3_2(game)` | Problem 3.2.1: learning a Nash equilibrium via self play |
| `solve_problem_3_3(game)` | Problem 3.3.1: CFR+ and its variants |

The command-line entry point is:

```bash
python stub.py --game <path to game JSON> --problem {3.1, 3.2, 3.3}
```

The program reads the game file, converts all sequences from lists to tuples (including `parent_edge`, `parent_sequence`, and the `sequence_pl1`/`sequence_pl2` fields inside `utility_pl1`), and then dispatches on `--problem` to the corresponding `solve_problem_3_*` function.

### Grading

There is no autograder script for this homework. As required by the problems, put the plots and values into the submitted pdf and attach the complete code at the end of the pdf. Values you can use for self-checking:

- Problem 3.1.1: $v^{(T)}$ should approach $\frac{1}{3}$ in rock-paper-superscissors, $\frac{1}{2}$ in Kuhn poker, and $2.0875$ in Leduc poker;
- Problem 3.2.1: the saddle point gap should go to zero; the expected utility for Player 1 of the average strategies should approach $0$, $-0.055$, and $-0.085$ in the three games, respectively;
- Problem 3.3.1: overlay the curves of the four variants—CFR+ ($\gamma=1$), DCFR ($\alpha=1.5,\beta=0,\gamma=2$), PCFR+ ($\gamma=2$), and PCFR+ ($\gamma=\infty$)—on the plots from Problem 3.2.1.
