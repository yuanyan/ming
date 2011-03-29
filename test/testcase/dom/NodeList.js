describe("dom.NodeList", function() {

	beforeEach(function() {  

	  NodeList =  module("dom.NodeList");
	  nodelist = new NodeList;
	});

	it("NodeList",function(){

		expect(NodeList).toBeTruthy();
	});

	it("NodeList.slice",function(){

		expect(NodeList.prototype.slice).toBeTruthy();
	});


	it("NodeList.each",function(){

		expect(NodeList.prototype.each).toBeTruthy();
	});	

	it("NodeList.html",function(){

		expect(NodeList.prototype.html).toBeTruthy();
	});	
	
	
	it("new NodeList",function(){
		expect(nodelist).toBeTruthy();
	});
	
	it("new NodeList",function(){
		expect(nodelist.add).toBeTruthy();
	});	
	
  /*
  it("should be empty",function(){
  	expert(window.JSON.stringify(array)).toEqual("[]");
  });
  
  it("should be trim",function(){
  	var str ="   abc   ";
  	expert(str.trim()).toEqual("abc");
  });
  
  it("should be trim",function(){
   expect(player.isPlaying).toBeFalsy();
   expect(player.isPlaying).toBeTruthy();
   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
   expect(function() {
        player.resume();
   }).toThrow("song is already playing");
  });     
 */

});