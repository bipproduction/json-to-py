const _ = require("lodash");

module.exports = function jsonToTypedDict(json, name) {
    let classes = [];
    let generatedClasses = new Set();

    function generatePythonClass(json, className = name) {
        if (generatedClasses.has(className)) {
            return;
        }
        generatedClasses.add(className);

        let classDef = `class ${className}(TypedDict):\n`;
        if (Array.isArray(json)) {
            json = json[0]; // Use the first element to infer the structure
        }
        const keys = _.keys(json);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = json[key];
            let type = typeData(value);
            if (type === "object") {
                let subClassName = className + _.startCase(key).replace(/ /g, '');
                classDef += `    ${key}: ${subClassName}\n`;
                generatePythonClass(value, subClassName);
            } else if (type === "array") {
                if (value.length > 0 && typeof value[0] === 'object') {
                    let subClassName = className + _.startCase(key).replace(/ /g, '');
                    classDef += `    ${key}: List[${subClassName}]\n`;
                    generatePythonClass(value, subClassName);
                } else {
                    classDef += `    ${key}: List[${typeData(value[0])}]\n`;
                }
            } else {
                classDef += `    ${key}: ${type}\n`;
            }
        }
        if (keys.length === 0) {
            classDef += `    pass\n`;
        }
        classes.push(classDef);
    }

    function typeData(data) {
        if (_.isArray(data)) {
            return "array";
        } else if (_.isObject(data)) {
            return "object";
        } else if (_.isString(data)) {
            return "str";
        } else if (_.isNumber(data)) {
            return "int";
        } else if (_.isBoolean(data)) {
            return "bool";
        } else if (_.isNull(data)) {
            return "None";
        } else {
            return "Any";
        }
    }

    generatePythonClass(json);
    return `
from typing import TypedDict, List, Any

${classes.join('\n')}
    `.trim();
};
