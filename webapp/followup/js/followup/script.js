// version du navigateur
var userAgent = "";
var version = -1;
var myTween;
var myTween2;
var arrayAnimPicto= new Array();
var ItemEncours=null;
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
var offsetYLigne;
var scrollLine;
var heightListe;
var tl;
var tweenDuration = 0.2;
var decalY = -100;
var fullScreen = false;
var idTache;
var idOf;
var parentCorres;
var tCorres;
var ofCorres;
var parentOfRegroup;
var idOfRegroup;
var popupopen = false;


// remove 300ms mobile delay
$(function() {
    FastClick.attach(document.body);
});

//setTimeout(function(){
//window.location.reload(1);}, 
//300000);

$(document).ready(function(){
	// uniform
	if($("body").hasClass("login")){
		$("#form-login .controls input").uniform();
	}
	// animation des sprites
	$("#bloc-content #content ul.liste-elements li.ligne-liste.fini .case.statut .picto-statut").spriteanim().on('frame-46-shown', function() {
		$(this).spriteanim('stop');
	});
	
	$("#bloc-content #content ul.liste-elements li.ligne-liste.pause .case.statut .picto-statut").spriteanim();
	$("#bloc-content #content ul.liste-elements li.ligne-liste.en-cours .case.statut .picto-statut").spriteanim();
	
	// picto ready blanc/gris
	$("li.ligne-liste.ready").each(function(index) {
	  if ($(".ligne-clic .case",this).css("background-color")=="rgb(255, 255, 255)") {
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/ready");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }else{
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/readyt");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }
	});
	
	// picto ready blanc/gris liste-inte
	$("li.ligne-liste-inte.ready").each(function(index) {
	  if ($(".ligne-clic .case",this).css("background-color")=="rgb(255, 255, 255)") {
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/ready");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }else{
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/readyt");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }
	});
	
	
	
	
	//popup mentions légales
	TweenLite.to($("#popup-mentions-legales"), 0, {x: "-500"});
	$('#bloc-bottom-sidebar a#btn-mentions-legales').click(function(){
		tlPopup = new TimelineLite();
		if(popupopen == false){
			$("#popup-mentions-legales-fond").css("pointer-events","auto");
			tlPopup.to($("#popup-mentions-legales-fond"), 0.1, {backgroundColor: "rgba(0,0,0,0.4)"});
			tlPopup.to($("#popup-mentions-legales"), 0.2, {opacity: "1", x: "0"});
			popupopen = true;
		}
		return false;
	});
	$('a#btn-fermer-popup').click(function(){
		if(popupopen == true){
			$("#popup-mentions-legales-fond").css("pointer-events","none");
			tlPopup.to($("#popup-mentions-legales"), 0.2, {opacity: "0", x: "-500"});
			tlPopup.to($("#popup-mentions-legales-fond"), 0.1, {backgroundColor: "rgba(0,0,0,0)"});
			popupopen = false;
		}
		return false;
	});

	//plein ecran
	$('#bloc-bottom-sidebar .logo').click(function(){
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
	if(typeof(undeux) === 'undefined'){
		undeux=true;
	}
	$(".pie").peity("pie", {
		width: 50,
		height: 50,
		colours: function(value) {
			if(undeux){
				if(value<5){
					undeux=false;
					return "#5a5a5a";
				}else if (value<12){
					undeux=false;
					return "#878787";
				}else if (value<25){
					undeux=false;
					return "#ce3e17";
				}else if (value<37) {
					undeux=false;
					return "#ce9100";
				}else if (value<50) {
					undeux=false;
					return "#ffc71c";
				}else if (value<67) {
					undeux=false;
					return "#c6ba00";
				}else if (value<75) {
					undeux=false;
					return "#aad413";
				}else if (value<100) {
					undeux=false;
					return "#30ca2f";
				}else if (value==100) {
					undeux=false;
					return "#3a9633";
				}
			}else {
				undeux=true;
				return "#5a5a5a";
			}
		}
	});
	
	
	//scrolltop
	$('a.btn-retour-haut').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 300);
		return false;
	});
	
	//listes des ordres de fabrications ou des taches
	TweenLite.to($("ul#liste-of"), 0, {y:decalY, scale: 0.5, opacity: 0, display: "none"});
	TweenLite.to($("ul#liste-t"), 0, {y:decalY, scale: 0.5, opacity: 0, display: "none"});
	TweenLite.to($("ul.liste-elements.active"), 0, {y:0, scale: 1, opacity: 1, display: "block"});
	
	//affichage ou non des fleches suivant/precedant dans le detail d'une ligne
	afficFlechesDetail();

	//clic les boutons de la sidebar
	$('a.btn-sidebar').click(function(){
		//////////////////////////////push state/////////////////////////////
		categClicAze = $(this).attr('id');
		if(categClicAze == "btn-of"){
			history.pushState(null, null, "#of");
		}else {
			history.pushState(null, null, "#t");
		}
		/////////////////////////////////////////////////////////////////////
		fermerLigne("",true);
		$("a.btn-sidebar.active").removeClass("ligne-selec");
		$('li.ligne-liste').removeClass("selec");
		categClic = $(this).attr('id');
		if (!($(this).hasClass("active"))) {
			$('a.btn-sidebar').removeClass("active");
			$(this).addClass("active");
			
			//afficher et masquer les bonnes listes
			afficMasque(categClic,"",true);
			if(categClic == "btn-of"){
				removeOfCorres(true);
			}
		}else{
			if(categClic == "btn-of"){
				TweenLite.to($("ul#liste-of"), tweenDuration, {y:0});
			}else{
				TweenLite.to($("ul#liste-t"), tweenDuration, {y:0});
			}
		}
		afficFlechesDetail();
		$("html, body").animate({ scrollTop: 0 }, 300);
		return false;
	});
	
	//clic sur une ligne
	$('ul.liste-elements li.ligne-liste .ligne-clic').click(function(){
		if( ($(this).parent().parent().hasClass("liste-elements")) && !($(this).parent().hasClass("titres")) && !($(this).parent().hasClass("retour-haut")) && !($(this).parent().hasClass("selec"))){
			//////////////////////////////push state/////////////////////////////
			var idElemStock = $(".id .case-content .num-id",this).first().html();
			if($("a#btn-of").hasClass("active")){
				var typeElemStock = "of";
				history.pushState(null, null, "#"+typeElemStock+"-"+idElemStock);
			}else{
				var typeElemStock = "t";
				if($("#of-selec").hasClass("masque")){
					history.pushState(null, null, "#"+typeElemStock+"-"+idElemStock);
				}else {
					var ofId = $("li.ligne-liste.selec .ligne-clic .of-correspondant .nom-ordre-correspondant .num-of-corres").first().html();
					history.pushState(null, null, "#of-"+ofId+"/t-"+idElemStock);
				}
			}
			
			/////////////////////////////////////////////////////////////////////
			if($("li.ligne-liste").hasClass("selec")){
				animTweenAze($(this).parent(), true);
			}else {
				animTween($(this).parent(), true);
			}
		}
		return false;
	});
	
	//clic sur une tache inte
	$('ul.liste-elements-inte li.ligne-liste-inte .ligne-clic').click(function(){
		//récupérer l'id de la tâche à ouvrir
		idTache = $(".id .case-content .num-id", this).html();
		parentOfRegroup = $(this).parent().parent().parent().parent().parent();
		idOfRegroup = $(".id .case-content .num-id",parentOfRegroup).html();
		//////////////////////////////push state/////////////////////////////
		var idElemStock = $(".id .case-content .num-id",this).first().html();
		history.pushState(null, null, "#of-"+idOfRegroup+"/t-"+idElemStock);
		/////////////////////////////////////////////////////////////////////
		//fermer la ligne en cours
		fermerLigne("",true);
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$(this).parent().parent().parent().parent().removeClass("selec")});
		$("html, body").animate({ scrollTop: 0 }, 300);
		//passer au tâches
		$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
		afficMasque("btn-t", idOfRegroup, true);
		$("a#btn-t").addClass("active").addClass("ligne-selec");
		
		//ouvrir la bonne tâche
		tCorres = $("ul#liste-t li.ligne-liste .ligne-clic .case.id .case-content .num-id:contains('" + idTache + "')").parent().parent().parent().parent();
		setTimeout(function(){
			animTween(tCorres,true);
		}, 400);
		
		//afficher l'of dans le btn sidebar
		afficOfCorres(idOfRegroup,true);
		return false;
	});
	
	//clic sur le bouton pour voir l'of correspondant
	$('a.lien-of-correspondant').click(function(){
		//récupérer l'id de l'of à ouvrir
		parentCorres = $(this).parent();
		idOf = $(".nom-ordre-correspondant .num-of-corres", parentCorres).html();
		//////////////////////////////push state/////////////////////////////
		history.pushState(null, null, "#of-"+idOf);
		/////////////////////////////////////////////////////////////////////
		//fermer la ligne en cours
		fermerLigne("",true);
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$(this).parent().parent().removeClass("selec")});
		$("html, body").animate({ scrollTop: 0 }, 300);
		//passer au of
		$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
		afficMasque("btn-of","",true);
		$("a#btn-of").addClass("active").addClass("ligne-selec");
		removeOfCorres(true);
		//ouvrir le bon of
		var ofCorres = $("ul#liste-of li.ligne-liste .ligne-clic .case.id .case-content .num-id:contains('" + idOf + "')").parent().parent().parent().parent();
		setTimeout(function(){
			animTween(ofCorres,true);
		}, 400);
		return false;
	});
	
	//clic sur fleche suivant du detail de la ligne
	$('a.btn-ligne.down').click(function(){
		fermerLigne("suiv", true);
		return false;
	});
	
	//clic sur fleche prec du detail de la ligne
	$('a.btn-ligne.up').click(function(){
		fermerLigne("prec",true);
		return false;
	});
	
	//clic sur le btn fermer la ligne
	$('a.btn-fermer').click(function(){
		//////////////////////////////push state/////////////////////////////
		if($("#of-selec").hasClass("masque")){
			categClicAze = $("a.btn-sidebar.active").attr('id');
			if(categClicAze == "btn-of"){
				history.pushState(null, null, "#of");
			}else {
				history.pushState(null, null, "#t");
			}
		}else {
			var idOf = $("#of-selec .num-of-selec").html();
			history.pushState(null, null, "#of-"+idOf+"/t");
		}
		/////////////////////////////////////////////////////////////////////
		TweenMax.to($("li.ligne-liste.selec .bloc-bottom").first(), 0.2, {height: "0",onComplete: function() {
			tl.timeScale(3);
			tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
		}});
		$("a.btn-sidebar.active.ligne-selec").removeClass("ligne-selec");
		categActive = $("a.btn-sidebar.active").attr("id");
		if(categActive == "btn-of"){
			TweenLite.to($("ul#liste-of"), 0.8, {y:0});
		}else {
			TweenLite.to($("ul#liste-t"), 0.8, {y:0});
		}
		$("html, body").animate({ scrollTop: 0 }, 300);
		
		return false;
	});
	
	//clic sur le bouton de l'odre de fabrication correspondant, dans la sidebar
	$('#sidebar a.btn-sidebar#btn-t #of-selec').click(function(){
		//////////////////////////////push state/////////////////////////////
		history.pushState(null, null, "#t");
		/////////////////////////////////////////////////////////////////////
		//fermer la ligne
		if($("li.ligne-liste").hasClass("selec")){
			tl.timeScale(3);
			tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
			
			$("a.btn-sidebar.active.ligne-selec").removeClass("ligne-selec");
			categActive = $("a.btn-sidebar.active").attr("id");
			if(categActive == "btn-of"){
				TweenLite.to($("ul#liste-of"), 0.8, {y:0});
			}else {
				TweenLite.to($("ul#liste-t"), 0.8, {y:0});
			}
			$("html, body").animate({ scrollTop: 0 }, 300);
		}
		$("ul#liste-t li.ligne-liste").css("display", "block");
		removeOfCorres(true);
		afficFlechesDetail();
		return false;
	});
	
	//clic sur le bouton pause du détail d'une tâche
	/*$('a.btn-pause').click(function(){
		sendPause();
		//sendPause(taskId);
		//javascript:sendPause(${task.taskId});
		return false;
	});*/
	
	// gérer le hashtag
	window.onpopstate = function(event) {
	  hashtagChanged();
	};
	 
});

function hashtagChanged() {
	var hash = location.hash;
	if (hash != "" && hash != "#") {
		removeOfCorres(false);
		/* cas de l'of */
		if (hash.indexOf("of-")>-1) {
			if (hash.indexOf("/t-")>-1) {
				// récupérer l'id
				var of_id = hash.substr(4,hash.indexOf("/t-")-4);
				var t_id = hash.substr(hash.indexOf("/t-")+3,hash.length);
				//passer aux tâches
				$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
				afficMasque("btn-t", of_id, false);
				$("a#btn-t").addClass("active").addClass("ligne-selec");
				//ouvrir la bonne tâche
				tCorres = $("ul#liste-t li.ligne-liste .ligne-clic .case.id .case-content .num-id:contains('" + t_id + "')").parent().parent().parent().parent();
				animTween(tCorres,false);
				//afficher l'of dans le btn sidebar
				afficOfCorres(of_id,false);						
			}else if(hash.indexOf("/t")>-1) {
				// récupérer l'id
				var of_id = hash.substr(4,hash.indexOf("/t")-4);
				//passer aux of
				$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
				afficMasque("btn-t", of_id, false);
				$("a#btn-t").addClass("active");
				//afficher l'of dans le btn sidebar
				afficOfCorres(of_id,false);	
			} else {
				// récupérer l'id
				var of_id = hash.substr(4,hash.length);
				//passer aux of
				$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
				afficMasque("btn-of", "", false);
				$("a#btn-of").addClass("active").addClass("ligne-selec");
				//ouvrir la bonne of
				var ofCorres = $("ul#liste-of li.ligne-liste .ligne-clic .case.id .case-content .num-id:contains('" + of_id + "')").parent().parent().parent().parent();
				animTween(ofCorres,false);
			}
		} else if (hash.indexOf("t-")>-1) {
			// récupérer l'id
			var t_id = hash.substr(4,hash.length);
			//passer aux tâches
			$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
			afficMasque("btn-t", of_id, false);
			$("a#btn-t").addClass("active").addClass("ligne-selec");
			//ouvrir la bonne tâche
			tCorres = $("ul#liste-t li.ligne-liste .ligne-clic .case.id .case-content .num-id:contains('" + t_id + "')").parent().parent().parent().parent();
			animTween(tCorres,false);
		} else if (hash === "#t") {
			//passer aux tâches
			$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
			afficMasque("btn-t", "", false);
			$("a#btn-t").addClass("active");
		} else if (hash === "#of") {
			//passer aux of
			$("a.btn-sidebar.active").removeClass("ligne-selec").removeClass("active");
			afficMasque("btn-of", "", false);
			$("a#btn-of").addClass("active");
		}
	}
}


function fermerLigne(direction, animationOn) {
	var animationTime = 0.2;
	if (!animationOn) {
		animationTime = 0;
	}
	//si il y a deja une ligne de selectionnee
	if($("li.ligne-liste").hasClass("selec")){
		//////////////////////////////push state/////////////////////////////
		if(direction=="suiv"){
			var ligneAze = $("li.ligne-liste.selec").next();
			var ligneId = $(".ligne-clic .id .case-content .num-id",ligneAze).html();
			var categClicAze = $("a.btn-sidebar.active").attr('id');
			if(categClicAze == "btn-of"){
				history.pushState(null, null, "#of-"+ligneId);
			}else {
				if($("#of-selec").hasClass("masque")){
					history.pushState(null, null, "#t-"+ligneId);
				}else {
					var ofId = $("li.ligne-liste.selec .ligne-clic .of-correspondant .nom-ordre-correspondant .num-of-corres").first().html();
					history.pushState(null, null, "#of-"+ofId+"/t-"+ligneId);
				}
			}
		}else if (direction=="prec") {
			var ligneAze = $("li.ligne-liste.selec").prev();
			var ligneId = $(".ligne-clic .id .case-content .num-id",ligneAze).html();
			var categClicAze = $("a.btn-sidebar.active").attr('id');
			if(categClicAze == "btn-of"){
				history.pushState(null, null, "#of-"+ligneId);
			}else {
				if($("#of-selec").hasClass("masque")){
					history.pushState(null, null, "#t-"+ligneId);
				}else {
					var ofId = $("li.ligne-liste.selec .ligne-clic .of-correspondant .nom-ordre-correspondant .num-of-corres").first().html();
					history.pushState(null, null, "#of-"+ofId+"/t-"+ligneId);
				}
			}
		}
		/////////////////////////////////////////////////////////////////////
	
		TweenMax.to($("li.ligne-liste.selec .ligne-clic .bloc-bottom").first(), animationTime, {height: "0",onComplete: function() {
			tl.timeScale(3);
			if(direction=="suiv"){
				var nextLigne = $("li.ligne-liste.selec").next();
				tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
				animTween(nextLigne,true).delay(animationTime*1000);
			}else if (direction=="prec") {
				var nextLigne = $("li.ligne-liste.selec").prev();
				tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
				animTween(nextLigne,true).delay(animationTime*1000);
			}else{
				tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
			}
		}});
	}
}

function afficFlechesDetail() {
	$("li.ligne-liste").each(function(index) {
		if(($(this).next("li.ligne-liste").length>0)&&!($(this).next("li.ligne-liste").hasClass("retour-haut"))&&!(($(this).next("li.ligne-liste").css("display"))=="none")){
			$("a.btn-ligne.down",this).removeClass("btn-ligne-masque");
		}else {
			$("a.btn-ligne.down",this).removeClass("btn-ligne-masque").addClass("btn-ligne-masque");
		}
		if(($(this).prev("li.ligne-liste").length>0)&&!(($(this).prev("li.ligne-liste").css("display"))=="none")){
			$("a.btn-ligne.up",this).removeClass("btn-ligne-masque");
		}else {
			$("a.btn-ligne.up",this).removeClass("btn-ligne-masque").addClass("btn-ligne-masque");
		}
	});
}

function animTween(ligne,animationOn) {
	var animationTime = 0.1;
	if (!animationOn) {
		animationTime = 0;
	}
	fermerLigne("",animationOn);
	$("a.btn-sidebar.active").removeClass("ligne-selec");
	$('li.ligne-liste').removeClass("selec");
	$("li.ligne-liste .bloc-bottom").height("auto");
	ligne.addClass("selec");
	categActive = $("a.btn-sidebar.active").attr("id");
	offsetYLigne=ligne.position().top;
	$("a.btn-sidebar.active").addClass("ligne-selec");
	var heightBlocBottom = $('.bloc-bottom', ligne).first().height();
	$('.bloc-bottom', ligne).first().css("height","0");
	if(categActive == "btn-of"){
		offsetYBtn=-15;
		scrollLine=-(offsetYLigne-offsetYBtn-30);
		TweenLite.to($("ul#liste-of"), animationTime*8, {y:scrollLine});
	}else{
		offsetYBtn=102;
		scrollLine=-(offsetYLigne-offsetYBtn-120);
		TweenLite.to($("ul#liste-t"), animationTime*8, {y:scrollLine});
	}
	
	$("html, body").animate({ scrollTop: 0 }, animationTime*3000);
	tl = new TimelineLite();
	if(categActive == "btn-of"){
		tl.to($(".id", ligne).first(), animationTime, {background:"#93e0df"});
	}else{
		tl.to($(".id", ligne).first(), animationTime, {background:"#d07fef"});
	}
	if($(window).width()<=770){
		tl.to($(".id", ligne).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "29%"});
	}else{
		tl.to($(".id", ligne).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "25%"});
	}
	tl.to($(".id .case-content", ligne).first(), animationTime, {paddingRight: "45px"});
	tl.to($(".id .fleche-detail", ligne).first(), animationTime, {marginRight:"-30px", opacity: "1"});
	tl.to($(".avancement-open", ligne).first(), animationTime, {marginLeft: "0", opacity: "1"});
	tl.to($("a.btn-ligne", ligne), animationTime, {marginRight:"0", opacity: "1"});
	tl.to($(".id a.btn-fermer", ligne).first(), animationTime, {display: "block", marginRight:"-5px", opacity: "1"});
	TweenMax.to($(".bloc-bottom", ligne).first(), animationTime*3, {height: heightBlocBottom, delay:animationTime*7});
}

function animTweenAze(ligne,animationOn) {
	var animationTime = 0.1;
	if (!animationOn) {
		animationTime = 0;
	}
	TweenMax.to($("li.ligne-liste.selec .ligne-clic .bloc-bottom").first(), animationTime*2, {height: "0",onComplete: function() {
		tl.timeScale(3);
		tl.reverse(0,{onReverseComplete:$("li.ligne-liste.selec").removeClass("selec")});
		$("a.btn-sidebar.active").removeClass("ligne-selec");
		$('li.ligne-liste').removeClass("selec");
		$("li.ligne-liste .ligne-clic .bloc-bottom").height("auto");
		ligne.addClass("selec");
		categActive = $("a.btn-sidebar.active").attr("id");
		offsetYLigne=ligne.position().top;
		$("a.btn-sidebar.active").addClass("ligne-selec");
		var heightBlocBottom = $('.bloc-bottom', ligne).first().height();
		$('.bloc-bottom', ligne).first().css("height","0");
		if(categActive == "btn-of"){
			offsetYBtn=-15;
			scrollLine=-(offsetYLigne-offsetYBtn-30);
			TweenLite.to($("ul#liste-of"), animationTime*8, {y:scrollLine});
		}else{
			offsetYBtn=102;
			scrollLine=-(offsetYLigne-offsetYBtn-120);
			TweenLite.to($("ul#liste-t"), animationTime*8, {y:scrollLine});
		}
		
		$("html, body").animate({ scrollTop: 0 }, animationTime*3000);
		
		
		tl = new TimelineLite();
		if(categActive == "btn-of"){
			tl.to($(".id", ligne).first(), animationTime, {background:"#93e0df"});
		}else{
			tl.to($(".id", ligne).first(), animationTime, {background:"#d07fef"});
		}
		if($(window).width()<=770){
			tl.to($(".id", ligne).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "29%"});
		}else{
			tl.to($(".id", ligne).first(), animationTime, {textAlign: "center", color: "#2a2a2a", width: "25%"});
		}
		tl.to($(".id .case-content", ligne).first(), animationTime, {paddingRight: "45px"});
		tl.to($(".id .fleche-detail", ligne).first(), animationTime, {marginRight:"-30px", opacity: "1"});
		tl.to($(".avancement-open", ligne).first(), animationTime, {marginLeft: "0", opacity: "1"});
		tl.to($("a.btn-ligne", ligne), animationTime, {marginRight:"0", opacity: "1"});
		tl.to($(".id a.btn-fermer", ligne).first(), animationTime, {display: "block", marginRight:"-5px", opacity: "1"});
		TweenMax.to($(".bloc-bottom", ligne).first(), animationTime*3, {height: heightBlocBottom, delay:animationTime*7});
	}});

}


function afficMasque(categorie, idOfRegroup, animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	if(categorie == "btn-of"){
		$("ul#liste-t").removeClass("active");
		$("ul#liste-of").addClass("active");
		$("ul#liste-of").css("display", "block");
		TweenLite.to($("ul#liste-t"), animationTime, {y:decalY, opacity: "0", scale: 1.5, onComplete: function() {
			$("ul#liste-t").css("display", "none");
		}});
		TweenMax.fromTo($("ul#liste-of"), animationTime, {scale:0.5}, {y:0, opacity: "1", scale: 1, delay:animationTime});
	}else{
		$("ul#liste-of").removeClass("active");
		$("ul#liste-t").addClass("active");
		if(idOfRegroup){
			$("ul#liste-t li.ligne-liste").css("display", "none");
			$("ul#liste-t li.ligne-liste.retour-haut").css("display", "block");
			$("ul#liste-t li.ligne-liste .ligne-clic .of-correspondant .nom-ordre-correspondant .num-of-corres:contains('" + idOfRegroup + "')").parent().parent().parent().parent().css("display","block");
			afficFlechesDetail();
		}else{
			$("ul#liste-t li.ligne-liste").css("display", "block");
		}
		$("ul#liste-t").css("display", "block");
		TweenLite.to($("ul#liste-of"), animationTime, {y:decalY, opacity: "0", scale: 1.5, onComplete: function() {
			$("ul#liste-of").css("display", "none");
		}});
		TweenMax.fromTo($("ul#liste-t"), animationTime,  {scale:0.5}, {y:0, opacity: "1", scale: 1,delay:animationTime});
	}
}

function afficOfCorres(idOfRegroup,animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	// afficher le num de l'of concerné dans le btn
	$("#sidebar a.btn-sidebar#btn-t #of-selec .num-of-selec").html(idOfRegroup);
	//afficher et animer l'of
	$("#sidebar a.btn-sidebar#btn-t #of-selec").removeClass("masque");
	TweenLite.to($("#sidebar a.btn-sidebar#btn-t"), animationTime, {paddingTop:"33px", paddingBottom:"38px"});
	TweenLite.from($("#sidebar a.btn-sidebar#btn-t #of-selec"), animationTime*3, {opacity: "0", y:"-250"});
}

function removeOfCorres(animationOn) {
	var animationTime = tweenDuration;
	if (!animationOn) {
		animationTime = 0;
	}
	//enlever le btn avec l'of correspondant dans la sidebar
	TweenLite.to($("#sidebar a.btn-sidebar#btn-t"), animationTime, {paddingTop:"48px", paddingBottom:"23px"});
	$("#sidebar a.btn-sidebar#btn-t #of-selec").removeClass("masque").addClass("masque");
	fermerLigne("",true);
}

// lancer le plein ecran pour le bon navigateur
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

// quitter le plein ecran pour le bon navigateur
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozExitFullScreen) {
    document.mozExitFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function spriteAnimation(){
	// picto ready blanc/gris
//	$("li.ligne-liste.ready").each(function(index) {
//	  if ($(".ligne-clic .case",this).css("background-color")=="rgb(255, 255, 255)") {
//	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/ready");
//	  }else{
//	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/readyt");
//	  }
//	});
//	
//	// animation des sprites
//	$("#bloc-content #content ul.liste-elements li.ligne-liste.fini .case.statut .picto-statut").spriteanim().on('frame-46-shown', function() {
//		$(this).spriteanim('stop');
//	});
//	$("#bloc-content #content ul.liste-elements li.ligne-liste.selec .case.statut .picto-statut").spriteanim();

	// animation des sprites
	$("#bloc-content #content ul.liste-elements li.ligne-liste.fini .case.statut .picto-statut").spriteanim().on('frame-46-shown', function() {
		$(this).spriteanim('stop');
	});
	
	$("#bloc-content #content ul.liste-elements li.ligne-liste.pause .case.statut .picto-statut").spriteanim();
	$("#bloc-content #content ul.liste-elements li.ligne-liste.en-cours .case.statut .picto-statut").spriteanim();

	// picto ready blanc/gris
	$("li.ligne-liste.ready").each(function(index) {
	  if ($(".ligne-clic .case",this).css("background-color")=="rgb(255, 255, 255)") {
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/ready");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }else{
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/readyt");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }
	});
	
	// picto ready blanc/gris liste-inte
	$("li.ligne-liste-inte.ready").each(function(index) {
	  if ($(".ligne-clic .case",this).css("background-color")=="rgb(255, 255, 255)") {
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/ready");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }else{
	  	$(".ligne-clic .statut .case-content .picto-statut",this).first().attr("data-baseurl","../../images/followup/sprite/ready/readyt");
	  	$("#bloc-content #content ul.liste-elements li.ligne-liste.ready .case.statut .picto-statut").spriteanim();
	  }
	});


}

// fonctions ajax
function sendPause(taskId){
	//alert("test")
	/*$.ajax({
		type: "POST",
		async:false,
		url: "<@ofbizUrl>PauseProductionTask</@ofbizUrl>",
		data: {workEffortId: taskId},
		dataType: 'json',
		success: function (data) {
			if (data._ERROR_MESSAGE_ ) {
			  //Error occured
			  showErrorAlert('Erreur',data._ERROR_MESSAGE_);
			  return;
			}
		}
	});*/
}