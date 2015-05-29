/*
	Canis Theorycrafter - Runes
	
	v1.0 - 28/05/2015
		Fonctions
		- Construit l'application de runes
		- Ajout et retrait des runes
		- Vidage de la page
		- Sauvegarde en cookie d'une page
		- Chargement de la page en cookie
		- Gestion des stats
	
	Nécessite une balise #bg-runes, une #runes_list, #runes_buttons et une #runes_effects
*/
if(typeof Canis.LoL.TheoryCrafter.Runes == 'undefined') Canis.LoL.TheoryCrafter.Runes = new function() {

	//Initialiser la bibliothèque
	var ALL_RUNES;
	
	
	//Initialiser la page
	var page;
	
	
	//Initialiser les stats
	var RUNES_STATS;
	
	
	//Page vierge
	var EMPTY_RUNES_PAGE={"name":"Page runes","red":0,"yellow":0,"blue":0,"black":0,"runes":[]};
	
	
	
	function construct() {
		a.documentReady(initialize);
	}

	function initialize() {
		console.log("TC Runes initialize");
		RUNES_STATS=Canis.LoL.TheoryCrafter.getRunesStats();
		setTimeout(getData, 1);
		setTimeout(bindEvents, 1);
		setTimeout(loadRunePage, 1000);
	}
	
	//Installe l'application de runes sur la page et charge les données des runes
	function getData(){
		//Installe les labels et boutons de l'application
		/*$("body").append('<div id="bg-runes"></div>');// Ligne à enlever
		$("body").append('<div id="runes_list"></div>');// Ligne à enlever
		$("body").append('<div id="runes_effects">Effets : </div>');// Ligne à enlever*/
		$("#runes_effects").html('Effets : ');
		$("#runes_buttons").append('<button class="clear_runes_page btn btn-default">Effacer</button>');
		$("#runes_buttons").append('<button class="save_runes_page btn btn-default">Sauvegarder</button>');
	
		$.ajax({
			url: Canis.LoL.TheoryCrafter.getQuery()+"index.php/tc/getRunes",
			success:function(data){
				//Construit la liste des runes
				data=JSON.parse(data);
				var temp={};
				data.sort(sortRunes);
				for(var i in data){
					temp[data[i]['id']]=data[i];
					if(data[i]['tier']=="3")
					$("#runes_list").append('<div style="min-height:55px;min-width:55px; border-bottom:1px solid black;"><span class="rune" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span><span style=\'display:inline-block;font-size:10px;max-width:180px;\'><strong>'+data[i]['name']+'</strong><br />'+data[i]['description']+'</span></div>');
				}
				ALL_RUNES=JSON.stringify(temp);
			}
		});
	}
	
	
	function sortRunes(a,b){
		
		tab={"red":0,"yellow":1,"blue":2,"black":3};
		
		return (tab[a['type']] > tab[b['type']]) ? 1 : -1;
	}
	
	
	//Lie les events aux fonctions de l'application
	function bindEvents(){
		
		$(document).on("contextmenu",".rune-selected",function(e){
		
			return false;
			
		});
		
		
		$(document).on("click",".rune",function(e){
		
			addRune($(e.target));
			
		});
		
		
		$(document).on("click",".rune-selected",function(e){
			
			e.preventDefault();
			
			removeRune($(e.target));
			
		});
		
		
		$(document).on("mousedown",".clear_runes_page",function(e){
			
			clearRunesPage();
			
		});
		
		
		$(document).on("click",".save_runes_page",function(e){
			
			savePage();
			
		});
	}
	
	//Détermine le type de la rune à ajouter
	function addRune(target){
		switch (true) {
			case /red/.test(target.data("type")):
				addRedRune(target);
				break;
				
			case /blue/.test(target.data("type")):
				addBlueRune(target);
			break;
			
			case /yellow/.test(target.data("type")):
				addYellowRune(target);
				break;
				
			case /black/.test(target.data("type")):
				addBlackRune(target);
				break;
				
			default:
				console.log("T'es pas une rune");
				break;
		}
	}
	
	//Ajoute une marque
	function addRedRune(target){
	
		if(parseInt(page[target.data("type")])<9){
			//Incrémente le nombre de runes du type
			page[target.data("type")]++;
			
			var i=target.data("id");
			
			var data=JSON.parse(ALL_RUNES);
			
			//Ajoute la runes dans la première case disponible
			for(a=1;a<=9;a++){
				if( typeof page['runes'][a] == "undefined" || page['runes'][a]==null){page['runes'][a]=target.data("id");break;}
			}
			
			//Fait apparaître la runes sur la page
			$("#bg-runes").append('<span style="padding-top: 4px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-id="'+data[i]['id']+'" data-place="'+a+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
			
			//Ajoute les stats de la rune ajoutée au total
			for(var a in JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])){
				RUNES_STATS[a]+=JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])[a];
			}
			
			updateRunes();
		}
	}
	
	//Ajoute un sceau
	function addYellowRune(target){
		
		if(parseInt(page[target.data("type")])<9){
			//Incrémente le nombre de runes du type
			page[target.data("type")]++;
	
			var i=target.data("id");
			
			var data=JSON.parse(ALL_RUNES);
			
			//Ajoute la runes dans la première case disponible
			for(a=10;a<=18;a++){
				if( typeof page['runes'][a] == "undefined" || page['runes'][a]==null){page['runes'][a]=target.data("id");break;}
			}
			
			//Fait apparaître la runes sur la page
			$("#bg-runes").append('<span style="padding-top: 4px;padding-left: 1px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
			
			//Ajoute les stats de la rune ajoutée au total
			for(var a in JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])){
				RUNES_STATS[a]+=JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])[a];
			}
			
			updateRunes();
		}
	}
	
	//Ajoute un glyphe
	function addBlueRune(target){
		
		if(parseInt(page[target.data("type")])<9){
			//Incrémente le nombre de runes du type
			page[target.data("type")]++;
			
			var i=target.data("id");
			
			var data=JSON.parse(ALL_RUNES);
			
			//Ajoute la runes dans la première case disponible
			for(a=19;a<=27;a++){
				if( typeof page['runes'][a] == "undefined" || page['runes'][a]==null){page['runes'][a]=target.data("id");break;}
			}
			
			//Fait apparaître la runes sur la page
			$("#bg-runes").append('<span style="padding-top: 3px;padding-left: 2px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
			
			//Ajoute les stats de la rune ajoutée au total
			for(var a in JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])){
				RUNES_STATS[a]+=JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])[a];
			}
			
			updateRunes();
		}
	}
	
	//Ajoute une quintessence
	function addBlackRune(target){
		
		if(page[target.data("type")]<3){
			//Incrémente le nombre de runes du type
			page[target.data("type")]++;
			
			var i=target.data("id");
			
			var data=JSON.parse(ALL_RUNES);
			
			//Ajoute la runes dans la première case disponible
			for(a=30;a<=32;a++){
				if( typeof page['runes'][a] == "undefined" || page['runes'][a]==null){page['runes'][a]=target.data("id");break;}
			}
			
			//Fait apparaître la runes sur la page
			$("#bg-runes").append('<span style="padding-top: 3px;padding-left: 2px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/rune/'+data[i]['full']+'") no-repeat scroll center center transparent;height: 120px;width: 120px;display:inline-block;\'></span></a></span>');
			
			//Ajoute les stats de la rune ajoutée au total
			for(var a in JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])){
				RUNES_STATS[a]+=JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])[a];
			}
			
			updateRunes();
		}
		
	}
	
	//Retire la rune
	function removeRune(target){
		//Fait disparaitre le Tooltip
		$(".canis-tooltip-wrapper").hide();
		
		//Retire la rune de la page
		$(".rune_"+target.data("place")).remove();
		
		//Décrémente le nombre de runes du type
		page[target.data("type")]--;
		
		//Retire la rune de l'objet page
		delete page['runes'][target.data("place")];
		
		//Retire les stats de la rune du total
		for(var a in JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])){
			RUNES_STATS[a]-=JSON.parse(JSON.parse(ALL_RUNES)[target.data("id")]['stats'])[a];
		}
		
		updateRunes();
	}
	
	//Mise à jour des stats des runes
	function updateRunes(){
		
		$("#runes_effects").html("Effets : <br />");
		
		//Affiches les stats de la page
		for(var i in RUNES_STATS){
			if(parseFloat(RUNES_STATS[i])>=0.001 || parseFloat(RUNES_STATS[i])<=-0.001){
				$("#runes_effects").append(Canis.LoL.TheoryCrafter.getRunesTranslate()[i]+" : "+RUNES_STATS[i].toFixed(3)+"<br />");
			}
		}
		
		Canis.LoL.TheoryCrafter.updateRunesStats(RUNES_STATS);
	}
	
	
	//Efface les runes de la page
	function clearRunesPage(){
		
		//Retire toutes les runes de la page
		$(".onPage_rune").remove();
		
		//Mise à zéro des compteurs
		page['red']=0;
		page['yellow']=0;
		page['blue']=0;
		page['black']=0;
		
		//Retire les stats
		for(var i in page['runes']){
			if(typeof JSON.parse(ALL_RUNES)[page['runes'][i]] != "undefined")
			for(var a in JSON.parse(JSON.parse(ALL_RUNES)[page['runes'][i]]['stats'])){
				RUNES_STATS[a]-=JSON.parse(JSON.parse(ALL_RUNES)[page['runes'][i]]['stats'])[a];
			}
		}
		
		//Vide l'objet page
		page['runes']=[];
		updateRunes();
	}
	
	
	//Sauvegarde la page en cookie
	function savePage(){
		
		a.eraseCookie("saved_runes_page");
		a.createCookie("saved_runes_page", JSON.stringify(page), 1000);
		
	}
	
	
	//Charge la page en mémoire
	function loadRunePage(){
		
		page=EMPTY_RUNES_PAGE;
		
		if(JSON.parse(a.readCookie("saved_runes_page"))!=null){
			
			page=JSON.parse(a.readCookie("saved_runes_page"));
			
			constructSavedPage();
			
		}
		
	}
	
	
	function constructSavedPage(){
		var data=JSON.parse(ALL_RUNES);
		var i;
		for(var a in page["runes"]){
			i=page["runes"][a];
			if(i!=null){
				if(data[i]['type']=="red")
				$("#bg-runes").append('<span style="padding-top: 4px;padding-left: 1px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
				
				if(data[i]['type']=="yellow")
				$("#bg-runes").append('<span style="padding-top: 4px;padding-left: 1px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
			
				if(data[i]['type']=="blue")
				$("#bg-runes").append('<span style="padding-top: 3px;padding-left: 2px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
			
				if(data[i]['type']=="black")
				$("#bg-runes").append('<span style="padding-top: 3px;padding-left: 2px;" class="onPage_rune rune_'+a+'"><a class="tooltip-stop" href="http://canisback.com/tooltips/rune/'+data[i]['id']+'"><span class="rune-selected" data-place="'+a+'" data-id="'+data[i]['id']+'" data-tier="'+data[i]['tier']+'" data-type="'+data[i]['type']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/rune/'+data[i]['full']+'") no-repeat scroll center center transparent;height: 120px;width: 120px;display:inline-block;\'></span></a></span>');
				
				for(var b in JSON.parse(JSON.parse(ALL_RUNES)[i]['stats'])){
					RUNES_STATS[b]+=JSON.parse(JSON.parse(ALL_RUNES)[i]['stats'])[b];
				}
			}
		}
		updateRunes();
	}
	
	
	
	
	
	//Helper
	var a = {

		create: function(nodeName) {
			return document.createElement(nodeName);
		},

		getScript: function(url) {

			var script = a.create('script');
			script.type = 'text/javascript';
			script.src = url;

			document.body.appendChild(script);
		},

		getStyle: function(url) {

			var link = a.create('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;

			document.body.appendChild(link);
		},

		documentReady: function(callback) {

			if(document.readyState == 'complete') {
				callback();
				return;
			}

			var occurred = false;

			a.bindEvent(document, 'DOMContentLoaded', function() {

				if(!occurred) {
					occurred = true;
					callback();
				}
			});

			a.bindEvent(document, 'readystatechange', function() {

				if(document.readyState == 'complete' && !occurred) {
					occurred = true;
					callback();
				}
			});

		},

		bindEvent: function(node, eventType, callback) {
			if(node.addEventListener) {
				node.addEventListener(eventType, callback, true); // Must be true to work in Opera
			} else {
				node.attachEvent('on' + eventType, callback);
			}
		},

		normalizeEvent: function(e) {
			var ev = {};
			ev.target = (e.target ? e.target : e.srcElement);
			ev.which = (e.which ? e.which : e.button);
			return ev;
		},
		
		createCookie : function (name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},

		readCookie : function (name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},

		eraseCookie : function (name) {
			a.createCookie(name,"",-1);
		}
	};




	construct();
}