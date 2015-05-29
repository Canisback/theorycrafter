/*
	Canis Theorycrafter - Masteries
	
	v1.0 - 28/05/2015
		Fonctions
		- Construit l'application de maîtrises
		- Ajout et retrait des points
		- Vidage de la page
		- Sauvegarde en cookie d'une page
		- Chargement de la page en cookie
		- Gestion des stats primaires
	
	
	Nécessite une balise #bg-mast et #mast_button
*/
if(typeof Canis.LoL.TheoryCrafter.Masteries == 'undefined') Canis.LoL.TheoryCrafter.Masteries = new function() {

	//Initialiser la bibliothèque
	var ALL_MAST;
	
	
	//Initialiser la page
	var page;
	
	
	//Initialiser les stats
	var MASTERIES_STATS;
	
	
	//Page vierge
	var EMPTY_MASTERIES_PAGE={"name":"Page masteries","total":0,"Offense":0,"Defense":0,"Utility":0,"masteries":{}};
	
	
	
	
	function construct() {
		a.documentReady(initialize);
	}

	function initialize() {
		console.log("TC Masteries initialize");
		MASTERIES_STATS=Canis.LoL.TheoryCrafter.getMasteriesStats();
		setTimeout(getCss, 1);
		setTimeout(getData, 1);
		setTimeout(bindEvents, 1);
		setTimeout(loadMastPage, 1000);
	}
	
	
	//Installe l'application de maîtrises sur la page et charge les données des maîtrises
	function getData(){
		//Installe les labels et boutons de l'application
		/*$("body").append('<div id="bg-mast"></div>');// Ligne à enlever*/
		$("#bg-mast").append('<div id="mast_offense">ATTAQUE : <span id="mast_offense_count">0</span></div>');
		$("#bg-mast").append('<div id="mast_defense">DEFENSE : <span id="mast_defense_count">0</span></div>');
		$("#bg-mast").append('<div id="mast_utility">UTILITAIRE : <span id="mast_utility_count">0</span></div>');
		$("#mast_buttons").append('<button class="clear_mast_page btn btn-default">Effacer</button>');
		$("#mast_buttons").append('<button class="save_mast_page btn btn-default">Sauvegarder</button>');
		$.ajax({
			url: Canis.LoL.TheoryCrafter.getQuery()+"index.php/tc/getMasteries",
			success:function(data){
				data=JSON.parse(data);
				var temp={};
				var z=200;
				
				//Construit et installe chaque maîtrise dans le cadre
				for(var i in data){
					z--;
					temp[data[i]['id']]=data[i];
					var str="";
					str='<span style="padding-top:'+(20+70*(data[i]['row']))+'px;padding-left:';
					if(data[i]['masteryTree']=="Offense")str+=(0*272+20+65*(data[i]['column']));
					if(data[i]['masteryTree']=="Defense")str+=(1*272+20+65*(data[i]['column']));
					if(data[i]['masteryTree']=="Utility")str+=(2*272+20+65*(data[i]['column']));
					str+='px;position:absolute;z-index:'+z+'">';
					if(data[i]['prereq']!=0)str+='<span class="gray_link mast_link"></span>';
					str+='<a class="tooltip-stop" href="http://canisback.com/tooltips/mastery/'+data[i]['id']+'/0"><span class="mastery ';
					if(data[i]['row']!=0)str+="gray_";
					str+='mastery'+data[i]['id']+'" data-id="'+data[i]['id']+'" data-actual="0" data-ranks="'+data[i]['ranks']+'" data-tree="'+data[i]['masteryTree']+'" data-row="'+data[i]['row']+'" data-column="'+data[i]['column']+'" data-prereq="'+data[i]['prereq']+'" ><span class="';
					if(data[i]['row']!=0){str+="gray_"}else{str+="green_"}
					str+='cadre"><span class="';
					if(data[i]['row']!=0){str+="gray_"}else{str+="green_"}
					str+='points mast_points">0/'+data[i]['ranks']+'</span></span></span>';
					str+='</a></span>';
					$("#bg-mast").append(str);
				}
				
				//Chargement des données de maîtrises
				ALL_MAST=JSON.stringify(temp);
			}
		});
		
		
	}
	
	//Importe le css des maîtrises
	function getCss() {
		
		var cssUrl = Canis.LoL.TheoryCrafter.getUrlCss();

		a.getStyle(cssUrl + 'masteries.css');
		
	}
	
	
	//Lie les events aux fonctions de l'application
	function bindEvents(){
		
		$(document).on("contextmenu",".mastery",function(e){
		
			return false;
			
		});
		
		
		$(document).on("mousedown",".mastery",function(e){
			
			e.preventDefault();
			
			if(e.which==1){
			
				addMasteryPoint($(e.target));
			
			}else if(e.which==3){
			
				removeMasteryPoint($(e.target));
			
			}
		});
		
		
		$(document).on("mousedown",".clear_mast_page",function(e){
			
			clearMasteryPage();
			
		});
		
		
		$(document).on("click",".save_mast_page",function(e){
			
			savePage();
			
		});
	}
	
	
	//Ajoute un point de maîtrise
	function addMasteryPoint(target){
		
		var rank=parseInt(target.parent().data("actual"));
		
		if(target.hasClass("green_cadre") && !target.hasClass("gold_cadre") && page['total']<30){	// La maîtrise doit être disponible, ne pas être au maximum, et la page ne doit pas être remplie
			target.parent().data("actual",rank+1);
			target.parent().parent().attr("href","http://canisback.com/tooltips/mastery/"+target.parent().data("id")+"/"+(rank+1));	//Modification du Tooltip
			$(".mastery[data-id="+target.parent().data("prereq")+"]").addClass("mast_locked");	//Verrouillage de la maîtrise en cas de prérequis
			
			target.children().html(rank+1+"/"+target.parent().data("ranks"));	//Modification du visuel des points
			if(rank+1==target.parent().data("ranks")){		//Vérification de maximum atteint
				target.children().addClass("gold_points").removeClass("green_points");
				target.addClass("gold_cadre").removeClass("green_cadre");
				target.parent().parent().parent().children(".mast_link").addClass("gold_link").removeClass("green_link");
			}
			
			//Ajout des points sur l'objet page
			page[target.parent().data("tree")]++;
			page['total']++;
			
			//Ajout des stats des maîtrises
			if(JSON.parse(ALL_MAST)[target.parent().data("id")]['effects']!=""){
				var effects=JSON.parse(JSON.parse(ALL_MAST)[target.parent().data("id")]['effects']);
				for(var i in effects[rank+1]){
					if(effects[rank]!=null){
					
						MASTERIES_STATS[i]+=effects[rank+1][i]-effects[rank][i];
					
					}else{
					
						MASTERIES_STATS[i]+=effects[rank+1][i];
						
					}
				}
				Canis.LoL.TheoryCrafter.updateMasteriesStats(MASTERIES_STATS);
			}
			
			//Ajout des maîtrises sur l'objet page
			if(typeof page['masteries'][target.parent().data("id")]=="undefined"){
				page['masteries'][target.parent().data("id")]=1;
			}else{
				page['masteries'][target.parent().data("id")]++;
			}
			
			//Mise à jour de l'arbre
			updateMastTree(target.parent().data("tree"));
		}
		
	}
	
	//Enlève un point de maîtrise
	function removeMasteryPoint(target){
		
		var rank=parseInt(target.parent().data("actual"));
		var maxRow=0;	//Plus haute ligne atteinte
		var pointRow=0;	//Nombre de points dans la ligne
		for(var i=0;i<6;i++){
			$(".mastery[data-row="+i+"][data-tree="+target.parent().data("tree")+"]").each(function(){
				if($(this).data("actual")>0)maxRow=$(this).data("row");
				if($(this).data("row")==target.parent().data("row"))pointRow+=$(this).data("actual");
			});
		}
		var treePoints=0; 	//Nombre de points dans les lignes inférieures
		for(var i=0;i<maxRow;i++){
			$(".mastery[data-row="+i+"][data-tree="+target.parent().data("tree")+"]").each(function(){
				if($(this).data("actual")>0)treePoints+=$(this).data("actual");
			});
		}
		
		if((target.hasClass("green_cadre") || target.hasClass("gold_cadre")) 							//S'il y a des points à enlever
				&& target.parent().data("actual")>0 && !target.parent().hasClass("mast_locked") 		//Si la maîtrise n'est pas verouillée
				&& ((treePoints/4>maxRow && pointRow>4) || maxRow==target.parent().data("row"))){		//S'il y a assez de points dans les lignes inférieurs ou si c'est la dernière ligne
			
			target.parent().data("actual",rank-1);
			target.parent().parent().attr("href","http://canisback.com/tooltips/mastery/"+target.parent().data("id")+"/"+(rank-1));	//Modification du Tooltip
			
			target.children().html(rank-1+"/"+target.parent().data("ranks"));	//Modification du visuel des points
			
			if(rank==target.parent().data("ranks")){	//Vérification si le maximum était atteint
				target.children().removeClass("gold_points").addClass("green_points");
				target.removeClass("gold_cadre").addClass("green_cadre");
				target.parent().parent().parent().children(".mast_link").removeClass("gold_link").addClass("green_link");
			}if(rank-1==0){		//Vérification de zéro atteint
				$(".mastery[data-id="+target.parent().data("prereq")+"]").removeClass("mast_locked");
			}
			
			//Retrait des points sur l'objet page
			page[target.parent().data("tree")]--;
			page['total']--;
			
			//Retrait des stats des maîtrises
			if(JSON.parse(ALL_MAST)[target.parent().data("id")]['effects']!=""){
				var effects=JSON.parse(JSON.parse(ALL_MAST)[target.parent().data("id")]['effects']);
				for(var i in effects[rank-1]){
					
					if(effects[rank]!=null){
					
						MASTERIES_STATS[i]+=effects[rank-1][i]-effects[rank][i];
					
					}else{
					
						MASTERIES_STATS[i]+=effects[rank-1][i];
						
					}
				}
				Canis.LoL.TheoryCrafter.updateMasteriesStats(MASTERIES_STATS);
			}
			
			//Retrait des maîtrises sur l'objet page
			page['masteries'][target.parent().data("id")]--;
			
			//Mise à jour de l'arbre
			updateMastTree(target.parent().data("tree"));
		}
		
	}
	
	function updateMastTree(tree){
		for(var i=0;i<=5;i++){		//Travaille séparément sur chaque ligne
			$(".mastery[data-row="+i+"][data-tree="+tree+"]").each(function(){	//Pour chaque maîtrise de la ligne
				if($(this).data("row")<=parseInt(page[tree]/4)){		//S'il y a assez de points dans l'arbre pour déverrouiller la ligne
				
					if($(this).data("prereq")==0){	//Sans prérequis
					
						$(this).addClass("mastery"+$(this).data("id")).removeClass("gray_mastery"+$(this).data("id"));
						$(this).children().addClass("green_cadre").removeClass("gray_cadre");
						$(this).children().children().addClass("green_points").removeClass("gray_points");
						
					}else if($(".mastery[data-id="+$(this).data("prereq")+"]").data("ranks")==$(".mastery[data-id="+$(this).data("prereq")+"]").data("actual")){	//Si le prérequis est atteint
					
						$(this).addClass("mastery"+$(this).data("id")).removeClass("gray_mastery"+$(this).data("id"));
						$(this).children().addClass("green_cadre").removeClass("gray_cadre");
						$(this).children().children().addClass("green_points").removeClass("gray_points");
						$(this).parent().parent().children(".mast_link").addClass("green_link").removeClass("gray_link");
						
					}else{		//Si le prérequis n'est pas atteint
					
						$(this).removeClass("mastery"+$(this).data("id")).addClass("gray_mastery"+$(this).data("id"));
						$(this).children().removeClass("green_cadre").addClass("gray_cadre");
						$(this).children().children().removeClass("green_points").addClass("gray_points");
						$(this).parent().parent().children(".mast_link").removeClass("green_link").addClass("gray_link");
						
					}
					
				}else{	//S'il y a assez de points dans l'arbre verrouillage de la ligne
				
					$(this).removeClass("mastery"+$(this).data("id")).addClass("gray_mastery"+$(this).data("id"));
					$(this).children().removeClass("green_cadre").addClass("gray_cadre");
					$(this).children().children().removeClass("green_points").addClass("gray_points");
					$(this).parent().parent().children(".mast_link").removeClass("green_link").addClass("gray_link");
					
				}
			});
		}
		
		//Mise à jour des labels
		$("#mast_offense_count").html(page['Offense']);
		$("#mast_defense_count").html(page['Defense']);
		$("#mast_utility_count").html(page['Utility']);
	}
	
	
	//Enlève les points un par un en partant du plus haut
	function clearMasteryPage(){
		var masteries=[];
		var target;
		
		for(var i in page['masteries']){
			masteries.push([i,page['masteries'][i]]);
		}
		
		masteries.reverse();
		
		for(var j in masteries){
		
			target=$(".mastery[data-id="+masteries[j][0]+"]").children();
			
			for(var h = 0; h<masteries[j][1];h++){
				removeMasteryPoint(target);
			}
			
		}
	}
	
	
	//Sauvegarde la page en cookie
	function savePage(){
	
		a.eraseCookie("saved_masteries_page");
		a.createCookie("saved_masteries_page", JSON.stringify(page), 1000);
		
	}
	
	
	//Charge la page en mémoire
	function loadMastPage(){
		
		page=EMPTY_MASTERIES_PAGE;
		
		if(JSON.parse(a.readCookie("saved_masteries_page"))!=null){
			
			savedPage=JSON.parse(a.readCookie("saved_masteries_page"));
			
			
			constructSavedPage(savedPage);
			
		}
		
	}
	
	function constructSavedPage(savedPage){
	
		for(var j in savedPage['masteries']){
		
			target=$(".mastery[data-id="+j+"]").children();
			
			for(var h = 0; h<savedPage['masteries'][j];h++){
				addMasteryPoint(target);
			}
			
		}
		
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