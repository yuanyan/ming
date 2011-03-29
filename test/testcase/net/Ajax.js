describe("net.Ajax", function() {
	
	beforeEach(function() {
		Ajax = module("net.Ajax"); 
	});
	
	
	it("Ajax.ajax",function(){
		
		Ajax.ajax({
            url: 'ajaxdemo.php',
            method: 'POST',
            data: {
                'id': '1'
            },
            //form: 'myForm',
            async: true, //默认所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
            cache: false,
            timeout: 100,
            //dataType:xml json text(html) 
            success: function(response, xhr, opts){
				console.log("ajax response:",response);
                expect(response).toEqual("1");
            },
            error: function(xhr, opts){
                console.log('server-side failure with status code ' + xhr.status);
            }
        });			
			

	});


	it("Ajax.get",function(){
		

		Ajax.get('ajaxdemo.php',{id:1},function(response, xhr, opts){
				console.log("get response:",response);
                expect(response).toEqual("1");
        });
			

	});

	it("Ajax.post",function(){

		Ajax.post('ajaxdemo.php',{id:1},function(response, xhr, opts){
				console.log("post response:",response);
                expect(response).toEqual("1");
        });
			


	});	
});		