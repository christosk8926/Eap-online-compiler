
const { tokenize, Parser, Interpreter, Environment } = require('../core.v5.js');
const assert = require('assert');

// Helper to run code and check output
async function runCode(code, inputs = []) {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();

    let inputIndex = 0;
    interpreter.setInputProvider(async (promptMsg) => {
        if (inputIndex < inputs.length) {
            return inputs[inputIndex++];
        }
        return null;
    });

    return await interpreter.interpret(ast);
}

async function testHello() {
    const code = `ΑΛΓΟΡΙΘΜΟΣ Hello
ΑΡΧΗ
    ΤΥΠΩΣΕ("Hello World")
ΤΕΛΟΣ`;
    const result = await runCode(code);
    assert.strictEqual(result.output.trim(), "Hello World");
    console.log("testHello passed");
}

async function testArithmetic() {
    const code = `ΑΛΓΟΡΙΘΜΟΣ Arithmetic
    ΔΕΔΟΜΕΝΑ A, B : ΑΚΕΡΑΙΟΣ;
    ΑΡΧΗ
        A := 10;
        B := 3;
        ΤΥΠΩΣΕ(A + B);
        ΤΥΠΩΣΕ(A - B);
        ΤΥΠΩΣΕ(A * B);
        ΤΥΠΩΣΕ(A DIV B);
        ΤΥΠΩΣΕ(A MOD B);
    ΤΕΛΟΣ`;
    const result = await runCode(code);
    const lines = result.output.trim().split('\n');
    assert.strictEqual(lines[0].trim(), "13");
    assert.strictEqual(lines[1].trim(), "7");
    assert.strictEqual(lines[2].trim(), "30");
    assert.strictEqual(lines[3].trim(), "3"); // 10 DIV 3 = 3
    assert.strictEqual(lines[4].trim(), "1"); // 10 MOD 3 = 1
    console.log("testArithmetic passed");
}

async function testIf() {
    const code = `ΑΛΓΟΡΙΘΜΟΣ TestIf
    ΔΕΔΟΜΕΝΑ X : ΑΚΕΡΑΙΟΣ;
    ΑΡΧΗ
        X := 5;
        ΕΑΝ X > 3 ΤΟΤΕ
            ΤΥΠΩΣΕ("Greater")
        ΑΛΛΙΩΣ
            ΤΥΠΩΣΕ("Smaller")
        ΕΑΝ-ΤΕΛΟΣ
    ΤΕΛΟΣ`;
    const result = await runCode(code);
    assert.strictEqual(result.output.trim(), "Greater");
    console.log("testIf passed");
}

async function testLoop() {
    const code = `ΑΛΓΟΡΙΘΜΟΣ TestLoop
    ΔΕΔΟΜΕΝΑ I : ΑΚΕΡΑΙΟΣ;
    ΑΡΧΗ
        ΓΙΑ I := 1 ΕΩΣ 5 ΕΠΑΝΑΛΑΒΕ
            ΤΥΠΩΣΕ(I)
        ΓΙΑ-ΤΕΛΟΣ
    ΤΕΛΟΣ`;
    const result = await runCode(code);
    const lines = result.output.trim().split('\n');
    assert.strictEqual(lines.length, 5);
    assert.strictEqual(lines[0].trim(), "1");
    assert.strictEqual(lines[4].trim(), "5");
    console.log("testLoop passed");
}

async function testCaseInsensitive() {
    const code = `Αλγόριθμος TestCase
    Δεδομένα x : Ακέραιος;
    Αρχή
        x := 10;
        Τύπωσε(x)
    Τέλος`;
    const result = await runCode(code);
    assert.strictEqual(result.output.trim(), "10");
    console.log("testCaseInsensitive passed");
}

async function testRead() {
    const code = `ΑΛΓΟΡΙΘΜΟΣ TestRead
    ΔΕΔΟΜΕΝΑ X : ΑΚΕΡΑΙΟΣ;
    ΑΡΧΗ
        ΔΙΑΒΑΣΕ(X);
        ΤΥΠΩΣΕ(X * 2);
    ΤΕΛΟΣ`;
    const result = await runCode(code, ["21"]);
    // Output includes the input echoed? Based on my implementation in core.js:
    // this.outputBuffer.push(input);
    // So output will be "21\n42"
    const lines = result.output.trim().split('\n');
    assert.strictEqual(lines[0].trim(), "21");
    assert.strictEqual(lines[1].trim(), "42");
    console.log("testRead passed");
}

async function testBubbleSort() {
    // Using the example code
    const code = `ΑΛΓΟΡΙΘΜΟΣ BubbleSort
ΣΤΑΘΕΡΕΣ N = 5;
ΔΕΔΟΜΕΝΑ A: ARRAY[1..N] OF INTEGER; I, J, TEMP: INTEGER;
ΑΡΧΗ
    /* Είσοδος - Reverse order */
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
ΤΕΛΟΣ`;
    const result = await runCode(code);
    const lines = result.output.trim().split('\n');
    // Expected: 10, 20, 30, 40, 50
    assert.strictEqual(lines[0].trim(), "10");
    assert.strictEqual(lines[1].trim(), "20");
    assert.strictEqual(lines[2].trim(), "30");
    assert.strictEqual(lines[3].trim(), "40");
    assert.strictEqual(lines[4].trim(), "50");
    console.log("testBubbleSort passed");
}

(async () => {
    try {
        await testHello();
        await testArithmetic();
        await testIf();
        await testLoop();
        await testCaseInsensitive();
        await testRead();
        await testBubbleSort();
        console.log("All tests passed!");
    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    }
})();
