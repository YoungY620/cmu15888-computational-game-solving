<!-- escape-math: v1 -->
# L12 Libratus I: History and Match Setup

This lecture introduces Libratus, the first AI to outperform top human professionals in two-player no-limit Texas hold'em [Brown & Sandholm, *Science* 2018]. This chapter covers the background: why imperfect-information games are hard, the history of poker AI, the design and results of the man–machine match, and Libratus's overall architecture together with its blueprint strategy module. The two other core modules (subgame solving and the self-improver) are the subjects of the next two chapters.

## Perfect-Information versus Imperfect-Information Games

AlphaGo's success showed that techniques based on search and machine learning can reach superhuman level in perfect-information games such as Go. In principle, these techniques extend to other perfect-information games (for example, the positions arising from opening systems such as the Sicilian Defense or the Queen's Gambit in chess). A key property of perfect-information games is that **subgames can be solved independently using only information from within the subgame**: this is precisely what makes AlphaGo-style search and value backup work.

In imperfect-information games this property no longer holds. Players cannot observe the full state, and optimal play in a "subgame" depends on the probability distribution with which the subgame is reached, which in turn depends on the strategy in the rest of the game. Subgames therefore cannot be solved in isolation from the whole. This is the starting point of the entire technical thread of this course, and the central difficulty that Libratus had to overcome.

### Example: The Coin Toss Game

Consider the following toy game. Chance (denoted C) tosses a coin that lands Heads or Tails with probability $0.5$ each, and the outcome is revealed only to player 1. Player 1 may either Sell (ending the game and collecting a sure payoff tied to her type) or Play. If player 1 plays, player 2, without knowing the coin outcome, guesses Heads or Tails, and may also Forfeit. As shown below, the numbers at the leaves are player 1's payoff: $-1$ if player 2 guesses the coin correctly, $+1$ if he guesses wrong, and $+1$ if player 2 forfeits.

![Game tree of the Coin Toss game. The two P1 nodes lie in two separate information sets of player 1 (she knows the coin outcome); the two P2 nodes lie in a single information set (player 2 does not). The triangles denote the subgames reached by the Sell action.](assets/ch12-libratus-1-01.png)

Note that player 2's two decision nodes are joined by a dashed line into one information set: he does not know whether the coin came up Heads or Tails, and so cannot distinguish the two nodes. Later chapters return to this example repeatedly: treating the part of the tree after Sell as a "subgame" to be re-solved in isolation is exactly the test bed for the various subgame-solving techniques.

In imperfect-information games, the rational solution concept remains the Nash equilibrium:

> **Definition (Nash equilibrium and $\epsilon$-Nash equilibrium).** A Nash equilibrium is a strategy profile in which no player can improve her expected utility by unilaterally deviating (beliefs are derived from the strategies via Bayes' rule). Nash equilibrium is robust. An $\epsilon$-Nash equilibrium requires only that no player can improve **by more than $\epsilon$** by deviating.

In the Coin Toss game, the equilibrium strategies are mixed: player 1 Sells with probability $0.5$ and Plays with probability $0.5$ under both types, and player 2 guesses Heads or Tails in a $0.5:0.5$ ratio.

### Tackling Imperfect-Information Games

The value of this line of research goes far beyond poker itself: negotiations, business strategy, security interactions, auctions, and almost all real-world strategic interactions involve hidden information and are naturally modeled as imperfect-information games, whereas perfect information is rare in practice [Brown & Sandholm, IJCAI-17].

Unlike perfect-information games, what is needed here are **application-independent techniques that algorithmically construct the strategy**. There are two main challenges:

- uncertainty about what the other players and chance will do;
- the presence of hidden state, which forces one to interpret the signals released by opponents' actions. This is exactly why game theory is needed: the meaning of a signal is itself endogenously determined by the equilibrium.

## Poker: A Recognized Challenge Problem in Game Theory and AI

Poker has a long history as a challenge problem in game theory and artificial intelligence: [Nash 1950], [Kuhn 1950], [Newman 1959], [Waterman 1970], [Zadeh 1977], [Caro 1984], [Pfeffer & Koller 1995], [Billings et al. 1998], [Schaeffer et al. 1999], [Shi & Littman 2001], and [Billings et al. 2003] all studied poker or simplified forms of it. Progress accelerated dramatically after 2005:

- Rhode Island Hold'em, a simplified poker game with $10^9$ nodes, was solved [Gilpin & Sandholm 2005];
- the Annual Computer Poker Competition (ACPC) ran from 2006 to 2018;
- limit Texas hold'em (about $10^{13}$ decision points) was near-optimally solved [Bowling et al. 2015].

### Heads-Up No-Limit Texas Hold'em

Before Libratus, heads-up no-limit Texas hold'em (HUNL) had long been **the main benchmark and challenge problem** for AI in imperfect-information games:

- it has $10^{161}$ situations, dozens of orders of magnitude larger than the solved limit version (the number is computed for the standard version of the game: both players have \\$20{,}000, i.e., 200-big-blind deep stacks, and bets are restricted to dollar increments) [Brown & Sandholm, IJCAI-17];
- it is played mostly on the Internet, and also features in the World Series of Poker, the NBC Heads-Up Championship, and films such as *Casino Royale* and *Rounders*;
- it has been called the "purest form of poker";
- no prior AI had beaten top humans.

**Rules**: chance deals 2 private cards to each player, followed by a round of betting; chance deals 3 shared cards (the flop), a round of betting; chance deals 1 shared card (the turn), a round of betting; chance deals 1 final shared card (the river), a last round of betting. "No-limit" means that at any point a player may bet any amount up to going all-in, which makes the action space essentially continuous and forces the use of abstraction.

## The Brains vs AI Rematch: Experimental Setup

In January 2017, Libratus played a match called the "Brains vs AI Rematch" against four of the best heads-up no-limit Texas hold'em specialist pros (all top-10 specialists in this game [Brown & Sandholm, IJCAI-17]):

- 120,000 hands over 20 days;
- \\$200,000 in prize money divided among the four pros based on performance;
- a **conservative experiment design that favored the humans**, to make the conclusion as convincing as possible.

![The four top human professionals who played against Libratus](assets/ch12-libratus-1-02.png)

The "favor-the-humans" design comprised a long list of specific arrangements:

- **Large sample size**: 120,000 hands to guarantee statistical power;
- the humans got to choose: the number of playing days, break days, times of day, and breaks between sessions (even dynamically); two tabling; a 4-color deck; hot keys (adjustable dynamically); specific high-resolution monitors and their own mice; Twitch chat on or off; and, within each pair of pros, whether to play in public or in private;
- 200-big-blind deep stacks;
- the AI made no use of timing tells; the action history was displayed; and every evening the **complete hand histories, including hands the opponent folded, were given to both sides**;
- the humans were allowed to: use computers and any programs for analysis; collaborate and coordinate (except within each hand); get outside help (e.g., Doug Polk); think as long as they wanted; and have mis-clicked hands canceled.

### Final Result

Libratus beat the top humans by a large margin:

- a win rate of **147 mbb/hand** (milli-big-blinds per hand, thousandths of a big blind per hand);
- statistical significance of $99.98\\%$ (i.e., $p = 0.0002$);
- **each** of the four humans lost to Libratus individually.

### Follow-up Experiment: Why Game-Theoretic AI Beats Machine Learning

The lecture specifically discussed why a game-theoretic AI is better suited than the machine-learning route for this class of problems:

1. **It requires no data**: the strategy is computed by an algorithm directly from the rules of the game;
2. **it does not assume that the opponent will continue to behave the same way as in the past**;
3. **it is not exploitable**: even an opponent who knows our strategy in advance gains nothing.

Point 3 is backed by a controlled experiment: Libratus played 36,000 hands against 6 Chinese poker players (among them a WSOP bracelet winner, with expertise in computer science and machine learning, who had **studied Libratus's hand histories in advance**). The AI won by 220 mbb/hand, won all 9 sessions, and beat every player individually. This shows that the approach is not frail. The minmax theorem guarantees non-exploitability only for an exact Nash equilibrium, and the experiment showed that the property carries over to **computational approximations** of equilibrium, in contrast to the adversarial exploits discovered against machine-learning approaches in Go, DOTA2, and StarCraft II.

## The Overall Architecture of Libratus

Libratus consists of three modules (shown below); the full technical report is [Brown & Sandholm, *Science* 2018]:

1. **Abstraction + equilibrium finding**: compress the rules of the game into a smaller abstract game and compute a **blueprint strategy** in it;
2. **subgame solver**: during play, re-solve the currently reached subgame in real time in a finer abstraction (the subject of the next chapter);
3. **self-improver**: identify the holes in the blueprint that opponents exploit most often, compute new action abstractions for the corresponding parts of the game tree, and patch them (the subject of Chapter 14).

![The three-module architecture of Libratus: abstraction and equilibrium finding applied to the rules of the game produce the blueprint strategy; the subgame solver refines play in real time using the blueprint as context; the self-improver produces new action abstractions for parts of the game, which feed back into the blueprint module.](assets/ch12-libratus-1-03.png)

### Abstraction in Libratus

**Abstracting chance's actions (the cards).** Abstraction is feasible because many situations are strategically similar and can be treated identically at only a small cost. For example, there is little difference between betting \\$500 and \\$501, so there is no need to compute a separate strategy for each [Brown & Sandholm, IJCAI-17]. Libratus uses the same algorithm as Tartanian8 [Brown, Ganzfried & Sandholm, AAMAS-15], that is, a distributed version of the state-of-the-art state-abstraction algorithm for centralized equilibrium finding presented in class: the computation is distributed across nodes (blades) according to the public flop cards, so that any one sample always stays within a single compute node. The abstraction, however, is much finer:

- 1st and 2nd betting rounds: no card abstraction;
- 3rd betting round: 55 million card histories compressed into 2.5 million buckets;
- 4th betting round: 2.4 billion card histories compressed into 1.25 million buckets.

Overall, abstraction takes the game from $10^{161}$ decision points down to about $10^{12}$ [Brown & Sandholm, IJCAI-17]. Solving this abstract game yields a **detailed strategy for the first two betting rounds** and a **coarse blueprint for the last two**; the coarse abstraction of the later rounds is acceptable because, whenever actual play reaches the third round, the AI never acts according to the blueprint there; instead the subgame solver (next chapter) re-solves a fine-grained strategy in real time, using the blueprint as context.

**Abstracting the players' actions (bet sizes).** At any point in the game there are nearly $20{,}000$ possible bet sizes, and the abstraction keeps only a handful of them for each side [Brown & Sandholm, IJCAI-17]. The bet sizes were largely based on what top humans and AIs commonly use (concretely, by analyzing the most common actions taken by prior top AIs in the ACPC [Brown & Sandholm, IJCAI-17]). Some radical bet sizes were added, and some of the bet sizes in the early parts of the tree were optimized with the parameter-optimization method of [Brown & Sandholm, AAAI-14], converging to a locally optimal set of bet sizes. An **asymmetric abstraction** was also used: the opponent is given more available actions than the agent itself, to better reduce the error caused by action translation (i.e., rounding an opponent's bet that is not in the abstraction to a nearby size that is) [Bard et al. 2014; Brown & Sandholm, IJCAI-17].

### The Equilibrium-Finding Algorithm

The blueprint equilibrium finder is an improvement on Monte-Carlo Counterfactual Regret Minimization (MCCFR [Lanctot et al., NIPS-09]). MCCFR is an iterative algorithm: each iteration traverses a sampled portion of the game tree and independently minimizes regret at every decision point encountered; if both players play according to MCCFR in a two-player zero-sum game, their average strategies provably converge to a Nash equilibrium [Brown & Sandholm, IJCAI-17]. Libratus's improvements over vanilla MCCFR:

- **visit less often the paths where our own actions do not look promising** (in the spirit of the Brown & Sandholm NIPS-15 paper and AAAI-17 workshop paper), that is, a sampled form of **Regret-Based Pruning (RBP)**: paths with very negative regret for the player being updated on the current iteration are visited less often [Brown & Sandholm, IJCAI-17], yielding a significant speedup and thereby enabling larger, finer-grained abstractions to be solved;
- as a side effect, the imperfect-recall abstraction effectively becomes **finer grained**: as some paths are de-emphasized, the **effective in-degree** of abstract states decreases, mitigating the inherent downsides of imperfect-recall abstraction and improving solution quality [Brown & Sandholm, IJCAI-17];
- the computation is distributed across $1 + 195$ compute nodes, partitioning work along the structure of the game tree rather than in an "embarrassingly parallel" fashion.

### System Scale: The Bridges Supercomputer

Libratus ran on the Bridges supercomputer (architected by Hewlett Packard Enterprise and the Pittsburgh Supercomputing Center, about \\$17 million including running costs over its lifetime, heterogeneous architecture):

- it used part of the 800 HPE Apollo 2000 servers, each with 28 cores and 128 GB RAM (but only 14 of the 28 cores per node were used, because that was fastest);
- official usage for Libratus was about 24 million core-hours from January 2016 to January 2017, making the team the largest user of Bridges in that timeframe (about half of its total usage);
- blueprint runs typically used $1 + 195$ nodes and took about 1–8 weeks per run; each subgame solver used 50 nodes and 30–60 seconds per run; each self-improver run used 196–600 nodes for 8–30 hours;
- the implementation is C++, with OpenMP for parallelism within each server and MPI for distributed communication between nodes;
- 2.6 PB of disk storage (multiple strategies, snapshots), with nodes connected by Intel Omni-Path and an Intel Lustre file system;
- during the competition the system spanned three locations connected over the Internet: a front end running in a browser inside Rivers Casino, a poker server on a Dell rack server at CMU, and the AI running on Bridges at the Pittsburgh Supercomputing Center (in an industrial basement in Monroeville).

The paper [Brown & Sandholm, IJCAI-17] gives a different accounting of the compute budget: building Libratus took about 25 million core-hours in total, of which about 13 million went to exploratory experiments and evaluation, about 6 million to the initial abstraction and equilibrium finding, and about 3 million each to nested subgame solving and the self-improvement algorithm. Both the equilibrium-finding and self-improvement algorithms ran on 196 nodes on Bridges. (This differs slightly from the official ~24-million-core-hour figure quoted on the slides; both are given here for the record.)

## The Lineage of Top Poker AIs and How Libratus Plays

The figure below shows the relative strength of the top AIs before and after Libratus (head-to-head win rates are annotated on the arrows):

![Head-to-head strength of the top poker AIs. Left, the CMU series: Tartanian7 (5/2014, ACPC 2014 winner), Claudico (4/2015), Baby Tartanian8 (12/2015, ACPC 2016 winner), Tartanian8 (12/2015), Modicum [NeurIPS-18], Libratus (1/2017); right, other teams' agents: Slumbot (12/2015), DeepStack (12/2016), and Supremus [2020].](assets/ch12-libratus-1-04.png)

Features of Libratus's play observed by the human professionals (strengths):

- small bets, huge bets, and huge all-ins; multiple bet sizes in any one situation;
- "limping" and "donk betting," which are rare in the conventional human arsenal;
- "perfect balance" and mixed strategies;
- it maintains probability distributions over the players' hands, rather than reasoning only in terms of "ranges";
- near-perfect subgame play and great use of "blockers";
- different bet sizings used in different subgames.

As for weaknesses: Libratus does **no opponent exploitation**: it plays an approximate equilibrium strategy and does not attempt to identify and exploit the tendencies of a particular opponent. This also answers the question of whether safe (equilibrium) play is timid or boring: in Libratus's hands, equilibrium play proved extremely aggressive.

## Key Takeaways

- In perfect-information games subgames can be solved independently; in imperfect-information games they cannot; this is the root of every technical difficulty. The rational solution concepts are the Nash equilibrium and the $\epsilon$-Nash equilibrium.
- Poker has been a challenge problem for game theory and AI since Nash (1950); limit Texas hold'em ($10^{13}$ decision points) was essentially solved in 2015, while in heads-up no-limit Texas hold'em ($10^{161}$ situations) no AI had beaten top humans before Libratus.
- Brains vs AI Rematch (January 2017): Libratus against four top pros, 120,000 hands over 20 days, with a deliberately conservative, human-favoring experiment design; Libratus won by 147 mbb/hand with statistical significance $p = 0.0002$, and every human lost.
- The 36,000-hand experiment against the Chinese players (who had studied Libratus's hand histories in advance) was won by 220 mbb/hand, showing that the approximate equilibrium strategy is likewise unexploitable in practice, in contrast to the fragility of machine-learning approaches.
- Libratus = blueprint module (abstraction + equilibrium finding, producing the blueprint strategy) + subgame solver + self-improver; abstraction compresses $10^{161}$ decision points down to about $10^{12}$; the blueprint gives a detailed strategy for the first two rounds and a coarse one for the last two, with the later rounds re-solved in real time by the subgame solver; subgame solving and the self-improver are the subjects of the next two chapters.
- Engineering scale: about 24 million core-hours on the Bridges supercomputer; blueprint runs of $1 + 195$ nodes for 1–8 weeks; C++ / OpenMP / MPI; 2.6 PB of storage.

> **Note on the availability of the assigned reading.** This chapter's assigned reading, Brown & Sandholm, *Science* 2018 ("Superhuman AI for heads-up no-limit poker: Libratus beats top professionals", DOI: 10.1126/science.aao1733), is paywalled, and no usable preprint was found on the authors' institutional or personal sites. The readings merged into this chapter therefore draw on open-access versions by the same authors: the IJCAI-17 paper "Libratus: The Superhuman AI for No-Limit Poker" ([official ijcai.org proceedings](https://www.ijcai.org/proceedings/2017/0772.pdf)) and the extended abstract in the NSF public access repository ([par.nsf.gov](https://par.nsf.gov/servlets/purl/10077470)); both share their content with the *Science* version.
