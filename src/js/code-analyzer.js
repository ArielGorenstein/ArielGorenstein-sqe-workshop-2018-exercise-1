import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    initializeExpressionDictionary();
    initializeValueDictionary();
    return handleSingleElement(esprima.parseScript(codeToParse, {loc : true}));
};

let expressionDictionary;
let valueDictionary;

let goInside = arr => arr.map (inner => handleSingleElement(inner)).flat();

let line = p => p.loc.start.line;

const initializeExpressionDictionary = () => {
    expressionDictionary = {
        Program : handleProgram,
        FunctionDeclaration : handleFunctionDeclaration,
        BlockStatement : handelBlockStatement,
        Identifier : handleIdentifier,
        ReturnStatement : handleReturnStatement,
        VariableDeclaration : handleVariableDeclaration,
        VariableDeclarator : handleVariableDeclarator,
        ExpressionStatement : handleExpressionStatement,
        WhileStatement : handleWhileExpression,
        ForStatement : handleForLoop,
        IfStatement : handleIfExpression,
        UpdateExpression : handleUpdateStatement,
        AssignmentExpression : handleAssignmentStatement
    };
};

const handleSingleElement = p => {
    return expressionDictionary[p.type](p);
};

const handleProgram = p => {
    return goInside(p.body);
};

const handelBlockStatement = p => {
    return goInside(p.body);
};

const handleFunctionDeclaration = p => {
    return [{line : line(p), type : 'Function Declaration', name : p.id.name, condition : null, value : null}]
        .concat(goInside(p.params)).concat(handleSingleElement(p.body));
};

const handleVariableDeclaration = p => {
    return goInside(p.declarations);
};

const handleVariableDeclarator = p => {
    let value = resolveValue(p.init);
    return [{line : line(p), type : 'Variable Declaration', name : p.id.name, condition : null, value : value}];
};

const handleIdentifier = p => {
    return [{line : line(p), type : 'Variable Declaration', name : p.name, condition : null, value : null}];
};

const handleExpressionStatement = p => {
    return handleSingleElement(p.expression);
};

const handleAssignmentStatement = p => {
    return [{line: line(p),
        type : 'Assignment Expression',
        name : p.left.name,
        condition : null,
        value : resolveValue(p.right)}];
};

const handleUpdateStatement = p => {
    return [{line: line(p),
        type : 'Update Expression',
        name : p.argument.name,
        condition : null,
        value : p.operator}];
};

const handleWhileExpression = p => {
    return [{line : line(p), type : 'While Statement', name : null, condition : resolveValue(p.test), value : null}]
        .concat(handleSingleElement(p.body));
};

const handleForLoop = p =>{
    return [{line : line(p), type: 'For Statement', name : null, condition : resolveValue(p.test), value : null}]
        .concat(handleSingleElement(p.init))
        .concat(handleSingleElement(p.update))
        .concat(handleSingleElement(p.body));
};

const handleIfExpression = p => {
    return [{line : line(p), type : 'If Expression', name : null, condition : resolveValue(p.test), value : null}]
        .concat(handleSingleElement(p.consequent)).concat(handleSingleElement(p.alternate));
};

const handleReturnStatement = p => {
    return [{line : line(p), type : 'Return Statement', name : null, condition : null, value : resolveValue(p.argument)}];
};


const initializeValueDictionary = () => {
    valueDictionary = {
        Identifier : resolveIdentifier,
        Literal : resolveLiteral,
        BinaryExpression : resolveBinary,
        UnaryExpression : resolveUnary,
        MemberExpression : resolveMember
    }  ;
};

const resolveValue = v => v == null ? null : valueDictionary[v.type](v);

const resolveIdentifier = v => v.name;

const resolveLiteral = v => v.value;

const resolveBinary = v => resolveValue(v.left) + ' ' + v.operator + ' ' + resolveValue(v.right);

const resolveUnary = v => v.operator + resolveValue(v.argument);

const resolveMember = v => resolveValue(v.object) + '[' + resolveValue(v.property) + ']';


Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
        }, []);
    }
});


export {parseCode, goInside, line, initializeExpressionDictionary, handleReturnStatement, handleSingleElement,
    handleIdentifier, handleProgram, resolveIdentifier, resolveValue, handelBlockStatement, initializeValueDictionary,
    handleExpressionStatement, handleForLoop, handleIfExpression, handleWhileExpression, handleFunctionDeclaration,
    handleVariableDeclaration, handleVariableDeclarator, resolveBinary, resolveLiteral, resolveMember, resolveUnary};
