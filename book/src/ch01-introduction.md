<!-- escape-math: v1 -->
# L1 Introduction

This chapter lays out the basic language used throughout the course: the two classical representations of games, the core solution concepts (dominant strategy equilibrium and Nash equilibrium), existence theorems for pure- and mixed-strategy equilibria, and the computational complexity landscape of equilibrium finding. It closes with two-player zero-sum games, whose elegant properties are the theoretical foundation for every large-scale game-solving algorithm that follows.

## The Heart of the Problem

In single-agent settings, an agent's expected-utility-maximizing strategy is well defined: evaluate each candidate strategy by its expected utility and take the best. In multiagent settings, the outcome depends on the other agents' strategies as well, so an agent's best strategy may depend on what strategies the other agents choose, and vice versa. Game theory was developed specifically to handle this strategic interdependence, and it is the only sound approach for doing so.

## Terminology

- **Agent**: a player.
- **Action**: a move, a choice the agent can make at a point in the game.
- **Strategy** $s\_i$: a mapping from history (to the extent that agent $i$ can distinguish it) to actions. It can encompass "strategic", "operational", and "tactical" decisions at once.
- **Strategy set** $S\_i$: the strategies available to the agent.
- **Strategy profile** $(s\_1, s\_2, \dots, s\_{|A|})$: a tuple with one strategy for each agent.
- **Utility**: after every agent (including "nature", which is used to model uncertainty) has chosen its strategy and the game has been played out, agent $i$'s utility is determined as $u\_i = u\_i(s\_1, s\_2, \dots, s\_{|A|})$.

## Agents and Utility

An agent attempts to maximize its expected utility. Agent $i$'s **utility function** $u\_i$ is a mapping from outcomes to real numbers; it incorporates the agent's risk attitude and thereby allows quantitative tradeoffs. Consider outcomes over money, and compare two lotteries:

- Lottery 1: \\$0.5M with probability 1;
- Lottery 2: \\$1M with probability 0.5, \\$0 with probability 0.5.

The two lotteries have the same expected monetary value, yet a risk-averse agent prefers Lottery 1, a risk-seeking agent prefers Lottery 2, and a risk-neutral agent is indifferent. The agent's strategy here is simply the choice of lottery. Risk aversion is precisely the reason insurance companies exist. In game theory we usually speak directly of **expected payoff** or **expected value (EV)**.

![Utility curves for the three risk attitudes: risk averse (concave), risk neutral (linear), and risk seeking (convex)](assets/ch01-introduction-1.png)

As the figure shows, the curvature of the utility function over money captures risk attitude: a concave function corresponds to risk aversion, a linear one to risk neutrality, and a convex one to risk seeking.

**Utility functions are scale-invariant.** Agent $i$ chooses a strategy that maximizes expected utility:

$$
\max\_{\text{strategy}} \sum\_{\text{outcome}} p(\text{outcome} \mid \text{strategy}) \\, u\_i(\text{outcome})
$$

If $u\_i'(\cdot) = a\\, u\_i(\cdot) + b$ with $a > 0$, then the agent will choose exactly the same strategy under $u\_i'$ as under $u\_i$: positive affine transformations do not change the preference order. (Note that $u\_i$ must be finite for every possible outcome; otherwise the expected utility could be infinite for several strategies at once, and the strategies could no longer be compared.) Inter-agent utility comparison, however, is problematic: one cannot conclude from the numbers "whose payoff is larger".

## Classical Game Representations

There are two classical representations of a game:

- **Extensive form** (aka tree form): a game tree that makes the order of moves explicit; every node is labeled with whose turn it is to move, and the leaves give the payoffs of all players.
- **Matrix form** (aka normal form, aka strategic form): rows and columns correspond to the players' (pure) strategies, and each cell gives the payoff vector under that strategy profile.

![The same game in extensive form (left) and matrix form (right)](assets/ch01-introduction-2.png)

On the left of the figure is the extensive form of a two-stage game. Player 1 first chooses Up/Down, Player 2 observes this and then chooses Left/Right, and the leaves $(u\_1, u\_2)$ give both players' payoffs. On the right is the matrix form of the same game. Player 1 has two strategies (Up, Down), while Player 2's strategy must specify an action at each of her two decision nodes, giving four strategies (Left,Left), (Left,Right), (Right,Left), (Right,Right). Notice that even this toy game already exhibits redundancy in matrix form: **converting from extensive form to matrix form causes a combinatorial explosion**. This is exactly why many algorithms in this course operate directly on the extensive form.

## Dominant Strategy Equilibrium

> **Definition (best response).** Given a strategy profile $s\_{-i}$ of the other players, strategy $s\_i^\*$ is a best response for $i$ if and only if for all $s\_i'$,
> $$u\_i(s\_i^\*, s\_{-i}) \ge u\_i(s\_i', s\_{-i}).$$

> **Definition (dominant strategy).** $s\_i^\*$ is a dominant strategy if and only if it is a best response for **all** $s\_{-i}$. A dominant strategy does not always exist; inferior strategies are called **dominated**.

> **Definition (dominant strategy equilibrium).** A strategy profile in which every agent has picked its dominant strategy. It, too, does not always exist.

The virtue of a dominant strategy equilibrium is that it **requires no counterspeculation**: one's own choice is optimal no matter what the opponent does. The classic example is the Prisoners' Dilemma:

| | Cooperate | Defect |
|---|---|---|
| **Cooperate** | $-1, -1$ | $-3, 0$ |
| **Defect** | $0, -3$ | $-2, -2$ |

For each player, Defect is strictly better than Cooperate regardless of what the other player does, so (Defect, Defect) is a dominant strategy equilibrium.

## Nash Equilibrium

In many games, an agent's best response depends on the others' strategies, so no agent has a dominant strategy. The Nash equilibrium [Nash 1950] is a weaker stability concept:

> **Definition (Nash equilibrium).** A strategy profile $s^\*$ is a Nash equilibrium if and only if no player has an incentive to deviate unilaterally given that the others do not deviate; that is, for every agent $i$ and all $s\_i'$,
> $$u\_i(s\_i^\*, s\_{-i}^\*) \ge u\_i(s\_i', s\_{-i}^\*).$$

Every dominant strategy equilibrium is a Nash equilibrium, but not vice versa. In the Prisoners' Dilemma, (Defect, Defect) is the only Nash equilibrium. The Battle of the Sexes, by contrast, has no dominant strategies at all:

| | Boxing | Ballet |
|---|---|---|
| **Boxing** | $2, 1$ | $0, 0$ |
| **Ballet** | $0, 0$ | $1, 2$ |

It has two pure-strategy Nash equilibria: (Boxing, Boxing) and (Ballet, Ballet).

**Criticisms of Nash equilibrium** fall mainly into two points.

1. **It is not unique**, as the Battle of the Sexes shows. Approaches for addressing this problem include:
   - **Refinements** (= strengthenings) of the equilibrium concept: eliminate weakly dominated strategies first; choose the Nash equilibrium with the highest welfare; subgame perfection; and so on;
   - Focal points, mediation, communication, convention, and learning.
2. **It may fail to exist** (in pure strategies). For example, no pure-strategy profile of the following game is stable:
$$
\begin{pmatrix} 1,0 & 0,1 \\\ 0,1 & 1,0 \end{pmatrix}
$$

## Imperfect-Information Games

Take rock-paper-scissors as an example: if the players move **sequentially** (one player commits first and the other observes before acting), the second mover always wins and the game is trivial; only with **simultaneous moves** (equivalently, when the later mover cannot see the earlier mover's choice) is there any genuine strategic content. Most real-world games are **imperfect-information games**, because a player does not know everything about what the other players and nature have done. These games are the main focus of this course.

Techniques for perfect-information games (such as AlphaZero) do not apply here, because imperfect information brings additional issues:

- **Private information**: one needs to understand signals, and how other players will interpret signals;
- Games often involve **deception**, and the need to understand deception by others;
- Game theory is the only sound way to handle phenomena such as **bluffing, reveal/conceal, and decoys**.

Real-world imperfect-information games with sequential (or simultaneous) moves abound: negotiation; auctions (e.g., multi-stage auctions such as the FCC ascending auctions and combinatorial auctions, and sequential auctions of multiple items); an agent facing adversaries in an uncertain, stochastic environment; card games such as poker; currency attacks; international (over-)fishing; political campaigns (e.g., TV spending in each region); ownership games over polar regions, moons, and planets; allocating and timing troops and armaments to locations; military spending games (e.g., space vs. ocean); airport security, air marshals, the coast guard, rail security; cybersecurity; and many more.

## Mixed Strategies and Information Sets

Imperfect-information games may require **mixed strategies**: a probability distribution over pure strategies, chosen by the agent herself.

![Simultaneous-move rock-paper-scissors in extensive form: Player 2's three decision nodes are joined by a dashed line into a single information set](assets/ch01-introduction-3.png)

The figure depicts simultaneous-move rock-paper-scissors in extensive form: Player 1 "moves" first and Player 2 moves second, but Player 2's three decision nodes belong to a single **information set**: the mover does not know which node of the set she is in, and therefore cannot condition her answer on Player 1's actual choice. Chance can also be a player: it is stochastic, not strategic. This game has a (mixed-strategy) **(Bayes-)Nash equilibrium**: each player plays rock, paper, and scissors with probability $1/3$ each. Every agent uses a best-response strategy and holds mutually consistent beliefs.

> **Fact.** In a mixed-strategy equilibrium, every pure strategy that occurs in agent $i$'s mix yields the same expected utility to $i$.

A closely related concept is the **behavioral strategy**: the agent has a probability distribution over her actions at **each of her information sets** (rolling the dice as she goes, rather than committing to a pure strategy once before the game begins).

> **Theorem (Kuhn's theorem).** If an agent has perfect recall, then for every mixed strategy there exists a behavioral strategy with an equivalent payoff (i.e., the two strategies are equivalent). The theorem also applies to infinite games.

## Existence of Pure-Strategy Nash Equilibria

> **Theorem.** Any finite game in which **every action node is alone in its information set** (i.e., at every point in the game, the agent whose turn it is to move knows all moves played so far) is dominance solvable by **backward induction**, at least as long as ties are ruled out.

**Proof idea (constructive).** Multi-player minimax search: working up from the leaves, each node takes the value of the child that is best for the player who moves there; this yields an equilibrium.

A great deal of interesting work has been done on the computational complexity around this construction: checkers is solved; chess and Go are not solved, but the best AIs are superhuman.

## Existence and Complexity of Mixed-Strategy Nash Equilibria

> **Theorem (Nash 1950).** Every finite-player, finite-strategy game has at least one Nash equilibrium if we admit mixed-strategy equilibria as well as pure ones. (The proof is based on Kakutani's fixed point theorem.)

But a Nash equilibrium may be **hard to compute**. The complexity landscape of finding a Nash equilibrium in a normal-form game:

- **Two-player zero-sum games** can be solved in polynomial time with linear programming (LP);
- **Two-player (general-sum) games** are **PPAD-complete**, even with 0/1 payoffs [Chen, Deng & Teng, JACM-09; Abbott, Kane & Valiant, FOCS-05; Daskalakis, Goldberg & Papadimitriou, STOC-06]; and it is **NP-complete** to find even an *approximately good* Nash equilibrium [Conitzer & Sandholm, GEB-08];
- **Three-player games** are **FIXP-complete** [Etessami & Yannakakis, FOCS-07].

## Properties of Two-Player Zero-Sum Games

Two-player zero-sum games enjoy beautiful properties that other games do not:

- **Swappability**: if $(x, y)$ and $(x', y')$ are equilibria, then so are $(x', y)$ and $(x, y')$. Hence there is **no equilibrium selection problem**: a player is safe playing any one of her equilibrium strategies.
- A player's equilibrium strategies form a **bounded convex polytope**: any convex combination of her equilibrium strategies is again an equilibrium strategy.
- The set of Nash equilibria is exactly the set of solutions to the **minmax problem**
$$
\max\_x \min\_y u\_1(x, y).
$$
- **Minmax theorem** [von Neumann 1928]: it does not matter which player "reveals" her mixed strategy first:
$$
\max\_x \min\_y u\_1(x, y) = \min\_y \max\_x u\_1(x, y),
$$
and this common value is called the **game value**.

More generally, the theorem has a convex-analytic form:

> **Theorem (saddle point theorem).** Let $X \subset \mathbb{R}^n$ and $Y \subset \mathbb{R}^m$ be compact convex sets, and let $f: X \times Y \to \mathbb{R}$ be continuous and **concave-convex**, i.e., for each fixed $y$, $f(\cdot, y): X \to \mathbb{R}$ is concave, and for each fixed $x$, $f(x, \cdot): Y \to \mathbb{R}$ is convex. Then
> $$\max\_{x \in X} \min\_{y \in Y} f(x, y) = \min\_{y \in Y} \max\_{x \in X} f(x, y).$$

**Example.** Take $f(x, y) = x^\top A y$ (where $A \in \mathbb{R}^{n \times m}$ is a finite matrix); this is exactly the two-player zero-sum matrix game under mixed strategies, and the equality above gives $\max\_x \min\_y x^\top A y = \min\_y \max\_x x^\top A y$.

![The saddle-point function $f(x,y) = y^2 - x^2$ is concave-convex (concave in $x$, convex in $y$); the red dot marks the saddle point](assets/ch01-introduction-4.png)

These properties have deep algorithmic and safety implications:

- Consequently, **even if the opponent knows our mixed strategy**, he cannot force our expected payoff below the game value.
- Conversely, any **non-equilibrium strategy** obtained from machine learning, reinforcement learning, generative AI, or any other approach **cannot guarantee the game value**; that is, such a strategy is **exploitable**.
- There is an amazing **safety property** in multi-step imperfect-information games: by playing a non-equilibrium strategy, our opponent can cause our beliefs to be wrong, but **not in a way that increases the opponent's own expected value**. It is therefore safe to play under the assumption that the opponent is rational: if the opponent is irrational, that can only help us.
- Two-player zero-sum games are solvable by LP in time **polynomial in the size of the game tree**. But what if the tree has $10^{165}$ nodes? How should we solve games whose size dwarfs the reach of exhaustive search and direct LP? That is precisely the question that the rest of this course (abstraction, CFR, subgame solving, and so on) sets out to answer.

## Key Takeaways

- In multiagent settings, strategies are interdependent, and game theory is the only sound way to handle this; the utility function captures risk attitude and is invariant under positive affine transformations.
- The extensive form and the matrix form are the two classical representations, and the latter blows up combinatorially relative to the former.
- A dominant strategy equilibrium is stronger than a Nash equilibrium but often fails to exist; a Nash equilibrium may be non-unique (calling for refinements, focal points, and similar mechanisms) and may fail to exist in pure strategies.
- Imperfect-information games (negotiation, auctions, poker, security, and more) are the protagonists of this course; their core concept is the information set, and their strategies often need to be mixed. Kuhn's theorem guarantees the equivalence of mixed and behavioral strategies under perfect recall.
- Finite perfect-information games can be solved by backward induction (constructive proof: multi-player minimax search); mixed equilibria always exist in general games (Nash, via Kakutani's fixed point theorem), but computationally: two-player zero-sum games are solvable in polytime by LP, two-player general games are PPAD-complete and finding an approximately good equilibrium is NP-complete, and three-player games are FIXP-complete.
- Two-player zero-sum games have elegant properties: the minmax theorem (the game value exists), swappability of equilibria, and an equilibrium set that forms a convex polytope; equilibrium strategies guarantee the game value, while non-equilibrium strategies are exploitable. This provides both the goal and the safety benchmark for solving large-scale imperfect-information games.
