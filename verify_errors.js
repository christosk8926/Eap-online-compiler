const { tokenize, Parser, Interpreter } = require('./core.v2.js');

async function testParsingError() {
    console.log("--- Testing Parsing Error ---");
    const code = `ΑΛΓΟΡΙΘΜΟΣ Test
ΑΡΧΗ
    ΤΥΠΩΣΕ("Hello"
ΤΕΛΟΣ`;

    try {
        const tokens = tokenize(code);
        const parser = new Parser(tokens);
        parser.parse();
    } catch (e) {
        console.log("Caught Error:", e.message);
        if (!e.message.includes("at line 4")) {
             throw new Error("Parsing error missing line number!");
        }
    }
}

async function testRuntimeError() {
    console.log("\n--- Testing Runtime Error ---");
    const code = `ΑΛΓΟΡΙΘΜΟΣ TestRuntime
ΔΕΔΟΜΕΝΑ
    A : ΑΚΕΡΑΙΟΣ;
ΑΡΧΗ
    A := 10;
    ΤΥΠΩΣΕ(UNKNOWN_VAR);
ΤΕΛΟΣ`;

    try {
        const tokens = tokenize(code);
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const interpreter = new Interpreter();
        const result = await interpreter.interpret(ast);
        if (result.error) {
            console.log("Caught Error:", result.error);
             if (!result.error.includes("at line 6")) {
                 throw new Error("Runtime error missing line number!");
            }
        } else {
            console.log("No error occurred (unexpected)!");
        }
    } catch (e) {
        console.log("Caught Exception:", e.message);
    }
}

async function run() {
    await testParsingError();
    await testRuntimeError();
}

run();
