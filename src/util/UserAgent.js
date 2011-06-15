/**
 * Clsss: UserAgent
 * 
 * 通常推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，
 * 比如if(document.addEventListener) 假设 IE9 支持标准事件，则代码不用修改，
 * 就自适应了“未来浏览器”。对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。
 * 当代码很明确就是针对已知特定浏览器的，同时并非是某个特性探测可以解决时，
 * 用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切皆权衡。
 * 
 */

module("util.UserAgent", function(global){
	var ie, firefox, chrome, opera, safari, ios, window, linux, osx, explored = false;
    
    (function(){
        if (explored) 
            return;
        explored = true;
		
		var UA= navigator.userAgent;
		//浏览器检测
        var b = /(?:MSIE.(\d+\.\d+))|(?:Firefox.(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(UA);
        //操作系统检测
		var os = /(Mac OS X)|(Windows)|(Linux)|(iPhone|iP[ao]d)/.exec(UA); 
		
		//浏览器识别
        if (b) {
			ie = b[1] ? parseFloat(b[1]) : NaN;
			if (ie >= 8 && !window.HTMLCollection) {
				ie = 7;
			}
			firefox = b[2] ? parseFloat(b[2]) : NaN;
			opera = b[3] ? parseFloat(b[3]) : NaN;
			safari = b[4] ? parseFloat(b[4]) : NaN;
			if (safari) {
				b = /(?:Chrome\/(\d+\.\d+))/.exec(UA);
				chrome = b && b[1] ? parseFloat(b[1]) : NaN;
			}
			else {
				chrome = NaN;
			}
		}else {
			ie = firefox = opera = chrome = safari = NaN;
		}
		//操作系统识别
        if (os) {
			osx = !!os[1];
			windows = !!os[2];
			linux = !!os[3];
			ios = !!os[4];
		}else {
			osx = windows = linux = ios = false;
		}
    })();
	
	
    
 	//EXPOSE   
    return {
        "ie": ie,
        "firefox": firefox,
        "opera": opera,
        "safari": safari,
        "chrome": chrome,
        "windows": windows,
        "osx": osx,
        "linux": linux,
        "ios": ios
    };
    
});