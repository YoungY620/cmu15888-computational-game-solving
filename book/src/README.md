# CMU 15-888 Computational Game Solving

> This book is a faithful condensed rendition of the Carnegie Mellon University course **15-888 Computational Game Solving** (Fall 2025, Prof. Tuomas Sandholm). All content comes exclusively from the course's publicly posted materials: lecture slides, course lecture notes, the per-lecture assigned readings (open-access versions of textbook chapters and papers), and the homework handouts. These are reorganized to mirror the original course structure, with every knowledge point (definitions, theorems, proof ideas, algorithms, complexity bounds) preserved and filler removed. Copyright of the original materials belongs to CMU and the respective authors; this book is for personal study only.
>
> 中文版：点击页面顶部的「中文」按钮。

## About the course

Most real-world strategic settings are multi-step imperfect-information games: negotiation, auctions, poker, security. Such games raise issues beyond perfect-information games like chess and Go: signaling, deception, and understanding deception by others. This course covers the fundamentals and the state of the art of solving them. The progression runs from linear programming and regret minimization, through CFR and its speedups and game abstraction, to the full technology stack of superhuman poker AI (Libratus, Pluribus). Later topics cover frontiers such as deep learning in game solving, team games, and automated mechanism design.

Beyond the slides, each lecture comes with course notes and assigned readings (MAS/AGT textbook chapters and original papers); this book merges the readings' content into the corresponding chapters.

## Contents

| Part | Topics |
|---|---|
| Foundations (L1–L4) | Game representations and solution concepts; tree search, α-β pruning, MCTS and AlphaGo/AlphaZero for perfect-information games; LP solving, FTRL and regret matching for normal-form games |
| Imperfect-Information Games (L5–L11) | Extensive-form games and the construction and convergence of CFR; correlated equilibria and Φ-regret; optimism and last-iterate convergence; CFR speedups (alternation, reweighting, pruning, warm starting); game abstraction (GameShrink, potential-aware, bounded abstraction) |
| Poker AI: State of the Art (L12–L16) | The Libratus trilogy (history and blueprint, subgame solving, self-improver); knowledge-limited subgame solving and fog-of-war chess; Pluribus multiplayer poker |
| Frontiers (L17–L21) | MCCFR, Deep CFR, ESCHER; team games and TB-DAG; automated mechanism design and information design; double oracle, PSRO, AlphaStar and OpenAI Five |
| Homework | HW1: LP equilibrium computation (with programming); HW2: CFR implementation (with programming) |

Note: L20 (guest lecture: game-theoretic LLM training and DeepNash) has no public slides and is not covered; its readings are [Perolat et al., Science 2022](https://www.science.org/doi/10.1126/science.add4679) (DeepNash), [Perolat et al., ICML 2021](https://arxiv.org/abs/2106.00617), and [Sokota et al., ICLR 2023](https://arxiv.org/abs/2206.05825). L22 is the final exam; L23–L26 are student project presentations.

## Original resources

- [CMU 15-888 Fall 2025 course home](https://www.cs.cmu.edu/~sandholm/cs15-888F25/) (slides, notes, homework)
- Companion book: [MIT 15.S50 Poker Theory and Analytics](https://youngy620.github.io/mit15s50-poker-theory/) (introductory; the poker background for this course)
