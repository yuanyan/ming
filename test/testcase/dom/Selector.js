describe("dom.Selector", function() {


	it("Selector.query",function(){
			
		var  Selector = module("dom.Selector");	
		expect(Selector.select("#id1")).toBeTruthy();
		expect(Selector.select("div")).toBeTruthy();
		expect(Selector.select(".class1")).toBeTruthy();
		expect(Selector.select("div.class1")).toBeTruthy();
		expect(Selector.select("div#id1")).toBeTruthy();
		expect(Selector.select("body>div")).toBeTruthy();
		expect(Selector.select("body>div1")).toEqual([]);
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