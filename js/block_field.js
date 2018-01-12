
var basePath = $("#basePath").val();
// From拖拽区域的选择
var moveFromX = 0;
var moveFromY = 0;
var draftFrom = [];
var ToBtnflag = 1;
var areaBlockedFromAry = ["areaForm26","areaForm25","areaForm3","areaForm4","areaForm5","areaForm6","areaForm7","areaForm8","areaForm9",
                          "areaForm10","areaForm11","areaForm12","areaForm13","areaForm14","areaForm15","areaForm16","areaForm17",
                          "areaForm18","areaForm19","areaForm20","areaForm21","areaForm22","areaForm23","areaForm24"];
var areaBlockedToAry = ["areaTo26","areaTo25","areaTo3","areaTo4","areaTo5","areaTo6","areaTo7","areaTo8","areaTo9",
                          "areaTo10","areaTo11","areaTo12","areaTo13","areaTo14","areaTo15","areaTo16","areaTo17",
                          "areaTo18","areaTo19","areaTo20","areaTo21","areaTo22","areaTo23","areaTo24"];

var mousestartflg = false;
var mouseendflg = false;
// 时间轴的开始时刻
var timeStart = "0";
// 时间轴的结束时刻
var timeEnd;
// 时刻选择时用到的half值
var timeStartHalf = "1";
var timeEndHalf;
var isOverTimeCom;
var guestteamId = $("#guestteamId").val();
if ($("#isOverTime").val() == "2") {
	timeEnd = "120+1";
	timeEndHalf = "4";
	isOverTimeCom = 2;
} else {
	timeEnd = "FT";
	timeEndHalf = "2";
	isOverTimeCom = 1;
}
var RectFrom = {
	// 当前正在画的矩形对象  
	obj : null,
	// 画布  
	container : null,
	// 初始化函数  
	init : function(containerId) {
		
		RectFrom.container = document.getElementById(containerId);
		if (RectFrom.container) {
			// 鼠标按下时开始画  
			RectFrom.container.onmousedown = RectFrom.start;
		} else {
			alert('You should specify a valid container!');
		}
	},
	start : function(e) {
		var my = document.getElementById("myFromDiv");
		if (my != null) {
			my.parentNode.removeChild(my);
			draftFrom = [];
		}
		var o = RectFrom.obj = document.createElement('div');
		// mouseBeginX，mouseBeginY是辅助变量，记录下鼠标按下时的位置  
		o.style.left = o.mouseBeginX = RectFrom.getEvent(e).layerX;
		o.style.top = o.mouseBeginY = RectFrom.getEvent(e).layerY+35;
		o.style.height = 0;
		o.style.width = 0;
		o.style.border = "1px solid #CCCCCC";
		o.style.background = "rgba(8, 70, 155, 0.7)";
		o.style.overflow = "hidden";
		o.style.position = "absolute";
		o.id = "myFromDiv";
		// 把当前画出的对象加入到画布中  
		RectFrom.container.appendChild(o);
		// 处理onmousemove事件  
		RectFrom.container.onmousemove = RectFrom.move;
		// 处理onmouseout事件  
		RectFrom.container.onmouseout = RectFrom.end;
		// 处理onmouseup事件  
		RectFrom.container.onmouseup = RectFrom.end;
	},
	move : function(e) {
		var o = RectFrom.obj;
		// dx，dy是鼠标移动的距离
		if(e.srcElement.id != "myFromDiv"){
			moveFromX = e.layerX;
			moveFromY = e.layerY+35;
			var dx = moveFromX - o.mouseBeginX;
			var dy = moveFromY - o.mouseBeginY;
			// 如果dx，dy <0,说明鼠标朝左上角移动，需要做特别的处理  
			if (dx < 0) {
				o.style.left = moveFromX;
			}else{
				o.style.left = o.mouseBeginX;
			}
			if (dy < 0) {
				o.style.top = moveFromY;
			}else{
				o.style.top = o.mouseBeginY;
			}
			if (parseInt(Math.abs(dx))+parseInt(o.style.left) > 1109) {
				o.style.width = 1109 - parseInt(o.style.left);
			} else {
				o.style.width = Math.abs(dx);
			}
			if (parseInt(Math.abs(dy))+parseInt(o.style.top) > 909) {
				o.style.height = 909 - parseInt(o.style.top);
			} else {
				o.style.height = Math.abs(dy);
			}
		}
	},
	end : function(e) {
		// onmouseout时释放onmousemove，onmouseout事件句柄  
		RectFrom.container.onmousemove = null;
		RectFrom.container.onmouseout = null;
		RectFrom.container.onmouseup = null;
		var o = RectFrom.obj;
		var startX = 0;
		var startY = 0;
		var endX = 0;
		var endY = 0;
		startX = parseInt(o.style.left) - 730;
		startY = parseInt(o.style.top) - 643;
		endX = startX + parseInt(o.style.width);
		endY = startY + parseInt(o.style.height);
		draftFrom[0] = startX.toString();
		draftFrom[1] = startY.toString();
		draftFrom[2] = endX.toString();
		draftFrom[3] = endY.toString();
		RectFrom.obj = null;
		getTraceTemp();
	},
	// 辅助方法，处理IE和FF不同的事件模型  
	getEvent : function(e) {
		if (typeof e == 'undefined') {
			e = window.event;
		}
		if (typeof e.x == 'undefined') {
			e.x = e.x;
		}
		if (typeof e.y == 'undefined') {
			e.y = e.y;
		}
		return e;
	}
};

// To拖拽区域的选择
var moveToX = 0;
var moveToY = 0;
var draftTo = [];
var RectTo = {
	// 当前正在画的矩形对象  
	obj : null,
	// 画布  
	container : null,
	// 初始化函数  
	init : function(containerId) {
		
		RectTo.container = document.getElementById(containerId);
		if (RectTo.container) {
			// 鼠标按下时开始画  
			RectTo.container.onmousedown = RectTo.start;
		} else {
			alert('You should specify a valid container!');
		}
	},
	start : function(e) {
		var my = document.getElementById("myToDiv");
		if (my != null) {
			my.parentNode.removeChild(my);
			draftTo = [];
		}
		var o = RectTo.obj = document.createElement('div');
		// mouseBeginX，mouseBeginY是辅助变量，记录下鼠标按下时的位置  
		o.style.left = o.mouseBeginX = RectTo.getEvent(e).layerX;
		o.style.top = o.mouseBeginY = RectTo.getEvent(e).layerY+35;
		o.style.height = 0;
		o.style.width = 0;
		o.style.border = "1px solid #CCCCCC";
		o.style.background = "rgba(8, 70, 155, 0.7)";
		o.style.overflow = "hidden";
		o.style.position = "absolute";
		o.id = "myToDiv";
		// 把当前画出的对象加入到画布中  
		RectTo.container.appendChild(o);
		// 处理onmousemove事件  
		RectTo.container.onmousemove = RectTo.move;
		// 处理onmouseout事件  
		RectTo.container.onmouseout = RectTo.end;
		// 处理onmouseup事件  
		RectTo.container.onmouseup = RectTo.end;
	},
	move : function(e) {
		var o = RectTo.obj;
		// dx，dy是鼠标移动的距离
		if(e.srcElement.id != "myToDiv"){
			moveToX = e.layerX;
			moveToY = e.layerY+35;
			var dx = moveToX - o.mouseBeginX;
			var dy = moveToY - o.mouseBeginY;
			// 如果dx，dy <0,说明鼠标朝左上角移动，需要做特别的处理  
			if (dx < 0) {
				o.style.left = moveToX;
			}else{
				o.style.left = o.mouseBeginX;
			}
			if (dy < 0) {
				o.style.top = moveToY;
			}else{
				o.style.top = o.mouseBeginY;
			}
			if (parseInt(Math.abs(dx))+parseInt(o.style.left) > 1109) {
				o.style.width = 1109 - parseInt(o.style.left);
			} else {
				o.style.width = Math.abs(dx);
			}
			if (parseInt(Math.abs(dy))+parseInt(o.style.top) > 1195) {
				o.style.height = 1195 - parseInt(o.style.top);
			} else {
				o.style.height = Math.abs(dy);
			}
		}
	},
	end : function(e) {
		// onmouseout时释放onmousemove，onmouseout事件句柄  
		RectTo.container.onmousemove = null;
		RectTo.container.onmouseout = null;
		RectTo.container.onmouseup = null;
		var o = RectTo.obj;
		var startX = 0;
		var startY = 0;
		var endX = 0;
		var endY = 0;
		startX = parseInt(o.style.left) - 730;
		startY = parseInt(o.style.top) - 643;
		endX = startX + parseInt(o.style.width);
		endY = startY + parseInt(o.style.height);
		draftTo[0] = startX.toString();
		draftTo[1] = startY.toString();
		draftTo[2] = endX.toString();
		draftTo[3] = endY.toString();
		RectTo.obj = null;
		getTraceTemp();
	},
	// 辅助方法，处理IE和FF不同的事件模型  
	getEvent : function(e) {
		if (typeof e == 'undefined') {
			e = window.event;
		}
		if (typeof e.x == 'undefined') {
			e.x = e.x;
		}
		if (typeof e.y == 'undefined') {
			e.y = e.y;
		}
		return e;
	}
};
// From分块区域的选择
function areaBlockFrom(){
	
    var area_block_from_bg = $("div[name='area_block_from_bg']");
    var area_block_from = $("div[name='area_block_from']");
    
    area_block_from_bg.each(function(i) {
      $(this).click(function() {
        $("div[name='area_block_from']").eq(i).show();
        var areaBlockedFrombgTemp = this.textContent;
        areaBlockedFromAry.remove(areaBlockedFrombgTemp);
        getTraceTemp();
      });
    });
    area_block_from.each(function() {
      $(this).click(function() {
         $(this).hide();
         var areaBlockedFromTemp = this.textContent;
         if (areaBlockedFromAry.indexOf(areaBlockedFromTemp) == -1) {
            areaBlockedFromAry.push(areaBlockedFromTemp);
         }
         getTraceTemp();
      });
    });
}

//To分块区域的选择
function areaBlockTo(){
	
    var area_block_to_bg = $("div[name='area_block_to_bg']");
    var area_block_to = $("div[name='area_block_to']");
    
    area_block_to_bg.each(function(i) {
      $(this).click(function() {
        $("div[name='area_block_to']").eq(i).show();
        var areaBlockedTobgTemp = this.textContent;
        areaBlockedToAry.remove(areaBlockedTobgTemp);
        getTraceTemp();
      });
    });
    area_block_to.each(function() {
      $(this).click(function() {
         $(this).hide();
         var areaBlockedToTemp = this.textContent;
         if (areaBlockedToAry.indexOf(areaBlockedToTemp) == -1) {
            areaBlockedToAry.push(areaBlockedToTemp);
         }
         getTraceTemp();
      });
    });
}

//From全选(roughFrom)
$("#roughFrom").click(function(){
	areaBlockedFromAry = ["areaForm26","areaForm25","areaForm3","areaForm4","areaForm5","areaForm6","areaForm7","areaForm8","areaForm9",
                          "areaForm10","areaForm11","areaForm12","areaForm13","areaForm14","areaForm15","areaForm16","areaForm17",
                          "areaForm18","areaForm19","areaForm20","areaForm21","areaForm22","areaForm23","areaForm24"];
	$("#areaBlockFromSelect").html("");
	$("#areaBlockFromRound").show();
	$("div[name='area_block_from']").hide();
	$("div[name='area_block_from_bg']").show();
	$("#areaBlockFromSelect").hide();
	$("#areaBlockToSelect").hide();
	$("#areaBlockToRound").show();
	draftFrom = [];
	draftTo = [];
	getTraceTemp();
	
});

//From取消(cancelFrom)
$("#cancelFrom").click(function(){
	areaBlockedFromAry = [];
	areaBlockedToAry = [];
	$("#areaBlockFromSelect").html("");
	$("#areaBlockFromRound").show();
	$("div[name='area_block_from']").show();
	$("div[name='area_block_from_bg']").show();
	$("#areaBlockFromSelect").hide();
	
	$("#areaBlockToSelect").hide();
	$("#areaBlockToRound").show();
	$("div[name='area_block_to']").show();
	$("div[name='area_block_to_bg']").show();
	draftFrom = [];
	draftTo = [];
	getTraceTemp();
});

//From拖选(selectFrom)
$("#selectFrom").click(function(){
	
	draftFrom = [];
	areaBlockedFromAry = [];
	$("#areaBlockFromSelect").html("");
	$("#areaBlockFromRound").hide();
	$("div[name='area_block_from']").show();
	$("div[name='area_block_from_bg']").hide();
	$("#areaBlockFromSelect").show();
	if (ToBtnflag == 2) {
		//To拖选
		areaBlockedToAry = [];
		$("#areaBlockToRound").hide();
		$("div[name='area_block_to']").show();
		$("div[name='area_block_to_bg']").hide();
		$("#areaBlockToSelect").show();
		$("#areaBlockToSelect").html("");
		getTraceTemp();
	}
});

//To全选
$("#roughTo").click(function(){
	areaBlockedToAry = ["areaTo26","areaTo25","areaTo3","areaTo4","areaTo5","areaTo6","areaTo7","areaTo8","areaTo9",
                        "areaTo10","areaTo11","areaTo12","areaTo13","areaTo14","areaTo15","areaTo16","areaTo17",
                        "areaTo18","areaTo19","areaTo20","areaTo21","areaTo22","areaTo23","areaTo24"];
	$("#areaBlockToSelect").html("");
	$("#areaBlockToRound").show();
	$("div[name='area_block_to']").hide();
	$("div[name='area_block_to_bg']").show();
	$("#areaBlockToSelect").hide();
	$("#areaBlockFromSelect").hide();
	$("#areaBlockFromSelect").html("");
	$("#areaBlockFromRound").show();
	draftFrom = [];
	draftTo = [];
	getTraceTemp();
});

//To取消(cancelTo)
$("#cancelTo").click(function(){
	areaBlockedToAry = [];
	areaBlockedFromAry = [];
	$("#areaBlockToSelect").hide();
	$("#areaBlockFromSelect").hide();
	$("#areaBlockToSelect").html("");
	$("#areaBlockFromSelect").html("");
	$("#areaBlockToRound").show();
	$("#areaBlockFromRound").show();
	$("div[name='area_block_to']").show();
	$("div[name='area_block_to_bg']").show();
	$("div[name='area_block_from']").show();
	$("div[name='area_block_from_bg']").show();
	draftFrom = [];
	draftTo = [];
	getTraceTemp();
});

//To拖选
$("#selectTo").click(function(){
	
	draftTo = [];
	areaBlockedToAry = [];
	$("#areaBlockToSelect").html("");
	$("#areaBlockToRound").hide();
	$("div[name='area_block_to']").show();
	$("div[name='area_block_to_bg']").hide();
	$("#areaBlockToSelect").show();
	//From拖选
	areaBlockedFromAry = [];
	$("#areaBlockFromRound").hide();
	$("div[name='area_block_from']").show();
	$("div[name='area_block_from_bg']").hide();
	$("#areaBlockFromSelect").show();
	getTraceTemp();
});

//To区域可选择
function areaBlockBtnToSelected(){
	// To区域可用的情况
	// To全选按钮不可用
    $("#roughTo").attr("disabled", false);
    // To取消(cancelTo)按钮不可用
    $("#cancelTo").attr("disabled", false);
    // To拖选按钮不可用
    $("#selectTo").attr("disabled", false);
    areaBlockedToAry = ["areaTo26","areaTo25","areaTo3","areaTo4","areaTo5","areaTo6","areaTo7","areaTo8","areaTo9",
                        "areaTo10","areaTo11","areaTo12","areaTo13","areaTo14","areaTo15","areaTo16","areaTo17",
                        "areaTo18","areaTo19","areaTo20","areaTo21","areaTo22","areaTo23","areaTo24"];
    areaBlockedFromAry = ["areaForm26","areaForm25","areaForm3","areaForm4","areaForm5","areaForm6","areaForm7","areaForm8","areaForm9",
                          "areaForm10","areaForm11","areaForm12","areaForm13","areaForm14","areaForm15","areaForm16","areaForm17",
                          "areaForm18","areaForm19","areaForm20","areaForm21","areaForm22","areaForm23","areaForm24"];
    draftFrom = [];
	draftTo = [];
	$("#areaBlockToSelect").html("");
	$("#areaBlockFromSelect").html("");
	$("#areaBlockToRound").show();
	$("#areaBlockFromRound").show();
	$("#areaBlockToSelect").hide();
	$("#areaBlockFromSelect").hide();
	$("div[name='area_block_to']").hide();
	$("div[name='area_block_to_bg']").show();
	$("div[name='area_block_from']").hide();
	$("div[name='area_block_from_bg']").show();
	
	getTraceTemp();
}

//To区域不可选择
function areaBlockBtnToNoSelected(){
	// To区域可用的情况
	// To全选按钮不可用
	$("#roughTo").attr("disabled", true);
	// To取消(cancelTo)按钮不可用
	$("#cancelTo").attr("disabled", true);
	// To拖选按钮不可用
	$("#selectTo").attr("disabled", true);
	draftTo = [];
	areaBlockedToAry = [];
	$("#areaBlockToSelect").html("");
	$("div[name='area_block_to']").show();
	$("div[name='area_block_to_bg']").hide();
	$("#areaBlockToSelect").hide();
	$("#areaBlockToRound").show();
	getTraceTemp();
}

//进攻全选，反选
$("#check_all_attack").click(function(){
	$("input[name='check_code_attack']").prop("checked", this.checked);
	getTraceTemp();
});

//传球全选，反选
$("#check_all_passes").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
		areaBlockBtnToNoSelected();
		ToBtnflag = 1;
	} else {
		areaBlockBtnToSelected();
		ToBtnflag = 2;
	}
	$("input[name='check_passes']").attr("checked", ischk);
	$("input[name='check_passes_action']").attr("checked", false);
	$("#check_recive").attr("checked", false);
	getTraceTemp();
});

function checkedNum(checkName) {
	var checks = document.getElementsByName(checkName);
	n = 0;
	for(i=0;i<checks.length;i++){
        if(checks[i].checked)
            n++;
    }
	return n;
}

$("input[name='check_passes']").click(function(){
	var ischk = $(this).attr("checked");
	$("#check_recive").attr("checked", false);
	$("input[name='check_passes_action']").attr("checked", false);
	var checkedNum1 = checkedNum("check_passes");
	var checkedNum2 = checkedNum("check_passes_action");
	if (ischk && checkedNum1 == 1) {
		areaBlockBtnToSelected();
		ToBtnflag = 2;
	} else {
		if (!$("#check_recive").is(":checked") && checkedNum1 == 0 && checkedNum2 == 0) {
			areaBlockBtnToNoSelected();
			ToBtnflag = 1;
		}
	}
});

$("input[name='check_passes_action']").click(function(){
	var ischk = $(this).attr("checked");
	$("input[name='check_passes']").attr("checked", false);
	$("#check_recive").attr("checked", false);
	var checkedNum1 = checkedNum("check_passes");
	var checkedNum2 = checkedNum("check_passes_action");
	if (ischk && checkedNum2 == 1) {
		areaBlockBtnToSelected();
		ToBtnflag = 2;
	} else {
		if (!$("#check_recive").is(":checked") && checkedNum1 == 0 && checkedNum2 == 0) {
			areaBlockBtnToNoSelected();
			ToBtnflag = 1;
		}
	}
});

$("#check_recive").click(function(){
	$("#check_all_passes").attr("checked", false);
	$("input[name='check_passes_action']").attr("checked", false);
	$("input[name='check_passes']").attr("checked", false);
	var ischk = $(this).attr("checked");
	if (ischk) {
		areaBlockBtnToSelected();
		ToBtnflag = 2;
	} else {
		areaBlockBtnToNoSelected();
		ToBtnflag = 1;
	}
});

//定位球全选，反选
$("#check_all_placeKick").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_code_attack_placeKick']").attr("checked", ischk);
	getTraceTemp();
});

//checkbox选择
$("input[name^='check_']").click(function(){
	if($(this).val() != "357"        //地面对抗
//		&& $(this).val() != "53"   //直传
//			&& $(this).val() != "55"   //斜传
//				&& $(this).val() != "57"   //横传
//					&& $(this).val() != "59" //回传
//						&& $(this).val() != "47"   //长传
//							&& $(this).val() != "51"  //短传 
								){    
		getTraceTemp();
	}
});

//犯规全选，反选
$("#check_all_foul").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_code_foul']").attr("checked", ischk);
	getTraceTemp();
});

//防守全选，反选
$("#check_all_defence").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_code_defence']").attr("checked", ischk);
	getTraceTemp();
});

//对抗全选，反选
$("#check_all_duels").click(function(){
	var ischk = $(this).attr("checked");
	if(typeof(ischk) == "undefined"){
		ischk = false;
	}
	$("input[name='check_code_duels']").attr("checked", ischk);
	$("input[name='check_code_attack']").eq(4).prop("checked", this.checked);
	$("input[name='check_code_defence']").eq(0).prop("checked", this.checked);
	getTraceTemp();
});

// 地面对抗 = 过人 + 抢断
$("input[name='check_code_duels']").eq(1).click(function(){
	$("input[name='check_code_attack']").eq(4).prop("checked", this.checked);
	$("input[name='check_code_defence']").eq(0).prop("checked", this.checked);
	getTraceTemp();
});

//其他全选，反选
$("#check_all_Conversion").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_code_Conversion']").attr("checked", ischk);
	getTraceTemp();
});

//主队球员全选，反选
$("#check_all_home").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_person_home']").attr("checked", ischk);
	getTraceTemp();
});

//客队球员全选，反选
$("#check_all_guest").click(function(){
	var ischk = $(this).attr("checked");
	if(!ischk){
		ischk = false;
	}
	$("input[name='check_person_guest']").attr("checked", ischk);
	getTraceTemp();
});

function addTimelineDiv() {
	// 如果原来有"divCell"这个图层，先删除这个图层
	deleteTimelineDiv();
	// 创建一个div
	var rangeDiv;
	rangeDiv = "<div id='range' class='noUi-target noUi-vertical noUi-background range'></div>";
	// 添加到页面
	$("#showcase").append(rangeDiv);
}

function deleteTimelineDiv() {
	$("#showcase").html("");
	$("#ul_timeLine_cb_home").html("");
	$("#ul_timeLine_cb_guest").html("");
}

$("button[name=btn_half_trace]").click(function(){
	$("button[name='btn_half_trace']").removeClass("btn_click");
	$(this).addClass("btn_click");
	$("#trace_half").val(this.value);
	
	if ($("#isOverTime").val() == "2") {
		if ($("#trace_half").val() == 0) {
			addTimelineDiv();
			createSlider("0", "100", 132);
		} else if ($("#trace_half").val() == 1) {
			addTimelineDiv();
			createSlider("0", "50", 132);
		} else if ($("#trace_half").val() == 2) {
			addTimelineDiv();
			createSlider("50", "100", 132);
		} else if ($("#trace_half").val() == 6) {
			addTimelineDiv();
			createSlider("0", "132", 132);
		} else if ($("#trace_half").val() == 5) {
			addTimelineDiv();
			createSlider("100", "132", 132);
		} else if ($("#trace_half").val() == 3) {
			addTimelineDiv();
			createSlider("100", "116", 132);
		} else if ($("#trace_half").val() == 4) {
			addTimelineDiv();
			createSlider("116", "132", 132);
		}
	} else {
		if ($("#trace_half").val() == 0) {
			addTimelineDiv();
			createSlider("0", "100", 100);
		} else if ($("#trace_half").val() == 1) {
			addTimelineDiv();
			createSlider("0", "50", 100);
		} else if ($("#trace_half").val() == 2) {
			addTimelineDiv();
			createSlider("50", "100", 100);
		}
	}
	$("#test0").on("mousedown", function() {
		mousestartflg = true;
	});
	
	$("#test1").on("mousedown", function() {
		mouseendflg = true;
	});
	
	$("body").mouseup(function(){
		if (mousestartflg) {
			mousestartflg = false;
			getTraceTemp();
		}
		if (mouseendflg) {
			mouseendflg = false;
			getTraceTemp();
		} 
	});
	getTraceTemp();
});

var handleStart;
var handleEnd;
function createSlider(start, end, max) {
	var range = document.getElementById('range');
//	var limitRange = Math.round(end-start);
	noUiSlider.create(range, {
		start : [ start, end ], // Handle start position
		step : 1, // Slider moves in increments of '10'
		margin : 1, // Handles must be more than '20' apart
		connect : true, // Display a colored bar between the handles
		direction : 'ltr', // Put '0' at the bottom of the slider
//		behaviour : 'tap-drag', // Move handle on tap, bar is draggable
//		limit: limitRange,
		range : { // Slider can select '0' to '100'
			'min' : 0,
			'max' : max
		},
		pips : { // Show a scale with the slider
			mode : 'steps',
			density : 1,
		}
	});
	
	handleStart = document.getElementById('test0');
	handleEnd = document.getElementById('test1');

	range.noUiSlider.on('change',function(values, handle){
		if ($("#isOverTime").val() == "2") {
			if ($("#trace_half").val() == 0 && Math.round(values[handle]) > 100)  {
				range.noUiSlider.set([this.value,100]);
			}
			if ($("#trace_half").val() == 1 && Math.round(values[handle]) > 50) {
				range.noUiSlider.set([this.value,50]);
			}
			if ($("#trace_half").val() == 2 ) {
				if (Math.round(values[handle]) < 50 ) {
					range.noUiSlider.set([50,this.value]);
				}
				if (Math.round(values[handle]) > 100 ) {
					range.noUiSlider.set([this.value,100]);
				}
			}
			if ($("#trace_half").val() == 3 ) {
				if (Math.round(values[handle]) < 100 ) {
					range.noUiSlider.set([100,this.value]);
				}
				if (Math.round(values[handle]) > 116 ) {
					range.noUiSlider.set([this.value,116]);
				}
			}
			if ($("#trace_half").val() == 4 && Math.round(values[handle]) < 116) {
				range.noUiSlider.set([116,this.value]);
			}
			if ($("#trace_half").val() == 5 && Math.round(values[handle]) < 100) {
				range.noUiSlider.set([100,this.value]);
			}
			
		}else {
			if ($("#trace_half").val() == 1 && Math.round(values[handle]) > 50) {
				range.noUiSlider.set([this.value,50]);
			}
			if ($("#trace_half").val() == 2 && Math.round(values[handle]) < 50)  {
				range.noUiSlider.set([50,this.value]);
			} 
		}
	});
	
	// When the slider value changes, update the input and span
	range.noUiSlider.on('update', function(values, handle) {
		if (handle) {
			if ($("#isOverTime").val() == "2") {
				if (Math.round(values[handle]) >= 0 && Math.round(values[handle]) <= 45) {
					handleEnd.innerHTML = Math.round(values[handle]);
					$("#timeEndHalf").val("1");
				} else if (Math.round(values[handle]) > 45 && Math.round(values[handle]) < 50) {
					handleEnd.innerHTML = "45+";
					$("#timeEndHalf").val("1");
				} else if (Math.round(values[handle]) == 50) {
					handleEnd.innerHTML = "45+";
					$("#timeEndHalf").val("1");
				}else if (Math.round(values[handle]) > 50 && Math.round(values[handle]) <= 95) {
					handleEnd.innerHTML = Math.round(values[handle]-5);
					$("#timeEndHalf").val("2");
				} else if (Math.round(values[handle]) > 95 && Math.round(values[handle]) < 100) {
					handleEnd.innerHTML = "90+";
					$("#timeEndHalf").val("2");
				} else if (Math.round(values[handle]) == 100) {
					handleEnd.innerHTML = "90+";
					$("#timeEndHalf").val("2");
				}  else if (Math.round(values[handle]) > 100 && Math.round(values[handle]) <= 115) {
					handleEnd.innerHTML = Math.round(values[handle]-10);
					$("#timeEndHalf").val("3");
				} else if (Math.round(values[handle]) > 115 && Math.round(values[handle]) <= 116) {
					handleEnd.innerHTML = "EHT";
					$("#timeEndHalf").val("3");
				} else if (Math.round(values[handle]) > 116 && Math.round(values[handle]) <= 131) {
					handleEnd.innerHTML = Math.round(values[handle]-11);
					$("#timeEndHalf").val("4");
				} else if (Math.round(values[handle]) > 131 && Math.round(values[handle]) <= 132) {
					handleEnd.innerHTML = "EFT";
					$("#timeEndHalf").val("4");
				}
			} else {
				if (Math.round(values[handle]) >= 0 && Math.round(values[handle]) <= 45) {
					handleEnd.innerHTML = Math.round(values[handle]);
					$("#timeEndHalf").val("1");
				} else if (Math.round(values[handle]) > 45 && Math.round(values[handle]) < 50) {
					handleEnd.innerHTML = "45+";
					$("#timeEndHalf").val("1");
				} else if (Math.round(values[handle]) == 50) {
					handleEnd.innerHTML = "45+";
					$("#timeEndHalf").val("1");
				} else if (Math.round(values[handle]) > 50 && Math.round(values[handle]) <= 95) {
					handleEnd.innerHTML = Math.round(values[handle]-5);
					$("#timeEndHalf").val("2");
				} else if (Math.round(values[handle]) > 95 && Math.round(values[handle]) <= 100) {
					handleEnd.innerHTML = "90+";
					$("#timeEndHalf").val("2");
				}
			}
		} else {
			if ($("#isOverTime").val() == "2") {
				if (Math.round(values[handle]) >= 0 && Math.round(values[handle]) <= 45) {
					handleStart.innerHTML = Math.round(values[handle]);
					$("#timeStartHalf").val("1");
				} else if (Math.round(values[handle]) > 45 && Math.round(values[handle]) < 50) {
					handleStart.innerHTML = "45+";
					$("#timeStartHalf").val("1");
				} else if (Math.round(values[handle]) >= 50 && Math.round(values[handle]) <= 95) {
					handleStart.innerHTML = Math.round(values[handle]-5);
					$("#timeStartHalf").val("2");
				} else if (Math.round(values[handle]) > 95 && Math.round(values[handle]) < 100) {
					handleStart.innerHTML = "90+";
					$("#timeStartHalf").val("2");
				} else if (Math.round(values[handle]) >= 100 && Math.round(values[handle]) <= 115) {
					handleStart.innerHTML = Math.round(values[handle]-10);
					$("#timeStartHalf").val("3");
				} else if (Math.round(values[handle]) > 115 && Math.round(values[handle]) <= 116) {
					handleStart.innerHTML = "EHT";
					$("#timeStartHalf").val("3");
				} else if (Math.round(values[handle]) > 116 && Math.round(values[handle]) <= 131) {
					handleStart.innerHTML = Math.round(values[handle]-11);
					$("#timeStartHalf").val("4");
				} else if (Math.round(values[handle]) > 131 && Math.round(values[handle]) <= 132) {
					handleStart.innerHTML = "EFT";
					$("#timeStartHalf").val("4");
				}
			} else {
				if (Math.round(values[handle]) >= 0 && Math.round(values[handle]) <= 45) {
					handleStart.innerHTML = Math.round(values[handle]);
					$("#timeStartHalf").val("1");
				} else if (Math.round(values[handle]) > 45 && Math.round(values[handle]) < 50) {
					handleStart.innerHTML = "45+";
					$("#timeStartHalf").val("1");
				} else if (Math.round(values[handle]) >= 50 && Math.round(values[handle]) <= 95) {
					handleStart.innerHTML = Math.round(values[handle]-5);
					$("#timeStartHalf").val("2");
				} else if (Math.round(values[handle]) > 95 && Math.round(values[handle]) <= 100) {
					handleStart.innerHTML = "90+";
					$("#timeStartHalf").val("2");
				}
			}
		}
	});
}

function getTraceTemp(){
	areaBlockedFrom = areaBlockedFromAry.toString();
	draftedFrom = draftFrom.toString();
	areaBlockedTo = areaBlockedToAry.toString();
	draftedTo = draftTo.toString();
	timeStart = handleStart.innerHTML;
	timeEnd = handleEnd.innerHTML;
	if ("45+" == timeEnd) {
		timeEnd = 451;
	}
	if ("45+" == timeStart) {
		timeStart = 451;
	}
	if ("90+" == timeEnd) {
		timeEnd = 902;
	}
	if ("90+" == timeStart) {
		timeStart = 902;
	}
	timeHalf = $("#timeHalf").val();
	timeStartHalf = $("#timeStartHalf").val();
	timeEndHalf = $("#timeEndHalf").val();
	isOverTimeCom = $("#isOverTime").val();
	
	if ($("#trace_half").val() == "") {
		if ($("#isOverTime").val() == "2") {
			$("#trace_half").val(6);
		} else {
			$("#trace_half").val(0);
		}
	}
	var half = $("#trace_half").val();
	
	$("#currentGroupId").val("");
	
	var svg = Snap("#svg_trace");
	var image = svg.paper.image(basePath+"images/stadium.jpg", 0,0, 622, 417).attr({id:"trace_bg"});
	
	$("#svg_trace").empty();
	var m2 = getMarkerArrow("svg_trace");
	$("#ul_timeLine_cb_home").empty();
	$("#ul_timeLine_cb_guest").empty();
	$("#ul_over_timeLine_cb_home").empty();
	$("#ul_over_timeLine_cb_guest").empty();
	
	var personId = ""
    $("input:checkbox[name^='check_person_']:checked").each(function(i){
       if(0==i){
        personId = "'"+$(this).val()+"'";
       }else{
        personId += (",'"+$(this).val()+"'");
       }
    });
    var code = ""
    $("input:checkbox[name^='check_code_']:checked").each(function(i){
       if(0==i){
        code = "'"+$(this).val()+"'";
       }else{
        code += (",'"+$(this).val()+"'");
       }
    });

 	// 过人成功和过人失败
    if (code.indexOf("171") > 0) {
      code = code.replace(/171/g, "86','172");
    }
    // 抢断成功和抢断失败
    if (code.indexOf("358") > 0) {
    	code = code.replace(/358/g, "26','350");
    }
    // 空中对抗
    if (code.indexOf("356") > 0) {
    	code = code.replace(/356/g, "61','400");
    }
    // 失误=失误+控球失误
    if (code.indexOf("412") > 0) {
    	code = code.replace(/412/g, "66','412");
    }
    //门将出击成功和门将出击失败
    if (code.indexOf("359") > 0) {
    	code = code.replace(/359/g, "352','353");
    }
 	//如果选择了红牌或黄牌，则需要加上黄牌变红牌的代码
 	if(code.indexOf("24") > 0 || code.indexOf("25") > 0){
 		code += ",'117'";
 	}
 	//如果选择进球，则将乌龙球加入进去
 	if(code.indexOf("1") > -1){
 		var codestr = code.split(",");
 		for ( var i = 0; i < codestr.length; i++) {
			if ("'1'" == codestr[i]) {
				code += ",'87'";
			}
		}
 	}
 	
 	var passCode = ""
    $("input:checkbox[name^='check_passes']:checked").each(function(i){
       if(0==i){
        passCode = "'"+$(this).val()+"'";
       }else{
        passCode += (",'"+$(this).val()+"'");
       }
    });
    //接球
    if($("#check_recive").attr("checked")){
    	passCode="505";
    }
 	if(isEmpty(personId)){
 		return false;
 	}
 	if(isNotEmpty(code)){
 		$.ajax({
			type : "post",
			data : "matchId="+matchId+"&half="+half+"&personId="+personId+"&code="+code+"&areaBlockedFrom="+areaBlockedFrom+"&draftedFrom="+draftedFrom+"&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeStartHalf="+timeStartHalf+"&timeEndHalf="+timeEndHalf+"&isOverTime="+isOverTimeCom,
			url : basePath+"getTraceAjax.html",
			success:function(da){
				var json = eval(da);
				$.each(json, function(i, item) {
					if(isEmpty(item.code)){
						return true;
					}
					var teamType = "H";
					
					if(item.teamId == guestteamId){
						teamType = "G";
					}
					if(item.codeType==1||item.codeType==5){//进攻
						if(item.code!="555"){//落球点除外
							$.each(json, function(j, item555) {
								if(item.groupNo == item555.groupNo && item555.code==555){
									drawLineEnd("svg_trace",m2,item.x, item.y,item555.x, item555.y,item.teamId,item555.teamId,"1","2",item.code,item.groupNo,null);//后面person1和person2不一样，就为实线
								}
							});
							if(item.code == 1 || item.code == 87){
								drawGoal("svg_trace", item.half,item.x, item.y,json[i+1]["x"], item.personNumber,item.personNameEn,item.groupNo,item.eventTimeFull,item.actionName,teamType,null)
							}else{
								drawAttack("svg_trace", item.half,item.x, item.y, item.personNumber,item.personNameEn,10,teamType,item.groupNo,item.eventTimeFull,item.code,item.actionName,null);
							}
						}
					}else if(item.codeType==2 &&  isNotEmpty(item.code)){//防守
						if(item.code ==204 ||item.code ==205 ||item.code ==502 ){//阻断传球，阻断射门，守门员扑球，需要显示线路
							$.each(json, function(j, itemDefend) {
								if(item.groupNo == itemDefend.groupNo && isEmpty(itemDefend.code)){
									drawPersonBlock("svg_trace",itemDefend.personNumber,itemDefend.x,itemDefend.y,item.personNumber,item.x,item.y,itemDefend.teamId);
									return false;
								}
							});
						}
						drawyTriangle("svg_trace",item.half, item.x, item.y, item.personNumber,item.personNameEn,teamType,item.groupNo,item.eventTimeFull,item.code,item.actionName);
					}else if(item.codeType==4 && item.code!=22){//犯规
						var foulsPerson="";

						if(item.code ==21 ){//需要显示被犯规人
							$.each(json, function(k, itemFoul) {
								if(item.groupNo == itemFoul.groupNo && itemFoul.code==22){
									foulsPerson =itemFoul.personNumber+" "+itemFoul.personNameEn;
									return false;
								}
							});
						}
						drawyRect("svg_trace", item.half,item.x, item.y, item.personNumber,item.personNameEn,teamType,item.eventTimeFull,item.code,item.actionName,item.groupNo,foulsPerson);
					} else if(item.codeType==6){//对抗
						drawDuels("svg_trace", item.half,item.x, item.y, item.personNumber,item.personNameEn,teamType,item.eventTimeFull,item.code,item.actionName,item.groupNo);
					}
					else if(item.codeType==7){//其他
						drawShift("svg_trace",item.half, item.x, item.y, item.personNumber,item.personNameEn,teamType,item.eventTimeFull,item.code,item.actionName);
					}
					
					//timeline
					var codeType=item.codeType;
					if(item.code == 1 || item.code == 87){
						codeType="goal";
					}
					if(item.code !=555 && item.code !=22 && isNotEmpty(item.code)){//空，落球点，被犯规 不需要在时间轴上显示
						var nextX = null;
						if(json[i+1]){
							nextX = json[i+1]["x"];
						}
						if (isOverTimeCom == "2") {
							cbTimeLine(item.half,item.eventTimeNum*0.82,item.x,item.y,nextX,codeType,item.code,item.personNumber,item.personNameEn,item.eventTimeFull,teamType,item.actionName);
						} else {
							cbTimeLine(item.half,item.timeNum,item.x,item.y,nextX,codeType,item.code,item.personNumber,item.personNameEn,item.eventTimeFull,teamType,item.actionName);
						}
					}
				});
			}
		});
 	}
	
	if(isNotEmpty(passCode)){
 		$.ajax({
			type : "post",
			data : "matchId="+matchId+"&half="+half+"&personId="+personId+"&passCode="+passCode+"&areaBlockedFrom="+areaBlockedFrom+"&draftedFrom="+draftedFrom+"&areaBlockedTo="+areaBlockedTo+"&draftedTo="+draftedTo+"&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeStartHalf="+timeStartHalf+"&timeEndHalf="+timeEndHalf+"&isOverTime="+isOverTimeCom,
			url : basePath+"getTracePassAjax.html",
			success:function(da){
				var json = eval(da);
				$.each(json, function(i, item) {
					//画传球线路
					drawPass("svg_trace",item.groupNo,item.personFromNum,item.personFromX,item.personFromY,item.personToNum,item.personToX,item.personToY,item.fromTeamId,item.toTeamId,item.fromTime);
				});
			}
		});
	}
}

//进球
function drawGoal(svgId,half,x,y,x2,number,name,groupNo,eventTimeFull,actionName,teamType,istrace){
	var svg = Snap("#"+svgId);

	var goalType = "GOAL";
	
	if((teamType=="H" && x2<310)||(teamType=="G" && x2>310)){//乌龙球
		goalType = "OWN";
	}
	var id = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
	var image = svg.paper.image(basePath+"images/action/icon_"+goalType+".png", x-10, y-10, 20, 20).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":id,"cursor":"hand"});

	image.dblclick(function(){
		playMedia(groupNo);
	});
	if(isNotEmpty(istrace)){
		image.attr("istrace",istrace);
	}
	var hammerImage = new Hammer(document.getElementById(id));
	hammerImage.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	image.click(function(){
		darken(svgId);
		//画进攻轨迹
		traceLine(groupNo);
		$("#currentGroupId").val(groupNo);
		$("#actionTime").val(eventTimeFull);
	});
	image.mouseover(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
		$("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
		$("#div_title_trace").css("margin-left",x-20);
		$("#div_title_trace").css("margin-top",y-40);
		$("#div_title_trace").css("display","block");
	});
	image.mouseout(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,2); 
		$("#div_title_trace").css("display","none");
	});
	
}

//进攻
function drawAttack(svgId,half,x,y,number,name,size,teamType,groupNo,eventTimeFull,code,actionName,istrace){
	x= parseInt(x);
	y= parseInt(y);
	number= parseInt(number);
	var svg = Snap("#"+svgId);
	//界外球显示在一条线上
	//x:40 580
	//y:28 389
	if(code==19){
		if(y<28){
			y=18;
		}
		if(y>389){
			y=399;
		}
	}
	var circleId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
	var textId ="t_"+circleId;
	var circle = svg.paper.circle(x, y, size).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":circleId,"cursor":"hand","stroke":colorMap.get(code+""),"stroke-width":"2"});
	var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle","font-size":size ,"cursor":"hand"});
	
	if(isNotEmpty(istrace)){
		circle.attr("istrace",istrace);
		text.attr("istrace",istrace);
	}
	
	//过人失败(虚线显示)
	if(code==172){
		circle.attr("stroke-dasharray","3 3");
	}
	
	if(teamType=="H"){//主队
		circle.attr("fill", "#3C7994");
		text.attr("fill","white");
	}else{//客队
		circle.attr("fill", "#DCF2FE");
		text.attr("fill","black");
	}
	text.click(function(){
		$("#currentGroupId").val(groupNo);
		$("#actionType").val(1);
		$("#actionTime").val(eventTimeFull);
		darken(svgId);
		//画进攻轨迹
		traceLine(groupNo);
		
	});
	circle.click(function(){
		$("#currentGroupId").val(groupNo);
		$("#actionType").val(1);
		$("#actionTime").val(eventTimeFull);
		darken(svgId);
		//画进攻轨迹
		traceLine(groupNo);
	});
	circle.dblclick(function(){
		playMedia(groupNo);
	});
	text.dblclick(function(){
		playMedia(groupNo);
	});
	var circleHammer = new Hammer(document.getElementById(circleId));
	circleHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	var textHammer = new Hammer(document.getElementById(textId));
	textHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	
	text.mouseover(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
		$("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
		$("#div_title_trace").css("margin-left",x-20);
		$("#div_title_trace").css("margin-top",y-40);
		$("#div_title_trace").css("display","block");
	});
	text.mouseout(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,2); 
		$("#div_title_trace").css("display","none");
	});
}

//防守，三角形
function drawyTriangle(svgId,half,x,y,number,name,teamType,groupNo,eventTimeFull,code,actionName){
	var docName = "pb"+number+"_"+x+"_"+y;
	// 	half.toString()+x.toString()+y.toString()+number.toString()
	x= parseInt(x);
	y= parseInt(y);
	number= parseInt(number);
	var svg = Snap("#"+svgId);
	var polySize=10;
	var poly = svg.paper.polygon([x,y-polySize ,x-polySize,y+polySize ,x+polySize,y+polySize]).attr({"name":docName,"id":"s_"+half.toString()+x.toString()+y.toString()+number.toString(),"stroke":colorMap.get(code+""),"stroke-width":"2"});
	var text = svg.paper.text(x, y+8, number).attr({"name":docName,"text-anchor":"middle" });
	
	// 抢断失败和门将出击失败(显示虚线)
	if(code==350 || code==353){
		poly.attr("stroke-dasharray","3 3");
	}
	
	if(teamType=="H"){//主队
		poly.attr("fill", "#3C7994");
		text.attr("fill","white");
	}else{//客队
		poly.attr("fill", "#DCF2FE");
		text.attr("fill","black");
	}
	text.mouseover(function() {
		highlight(svgId,docName,teamType,1); 
		$("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
		$("#div_title_trace").css("margin-left",x-20);
		$("#div_title_trace").css("margin-top",y-40);
		$("#div_title_trace").css("display","block");
		
		darkenOtherByName(svgId,docName);
	});
	text.mouseout(function() {
		highlight(svgId,docName,teamType,2); 
		$("#div_title_trace").css("display","none");
		lighten(svgId);
	});
	
	poly.dblclick(function(){
		playMedia(groupNo);
	});
	
	text.dblclick(function(){
		playMedia(groupNo);
	});
}

//犯规 正方形
function drawyRect(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName,groupNo,foulsPerson){

	
	$("#actionType").val(2);
	x= parseInt(x);
	y= parseInt(y);
	number= parseInt(number);
	var svg = Snap("#"+svgId);
	var rectWidth=15;
	var rectId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
	var textId = "t_"+rectId;
	var rect = svg.paper.rect(x-rectWidth/2, y-rectWidth/2, rectWidth, rectWidth, 2).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":rectId,"stroke":colorMap.get(code+""),"stroke-width":"2"});
	var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle"});
	
	if(teamType=="H"){//主队
		rect.attr("fill", "#3C7994");
		text.attr("fill","white");
	}else{//客队
		rect.attr("fill", "#DCF2FE");
		text.attr("fill","black");
	}
	text.dblclick(function(){
		$("#actionTime").val(eventTimeFull);
		$("#currentGroupId").val(groupNo);
		playMedia(groupNo);
	});
	var rectHammer = new Hammer(document.getElementById(rectId));
	rectHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	var textHammer = new Hammer(document.getElementById(textId));
	textHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	text.mouseover(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
		if(code = 21){//如果是犯规，则显示被犯规人
			$("#div_title_trace").html(number+" "+name+" "+eventTimeFull +" "+ actionName+" "+foulsPerson);
		}else{
			$("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
		}
		$("#div_title_trace").css("margin-left",x-20);
		$("#div_title_trace").css("margin-top",y-40);
		$("#div_title_trace").css("display","block");
	});
	text.mouseout(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,2);
		$("#div_title_trace").css("display","none");
	});
}

//对抗
function drawDuels(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName,groupNo,foulsPerson){

	$("#actionType").val(0);
	x= parseInt(x);
	y= parseInt(y);
	number= parseInt(number);
	var svg = Snap("#"+svgId);
	var rectWidth=15;
	var rectId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
	var textId = "t_"+rectId;
	var rect = svg.paper.rect(x-rectWidth/2, y-rectWidth/2, rectWidth, rectWidth, 2).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":rectId,"stroke":colorMap.get(code+""),"stroke-width":"2"});
	var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle"});
	
	if(teamType=="H"  && code=="61" ){//主队空中对抗成功
		rect.attr("fill", "#3C7994");
		text.attr("fill","white");
	}
	
	if (teamType=="G" && code=="61") {//客队空中对抗成功
		rect.attr("fill", "#DCF2FE");
		text.attr("fill","black");
	}
	if(teamType=="H"  && code=="400" ){//主队空中对抗失败
		rect.attr("fill", "#3C7994");
		text.attr("fill","red");
	}
	if (teamType=="G" && code=="400") {//客队空中对抗失败
		rect.attr("fill", "#DCF2FE");
		text.attr("fill","red");
	}
	text.dblclick(function(){
		$("#actionTime").val(eventTimeFull);
		$("#currentGroupId").val(groupNo);
		playMedia(groupNo);
	});
	var rectHammer = new Hammer(document.getElementById(rectId));
	rectHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	var textHammer = new Hammer(document.getElementById(textId));
	textHammer.on("doubletap", function(ev) {
		playMedia(groupNo);
	});
	text.mouseover(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,1);
		$("#div_title_trace").html(number+" "+name+" "+eventTimeFull +" "+ actionName);
		$("#div_title_trace").css("margin-left",x-20);
		$("#div_title_trace").css("margin-top",y-40);
		$("#div_title_trace").css("display","block");
	});
	text.mouseout(function() {
		highlight(svgId,half+""+x+""+y+""+number,teamType,2);
		$("#div_title_trace").css("display","none");
	});
}

//球权转换
function drawShift(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName){

	if (code == "503") {
		x= parseInt(x);
		y= parseInt(y);
		var svg = Snap("#"+svgId);
		var text = svg.paper.text(x,y, "x").attr({"font-face":"华文新魏","text-anchor":"middle" });
		
		if(teamType=="H" && code=="503"){//球权转换主队
			text.attr("fill", "#3C7994");//3C7994
		}
		if (teamType=="G" && code=="503") {//球权转换客队
			text.attr("fill", "#DCF2FE");//DCF2FE
		}
	} else {
		var docName = "pb"+number+"_"+x+"_"+y;
		x= parseInt(x);
		y= parseInt(y);
		number= parseInt(number);
		var svg = Snap("#"+svgId);
		var polySize=10;
		var poly = svg.paper.polygon([x-polySize, y-polySize, x, y+polySize, x+polySize, y-polySize]).attr({"name":docName,"id":"s_"+half.toString()+x.toString()+y.toString()+number.toString(),"stroke":colorMap.get(code+""),"stroke-width":"2"});
		var text = svg.paper.text(x, y, number).attr({"name":docName,"text-anchor":"middle" });
		
		if(teamType=="H"){//主队
			poly.attr("fill", "#3C7994");
			text.attr("fill","white");
		}else{//客队
			poly.attr("fill", "#DCF2FE");
			text.attr("fill","black");
		}
		text.mouseover(function() {
			highlight(svgId,docName,teamType,1); 
			$("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
			$("#div_title_trace").css("margin-left",x-20);
			$("#div_title_trace").css("margin-top",y-40);
			$("#div_title_trace").css("display","block");
			
			darkenOtherByName(svgId,docName);
		});
		text.mouseout(function() {
			highlight(svgId,docName,teamType,2); 
			$("#div_title_trace").css("display","none");
			lighten(svgId);
		});
	}
}

//时间轴
function cbTimeLine(half,timeNum,x,y,x2,codeType,code,number,personNameEn,eventTimeFull,teamType,actionName){
	var typeClass=""
	var bgcolor ="none";
	var bbcolor ="none";
	if(codeType==1||codeType==5){
		bgcolor=colorMap.get(code+"");
		typeClass="round";
	}else if(codeType==2 || (codeType== 7 && code != "503")){
		bbcolor=colorMap.get(code+"");
		typeClass="triangle";
	}else if(codeType==4 || codeType==6){
		bgcolor=colorMap.get(code+"");
		typeClass="square";
	}
	var li;
	if(code == 1 || code == 87){
		if((teamType=="H" && x2<310)||(teamType=="G" && x2>310)){//乌龙球
			li = "<li style='left:"+timeNum+"%'><span class='tooltip'><img onmouseover=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',1) onmouseout=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',2) src='"+basePath+"images/action/icon_OWN.png' width='16' height='16'/><span style='text-align:center;'>"+number+" "+personNameEn+" "+eventTimeFull+" "+actionName+"</span></span></li>";
		}else{
			li = "<li style='left:"+timeNum+"%'><span class='tooltip'><img onmouseover=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',1) onmouseout=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',2) src='"+basePath+"images/action/icon_GOAL.png' width='16' height='16'/><span style='text-align:center;'>"+number+" "+personNameEn+" "+eventTimeFull+" "+actionName+"</span></span></li>";
		}
	}else if(code == 204 ||code ==205 || code ==502){
		li = "<li style='left:"+timeNum+"%'><span class='tooltip'><div class='"+typeClass+"' style='border-bottom-color:"+bbcolor+";background-color:"+bgcolor+"' onmouseover=darkenOtherByName('svg_trace','pb"+number+"_"+x+"_"+y+"') onmouseout=lighten('svg_trace') ></div><span style='text-align:center;'>"+number+" "+personNameEn+" "+eventTimeFull+" "+actionName+"</span></span></li>";
	}else{
		li = "<li style='left:"+timeNum+"%'><span class='tooltip'><div class='"+typeClass+"' style='border-bottom-color:"+bbcolor+";background-color:"+bgcolor+"' onmouseover=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',1) onmouseout=highlight('svg_trace','"+half+x+y+number+"','"+teamType+"',2) ></div><span style='text-align:center;'>"+number+" "+personNameEn+" "+eventTimeFull+" "+actionName+"</span></span></li>";
	}
	//加时
	if(half==3 || half == 4){
		if(code == 1 || code == 87){//进球，考虑乌龙球情况
			if((teamType=="H" && x2<310)||(teamType=="G" && x2 < 310)){//客队
				$("#ul_timeLine_cb_guest").append(li);
			}
			if((teamType=="G" && x2>310)||(teamType=="H" && x2 > 310)){//主队
				$("#ul_timeLine_cb_home").append(li);
			}
		} else {
			if(teamType=="H" ){//主队
				$("#ul_timeLine_cb_home").append(li);
			}else if(teamType=="G"){//客队
				$("#ul_timeLine_cb_guest").append(li);
			}
		}
	} else{//正赛
		if(code == 1 || code == 87){//进球，考虑乌龙球情况
			if((teamType=="H" && x2<310)||(teamType=="G" && x2 < 310)){//客队
				$("#ul_timeLine_cb_guest").append(li);
			}
			if((teamType=="G" && x2>310)||(teamType=="H" && x2 > 310)){//主队
				$("#ul_timeLine_cb_home").append(li);
			}
		}else{//其他
			if(teamType=="H"){//主队
				$("#ul_timeLine_cb_home").append(li);
			}else if(teamType=="G"){//客队
				$("#ul_timeLine_cb_guest").append(li);
			}
		}
	}
	
}

//画传球线路
function drawPass(svgId,groupNo,personFromNum,personFromX,personFromY,personToNum,personToX,personToY,fromTeamId,toTeamId,traceTime){
	personFromX = parseInt(personFromX);
	personFromY = parseInt(personFromY);
	personFromNum = parseInt(personFromNum);
	personToX = parseInt(personToX);
	personToY = parseInt(personToY);
	personToNum = parseInt(personToNum);
	
	$("#actionType").val(3);
	var svg = Snap("#"+svgId);
	
	var linColor="blue";
	var circleFromColor;
	var textFromColor;
	var circleToColor;
	var textToColor;
	
	if(fromTeamId==hometeamId){//主队
		circleFromColor="#3C7994";
		textFromColor="white";
		if(toTeamId==hometeamId){//主队
			circleToColor="#3C7994";
			textToColor="white";
		}else if(toTeamId==guestteamId){//客队
			circleToColor="#DCF2FE";
			textToColor="black";
			linColor="red";
		}
	}else if(fromTeamId==guestteamId){//客队
		circleFromColor="#DCF2FE";
		textFromColor="black";
		if(toTeamId==hometeamId){//主队
			circleToColor="#3C7994";
			textToColor="white";
			linColor="red";
		}else if(toTeamId==guestteamId){//客队
			circleToColor="#DCF2FE";
			textToColor="black";
		}
	}
	
	//球传到界外，线条为红色
	if((fromTeamId==toTeamId && personToNum==0)||(fromTeamId==toTeamId && personFromNum==personToNum)){
		linColor="red";
	}
	//生成唯一name号
	var passName = fromTeamId+"_pass_"+personFromNum + new Date().getTime()+Math.random();
	
	//画线
	var pathStr = drawLineArrow(personFromX,personFromY,personToX,personToY);
	var linePath = svg.paper.path(pathStr).attr({
   		stroke: linColor,
   		strokeWidth: 1,
   		name:passName
	});
	
	
	//球传到界外,接球人不显示
	if((fromTeamId==toTeamId && personToNum==0)||(fromTeamId==toTeamId && personFromNum==personToNum)){
		//nothing
	}else{
		var circleTo = svg.paper.circle(personToX, personToY, 8).attr("name",passName);
		var textTo = svg.paper.text(personToX, personToY+5, personToNum).attr({"text-anchor":"middle","name":passName });
		circleTo.attr("fill", circleToColor);
		textTo.attr("fill",textToColor);
		
		textTo.mouseover(function(){
			darken(svgId);
			$("#"+svgId+">[name='"+passName+"']").css("opacity","1");
		});
		textTo.mouseout(function() {
			lighten(svgId);
		});
		
		//播放视频
		textTo.dblclick(function(){
			playMedia(groupNo);
			$("#actionTime").val(traceTime);
			//将groupNo写入hidden中，以便截图使用
			$("#currentGroupId").val(groupNo);
		});
	}
	
	var circleFrom = svg.paper.circle(personFromX, personFromY, 8).attr("name",passName);
	var textFrom = svg.paper.text(personFromX, personFromY+5, personFromNum).attr({"text-anchor":"middle" ,"name":passName});
	circleFrom.attr("fill", circleFromColor);
	textFrom.attr("fill",textFromColor);
	
	textFrom.mouseover(function(){
		darken(svgId);
		$("#"+svgId+">[name='"+passName+"']").css("opacity","1");
	});
	textFrom.mouseout(function() {
		lighten(svgId);
	});
	
	
	//播放视频
	textFrom.dblclick(function(){
		playMedia(groupNo);
		$("#actionTime").val(traceTime);
		//将groupNo写入hidden中，以便截图使用
		$("#currentGroupId").val(groupNo);
	});
	
// 	linePath.mouseover(function() {
// 		darken(svgId);
// 		$("#"+svgId+">[name='"+passName+"']").css("opacity","1");
// 	});
// 	linePath.mouseout(function() {
// 		lighten(svgId);
// 	});
}

//颜色MAP
var colorMap = new Map();
//进攻
colorMap.put("8","#f70909");
colorMap.put("9","#f49233");
colorMap.put("49","#ebd51c");
colorMap.put("78","#40c312");
colorMap.put("90","#5bb0eb");
colorMap.put("500","#3057e8");
colorMap.put("86","#b40ab6");
colorMap.put("172","#b40ab6");
colorMap.put("504","#42da98");
colorMap.put("410","#FF1493");
colorMap.put("411","#DDA0DD");
//定位球
colorMap.put("2","#f70909");
colorMap.put("10","#f49233");
colorMap.put("14","#ebd51c");
colorMap.put("17","#40c312");
colorMap.put("19","#5bb0eb");

//防守
// 抢断 start
colorMap.put("26","#f70909");
colorMap.put("350","#f70909");
// 抢断  end
// 门将出击 start
colorMap.put("352","#ff33ff");
colorMap.put("353","#ff33ff");
// 门将出击 end
colorMap.put("27","#f49233");
colorMap.put("28","#ebd51c");
colorMap.put("32","#40c312");
colorMap.put("502","#42da98");
colorMap.put("204","#b40ab6");
colorMap.put("205","#42da98");

//犯规
colorMap.put("21","#40c312");
colorMap.put("61","#40c312");
colorMap.put("400","#40c312");
colorMap.put("22","#f49233");
colorMap.put("24","#ebd51c");
colorMap.put("25","#f70909");
colorMap.put("117","#ebd51c");
colorMap.put("62","#42da98");
//对抗
colorMap.put("356","#FF0000");
colorMap.put("357","#40c312");
//球权转换
colorMap.put("503","FFE4B5");
colorMap.put("413","FFC0CB");
colorMap.put("412","FF1493");
colorMap.put("66","CD5C5C");
