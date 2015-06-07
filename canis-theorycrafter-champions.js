/*
	Canis Theorycrafter - Champions
	
	v1.0 - 29/05/2015
		Fonctions
		- Construit l'application des champions
		- Sélection d'un champion
		- Affichage des sorts
		- Réglage du niveau du champion et de chaque sort
		- Mise à jour de certains ratios, du cooldown et du coût de chaque sort en fonction des stats totales et du niveau du sort
		
	31/05/2015
		Corrections
		- Bug sur le ratio attackdamage
	
	01/06/2015
		- Ajout de la mise à jour des sorts lors du changement d'équipement
		
	02/06/2015
		- Ajout des passifs
		En cours : 
		- modifications des passifs pour correspondre aux ratios
	
	03/06/2015
		- Séparation des passifs et des sorts
		- Ajout de ratios (cooldown et ashe)
		
	04/06/2015
		- Ajout du ratio level
		
	05/06/2015
		- Ajout du coefficient par level
		
	07/06/2015
		- Ajout du ratios spelblock, vladhp et vladspelldamage
	
	
	Nécessite divisions #champions_list, #champion_selected, #stats_1, #stats_2 et #champion_spells
*/
if(typeof Canis.LoL.TheoryCrafter.Champions == 'undefined') Canis.LoL.TheoryCrafter.Champions = new function() {

	//Initialiser la bibliothèque
	var ALL_CHAMPIONS
	
	
	//Initialiser les stats
	var CHAMPION_STATS;
	
	var CHAMPION_LEVEL;
	
	var CHAMPION_ID;
	
	//Initialiser les sorts
	var CHAMPION_SPELLS={};
	
	
	function construct() {
		a.documentReady(initialize);
	}

	function initialize() {
		console.log("TC Champions initialize");
		CHAMPION_STATS=Canis.LoL.TheoryCrafter.getChampionStats();
		CHAMPION_LEVEL=Canis.LoL.TheoryCrafter.getChampionLevel();
		setTimeout(getData, 1);
		setTimeout(bindEvents, 1);
	}
	
	//Installe l'application des champions sur la page et charge les données des champions
	function getData(){
		/*$("body").append('<div id="champions_list"></div>');// Ligne à enlever
		$("body").append('<div id="champion_selected"></div>');// Ligne à enlever
		$("body").append('<div id="stats_1"></div>');// Ligne à enlever
		$("body").append('<div id="stats_2"></div>');// Ligne à enlever
		$("body").append('<div id="champion_spells"></div>');// Ligne à enlever*/
		$("#champion_selected").append('<div id="canis_loader" style="display:none"><img src="loader.gif" alt="Loading"></div>');
		
		//Installe le tableau des stats
		$("#stats_1").append('PV : <span id="hp"></span><br />Régèn PV : <span id="hpregen"></span><br />Dommages : <span id="attackdamage"></span><br />Pénétration d\'armure : <span id="arpen"></span><br />Vol de vie : <span id="lifesteal"></span><br />Vitesse d\'attaque : <span id="attackspeed"></span><br />Portée : <span id="attackrange"></span><br />Chances coups critique : <span id="ccc"></span><br />Dégâts coups critique : <span id="dcc"></span><br />Vitesse de déplacement : <span id="movespeed"></span><br />');
		$("#stats_2").append('<span class="partype"></span>: <span id="mp"></span><br />Régèn <span class="partype"></span> : <span id="mpregen"></span><br />Puissance : <span id="spelldamage"></span><br />Pénétration magique : <span id="mpen"></span><br />Sort vampirique : <span id="spellvamp"></span><br />Réduction des délais : <span id="cdreduc"></span><br />Armure : <span id="armor"></span><br />Résistance magique : <span id="spellblock"></span><br />Ténacité : <span id="tenacity"></span>');
		
		
		$.ajax({
			url: Canis.LoL.TheoryCrafter.getQuery()+"index.php/tc/getChampions",
			success:function(data){
			
				//Construit la liste des champions
				ALL_CHAMPIONS=data;
				data=JSON.parse(data);
				for(var i in data){
					$("#champions_list").append('<span style="min-height:55px;min-width:55px;display:inline-block;"><span class="champion" data-id="'+data[i]['id']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></span>');
				}
			}
		});
	}
	
	
	//Lie les events aux fonctions de l'application
	function bindEvents(){
		
		$(document).on("click",".champion",function(e){
		
			getChampionData($(e.target));
			
		});
		
		
		$(document).on("change mousemove", ".spell_level_range",function(e){
			
			updateSpell($(e.target));
			
		});
		
		
		$(document).on("change mousemove", "#level_range", function(){
			
			updateLevel();
			
		});
	}
	
	
	//Appel des données du champion sélectionné
	function getChampionData(target){
	
		$.ajax({
			url: Canis.LoL.TheoryCrafter.getQuery()+"index.php/tc/getChampionsData/"+target.data("id"),
			beforeSend: function() {
				$('#canis_loader').show();
			},
			complete: function(){
				$('#canis_loader').hide();
			},
			success:function(data){
				
				if(data!=""){
					
					//Sauvegarde les stats du champion
					CHAMPION_STATS=JSON.parse(data)['stats'];
					
					//Sauvegarde de l'ID
					CHAMPION_ID=target.data("id");
					
					//Sauvegarde les sorts du champion
					CHAMPION_SPELLS={};
					
					CHAMPION_SPELLS[JSON.parse(data)['passive'][0]['key']]=JSON.parse(data)['passive'][0];
					
					for(var i in JSON.parse(data)['spells']){
						CHAMPION_SPELLS[JSON.parse(data)['spells'][i]['key']]=JSON.parse(data)['spells'][i];
					}
					
					//Affiche le champion sélectionné
					$("#champion_selected").html('<span style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+CHAMPION_STATS['sprite']+'") no-repeat scroll -'+CHAMPION_STATS['x']+'px -'+CHAMPION_STATS['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span><span style="display:inline-block;">'+CHAMPION_STATS['name']+',<br />'+CHAMPION_STATS['title']+'</span><br />Niveau : <span id="level"></span><input value="0" type="range" id="level_range" min="0" max="17" style="max-width:250px;">');
					
					updateLevel();
					
					createSpells();
					
					Canis.LoL.TheoryCrafter.updateChampionId(CHAMPION_ID);
					
					Canis.LoL.TheoryCrafter.updateChampionStats(CHAMPION_STATS);
				}
			}
		});
	
	}
	
	
	//Affichage les sorts du champion
	function createSpells(){
		
		$("#champion_spells").empty();
		
		for(var i in CHAMPION_SPELLS){
			if(CHAMPION_SPELLS[i]["key"]!="Passive_"+CHAMPION_ID){
				$("#champion_spells").append('<hr><table id="'+CHAMPION_SPELLS[i]["key"]+'"><tbody><tr><td style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+CHAMPION_SPELLS[i]['sprite']+'") no-repeat scroll -'+CHAMPION_SPELLS[i]['x']+'px -'+CHAMPION_SPELLS[i]['y']+'px transparent;min-height:48px;min-width:48px;max-height:48px;max-width:48px;display:inline-block;\'></td><td style="padding-left:5px;">'+CHAMPION_SPELLS[i]["name"]+'<br />'+stripslashes(CHAMPION_SPELLS[i]["description"])
					+'<br />Coût : '+CHAMPION_SPELLS[i]['resource']+'<br />Récupération : <span class="cooldown"></span> secondes<br /><input value="0" type="range" class="spell_level_range" min="0" max="'+CHAMPION_SPELLS[i]["maxrank"]+'" autocomplete="off" style="max-width:200px;display:inline" data-key="'+CHAMPION_SPELLS[i]["key"]+'" data-type="spell"><span class="spell_level"></span></td></tr></tbody></table>');
				
				updateSpell($(".spell_level_range[data-key="+CHAMPION_SPELLS[i]["key"]+"]"));
			}else{	
				$("#champion_spells").append('<hr><table id="'+CHAMPION_SPELLS[i]["key"]+'"><tbody><tr><td style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+CHAMPION_SPELLS[i]['sprite']+'") no-repeat scroll -'+CHAMPION_SPELLS[i]['x']+'px -'+CHAMPION_SPELLS[i]['y']+'px transparent;min-height:48px;min-width:48px;max-height:48px;max-width:48px;display:inline-block;\'></td><td style="padding-left:5px;">'+CHAMPION_SPELLS[i]["name"]+'<br />'+stripslashes(CHAMPION_SPELLS[i]["description"])
					+'<span class="spell_level_range" data-key="'+CHAMPION_SPELLS[i]["key"]+'" data-type="passive"></span></td></tr></tbody></table>');
					
				updatePassive($(".spell_level_range[data-key="+CHAMPION_SPELLS[i]["key"]+"]"));
			}
		}
		
	}
	
	//Mise à jour du sort modifié
	function updateSpell(target){
		if(target.data("type")=="spell"){
			var effects = JSON.parse(CHAMPION_SPELLS[target.data("key")]['effect']);
			var vars = CHAMPION_SPELLS[target.data("key")]['vars'];
			
			var cost = JSON.parse(CHAMPION_SPELLS[target.data("key")]['cost']);
			var cd = JSON.parse(CHAMPION_SPELLS[target.data("key")]['cooldown']);
			var cdReduc=Canis.LoL.TheoryCrafter.getTotalStats()['bonus_cd'];
		
			//Mise à jour du niveau
			$("#"+target.data("key")+" .spell_level").html(target.val());
			
			//Mise à jour du coût
			$("#"+target.data("key")+" .cost").html(cost[target.val()-1]);
			
			//Mise à jour du cooldown
			if(target.val()==0){
				$("#"+target.data("key")+" .cooldown").html();
			}else{
				$("#"+target.data("key")+" .cooldown").html((parseFloat(cd[target.val()-1])*parseFloat(1-cdReduc)).toFixed(1));
			}
				
			//Mise à jour des effets
			for(var i in effects){
				if(effects[i]!=null){
					
					if(target.val()==0){
						
						$("#"+target.data("key")+" .e"+i).html("");
					
					}else{
					
						$("#"+target.data("key")+" .e"+i).html(effects[i][target.val()-1]);
						
					}
					
				}
			}
			
			//Mise à jour des coefficients
			for(var j in vars){
				if(JSON.parse(vars[j]['coeff']).length==1){
				
					$("#"+target.data("key")+" ."+vars[j]['key']).data("coeff",JSON.parse(vars[j]['coeff'])[0]);
					
					$("#"+target.data("key")+" ."+vars[j]['key']).data("link",vars[j]['link']);
					
				}else 
				if(JSON.parse(vars[j]['coeff']).length==18){
				
					$("#"+target.data("key")+" ."+vars[j]['key']).data("coeff",JSON.parse(vars[j]['coeff'])[CHAMPION_LEVEL]);
					
					$("#"+target.data("key")+" ."+vars[j]['key']).data("link",vars[j]['link']);
				
				}
			}
			
			Canis.LoL.TheoryCrafter.updateChampionStats(CHAMPION_STATS);
			
		}
	}
	
	//Mise à jour du passif
	function updatePassive(target){
		
		Canis.LoL.TheoryCrafter.updateChampionStats(CHAMPION_STATS);
		
		var effects = JSON.parse(CHAMPION_SPELLS[target.data("key")]['effect']);
		var vars = CHAMPION_SPELLS[target.data("key")]['vars'];
		
		var effectsLevel = JSON.parse(CHAMPION_SPELLS[target.data("key")]['effectLevel']);
	
		//Mise à jour des effets de niveau
		for(var i in effectsLevel){
			if(effectsLevel[i]!=null){
				
				$("#"+target.data("key")+" .el"+i).html(effectsLevel[i][CHAMPION_LEVEL]);
				
			}
		}
		//Mise à jour des effets
		for(var i in effects){
			if(effects[i]!=null){
				
				if(target.val()==0){
					
					$("#"+target.data("key")+" .e"+i).html("");
				
				}else{
				
					$("#"+target.data("key")+" .e"+i).html(effects[i][target.val()-1]);
					
				}
				
			}
		}
		
		//Mise à jour des coefficients
		for(var j in vars){
			if(JSON.parse(vars[j]['coeff']).length==1){		//Coefficient unique
			
				$("#"+target.data("key")+" ."+vars[j]['key']).data("coeff",JSON.parse(vars[j]['coeff'])[0]);
				
				$("#"+target.data("key")+" ."+vars[j]['key']).data("link",vars[j]['link']);
				
			}else
			if(JSON.parse(vars[j]['coeff']).length==18){	//Coefficient par niveau
				
				$("#"+target.data("key")+" ."+vars[j]['key']).data("coeff",JSON.parse(vars[j]['coeff'])[CHAMPION_LEVEL]);
				
				$("#"+target.data("key")+" ."+vars[j]['key']).data("link",vars[j]['link']);
			
			}
		}
		
		Canis.LoL.TheoryCrafter.updateChampionStats(CHAMPION_STATS);
	}
	
	
	//Mise à jour des ratios de tous les sorts
	function updateRatios(){
		
		champ_stats=Canis.LoL.TheoryCrafter.getTotalStats();
		
		$('span').each(function(){
			
			//Puissance
			if($(this).data("link")=="spelldamage"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_spelldamage']).toFixed(0));
			}
			
			//Armure
			if($(this).data("link")=="armor"){
				$(this).html((parseFloat($(this).data("coeff"))*(champ_stats['base_armor']+champ_stats['bonus_armor'])).toFixed(0));
			}
			
			//Armure supplémentaire
			if($(this).data("link")=="bonusarmor"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_armor']).toFixed(0));
			}
			
			//Dommages
			if($(this).data("link")=="attackdamage"){
				$(this).html((parseFloat($(this).data("coeff"))*parseFloat(parseFloat(champ_stats['base_attackdamage'])+champ_stats['bonus_attackdamage'])).toFixed(0));
			}
			
			//Dommages supplémentaires
			if($(this).data("link")=="bonusattackdamage"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_attackdamage']).toFixed(2));
			}
			
			//Points de vie
			if($(this).data("link")=="health"){
				$(this).html((parseFloat($(this).data("coeff"))*(champ_stats['base_hp']+champ_stats['bonus_hp'])).toFixed(2));
			}
			
			//Points de vie supplémentaires
			if($(this).data("link")=="bonushealth"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_hp']).toFixed(0));
			}
			
			//Points de mana
			if($(this).data("link")=="manamax"){
				$(this).html((parseFloat($(this).data("coeff"))*(champ_stats['base_mp']+champ_stats['bonus_mp'])).toFixed(2));
			}
			
			//Résistance magique
			if($(this).data("link")=="spellblock"){
				$(this).html((parseFloat($(this).data("coeff"))*(champ_stats['base_spellblock']+champ_stats['bonus_spellblock'])).toFixed(0));
			}
			
			//Résistance magique supplémentaire
			if($(this).data("link")=="bonusspellblock"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_spellblock']).toFixed(0));
			}
			
			//Réduction des délais
			if($(this).data("link")=="cooldown"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['bonus_cd']).toFixed(2));
			}
			
			//Niveau
			if($(this).data("link")=="level"){
				$(this).html((parseFloat($(this).data("coeff"))*(CHAMPION_LEVEL+1)).toFixed(0));
			}
			
			//Passif de Ashe
			if($(this).data("link")=="ashepassive"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['ashepassive']).toFixed(0));
			}
			
			//Passif de Vladimir
			if($(this).data("link")=="vladhp"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['HPPoolVlad']).toFixed(0));
			}
			if($(this).data("link")=="vladspelldamage"){
				$(this).html((parseFloat($(this).data("coeff"))*champ_stats['SpellDamageVlad']).toFixed(0));
			}
			
		});
		
	}
	this.updateRatios=updateRatios;
	
	
	//Mise à jour du niveau du champion
	function updateLevel(){
		
		CHAMPION_LEVEL=parseInt($("#level_range").val());
		
		Canis.LoL.TheoryCrafter.updateChampionLevel(CHAMPION_LEVEL);
		
		if($(".spell_level_range[data-key=Passive_"+CHAMPION_ID+"]").length>0)
			updatePassive($(".spell_level_range[data-key=Passive_"+CHAMPION_ID+"]"));

		
		$("#level").html(parseInt($("#level_range").val())+1);
		
		Canis.LoL.TheoryCrafter.updateChampionStats(CHAMPION_STATS);
		
	}
	
	
	//Fonction publique mise à jour des sorts
	function updateSpells(){
		for(var i in CHAMPION_SPELLS){
		
			updateSpell($(".spell_level_range[data-key="+CHAMPION_SPELLS[i]["key"]+"]"));
			
		}
		
	}
	this.updateSpells=updateSpells;
	
	
	
	
	function stripslashes(str) {
	  return (str + '')
		.replace(/\\(.?)/g, function(s, n1) {
		  switch (n1) {
			case '\\':
			  return '\\';
			case '0':
			  return '\u0000';
			case '':
			  return '';
			default:
			  return n1;
		  }
		});
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