const { tokenize, Parser } = require('./core.v2.js');

const code = `ΑΛΓΟΡΙΘΜΟΣ Test
ΑΡΧΗ
    ΤΥΠΩΣΕ("Hello"
ΤΕΛΟΣ`;

try {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    parser.parse();
} catch (e) {
    console.log("Caught Error Message:", e.message);
}
