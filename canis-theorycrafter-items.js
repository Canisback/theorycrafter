/*
	Canis Theorycrafter - Items
	
	v1.0 - 29/05/2015
		Fonctions
		- Construit l'application des items
		- Ajout et retrait des items
		- Gestion des stats
		
	01/06/2015
		- Correction d'un bug sur l'équipement qui ne se vidait pas
		- Ajout de la mise à jour des sorts lors du changement d'équipement
	
	Nécessite divisions #items_list, #tags_list, #selected_items et #selected_trinket
*/
if(typeof Canis.LoL.TheoryCrafter.Items == 'undefined') Canis.LoL.TheoryCrafter.Items = new function() {

	//Initialiser la bibliothèque
	var ALL_ITEMS;
	
	
	//Initialiser les stats
	var ITEMS_STATS;
	
	
	//
	TAGS_TREE=[{"header":"START","tags":["_SORTINDEX","LANE","JUNGLE"]},{"header":"TOOLS","tags":["_SORTINDEX","CONSUMABLE","GOLDPER","VISION"]},{"header":"DEFENSE","tags":["_SORTINDEX","HEALTH","ARMOR","SPELLBLOCK","HEALTHREGEN"]},{"header":"ATTACK","tags":["_SORTINDEX","DAMAGE","CRITICALSTRIKE","ATTACKSPEED","LIFESTEAL"]},{"header":"MAGIC","tags":["_SORTINDEX","SPELLDAMAGE","COOLDOWNREDUCTION","MANA","MANAREGEN"]},{"header":"MOVEMENT","tags":["_SORTINDEX","BOOTS","NONBOOTSMOVEMENT"]},{"header":"UNCATEGORIZED","tags":["ACTIVE","ARMORPENETRATION","AURA","MAGICPENETRATION","ONHIT","SLOW","STEALTH","TRINKET","SPELLVAMP","TENACITY"]}];
	
	TAGS_TREE_TRANSLATE={"START":"D\u00e9part","LANE":"Lane","JUNGLE":"Jungle","TOOLS":"Outils","CONSUMABLE":"Consommable","GOLDPER":"Or\/sec","VISION":"Vision","DEFENSE":"D\u00e9fense","HEALTH":"Sant\u00e9","ARMOR":"Armure","SPELLBLOCK":"R\u00e9sistance magique","HEALTHREGEN":"R\u00e9g\u00e9ration de vie","ATTACK":"Attaque","DAMAGE":"Dommages","CRITICALSTRIKE":"Coups critiques","ATTACKSPEED":"Vitesse d\'attaque","LIFESTEAL":"Vol de vie","MAGIC":"Magie","SPELLDAMAGE":"Puissance","COOLDOWNREDUCTION":"R\u00e9duction des d\u00e9lais","MANA":"Mana","MANAREGEN":"R\u00e9g\u00e9n\u00e9ration du mana","MOVEMENT":"D\u00e9placements","BOOTS":"Bottes","NONBOOTSMOVEMENT":"Autres","UNCATEGORIZED":"Divers","ACTIVE":"Activables","ARMORPENETRATION":"P\u00e9n\u00e9tration d\'armure","AURA":"Aura","MAGICPENETRATION":"P\u00e9n\u00e9tration magique","ONHIT":"À l\'impact","SLOW":"Ralentissement","STEALTH":"Furtivit\u00e9","TRINKET":"Reliques","SPELLVAMP":"Sort vampirique","TENACITY":"T\u00e9nacit\u00e9"};
	
	function construct() {
		a.documentReady(initialize);
	}

	function initialize() {
		console.log("TC Items initialize");
		ITEMS_STATS=Canis.LoL.TheoryCrafter.getItemsStats();
		setTimeout(getData, 1);
		setTimeout(bindEvents, 1);
	}
	
	function getData(){
		/*$("body").append('<div id="tags_list"></div>');// Ligne à enlever
		$("body").append('<div id="items_list"></div>');// Ligne à enlever
		$("body").append('<div id="selected_items">Items sélectionnés : <br /><span id="selected_trinket"> </span> </div>');// Ligne à enlever*/
		
		constructTagsTree();
		
		$.ajax({
			url: Canis.LoL.TheoryCrafter.getQuery()+"index.php/tc/getItems",
			success:function(data){
				ALL_ITEMS=data;
				data=JSON.parse(data)
				for(var i in data){
					printItem(data[i]);
					// $("#items_list").append('<span style="min-height:55px;min-width:55px;display:inline-block;"><a class="tooltip-stop" href="http://canisback.com/tooltips/item/'+data[i]['id']+'"><span class="item" data-id="'+data[i]['id']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+data[i]['sprite']+'") no-repeat scroll -'+data[i]['x']+'px -'+data[i]['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
				}
			}
		});
	}
	
	
	//Affiche un item dans la liste
	function printItem(item){
		$("#items_list").append('<span style="min-height:55px;min-width:55px;display:inline-block;"><a class="tooltip-stop" href="http://canisback.com/tooltips/item/'+item['id']+'"><span class="item" data-id="'+item['id']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+item['sprite']+'") no-repeat scroll -'+item['x']+'px -'+item['y']+'px transparent;height: 48px;width: 48px;display:inline-block;\'></span></a></span>');
	}
	
	
	//Affiche l'arbre de tri des items
	function constructTagsTree(){
		var str="";
		for(var i in TAGS_TREE){
			
			str+='<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading'+i+'"><h4 class="panel-title">'+
						'<a data-toggle="collapse" data-parent="#itemsAccordion" href="#collapse'+i+'" aria-expanded="true" aria-controls="collapse'+i+'">';
						
			str+=TAGS_TREE_TRANSLATE[TAGS_TREE[i]['header']];
			
			str+='</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+i+'">'+
				'<div class="panel-body"><ul>';
				
			for(var j in TAGS_TREE[i]['tags']){
				if(TAGS_TREE[i]['tags'][j]!="_SORTINDEX"){
					str+='<li class="item_tag" data-tag="'+TAGS_TREE[i]['tags'][j]+'">'+TAGS_TREE_TRANSLATE[TAGS_TREE[i]['tags'][j]]+'</li>';
				}
			}
				
			str+='</ul></div></div></div>';
		}
		$("#tags_list").append(str);
	}
	
	
	
	
	
	//Lie les events aux fonctions de l'application
	function bindEvents(){
		
		$(document).on("click",".item_tag",function(e){
		
			displayItems($(e.target));
			
		});
		
		
		$(document).on("click",".item",function(e){
		
			e.preventDefault();
			
			addItem($(e.target));
		
		});
		
		
		$(document).on("click",".selected_item",function(e){
		
			e.preventDefault();
			
			removeItem($(e.target));
		
		});
	}
	
	
	//Affichage des items triés
	function displayItems(target){
		
		target.toggleClass("active","");
		
		var displayed_items=JSON.parse(ALL_ITEMS);
		var array;
		
		//Parcours de chaque tag actif
		$(".item_tag.active").each(function(){
			for(var i in displayed_items){
			
				array=[];
				
				if(JSON.parse(displayed_items[i]['tags'])!==null)
				$.each(JSON.parse(displayed_items[i]['tags']), function(index, item) {
					array[index] = item.toUpperCase();
				});
				
				//Retrait de chaque item ne correspondant pas au tag
				if($.inArray($(this).data("tag"),array)=="-1"){
					delete displayed_items[i];
				}
			}
		});
		
		//Vidage de la liste
		$("#items_list").html("");
		
		//Affichage de tous les items correspondants
		for(var i in displayed_items){
			printItem(displayed_items[i]);
		}
		
	}
	
	
	//Ajout d'un item à l'équipement
	function addItem(target){
	
		var items=JSON.parse(ALL_ITEMS);
		
		
		//Différenciation entre trinket et autre item
		if($.inArray("Trinket",JSON.parse(items[target.data("id")]['tags']))>0){
		
			if($("#selected_trinket .selected_item").length<1)
			$("#selected_trinket").append('<a class="tooltip-stop" href="http://canisback.com/tooltips/item/'+items[target.data("id")]['id']+'"><span class="selected_item" data-id="'+items[target.data("id")]['id']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+items[target.data("id")]['sprite']+'") no-repeat scroll -'+items[target.data("id")]['x']+'px -'+items[target.data("id")]['y']+'px transparent;min-height: 48px;width: 48px;display:inline-block;\'></span></a> ');
		
		}else{
		
			if($("#selected_items .selected_item").length<6)
			$("#selected_items").append('<a class="tooltip-stop" href="http://canisback.com/tooltips/item/'+items[target.data("id")]['id']+'"><span class="selected_item" data-id="'+items[target.data("id")]['id']+'" style=\'background : url("'+Canis.LoL.TheoryCrafter.getQuery()+'application/ddragon/'+Canis.LoL.TheoryCrafter.getDDragon()+'/img/sprite/'+items[target.data("id")]['sprite']+'") no-repeat scroll -'+items[target.data("id")]['x']+'px -'+items[target.data("id")]['y']+'px transparent;min-height: 48px;width: 48px;display:inline-block;\'></span></a> ');
		
		}
		
		updateItemsStats();
	
	}
	
	
	//Retrait de l'item de l'équipement
	function removeItem(target){
		
		$(".canis-tooltip-wrapper").hide();
		
		target.remove();
		
		updateItemsStats();
	}
	
	
	//Mise à jour des stats des items
	function updateItemsStats(){
	
		var items=JSON.parse(ALL_ITEMS);
		
		ITEMS_STATS=Canis.LoL.TheoryCrafter.getBaseStats();
		
		var select_items={};
		
		$(".selected_item").each(function(){
		
			for(var j in JSON.parse(items[$(this).data("id")]['stats'])){
			
				ITEMS_STATS[j]+=JSON.parse(items[$(this).data("id")]['stats'])[j];
				
			}
			
			select_items[$(this).data("id")]=0;
			
		});
		
		for(var k in select_items){
		
			for(var l in JSON.parse(items[k]['unique'])){
			
				ITEMS_STATS[l]+=JSON.parse(items[k]['unique'])[l];
				
			}
			
		}
		
		Canis.LoL.TheoryCrafter.updateItemsStats(ITEMS_STATS);
		
		Canis.LoL.TheoryCrafter.Champions.updateSpells();
		
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