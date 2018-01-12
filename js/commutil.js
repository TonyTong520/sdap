/**
 * 判断对象是否为空
 * 
 * @param obj
 * @returns {Boolean}
 */
function isEmpty(obj){
	if(obj == null || obj=="" || obj=="undefined" || obj == undefined || obj == "null" || obj.length == 0){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断对象是否为空
 * 
 * @param obj
 * @returns {Boolean}s
 */
function isNotEmpty(obj){
	return !isEmpty(obj);
}

/**
 * 判断是否是pc端
 * 
 * @returns {Boolean}
 */
function isPc(){
	var system ={
		win : false,
		mac : false,
		xll : false
	};
	
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	if(system.win||system.mac||system.xll){
		return true;
	}else{
		return false;
	}
}

/**
 * 判断是否是IE浏览器，兼容ie11
 * @returns {Boolean}
 */
function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
        return true;
    }else{
        return false;
    }
}

/**
 * 取小数两位
 * @param floatvar
 * @returns
 */
function changeTwoDecimal(floatvar){
	var f_x = parseFloat(floatvar);
	if (isNaN(f_x)){
		return false;
	}
	var f_x = Math.round(floatvar*100)/100;
	return f_x;
}

/**
 * 取小数一位
 * @param floatvar
 * @returns
 */
function changeThreeDecimal(floatvar){
	var f_x = parseFloat(floatvar);
	if (isNaN(f_x)){
		return false;
	}
	var f_x = (floatvar*100).toFixed(1);
	return f_x;
}

/**
 * 在页面中任何嵌套层次的窗口中获取顶层窗口
 * @return 当前页面的顶层窗口对象
 */
function getTopWinow(){
    var p = window;
    while(p != p.parent){
        p = p.parent;
    }
    return p;
}

//ajax 全局处理 -- start
$(document).ajaxStart(function(){
	$("#div_loading").css("display","block");
});
$(document).ajaxComplete(function(event,XMLHttpRequest,options){
	$("#div_loading").css("display","none");
	//通过XMLHttpRequest取得响应头，sessionStatus
    var sessionStatus=XMLHttpRequest.getResponseHeader("sessionStatus");
    if(sessionStatus=="408"){
        //如果session过期,则重新刷新页面
  	  getTopWinow().location.reload();
    }
});
$(document).ajaxError(function(){
	$("#div_loading").css("display","none");
});
$(document).ajaxSuccess(function(){
	$("#div_loading").css("display","none");
});
//所有ajax请求超时时间，10秒
$.ajaxSetup({timeout:10000});
//ajax 全局处理 -- end


/**
 * 画带有箭头的直线，箭头在中间
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
function drawLineArrow(x1,y1,x2,y2){
	  var path;
      var slopy,cosy,siny;
	  var Par=10.0;
      var x3,y3;
	  slopy=Math.atan2((y1-y2),(x1-x2));   
      cosy=Math.cos(slopy);   
      siny=Math.sin(slopy); 
   	 
   	  path="M"+x1+","+y1+" L"+x2+","+y2;
	     
      x3=(Number(x1)+Number(x2))/2;
	  y3=(Number(y1)+Number(y2))/2;

	  path +=" M"+x3+","+y3;
	  
	  path +=" L"+(Number(x3)+Number(Par*cosy-(Par/2.0*siny)))+","+(Number(y3)+Number(Par*siny+(Par/2.0*cosy)));

	  path +=" M"+(Number(x3)+Number(Par*cosy+Par/2.0*siny)+","+ (Number(y3)-Number(Par/2.0*cosy-Par*siny)));
	  path +=" L"+x3+","+y3;
	  return path;
}


/**
 * Map对象，实现Map功能
 * 
 * size() 获取Map元素个数 isEmpty() 判断Map是否为空 clear() 删除Map所有元素 put(key, value)
 * 向Map中增加元素（key, value) remove(key) 删除指定key的元素，成功返回true，失败返回false get(key)
 * 获取指定key的元素值value，失败返回null element(index)
 * 获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null containsKey(key)
 * 判断Map中是否含有指定key的元素 containsValue(value) 判断Map中是否含有指定value的元素 keys()
 * 获取Map中所有key的数组（array） values() 获取Map中所有value的数组（array）
 * 
 */
function Map() {
	this.elements = new Array();

	// 获取Map元素个数
	this.size = function() {
		return this.elements.length;
	},

	// 判断Map是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	},

	// 删除Map所有元素
	this.clear = function() {
		this.elements = new Array();
	},

	// 向Map中增加元素（key, value)
	this.put = function(_key, _value) {
		if (this.containsKey(_key) == true) {
			if (this.containsValue(_value)) {
				if (this.remove(_key) == true) {
					this.elements.push({
						key : _key,
						value : _value
					});
				}
			} else {
				this.elements.push({
					key : _key,
					value : _value
				});
			}
		} else {
			this.elements.push({
				key : _key,
				value : _value
			});
		}
	},

	// 删除指定key的元素，成功返回true，失败返回false
	this.remove = function(_key) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取指定key的元素值value，失败返回null
	this.get = function(_key) {
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	},

	// 获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	},

	// 判断Map中是否含有指定key的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 判断Map中是否含有指定value的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取Map中所有key的数组（array）
	this.keys = function() {
		var arr = new Array();
		for (var i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	},

	// 获取Map中所有value的数组（array）
	this.values = function() {
		var arr = new Array();
		for (var i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	};
}





