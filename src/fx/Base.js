// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * Base
 */
module("fx.Base", function(){
	
	//IMPORT
	var langBase = module("lang.Base");
	
    //Transitions (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), BSD License.
	/**
	 * 
	 * @param {Object} t cTime
	 * @param {Object} b from
	 * @param {Object} c change
	 * @param {Object} d duration
	 */
    var Transitions = {
        //线性
        linear: function(t, b, c, d){
            return c * t / d + b;
        },
        //正弦
        sineInOut: function(t, b, c, d){
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    };
	
	/**
	 * Fx 单例基类
	 * Fx.Color Fx.Height等都以混入方式继承基类
	 */
	var Base = {
		
		"setOptions": function(options){
			
            var defaultOptions = {
                "onStart": function(){},
                "onComplete": function(){},
                "transition": Transitions.sineInOut, //默认的过渡算法
                "duration": 500,
                "unit": 'px',
                "wait": true,
                "fps": 50
            };
			
			this.options = langBase.mix(options || {}, defaultOptions);
		},
		//下一帧
		"step": function(){
			var time = new Date().getTime();
			if (time < this.time + this.options.duration) {
				this.cTime = time - this.time;
				this.setNow();
			}
			else {		
				setTimeout(this.options.onComplete.bind(this, this.element), 10); //onComplete事件
				this.clearTimer();
				this.now = this.to;
			}
			this.increase(); //
		},
		
		"setNow": function(){
			this.now = this.compute(this.from, this.to);
		},
		
		/**
		 * 按当前transition算法计算
		 * @param {Object} from
		 * @param {Object} to
		 */
		"compute": function(from, to){
			var change = to - from;
			return this.options.transition(this.cTime, from, change, this.options.duration);
		},
		
		/**
		 * 取消当前动画的定时器 
		 */
		"clearTimer": function(){
			clearInterval(this.timer);
			this.timer = null;
			return this;
		},
		
		
		"_start": function(from, to){
			if (!this.options.wait) 
				this.clearTimer();
			if (this.timer) 
				return;
			setTimeout(this.options.onStart.bind(this, this.element), 10); //onStart事件
			this.from = from;
			this.to = to;
			this.time = new Date().getTime();
			this.timer = setInterval(this.step.bind(this), Math.round(1000 / this.options.fps));//记录定时器标示timer
			return this;
		},
		
		"custom": function(from, to){
			return this._start(from, to);
		},
		
		"set": function(to){
			this.now = to;
			this.increase(); //
			return this;
		},
		
		"hide": function(){
			return this.set(0);
		},
		
		/**
		 * 样式设置
		 * @param {Object} e 元素
		 * @param {Object} p 元素属性
		 * @param {Object} v 当前属性值
		 */
		"setStyle": function(e, p, v){
			if (p == 'opacity') {
				if (v == 0 && e.style.visibility != "hidden") 
					e.style.visibility = "hidden";
				else 
					if (e.style.visibility != "visible") 
						e.style.visibility = "visible";
				if (window.ActiveXObject) 
					e.style.filter = "alpha(opacity=" + v * 100 + ")";
				e.style.opacity = v;
			}
			else 
				e.style[p] = v + this.options.unit;
		}
		
	};
	
	//EXPOSE
	return Base;
	
});