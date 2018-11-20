import assert from 'assert';
import {parseCode, line, initializeExpressionDictionary, handleReturnStatement,
    handleIdentifier, handleProgram, resolveIdentifier, resolveValue, handelBlockStatement, initializeValueDictionary,
    handleExpressionStatement, handleForLoop, handleIfExpression, handleWhileExpression, handleFunctionDeclaration,
    handleVariableDeclaration, handleVariableDeclarator, resolveBinary, resolveLiteral, resolveMember, resolveUnary} from '../src/js/code-analyzer';


describe('Test value resolver', () => {
    it('literal', () => {
        assert.equal(resolveLiteral({type : 'Literal', value : 5}), 5);
    });
});

describe('Test value resolver', () => {
    it('identifier', () => {
        assert.equal(resolveIdentifier({type : 'Identifier', name : 'x'}), 'x');
    });
});

describe('Test value resolver', () => {
    it('unary', () => {
        initializeValueDictionary();
        assert.equal(resolveUnary({type : 'UnaryExpression', operator : '&', argument : {type : 'Literal', value : 8}}), '&8');
    });
});

describe('Test value resolver', () => {
    it('binary', () => {
        initializeValueDictionary();
        assert.equal(resolveBinary({type : 'BinaryExpression', operator : '+',
            left : {type : 'Identifier', name : 'a'}, right : {type : 'Identifier', name : 'b'}}), 'a + b');
    });
});

describe('Test value resolver', () => {
    it('member', () => {
        assert.equal(resolveMember({type : 'MemberExpression',
            object : {type : 'Identifier', name : 'A'}, property : {type : 'Identifier', name : 'i'}}), 'A[i]');
    });
});

describe('Test value resolver', () => {
    it('global', () => {
        assert.equal( resolveValue({type : 'BinaryExpression', operator : '>=',
            left : {type : 'UnaryExpression', operator : '-', argument: {type : 'Identifier', name : 'a'}},
            right : {type : 'BinaryExpression', operator : '+',
                left : {type : 'Identifier', name : 'b'},
                right : {type : 'MemberExpression',
                    object: {type : 'Identifier', name : 'A'},
                    property: {type : 'Literal', value : 0}}}}), '-a >= b + A[0]');
    });
});

describe('Test General', () => {
    it('line', () => {
        assert.equal( line ({loc : {start : {line : 42}}}), 42);
    });
});

describe('Test Expression', () => {
    it('Variable Declarator', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleVariableDeclarator({id : {name : 'a'}, loc : {start : {line : 16}},
            init : {type : 'Literal', value : 3}})),
        '[{"line":16,"type":"Variable Declaration","name":"a","condition":null,"value":3}]');
    });
});

describe('Test Expression', () => {
    it('Assignment', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleExpressionStatement({
            loc : {start : {line : 5}}, expression : {loc : {start : {line : 5}}, type : 'AssignmentExpression', left : {name : 'a'}, right : {type : 'Literal', value : 16}},
        })),
        '[{"line":5,"type":"Assignment Expression","name":"a","condition":null,"value":16}]');
    });
});

describe('Test Expression', () => {
    it('Update', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleExpressionStatement({
            expression : {loc : {start : {line : 5}}, type : 'UpdateExpression', argument : {name : 'a'}, operator : '++'},
        })),
        '[{"line":5,"type":"Update Expression","name":"a","condition":null,"value":"++"}]');
    });
});

describe('Test Expression', () => {
    it('Identifier', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleIdentifier({ loc : {start : {line : 5}}, name : 'hello'})),
            '[{"line":5,"type":"Variable Declaration","name":"hello","condition":null,"value":null}]');
    });
});


describe('Test Expression', () => {
    it('Return', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleReturnStatement({
            loc : {start : {line : 5}}, argument : {type : 'Literal', value : 6}
        })),
        '[{"line":5,"type":"Return Statement","name":null,"condition":null,"value":6}]');
    });
});

describe('Test Expression', () => {
    it('Block', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handelBlockStatement({body : [
            {type : 'VariableDeclarator', id : {name : 'a'}, loc : {start : {line : 16}}, init : {type : 'Literal', value : 3}},
            {type : 'VariableDeclarator', id : {name : 'b'}, loc : {start : {line : 17}}, init : {type : 'Literal', value : null}},
            {type : 'ReturnStatement', loc : {start : {line : 18}},
                argument : {type : 'BinaryExpression', operator : '+',
                    left : {type : 'Identifier', name : 'a'},
                    right : {type : 'Literal', value : 12}}}
        ]})),'[{"line":16,"type":"Variable Declaration","name":"a","condition":null,"value":3},{"line":17,"type":"Variable Declaration","name":"b","condition":null,"value":null},{"line":18,"type":"Return Statement","name":null,"condition":null,"value":"a + 12"}]');
    });
});

describe('Test Expression', () => {
    it('If', () => {
        initializeExpressionDictionary();
        assert.equal( JSON.stringify(handleIfExpression({
            loc : {start : {line : 4}},
            test : {type : 'BinaryExpression', operator : '=', loc : {start : {line : 4}},
                left : {type : 'Literal', value : 5},
                right : {type : 'Literal', value : 5}},
            consequent : {type : 'ReturnStatement', argument : {type : 'Literal', value : 3}, loc : {start : {line : 5}}},
            alternate : {type : 'ReturnStatement', argument : {type : 'Identifier', name : 'y'}, loc : {start : {line : 6}}},
        })), '[{"line":4,"type":"If Expression","name":null,"condition":"5 = 5","value":null},{"line":5,"type":"Return Statement","name":null,"condition":null,"value":3},{"line":6,"type":"Return Statement","name":null,"condition":null,"value":"y"}]');
    });
});

describe('Test Expression', () => {
    it('While', () => {
        initializeExpressionDictionary();
        initializeValueDictionary();
        assert.equal( JSON.stringify(handleWhileExpression({
            loc : {start : {line : 5}},
            test : {type : 'Identifier', name : 'true'},
            body : {type : 'BlockStatement', body : []}
        })),
        '[{"line":5,"type":"While Statement","name":null,"condition":"true","value":null}]');
    });
});

describe('Test Expression', () => {
    it('Program', () => {
        initializeExpressionDictionary();
        initializeValueDictionary();
        assert.equal( JSON.stringify(handleProgram({
            type: 'Program',
            body: [
                {type: 'ReturnStatement', argument: {type: 'Identifier', name: 't'}, loc: {start: {line: 7}}}
            ]
        })),
        '[{"line":7,"type":"Return Statement","name":null,"condition":null,"value":"t"}]');
    });
});

describe('Test Expression', () => {
    it('Variable Declaration', () => {
        initializeExpressionDictionary();
        initializeValueDictionary();
        assert.equal( JSON.stringify(handleVariableDeclaration({
            declarations: [
                {type: 'VariableDeclarator', id : {name : 'x'}, loc: {start: {line: 7}}},
                {type: 'VariableDeclarator', id : {name : 'y'}, loc: {start: {line: 7}}}
            ]
        })),
        '[{"line":7,"type":"Variable Declaration","name":"x","condition":null,"value":null},{"line":7,"type":"Variable Declaration","name":"y","condition":null,"value":null}]');
    });
});

describe('Test Expression', () => {
    it('Function Declaration', () => {
        initializeExpressionDictionary();
        initializeValueDictionary();
        assert.equal( JSON.stringify(handleFunctionDeclaration({
            loc : {start : {line : 1}}, id : {name : 'add'},
            params : [
                {type : 'VariableDeclarator', id : {name : 'a'}, loc : {start : {line : 1}}},
                {type : 'VariableDeclarator', id : {name : 'b'}, loc : {start : {line : 1}}}
            ],
            body : {type : 'BlockStatement', body : [{
                type : 'ReturnStatement',
                loc : {start : {line : 2}},
                argument : {type : 'BinaryExpression',
                    operator : '+', left : {type : 'Identifier', name : 'a'}, right : {type : 'Identifier', name : 'b'}}
            }
            ]}
        })), '[{"line":1,"type":"Function Declaration","name":"add","condition":null,"value":null},{"line":1,"type":"Variable Declaration","name":"a","condition":null,"value":null},{"line":1,"type":"Variable Declaration","name":"b","condition":null,"value":null},{"line":2,"type":"Return Statement","name":null,"condition":null,"value":"a + b"}]');
    });
});

describe('Test Expression', () => {
    it('For Loop', () => {
        initializeExpressionDictionary();
        initializeValueDictionary();
        assert.equal( JSON.stringify(handleForLoop({
            loc : {start : {line : 5}},
            test : {type : 'Identifier', name : 'true'},
            init : {type : 'BlockStatement', body : []},
            update : {type : 'BlockStatement', body : []},
            body : {type : 'BlockStatement', body : []}
        })),
        '[{"line":5,"type":"For Statement","name":null,"condition":"true","value":null}]');
    });
});

describe('Test General', () => {
    it('Parse Code', () => {
        assert.equal( JSON.stringify(parseCode(
            (function add (a, b) {
                return a + b;
            }).toString())),
        '[{"line":1,"type":"Function Declaration","name":"add","condition":null,"value":null},{"line":1,"type":"Variable Declaration","name":"a","condition":null,"value":null},{"line":1,"type":"Variable Declaration","name":"b","condition":null,"value":null},{"line":2,"type":"Return Statement","name":null,"condition":null,"value":"a + b"}]');
    });
});

