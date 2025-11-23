const { tokenize, Parser } = require('./core.v2.js');

const code = `ΑΛΓΟΡΙΘΜΟΣ AssignmentError
ΔΕΔΟΜΕΝΑ
    A: ARRAY[1..5] OF INTEGER;
    J, TEMP: INTEGER;
ΑΡΧΗ
    A[J] = TEMP;
ΤΕΛΟΣ`;

try {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    parser.parse();
} catch (e) {
    console.log("Caught Error Message:", e.message);
    if (!e.message.includes("[Line: 6, Col: 10]")) {
        throw new Error("Expected new format error message!");
    }
}
