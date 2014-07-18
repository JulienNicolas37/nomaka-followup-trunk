// version of navigator
var userAgent = "";
var version = -1;
var myTween;
var myTween2;
var arrayAnimPicto= new Array();
var isScrolling=false;
var isFirst = true
var refActiveTime;
var contactOn = false;
var currentZoom = 17;
var map;

// variables
var categClic;
var categActive;
var offsetYBtn;
var offsetYLine;
var scrollLine;
var heightListe;
var tl;
var tweenDuration = 0.2;
var decalY = -100;
var fullScreen = false;
var idTask;
var idFabOrder;
var parentCorres;
var corresTask;
var corresFabOrder;
var parentFabOrderRegroup;
var idFabOrderRegroup;
var popupLegalNoticesOpen = false;
var popupAskForQtyOpen = false;
var refreshId;

// remove 300ms mobile delay
$(function() {
    FastClick.attach(document.body);
});

$(document).ready(function(){
	// uniform
	if($("body").hasClass("login")){
		$("#form-login .controls input").uniform();
	}
	
	$("#popup-ask-for-quantity-background #popup-ask-for-quantity #content-popup .controls input").uniform();
	
	spriteAnimation();
	
	//popup legal notices
	TweenLite.to($("#popup-legal-notices"), 0, {x: "-500"});
	$('#block-bottom-sidebar a#btn-legal-notices').click(openLegalNoticesPopup);
	
	$('a#btn-close-legal-notices-popup').click(closeLegalNoticesPopup);

	//popup ask for quantity
	TweenLite.to($("#popup-ask-for-quantity"), 0, {x: "-500"});
	$('a#btn-close-ask-for-quantity-popup').click(closeAskQuantityPopup);

	// fullscreen
	$('#block-bottom-sidebar .logo').click(function(){
		if(fullScreen == false){
			launchFullScreen(document.documentElement);
			fullScreen = true;
		}else{
			exitFullscreen();
			fullScreen = false;
		}
		return false;
	});
	
	//pie
	pieManagement();

	//scrolltop
	$('a.btn-back-to-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 300);
		return false;
	});
	
	// List of fabrication orders or of tasks
	TweenLite.to($("ul#faborder-list"), 0, {y:decalY, scale: 0.5, opacity: 0, display: "none"});
	TweenLite.to($("ul#task-list"), 0, {y:decalY, scale: 0.5, opacity: 0, display: "none"});
	TweenLite.to($("ul.elements-list.active"), 0, {y:0, scale: 1, opacity: 1, display: "block"});
	
	// show, or not, next/previous arrows in the detail of a line
	showDetailArrows();

	// click on sidebar buttons
	$('a.btn-sidebar').click(clickOnSidebarBtn);
	
	// click on a line
	$('ul.elements-list li.list-line .line-clic').click(openLineBtn);
	
	// click on a task contained in a fabrication order
	$('ul.elements-list-cont li.list-line-cont .line-clic').click(openTaskInFabOrder);
	
	// click on button to show corresponding fabrication order
	$('a.parent-faborder-link').click(openCorrespondingFabOrder);
	
	// click on next arrow of the line detail
	$('a.btn-line.down').click(nextArrowBtn);
	
	// click on previous arrow of the line detail
	$('a.btn-line.up').click(previousArrowBtn);
	
	// click on close line button
	$('a.btn-close').click(closeLineBtn);
	
	// click on the corresponding fabrication order button, on the sidebar
	$('#sidebar a.btn-sidebar#btn-task #faborder-selec').click(fabOrderFilterSidebarBtn);
	
	// click on pause button in a task detail
	/*$('a.btn-pause').click(function(){
		sendPause();
		//sendPause(taskId);
		//javascript:sendPause(${task.taskId});
		return false;
	});*/
	
	// manage hashtag
	hashtagChanged();

	startRefresh();

});

function startRefresh() {
    // get refresh duration
    var refreshDuration=60000;
    var refreshConfig = $('#followup-properties .refresh-duration span').text();
    if (refreshConfig != "") {
        refreshDuration = refreshConfig
    }
    refreshId = setTimeout(function(){
        location.reload(true);}, 
        refreshDuration);
}

function removeHashtagHistory() {
    location.hash="";
}

function hashtagChanged() {
	var hash = location.hash;
	if (hash != "" && hash != "#") {
		removeCorresFabOrder(false);
		/* case of fabrication order */
		if (hash.indexOf("fo-")>-1) {
			if (hash.indexOf("/t-")>-1) {
				// get id
				var fo_id = hash.substr(4,hash.indexOf("/t-")-4);
				var t_id = hash.substr(hash.indexOf("/t-")+3,hash.length);
				// go to tasks
				$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
				showMask("btn-task", fo_id, false);
				$("a#btn-task").addClass("active").addClass("line-selec");
				// open the right task
				corresTask = $("ul#task-list li.list-line .line-clic .case.id .case-content .num-id:contains('" + t_id + "')").parent().parent().parent().parent();
				animTween(corresTask,false);
				// show fabrication order in the sidebar btn
				showCorresFabOrder(fo_id,false);						
			}else if(hash.indexOf("/t")>-1) {
				// get id
				var fo_id = hash.substr(4,hash.indexOf("/t")-4);
				// go to fabrication orders
				$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
				showMask("btn-task", fo_id, false);
				$("a#btn-task").addClass("active");
				// show fabrication order in the sidebar btn
				showCorresFabOrder(fo_id,false);	
			} else {
				// get id
				var fo_id = hash.substr(4,hash.length);
				// go to fabrication orders
				$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
				showMask("btn-faborder", "", false);
				$("a#btn-faborder").addClass("active").addClass("line-selec");
				// open the right fabrication order
				var corresFabOrder = $("ul#faborder-list li.list-line .line-clic .case.id .case-content .num-id:contains('" + fo_id + "')").parent().parent().parent().parent();
				animTween(corresFabOrder,false);
			}
		} else if (hash.indexOf("t-")>-1) {
			// get id
			var t_id = hash.substr(4,hash.length);
			// go to tasks
			$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
			showMask("btn-task", fo_id, false);
			$("a#btn-task").addClass("active").addClass("line-selec");
			// open the right task
			corresTask = $("ul#task-list li.list-line .line-clic .case.id .case-content .num-id:contains('" + t_id + "')").parent().parent().parent().parent();
			animTween(corresTask,false);
		} else if (hash === "#t") {
			// go to tasks
			$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
			showMask("btn-task", "", false);
			$("a#btn-task").addClass("active");
		} else if (hash === "#fo") {
			// go to fabrication orders
			$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
			showMask("btn-faborder", "", false);
			$("a#btn-faborder").addClass("active");
		}
	}
}


function closeLine(direction, animationOn) {
	var animationTime = 0.2;
	if (!animationOn) {
		animationTime = 0;
	}
	// if a line is already selected
	if($("li.list-line").hasClass("selec")){
		//////////////////////////////push state/////////////////////////////
		if(direction=="next"){
			var lineAze = $("li.list-line.selec").next();
			var lineId = $(".line-clic .id .case-content .num-id",lineAze).html();
			var categClicAze = $("a.btn-sidebar.active").attr('id');
			if(categClicAze == "btn-faborder"){
				history.pushState(null, null, "#fo-"+lineId);
			}else {
				if($("#faborder-selec").hasClass("mask")){
					history.pushState(null, null, "#t-"+lineId);
				}else {
					var foId = $("li.list-line.selec .line-clic .parent-faborder .parent-faborder-name .parent-faborder-id").first().html();
					history.pushState(null, null, "#fo-"+foId+"/t-"+lineId);
				}
			}
		}else if (direction=="prev") {
			var lineAze = $("li.list-line.selec").prev();
			var lineId = $(".line-clic .id .case-content .num-id",lineAze).html();
			var categClicAze = $("a.btn-sidebar.active").attr('id');
			if(categClicAze == "btn-faborder"){
				history.pushState(null, null, "#fo-"+lineId);
			}else {
				if($("#faborder-selec").hasClass("mask")){
					history.pushState(null, null, "#t-"+lineId);
				}else {
					var foId = $("li.list-line.selec .line-clic .parent-faborder .parent-faborder-name .parent-faborder-id").first().html();
					history.pushState(null, null, "#fo-"+foId+"/t-"+lineId);
				}
			}
		}
		/////////////////////////////////////////////////////////////////////
	
		TweenMax.to($("li.list-line.selec .line-clic .block-bottom").first(), animationTime, {height: "0",onComplete: function() {
			tl.timeScale(3);
			if(direction=="next"){
				var nextLine = $("li.list-line.selec").next();
				tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
				animTween(nextLine,true).delay(animationTime*1000);
			}else if (direction=="prev") {
				var nextLine = $("li.list-line.selec").prev();
				tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
				animTween(nextLine,true).delay(animationTime*1000);
			}else{
				tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
			}
		}});
	}
}

function showDetailArrows() {
	$("li.list-line").each(function(index) {
		if(($(this).next("li.list-line").length>0)&&!($(this).next("li.list-line").hasClass("back-to-top"))&&!(($(this).next("li.list-line").css("display"))=="none")){
			$("a.btn-line.down",this).removeClass("btn-line-mask");
		}else {
			$("a.btn-line.down",this).removeClass("btn-line-mask").addClass("btn-line-mask");
		}
		if(($(this).prev("li.list-line").length>0)&&!(($(this).prev("li.list-line").css("display"))=="none")){
			$("a.btn-line.up",this).removeClass("btn-line-mask");
		}else {
			$("a.btn-line.up",this).removeClass("btn-line-mask").addClass("btn-line-mask");
		}
	});
}

function animTween(line,animationOn) {
	var animationTime = 0.1;
	if (!animationOn) {
		animationTime = 0;
	}
	closeLine("",animationOn);
	$("a.btn-sidebar.active").removeClass("line-selec");
	$('li.list-line').removeClass("selec");
	$("li.list-line .block-bottom").height("auto");
	line.addClass("selec");
	categActive = $("a.btn-sidebar.active").attr("id");
	offsetYLine=line.position().top;
	$("a.btn-sidebar.active").addClass("line-selec");
	var heightBlocBottom = $('.block-bottom', line).first().height();
	$('.block-bottom', line).first().css("height","0");
	if(categActive == "btn-faborder"){
		offsetYBtn=-15;
		scrollLine=-(offsetYLine-offsetYBtn-30);
		TweenLite.to($("ul#faborder-list"), animationTime*8, {y:scrollLine});
	}else{
		offsetYBtn=102;
		scrollLine=-(offsetYLine-offsetYBtn-120);
		TweenLite.to($("ul#task-list"), animationTime*8, {y:scrollLine});
	}
	
	$("html, body").animate({ scrollTop: 0 }, animationTime*3000);
	tl = new TimelineLite();
	if(categActive == "btn-faborder"){
		tl.to($(".id", line).first(), animationTime, {background:"#93e0df"});
	}else{
		tl.to($(".id", line).first(), animationTime, {background:"#d07fef"});
	}
	if($(window).width()<=770){
		tl.to($(".id", line).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "29%"});
	}else{
		tl.to($(".id", line).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "25%"});
	}
	tl.to($(".id .case-content", line).first(), animationTime, {paddingRight: "45px"});
	tl.to($(".id .arrow-detail", line).first(), animationTime, {marginRight:"-30px", opacity: "1"});
	tl.to($(".progress-open", line).first(), animationTime, {marginLeft: "0", opacity: "1"});
	tl.to($("a.btn-line", line), animationTime, {marginRight:"0", opacity: "1"});
	tl.to($(".id a.btn-close", line).first(), animationTime, {display: "block", marginRight:"-5px", opacity: "1"});
	TweenMax.to($(".block-bottom", line).first(), animationTime*3, {height: heightBlocBottom, delay:animationTime*7});
}

function animTweenAze(line,animationOn) {
	var animationTime = 0.1;
	if (!animationOn) {
		animationTime = 0;
	}
	TweenMax.to($("li.list-line.selec .line-clic .block-bottom").first(), animationTime*2, {height: "0",onComplete: function() {
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
		$("a.btn-sidebar.active").removeClass("line-selec");
		$('li.list-line').removeClass("selec");
		$("li.list-line .line-clic .block-bottom").height("auto");
		line.addClass("selec");
		categActive = $("a.btn-sidebar.active").attr("id");
		offsetYLine=line.position().top;
		$("a.btn-sidebar.active").addClass("line-selec");
		var heightBlocBottom = $('.block-bottom', line).first().height();
		$('.block-bottom', line).first().css("height","0");
		if(categActive == "btn-faborder"){
			offsetYBtn=-15;
			scrollLine=-(offsetYLine-offsetYBtn-30);
			TweenLite.to($("ul#faborder-list"), animationTime*8, {y:scrollLine});
		}else{
			offsetYBtn=102;
			scrollLine=-(offsetYLine-offsetYBtn-120);
			TweenLite.to($("ul#task-list"), animationTime*8, {y:scrollLine});
		}
		
		$("html, body").animate({ scrollTop: 0 }, animationTime*3000);
		
		
		tl = new TimelineLite();
		if(categActive == "btn-faborder"){
			tl.to($(".id", line).first(), animationTime, {background:"#93e0df"});
		}else{
			tl.to($(".id", line).first(), animationTime, {background:"#d07fef"});
		}
		if($(window).width()<=770){
			tl.to($(".id", line).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "29%"});
		}else{
			tl.to($(".id", line).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "25%"});
		}
		tl.to($(".id .case-content", line).first(), animationTime, {paddingRight: "45px"});
		tl.to($(".id .arrow-detail", line).first(), animationTime, {marginRight:"-30px", opacity: "1"});
		tl.to($(".progress-open", line).first(), animationTime, {marginLeft: "0", opacity: "1"});
		tl.to($("a.btn-line", line), animationTime, {marginRight:"0", opacity: "1"});
		tl.to($(".id a.btn-close", line).first(), animationTime, {display: "block", marginRight:"-5px", opacity: "1"});
		TweenMax.to($(".block-bottom", line).first(), animationTime*3, {height: heightBlocBottom, delay:animationTime*7});
	}});

}


function showMask(category, idFabOrderRegroup, animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	if(category == "btn-faborder"){
		$("ul#task-list").removeClass("active");
		$("ul#faborder-list").addClass("active");
		$("ul#faborder-list").css("display", "block");
		TweenLite.to($("ul#task-list"), animationTime, {y:decalY, opacity: "0", scale: 1.5, onComplete: function() {
			$("ul#task-list").css("display", "none");
		}});
		TweenMax.fromTo($("ul#faborder-list"), animationTime, {scale:0.5}, {y:0, opacity: "1", scale: 1, delay:animationTime});
	}else{
		$("ul#faborder-list").removeClass("active");
		$("ul#task-list").addClass("active");
		if(idFabOrderRegroup){
			$("ul#task-list li.list-line").css("display", "none");
			$("ul#task-list li.list-line.back-to-top").css("display", "block");
			$("ul#task-list li.list-line .line-clic .parent-faborder .parent-faborder-name .parent-faborder-id:contains('" + idFabOrderRegroup + "')").parent().parent().parent().parent().css("display","block");
			showDetailArrows();
		}else{
			$("ul#task-list li.list-line").css("display", "block");
		}
		$("ul#task-list").css("display", "block");
		TweenLite.to($("ul#faborder-list"), animationTime, {y:decalY, opacity: "0", scale: 1.5, onComplete: function() {
			$("ul#faborder-list").css("display", "none");
		}});
		TweenMax.fromTo($("ul#task-list"), animationTime,  {scale:0.5}, {y:0, opacity: "1", scale: 1,delay:animationTime});
	}
}

function showCorresFabOrder(idFabOrderRegroup,animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	// show corresponding fabrication order id in the btn
	$("#sidebar a.btn-sidebar#btn-task #faborder-selec .faborder-id-selec").html(idFabOrderRegroup);
	// show and animate fabrication order
	$("#sidebar a.btn-sidebar#btn-task #faborder-selec").removeClass("mask");
	TweenLite.to($("#sidebar a.btn-sidebar#btn-task"), animationTime, {paddingTop:"33px", paddingBottom:"38px"});
	TweenLite.from($("#sidebar a.btn-sidebar#btn-task #faborder-selec"), animationTime*3, {opacity: "0", y:"-250"});
}

function removeCorresFabOrder(animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	// remove btn of corresponding fabrication order in the sidebar
	TweenLite.to($("#sidebar a.btn-sidebar#btn-task"), animationTime, {paddingTop:"48px", paddingBottom:"23px"});
	$("#sidebar a.btn-sidebar#btn-task #faborder-selec").removeClass("mask").addClass("mask");
	closeLine("",true);
}

// launch fullscreen for right navigator
function launchFullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// exit fullscreen for right navigator
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozExitFullScreen) {
    document.mozExitFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function spriteAnimation() {
	// animation of sprites
	$("#block-content #content ul.elements-list li.list-line.finished .case.status .picto-status").spriteanim().on('frame-46-shown', function() {
		$(this).spriteanim('stop');
	});
	
	$("#block-content #content ul.elements-list li.list-line.pause .case.status .picto-status").spriteanim();
	$("#block-content #content ul.elements-list li.list-line.in-progress .case.status .picto-status").spriteanim();
	$("#block-content #content ul.elements-list li.list-line.ready .case.status .picto-status").spriteanim();

}

// click on sidebar buttons
function clickOnSidebarBtn() {
	//////////////////////////////push state/////////////////////////////
	categClicAze = $(this).attr('id');
	if(categClicAze == "btn-faborder"){
		history.pushState(null, null, "#fo");
	}else {
		history.pushState(null, null, "#t");
	}
	/////////////////////////////////////////////////////////////////////
	closeLine("",true);
	$("a.btn-sidebar.active").removeClass("line-selec");
	$('li.list-line').removeClass("selec");
	categClic = $(this).attr('id');
	if (!($(this).hasClass("active"))) {
		$('a.btn-sidebar').removeClass("active");
		$(this).addClass("active");
		
		// show and mask right lines
		showMask(categClic,"",true);
		if(categClic == "btn-faborder"){
			removeCorresFabOrder(true);
		}
	}else{
		if(categClic == "btn-faborder"){
			TweenLite.to($("ul#faborder-list"), tweenDuration, {y:0});
		}else{
			TweenLite.to($("ul#task-list"), tweenDuration, {y:0});
		}
	}
	showDetailArrows();
	$("html, body").animate({ scrollTop: 0 }, 300);
	return false;
}

// Click on a line
function openLineBtn() {
	if( ($(this).parent().parent().hasClass("elements-list")) && !($(this).parent().hasClass("titles")) && !($(this).parent().hasClass("back-to-top")) && !($(this).parent().hasClass("selec"))){
		//////////////////////////////push state/////////////////////////////
		var idElemStock = $(".id .case-content .num-id",this).first().html();
		if($("a#btn-faborder").hasClass("active")){
			var typeElemStock = "fo";
			history.pushState(null, null, "#"+typeElemStock+"-"+idElemStock);
		}else{
			var typeElemStock = "t";
			if($("#faborder-selec").hasClass("mask")){
				history.pushState(null, null, "#"+typeElemStock+"-"+idElemStock);
			}else {
				var foId = $("li.list-line.selec .line-clic .parent-faborder .parent-faborder-name .parent-faborder-id").first().html();
				history.pushState(null, null, "#fo-"+foId+"/t-"+idElemStock);
			}
		}
		
		/////////////////////////////////////////////////////////////////////
		if($("li.list-line").hasClass("selec")){
			animTweenAze($(this).parent(), true);
		}else {
			animTween($(this).parent(), true);
		}
	}
	return false;
}

// click on next arrow of the line detail
function nextArrowBtn() {
	closeLine("next", true);
	return false;
}

function previousArrowBtn() {
	closeLine("prev",true);
	return false;
}

//click on a task contained in a fabrication order
function openTaskInFabOrder() {
	// get corresponding task id
	idTask = $(".id .case-content .num-id", this).html();
	parentFabOrderRegroup = $(this).parent().parent().parent().parent().parent();
	idFabOrderRegroup = $(".id .case-content .num-id",parentFabOrderRegroup).html();
	//////////////////////////////push state/////////////////////////////
	var idElemStock = $(".id .case-content .num-id",this).first().html();
	history.pushState(null, null, "#fo-"+idFabOrderRegroup+"/t-"+idElemStock);
	/////////////////////////////////////////////////////////////////////
	// close current line
	closeLine("",true);
	tl.timeScale(3);
	tl.reverse(0,{onReverseComplete:$(this).parent().parent().parent().parent().removeClass("selec")});
	$("html, body").animate({ scrollTop: 0 }, 300);
	// go on tasks
	$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
	showMask("btn-task", idFabOrderRegroup, true);
	$("a#btn-task").addClass("active").addClass("line-selec");
	
	// open the right task
	corresTask = $("ul#task-list li.list-line .line-clic .case.id .case-content .num-id:contains('" + idTask + "')").parent().parent().parent().parent();
	setTimeout(function(){
		animTween(corresTask,true);
	}, 400);
	
	// show fabrication order in the sidebar btn
	showCorresFabOrder(idFabOrderRegroup,true);
	return false;
}

// click on button to show corresponding fabrication order
function openCorrespondingFabOrder() {
	// get corresponding fabrication order id
	parentCorres = $(this).parent();
	idFabOrder = $(".parent-faborder-name .parent-faborder-id", parentCorres).html();
	//////////////////////////////push state/////////////////////////////
	history.pushState(null, null, "#fo-"+idFabOrder);
	/////////////////////////////////////////////////////////////////////
	// close current line
	closeLine("",true);
	tl.timeScale(3);
	tl.reverse(0,{onReverseComplete:$(this).parent().parent().removeClass("selec")});
	$("html, body").animate({ scrollTop: 0 }, 300);
	// go to fabrication orders
	$("a.btn-sidebar.active").removeClass("line-selec").removeClass("active");
	showMask("btn-faborder","",true);
	$("a#btn-faborder").addClass("active").addClass("line-selec");
	removeCorresFabOrder(true);
	// open the right fabrication order
	var corresFabOrder = $("ul#faborder-list li.list-line .line-clic .case.id .case-content .num-id:contains('" + idFabOrder + "')").parent().parent().parent().parent();
	setTimeout(function(){
		animTween(corresFabOrder,true);
	}, 400);
	return false;
}

//pie
function pieManagement() {
	if(typeof(onetwo) === 'undefined'){
		onetwo=true;
	}
	$(".pie").peity("pie", {
		width: 50,
		height: 50,
		colours: function(value) {
			if(onetwo){
				if(value < 5){
					onetwo = false;
					return "#5a5a5a";
				}else if (value < 12){
					onetwo = false;
					return "#878787";
				}else if (value < 25){
					onetwo = false;
					return "#ce3e17";
				}else if (value < 37) {
					onetwo = false;
					return "#ce9100";
				}else if (value < 50) {
					onetwo = false;
					return "#ffc71c";
				}else if (value < 67) {
					onetwo = false;
					return "#c6ba00";
				}else if (value < 75) {
					onetwo = false;
					return "#aad413";
				}else if (value < 100) {
					onetwo = false;
					return "#30ca2f";
				}else if (value == 100) {
					onetwo = false;
					return "#3a9633";
				}
			}else {
				onetwo = true;
				return "#5a5a5a";
			}
		}
	});
}

//click on close line button
function closeLineBtn() {
	//////////////////////////////push state/////////////////////////////
	if($("#faborder-selec").hasClass("mask")){
		categClicAze = $("a.btn-sidebar.active").attr('id');
		if(categClicAze == "btn-faborder"){
			history.pushState(null, null, "#fo");
		}else {
			history.pushState(null, null, "#t");
		}
	}else {
		var idFabOrder = $("#faborder-selec .faborder-id-selec").html();
		history.pushState(null, null, "#fo-"+idFabOrder+"/t");
	}
	/////////////////////////////////////////////////////////////////////
	TweenMax.to($("li.list-line.selec .block-bottom").first(), 0.2, {height: "0",onComplete: function() {
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
	}});
	$("a.btn-sidebar.active.line-selec").removeClass("line-selec");
	categActive = $("a.btn-sidebar.active").attr("id");
	if(categActive == "btn-faborder"){
		TweenLite.to($("ul#faborder-list"), 0.8, {y:0});
	}else {
		TweenLite.to($("ul#task-list"), 0.8, {y:0});
	}
	$("html, body").animate({ scrollTop: 0 }, 300);
	
	return false;
}

// click on the corresponding fabrication order button, on the sidebar
function fabOrderFilterSidebarBtn() {
	//////////////////////////////push state/////////////////////////////
	history.pushState(null, null, "#t");
	/////////////////////////////////////////////////////////////////////
	// close current line
	if($("li.list-line").hasClass("selec")){
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$("li.list-line.selec").removeClass("selec")});
		
		$("a.btn-sidebar.active.line-selec").removeClass("line-selec");
		categActive = $("a.btn-sidebar.active").attr("id");
		if(categActive == "btn-faborder"){
			TweenLite.to($("ul#faborder-list"), 0.8, {y:0});
		}else {
			TweenLite.to($("ul#task-list"), 0.8, {y:0});
		}
		$("html, body").animate({ scrollTop: 0 }, 300);
	}
	$("ul#task-list li.list-line").css("display", "block");
	removeCorresFabOrder(true);
	showDetailArrows();
	return false;
}

//popup legal notices
function openLegalNoticesPopup() {
    tlPopup = new TimelineLite();
    if(popupLegalNoticesOpen == false){
        $("#popup-legal-notices-background").css("pointer-events","auto");
        tlPopup.to($("#popup-legal-notices-background"), 0.1, {backgroundColor: "rgba(0,0,0,0.4)"});
        tlPopup.to($("#popup-legal-notices"), 0.2, {opacity: "1", x: "0"});
        popupLegalNoticesOpen = true;
    }
    return false;
}

// Close Legal Notices popup
function closeLegalNoticesPopup() {
    if(popupLegalNoticesOpen == true){
        $("#popup-legal-notices-background").css("pointer-events","none");
        tlPopup.to($("#popup-legal-notices"), 0.2, {opacity: "0", x: "-500"});
        tlPopup.to($("#popup-legal-notices-background"), 0.1, {backgroundColor: "rgba(0,0,0,0)"});
        popupLegalNoticesOpen = false;
    }
    return false;
}

//popup legal notices
function openAskQuantityPopup(label, typeOfProduct, showNextBtn, showAddBtn) {
    clearTimeout(refreshId);
    tlPopup = new TimelineLite();
    
    // Manage label of popup
    document.getElementById("popup-ask-product").innerHTML = label;
    
    // Icon and label of product
    if (typeOfProduct == "component") {
        document.getElementById("popup-ask-label-component").style.display = "inline-block";
        document.getElementById("popup-ask-label-finished-good").style.display = "none";
        document.getElementById("img-content-component").style.display = "inline-block";
        document.getElementById("img-content-fab-order").style.display = "none";
    } else {
        document.getElementById("popup-ask-label-component").style.display = "none";
        document.getElementById("popup-ask-label-finished-good").style.display = "inline-block";
        document.getElementById("img-content-component").style.display = "none";
        document.getElementById("img-content-fab-order").style.display = "inline-block";
    }
    
    // Manage buttons
    if (showNextBtn) {
        document.getElementById("btn-validate-ask-for-quantity-popup").style.display = "none";
        document.getElementById("btn-next-component-popup").style.display = "block";
    } else {
        document.getElementById("btn-validate-ask-for-quantity-popup").style.display = "block";
        document.getElementById("btn-next-component-popup").style.display = "none";
    }
    // deactivated until development is done
//    if (showAddBtn) {
//        document.getElementById("btn-add-component-popup").style.display = "block";
//    } else {
//        document.getElementById("btn-add-component-popup").style.display = "none";
//    }
    
    if(popupAskForQtyOpen == false){
        $("#popup-ask-for-quantity-background").css("pointer-events","auto");
        tlPopup.to($("#popup-ask-for-quantity-background"), 0.1, {backgroundColor: "rgba(0,0,0,0.4)"});
        tlPopup.to($("#popup-ask-for-quantity"), 0.2, {opacity: "1", x: "-250"});
        popupAskForQtyOpen = true;
    }
    return false;
}

// Close Legal Notices popup
function closeAskQuantityPopup() {
    if(popupAskForQtyOpen == true){
        $("#popup-ask-for-quantity-background").css("pointer-events","none");
        tlPopup.to($("#popup-ask-for-quantity"), 0.2, {opacity: "0", x: "-500"});
        tlPopup.to($("#popup-ask-for-quantity-background"), 0.1, {backgroundColor: "rgba(0,0,0,0)"});
        popupAskForQtyOpen = false;
        startRefresh();
    }
    cleanPopupAskData();
    return false;
}

function cleanPopupAskData() {
    document.getElementById("open-popup-ask").value = "N";
    document.getElementById("validate-popup-ask").value = "N";
    document.getElementById("popup-ask-current-component-count").value = "0";
    document.getElementById("popup-ask-products-quantity").value = "";
    document.getElementById("popup-ask-products-lotId").value = "";
    document.getElementById("popup-ask-productsId").value = "";
    document.getElementById("popup-ask-productId").value = "";
    document.getElementById("popup-ask-quantity").value = "0";
    document.getElementById("popup-ask-lotId").value = "";
}
