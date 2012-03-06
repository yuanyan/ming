/**
 * Class: query
 * DOM查询
 * 
 * Parameters:
 *  query - {String}
 *  context - {Object}
 *
 * Returns: 
 *	{NodeList}
 */
module("dom.query",function(require, exports, module){
	
	var NodeList = require("dom.NodeList"),
		Selector = require("dom.Selector");
	
    return  function(query, context){
       return new NodeList(Selector.select(query, context));
    };
	
	
	
});
