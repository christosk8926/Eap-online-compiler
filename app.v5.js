// -----------------------------------------------------------------------------
// UI AND EXECUTION
// -----------------------------------------------------------------------------

const EXAMPLES = {
    HELLO: `ΑΛΓΟΡΙΘΜΟΣ Hello
ΑΡΧΗ
    ΤΥΠΩΣΕ("Hello World")
ΤΕΛΟΣ`,
    FIBONACCI: `ΑΛΓΟΡΙΘΜΟΣ Fibonacci
ΔΕΔΟΜΕΝΑ
    N, A, B, TEMP, I : ΑΚΕΡΑΙΟΣ;
ΑΡΧΗ
    ΤΥΠΩΣΕ("Δώσε αριθμό όρων:")
    ΔΙΑΒΑΣΕ(N)
    A := 0;
    B := 1;
    ΤΥΠΩΣΕ(A)
    ΤΥΠΩΣΕ(B)
    ΓΙΑ I := 3 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        TEMP := A + B;
        ΤΥΠΩΣΕ(TEMP);
        A := B;
        B := TEMP
    ΓΙΑ-ΤΕΛΟΣ
ΤΕΛΟΣ`,
    BUBBLE_SORT: `ΑΛΓΟΡΙΘΜΟΣ BubbleSort
ΣΤΑΘΕΡΕΣ N = 5;
ΔΕΔΟΜΕΝΑ A: ARRAY[1..N] OF INTEGER; I, J, TEMP: INTEGER;
ΑΡΧΗ
    /* Είσοδος */
    ΓΙΑ I:=1 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        A[I] := (N - I + 1) * 10
    ΓΙΑ-ΤΕΛΟΣ;

    /* Ταξινόμηση */
    ΓΙΑ I:=2 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        ΓΙΑ J:=N ΕΩΣ I ΜΕ ΒΗΜΑ -1 ΕΠΑΝΑΛΑΒΕ
            ΕΑΝ A[J-1] > A[J] ΤΟΤΕ
                TEMP := A[J-1];
                A[J-1] := A[J];
                A[J] := TEMP
            ΕΑΝ-ΤΕΛΟΣ
        ΓΙΑ-ΤΕΛΟΣ
    ΓΙΑ-ΤΕΛΟΣ;

    /* Εκτύπωση */
    ΓΙΑ I:=1 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        ΤΥΠΩΣΕ(A[I])
    ΓΙΑ-ΤΕΛΟΣ
ΤΕΛΟΣ`,
    AVERAGE: `ΑΛΓΟΡΙΘΜΟΣ Average
ΔΕΔΟΜΕΝΑ
    SUM, COUNT, NUM : ΠΡΑΓΜΑΤΙΚΟΣ;
ΑΡΧΗ
    SUM := 0;
    COUNT := 0;
    ΤΥΠΩΣΕ("Δώσε αριθμούς (0 για τέλος):")
    ΕΠΑΝΑΛΑΒΕ
        ΔΙΑΒΑΣΕ(NUM);
        ΕΑΝ NUM <> 0 ΤΟΤΕ
            SUM := SUM + NUM;
            COUNT := COUNT + 1
        ΕΑΝ-ΤΕΛΟΣ
    ΜΕΧΡΙ NUM = 0;
    
    ΕΑΝ COUNT > 0 ΤΟΤΕ
        ΤΥΠΩΣΕ("Μέσος Όρος:", SUM / COUNT)
    ΑΛΛΙΩΣ
        ΤΥΠΩΣΕ("Δεν δόθηκαν αριθμοί.")
    ΕΑΝ-ΤΕΛΟΣ
ΤΕΛΟΣ`
};

document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const highlighting = document.getElementById('highlighting');
    const highlightingContent = document.getElementById('highlighting-content');
    const lineNumbers = document.getElementById('line-numbers');
    const runButton = document.getElementById('run-button');
    const saveButton = document.getElementById('save-button');
    const clearButton = document.getElementById('clear-button');
    const exampleSelector = document.getElementById('example-selector');
    const themeToggle = document.getElementById('theme-toggle');

    // Terminal Elements
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInputLine = document.getElementById('terminal-input-line');
    const terminalInput = document.getElementById('terminal-input');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const outputContainer = document.querySelector('.output-container');
    const dragHandle = document.getElementById('drag-handle');

    // -----------------------------------
    // SETTINGS MANAGER
    // -----------------------------------
    const SettingsManager = {
        get: (key, defaultValue) => {
            try {
                const val = localStorage.getItem(key);
                return val !== null ? val : defaultValue;
            } catch (e) {
                console.warn('LocalStorage access failed:', e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('LocalStorage write failed:', e);
            }
        }
    };

    // -----------------------------------
    // SYNTAX HIGHLIGHTING
    // -----------------------------------
    const escapeHTML = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const updateHighlighting = () => {
        const text = codeEditor.value;
        let html = '';

        try {
            // Use core.js tokenize function but strictly for highlighting (lenient mode if possible?)
            // Our tokenizer throws errors on unknown chars. We should catch them and treat as plain text.
            // But tokenize returns an array. We need to reconstruct the string with tags.
            // Actually, rebuilding from tokens might lose whitespace if not careful.
            // The tokenizer skips whitespace! This is bad for highlighting which needs to preserve exact layout.
            // We need a Lexer that preserves whitespace or just a regex-based highlighter for visual only.

            // Since `tokenize` skips whitespace, we can't use it directly for full reconstruction easily
            // without modifying it to return whitespace tokens.
            // Let's implement a simple regex-based highlighter here for the UI layer.

            // Simple Tokenizer for Highlighting
            const tokenPatterns = [
                { type: 'token-comment', regex: /\/\*[\s\S]*?\*\/|\/\/.*/g },
                { type: 'token-string', regex: /"[^"]*"/g },
                { type: 'token-number', regex: /\b\d+(\.\d+)?\b/g },
                // Use unicode flag 'u' to make \b work correctly with Greek characters if supported, or avoid \b for Greek.
                // In many browsers \b does not work well with non-ASCII.
                // Let's remove \b for Greek keywords or use a better boundary check.
                // Or just match the words.
                { type: 'token-keyword', regex: /(?:^|[^a-zA-Z\d\u0370-\u03ff_])(ΑΛΓΟΡΙΘΜΟΣ|ΣΤΑΘΕΡΕΣ|ΔΕΔΟΜΕΝΑ|ΑΡΧΗ|ΤΕΛΟΣ|ΕΑΝ|ΤΟΤΕ|ΑΛΛΙΩΣ|ΕΑΝ-ΤΕΛΟΣ|ΓΙΑ|ΕΩΣ|ΜΕ|ΒΗΜΑ|ΕΠΑΝΑΛΑΒΕ|ΓΙΑ-ΤΕΛΟΣ|ΕΝΟΣΩ|ΕΝΟΣΩ-ΤΕΛΟΣ|ΜΕΧΡΙ|ΤΥΠΩΣΕ|ΔΙΑΒΑΣΕ|ΥΠΟΛΟΓΙΣΕ|ΔΙΑΔΙΚΑΣΙΑ|ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ|ΣΥΝΑΡΤΗΣΗ|ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ|ΕΠΙΣΤΡΕΨΕ|ΑΚΕΡΑΙΟΣ|ΠΡΑΓΜΑΤΙΚΟΣ|ΛΟΓΙΚΟΣ|ΧΑΡΑΚΤΗΡΑΣ|ΣΥΜΒΟΛΟΣΕΙΡΑ|ALGORITHM|CONSTANTS|DATA|BEGIN|END|IF|THEN|ELSE|END_IF|FOR|TO|STEP|REPEAT|END_FOR|WHILE|END_WHILE|UNTIL|PRINT|READ|CALCULATE|PROCEDURE|END_PROCEDURE|FUNCTION|END_FUNCTION|RETURN|INTEGER|REAL|BOOLEAN|CHAR|STRING)(?=[^a-zA-Z\d\u0370-\u03ff_]|$)/gi },
                { type: 'token-operator', regex: /:=|\+|-|\*|\/|<>|<=|>=|<|>|=|:|;|,|\.|\[|\]|\(|\)/g }
            ];

            let lastIndex = 0;
            // We need to match tokens and preserve everything else.
            // A simple way is to split by regex capturing groups, but JS regex `exec` is safer for iteration.

            // Combine patterns? Order matters. Comments/Strings first.
            // We can't easily combine properly without a loop.
            // Let's use a simplified approach: iterate through text and match longest token.

            // Or simpler: replace strict tokens with spans. But replacing inside string is tricky.
            // Let's just wrap valid tokens.

            // For now, let's treat the text as a sequence of potential tokens.
            // We will scan character by character or try to match at current position.

            let i = 0;
            while (i < text.length) {
                let match = null;
                let matchType = '';
                let matchLength = 0;
                let matchText = '';

                // Try patterns
                for (const p of tokenPatterns) {
                    p.regex.lastIndex = i;
                    // For the custom regex we used (?:^|...) it might match a prefix char.
                    // But we want to start exactly at i, or handle the prefix.
                    // Our complex regex (?:^|[^...])(KEYWORD) matches the prefix too if it's there.
                    // But since we iterate char by char, we usually are at a boundary or not.
                    // If we are at the start of the word, the previous char was already consumed.
                    // So we are at `^` effectively relative to "rest of string"? No.
                    // Sticky flag 'y' is what we want, but complex support varies.

                    // Simpler approach: Check substring?

                    // Let's rely on exec finding it at i.
                    // If our regex has a lookbehind-like prefix `(?:^|[^...])`, it will match the previous char if we are not at 0.
                    // But we have already processed the previous char.
                    // So this regex approach is tricky for sequential processing.

                    // Revised approach: simplified regexes without complex boundaries, assuming we tokenize properly.
                    // But `\b` failed for Greek.
                    // Let's use `match` and check logic manually?

                    // Or, since we want to be safe:
                    // Just match from current position.

                    // If we use specific keywords, we can check if `text.substr(i)` starts with them AND is followed by boundary.
                }

                // Actually, let's fix the logic. The regex `(?:^|[^...])` matches a character BEFORE the keyword.
                // If we are at `i`, that character is at `i-1`.
                // But we are processing `i`.
                // So we should only look for the keyword starting at `i`.
                // And check the boundary at `i-1` manually.

                const isBoundary = (idx) => {
                     if (idx < 0 || idx >= text.length) return true;
                     const c = text[idx];
                     return /[^a-zA-Z\d\u0370-\u03ff_]/.test(c);
                };

                // Pattern without boundaries, check boundaries manually
                const keywords = ["ΑΛΓΟΡΙΘΜΟΣ","ΣΤΑΘΕΡΕΣ","ΔΕΔΟΜΕΝΑ","ΑΡΧΗ","ΤΕΛΟΣ","ΕΑΝ","ΤΟΤΕ","ΑΛΛΙΩΣ","ΕΑΝ-ΤΕΛΟΣ","ΓΙΑ","ΕΩΣ","ΜΕ","ΒΗΜΑ","ΕΠΑΝΑΛΑΒΕ","ΓΙΑ-ΤΕΛΟΣ","ΕΝΟΣΩ","ΕΝΟΣΩ-ΤΕΛΟΣ","ΜΕΧΡΙ","ΤΥΠΩΣΕ","ΔΙΑΒΑΣΕ","ΥΠΟΛΟΓΙΣΕ","ΔΙΑΔΙΚΑΣΙΑ","ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ","ΣΥΝΑΡΤΗΣΗ","ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ","ΕΠΙΣΤΡΕΨΕ","ΑΚΕΡΑΙΟΣ","ΠΡΑΓΜΑΤΙΚΟΣ","ΛΟΓΙΚΟΣ","ΧΑΡΑΚΤΗΡΑΣ","ΣΥΜΒΟΛΟΣΕΙΡΑ","ALGORITHM","CONSTANTS","DATA","BEGIN","END","IF","THEN","ELSE","END_IF","FOR","TO","STEP","REPEAT","END_FOR","WHILE","END_WHILE","UNTIL","PRINT","READ","CALCULATE","PROCEDURE","END_PROCEDURE","FUNCTION","END_FUNCTION","RETURN","INTEGER","REAL","BOOLEAN","CHAR","STRING"];

                // 1. Check Keywords
                // Must be at boundary
                if (isBoundary(i - 1)) {
                    for (const kw of keywords) {
                        if (text.substr(i, kw.length).toUpperCase() === kw && isBoundary(i + kw.length)) {
                            // Match found
                             if (!match || kw.length > matchLength) {
                                matchText = text.substr(i, kw.length); // Preserve case
                                matchLength = kw.length;
                                matchType = 'token-keyword';
                                match = true;
                            }
                        }
                    }
                }

                // 2. Check other patterns
                // Comments
                const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*/y;
                commentRegex.lastIndex = i;
                let m = commentRegex.exec(text);
                if (m && (!match || m[0].length > matchLength)) {
                     match = true; matchType = 'token-comment'; matchText = m[0]; matchLength = m[0].length;
                }

                // Strings
                const stringRegex = /"[^"]*"/y;
                stringRegex.lastIndex = i;
                m = stringRegex.exec(text);
                 if (m && (!match || m[0].length > matchLength)) {
                     match = true; matchType = 'token-string'; matchText = m[0]; matchLength = m[0].length;
                }

                // Numbers
                const numberRegex = /\b\d+(\.\d+)?\b/y; // \b works for numbers usually
                numberRegex.lastIndex = i;
                m = numberRegex.exec(text);
                 if (m && (!match || m[0].length > matchLength)) {
                     match = true; matchType = 'token-number'; matchText = m[0]; matchLength = m[0].length;
                }

                // Operators
                // Sort operators by length desc to match ':=' before ':'
                const operators = [":=", "+", "-", "*", "/", "<>", "<=", ">=", "<", ">", "=", ":", ";", ",", ".", "[", "]", "(", ")"];
                for (const op of operators) {
                     if (text.startsWith(op, i)) {
                         if (!match || op.length > matchLength) {
                             match = true; matchType = 'token-operator'; matchText = op; matchLength = op.length;
                         }
                     }
                }

                if (match) {
                    html += `<span class="${matchType}">${escapeHTML(matchText)}</span>`;
                    i += matchLength;
                } else {
                    html += escapeHTML(text[i]);
                    i++;
                }
            }

            // Handle trailing newline for textarea match
            if (text[text.length - 1] === '\n') {
                html += ' ';
            }

        } catch (e) {
            html = escapeHTML(text);
        }

        highlightingContent.innerHTML = html;
    };

    const updateLineNumbers = () => {
        const lines = codeEditor.value.split('\n').length;
        lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).map(n => `<div class="line-num">${n}</div>`).join('');
    };

    const syncScroll = () => {
        highlighting.scrollTop = codeEditor.scrollTop;
        highlighting.scrollLeft = codeEditor.scrollLeft;
        lineNumbers.scrollTop = codeEditor.scrollTop;
    };

    const onInput = () => {
        updateHighlighting();
        updateLineNumbers();
    };

    codeEditor.addEventListener('input', onInput);
    codeEditor.addEventListener('scroll', syncScroll);

    // Initial update
    updateLineNumbers();
    updateHighlighting();

    // Enable Tab key support
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeEditor.selectionStart;
            const end = codeEditor.selectionEnd;
            codeEditor.value = codeEditor.value.substring(0, start) + "\t" + codeEditor.value.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + 1;
            onInput();
        }
    });

    // Example Selector
    exampleSelector.addEventListener('change', (e) => {
        const key = e.target.value;
        if (EXAMPLES[key]) {
            codeEditor.value = EXAMPLES[key];
            onInput();
        }
    });

    // -----------------------------------
    // TERMINAL & EXECUTION
    // -----------------------------------
    const clearErrorHighlights = () => {
        const lineNums = document.querySelectorAll('.line-num');
        lineNums.forEach(el => el.classList.remove('error-line'));
    };

    const highlightErrorLine = (errorMsg) => {
        // Updated regex to support both "line X" (old) and "Line: X" (new)
        const match = errorMsg.match(/Line:? (\d+)/i) || errorMsg.match(/line (\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const lineElement = lineNumbers.children[line - 1];
            if (lineElement) {
                lineElement.classList.add('error-line');
            }
        }
    };

    const printToTerminal = (text, type = 'output') => {
        const line = document.createElement('div');
        line.textContent = text;
        line.className = `term-${type}`;
        terminalOutput.appendChild(line);

        // Scroll the window container, not the output div
        scrollToBottom();
    };

    const scrollToBottom = () => {
        const terminalWindow = document.getElementById('terminal-window');
        if (terminalWindow) {
            // Use setTimeout to ensure DOM update is complete before scrolling
            setTimeout(() => {
                terminalWindow.scrollTop = terminalWindow.scrollHeight;
            }, 0);
        }
    };

    const clearTerminal = () => {
        terminalOutput.innerHTML = '';
        terminalInputLine.style.display = 'none';
    };

    // Async Input Provider
    const inputProvider = (promptMsg) => {
        return new Promise((resolve) => {
            printToTerminal(promptMsg, 'info');
            terminalInputLine.style.display = 'flex';
            // Scroll again because displaying the input line changes scrollHeight
            scrollToBottom();
            terminalInput.value = '';
            terminalInput.focus();

            const handleEnter = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = terminalInput.value;
                    terminalInputLine.style.display = 'none';
                    terminalInput.removeEventListener('keydown', handleEnter);
                    printToTerminal(`> ${val}`, 'input-echo');
                    resolve(val);
                }
            };

            terminalInput.addEventListener('keydown', handleEnter);
        });
    };

    runButton.addEventListener('click', async () => {
        const pseudocode = codeEditor.value;
        clearTerminal();
        clearErrorHighlights();
        printToTerminal('Compiling...', 'info');

        try {
            // Use timeout to allow UI to update if sync parsing is slow, though parsing is usually fast.
            // But interpret is now async.
            const tokens = tokenize(pseudocode);
            const parser = new Parser(tokens);
            const ast = parser.parse();

            printToTerminal('Running...', 'info');

            const interpreter = new Interpreter();
            interpreter.setInputProvider(inputProvider);
            interpreter.setOutputCallback((text) => {
                printToTerminal(text, 'output');
            });

            const result = await interpreter.interpret(ast);

            if (result.error) {
                 printToTerminal(`\nExecution Error: ${result.error}`, 'error');
                 highlightErrorLine(result.error);
            } else {
                 printToTerminal('\nExecution finished.', 'success');
            }

        } catch (error) {
            printToTerminal(`\nCompilation Error: ${error.message}`, 'error');
            highlightErrorLine(error.message);
            console.error(error);
        }
    });

    // -----------------------------------
    // CONTROLS (Save & Clear)
    // -----------------------------------
    saveButton.addEventListener('click', () => {
        const code = codeEditor.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pseudocode.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    clearButton.addEventListener('click', () => {
        if (confirm('Είστε σίγουροι ότι θέλετε να καθαρίσετε τον κώδικα;')) {
            codeEditor.value = '';
            onInput(); // Update highlighting and line numbers
            exampleSelector.value = ""; // Reset selector
        }
    });

    // -----------------------------------
    // DARK MODE
    // -----------------------------------
    const applyTheme = (isDark) => {
        const theme = isDark ? 'dark' : 'light';
        // Set on documentElement to match inline script logic
        document.documentElement.setAttribute('data-theme', theme);
        // Also set on body just in case, but html is preferred for variables
        document.body.setAttribute('data-theme', theme);

        themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        SettingsManager.set('theme', theme);

        // Update Home Link to pass theme state via URL (Reverse Sync)
        const homeLink = document.getElementById('home-link');
        if (homeLink) {
            homeLink.href = `index.html?theme=${theme}`;
        }
    };

    // Initialize from current state (set by inline script) or storage
    const currentTheme = document.documentElement.getAttribute('data-theme') || SettingsManager.get('theme', 'light');
    let isDarkMode = currentTheme === 'dark';

    // Update UI to match
    applyTheme(isDarkMode);

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyTheme(isDarkMode);
    });

    // -----------------------------------
    // TERMINAL RESIZING & FOCUS LOGIC
    // -----------------------------------
    const MIN_TERMINAL_HEIGHT = '150px';
    const DEFAULT_EXPANDED_HEIGHT = '40vh';

    // Get saved expanded height or default
    let preferredHeight = SettingsManager.get('terminalExpandedHeight', DEFAULT_EXPANDED_HEIGHT);

    const expandTerminal = () => {
        outputContainer.style.height = preferredHeight;
    };

    const collapseTerminal = () => {
        outputContainer.style.height = MIN_TERMINAL_HEIGHT;
    };

    // Initial State: Collapsed or Expanded?
    // Maybe start expanded if it was saved?
    // For now, let's start with preferred height if it exists, else default.
    outputContainer.style.height = preferredHeight;

    // Events for dynamic resizing
    codeEditor.addEventListener('focus', collapseTerminal);
    document.querySelector('.editor-container').addEventListener('click', collapseTerminal);

    outputContainer.addEventListener('click', expandTerminal);
    terminalInput.addEventListener('focus', expandTerminal);

    // Run button expands terminal to show output
    runButton.addEventListener('click', expandTerminal);


    // Resizing Logic
    let isResizing = false;

    dragHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const containerRect = document.querySelector('.container').getBoundingClientRect();
        const newHeight = containerRect.bottom - e.clientY;
        const maxHeight = containerRect.height * 0.8;

        if (newHeight > 100 && newHeight < maxHeight) {
            outputContainer.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // When user manually resizes, that becomes the new "Preferred" height
            preferredHeight = outputContainer.style.height;
            SettingsManager.set('terminalExpandedHeight', preferredHeight);
        }
    });
});
