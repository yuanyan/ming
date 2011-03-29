module("dom.query",function(){
	
	var NodeList = module("dom.NodeList"), 
		Selector = module("dom.Selector");
	
	/**
	 * dom查询
	 * @param {String} query
	 * @param {Object} context
	 */	
    return  function(query, context){
       return new NodeList(Selector.select(query, context));
    };
	
	
	
});
