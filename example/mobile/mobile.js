
!(function (factory) {
    if (typeof define === 'function') {
        define('$',['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
    return $;
});
define('tmpl',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
define('tmpl!tpl/footer.html',[],function () { return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<footer>footer</footer>\r\n';
}
return __p;
};});

define('tmpl!tpl/frame.html',[],function () { return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<h2>'+
((__t=( title ))==null?'':__t)+
'</h2>\r\n\r\n<p>'+
((__t=( content ))==null?'':__t)+
'</p>\r\n\r\n'+
(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<footer>footer</footer>\r\n';
}
return __p;
})()+
'\r\n';
}
return __p;
};});

require.config({
	baseUrl: '.',
	paths : {
        $:'../../src/jquery',
        jquery:'../../lib/jquery/jquery',
		'tmpl': '../../lib/require/tmpl'
	}	
})
	
require(['$', 'tmpl!tpl/frame.html'],function($, frameTpl){

	$(document).ready(function(){
		var pagebody = $("#pagebody");
		var themenu  = $("#navmenu");
		var topbar   = $("#toolbarnav");
		var content  = $("#content");
		var viewport = {
			width  : $(window).width(),
			height : $(window).height()
		};
		// retrieve variables as 
		// viewport.width / viewport.height
		
		function openme() { 
			$(function () {
				topbar.animate({
				   left: "290px"
				}, { duration: 300, queue: false });
				pagebody.animate({
				   left: "290px"
				}, { duration: 300, queue: false });
			});
		}
		
		function closeme() {
			var closeme = $(function() {
				topbar.animate({
					left: "0px"
				}, { duration: 180, queue: false });
				pagebody.animate({
					left: "0px"
				}, { duration: 180, queue: false });
			});
		}

		// checking whether to open or close nav menu
		$("#menu-btn").on("click", function(e){
			e.preventDefault();
			var leftval = pagebody.css('left');
			
			if(leftval == "0px") {
				openme();
			}
			else { 
				closeme(); 
			}
		});
		
		// loading page content for navigation
		$("a.navlink").on("click", function(e){
			e.preventDefault();
			var title  = $(this).text();
			var text   = "hi, this is " + title;			
			var imgloader   = '<center style="margin-top: 30px;"><img src="img/preloader.gif" alt="loading..." /></center>';
			
			closeme();
			
			$(function() {
				topbar.css("top", "0px");
				window.scrollTo(0, 1);
			});
			
			content.html(imgloader);
			
			
			setTimeout(function() { content.html( frameTpl({title:title, content: text}) ) }, 500);
		});
	});

});
define("js/main.js", function(){});
