/**
 * 
 * @name template.jMarker
 * @class
 *
 * 默认值 default
 * 内建函数 builtins
 * 模版语法：
 * ${ ... } 
 * <# ... > 指令
 * <#-- ... --> 注释
 * <@ ... >
 */

/*!
 * jMarker - JavaScript Template using FreeMarker Syntax
 * http://code.google.com/p/jmarker/
 *
 * Copyright 2010, sanshi
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jmarker.googlecode.com/svn/trunk/license/license.htm
 * 
 * Version: 1.3.0
 * Date: Nov 24, 2010
 */
module("template.jMarker",function(global){
	
//IMPORT	
var Base = module("lang.Base");	
	
var _cache={};


// Utilities used by template internal.
/////////////////////////////////////////////////////////////////////////
// Return a random unprintable character. 
function _separator(str) {
	var separator = '';
	do {
		separator = String.fromCharCode(Math.random(0, 1) * 200 + 200);
	}
	while (str.indexOf(separator) >= 0);
	return separator;
}

// Trim the header and footer empty character from the input parameter.
function _trim(str) {
	str = str || '';
	return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
}

// Log a message to browser's console panel.
var  _log = Base.log;

// Detect whether an element is inside an array or not. Borrowed from jQuery.
function _inArray(elem, array) {
	if (array.indexOf) {
		return array.indexOf(elem);
	}

	for (var i = 0, length = array.length; i < length; i++) {
		if (array[i] === elem) {
			return i;
		}
	}
	return -1;
}

// INPUT: 	i = 2
//			str = <#list tabs as tab>
// 			regex = /[\s>]/
// OUTPUT:	[7, ['l', 'i', 's', 't']]
function _readExpressionUtil(i, str, regex) {
	var TAGS = /[\[\]{}()'"]/;
	var count = str.length, character = '', stack = [], cache=[], tmp;

	// We don't need to check pairs if we are in string mode, for example: "flyer:{[hf.com"
	function pairs(char1, char2) {
		return _inArray(char1 + char2, ['[]', '][', '{}', '}{', '()', ')(', "''", '""']) >= 0;
	}
	
	while (i < count) {
		character = str.charAt(i);
		if (stack.length === 0) {
			if (typeof(regex) === 'string' ? (regex === character) : regex.test(character)) {
				// Find it.
				i++;
				break;
			} else {
				if (TAGS.test(character)) {
					stack.push(character);
				}
			}
		} else {
			if (TAGS.test(character)) {
				tmp = stack[stack.length - 1];
				if (pairs(character, tmp)) {
					stack.pop();
				} else {
					if(tmp !== '"' && tmp !== "'") {
						stack.push(character);
					}
				}
			}
		}
		i++;
		cache.push(character);
	}
	return [i, cache];
}

// Distinguish different object type. 
function _getType(value) {
	var type = typeof (value);
	if (type === 'object') {
		var details = toString.call(value);
		if (details === '[object Array]') {
			return 'array';
		} else if (details === '[object Date]') {
			return 'datetime';
		}
	}
	return type;
}

// Default value for different object type.
function _defaultValueForType(typeName) {
	switch (typeName) {
		case 'string':
			return '';
			break;
		case 'number':
			return 0;
			break;
		case 'boolean':
			return false;
			break;
		case 'object':
			return {};
			break;
		case 'array':
			return [];
			break;
		case 'datetime':
			return new Date();
			break;
		default:
			return '';
			break;
	}
}

// This is old code using regex.
// function _intermediate(tpl) {
// 		var separator = _separator(tpl);

// 		tpl = tpl.replace(/[\r\n\t]/g, '')
// 			.replace(/<#(\w+)\s*?((?:\(.*?\)|[^>])*?)>/g, separator + '<#' + separator + '$1' + separator + '$2' + separator)
// 			.replace(/<\/#([^>]+)>/g, separator + '</#' + separator + '$1' + separator)
// 			.replace(/\$\{((?:r(?:".*?"|'.*?')|[^\}]*)*)\}/g, separator + '${' + separator + '$1' + separator)
// 			.replace(/<#--(.*?)-->/g, separator + '<#--' + separator + '$1' + separator);
// 		return tpl.split(separator);
// }
/////////////////////////////////////////////////////////////////////////
// Recognize the main blocks (<#, <#--, ${, <@...) of template and return an array.
// INPUT:
// 		<#if user??><h1>Welcome ${user}!</h1></#if>
// OUTPUT:
// 		<#
// 		if
// 		user??
// 		<h1>Welcome 
// 		${
// 		user
// 		!</h1>
// 		</#
// 		if
function _intermediate(tpl) {
	var result = [], i = 0, count = tpl.length, character = '', cache = [], tmp;

	tpl = tpl.replace(/[\r\n\t]/g, '');
	
	function readExpressionUtil(regex) {
		var rt = _readExpressionUtil(i, tpl, regex);		
		i = rt[0];
		cache = cache.concat(rt[1]);
		if (cache.length === 0) {
			result.push('');
		} else {
			flushCache();
		}
	}

	function readComments() {
		while (i < count) {
			character = tpl.charAt(i);
			if (character === '-' && tpl.charAt(i + 1) === '-' && tpl.charAt(i + 2) === '>') {
				// Find it.
				i += 3;
				flushCache();
				return;
			}
			i++;
			cache.push(character);
		}
	}

	function flushCache() {
		if (cache.length > 0) {
			result.push(cache.join(''));
			cache = [];
		}
	}
	
	// Start from the index - i
	function startWith(str) {
		var j = 0, count = str.length;
		for(; j < count; j++) {
			if(tpl.charAt(i + j) !== str.charAt(j)) {
				return false;
			}
		}
		return true;
	}

	while (i < count) {
		character = tpl.charAt(i);
		if (character === '<') {
			if (startWith('<#--')) {
				i += 4;
				flushCache();
				result.push('<#--');
				readComments();
				continue;
			} else if (startWith('<#')) {
				i += 2;
				flushCache();
				result.push('<#');
				// <#elseif isOK >
				readExpressionUtil(/[\s>]/);
				// Match the following situation: <#else> 
				if (tpl.charAt(i - 1) === '>') {
					i--;
				}
				readExpressionUtil('>');
				continue;
			} else if (startWith('</#')) {
				i += 3;
				flushCache();
				result.push('</#');
				readExpressionUtil('>');
				continue;
			} else if(startWith('<@')) {
				i += 2;
				flushCache();
				result.push('<@');
				// This trick is the same when processing the '<#' command. 
				// <@test foo="a" bar="b" baaz=5*5-2/>
				// <@test> <@test >
				// <@test/> <@test/>
				readExpressionUtil(/[\/\s>]/);
				if (tpl.charAt(i - 1) === '>' || tpl.charAt(i - 1) === '/') {
					i--;
				}
				readExpressionUtil('>');
				if (tpl.charAt(i - 2) === '/') {
					tmp = result[result.length - 1];
					result[result.length - 1] = tmp.substr(0, tmp.length - 1);
				} else {
					// This user command has nested content, so we specify another tag to identify it.
					result[result.length - 3] = '<@@';
				}
				continue;
			} else if(startWith('</@')) {
				i += 3;
				flushCache();
				result.push('</@');
				readExpressionUtil('>');
				continue;
			}
		} else if (character === '$') {
			if (startWith('${')) {
				i += 2;
				flushCache();
				result.push('${');
				readExpressionUtil('}');
				continue;
			}
		}
		i++;
		cache.push(character);
	}
	flushCache();

	return result;
}

// Return the function body of a given tempalte.	
// INPUT: 
//		<h1>Welcome ${user!"Anonymous"}!</h1>
// OUTPUT: 
// 	["__o.push('<h1>Welcome ');__o.push(_defaultValue(user, "Anonymous"));__o.push('!</h1>');", "macro1", "macro2"]
function _scriptsContent(tpls) {
	if(typeof(tpls) === 'string') {
		tpls = _intermediate(tpls);
	}
	// macros - macro names inside this script block.
	// assigns - assign names inside this script block.(Include local names, we don't distinguish assign from local variables)
	var i, count = tpls.length, tpl, body = [], macros = [], assigns = [];
	
	// Used by startCommandAssign & startUserCommand & startCommandMacro & startCommandFunction
	// INPUT: 'foo="a" bar="b" baaz=5*5-2 minPageDisabled="class=\"disabled\""'
	// OUTPUT: ["foo", ""a"", "bar", ""b"", "baaz", "5*5-2", "minPageDisabled", ""class="disabled"""]
	function parseKeyValueParis_(value) {
		var j = 0, count = value.length, cache = [], expr, part, tmpLastIndex;
		while(j < count) {
			expr = _readExpressionUtil(j, value, '=');
			part = _trim(expr[1].join(''));
			if(j === 0) {
				if(part.indexOf(' ') === -1) {
					// First element - 'foo'
					cache.push(part);
				} else {
					// We also need to support the following 2 examples.
					// Parameters without default value must precede parameters with default value
					// Example 1: <#function avg x y z = 3 * 4 >, part is 'avg x y z'
					// Example 2: <#macro greet person color="black">, part is 'greet person color'
					var ids = part.split(' '), id, k = 0, idscount = ids.length;
					for(; k < idscount; k++) {
						id = _trim(ids[k]);
						if(id) {
							cache.push(id);
							cache.push(undefined);
						}
					}
					// Popup the latest element, that's undefined.
					if(value.charAt(expr[0] - 1) === '=') {
						cache.pop();
					}
				}
			} else if(expr[0] === count) {
				// Last element - '"class=\"disabled\""'
				cache.push(_expression(part));
			} else {
				tmpLastIndex = part.lastIndexOf(' ');
				if(tmpLastIndex > 0) {
					cache.push(_trim(part.substr(0, tmpLastIndex)));
					cache.push(_expression(part.substr(tmpLastIndex + 1)));
				}
			}
			j = expr[0];
		}
		// Now, cache = ["foo", ""a"", "bar", ""b"", "baaz", "5*5-2", "minPageDisabled", ""class="disabled"""]
		// For this case: <#function avg x y z = 3 * 4 >
		// cache = ["avg", undefined, "x", undefined, "y", undefined, "z", 3 * 4]
		return cache;
	}
	
	// Used by startCommandMacro & startUserCommand
	// From '<#macro' to '</#macro'
	// From '<@test' to '</@test'
	function moveforwardUtil_() {
		var rt = [], args = arguments, count = args.length;
		function matchArguments() {
			var j = 0;
			for(; j < count; j++) {
				if(tpls[i + j] !== args[j]) {
					return false;
				}
			}
			return true;
		}
		// Becareful to modify the index(i), we are not supposed to modify this field.
		i++;
		while(1){
			if(matchArguments()) {
				break;
			}
			rt.push(tpls[i]);
			i++;
		}
		i++;	// Make sure the pointer is on the end of macro. Point to the second item in ['</#', 'macro'].
		return rt;
	}

	function startCommandAssign(value) {
		// The following piece code has bugs, which cann't read string like this: 
		// 'foo="a" bar="b" baaz=5*5-2 minPageDisabled="class=\"disabled\""'
		/* 
		var separator = _separator(value), segs, count, j, result = [];
		value = value.replace(/\b(\w+)\s*?=/g, separator + '$1' + separator).substr(1);
		segs = value.split(separator);
		count = segs.length;
		if (count % 2 === 0) {
			for (j = 0; j < count; j++) {
				result.push('var ' + segs[j] + '=' + _expression(segs[j + 1]) + ';');
				j++;
			}
		}
		return result.join('');
		*/
		var values = parseKeyValueParis_(value), name, j, count = values.length, rt = [];
		for (j = 0; j < count; j += 2) {
			name = values[j];
			if(_inArray(name, assigns) === -1) {
				assigns.push(name);
				rt.push('var ');
			}
			rt.push(name + '=' + _expression(values[j + 1]) + ';');
		}
		return rt.join('');
	}
	
	// ['<#', 'list', 'columns as column' ...]
	// value = 'columns as column'
	function startCommandList(value) {
		var regs, listName, loopName, loopIndexName, loopHasNextName, rt = [];
		regs = /(.*?)\s+as\s+([$\w]+)/.exec(value);
		if (regs && regs.length && regs.length === 3) {
			listName = _expression(regs[1]);
			loopName = regs[2];
			loopIndexName = loopName + '_index';
			loopHasNextName = loopName + '_has_next';

			rt.push('(function(){');
			if (!/^\w+$/.test(listName)) {
				rt.push('var _list=' + listName + ';');
				listName = '_list';
			}
			rt.push(['var __i=0', '__count=' + listName + '.length', loopName, loopIndexName, loopHasNextName + ';'].join(','));
			rt.push('for(;__i<__count;__i++){');
			rt.push(loopName + '=' + listName + '[__i];');
			rt.push(loopIndexName + '=__i;');
			rt.push(loopHasNextName + '=(__i!==__count-1);');
		}
		return rt.join('');
	}
	
	function startCommandImport(value) {
		// TODO: logic same as the list command.
		var regs, importFile, paramName;
		regs = /(.*?)\s+as\s+([$\w]+)/.exec(value);
		if (regs && regs.length && regs.length === 3) {
			importFile = _expression(regs[1]);
			paramName = regs[2];
			
			return 'var '+ paramName +'=template.res('+ importFile +')(null, true);';
		}
		return '';
	}
	
	// ['<#', 'macro', 'mkTabs tabs current id', ... '</#', 'macro']
	// value = 'mkTabs tabs current id'
	function startCommandMacro(value) {
		// Calculate name and default parameters.
		var rt = [], paramName, paramInitCode = [], arr = [], values, name, j, count, itemName, itemValue;
		values = parseKeyValueParis_(value);
		name = values[0];
		paramName = '__d' + '_' + name;
		macros.push(name);
		
		// Calculate the default params.
		count = values.length;
		for(j = 2; j < count; j += 2) {
			itemValue = values[j+1];
			if(itemValue) {
				itemName = paramName + '.' + values[j];
				paramInitCode.push(itemName + '=' + itemName + '||' + itemValue + ';');
			}				
		}
		arr = moveforwardUtil_('</#', 'macro');
		// function test(__d_test){ ### }
		rt.push(_scripts(arr, true, name, paramInitCode.join('')));
		
		return rt.join('');
	}
	
	// <#function avg x y>
	function startCommandFunction(value) {
		// Calculate name and default parameters.
		var rt = [], params = [], paramInitCode = [], arr = [], values, name, j, count, itemName, itemValue, scripts;
		values = parseKeyValueParis_(value);
		name = values[0];
		
		count = values.length;
		for(j = 2; j < count; j += 2) {
			itemName = values[j];
			itemValue = values[j+1];
			params.push(itemName);
			if(itemValue) {
				paramInitCode.push(itemName + '=' + itemName + '||' + itemValue + ';');
			}				
		}
		
		arr = moveforwardUtil_('</#', 'function');
		scripts = _scriptsContent(arr);
		
		// function test(parameter1, parameter2, parameter3...){ ### }
		rt.push('function '+ name +'(' + params.join(',') + '){');
		rt.push(paramInitCode.join(''));
		rt.push(scripts[0]);
		rt.push('}');
		
		return rt.join('');
	}
	
	// value = '' or '2' or 'x, x/2, x==count'
	function startCommandNested(value) {
		var rt = [], j = 0, count = value.length, cache = [], expr;
		rt.push('__nested(');
		if(value) {
			while(j < count) {
				expr = _readExpressionUtil(j, value, ',');
				cache.push(_expression(expr[1].join('')));
				j = expr[0];
			}
			
			j = 0;
			count = cache.length;
			for(; j < count; j++) {
				rt.push(cache[j]);
				rt.push(',');
			}
			rt[rt.length - 1] = ')';
		} else {
			rt.push(')');
		}
		
		return rt.join('');
	}

	// We are not suppose to modify the index(i) inside this function.
	function startCommand(name, value) {
		value = _trim(value);
		switch (name) {
			case 'if':
				body.push('if(' + _expression(value) + '){');
				break;
			case 'else':
				body.push('}else{');
				break;
			case 'elseif':
				body.push('}else if(' + _expression(value) + '){');
				break;
			case 'switch':
				body.push('switch(' + _expression(value) + '){');
				break;
			case 'case':
				body.push('case ' + _expression(value) + ':');
				break;
			case 'break':
				body.push('break;');
				break;
			case 'default':
				body.push('default:');
				break;
			case 'local':
			case 'assign':
				body.push(startCommandAssign(value));
				break;
			case 'list':
				body.push(startCommandList(value));
				break;
			case 'include':
				pushValue('template.res(' + value + ')(__d)');
				break;
			case 'import':
				body.push(startCommandImport(value));
				break;
			case 'macro':
				body.push(startCommandMacro(value));
				break;
			case 'nested':
				pushValue(startCommandNested(value));
				break;
			case 'function':
				body.push(startCommandFunction(value));
				break;
			case 'return':
				if(value) {
					body.push('return '+ _expression(value) + ';');
				} else {
					body.push('return __o.join("");');
				}
				break;
			default:
				break;
		}
	}

	function endCommand(name) {
		switch (name) {
			case 'if':
			case 'switch':
				body.push('}');
				break;
			case 'list':
				body.push('}})();');
				break;
			default:
				break;
		}
	}
	
	// Example 1: <@my.test foo="a" bar="b" baaz=5*5-2 />
	// 		INPUT - name = 'my.test' 
	// 		INPUT - value = 'foo="a" bar="b" baaz=5*5-2'
	// 		OUTPUT: my.test({foo: "a", bar: "b", baaz: 5 * 5 - 2})
	// Example 2: <@repeat count=4 ; c, halfc, last>
	function startUserCommand(type, name, value) {
		var values, j, count, rt = [], arr = [], paramsIndex, params, scripts;
		
		// Simple split the value using the ';', then we need to check the second half contains "'" or '"'.
		// It's safe to do so, because the second half are all parameters name. Only characters are allowed.
		// We don't to convert expression for these params either(c, halfc, last).
		paramsIndex = value.lastIndexOf(';');
		if(paramsIndex >= 0) {
			params = value.substr(paramsIndex + 1);
			if(params.indexOf('"') === -1 && params.indexOf("'") === -1) {
				value = value.substr(0, paramsIndex);
			}			
		}
		
		// Example 2, value becomes 'count=4' 
		values = parseKeyValueParis_(value);
		count = values.length;
		rt.push(name);
		rt.push('({');
		for (j = 0; j < count; j += 2) {
			rt.push(values[j]);
			rt.push(':');
			rt.push(_expression(values[j + 1]));
			if(j < count-2) {
				rt.push(',');
			}
		}
		rt.push('}');
		if(type === '<@') {
			rt.push(')');
		} else {
			rt.push(',');
			
			arr = moveforwardUtil_('</@', name);
			// function(c, halfc, last){ ### }
			scripts = _scriptsContent(arr);
			rt.push('function(' + params + '){');
			rt.push('var __o=[];');
			rt.push(scripts[0]);
			rt.push('return __o.join("");');
			rt.push('}');
			
			rt.push(')');
		}
		
		pushValue(rt.join(''));
	}

	function pushValue(value) {
		body.push("__o.push(" + value + ");");
	}

	function pushStr(str) {
		if (_trim(str) === '') {
			return;
		}
		str = str.replace(/'/g, "\\'");
		if (str !== '') {
			body.push("__o.push('" + str + "');");
		}
	}
	
	
	// Main content of _scripts function.
	i = 0;
	while(i < count) { 
		tpl = tpls[i];
		switch (tpl) {
			case '<#':
				// ['<#', 'list', 'columns as column', 'OK']
				// After the execution of the following line, i point to the 'columns as column'.
				startCommand(tpls[++i], tpls[++i]);
				break;
			case '</#':
				endCommand(tpls[++i]);
				break;
			case '<#--':
				// ['<#--', 'This is the comments line', ...]
				i++;
				break;
			case '${':
				pushValue(_expression(tpls[++i]));
				break;
			case '<@@':
			case '<@':
				// ['<@', 'test', 'foo="a" bar="b" baaz=5*5-2' ... 
				startUserCommand(tpl, tpls[++i], tpls[++i]);
				break;
			default:
				pushStr(tpl);
				break;
		}
		i++;
	}

	return [body.join('')].concat(macros);
}

// Return the function body of a given tempalte.	
// INPUT: 
//		<h1>Welcome ${user!"Anonymous"}!</h1>
// OUTPUT: 
// 		var __o = [];
// 		with(__d) {
// 			__o.push('<h1>Welcome ');
// 			__o.push(_defaultValue(user, "Anonymous"));
// 			__o.push('!</h1>');
// 		};
// 		return __o.join('');
function _scripts(tpls, insideMacro, macroName, paramInitCode) {
	var rt = [], scripts = _scriptsContent(tpls);
	var firstParam = '__d';
	
	// Check the test file - tests/include.htm
	if(insideMacro) {
		firstParam += '_' + macroName; 
		rt.push('function ');
		rt.push(macroName);
		rt.push('(' + firstParam + ',__nested)');
		rt.push('{');
	}
	
	rt.push('var __o=[];');
	rt.push(firstParam + '=' + firstParam + '||{};');
	rt.push(paramInitCode);
	rt.push('with(' + firstParam + '){');
	rt.push(scripts[0]);
	rt.push('}');
	
	if(insideMacro) {
		rt.push('return __o.join("");');
		rt.push('}');
	} else {
		// Don't return the if-else, if there is no macros inside this script.
		var count = scripts.length, i, scriptsItem;
		if(count > 1) {
			
			rt.push('if(!__macro){return __o.join("");}');
			rt.push('else{return {');
			rt.push('__result: __o.join("")');
			
			rt.push(',');
			for(i=1; i<count; i++) {
				scriptsItem = scripts[i];
				rt.push(scriptsItem +': '+ scriptsItem);
				if(i !== count - 1) {
					rt.push(',');
				}
			}
			rt.push('}}');
		} else {
			rt.push('return __o.join("");');
		}
	}
	
	return rt.join('');
}


/////////////////////////////////////////////////////////////////////////
// Extention for precise expression decode and parser.
// For example default value support(??, !), builtins for strings(?substr, ?html).
function _expression(value) {
	value = _trim(value);
	// sepcialChars include '?', '??', '!', '..'
	if (value.indexOf('?') === -1 &&
		value.indexOf('!') === -1 &&
		value.indexOf('..') === -1) {
		// There is no special char at all, return the expression unchanged.
		return value;
	}
	
	var result = [], tokens, i, count, token, chars;

	tokens = _tokens(value);
	chars = _sepcialChars(tokens);

	_extendTokens(tokens, chars);

	for (i = 0, count = tokens.length; i < count; i++) {
		token = tokens[i];
		if (typeof (token[2]) !== 'undefined') {
			result.push(token[2]);
		} else {
			result.push(token[1]);
		}
	}
	return result.join('');
}

function _sepcialChars(tokens) {
	// sepcialChars include '?', '??', '!', '..'
	var chars = { '?': [], '??': [], '!': [], '..': [] };
	var i = 0, count = tokens.length, token, nextToken, predictToken, previousStart, nextEnd, questionPositions;
	var STARTREGION = /[\[{(]/, ENDEGION = /[\]})]/;

	function getToken(index) {
		if (index < count) {
			return tokens[index];
		}
		return null;
	}

	function oppositeRegionChar(char1, char2) {
		return _inArray(char1 + char2, ['[]', '][', '{}', '}{', '()', ')(']) >= 0;
	}

	function getPreviousStart(start) {
		var i = start, token, stack = [];
		for (; i >= 0; i--) {
			token = tokens[i];
			if (stack.length > 0) {
				if (token[0] === 'punctuation') {
					if (STARTREGION.test(token[1])) {
						if (oppositeRegionChar(token[1], stack[stack.length - 1])) {
							stack.pop();
						}
					} else if (ENDEGION.test(token[1])) {
						stack.push(token[1]);
					}
				}
			} else {
				if (token[0] === 'opeartor') {
					break;
				} else if (token[0] === 'punctuation') {
					if (STARTREGION.test(token[1])) {
						break;
					}
					else if (ENDEGION.test(token[1])) {
						stack.push(token[1]);
					}
				}
			}
		}
		return i + 1;
	}

	function getNextEnd(start) {
		var i = start, token, stack = [];
		for (; i < count; i++) {
			token = tokens[i];
			if (stack.length > 0) {
				if (token[0] === 'punctuation') {
					if (ENDEGION.test(token[1])) {
						if (oppositeRegionChar(token[1], stack[stack.length - 1])) {
							stack.pop();
						}
					} else if (STARTREGION.test(token[1])) {
						stack.push(token[1]);
					}
				}
			} else {
				if (token[0] === 'opeartor') {
					break;
				} else if (token[0] === 'punctuation') {
					if (ENDEGION.test(token[1])) {
						break;
					}
					else if (STARTREGION.test(token[1])) {
						stack.push(token[1]);
					}
				}
			}
		}
		return i - 1;
	}

	for (; i < count; i++) {
		token = tokens[i];
		if (token[0] === 'opeartor') {
			if (token[1] === '?') {
				nextToken = getToken(i + 1);
				if (nextToken && nextToken[0] === 'opeartor' && nextToken[1] === '?') {
					previousStart = getPreviousStart(i - 1);
					chars['??'].push([previousStart, i]);
					i++;
				} else {
					previousStart = getPreviousStart(i - 1);
					nextEnd = getNextEnd(i + 1);
					predictToken = getToken(nextEnd + 1);
					// Exclude x ? x : "default"
					if (predictToken && predictToken[0] === 'opeartor' && predictToken[1] === ':') {
						continue;
					}
					questionPositions = [previousStart, i, nextEnd];
					while (predictToken && predictToken[0] === 'opeartor' && predictToken[1] === '?') {
						nextEnd = getNextEnd(nextEnd + 2);
						questionPositions.push(nextEnd);
						predictToken = getToken(nextEnd + 1);
					}
					chars['?'].push(questionPositions);
					// Skip these builtins after ?
					i = nextEnd;
				}
			} else if (token[1] === '!') {
				nextToken = getToken(i + 1);
				if (nextToken && nextToken[0] === 'opeartor' && nextToken[1] === '=') {
					continue;
				}
				previousStart = getPreviousStart(i - 1);
				nextEnd = getNextEnd(i + 1);
				// Exclude  !finished
				if (previousStart !== i) {
					// mouse!
					if (nextEnd === i) {
						chars['!'].push([previousStart, i]);
					} else {
						chars['!'].push([previousStart, i, nextEnd]);
					}
				}
			}
		} else if (token[0] === 'punctuation') {
			if (token[1] === '.') {
				nextToken = getToken(i + 1);
				if (nextToken && nextToken[0] === 'punctuation' && nextToken[1] === '.') {
					previousStart = getPreviousStart(i - 1);
					nextEnd = getNextEnd(i + 2);
					chars['..'].push([previousStart, i, nextEnd]);
					i++;
				}
			}
		}
		/*
		else if (token[0] === 'word') {
		if (token[1] === 'r') {
		nextToken = getToken(i + 1);
		if (nextToken && nextToken[0] === 'string') {
		chars['r'].push(i);
		}
		}
		}*/
	}
	return chars;
}

function _tokens(value) {
	var tokens = [], i = 0, count = value.length, character = '', cache = [];
	// 'word', 'string', 'opeartor', 'punctuation', 'number'
	var PUNCTUATION = /[\[\]{}\(\)\.]/, OPERATOR = /[+\-*\/&%=<>!?|,;\:]/, WORD = /[\w\$]/, NUMBER = /[0-9]/;

	function next() {
		if (i < count) {
			var ch = value.charAt(i);
			cache.push(ch);
			i++;
			return ch;
		}
		return null;
	}

	function peek() {
		if (i < count) {
			return value.charAt(i);
		}
		return null;
	}

	function nextWhileRegex(regex) {
		while (i < count) {
			character = peek();
			if (regex.test(character)) {
				next();
			} else {
				break;
			}
		}
	}

	function nextUntil(ch) {
		while (i < count) {
			character = next();
			if (character === ch) {
				break;
			}
		}
	}

	function endWord() {
		if (cache.length > 0) {
			tokens.push(['word', cache.join('')]);
			cache = [];
		}
	}

	function readString(separator) {
		next();
		nextUntil(separator);
		tokens.push(['string', cache.join('')]);
		cache = [];
	}

	function readNumber(num) {
		next();
		nextWhileRegex(NUMBER);
		if (value[i] === '.' && value[i + 1] === '.') {
			// end of number
		} else {
			if (value[i] === '.') {
				next();
				nextWhileRegex(NUMBER);
			}
			if (value[i] === 'e' || value[i] === 'E') {
				next();
				if (value[i] === '-') {
					next();
				}
				nextWhileRegex(NUMBER);
			}
		}
		tokens.push(['number', cache.join('')]);
		cache = [];
	}

	while (i < count) {
		character = value.charAt(i);
		if (PUNCTUATION.test(character)) {
			endWord();
			tokens.push(['punctuation', character]);
			i++;
		} else if (OPERATOR.test(character)) {
			endWord();
			tokens.push(['opeartor', character]);
			i++;
		} else if (character === "'" || character === '"') {
			endWord();
			readString(character);
		} else if (NUMBER.test(character)) {
			endWord();
			readNumber(character);
		} else {
			if (character !== ' ') {
				cache.push(character);
			}
			i++;
		}
	}
	endWord();

	return tokens;
}

function _extendTokens(tokens, chars) {
	var i, j, count, token, countj;
	var charKey, charValue, pos, currentPos, nextPos, nextToken;

	for (charKey in chars) {
		if (chars.hasOwnProperty(charKey)) {
			charValue = chars[charKey];
			for (i = 0, count = charValue.length; i < count; i++) {
				pos = charValue[i];
				if (charKey === '??') {
					tokens[pos[0]][2] = 'template.exists(' + tokens[pos[0]][1];
					tokens[pos[1]][2] = ')';
					tokens[pos[1] + 1][2] = '';
				} else if (charKey === '!') {
					if (pos.length === 2) {
						tokens[pos[0]][2] = 'template.defaultValue(' + tokens[pos[0]][1];
						tokens[pos[1]][2] = ')';
					} else {
						tokens[pos[0]][2] = 'template.defaultValue(' + tokens[pos[0]][1];
						tokens[pos[1]][2] = ',';
						tokens[pos[2]][2] = tokens[pos[2]][1] + ')';
					}
				} else if (charKey === '?') {
					// x?seq_contains("16")?string("yes", "no")
					// 0    word            x
					// 1    opeartor        ?
					// 2    word            seq_contains
					// 3    punctuation     (
					// 4    string          "16"
					// 5    punctuation     )
					// 6    opeartor        ?
					// 7    word            string
					// 8    punctuation     (
					// 9    string          "yes"
					// 10   opeartor        ,
					// 11   string          "no"
					// 12   punctuation     )
					// ? [0,1,5,12]
					tokens[pos[0]][2] = 'template.builtins(' + tokens[pos[0]][1];
					for (j = 1, countj = pos.length - 1; j < countj; j++) {
						currentPos = pos[j] + 1;
						if (j === 1) {
							currentPos--;
						}
						// currentPos -> 1, 6
						tokens[currentPos][2] = ',';
						currentPos++;
						// nextPos -> 5, 12
						nextPos = pos[j + 1];
						tokens[currentPos][2] = '[\'' + tokens[currentPos][1];
						while (currentPos < nextPos && (nextToken = tokens[currentPos + 1]) && !(nextToken[0] === 'punctuation' && nextToken[1] === '(')) {
							currentPos++;
						}
						tokens[currentPos][2] = typeof (tokens[currentPos][2]) === 'undefined' ? tokens[currentPos][1] : tokens[currentPos][2] + '\'';
						// 5, 12
						if (currentPos === nextPos) {
							tokens[currentPos][2] += ']';
						} else {
							tokens[currentPos + 1][2] = ',';
							tokens[nextPos][2] = ']';
						}
					}
					tokens[pos[pos.length - 1]][2] += ')';
				} else if (charKey === '..') {
					tokens[pos[0]][2] = 'template.sequence(' + tokens[pos[0]][1];
					tokens[pos[1]][2] = ',';
					tokens[pos[1] + 1][2] = '';
					tokens[pos[2]][2] = tokens[pos[2]][1] + ')';
				}
			}
		}
	}
}

// Built-ins for Strings
/////////////////////////////////////////////////////////////////////////
function _builtin_substring(param, args) {
	return String.prototype.substring.apply(param, args);
}

function _builtin_substr(param, args) {
	return String.prototype.substr.apply(param, args);
}

function _builtin_cap_first(param, args) {
	var segs = param.split(' '), seg, i = 0, count = segs.length;
	for (; i < count; i++) {
		seg = segs[i];
		if (seg !== '') {
			segs[i] = seg[0].toUpperCase() + seg.substr(1);
			break;
		}
	}
	return segs.join(' ');
}

function _builtin_uncap_first(param, args) {
	var segs = param.split(' '), seg, i = 0, count = segs.length;
	for (; i < count; i++) {
		seg = segs[i];
		if (seg !== '') {
			segs[i] = seg[0].toLowerCase() + seg.substr(1);
			break;
		}
	}
	return segs.join(' ');
}

function _builtin_capitalize(param, args) {
	var segs = param.split(' '), seg, i = 0, count = segs.length;
	for (; i < count; i++) {
		seg = segs[i];
		if (seg !== '') {
			segs[i] = seg[0].toUpperCase() + seg.substr(1).toLowerCase();
		}
	}
	return segs.join(' ');
}

function _builtin_upper_case(param, args) {
	return param.toUpperCase();
}

function _builtin_lower_case(param, args) {
	return param.toLowerCase();
}

function _builtin_ends_with(param, args) {
	var index = param.lastIndexOf(args[0]);
	if (index >= 0 && (index + args[0].length === param.length)) {
		return true;
	}
	return false;
}

function _builtin_starts_with(param, args) {
	var index = param.indexOf(args[0]);
	if (index === 0) {
		return true;
	}
	return false;
}

function _builtin_html(param, args) {
	return param.replace(/&/ig, '&amp;')
		.replace(/</ig, '&lt;')
		.replace(/>/ig, '&gt;')
		.replace(/"/ig, '&quot;');
}

function _builtin_contains(param, args) {
	return _builtin_index_of() !== -1;
}

function _builtin_index_of(param, args) {
	return String.prototype.indexOf.apply(param, args);
}

function _builtin_last_index_of(param, args) {
	return String.prototype.lastIndexOf.apply(param, args);
}

function _builtin_length(param, args) {
	return param.length;
}

function _builtin_left_pad(param, args) {
	var paramCount = param.length, padCount = args[0], padstr = args[1] || ' ', padstrCount = padstr.length;
	if (paramCount >= padCount) {
		return param;
	}

	var result = [], leftCount = padCount - paramCount;
	do {
		if (padstrCount > leftCount) {
			result.push(padstr.substr(0, leftCount));
			leftCount = 0;
		} else {
			result.push(padstr);
			leftCount -= padstrCount;
		}
	} while (leftCount > 0);
	result.push(param);
	return result.join('');
}

function _builtin_right_pad(param, args) {
	var paramCount = param.length, padCount = args[0], padstr = args[1] || ' ', padstrCount = padstr.length;
	if (paramCount >= padCount) {
		return param;
	}

	var result = [], leftCount = padCount - paramCount, increaseCount = 0;
	do {
		result.push(padstr);
		increaseCount += padstrCount;
	} while (increaseCount < padCount);

	return param + result.join('').substr(paramCount, leftCount);
}

function _builtin_replace(param, args) {
	var flags = args[2] || 'g';
	if (flags.indexOf('g') === -1) {
		flags += 'g';
	}
	if (flags.indexOf('f') >= 0) {
		flags = flags.replace(/[fg]/g, '')
	}
	return String.prototype.replace.apply(param, [new RegExp(args[0], flags), args[1]]);
}

function _builtin_url(param, args) {
	return encodeURIComponent(param);
}

function _builtin_split(param, args) {
	var flags = args[1] || '';
	return String.prototype.split.apply(param, [new RegExp(args[0], flags)]);
}

function _builtin_string(param, args) {
	return param + '';
}

function _builtin_trim(param, args) {
	return _trim(param);
}

function _builtin_word_list(param, args) {
	var result = [], segs = param.split(' '), seg, i = 0, count = segs.length;
	for (; i < count; i++) {
		seg = segs[i];
		if (seg !== '') {
			result.push(seg);
		}
	}
	return result;
}

function _builtin_xhtml(param, args) {
	return _builtin_html().replace(/'/ig, '&#39;');
}

function _builtin_xml(param, args) {
	return _builtin_html().replace(/'/ig, '&apos;');
}

// Built-ins for Numbers
/////////////////////////////////////////////////////////////
function _builtin_size(param, args) {
	return param.length;
}

function _builtin_int(param, args) {
	return param > 0 ? Math.floor(param) : Math.ceil(param);
}

function _builtin_round(param, args) {
	return Math.round(param);
}

function _builtin_floor(param, args) {
	return Math.floor(param);
}

function _builtin_ceiling(param, args) {
	return Math.ceiling(param);
}


function _builtin(param, name, args) {
	// Avoid use of eval, we should use a mapping object. 
	// This can also avoid errors when compressing JS using Google Closure.
	var mappings = {
		'substring': _builtin_substring,
		'substr': _builtin_substr,
		'cap_first': _builtin_cap_first,
		'uncap_first': _builtin_uncap_first,
		'capitalize': _builtin_capitalize,
		'upper_case': _builtin_upper_case,
		'lower_case': _builtin_lower_case,
		'ends_with': _builtin_ends_with,
		'starts_with': _builtin_starts_with,
		'html': _builtin_html,
		'contains': _builtin_contains,
		'index_of': _builtin_index_of,
		'last_index_of': _builtin_last_index_of,
		'length': _builtin_length,
		'left_pad': _builtin_left_pad,
		'right_pad': _builtin_right_pad,
		'replace': _builtin_replace,
		'url': _builtin_url,
		'split': _builtin_split,
		'string': _builtin_string,
		'trim': _builtin_trim,
		'word_list': _builtin_word_list,
		'xhtml': _builtin_xhtml,
		'xml': _builtin_xml,
		'size': _builtin_size,
		// builtins for number
		'int': _builtin_int,
		'round': _builtin_round,
		'floor': _builtin_floor,
		'ceiling': _builtin_ceiling
	};
	return mappings[name](param, args);
}


// Main function.
/////////////////////////////////////////////////////////////////////////
function template(tpl, data) {
	if (typeof (data) === 'undefined') {
		try {
			if (_cache[tpl]) {
				var scripts = _cache[tpl];
			}else {
				var tpls = _intermediate(tpl), scripts = _scripts(tpls);
				_cache[tpl]=scripts;	
			}
			return new Function('__d', '__macro', scripts);			
		} catch (e) {
			_log('template(tpl) error:', e, tpl);
		}
	} else {
		try {
			return template(tpl)(data);
		} catch (e) {
			_log('template(tpl)(data) error:', e, tpl, data);
		}
	}
}

/////////////////////////////////////////////////////////////////////////
var _res = {};

template.res = function(key, tpl_fn){
	if(typeof(tpl_fn) === 'undefined') {
		return _res[key];
	} else if(typeof(tpl_fn) === 'string'){
		_res[key] = template(tpl_fn);
	} else {
		_res[key] = tpl_fn;
	}
};


// Functions used inside the expression.
/////////////////////////////////////////////////////////////
template.exists = function(value) {
	return typeof (value) !== 'undefined';
};

template.defaultValue = function(value, defaultValue) {
	if (template.exists(value)) {
		return value;
	} else {
		if (template.exists(defaultValue)) {
			return defaultValue;
		} else {
			return _defaultValueForType(_getType(value));
		}
	}
};

template.sequence = function(start, end) {
	var i, result = [];
	for (var i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
};

template.builtins = function() {
	var i, count = arguments.length, result, args, name;
	result = arguments[0];
	for (i = 1; i < count; i++) {
		args = Array.prototype.slice.call(arguments[i], 0);
		name = Array.prototype.shift.call(args);
		result = _builtin(result, name, args);
	}
	return result;
};


	// Expose some interface to the outside world only for debug purpose.
	/////////////////////////////////////////////////////////////////////////
	// DONOT INVOKES THESE INTERFACES IN YOUR CODE!
	template._intermediate = _intermediate;
	template._scripts = _scripts;
	template._tokens = _tokens;
	template._sepcialChars = _sepcialChars;
	template._expression = _expression;
	template._extendTokens = _extendTokens;

	//EXPOSE
	return template;

});


/**
 * NOTES:
 *   - 修改自jMarker,在原基础上引入了缓存机制
 * 
 * 
 * 
 */