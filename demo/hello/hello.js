module.onReady(function(){
	var Dom = module("dom.Dom");
	Dom.create("div").html("<p>hello world!</p>").appendTo(document.body);
});