# 🎲 diceTable — Fair Non-Transitive Dice Game with HMAC

A secure, command-line non-transitive dice game built in **Node.js**, ensuring fairness through cryptographically provable random number generation using **HMAC**.

---

## 🔐 Fairness Using HMAC & Collaborative Randomness

This game uses **collaborative randomness**: every critical value (first move, user roll, computer roll) is determined by:
- A value from the **user**
- A secret value from the **computer**
- An **HMAC commitment** from the computer to ensure it cannot change its choice later

### How It Works

Each step of the game (who goes first, dice rolls) involves:

1. **Computer** generates a random number `x` ∈ [0, 5] and a secret key `k`
2. Calculates `HMAC(k, x)` and displays it to the user
3. **User** selects a value `y` ∈ [0, 5]
4. Result is computed as `(x + y) % 6` (or `% faceCount` if not 6)
5. The computer reveals `x` and `k`, and the user can verify the fairness by recomputing the HMAC

This ensures the **computer cannot cheat**, because it commits its value *before* knowing yours.

---

## 🎮 How the Game Works

1. Game is launched via CLI with 3 or more dice passed as arguments (each with 6 comma-separated integers)
2. A **secure and fair HMAC-backed protocol** determines who selects dice first
3. Each player selects a different die
4. Dice rolls are done using fair collaborative randomness
5. Results are shown with full transparency and verifiability

---

## 📊 Dice Probabilities

Before the game begins, a styled table shows the **probability that one die beats another**, based on face value distributions.

| Die    | Faces               |
|--------|---------------------|
| Die A  | [2, 2, 4, 4, 9, 9]  |
| Die B  | [1, 1, 6, 6, 8, 8]  |
| Die C  | [3, 3, 5, 5, 7, 7]  |

You can pass **any integer face values**, and **any number of dice** (3+ required).

---

## ✅ Features Checklist

| Feature                                                                    | Supported |
|-----------------------------------------------------------------------------|----------|
| CLI input of 3+ dice (6 comma-separated integers each)                    | ✅         |
| Dice configuration passed via command-line args (not from user input)     | ✅         | 
| Friendly error messages with helpful usage examples                       | ✅         |
| HMAC-based randomness with `crypto.randomBytes`                           | ✅         |
| Collaborative randomness for dice selection, user roll, and computer roll | ✅         |
| Computer commits secret value using HMAC before user input                | ✅         |
| CLI dice selection menu (with help/exit options)                          | ✅         |
| Probability matrix with stylized headers                                  | ✅         |
| Support for arbitrary face counts (not just 6)                            | ✅         |
| Modular architecture (Dice, DiceSet, ProbabilityCalculator, etc.)         | ✅         |

---

## 🛠 Requirements

- Node.js (v14 or newer)
- npm (comes bundled with Node.js)

---

## 🚀 How to Run

```bash
# Clone the repository
git clone https://github.com/bazanadriana/diceTable.git
cd diceTable

# Run the game with at least 3 dice passed as arguments
node diceTable.js 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7