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
module("dom.query",function(){
	
	var NodeList = module("dom.NodeList"), 
		Selector = module("dom.Selector");
	
    return  function(query, context){
       return new NodeList(Selector.select(query, context));
    };
	
	
	
});
