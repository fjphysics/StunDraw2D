"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ETokenType;
(function (ETokenType) {
    ETokenType[ETokenType["NONE"] = 0] = "NONE";
    ETokenType[ETokenType["STRING"] = 1] = "STRING";
    ETokenType[ETokenType["NUMBER"] = 2] = "NUMBER";
})(ETokenType = exports.ETokenType || (exports.ETokenType = {}));
class Doom3Factory {
    static createDoom3Tokenizer() {
        return new Doom3Tokenizer();
    }
}
exports.Doom3Factory = Doom3Factory;
class Doom3Token {
    constructor() {
        this._charArr = [];
        // this . _charArr . length = 0 ;
        // this . _type = ETokenType . NONE ;
        // this . _val = 0.0 ;
        this.reset();
    }
    reset() {
        this._charArr.length = 0;
        this._type = ETokenType.NONE;
        this._val = 0.0;
    }
    get type() {
        return this._type;
    }
    getString() {
        return this._charArr.join("");
    }
    getFloat() {
        return this._val;
    }
    getInt() {
        return parseInt(this._val.toString(), 10);
    }
    isString(str) {
        let count = this._charArr.length;
        if (str.length !== count) {
            return false;
        }
        for (let i = 0; i < count; i++) {
            if (this._charArr[i] !== str[i]) {
                return false;
            }
        }
        return true;
    }
    addChar(c) {
        this._charArr.push(c);
    }
    setVal(num) {
        this._val = num;
        this._type = ETokenType.NUMBER;
    }
    setType(type) {
        this._type = type;
    }
}
class Doom3Tokenizer {
    constructor() {
        this._whiteSpaces = [" ", "\t", "\v", "\n", "\r"];
        this._digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        this._source = "Doom3Tokenizer";
        this._currIdx = 0;
        this._current = new Doom3Token();
    }
    _isDigit(c) {
        for (let i = 0; i < this._digits.length; i++) {
            if (c === this._digits[i]) {
                return true;
            }
        }
        return false;
    }
    _isWhitespace(c) {
        for (let i = 0; i < this._whiteSpaces.length; i++) {
            if (c === this._whiteSpaces[i]) {
                return true;
            }
        }
        return false;
    }
    /*
    public createIDoom3Token ( ) : IDoom3Token {
        return new Doom3Token ( ) ;
    }
    */
    setSource(source) {
        this._source = source;
        this._currIdx = 0;
    }
    reset() {
        this._currIdx = 0;
    }
    moveNext() {
        return this.getNextToken(this._current);
    }
    get current() {
        return this._current;
    }
    _skipWhitespace() {
        let c = "";
        do {
            c = this._getChar();
        } while (c.length > 0 && this._isWhitespace(c));
        return c;
    }
    getNextToken(tok) {
        let token = tok;
        let c = "";
        token.reset();
        do {
            c = this._skipWhitespace();
            if (c == '/' && this._peekChar() == '/') {
                c = this._skipComments0();
            }
            else if (c == '/' && this._peekChar() == '*') {
                c = this._skipComments1();
            }
            else if (this._isDigit(c) || c == '-' || (c == '.' && this._isDigit(this._peekChar()))) {
                this._ungetChar();
                this._getNumber(token);
                return true;
            }
            else if (c == '\"' || c == '\'') {
                this._getSubstring(token, c);
                return true;
            }
            else if (c.length > 0) {
                this._ungetChar();
                this._getString(token);
                return true;
            }
        } while (c.length > 0);
        return false;
    }
    _getChar() {
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx++);
        }
        return "";
    }
    _peekChar() {
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx);
        }
        return "";
    }
    _ungetChar() {
        if (this._currIdx > 0) {
            --this._currIdx;
        }
    }
    _skipComments0() {
        let c = "";
        do {
            c = this._getChar();
        } while (c.length > 0 && c != '\n');
        return c;
    }
    _skipComments1() {
        let c = "";
        c = this._getChar();
        do {
            c = this._getChar();
        } while (c.length > 0 && (c != '*' || this._peekChar() != '/'));
        c = this._getChar();
        return c;
    }
    _getNumber(token) {
        let val = 0.0;
        let isFloat = false;
        let scaleValue = 0.1;
        let c = this._getChar();
        let isNegate = (c === '-');
        let consumed = false;
        let ascii0 = "0".charCodeAt(0);
        do {
            token.addChar(c);
            if (c == '.') {
                isFloat = true;
            }
            else if (c !== '-') {
                let ascii = c.charCodeAt(0);
                let vc = (ascii - ascii0);
                if (!isFloat)
                    val = 10 * val + vc;
                else {
                    val = val + scaleValue * vc;
                    scaleValue *= 0.1;
                }
            }
            if (consumed === true)
                this._getChar();
            c = this._peekChar();
            consumed = true;
        } while (c.length > 0 && (this._isDigit(c) || (!isFloat && c === '.')));
        if (isNegate) {
            val = -val;
        }
        token.setVal(val);
    }
    _isSpecialChar(c) {
        switch (c) {
            case '(':
                return true;
            case ')':
                return true;
            case '[':
                return true;
            case ']':
                return true;
            case '{':
                return true;
            case '}':
                return true;
            case ',':
                return true;
            case '.':
                return true;
        }
        return false;
    }
    _getString(token) {
        let c = this._getChar();
        token.setType(ETokenType.STRING);
        do {
            token.addChar(c);
            if (!this._isSpecialChar(c)) {
                c = this._getChar();
            }
        } while (c.length > 0 && !this._isWhitespace(c) && !this._isSpecialChar(c));
    }
    _getSubstring(token, endChar) {
        let end = false;
        let c = "";
        token.setType(ETokenType.STRING);
        do {
            c = this._getChar();
            if (c === endChar) {
                end = true;
            }
            else {
                token.addChar(c);
            }
        } while (c.length > 0 && c !== '\n' && !end);
    }
}
