# L13 Libratus II: Subgame Solving

The previous chapter described the overall architecture of Libratus: a blueprint strategy is computed offline in a coarse abstraction, and during play a subgame solver re-solves the currently reached situation in real time in a much finer abstraction. This chapter covers subgame solving itself — the **most important technique** in Libratus [Brown & Sandholm, *Science* 2018]: why a "subgame" of an imperfect-information game cannot be solved independently the way it can in perfect-information games, how the context supplied by the blueprint is used to construct a solvable augmented subgame, and the sequence of refinement techniques from the Bayesian approach through Re-solve and Maxmargin to Reach-maxmargin and nested subgame solving, together with their safety guarantees.

## Why subgames cannot be solved independently

In a perfect-information game, a subgame can be solved using only information inside the subgame itself — this is exactly what makes AlphaGo-style search possible. This is not true in imperfect-information games: optimal play inside a "subgame" depends on the probability distribution over the nodes reached (the beliefs), and those beliefs are endogenously determined by the **rest of the game**, including the opponent's strategy elsewhere.

Recall the Coin Toss game from the previous chapter. Suppose that when player 1 chooses Sell, her Heads type receives $2$ and her Tails type receives $-2$; if she instead chooses Play, play enters the "subgame" in which player 2 guesses the coin (the purple box in the figure below):

![The "subgame" in the Coin Toss game (purple box). The Sell payoffs are changed to 2 for the Heads type and -2 for the Tails type. Player 2's two nodes lie in the same information set; his optimal action in the subgame depends on his belief about the coin outcome, which in turn depends on player 1's Sell/Play strategy outside the subgame.](assets/ch13-libratus-2-1.png)

How player 2 should play in the subgame depends entirely on the probability he assigns to Heads versus Tails, and that probability is determined by player 1's strategy **outside** the subgame (with which types she tends to Sell, and with which she tends to Play). Conversely, whether it is worthwhile for player 1 to Play depends on what will happen inside the subgame. This "subgame" therefore has no self-contained solution detached from the global game — it is coupled to the rest of the game through a **probability distribution (the reach distribution) and a set of counterfactual values**. This is the fundamental difficulty that subgame solving must address.

## The overall framework for real-time subgame solving

Libratus's goal is to solve the "subgame" actually reached during play in a **finer abstraction**, obtaining locally more precise play than the blueprint provides. Because subgames cannot be solved independently, the framework has two steps:

1. Offline, solve the entire game in a **coarse abstraction** to obtain the blueprint strategy, which approximately provides the context for every situation (reach probabilities, the opponent's expected value with each type, and so on);
2. During play, using the blueprint as context, construct a self-consistent **augmented subgame** at the currently reached subgame and solve it in real time in a finer abstraction.

The meaning of "subgame" here must be made precise. The classical game-theoretic definition requires that at the start of a subgame the players know the exact state of the game (no information set is split); an **imperfect-information subgame** in poker is instead delimited by what is **common knowledge** among the players — for example, by the public board cards and the action sequence so far. Every combination of private cards consistent with the common knowledge is a root of the subgame, and all descendants of those roots belong to it [Brown & Sandholm, *Science* 2018]. This is precisely why it cannot be solved independently from a single root the way a perfect-information subgame can.

In the augmented subgame, both players' hands are sampled from the blueprint-induced distributions: on each iteration, the opponent (P1) is dealt a random private hand, and, given that we (P2) played according to the blueprint strategy $\sigma_2$ before the subgame and given P1's dealt hand, P2 is dealt a hand according to the corresponding conditional probability distribution [Brown & Sandholm, *Science* 2018]. The root distribution of the augmented subgame thus fully encodes the context provided by the blueprint.

The various subgame-solving techniques differ in **how the augmented subgame is constructed from the blueprint**, and consequently in the strength of the safety guarantees they provide.

## Bayesian subgame solving (unsafe)

The earliest method is Bayesian subgame solving [Gilpin & Sandholm, AAAI-06, AAMAS-07; Ganzfried & Sandholm, AAMAS-15]: add a fictitious chance node $C'$ at the root of the subgame that deals the opponent's "type" (private information) according to **the probability distribution with which the opponent's types reach the subgame under the blueprint**, then solve the resulting augmented subgame normally.

![Bayesian subgame solving. Left: the blueprint strategy (not an exact equilibrium), in which the Heads type of player 1 Plays with probability 0.75 and the Tails type with probability 0.5. Right: the augmented subgame, in which the fictitious chance node C′ deals the two types with the blueprint-induced reach probabilities $0.75/(0.5+0.75)$ and $0.5/(0.5+0.75)$; in the solution, player 2 (the computer) always guesses Heads and never forfeits.](assets/ch13-libratus-2-2.png)

In the example above: in the blueprint, player 1's Heads type Plays with probability $0.75$ and her Tails type with probability $0.5$, so the chance node $C'$ at the root of the augmented subgame deals the two types with probabilities $\frac{0.75}{0.5+0.75}$ and $\frac{0.5}{0.5+0.75}$. In the solution of this example, player 2 (the computer) guesses Heads with probability $1$ and the Forfeit probability drops to $0$.

The method has **no theoretical guarantees — it is unsafe**: it unconditionally trusts the reach distribution given by the blueprint, and the opponent can deviate from the blueprint, changing the type distribution with which she enters the subgame, to exploit us. Nevertheless, it performs well in practice on some domains.

## Re-solve refinement: the safety theorem

Re-solve refinement [Burch et al., AAAI-14] restores safety by giving the opponent an "exit option." In the constructed augmented subgame, each type of the opponent (player 1) chooses at the root of the subgame between two actions:

- **Enter**: enter the subgame and play according to the newly solved strategy;
- **Alt**: do not enter; instead immediately take the expected value (EV) that this type would receive for entering the subgame under the **blueprint strategy**.

![Re-solve refinement. Left: the blueprint strategy, in which the EV of Play is 0 for the Heads type and 0.5 for the Tails type. Right: in the augmented subgame, each type of player 1 first chooses Alt (taking the blueprint EV — 0 for Heads, 0.5 for Tails in the figure) or Enter to enter the subgame.](assets/ch13-libratus-2-3.png)

Because we solve for an equilibrium of a zero-sum game, player 1 will only enter the subgame when her value for Enter does not exceed her value for Alt. The construction therefore guarantees that **the opponent's EV for entering the subgame is no higher than her EV under the blueprint strategy**. This yields the safety theorem:

> **Theorem (safety of Re-solve).** The strategy produced by Re-solve refinement is no more exploitable than the blueprint strategy.

Safety comes at a price: Re-solve **can miss obvious opportunities for improvement**. In the solution of the example, player 2 still forfeits with probability $0.25$ — forfeiting is never better than guessing in any situation — but the Re-solve construction has no incentive to eliminate such residual suboptimal play, since it only requires that the opponent's EV not exceed its blueprint level.

## Maxmargin refinement

Maxmargin refinement [Moravcik et al., AAAI-16] is similar to Re-solve but goes one step further: it **punishes the opponent as much as possible** for choosing Enter rather than Alt. For each type, define the margin

$$\mathit{Margin}_{\text{Heads}} = EV[\mathit{Alt}_{\text{Heads}}] - EV[\mathit{Enter}_{\text{Heads}}],$$

and solve so as to **maximize the minimum margin** (whereas Re-solve merely tries to make all margins nonnegative). Intuitively, this forces us to push down the Enter value of every opponent type in the augmented subgame as far as possible. In the solution of the Coin Toss example, player 2 guesses Heads with probability $5/8$ and the Forfeit probability drops to $0$; the Heads type's EV for Enter is pushed down to $-0.25$.

But Maxmargin has a problem (the example from the lecture slides): while we concentrate on reducing the Heads type's EV in the subgame to $-0.25$, player 1 with Heads could simply Sell and take $0.5$ — in other words, **the blueprint has already "punished" this type** (her EV for Play in the blueprint is only $0$, far below the $0.5$ from Sell), so spending further solving resources on pushing her down is wasted; those resources should instead be spent suppressing other, more threatening types.

The variant actually used by Libratus is called **Estimated-Maxmargin** [Brown & Sandholm, *Science* 2018]. Its key difference from Maxmargin is the source of the Alt payoff: previous safe refinement techniques (Re-solve, Maxmargin) used an **upper bound** on the opponent's value in the subgame — an upper bound guarantees that the new strategy is no more exploitable than the blueprint, but in practice it is often overly conservative. Estimated-Maxmargin instead uses the **estimate** supplied by the blueprint. Using estimates could in theory make the exploitability slightly higher than the blueprint's, but the excess is precisely controlled by the following theorem:

> **Theorem 1 (cost bound of Estimated-Maxmargin).** Let $\sigma_i$ be a strategy for player $i$ in a two-player zero-sum perfect-recall game, let $S$ be a set of nonoverlapping subgames, and let $\sigma_i^*$ be the least-exploitable strategy that differs from $\sigma_i$ only in the subgames of $S$. Assume that for any subgame in $S$ and any opponent decision point (in poker, any hand), our estimate of the opponent's value in a best response to $\sigma_i^*$ in that subgame is off by at most $\Delta$. Then applying Estimated-Maxmargin subgame solving to any subgame of $S$ reached during play results in an overall strategy whose exploitability is at most $2\Delta$ higher than that of $\sigma_i^*$.

Intuitively: as long as the value estimates provided by the blueprint are accurate enough, real-time subgame solving produces a strategy close to the best strategy within the restricted class "blueprint, modified only inside the reached set of subgames" — and since the blueprint itself is typically still far from an exact equilibrium, this restricted optimum can already be an enormous improvement.

## Reach-maxmargin refinement: reach payoffs and gifts

Reach-maxmargin refinement [Brown & Sandholm, AAAI-17 workshop, NeurIPS-17, *Science*-18] systematizes the observation above: it examines the situation of every opponent type that **reaches** the subgame under the blueprint, taking into account the mistakes the opponent has already made relative to the blueprint.

![The idea of Reach-maxmargin refinement. In the blueprint, player 1's Heads type has EV = 0 for Play, while she could get 0.5 by Selling — if she nevertheless chooses Play, she is "gifting" us 0.5. We can therefore raise the alternative payoff after Heads in the augmented subgame by 0.5: choosing Play there is still a mistake for player 1, so the gadget game solver can concentrate on reducing her EV with the other types she may have.](assets/ch13-libratus-2-4.png)

Concretely, if some type's EV for reaching the subgame in the blueprint is lower than the value she could get elsewhere (in the example, the Heads type's EV for Play is $0$, while Sell yields $0.5$), then the very fact that she reached the subgame means she made a mistake, and the difference of $0.5$ is a **gift** she has given us. We can therefore raise that type's Alt alternative payoff in the augmented subgame accordingly (by $0.5$) — because choosing Play is still a mistake for her, safety is not violated, while the solver of the gadget game (the augmented subgame with the Alt/Enter choice described above) can concentrate its effort on pushing down the EV of the opponent's **other** types. This is exactly the meaning of "Libratus's provably safe subgame solving takes into account the opponent's mistakes in the hand so far."

The paper illustrates the same idea with a canonical poker example [Brown & Sandholm, *Science* 2018]: $2\spadesuit 7\heartsuit$ is the worst starting hand in HUNL, and the correct play is to fold it immediately, ending the hand; entering any subsequent subgame with it is in itself a clear-cut mistake. Yet previous safe subgame-solving techniques required the new strategy to make the opponent no better off in the subgame than in the blueprint **holding every possible hand**, including $2\spadesuit 7\heartsuit$ — an unnecessarily strong constraint: even if the new strategy raised the value of $2\spadesuit 7\heartsuit$ in that subgame slightly, the increase would not outweigh the cost the opponent already paid by reaching the subgame with it (i.e., by not folding). One can therefore allow the value of such "unimportant" types to rise slightly in the subgame, as long as the increase is small enough that reaching the subgame with that type remains a mistake; this is implemented precisely by raising that type's Alt payoff in the augmented subgame by "the cost of the mistake made in reaching the subgame" (the size of the gift).

### Two issues when refining multiple subgames simultaneously

In a real system, multiple subgames are refined at the same time, and Reach-maxmargin needs two fixes:

1. **Off-path EVs no longer remain constant.** Once one subgame is refined, the "EVs in other subgames" assumed by the blueprint change, and the gift accounting breaks down. Solution: **split gifts among subgames according to the probability that each subgame is reached** — each subgame only spends the share of the gift scaled by its own reach probability, so safety is not destroyed by repeatedly overdrafting the same gift.

2. **Gifts may not be as large as we thought.** A gift derives from the blueprint fact that "the opponent plays poorly in certain subgames," but those subgames are themselves continually being refined and improved, so the EV the opponent can actually obtain there gets better and the extractable gift shrinks. Solution: **substitute a lower bound on the gift** for the estimate, erring on the conservative side.

### Medium-scale experiments

The methods were compared by exploitability on two medium-size poker games (within the action abstraction; units are mbb/hand, lower is better; Unsafe turns out to be *more* exploitable than the blueprint on the large game):

| Method | Small game exploitability | Large game exploitability |
|---|---|---|
| Blueprint strategy | 91.3 | 41.4 |
| Unsafe subgame solving | 5.51 | 397 |
| Re-solve refinement | 81.2 | 36.3 |
| Maxmargin refinement | 9.36 | 6.12 |
| Reach-maxmargin refinement | **8.26** | **5.50** |

The unsafe method performs well on the small game but is heavily exploited on the large one; Re-solve is safe but improves little; Maxmargin and Reach-maxmargin push exploitability down by roughly an order of magnitude on both games.

The *Science* paper also reports a comparison on a larger variant with three betting rounds (units mbb/game, one game being one hand): no subgame solving has exploitability $346$, unsafe solving $79.3$, and safe solving $72.6$ [Brown & Sandholm, *Science* 2018]. Across all three variants, safe subgame solving reduced exploitability relative to the blueprint by more than a factor of four in **every** game, while unsafe solving on the large game instead inflated exploitability by almost an order of magnitude (the $397$ in the table above) — the empirical signature of "unsafe methods may be strong on some games and far worse than the blueprint on others." (Note on sources: the five-method comparison above comes from the NeurIPS-17 paper's experiments, whereas Table 1 of the *Science* paper compares only the three categories "none / unsafe / safe"; the blueprint exploitabilities of the large game in the two places are $41.4$ and $41.3$, a rounding difference — we follow the lecture slides here.)

## All the new ideas in the Libratus subgame solver

Taken together, this body of work (NeurIPS-17 best paper award) constitutes the complete set of new ideas in Libratus's subgame solver relative to prior techniques:

- **Provably safe subgame solving that takes into account the opponent's mistakes in the hand so far** (the gift mechanism of Reach-maxmargin);
- Using **estimates** of the opponent's values rather than upper bounds as the Alt payoff (Estimated-Maxmargin); the cost is controlled by Theorem 1 — exploitability at most $2\Delta$ higher than the best strategy that differs from the blueprint only inside the set of subgames;
- **Nested subgame solving** (next section);
- Subgame solving **starts much earlier** (it need not wait for the endgame; it can begin mid-hand);
- **No card abstraction inside the subgame** (the subgame is solved on the full set of card combinations);
- **Changing the action abstraction between hands**, making it hard for the opponent to exploit fixed abstraction holes across hands.

## Nested subgame solving: handling off-tree actions

Both the blueprint and the augmented subgame are solved in an **action abstraction**: bet sizes are discretized. But a real opponent can bet any amount — an action outside the abstracted tree (an off-tree action). The traditional treatment is **action translation**: map the opponent's off-tree bet size to the nearest in-tree bet size and continue [Gilpin, Sandholm & Sørensen, AAMAS-08; Schnizlein et al., IJCAI-09; Ganzfried & Sandholm, IJCAI-13]. The problem is that the opponent can deliberately pick the bet size whose translation is worst for us — the translation itself can be exploited.

The idea of nested subgame solving: **every time the opponent takes an off-tree action, solve a new subgame for that action in real time**, rather than translating the action back into the old tree.

![Nested subgame solving. Left: in the blueprint (action abstraction), player 1's EVs under her in-tree actions are x, y, z; she takes an off-tree action (green arrow). Right: the situation is replaced by a new augmented subgame in which the opponent (P1) chooses between Alt (payoff max(x,y,z), the best EV of her in-tree actions) and Enter (entering the newly solved subgame).](assets/ch13-libratus-2-5.png)

> **Theorem (safety of nested subgame solving).** Suppose the blueprint is an $\epsilon$-equilibrium of the (action) abstraction. If $EV[\mathit{Enter}] \le EV[\mathit{Alt}]$ for every type of player 1, then the resulting strategies form an $\epsilon$-equilibrium of the **new abstraction that includes the new action**.

In other words, every off-tree action we handle leaves us in a larger abstraction (with that action explicitly added) at the same level of equilibrium approximation as the blueprint. The process can be **repeated** for every subsequent off-tree action (typically in finer and finer abstractions), layer upon layer — hence the name nested subgame solving.

The paper makes one detail of the construction explicit: the Alt alternative payoff is the value of the opponent's **best action available within the abstraction**, and this best action can **vary by hand** — that is, the value of the best in-tree action is taken separately for each opponent type, rather than a single maximum over all types [Brown & Sandholm, *Science* 2018]. Intuitively, this makes the new strategy guarantee that "no matter what cards the opponent holds, choosing the off-tree action is no better for her than choosing an in-tree action."

It is worth noting that the authors of DeepStack independently and concurrently proposed **continual re-solving**, a technique similar to nested subgame solving [Moravcik et al., *Science* 2017]. Both compute a response to the opponent's specific bet in real time, and both use estimates rather than upper bounds; but DeepStack does not "de-emphasize types that have already made a mistake" (the Reach gift mechanism), nor does it change the subgame's action abstraction between hands. A further difference is that DeepStack performs depth-limited real-time solving on the first two betting rounds (with values at the depth limit estimated by a neural network), whereas Libratus usually plays directly according to its precomputed blueprint strategy on the first two rounds [Brown & Sandholm, *Science* 2018].

### Medium-scale experiments

On the same medium-size test game, the exploitability of nested subgame solving versus traditional action translation (mbb/hand, lower is better):

| Method | Exploitability |
|---|---|
| Randomized Pseudo-Harmonic Mapping [Ganzfried & Sandholm, IJCAI-13] | 1465 |
| Nested Re-solve refinement | 150.2 |
| Nested Unsafe refinement | 148.3 |
| Nested Maxmargin refinement | 122.0 |
| Nested Reach-maxmargin refinement | **119.1** |

Nested subgame solving reduces exploitability by more than an order of magnitude, with nested Reach-maxmargin the best.

A controlled experiment on full HUNL further quantifies the contribution of nested subgame solving [Brown & Sandholm, *Science* 2018]. The opponent is Baby Tartanian8, the 2016 ACPC champion and previously strongest public HUNL AI (means with 95% confidence intervals, units mbb/game): using only the raw blueprint strategy, Libratus **lost** by $-8 \pm 15$; with post-processing applied to the blueprint (eliminating low-probability actions), it won by $18 \pm 21$; adding nested subgame solving but using only the opponent's in-tree actions, it won by $59 \pm 28$; and with the full nested subgame-solving structure used in the competition, it won by $63 \pm 28$. For comparison, Baby Tartanian8's margins over the second- and third-place AIs in that year's ACPC were only $12 \pm 10$ and $24 \pm 20$. That is, the improvement brought by nested subgame solving (about $71$ mbb/game) is far larger than the generational gap between the previously strongest AIs — a key source of Libratus's superhuman level. (The full Libratus does not use post-processing on the third and fourth betting rounds: eliminating low-probability actions works against non-adjusting AIs but makes the strategy more predictable and increases exploitability.)

## Key Takeaways

- In imperfect-information games, subgames cannot be solved independently: optimal play inside a subgame depends on the reach distribution and counterfactual values, which are endogenously determined by the rest of the game. Libratus's answer is "coarse abstraction for a blueprint + real-time subgame refinement with the blueprint as context" — the most important technique in Libratus.
- **Bayesian subgame solving**: deal types at the root of the augmented subgame according to the blueprint reach distribution; no theoretical guarantee (unsafe), can be heavily exploited on large games.
- **Re-solve refinement**: each opponent type chooses between Enter and Alt (taking the blueprint EV), guaranteeing the opponent's EV for entering the subgame is no higher than in the blueprint — the safety theorem: no more exploitable than the blueprint; but it may miss obvious improvements (such as not forfeiting).
- **Maxmargin refinement**: maximize the minimum margin $\mathit{Margin} = EV[\mathit{Alt}] - EV[\mathit{Enter}]$; its problem is that it wastes solving effort on types the blueprint has already punished.
- **Estimated-Maxmargin refinement** (the variant actually used by Libratus): use the blueprint's estimates instead of upper bounds as the Alt payoff, avoiding excessive conservatism; Theorem 1 guarantees that with estimation error at most $\Delta$, the overall exploitability is at most $2\Delta$ higher than that of the best strategy differing from the blueprint only within the subgame set.
- **Reach-maxmargin refinement**: incorporate the mistakes the opponent already made in reaching the subgame (gifts) into the Alt payoffs; with multiple subgames, split gifts by reach probability and substitute a lower bound on the gift. Experimentally it reduces exploitability by about an order of magnitude relative to the blueprint while remaining safe.
- **Nested subgame solving**: when the opponent takes an off-tree action, solve a new subgame in real time; the theorem guarantees an $\epsilon$-equilibrium is maintained in the new abstraction that includes the new action (given $EV[\mathit{Enter}] \le EV[\mathit{Alt}]$ for all types); reduces exploitability by more than an order of magnitude compared to action translation.
- The full set of new features of the Libratus solver: provably safe solving that accounts for opponent mistakes, nested solving, earlier start, no card abstraction inside subgames, and changing the action abstraction between hands.
