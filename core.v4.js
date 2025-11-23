// -----------------------------------------------------------------------------
// TOKENIZER
// -----------------------------------------------------------------------------
const TokenType = { ALGORITHM: 'ALGORITHM', CONSTANTS: 'CONSTANTS', DATA: 'DATA', BEGIN: 'BEGIN', END: 'END', IF: 'IF', THEN: 'THEN', ELSE: 'ELSE', FOR: 'FOR', TO: 'TO', STEP: 'STEP', REPEAT: 'REPEAT', WHILE: 'WHILE', UNTIL: 'UNTIL', ARRAY: 'ARRAY', OF: 'OF', TYPES: 'TYPES', PRINT: 'PRINT', READ: 'READ', CALCULATE: 'CALCULATE', PROCEDURE: 'PROCEDURE', FUNCTION: 'FUNCTION', INTERFACE: 'INTERFACE', INPUT: 'INPUT', OUTPUT: 'OUTPUT', MOD: 'MOD', DIV: 'DIV', AND: 'AND', OR: 'OR', NOT: 'NOT', EOLN: 'EOLN', POINTER: 'POINTER', LIST: 'LIST', INTEGER_TYPE: 'INTEGER_TYPE', REAL_TYPE: 'REAL_TYPE', BOOLEAN_TYPE: 'BOOLEAN_TYPE', CHAR_TYPE: 'CHAR_TYPE', STRING_TYPE: 'STRING_TYPE', ASSIGN: 'ASSIGN', PLUS: 'PLUS', MINUS: 'MINUS', MULTIPLY: 'MULTIPLY', DIVIDE: 'DIVIDE', EQUALS: 'EQUALS', LESS_THAN: 'LESS_THAN', GREATER_THAN: 'GREATER_THAN', LESS_EQUALS: 'LESS_EQUALS', GREATER_EQUALS: 'GREATER_EQUALS', NOT_EQUALS: 'NOT_EQUALS', LEFT_PAREN: 'LEFT_PAREN', RIGHT_PAREN: 'RIGHT_PAREN', LEFT_BRACKET: 'LEFT_BRACKET', RIGHT_BRACKET: 'RIGHT_BRACKET', COMMA: 'COMMA', COLON: 'COLON', SEMICOLON: 'SEMICOLON', DOT: 'DOT', CARET: 'CARET', PERCENT: 'PERCENT', NUMBER: 'NUMBER', STRING: 'STRING', IDENTIFIER: 'IDENTIFIER', EOF: 'EOF',
END_IF: 'END_IF', END_FOR: 'END_FOR', END_WHILE: 'END_WHILE', END_PROCEDURE: 'END_PROCEDURE', END_FUNCTION: 'END_FUNCTION' };

const GREEK_KEYWORDS = {'ΑΛΓΟΡΙΘΜΟΣ': TokenType.ALGORITHM,'ΣΤΑΘΕΡΕΣ': TokenType.CONSTANTS,'ΔΕΔΟΜΕΝΑ': TokenType.DATA,'ΑΡΧΗ': TokenType.BEGIN,'ΤΕΛΟΣ': TokenType.END,'ΕΑΝ': TokenType.IF,'ΤΟΤΕ': TokenType.THEN,'ΑΛΛΙΩΣ': TokenType.ELSE,'ΓΙΑ': TokenType.FOR,'ΕΩΣ': TokenType.TO,'ΜΕ': TokenType.STEP,'ΒΗΜΑ': TokenType.STEP,'ΕΠΑΝΑΛΑΒΕ': TokenType.REPEAT,'ΕΝΟΣΩ': TokenType.WHILE,'ΜΕΧΡΙ': TokenType.UNTIL,'ΤΥΠΟΙ': TokenType.TYPES,'ΤΥΠΩΣΕ': TokenType.PRINT,'ΔΙΑΒΑΣΕ': TokenType.READ,'ΥΠΟΛΟΓΙΣΕ': TokenType.CALCULATE,'ΔΙΑΔΙΚΑΣΙΑ': TokenType.PROCEDURE,'ΔΙΑΔΙΚΑΣΙΑΣ': TokenType.PROCEDURE,'ΣΥΝΑΡΤΗΣΗ': TokenType.FUNCTION,'ΣΥΝΑΡΤΗΣΗΣ': TokenType.FUNCTION,'ΔΙΕΠΑΦΗ': TokenType.INTERFACE,'ΕΙΣΟΔΟΣ': TokenType.INPUT,'ΕΞΟΔΟΣ': TokenType.OUTPUT,'ΑΚΕΡΑΙΟΣ': TokenType.INTEGER_TYPE,'ΠΡΑΓΜΑΤΙΚΟΣ': TokenType.REAL_TYPE,'ΛΟΓΙΚΟΣ': TokenType.BOOLEAN_TYPE,'ΧΑΡΑΚΤΗΡΑΣ': TokenType.CHAR_TYPE,'ΣΥΜΒΟΛΟΣΕΙΡΑ': TokenType.STRING_TYPE,'ΚΑΙ': TokenType.AND,'Ή': TokenType.OR,'ΟΧΙ': TokenType.NOT,
'ΕΑΝ-ΤΕΛΟΣ': TokenType.END_IF, 'ΓΙΑ-ΤΕΛΟΣ': TokenType.END_FOR, 'ΕΝΟΣΩ-ΤΕΛΟΣ': TokenType.END_WHILE, 'ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ': TokenType.END_PROCEDURE, 'ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ': TokenType.END_FUNCTION};
const ENGLISH_KEYWORDS = {'ARRAY': TokenType.ARRAY,'OF': TokenType.OF,'MOD': TokenType.MOD,'DIV': TokenType.DIV,'AND': TokenType.AND,'OR': TokenType.OR,'NOT': TokenType.NOT,'EOLN': TokenType.EOLN,'POINTER': TokenType.POINTER,'LIST': TokenType.LIST,'IF': TokenType.IF,'THEN': TokenType.THEN,'ELSE': TokenType.ELSE,'FOR': TokenType.FOR,'TO': TokenType.TO,'STEP': TokenType.STEP,'REPEAT': TokenType.REPEAT,'WHILE': TokenType.WHILE,'UNTIL': TokenType.UNTIL,'INTEGER': TokenType.INTEGER_TYPE,'REAL': TokenType.REAL_TYPE,'BOOLEAN': TokenType.BOOLEAN_TYPE,'CHAR': TokenType.CHAR_TYPE,'STRING': TokenType.STRING_TYPE};
const KEYWORDS = { ...GREEK_KEYWORDS, ...ENGLISH_KEYWORDS };
const OPERATORS = {':=': TokenType.ASSIGN,'+': TokenType.PLUS,'-': TokenType.MINUS,'*': TokenType.MULTIPLY,'/': TokenType.DIVIDE,'=': TokenType.EQUALS,'<': TokenType.LESS_THAN,'>': TokenType.GREATER_THAN,'<=': TokenType.LESS_EQUALS,'>=': TokenType.GREATER_EQUALS,'<>': TokenType.NOT_EQUALS,'(': TokenType.LEFT_PAREN,')': TokenType.RIGHT_PAREN,'[': TokenType.LEFT_BRACKET,']': TokenType.RIGHT_BRACKET,',': TokenType.COMMA,':': TokenType.COLON,';': TokenType.SEMICOLON,'.': TokenType.DOT,'^': TokenType.CARET, '%': TokenType.PERCENT};
function isLetter(char) { return (char >= '\u0386' && char <= '\u03ce') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'); }
function isDigit(char) { return char >= '0' && char <= '9'; }
function removeAccents(str) { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function tokenize(code) {
    let tokens = [];
    let current = 0;
    let line = 1;
    let column = 1;
    while (current < code.length) {
        let char = code[current];
        if (/\s/.test(char)) {
            if (char === '\n') { line++; column = 1; } else { column++; }
            current++; continue;
        }
        if (char === '/' && code[current + 1] === '/') {
            while (current < code.length && code[current] !== '\n') current++; continue;
        }
        if (char === '/' && code[current + 1] === '*') {
            current += 2;
            while (current < code.length && (code[current] !== '*' || code[current + 1] !== '/')) {
                if (code[current] === '\n') { line++; column = 1; } else { column++; }
                current++;
            }
            if(current < code.length) {current += 2; column += 2;} continue;
        }
        if (char === '"') {
            let value = ''; current++;
            while (current < code.length && code[current] !== '"') { value += code[current++]; }
            current++;
            tokens.push({ type: TokenType.STRING, value, line, column });
            column += value.length + 2; continue;
        }
        if (isDigit(char)) {
            let value = '';
            while (current < code.length && isDigit(code[current])) { value += code[current++]; }
            if (code[current] === '.' && isDigit(code[current + 1])) {
                value += code[current++];
                while (current < code.length && isDigit(code[current])) { value += code[current++]; }
            }
            tokens.push({ type: TokenType.NUMBER, value: parseFloat(value), line, column });
            column += value.length; continue;
        }
        let twoCharOp = code.substring(current, current + 2);
        if (OPERATORS[twoCharOp]) {
            tokens.push({ type: OPERATORS[twoCharOp], value: twoCharOp, line, column });
            current += 2; column += 2; continue;
        }
        if (OPERATORS[char]) {
            tokens.push({ type: OPERATORS[char], value: char, line, column });
            current++; column++; continue;
        }
        if (isLetter(char) || char === '_' || char === '-') {
            let value = '';
            let start = current;
            // Read until non-identifier char
            while (current < code.length && (isLetter(code[current]) || isDigit(code[current]) || code[current] === '_' || code[current] === '-')) {
                value += code[current++];
            }

            const upperValue = KEYWORDS[removeAccents(value.toUpperCase())];
            if (upperValue) {
                tokens.push({ type: upperValue, value: value.toUpperCase(), line, column });
            } else {
                // If not a keyword, check if it contains dashes. If so, it might be an identifier minus something.
                // We split at the first dash if it's not a keyword.
                const dashIndex = value.indexOf('-');
                if (dashIndex !== -1) {
                    // Backtrack
                    const firstPart = value.substring(0, dashIndex);
                    // If first part is empty (e.g. "-something"), then the dash was the start.
                    // But our loop condition `isLetter` ensures we start with letter.
                    // Actually loop condition `isLetter(char)` ensures `value` starts with letter.
                    // So `firstPart` will be non-empty.

                    // Emit identifier for first part
                    tokens.push({ type: TokenType.IDENTIFIER, value: firstPart, line, column });

                    // Reset current to after first part (which is the dash position)
                    current = start + dashIndex;
                    // Don't increment current, next loop will see '-' and handle it as operator.

                    // Adjust column for next token? No, column calc is approximate here or we need to be precise.
                    // Since we pushed a token, we should update column by its length.
                    column += firstPart.length;
                    continue;
                }

                tokens.push({ type: TokenType.IDENTIFIER, value, line, column });
            }
            column += value.length; continue;
        }
        throw new Error(`Unexpected character '${char}' at line ${line}, column ${column}`);
    }
    tokens.push({ type: TokenType.EOF, value: 'EOF', line, column });
    return tokens;
}

// -----------------------------------------------------------------------------
// PARSER
// -----------------------------------------------------------------------------

class Parser {
    constructor(tokens) { this.tokens = tokens; this.current = 0; }
    isAtEnd() { return this.peek().type === TokenType.EOF; }
    peek() { return this.tokens[this.current]; }
    previous() { return this.tokens[this.current - 1]; }
    advance() { if (!this.isAtEnd()) this.current++; return this.previous(); }

    // Helper to throw error with location info
    error(message, token) {
        token = token || this.peek();
        const locationInfo = `[Line: ${token.line}, Col: ${token.column}]`;
        throw new Error(message ? `${message} ${locationInfo}` : `Error ${locationInfo}`);
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        const token = this.peek();
        const locationInfo = `[Line: ${token.line}, Col: ${token.column}]`;
        // Standardize consume error message
        throw new Error(message ? `${message} ${locationInfo}` : `Expected token of type ${type} but got ${token.type} ('${token.value}') ${locationInfo}`);
    }

    check(type) { if (this.isAtEnd()) return false; return this.peek().type === type; }
    match(...types) { for (const type of types) { if (this.check(type)) { this.advance(); return true; } } return false; }
    parse() { return this.parseProgram(); }

    // Helper to attach location to AST node
    attachLoc(node) {
        // We can attach start location.
        // A better approach is to wrap parsing methods, but manual attachment is safer for now.
        // We can use this.peek() before parsing for start, and this.previous() after for end.
        // For simplicity, let's just store the start line/col of the primary token.
        // Actually, we should call this inside the parse methods.
        return node;
    }

    parseProgram() {
        const startToken = this.peek();
        this.consume(TokenType.ALGORITHM, "A program must start with 'ΑΛΓΟΡΙΘΜΟΣ'.");
        const name = this.consume(TokenType.IDENTIFIER, "Expected algorithm name.").value;
        const declarations = this.parseDeclarations();

        while(this.check(TokenType.PROCEDURE) || this.check(TokenType.FUNCTION)) {
            if (this.match(TokenType.PROCEDURE)) {
                declarations.push(this.parseProcedureDeclaration());
            } else if (this.match(TokenType.FUNCTION)){
                declarations.push(this.parseFunctionDeclaration());
            }
        }

        this.consume(TokenType.BEGIN, "Expected 'ΑΡΧΗ' for the main program body.");
        const body = this.parseBlock();
        this.consume(TokenType.END, "A program must end with 'ΤΕΛΟΣ'.");
        return { type: 'Program', name, declarations, body, loc: { line: startToken.line, column: startToken.column } };
    }

    parseProcedureDeclaration() {
        const startToken = this.peek();
        const name = this.consume(TokenType.IDENTIFIER, "Expected procedure name.").value;
        const params = [];
        if (this.match(TokenType.LEFT_PAREN)) {
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.PERCENT)) {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'reference'});
                    } else {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'value'});
                    }
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after procedure parameters.");
        }
        this.parseInterfaceBlock();
        const localDeclarations = this.parseDeclarations();
        this.consume(TokenType.BEGIN, `Expected 'ΑΡΧΗ' for procedure '${name}'.`);
        const body = this.parseBlock();
        this.consume(TokenType.END_PROCEDURE, `Expected 'ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ' for procedure '${name}'.`);
        return { type: 'ProcedureDeclaration', name, params, declarations: localDeclarations, body, loc: { line: startToken.line, column: startToken.column } };
    }

    parseFunctionDeclaration() {
        const startToken = this.peek();
        const name = this.consume(TokenType.IDENTIFIER, "Expected function name.").value;
        const params = [];
         if (this.match(TokenType.LEFT_PAREN)) {
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.PERCENT)) {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'reference'});
                    } else {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'value'});
                    }
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after function parameters.");
        }
        this.consume(TokenType.COLON, "Expected ':' for function return type.");
        const returnType = this.parseType();
        this.parseInterfaceBlock();
        const localDeclarations = this.parseDeclarations();
        this.consume(TokenType.BEGIN, `Expected 'ΑΡΧΗ' for function '${name}'.`);
        const body = this.parseBlock();
        this.consume(TokenType.END_FUNCTION, `Expected 'ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ' for function '${name}'.`);
        return { type: 'FunctionDeclaration', name, params, returnType, declarations: localDeclarations, body, loc: { line: startToken.line, column: startToken.column } };
    }

    parseInterfaceBlock() {
        if (!this.match(TokenType.INTERFACE)) return;
        while(!this.check(TokenType.DATA) && !this.check(TokenType.BEGIN) && !this.isAtEnd()) {
            this.advance();
        }
    }

    parseDeclarations() { const declarations = []; while (true) { if (this.match(TokenType.CONSTANTS)) { declarations.push(...this.parseConstantDeclarations()); } else if (this.match(TokenType.TYPES)) { while(!this.check(TokenType.DATA) && !this.check(TokenType.BEGIN) && !this.isAtEnd() && !this.check(TokenType.PROCEDURE) && !this.check(TokenType.FUNCTION)) this.advance(); } else if (this.match(TokenType.DATA)) { declarations.push(...this.parseVariableDeclarations()); } else { break; } } return declarations; }
    parseConstantDeclarations() { const consts = []; while (this.check(TokenType.IDENTIFIER)) { const name = this.consume(TokenType.IDENTIFIER, "Expected constant name.").value;
        this.consume(TokenType.EQUALS, "Expected '=' after constant name.");
        const value = this.parseExpression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after constant declaration.");
        consts.push({ type: 'ConstantDeclaration', name, value });
    } return consts; }
    parseVariableDeclarations() { const vars = []; while (this.check(TokenType.IDENTIFIER)) { const names = [this.consume(TokenType.IDENTIFIER, "Expected variable name.").value]; while(this.match(TokenType.COMMA)) { names.push(this.consume(TokenType.IDENTIFIER, "Expected variable name after comma.").value); }
        this.consume(TokenType.COLON, "Expected ':' after variable name(s).");
        const varType = this.parseType();
        this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration.");
        for(const name of names) { vars.push({ type: 'VariableDeclaration', name, varType }); }
    } return vars; }

    parseType() {
        if (this.match(TokenType.INTEGER_TYPE, TokenType.REAL_TYPE, TokenType.BOOLEAN_TYPE, TokenType.CHAR_TYPE, TokenType.STRING_TYPE)) {
            return { type: 'DataType', name: this.previous().type };
        }
        if (this.match(TokenType.ARRAY)) {
            const dimensions = [];
            this.consume(TokenType.LEFT_BRACKET, "Expected '[' after ARRAY.");
            do {
                const from = this.parseExpression();
                this.consume(TokenType.DOT, "Expected '..' range separator in array declaration.");
                this.consume(TokenType.DOT, "Expected '..' range separator in array declaration.");
                const to = this.parseExpression();
                dimensions.push({ from, to });
            } while (this.match(TokenType.COMMA));
            this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array dimensions.");
            this.consume(TokenType.OF, "Expected 'OF' after array declaration.");
            const ofType = this.parseType();
            return { type: 'ArrayType', dimensions, ofType };
        }
        this.error(`Unexpected token '${this.peek().value}' while parsing a type.`);
    }

    parseBlock() {
        const statements = [];
        while (true) {
            if (this.isAtEnd()) break;
            const token = this.peek();
            if (token.type === TokenType.END || token.type === TokenType.ELSE || token.type === TokenType.UNTIL ||
                token.type === TokenType.END_IF || token.type === TokenType.END_FOR || token.type === TokenType.END_WHILE ||
                token.type === TokenType.END_PROCEDURE || token.type === TokenType.END_FUNCTION) {
                break;
            }
            statements.push(this.parseStatement());
        }
        return statements.filter(s => s !== null);
    }

    parseStatement() {
        const startToken = this.peek();
        let stmt = null;

        if (this.match(TokenType.CALCULATE)) { stmt = this.parseProcedureCall(); }
        else if (this.match(TokenType.PRINT)) { stmt = this.parsePrintStatement(); }
        else if (this.match(TokenType.IF)) { stmt = this.parseIfStatement(); }
        else if (this.match(TokenType.FOR)) { stmt = this.parseForStatement(); }
        else if (this.match(TokenType.WHILE)) { stmt = this.parseWhileStatement(); }
        else if (this.match(TokenType.REPEAT)) { stmt = this.parseRepeatUntilStatement(); }
        else if (this.match(TokenType.READ)) { stmt = this.parseReadStatement(); }

        else if (this.check(TokenType.IDENTIFIER)) {
            const nextToken = this.tokens[this.current + 1];
            if (nextToken && (nextToken.type === TokenType.ASSIGN || nextToken.type === TokenType.LEFT_BRACKET)) {
                stmt = this.parseAssignmentStatement();
            }
            else if (nextToken && nextToken.type === TokenType.LEFT_PAREN) {
                stmt = this.parseProcedureCall();
            }
        }

        if (stmt) {
            stmt.loc = { line: startToken.line, column: startToken.column };
            return stmt;
        }

        const token = this.peek();
        this.error(`Unexpected statement starting with '${token.value}'`, token);
    }

    parseProcedureCall() { const name = this.consume(TokenType.IDENTIFIER, "Expected procedure name.").value; this.consume(TokenType.LEFT_PAREN, "Expected '(' after procedure name."); const args = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { if(this.match(TokenType.PERCENT)) { args.push({value: this.parseExpression(), passBy: 'reference'}); } else { args.push({value: this.parseExpression(), passBy: 'value'}); } } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after procedure arguments."); this.match(TokenType.SEMICOLON); return { type: 'ProcedureCall', name, args }; }
    parseReadStatement() { this.consume(TokenType.LEFT_PAREN, "Expected '(' after ΔΙΑΒΑΣΕ."); const args = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments."); this.match(TokenType.SEMICOLON); return { type: 'ReadStatement', args }; }
    parseIfStatement() { const condition = this.parseExpression(); this.consume(TokenType.THEN, "Expected 'ΤΟΤΕ' after IF condition."); const thenBranch = this.parseBlock(); let elseBranch = null; if (this.match(TokenType.ELSE)) { elseBranch = this.parseBlock(); } this.consume(TokenType.END_IF, "Expected 'ΕΑΝ-ΤΕΛΟΣ' after IF statement."); this.match(TokenType.SEMICOLON); return { type: 'IfStatement', condition, thenBranch, elseBranch }; }
    parseForStatement() {
        const variable = this.consume(TokenType.IDENTIFIER, "Expected loop variable for FOR loop.").value;
        this.consume(TokenType.ASSIGN, "Expected ':=' after loop variable.");
        const start = this.parseExpression();
        this.consume(TokenType.TO, "Expected 'ΕΩΣ' in FOR loop.");
        const end = this.parseExpression();
        let step = { type: 'Literal', value: 1 };
        // Check for "ΜΕ ΒΗΜΑ" which appear as two consecutive STEP tokens because both "ΜΕ" and "ΒΗΜΑ" map to TokenType.STEP.
        if (this.check(TokenType.STEP)) {
            this.consume(TokenType.STEP); // Consume first "STEP" (could be "ΜΕ" or "STEP" or "ΒΗΜΑ")
            if (this.check(TokenType.STEP)) {
                this.consume(TokenType.STEP); // Consume second "STEP" (e.g. "ΒΗΜΑ")
            }
            step = this.parseExpression();
        }
        this.consume(TokenType.REPEAT, "Expected 'ΕΠΑΝΑΛΑΒΕ' in FOR loop.");
        const body = this.parseBlock();
        this.consume(TokenType.END_FOR, "Expected 'ΓΙΑ-ΤΕΛΟΣ' after FOR loop body.");
        this.match(TokenType.SEMICOLON);
        return { type: 'ForStatement', variable, start, end, step, body };
    }
    parseWhileStatement() { const condition = this.parseExpression(); this.consume(TokenType.REPEAT, "Expected 'ΕΠΑΝΑΛΑΒΕ' in WHILE loop."); const body = this.parseBlock(); this.consume(TokenType.END_WHILE, "Expected 'ΕΝΟΣΩ-ΤΕΛΟΣ' after WHILE loop body."); this.match(TokenType.SEMICOLON); return { type: 'WhileStatement', condition, body }; }
    parseRepeatUntilStatement() { const body = this.parseBlock(); this.consume(TokenType.UNTIL, "Expected 'ΜΕΧΡΙ' after REPEAT loop body."); const condition = this.parseExpression(); this.match(TokenType.SEMICOLON); return { type: 'RepeatUntilStatement', condition, body }; }
    parsePrintStatement() { this.consume(TokenType.LEFT_PAREN, "Expected '(' after ΤΥΠΩΣΕ."); const expressions = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { expressions.push(this.parseExpression()); } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expressions in ΤΥΠΩΣΕ."); this.match(TokenType.SEMICOLON); return { type: 'PrintStatement', expressions }; }

    parseAssignmentStatement() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected identifier for assignment.").value;
        let indices = [];
        if (this.match(TokenType.LEFT_BRACKET)) {
            do {
                indices.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
            this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array index.");
        }
        this.consume(TokenType.ASSIGN, "Expected ':=' for assignment.");
        const value = this.parseExpression();
        this.match(TokenType.SEMICOLON);
        return { type: 'AssignmentStatement', identifier: name, indices, value };
    }

    parseExpression() { return this.parseLogicalOr(); }
    parseLogicalOr() { let left = this.parseLogicalAnd(); while (this.match(TokenType.OR)) { const operator = this.previous().value; const right = this.parseLogicalAnd(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseLogicalAnd() { let left = this.parseEquality(); while (this.match(TokenType.AND)) { const operator = this.previous().value; const right = this.parseEquality(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseEquality() { let left = this.parseComparison(); while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) { const operator = this.previous().value; const right = this.parseComparison(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseComparison() { let left = this.parseArithmetic(); while (this.match(TokenType.GREATER_THAN, TokenType.GREATER_EQUALS, TokenType.LESS_THAN, TokenType.LESS_EQUALS)) { const operator = this.previous().value; const right = this.parseArithmetic(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseArithmetic() { let left = this.parseTerm(); while (this.match(TokenType.PLUS, TokenType.MINUS)) { const operator = this.previous().value; const right = this.parseTerm(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseTerm() { let left = this.parseFactor(); while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MOD, TokenType.DIV)) { const operator = this.previous().value; const right = this.parseFactor(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseFactor() { if (this.match(TokenType.NOT)) { const operator = this.previous().value; const right = this.parseFactor(); return { type: 'UnaryExpression', operator, right }; }
        if (this.match(TokenType.MINUS, TokenType.PLUS)) { const operator = this.previous().value; const right = this.parseFactor(); return { type: 'UnaryExpression', operator, right }; }
        return this.parsePrimary();
    }

    parsePrimary() {
        const startToken = this.peek();
        let expr = null;

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            expr = { type: 'Literal', value: this.previous().value };
        }
        else if (this.match(TokenType.IDENTIFIER)) {
            const name = this.previous().value;
            if (name.toUpperCase() === 'TRUE') expr = { type: 'Literal', value: true };
            else if (name.toUpperCase() === 'FALSE') expr = { type: 'Literal', value: false };
            else if (this.check(TokenType.LEFT_PAREN)) {
                expr = this.parseFunctionCall(name); }
            else if (this.check(TokenType.LEFT_BRACKET)) {
                this.consume(TokenType.LEFT_BRACKET);
                const indices = [];
                do { indices.push(this.parseExpression()); } while(this.match(TokenType.COMMA));
                this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array indices.");
                expr = { type: 'ArrayAccess', name, indices };
            }
            else expr = { type: 'Identifier', name };
        }
        else if (this.match(TokenType.EOLN)) { expr = { type: 'Identifier', name: 'EOLN' }; }
        else if (this.match(TokenType.LEFT_PAREN)) { const exprBody = this.parseExpression(); this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression."); expr = { type: 'Grouping', expression: exprBody }; }

        if (expr) {
            // Note: This location might be slightly off for grouping etc, but better than nothing
            if (!expr.loc) expr.loc = { line: startToken.line, column: startToken.column };
            return expr;
        }

        const token = this.peek();
        this.error(`Unexpected token '${token.value}' when parsing primary expression`, token);
    }

    parseFunctionCall(name) { this.consume(TokenType.LEFT_PAREN, "Expected '(' for function call.");
        const args = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after function arguments.");
        return { type: 'FunctionCall', name, args };
    }
}

// -----------------------------------------------------------------------------
// INTERPRETER
// -----------------------------------------------------------------------------

class Environment {
    constructor(parent = null) {
        this.values = new Map();
        this.parent = parent;
    }

    define(name, value) {
        // We store "Boxes" ({ value: ... }) to allow pass-by-reference if needed.
        // If the value passed is already a box (e.g. from pass-by-ref), use it.
        if (value && typeof value === 'object' && 'value' in value && Object.keys(value).length === 1) {
             this.values.set(name.toUpperCase(), value);
        } else {
             this.values.set(name.toUpperCase(), { value });
        }
    }

    defineBox(name, box) {
        this.values.set(name.toUpperCase(), box);
    }

    assign(name, value) {
        const key = name.toUpperCase();
        if (this.values.has(key)) {
            this.values.get(key).value = value;
            return;
        }
        if (this.parent) {
            this.parent.assign(name, value);
            return;
        }
        throw new Error(`Undefined variable '${name}'.`);
    }

    get(name) {
        const key = name.toUpperCase();
        if (this.values.has(key)) {
            return this.values.get(key).value;
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new Error(`Undefined variable '${name}'.`);
    }

    getBox(name) {
        const key = name.toUpperCase();
        if (this.values.has(key)) {
            return this.values.get(key);
        }
        if (this.parent) {
            return this.parent.getBox(name);
        }
        throw new Error(`Undefined variable '${name}'.`);
    }
}

class ArrayObject {
    constructor() {
        this.data = {};
    }

    getKey(indices) {
        return indices.join(',');
    }

    get(indices) {
        const key = this.getKey(indices);
        if (this.data.hasOwnProperty(key)) {
            return this.data[key];
        }
        throw new Error(`Array index out of bounds or undefined value at indices [${indices.join(', ')}]`);
    }

    set(indices, value) {
        this.data[this.getKey(indices)] = value;
    }

    clone() {
        const newArr = new ArrayObject();
        newArr.data = { ...this.data };
        return newArr;
    }
}

class Interpreter {
    constructor() {
        this.globalEnv = new Environment();
        this.outputBuffer = [];
        this.inputProvider = null;
        this.outputCallback = null;
        this.currentNode = null; // Track execution for error reporting
    }

    // Allow setting a custom input provider for testing or non-browser environments
    setInputProvider(provider) {
        this.inputProvider = provider;
    }

    setOutputCallback(callback) {
        this.outputCallback = callback;
    }

    async interpret(ast) {
        this.outputBuffer = [];
        this.globalEnv = new Environment(); // Reset env for each run

        // Define standard constants
        this.globalEnv.define('EOLN', '\n');

        try {
            if (ast.type !== 'Program') throw new Error("Expected Program node");

            await this.processDeclarations(ast.declarations, this.globalEnv);
            await this.executeBlock(ast.body, this.globalEnv);

            return { output: this.outputBuffer.join('\n'), error: null };
        } catch (e) {
            // Add location info if available and not present
            let msg = e.message;
            // Check for new format [Line: ...]
            if (this.currentNode && this.currentNode.loc && !msg.includes('[Line:')) {
                msg = `${msg} [Line: ${this.currentNode.loc.line}, Col: ${this.currentNode.loc.column}]`;
            }
            return { output: this.outputBuffer.join('\n'), error: msg };
        }
    }

    async processDeclarations(declarations, env) {
        for (const decl of declarations) {
            if (decl.type === 'ConstantDeclaration') {
                 const val = await this.evaluate(decl.value, env);
                 env.define(decl.name, val);
            } else if (decl.type === 'VariableDeclaration') {
                if (decl.varType.type === 'ArrayType') {
                     env.define(decl.name, new ArrayObject());
                } else {
                     // Initialize with default values based on type
                     let defaultVal = null;
                     if (decl.varType.name === TokenType.INTEGER_TYPE || decl.varType.name === TokenType.REAL_TYPE) defaultVal = 0;
                     else if (decl.varType.name === TokenType.BOOLEAN_TYPE) defaultVal = false;
                     else if (decl.varType.name === TokenType.STRING_TYPE || decl.varType.name === TokenType.CHAR_TYPE) defaultVal = "";

                     env.define(decl.name, defaultVal);
                }
            } else if (decl.type === 'ProcedureDeclaration' || decl.type === 'FunctionDeclaration') {
                env.define(decl.name, { type: 'Subroutine', declaration: decl, closure: env });
            }
        }
    }

    async executeBlock(statements, env) {
        for (const stmt of statements) {
            await this.execute(stmt, env);
        }
    }

    async execute(stmt, env) {
        this.currentNode = stmt; // Set current node for error tracking
        switch (stmt.type) {
            case 'AssignmentStatement': {
                const val = await this.evaluate(stmt.value, env);
                if (stmt.indices && stmt.indices.length > 0) {
                    const arr = env.get(stmt.identifier);
                    if (!(arr instanceof ArrayObject)) throw new Error(`'${stmt.identifier}' is not an array.`);
                    const indices = [];
                    for(const idx of stmt.indices) indices.push(await this.evaluate(idx, env));
                    arr.set(indices, val);
                } else {
                    env.assign(stmt.identifier, val);
                }
                break;
            }
            case 'PrintStatement': {
                const parts = [];
                for(const expr of stmt.expressions) {
                    parts.push(await this.evaluate(expr, env));
                }
                const output = parts.join(' ');
                this.outputBuffer.push(output);
                if (this.outputCallback) this.outputCallback(output);
                break;
            }
            case 'ReadStatement': {
                for(const arg of stmt.args) {
                    let targetName;
                    let targetIndices = [];

                    if (arg.type === 'Identifier') {
                        targetName = arg.name;
                    } else if (arg.type === 'ArrayAccess') {
                        targetName = arg.name;
                        for(const idx of arg.indices) targetIndices.push(await this.evaluate(idx, env));
                    } else {
                        throw new Error("READ requires a variable.");
                    }

                    const promptMsg = targetIndices.length > 0
                        ? `Enter value for ${targetName}[${targetIndices.join(',')}]`
                        : `Enter value for ${targetName}`;

                    let input;
                    if (this.inputProvider) {
                        input = await this.inputProvider(promptMsg);
                    } else if (typeof window !== 'undefined' && window.prompt) {
                        input = window.prompt(promptMsg);
                    } else {
                        throw new Error("Input not supported in this environment");
                    }

                    if (input === null) throw new Error("Input cancelled");

                    // Echo input if in console/test mode usually, but here we just buffer it if we want to simulate terminal,
                    // but usually READ doesn't print unless user types it.
                    // In the original code: this.outputBuffer.push(input);
                    // This effectively echoes the input to the output display, which is good for log.
                    this.outputBuffer.push(input);
                    if (this.outputCallback) this.outputCallback(input);

                    let value = input;
                    if (!isNaN(input) && input.trim() !== '') {
                        value = Number(input);
                    } else if (input.toLowerCase() === 'true') value = true;
                    else if (input.toLowerCase() === 'false') value = false;

                    if (targetIndices.length > 0) {
                        const arr = env.get(targetName);
                        if (!(arr instanceof ArrayObject)) throw new Error(`'${targetName}' is not an array.`);
                        arr.set(targetIndices, value);
                    } else {
                        env.assign(targetName, value);
                    }
                }
                break;
            }
            case 'IfStatement': {
                if (await this.evaluate(stmt.condition, env)) {
                    await this.executeBlock(stmt.thenBranch, env);
                } else if (stmt.elseBranch) {
                    await this.executeBlock(stmt.elseBranch, env);
                }
                break;
            }
            case 'WhileStatement': {
                while(await this.evaluate(stmt.condition, env)) {
                    await this.executeBlock(stmt.body, env);
                }
                break;
            }
             case 'RepeatUntilStatement': {
                do {
                    await this.executeBlock(stmt.body, env);
                } while (!(await this.evaluate(stmt.condition, env)));
                break;
            }
             case 'ForStatement': {
                const start = await this.evaluate(stmt.start, env);
                const end = await this.evaluate(stmt.end, env);
                const step = await this.evaluate(stmt.step, env);
                const varName = stmt.variable;

                // Loop variable implicitly declared if not exists?
                try {
                    env.get(varName);
                } catch(e) {
                     env.define(varName, start);
                }
                env.assign(varName, start);

                let current = start;
                if (step > 0) {
                    while (current <= end) {
                         await this.executeBlock(stmt.body, env);
                         current = env.get(varName) + step;
                         env.assign(varName, current);
                    }
                } else {
                     while (current >= end) {
                         await this.executeBlock(stmt.body, env);
                         current = env.get(varName) + step;
                         env.assign(varName, current);
                    }
                }
                break;
            }
            case 'ProcedureCall': {
                 const proc = env.get(stmt.name);
                 if (!proc || proc.type !== 'Subroutine') throw new Error(`Unknown procedure '${stmt.name}'.`);
                 const decl = proc.declaration;

                 if (decl.params.length !== stmt.args.length) {
                     throw new Error(`Procedure '${stmt.name}' expects ${decl.params.length} arguments but got ${stmt.args.length}.`);
                 }

                 const procEnv = new Environment(proc.closure);

                 for(let i = 0; i < decl.params.length; i++) {
                     const param = decl.params[i];
                     const arg = stmt.args[i];

                     if (param.passBy === 'reference') {
                         if (arg.value.type === 'Identifier') {
                             // Pass the existing box
                             const argBox = env.getBox(arg.value.name);
                             procEnv.defineBox(param.name, argBox);
                         } else if (arg.value.type === 'ArrayAccess') {
                             // Create a proxy box for the array element
                             const arrName = arg.value.name;
                             const arr = env.get(arrName);
                             if (!(arr instanceof ArrayObject)) throw new Error(`'${arrName}' is not an array.`);

                             const indices = [];
                             for(const idx of arg.value.indices) indices.push(await this.evaluate(idx, env));

                             const proxyBox = {
                                 get value() { return arr.get(indices); },
                                 set value(val) { arr.set(indices, val); }
                             };
                             procEnv.defineBox(param.name, proxyBox);
                         } else {
                             throw new Error(`Argument for reference parameter '${param.name}' must be a variable or array element.`);
                         }
                     } else {
                         // Pass by value
                         let val = await this.evaluate(arg.value, env);
                         if (val instanceof ArrayObject) {
                             val = val.clone();
                         }
                         procEnv.define(param.name, val);
                     }
                 }

                 await this.processDeclarations(decl.declarations, procEnv);
                 await this.executeBlock(decl.body, procEnv);
                 break;
            }
        }
    }

    async evaluate(expr, env) {
        switch(expr.type) {
            case 'Literal': return expr.value;
            case 'Identifier': return env.get(expr.name);
            case 'BinaryExpression': {
                const left = await this.evaluate(expr.left, env);
                const right = await this.evaluate(expr.right, env);
                const op = expr.operator;

                if (op === '+') return left + right;
                if (op === '-') return left - right;
                if (op === '*') return left * right;
                if (op === '/') return left / right;
                if (op === 'DIV') return Math.floor(left / right);
                if (op === 'MOD') return left % right;
                if (op === '>') return left > right;
                if (op === '<') return left < right;
                if (op === '>=') return left >= right;
                if (op === '<=') return left <= right;
                if (op === '=' || op === 'EQUALS') return left === right;
                if (op === '<>' || op === 'NOT_EQUALS') return left !== right;
                if (op === 'AND') return left && right;
                if (op === 'OR') return left || right;
                break;
            }
            case 'UnaryExpression': {
                 const val = await this.evaluate(expr.right, env);
                 if (expr.operator === '-') return -val;
                 if (expr.operator === 'NOT' || expr.operator === 'ΟΧΙ') return !val;
                 break;
            }
            case 'Grouping':
                return await this.evaluate(expr.expression, env);
            case 'ArrayAccess': {
                const arr = env.get(expr.name);
                if (!(arr instanceof ArrayObject)) throw new Error(`'${expr.name}' is not an array.`);
                const indices = [];
                for(const i of expr.indices) indices.push(await this.evaluate(i, env));
                return arr.get(indices);
            }
            case 'FunctionCall': {
                 const func = env.get(expr.name);
                 if (!func || func.type !== 'Subroutine') throw new Error(`Unknown function '${expr.name}'.`);
                 const decl = func.declaration;

                 if (decl.params.length !== expr.args.length) {
                     throw new Error(`Function '${expr.name}' expects ${decl.params.length} arguments but got ${expr.args.length}.`);
                 }

                 const funcEnv = new Environment(func.closure);

                 // Initialize return variable
                 // In Pascal/EAP, function result is assigned to function name variable.
                 let defaultVal = 0; // Default
                 // Ideally check returnType
                 funcEnv.define(expr.name, defaultVal);

                 for(let i = 0; i < decl.params.length; i++) {
                     const param = decl.params[i];
                     const argExpr = expr.args[i];

                     if (param.passBy === 'reference') {
                         if (argExpr.type === 'Identifier') {
                              const argBox = env.getBox(argExpr.name);
                              funcEnv.defineBox(param.name, argBox);
                         } else if (argExpr.type === 'ArrayAccess') {
                             const arrName = argExpr.name;
                             const arr = env.get(arrName);
                             if (!(arr instanceof ArrayObject)) throw new Error(`'${arrName}' is not an array.`);
                             const indices = [];
                             for(const idx of argExpr.indices) indices.push(await this.evaluate(idx, env));

                             const proxyBox = {
                                 get value() { return arr.get(indices); },
                                 set value(val) { arr.set(indices, val); }
                             };
                             funcEnv.defineBox(param.name, proxyBox);
                         } else {
                              throw new Error(`Argument for reference parameter '${param.name}' must be a variable or array element.`);
                         }
                     } else {
                         let val = await this.evaluate(argExpr, env);
                         if (val instanceof ArrayObject) {
                             val = val.clone();
                         }
                         funcEnv.define(param.name, val);
                     }
                 }

                 await this.processDeclarations(decl.declarations, funcEnv);
                 await this.executeBlock(decl.body, funcEnv);

                 // Return the value of the variable with function name
                 return funcEnv.get(expr.name);
            }
        }
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tokenize, Parser, Interpreter, Environment };
} else {
    // Browser environment
    // We can just leave them in global scope or put them in a namespace
    // Leaving them in global scope as app.js expects them there
}
