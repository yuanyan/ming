/**
 * @name util.Timer
 * @class
 */
module("util.Timer",function(global){
	
	var taskQueue = new Object; //任务队列
	
	var TASK = { //任务状态枚举
		"RUNNING":1,
		"OVER":2,
		"STOP":3,
		"CANCEL":4
	};

	/**
	 * 在指定延迟后执行指定的任务
	 * 
	 * @param {Function|String}  task
	 * @param {Number} delay 
	 * @return {Number} timeoutNumber
	 */
	var once = function(task, delay){
		var timeoutNumber = setTimeout(task, delay);
		taskQueue[timeoutNumber] = TASK.RUNNING; //加入任务队列
		
		setTimeout(function(){ //任务结束时自动重置任务状态
			if(taskQueue[timeoutNumber] == TASK.RUNNING)
				taskQueue[timeoutNumber] = TASK.OVER;
		},delay);
		
		return timeoutNumber;
	};
	
	/**
	 * 在指定的时间点执行指定的任务。
	 * @param {Function|String}  task
	 * @param {Date} time
	 * @return {Number} timeoutNumber
	 */
	var hit = function(task, time){
		
		var delay = time - new Date();
		return once(task, delay);
	};
		
	/**
	 * 
	 * @param {Function|String}  task
	 * @param {Number} period 间隔时间
	 * @param {Function} opt_over 终止条件
	 * @return {Number} intervalNumber
	 */
	var schedule=function(task, period, opt_over){
        
        var intervalNumber = setInterval(task, period);
		taskQueue[intervalNumber] = TASK.RUNNING; //加入任务队列
			
		if(opt_over){
			var listenerIntervalNumber; //监听器 interval number
	        var isListenerInit = false; //监听器是否已经初始化
	 		
	        (function(){
	            if (opt_over()) {//运行经过时间
	            	taskQueue[interval] = TASK.OVER; 
	            	clearInterval(listenerIntervalNumber);
	                clearInterval(intervalNumber);
	            }
	            else 
	                if (!isListenerInit) { //监听器初始化
	                    isListenerInit = true;
	                    listenerInterval=setInterval(arguments.callee, period);
	                }
	            
	        })();
		}
		
		return intervalNumber;
		
	}
	
	
	/**
     * 
     * @param {Function|String}  task
     * @param {Number} period   相隔多少毫秒时间运行
     * @param {Number} passedTime 经过多少毫秒时间后结束
     * @return {Number} intervalNumber
     */
    var pass = function(task, period, passedTime){
		
	    var startTime = new Date();//起始运行时间	
		
		var over = function(){
			return (new Date() - startTime) >= passedTime;//运行经过时间			
		}
		
		return schedule(task, period, over);
    };
    
    /**
     * 
     * @param {Function|String}  task
     * @param {Number} period  相隔多少毫秒时间运行
     * @param {Number} times    执行多少次数
     * @return {Number} intervalNumber 
     */
    var tick = function(task, period, times){
        if (times < 1) 
            return;

 		var counter = 0; //执行次数计算器
 				
		var over = function(){
			return ++counter > times;//运行经过时间			
		}
		
		return schedule(task, period, over);		
    };
	
	/**
	 * 终止所有当前已安排的任务或指定的任务
	 * @param {Object} opt_number
	 */
	var cancel = function(opt_number){
			
		if(opt_number){ //取消指定的任务
			clearInterval(opt_number);			
		}else{	//终止所有当前已安排的任务
			for(var num in taskQueue){				
				if(taskQueue[num] == TASK.RUNNING){
					clearInterval(num);
					taskQueue[num] == TASK.CANCEL;					
				}
			}
		}	
	};
	
	
	return {
		"once": once,
		"hit": hit,
		"schedule":schedule,
		"pass":pass,
		"tick":tick,
		"cancel": cancel
	}
	
});
