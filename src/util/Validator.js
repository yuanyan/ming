/**
 * Class: Validator
 */
module("util.Validator",function(global){
	
	var ALPHA = /^[a-zA-Z]+$/, //英文字符
		CHINESE = /^[\u2E80-\uFE4F]+$/,  // 中文字符
		INTEGER = /^[0-9]+$/, //整数   支持 001格式     /^[1-9][0-9]*$/
		NUMBER = /^[a-zA-Z]+$/,  //整数或浮点数
		POST =  /^[0-9]{6}$/, //邮政编码
		EMAIL=/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,  //邮箱   yuanyan.cao@gmail.com
		PID = /^[\d{15}|\d{18}]$/,  //身份证 15位和18位
		MOBILE =  /^1\d{10}$/,  //手机号码 1585817****
		TEL = /\d{3,4}-\d{7,8}/,//电话号码  0571-852947**
		URL = /^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, //URL地址 www.madscript.com		
		DATE = /^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/,//日期
		NAME = /^([\u4e00-\u9fa5|A-Z|\s]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5|A-Z|\s]|\u3007)+$/;//中文姓名
		
		
	var validate = function(str,pattern){	
		return pattern.test(str);
	};
	
	/**
	 * Function: isAlpha
	 * 英文字符验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isAlpha = function(str){	
		return validate(str,ALPHA);
	};

	/**
	 * Function: isChinese
	 * 中文字符验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isChinese = function(str){	
		return validate(str,CHINESE);
	};

	/**
	 * Function: isInteger
	 * 整数验证，支持 001格式
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isInteger = function(str){	
		return validate(str,INTEGER);
	};

	/**
	 * Function: isNumber
	 * 整数或浮点数验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isNumber = function(str){	
		return validate(str,NUMBER);
	};

	/**
	 * Function: isPost
	 * 邮政编码验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isPost = function(str){	
		return validate(str,POST);
	};

	/**
	 * Function: isEmail
	 * 邮箱格式验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */	
	var isEmail = function(str){
		return validate(str,EMAIL);
	};

	/**
	 * Function: isPid
	 * 身份证验证，15位或18位
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isPid = function(str){	
		return validate(str,PID);
	};

	/**
	 * Function: isMobile
	 * 手机号码验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isMobile = function(str){	
		return validate(str,MOBILE);
	};						

	/**
	 * Function: isTel
	 * 电话号码验证，格式：0571-852947**
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isTel = function(str){	
		return validate(str,TEL);
	};				

	/**
	 * Function: isUrl
	 * URL地址验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isUrl = function(str){	
		return validate(str,URL);
	};				

	/**
	 * Function: isDate
	 * 日期验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */
	var isDate = function(str){	
		return validate(str,DATE);
	};	

	/**
	 * Function: isName
	 * 中文姓名验证
	 * 
	 * Parameters:
	 * 	str - {String}
	 * 
	 * Returns: 
	 * 	{Boolean}
	 */	
	var isName = function(str){	
		return validate(str,NAME);
	};					
		
	//EXPOSE
	return {
		"isAlpha":isAlpha,
		"isChinese":isChinese,
		"isInteger":isInteger,
		"isNumber":isNumber,
		"isPost":isPost,
		"isEmail":isEmail,
		"isPid":isPid,
		"isMobile":isMobile,
		"isTel":isTel,
		"isUrl":isUrl,
		"isDate":isDate,
		"isName":isName
	}
});

/**
 *  - HTML5 Form Validation
 *    
 *    placeholder 表单提示
 *    pattern
 *    required
 *    text
 *    email
 *    tel
 */