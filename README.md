# 🟣 EAP Online Compiler (Pseudo-Language Interpreter)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Stack: Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AI Assisted](https://img.shields.io/badge/Built%20With-GenAI%20%7C%20Gemini-8E75B2.svg)](https://deepmind.google/technologies/gemini/)
[![Context](https://img.shields.io/badge/University-Hellenic%20Open%20University-blue.svg)](https://www.eap.gr/)

<p align="center">
  <a href="#-english-version"><strong>[ 🇬🇧 English Version ]</strong></a> | 
  <a href="#-ελληνική-έκδοση"><strong>[ 🇬🇷 Ελληνική Έκδοση ]</strong></a>
</p>

---

<div id="english"></div>

## 🇬🇧 English Version

> **Human vs Machine:** This project was born out of frustration. The official university compiler was a legacy Windows-only executable that often failed on modern systems. I built this to give every student—regardless of OS—a working tool. To ship it fast, I used **AI-Orchestrated Engineering**.

### 🎯 The Motivation: Fixing the "Windows-Only" Bottleneck
Students at the Hellenic Open University (EAP) struggled with the official pseudo-code interpreter (`plh10.exe`).
* ❌ It was **Windows-only**, excluding macOS and Linux users.
* ❌ It required local installation and configuration.
* ❌ It was prone to crashes and lacked modern debugging features.

**The Solution:** I reverse-engineered the language specifications and built a **Web-Based Interpreter** that runs on any device, right in the browser.

### ⚙️ The "AI-First" Workflow
To solve this urgent problem quickly without mastering the nuances of JS parsers first, I leveraged AI:

#### 1. Data Ingestion (The "Dirty" Work) 🤖
* **Input:** Unstructured University PDF textbooks containing syntax rules.
* **Tool:** **Gemini CLI**.
* **Process:** I fed the PDFs to the LLM and prompted it to extract the formal grammar (BNF-style) and generate the core **Tokenizer** and **Parser** logic.

#### 2. The Human Touch (Architecture & UI) 👨‍💻
* **Role:** Product Engineer.
* **Task:** AI handled the parsing logic, but I designed the **Cyberpunk/Dark Mode** UI to make coding pleasant. I ensured the architecture supported specific memory features (Global vs Local scope) that the official tool often mishandled.

#### 3. Integration (The App Layer) 🚀
* **Tool:** **Google Jules / AI Assistants**.
* **Task:** Wiring the logic into a reactive Web App, ensuring 100% client-side execution for privacy and speed.

### ⚡ Features
* **Cross-Platform:** Works on Chrome, Firefox, Safari, Edge (Desktop & Mobile).
* **Core Structure:** Supports `ALGORITHM`, `BEGIN`, `END`.
* **Memory Management:** Pass by Value & Pass by Reference (`%` symbol).
* **Control Flow:** `IF`, `FOR`, `WHILE`, `REPEAT`.
* **I/O:** Custom `PRINT` and `READ` (Prompt-based).
* **Better Debugging (v1.2):** Reports specific **Line & Column** of errors (unlike the generic errors of the official tool).

### 🚀 Quick Start
1.  **Clone** this repository.
2.  Navigate to the `frontend` folder.
3.  Open `index.html` in **any** browser.
4.  Start coding immediately.

---

<div id="greek"></div>

## 🇬🇷 Ελληνική Έκδοση

> **Human vs Machine:** Αυτό το project γεννήθηκε από ανάγκη. Ο επίσημος compiler του ΕΑΠ ήταν ένα παλιό εκτελέσιμο αρχείο (.exe) που απέκλειε χρήστες macOS/Linux και συχνά δυσλειτουργούσε. Έφτιαξα αυτό το εργαλείο για να δώσω λύση σε όλους τους φοιτητές, χρησιμοποιώντας **AI-Orchestrated Engineering** για ταχύτητα.

### 🎯 Το Κίνητρο: Πέρα από το plh10.exe
Πολλοί φοιτητές στην ενότητα ΠΛΗ10 αντιμετώπιζαν προβλήματα με το επίσημο λογισμικό:
* ❌ Λειτουργούσε **μόνο σε Windows**.
* ❌ Απαιτούσε εγκατάσταση.
* ❌ Είχε φτωχό error reporting.

**Η Λύση:** Ένας **Web-Based Interpreter** που τρέχει παντού (κινητά, tablet, Mac, PC) χωρίς καμία εγκατάσταση.

### ⚙️ Η Διαδικασία Ανάπτυξης (AI Workflow)
Για να παραδώσω τη λύση γρήγορα, χωρίς να είμαι Expert στην JavaScript, χρησιμοποίησα το AI ως "Μηχανή":

#### 1. Ανάλυση Δεδομένων (Gemini CLI) 🤖
Τροφοδότησα τα PDF της ύλης στο Gemini για να εξάγει τους κανόνες γραμματικής και να γράψει τον κώδικα για τον **Tokenizer** και τον **Parser**.

#### 2. Σχεδιασμός & UI (Human Touch) 👨‍💻
Σχεδίασα το UI από το μηδέν (HTML/CSS) με Dark Mode αισθητική. Διόρθωσα τη λογική διαχείρισης μνήμης (εμβέλεια μεταβλητών) ώστε να είναι πιο αξιόπιστη από το επίσημο εργαλείο.

#### 3. Ενορχήστρωση (Integration) 🚀
Χρησιμοποίησα εργαλεία όπως το **Google Jules** για να συνδέσω τα κομμάτια σε ένα ενιαίο Web App που τρέχει τοπικά στον browser.

### ⚡ Χαρακτηριστικά
* **Cross-Platform:** Τρέχει παντού.
* **Πλήρης Υποστήριξη:** `ΑΛΓΟΡΙΘΜΟΣ`, `Πίνακες`, `ΔΙΑΔΙΚΑΣΙΕΣ`.
* **Διαχείριση Μνήμης:** Αναφορά (`%`) και Τιμή.
* **Debugging (v1.2):** Εμφάνιση σφαλμάτων με ακρίβεια Γραμμής/Στήλης (κάτι που έλειπε από το επίσημο εργαλείο).

### 🚀 Οδηγίες Χρήσης
1.  Κατεβάστε τα αρχεία.
2.  Ανοίξτε το αρχείο `index.html` με οποιονδήποτε browser.
3.  Γράψτε ψευδοκώδικα και πατήστε "Εκτέλεση".

---

### 🛠️ Tech Stack
* **Language:** Vanilla JavaScript (ES6+).
* **Frontend:** HTML5, CSS3.
* **Tools:** Google Gemini CLI, Google Jules.

### 🤝 Contributing
Αν είσαι φοιτητής του ΕΑΠ και θέλεις να βελτιώσουμε κι άλλο το εργαλείο:
1.  Κάνε **Fork** το repo.
2.  Δημιούργησε Pull Request.

---
*Developed by **Christos Kataxenos** | [LinkedIn](https://www.linkedin.com/in/christoskataxenos/)*
