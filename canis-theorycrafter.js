/*
	Canis Theorycrafter
	
	v1.0 - 29/05/2015
		Fonctions
		- Appel des feuille de style et script des Tooltips
		- Appel des scripts des application Masteries, Runes, Items et Champions
		- Mise à jour des stats
		
	01/06/205
		- Ajout de la fonction getBaseStats()
		- Correction des calculs de régénération des MP et HP
		- Ajout du script GA
	
	03/06/2015
		- Ajout des exceptions pour Ashe et Azir
		
	04/06/2015
		- Ajout des exceptions pour Diana et Galio
		
	06/06/2015
		- Ajout de la fonction growthFormula et correction du calcul des stats de base par niveau
	
	Fonctionne avec JQuery et Bootstrap
	
	Balises requises : 
		Masteries : 	#bg-mast			#mast_button
		Runes : 		#bg-runes 			#runes_list 			#runes_effects		#runes_buttons
		Items : 		#items_list 		#tags_list 				#selected_items 	#selected_trinket
		Champions : 	#champions_list		#champion_selected		#stats_1			#stats_2 			#champion_spells
*/

if(typeof Canis == 'undefined') var Canis = {};
if(typeof Canis.LoL == 'undefined') Canis.LoL = {};

if(typeof Canis.LoL.TheoryCrafter == 'undefined') Canis.LoL.TheoryCrafter = new function() {
	
	
	//Constantes
	var URL_CSS = 'http://canisback.com/tc/application/views/tc/css/';
	var URL_QUERY_BASE = 'http://canisback.com/tc/';
	var URL_TOOLTIPS_SCRIPT = 'http://canisback.com/tooltips/';
	
	var DDRAGON="5.10.1";
	
	var BASE_STATS='{"rFlatArmorModPerLevel":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rFlatCritChanceModPerLevel":0,"rFlatCritDamageModPerLevel":0,"rFlatEnergyRegenModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatHPModPerLevel":0,"rFlatHPRegenModPerLevel":0,"rFlatMPRegenModPerLevel":0,"rFlatMagicDamageModPerLevel":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rFlatMPModPerLevel":0,"rFlatEnergyModPerLevel":0,"rFlatMovementSpeedModPerLevel":0,"rFlatPhysicalDamageModPerLevel":0,"rFlatSpellBlockModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"rPercentAttackSpeedModPerLevel":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"rPercentMovementSpeedModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"FlatArmorMod":0,"FlatAttackSpeedMod":0,"FlatBlockMod":0,"FlatCritChanceMod":0,"FlatCritDamageMod":0,"FlatEnergyRegenMod":0,"FlatEnergyPoolMod":0,"FlatEXPBonus":0,"FlatHPPoolMod":0,"FlatHPRegenMod":0,"FlatMPPoolMod":0,"FlatMPRegenMod":0,"FlatMagicDamageMod":0,"FlatMovementSpeedMod":0,"FlatPhysicalDamageMod":0,"FlatSpellBlockMod":0,"PercentArmorMod":0,"PercentAttackSpeedMod":0,"PercentBlockMod":0,"PercentCritChanceMod":0,"PercentCritDamageMod":0,"PercentDodgeMod":0,"PercentEXPBonus":0,"PercentHPPoolMod":0,"PercentHPRegenMod":0,"PercentMPPoolMod":0,"PercentMPRegenMod":0,"PercentMagicDamageMod":0,"PercentMovementSpeedMod":0,"PercentPhysicalDamageMod":0,"PercentSpellBlockMod":0,"PercentSpellVampMod":0,"PercentLifeStealMod":0,"PercentBonusPhysicalDamage":0,"rPercentBonusArmorMod":0,"rPercentBonusSpellBlockMod":0,"TenacityMod":0,"ashepassive":0}';
	
	//Initialisation des stats
	var ITEMS_STATS={"rFlatArmorModPerLevel":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rFlatCritChanceModPerLevel":0,"rFlatCritDamageModPerLevel":0,"rFlatEnergyRegenModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatHPModPerLevel":0,"rFlatHPRegenModPerLevel":0,"rFlatMPRegenModPerLevel":0,"rFlatMagicDamageModPerLevel":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rFlatMPModPerLevel":0,"rFlatEnergyModPerLevel":0,"rFlatMovementSpeedModPerLevel":0,"rFlatPhysicalDamageModPerLevel":0,"rFlatSpellBlockModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"rPercentAttackSpeedModPerLevel":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"rPercentMovementSpeedModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"FlatArmorMod":0,"FlatAttackSpeedMod":0,"FlatBlockMod":0,"FlatCritChanceMod":0,"FlatCritDamageMod":0,"FlatEnergyRegenMod":0,"FlatEnergyPoolMod":0,"FlatEXPBonus":0,"FlatHPPoolMod":0,"FlatHPRegenMod":0,"FlatMPPoolMod":0,"FlatMPRegenMod":0,"FlatMagicDamageMod":0,"FlatMovementSpeedMod":0,"FlatPhysicalDamageMod":0,"FlatSpellBlockMod":0,"PercentArmorMod":0,"PercentAttackSpeedMod":0,"PercentBlockMod":0,"PercentCritChanceMod":0,"PercentCritDamageMod":0,"PercentDodgeMod":0,"PercentEXPBonus":0,"PercentHPPoolMod":0,"PercentHPRegenMod":0,"PercentMPPoolMod":0,"PercentMPRegenMod":0,"PercentMagicDamageMod":0,"PercentMovementSpeedMod":0,"PercentPhysicalDamageMod":0,"PercentSpellBlockMod":0,"PercentSpellVampMod":0,"PercentLifeStealMod":0,"TenacityMod":0};
	
	var RUNES_STATS={"rFlatArmorModPerLevel":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rFlatCritChanceModPerLevel":0,"rFlatCritDamageModPerLevel":0,"rFlatEnergyRegenModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatHPModPerLevel":0,"rFlatHPRegenModPerLevel":0,"rFlatMPRegenModPerLevel":0,"rFlatMagicDamageModPerLevel":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rFlatMPModPerLevel":0,"rFlatEnergyModPerLevel":0,"rFlatMovementSpeedModPerLevel":0,"rFlatPhysicalDamageModPerLevel":0,"rFlatSpellBlockModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"rPercentAttackSpeedModPerLevel":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"rPercentMovementSpeedModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"FlatArmorMod":0,"FlatAttackSpeedMod":0,"FlatBlockMod":0,"FlatCritChanceMod":0,"FlatCritDamageMod":0,"FlatEnergyRegenMod":0,"FlatEnergyPoolMod":0,"FlatEXPBonus":0,"FlatHPPoolMod":0,"FlatHPRegenMod":0,"FlatMPPoolMod":0,"FlatMPRegenMod":0,"FlatMagicDamageMod":0,"FlatMovementSpeedMod":0,"FlatPhysicalDamageMod":0,"FlatSpellBlockMod":0,"PercentArmorMod":0,"PercentAttackSpeedMod":0,"PercentBlockMod":0,"PercentCritChanceMod":0,"PercentCritDamageMod":0,"PercentDodgeMod":0,"PercentEXPBonus":0,"PercentHPPoolMod":0,"PercentHPRegenMod":0,"PercentMPPoolMod":0,"PercentMPRegenMod":0,"PercentMagicDamageMod":0,"PercentMovementSpeedMod":0,"PercentPhysicalDamageMod":0,"PercentSpellBlockMod":0,"PercentSpellVampMod":0,"PercentLifeStealMod":0};
	
	var MASTERIES_STATS={"rFlatArmorModPerLevel":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rFlatCritChanceModPerLevel":0,"rFlatCritDamageModPerLevel":0,"rFlatEnergyRegenModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatHPModPerLevel":0,"rFlatHPRegenModPerLevel":0,"rFlatMPRegenModPerLevel":0,"rFlatMagicDamageModPerLevel":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rFlatMPModPerLevel":0,"rFlatEnergyModPerLevel":0,"rFlatMovementSpeedModPerLevel":0,"rFlatPhysicalDamageModPerLevel":0,"rFlatSpellBlockModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"rPercentAttackSpeedModPerLevel":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"rPercentMovementSpeedModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"FlatArmorMod":0,"FlatAttackSpeedMod":0,"FlatBlockMod":0,"FlatCritChanceMod":0,"FlatCritDamageMod":0,"FlatEnergyRegenMod":0,"FlatEnergyPoolMod":0,"FlatEXPBonus":0,"FlatHPPoolMod":0,"FlatHPRegenMod":0,"FlatMPPoolMod":0,"FlatMPRegenMod":0,"FlatMagicDamageMod":0,"FlatMovementSpeedMod":0,"FlatPhysicalDamageMod":0,"FlatSpellBlockMod":0,"PercentArmorMod":0,"PercentAttackSpeedMod":0,"PercentBlockMod":0,"PercentCritChanceMod":0,"PercentCritDamageMod":0,"PercentDodgeMod":0,"PercentEXPBonus":0,"PercentHPPoolMod":0,"PercentHPRegenMod":0,"PercentMPPoolMod":0,"PercentMPRegenMod":0,"PercentMagicDamageMod":0,"PercentMovementSpeedMod":0,"PercentPhysicalDamageMod":0,"PercentSpellBlockMod":0,"PercentSpellVampMod":0,"PercentLifeStealMod":0,"PercentBonusPhysicalDamage":0,"rPercentBonusArmorMod":0,"rPercentBonusSpellBlockMod":0,"TenacityMod":0};
	
	var CHAMPION_STATS;
	
	var TOTAL_STATS={"rFlatArmorModPerLevel":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rFlatCritChanceModPerLevel":0,"rFlatCritDamageModPerLevel":0,"rFlatEnergyRegenModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatHPModPerLevel":0,"rFlatHPRegenModPerLevel":0,"rFlatMPRegenModPerLevel":0,"rFlatMagicDamageModPerLevel":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rFlatMPModPerLevel":0,"rFlatEnergyModPerLevel":0,"rFlatMovementSpeedModPerLevel":0,"rFlatPhysicalDamageModPerLevel":0,"rFlatSpellBlockModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"rPercentAttackSpeedModPerLevel":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"rPercentMovementSpeedModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"FlatArmorMod":0,"FlatAttackSpeedMod":0,"FlatBlockMod":0,"FlatCritChanceMod":0,"FlatCritDamageMod":0,"FlatEnergyRegenMod":0,"FlatEnergyPoolMod":0,"FlatEXPBonus":0,"FlatHPPoolMod":0,"FlatHPRegenMod":0,"FlatMPPoolMod":0,"FlatMPRegenMod":0,"FlatMagicDamageMod":0,"FlatMovementSpeedMod":0,"FlatPhysicalDamageMod":0,"FlatSpellBlockMod":0,"PercentArmorMod":0,"PercentAttackSpeedMod":0,"PercentBlockMod":0,"PercentCritChanceMod":0,"PercentCritDamageMod":0,"PercentDodgeMod":0,"PercentEXPBonus":0,"PercentHPPoolMod":0,"PercentHPRegenMod":0,"PercentMPPoolMod":0,"PercentMPRegenMod":0,"PercentMagicDamageMod":0,"PercentMovementSpeedMod":0,"PercentPhysicalDamageMod":0,"PercentSpellBlockMod":0,"PercentSpellVampMod":0,"PercentLifeStealMod":0,"PercentBonusPhysicalDamage":0,"rPercentBonusArmorMod":0,"rPercentBonusSpellBlockMod":0,"TenacityMod":0,"ashepassive":0};
	
	var CHAMPION_LEVEL;
	
	var CHAMPION_ID;
	
	//Traductions
	var EFFECTS_RUNES_TRANSLATE={"rFlatArmorModPerLevel":"Armure /niveau","rFlatArmorPenetrationMod":"Pénétration d'armure","rFlatArmorPenetrationModPerLevel":"Pénétration d'armure /niveau","rFlatCritChanceModPerLevel":"Crit. chance /niveau","rFlatCritDamageModPerLevel":"Dommage Crit. /niveau","rFlatEnergyRegenModPerLevel":"Régèn énergie /niveau","rFlatDodgeMod":"Esquive","rFlatDodgeModPerLevel":"Esquive /niveau","rFlatGoldPer10Mod":"Or/10s","rFlatHPModPerLevel":"PV /niveau","rFlatHPRegenModPerLevel":"Régèn PV /niveau","rFlatMPRegenModPerLevel":"Régén mana /niveau","rFlatMagicDamageModPerLevel":"Puissance /niveau","rFlatMagicPenetrationMod":"Pénétration magique","rFlatMagicPenetrationModPerLevel":"Pénétration magique /niveau","rFlatMPModPerLevel":"Mana /niveau","rFlatEnergyModPerLevel":"Energie /niveau","rFlatMovementSpeedModPerLevel":"Vitesse de déplacement /niveau","rFlatPhysicalDamageModPerLevel":"Dommages /niveau","rFlatSpellBlockModPerLevel":"Résistance magique /niveau","rFlatTimeDeadMod":"Réduction temps mort","rFlatTimeDeadModPerLevel":"Réduction temps mort /niveau","rPercentArmorPenetrationMod":"% Pénetration d'armure","rPercentArmorPenetrationModPerLevel":"% Pénetration d'armure /niveau","rPercentAttackSpeedModPerLevel":"% Vitesse d'attaque /niveau","rPercentCooldownMod":"% Réduction des délais","rPercentCooldownModPerLevel":"% Réduction des délais /niveau","rPercentMagicPenetrationMod":"% Pénetration magique","rPercentMagicPenetrationModPerLevel":"% Pénetration magique /niveau","rPercentMovementSpeedModPerLevel":"% Vitesse de déplacement /niveau","rPercentTimeDeadMod":"% Réduction temps mort","rPercentTimeDeadModPerLevel":"% Réduction temps mort /niveau","FlatArmorMod":"Armure","FlatAttackSpeedMod":"Vitesse d'attaque","FlatBlockMod":0,"FlatCritChanceMod":"Chance Crit.","FlatCritDamageMod":"Dommage Crit.","FlatEnergyRegenMod":"Régèn énergie","FlatEnergyPoolMod":"Energie","FlatEXPBonus":"Bonus XP","FlatHPPoolMod":"PV","FlatHPRegenMod":"Régèn PV","FlatMPPoolMod":"Mana","FlatMPRegenMod":"Régèn mana","FlatMagicDamageMod":"Puissance","FlatMovementSpeedMod":"Vitesse de déplacement","FlatPhysicalDamageMod":"Dommages","FlatSpellBlockMod":"Résistance magique","PercentArmorMod":"% Armure","PercentAttackSpeedMod":"% Vitesse d'attaque","PercentBlockMod":0,"PercentCritChanceMod":"% Crit. Chance","PercentCritDamageMod":"% Dommages Crit.","PercentDodgeMod":"% Esquive","PercentEXPBonus":"% Bonus XP","PercentHPPoolMod":"% PV","PercentHPRegenMod":"% Régèn PV","PercentMPPoolMod":"% Mana","PercentMPRegenMod":"% Régèn mana","PercentMagicDamageMod":"% Puissance","PercentMovementSpeedMod":"% Vitesse de déplacement","PercentPhysicalDamageMod":"% Dommages","PercentSpellBlockMod":"% Résistance magique","PercentSpellVampMod":"% Sort vampirique","PercentLifeStealMod":"% Vol de vie"};
	
	
	//Initialisation des bibliothèques
	
	
	function construct() {
		a.documentReady(initialize);
	}

	function initialize() {
		console.log("TC initialize");
		// Masteries.initialize();
		setTimeout(getCss, 1);
		setTimeout(getTooltipsScript, 1);
		setTimeout(bindEvents, 1);
		setTimeout(startMastApp, 1);
		setTimeout(startRunesApp, 1);
		setTimeout(startItemsApp, 1);
		setTimeout(startChampionsApp, 1);
		setTimeout(getAnalytics, 1);
	}
	
	function getCss() {
		
		var cssUrl = URL_CSS;

		a.getStyle(cssUrl + 'style.css');
		
	}
	
	function getTooltipsScript(){
	
		var url = URL_TOOLTIPS_SCRIPT;
		
		$.getScript(url + 'canis-tooltips.js');
		
	}
	
	function bindEvents(){
		
		$(document).on("click",".tooltip-stop",function(e){
			
			e.preventDefault();
			
		});
	}
	
	function startMastApp(){
		
		var url = URL_QUERY_BASE;
		
		$.getScript(url + 'application/views/tc/canis-theorycrafter-masteries.js');
	}
	
	function startRunesApp(){
	
		var url = URL_QUERY_BASE;
		
		$.getScript(url + 'application/views/tc/canis-theorycrafter-runes.js');
	}
	
	function startItemsApp(){
	
		var url = URL_QUERY_BASE;
		
		$.getScript(url + 'application/views/tc/canis-theorycrafter-items.js');
	}
	
	function startChampionsApp(){
	
		var url = URL_QUERY_BASE;
		
		$.getScript(url + 'application/views/tc/canis-theorycrafter-champions.js');
	}
	
	function getAnalytics(){
	
		var url = URL_QUERY_BASE;
		
		$.getScript(url + 'application/views/tc/google-analytics.js');
	}
	
	
	function getDDragon(){
		return DDRAGON;
	}
	this.getDDragon=getDDragon;
	
	
	function getBaseStats(){
		return JSON.parse(BASE_STATS);
	}
	this.getBaseStats=getBaseStats;
	
	
	function getMasteriesStats(){
		return MASTERIES_STATS;
	}
	this.getMasteriesStats=getMasteriesStats;
	
	
	function getRunesStats(){
		return RUNES_STATS;
	}
	this.getRunesStats=getRunesStats;
	
	
	function getItemsStats(){
		return ITEMS_STATS;
	}
	this.getItemsStats=getItemsStats;
	
	
	function getChampionStats(){
		return CHAMPION_STATS;
	}
	this.getChampionStats=getChampionStats;
	
	
	function getChampionLevel(){
		return CHAMPION_LEVEL;
	}
	this.getChampionLevel=getChampionLevel;
	
	
	function getTotalStats(){
		return TOTAL_STATS;
	}
	this.getTotalStats=getTotalStats;
	
	
	function getRunesTranslate(){
		return EFFECTS_RUNES_TRANSLATE;
	}
	this.getRunesTranslate=getRunesTranslate;
	
	
	function getUrlCss(){
		return URL_CSS;
	}
	this.getUrlCss=getUrlCss;
	
	
	function getQuery(){
		return URL_QUERY_BASE;
	}
	this.getQuery=getQuery;
	
	
	function updateRunesStats(data){
		RUNES_STATS=data;
		updateStats();
	}
	this.updateRunesStats=updateRunesStats;
	
	
	function updateMasteriesStats(data){
		MASTERIES_STATS=data;
		updateStats();
	}
	this.updateMasteriesStats=updateMasteriesStats;
	
	
	function updateItemsStats(data){
		ITEMS_STATS=data;
		updateStats();
	}
	this.updateItemsStats=updateItemsStats;
	
	
	function updateChampionStats(data){
		CHAMPION_STATS=data;
		updateStats();
	}
	this.updateChampionStats=updateChampionStats;
	
	
	function updateChampionLevel(data){
		CHAMPION_LEVEL=data;
		updateStats();
	}
	this.updateChampionLevel=updateChampionLevel;
	
	
	function updateChampionId(data){
		CHAMPION_ID=data;
	}
	this.updateChampionId=updateChampionId;
	
	//Mise à jour et affichage des stats
	function updateStats(){
	
	
		if(CHAMPION_STATS!=null){
		
			//Armure
			TOTAL_STATS['base_armor']=(parseFloat(CHAMPION_STATS["armor"])+growthFormula(parseFloat(CHAMPION_STATS["armorperlevel"])));
			TOTAL_STATS['bonus_armor']=
				(
					ITEMS_STATS['FlatArmorMod']
					+RUNES_STATS['FlatArmorMod']
					+RUNES_STATS['rFlatArmorModPerLevel']*(CHAMPION_LEVEL)
				)*(
					1
					+MASTERIES_STATS['rPercentBonusArmorMod']
				);
			
			$("#armor").html((parseFloat(TOTAL_STATS['base_armor'])+parseFloat(TOTAL_STATS['bonus_armor'])).toFixed(2));
			
			
			//Dommages
			TOTAL_STATS['base_attackdamage']=parseFloat(parseFloat(CHAMPION_STATS["attackdamage"])+growthFormula(parseFloat(CHAMPION_STATS["attackdamageperlevel"])));
			TOTAL_STATS['bonus_attackdamage']=
				ITEMS_STATS['FlatPhysicalDamageMod']
				+RUNES_STATS['FlatPhysicalDamageMod']
				+MASTERIES_STATS['FlatPhysicalDamageMod']
				+(
					ITEMS_STATS['rFlatPhysicalDamageModPerLevel']
					+RUNES_STATS['rFlatPhysicalDamageModPerLevel']
					+MASTERIES_STATS['rFlatPhysicalDamageModPerLevel']
				)*(CHAMPION_LEVEL);
			
			$("#attackdamage").html((parseFloat(TOTAL_STATS['base_attackdamage'])+parseFloat(TOTAL_STATS['bonus_attackdamage'])).toFixed(2));
			
			
			//Portée
			TOTAL_STATS['base_attackrange']=CHAMPION_STATS["attackrange"];
			TOTAL_STATS['bonus_attackrange']=0;
			
			$("#attackrange").html(CHAMPION_STATS["attackrange"]);
			
			
			//Vitesse d'attaque
			TOTAL_STATS['base_attackspeed']=(
				0.625/(
					1+parseFloat(CHAMPION_STATS["attackspeedoffset"])
				)+(
					growthFormula(parseFloat(CHAMPION_STATS["attackspeedperlevel"]))
				)
				*
				0.625/(
					1+parseFloat(CHAMPION_STATS["attackspeedoffset"])
				)
				/100
			).toFixed(3);
			TOTAL_STATS['bonus_attackspeed']=(
					(CHAMPION_LEVEL)
					*
					(
						parseFloat(ITEMS_STATS["rPercentAttackSpeedModPerLevel"])
						+
						parseFloat(RUNES_STATS["rPercentAttackSpeedModPerLevel"])
					)
					+
					parseFloat(ITEMS_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(RUNES_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(MASTERIES_STATS["PercentAttackSpeedMod"])
				)
				*
				0.625/(
					1+parseFloat(CHAMPION_STATS["attackspeedoffset"])
				);
				
			if((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed']))>2.5){
				$("#attackspeed").html("2.5");
			}else{
				$("#attackspeed").html((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed'])).toFixed(3));
			}
			
			
			//Points de vie
			TOTAL_STATS['base_hp']=(parseFloat(CHAMPION_STATS["hp"])+growthFormula(parseFloat(CHAMPION_STATS["hpperlevel"])));
			TOTAL_STATS['bonus_hp']=
				(
					ITEMS_STATS['FlatHPPoolMod']
					+RUNES_STATS['FlatHPPoolMod']
					+MASTERIES_STATS['FlatHPPoolMod']
					+(
						ITEMS_STATS['rFlatHPModPerLevel']
						+RUNES_STATS['rFlatHPModPerLevel']
					)*(CHAMPION_LEVEL)
				)*(
					1
					+ITEMS_STATS['PercentHPPoolMod']
					+RUNES_STATS['PercentHPPoolMod']
					+MASTERIES_STATS['PercentHPPoolMod']
				);
				
			$("#hp").html((parseFloat(TOTAL_STATS['base_hp'])+parseFloat(TOTAL_STATS['bonus_hp'])).toFixed(0));
			
			
			//Régèn points de vie
			TOTAL_STATS['base_hpregen']=(parseFloat(CHAMPION_STATS["hpregen"])+growthFormula(parseFloat(CHAMPION_STATS["hpregenperlevel"])));
			TOTAL_STATS['bonus_hpregen']=
				(
					ITEMS_STATS['FlatHPRegenMod']
					+RUNES_STATS['FlatHPRegenMod']
					+MASTERIES_STATS['FlatHPRegenMod']
					+(
						ITEMS_STATS['rFlatHPRegenModPerLevel']
						+RUNES_STATS['rFlatHPRegenModPerLevel']
						+MASTERIES_STATS['rFlatHPRegenModPerLevel']
					)*(CHAMPION_LEVEL)
				)
				+TOTAL_STATS['base_hpregen']
				*(
					ITEMS_STATS['PercentHPRegenMod']
					+RUNES_STATS['PercentHPRegenMod']
					+MASTERIES_STATS['PercentHPRegenMod']
				);
			
			
			$("#hpregen").html((parseFloat(TOTAL_STATS['base_hpregen'])+parseFloat(TOTAL_STATS['bonus_hpregen'])).toFixed(1));
			
			
			//Vitesse de déplacement
			TOTAL_STATS['base_movespeed']=CHAMPION_STATS["movespeed"];
			TOTAL_STATS['bonus_movespeed']=
				parseFloat(CHAMPION_STATS["movespeed"])
				+parseFloat(ITEMS_STATS['FlatMovementSpeedMod'])
				+parseFloat(RUNES_STATS['FlatMovementSpeedMod'])
				+parseFloat(MASTERIES_STATS['FlatMovementSpeedMod'])
				+(
					parseFloat(ITEMS_STATS['rFlatMovementSpeedModPerLevel'])
					+parseFloat(RUNES_STATS['rFlatMovementSpeedModPerLevel'])
				)*(CHAMPION_LEVEL);
			TOTAL_STATS['bonus_movespeed']=
				TOTAL_STATS['bonus_movespeed']
				+TOTAL_STATS['bonus_movespeed']*(
					parseFloat(RUNES_STATS['PercentMovementSpeedMod'])
					+parseFloat(MASTERIES_STATS['PercentMovementSpeedMod'])
				);
			
			TOTAL_STATS['bonus_movespeed']=
				parseFloat(TOTAL_STATS['bonus_movespeed'])
				+parseFloat(TOTAL_STATS['bonus_movespeed'])*(
					parseFloat(ITEMS_STATS['PercentMovementSpeedMod'])
					+parseFloat(ITEMS_STATS['rPercentMovementSpeedModPerLevel'])*(CHAMPION_LEVEL)
				);
			if(TOTAL_STATS['bonus_movespeed']>415){
				TOTAL_STATS['bonus_movespeed']=(TOTAL_STATS['bonus_movespeed']-415)*0.8+415;
			}
			if(TOTAL_STATS['bonus_movespeed']>490){
				TOTAL_STATS['bonus_movespeed']=(TOTAL_STATS['bonus_movespeed']-490)*0.5+490;
			}
			TOTAL_STATS['bonus_movespeed']=TOTAL_STATS['bonus_movespeed']-CHAMPION_STATS["movespeed"];
			
			$("#movespeed").html((parseFloat(TOTAL_STATS['base_movespeed'])+parseFloat(TOTAL_STATS['bonus_movespeed'])).toFixed(0));
			
			
			//Ressource
			TOTAL_STATS['base_mp']=(parseFloat(CHAMPION_STATS["mp"])+growthFormula(parseFloat(CHAMPION_STATS["mpperlevel"])));
			TOTAL_STATS['bonus_mp']=0;
			if(CHAMPION_STATS["partype"]=="Mana"){
				TOTAL_STATS['bonus_mp']=
					ITEMS_STATS['FlatMPPoolMod']
					+RUNES_STATS['FlatMPPoolMod']
					+MASTERIES_STATS['FlatMPPoolMod']
					+(
						ITEMS_STATS['rFlatMPModPerLevel']
						+RUNES_STATS['rFlatMPModPerLevel']
						+MASTERIES_STATS['rFlatMPModPerLevel']
					)*(CHAMPION_LEVEL);
			}else if(CHAMPION_STATS["partype"]=="Energy"){
				TOTAL_STATS['bonus_mp']=
					ITEMS_STATS['FlatEnergyPoolMod']
					+RUNES_STATS['FlatEnergyPoolMod']
					+(
						ITEMS_STATS['rFlatEnergyModPerLevel']
						+RUNES_STATS['rFlatEnergyModPerLevel']
					)*(CHAMPION_LEVEL);
			}
			
			$("#mp").html((parseFloat(TOTAL_STATS['base_mp'])+parseFloat(TOTAL_STATS['bonus_mp'])).toFixed(0));
			
			
			//Régèn ressource
			TOTAL_STATS['base_mpregen']=(parseFloat(CHAMPION_STATS["mpregen"])+growthFormula(parseFloat(CHAMPION_STATS["mpregenperlevel"])));
			TOTAL_STATS['bonus_mpregen']=0;
			if(CHAMPION_STATS["partype"]=="Mana"){
				TOTAL_STATS['bonus_mpregen']=
					ITEMS_STATS['FlatMPRegenMod']
					+RUNES_STATS['FlatMPRegenMod']
					+MASTERIES_STATS['FlatMPRegenMod']
					+(
						ITEMS_STATS['rFlatMPRegenModPerLevel']
						+RUNES_STATS['rFlatMPRegenModPerLevel']
						+MASTERIES_STATS['rFlatMPRegenModPerLevel']
					)*(CHAMPION_LEVEL)
					+(
						ITEMS_STATS['PercentMPRegenMod']
						+RUNES_STATS['PercentMPRegenMod']
						+MASTERIES_STATS['PercentMPRegenMod']
					)
					*TOTAL_STATS['base_mpregen'];
			}else if(CHAMPION_STATS["partype"]=="Energy"){
				TOTAL_STATS['bonus_mpregen']=ITEMS_STATS['FlatEnergyRegenMod']+RUNES_STATS['FlatEnergyRegenMod']+(ITEMS_STATS['rFlatEnergyRegenModPerLevel']+RUNES_STATS['rFlatEnergyRegenModPerLevel'])*(CHAMPION_LEVEL);
			}
			
			$("#mpregen").html((parseFloat(TOTAL_STATS['base_mpregen'])+parseFloat(TOTAL_STATS['bonus_mpregen'])).toFixed(1));
			
			
			//Résistance magique
			TOTAL_STATS['base_spellblock']=(parseFloat(CHAMPION_STATS["spellblock"])+(CHAMPION_LEVEL*parseFloat(CHAMPION_STATS["spellblockperlevel"]))).toFixed(2);
			TOTAL_STATS['bonus_spellblock']=
				(
					ITEMS_STATS['FlatSpellBlockMod']
					+RUNES_STATS['FlatSpellBlockMod']
					+MASTERIES_STATS['FlatSpellBlockMod']
					+(
						ITEMS_STATS['rFlatSpellBlockModPerLevel']
						+RUNES_STATS['rFlatSpellBlockModPerLevel']
						+MASTERIES_STATS['rFlatSpellBlockModPerLevel']
					)*(CHAMPION_LEVEL)
				)*(
					1
					+MASTERIES_STATS['rPercentBonusSpellBlockMod']
				);
				
			$("#spellblock").html((parseFloat(TOTAL_STATS['base_spellblock'])+parseFloat(TOTAL_STATS['bonus_spellblock'])).toFixed(2));
			
			
			//Puissance
			TOTAL_STATS['bonus_spelldamage']=
				ITEMS_STATS['FlatMagicDamageMod']
				+RUNES_STATS['FlatMagicDamageMod']
				+MASTERIES_STATS['FlatMagicDamageMod']
				+(
					ITEMS_STATS['rFlatMagicDamageModPerLevel']
					+RUNES_STATS['rFlatMagicDamageModPerLevel']
					+MASTERIES_STATS['rFlatMagicDamageModPerLevel']
				)*(CHAMPION_LEVEL);
				
			$("#spelldamage").html(parseFloat(TOTAL_STATS['bonus_spelldamage']).toFixed(0));
			
			
			//Pénétration d'armure
			TOTAL_STATS['bonus_flatarpen']=
				ITEMS_STATS['rFlatArmorPenetrationMod']
				+RUNES_STATS['rFlatArmorPenetrationMod']
				+MASTERIES_STATS['rFlatArmorPenetrationMod']
				+(
					ITEMS_STATS['rFlatArmorPenetrationModPerLevel']
					+RUNES_STATS['rFlatArmorPenetrationModPerLevel']
					+MASTERIES_STATS['rFlatArmorPenetrationModPerLevel']
				)*(CHAMPION_LEVEL);
				
			
			
			TOTAL_STATS['bonus_percentarpen']=
				ITEMS_STATS['rPercentArmorPenetrationMod']
				+RUNES_STATS['rPercentArmorPenetrationMod']
				+MASTERIES_STATS['rPercentArmorPenetrationMod']
				+(
					ITEMS_STATS['rPercentArmorPenetrationModPerLevel']
					+RUNES_STATS['rPercentArmorPenetrationModPerLevel']
					+MASTERIES_STATS['rPercentArmorPenetrationModPerLevel']
				)*(CHAMPION_LEVEL);
			
			$("#arpen").html(parseFloat(TOTAL_STATS['bonus_flatarpen']).toFixed(1)+" | "+(parseFloat(TOTAL_STATS['bonus_percentarpen'])*100).toFixed(0)+"%");
			
			//Pénétration magique
			TOTAL_STATS['bonus_flatmpen']=
				ITEMS_STATS['rFlatMagicPenetrationMod']
				+RUNES_STATS['rFlatMagicPenetrationMod']
				+MASTERIES_STATS['rFlatMagicPenetrationMod']
				+(
					ITEMS_STATS['rFlatMagicPenetrationModPerLevel']
					+RUNES_STATS['rFlatMagicPenetrationModPerLevel']
					+MASTERIES_STATS['rFlatMagicPenetrationModPerLevel']
				)*(CHAMPION_LEVEL);
				
				
			TOTAL_STATS['bonus_percentmpen']=
				ITEMS_STATS['rPercentMagicPenetrationMod']
				+RUNES_STATS['rPercentMagicPenetrationMod']
				+MASTERIES_STATS['rPercentMagicPenetrationMod']
				+(
					ITEMS_STATS['rPercentMagicPenetrationModPerLevel']
					+RUNES_STATS['rPercentMagicPenetrationModPerLevel']
					+MASTERIES_STATS['rPercentMagicPenetrationModPerLevel']
				)*(CHAMPION_LEVEL);
			
			$("#mpen").html(parseFloat(TOTAL_STATS['bonus_flatmpen']).toFixed(1)+" | "+(parseFloat(TOTAL_STATS['bonus_percentmpen'])*100).toFixed(0)+"%");
			
			
			//Chances de critique
			TOTAL_STATS['bonus_critchance']=0
				+parseFloat(ITEMS_STATS['FlatCritChanceMod'])
				+parseFloat(RUNES_STATS['FlatCritChanceMod'])
				+(
					parseFloat(ITEMS_STATS['rFlatCritChanceModPerLevel'])
					+parseFloat(RUNES_STATS['rFlatCritChanceModPerLevel'])
				)*(CHAMPION_LEVEL);
			if(TOTAL_STATS['bonus_critchance']>1)TOTAL_STATS['bonus_critchance']=1;
				
			$("#ccc").html((parseFloat(TOTAL_STATS['bonus_critchance'])*100).toFixed(1)+"%");
			
				
			//Dommages critique
			TOTAL_STATS['bonus_critdamage']=0
				+parseFloat(ITEMS_STATS['FlatCritDamageMod'])
				+parseFloat(RUNES_STATS['FlatCritDamageMod'])
				+(
					parseFloat(ITEMS_STATS['rFlatCritDamageModPerLevel'])
					+parseFloat(RUNES_STATS['rFlatCritDamageModPerLevel'])
				)*(CHAMPION_LEVEL);
				
			$("#dcc").html((200+(parseFloat(TOTAL_STATS['bonus_critdamage'])*100)).toFixed(1)+"%");
			
			
			//Vol de vie
			TOTAL_STATS['bonus_lifesteal']=0
				+parseFloat(ITEMS_STATS['PercentLifeStealMod'])
				+parseFloat(RUNES_STATS['PercentLifeStealMod'])
				+parseFloat(MASTERIES_STATS['PercentLifeStealMod']);
				
			$("#lifesteal").html((parseFloat(TOTAL_STATS['bonus_lifesteal'])*100).toFixed(1)+"%");
				
			
			//Sort vampirique
			TOTAL_STATS['bonus_spellvamp']=0
				+parseFloat(ITEMS_STATS['PercentSpellVampMod'])
				+parseFloat(RUNES_STATS['PercentSpellVampMod'])
				+parseFloat(MASTERIES_STATS['PercentSpellVampMod']);
				
			$("#spellvamp").html((parseFloat(TOTAL_STATS['bonus_spellvamp'])*100).toFixed(1)+"%");
			
			
			//Réduction des délais
			TOTAL_STATS['bonus_cd']=0
				+parseFloat(ITEMS_STATS['rPercentCooldownMod'])
				+parseFloat(RUNES_STATS['rPercentCooldownMod'])
				+parseFloat(MASTERIES_STATS['rPercentCooldownMod'])
				+(
					parseFloat(ITEMS_STATS['rPercentCooldownModPerLevel'])
					+parseFloat(RUNES_STATS['rPercentCooldownModPerLevel'])
					+parseFloat(MASTERIES_STATS['rPercentCooldownModPerLevel'])
				)*(CHAMPION_LEVEL);
			if(TOTAL_STATS['bonus_cd']>0.4)TOTAL_STATS['bonus_cd']=0.4;
			
			$("#cdreduc").html((parseFloat(TOTAL_STATS['bonus_cd'])*100).toFixed(0)+"%");
			
			
			//Ténacité
			TOTAL_STATS['bonus_tenacity']=
				1-(
					(1-parseFloat(ITEMS_STATS['TenacityMod']))
					*(1-parseFloat(MASTERIES_STATS['TenacityMod']))
				);
				
			$("#tenacity").html((parseFloat(TOTAL_STATS['bonus_tenacity'])*100).toFixed(0)+"%");
			
			
			//Passif de Ashe
			TOTAL_STATS['ashepassive']=(1.1+(TOTAL_STATS['bonus_critchance']*(1+TOTAL_STATS['bonus_critdamage'])))*(parseFloat(TOTAL_STATS['base_attackdamage'])+parseFloat(TOTAL_STATS['bonus_attackdamage']));
			
			
			//Passif Azir
			if(CHAMPION_ID=="268"){
				TOTAL_STATS['bonus_attackspeed']=(
					(CHAMPION_LEVEL)
					*
					(
						parseFloat(ITEMS_STATS["rPercentAttackSpeedModPerLevel"])
						+
						parseFloat(RUNES_STATS["rPercentAttackSpeedModPerLevel"])
					)
					+
					parseFloat(ITEMS_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(RUNES_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(MASTERIES_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(parseFloat(TOTAL_STATS['bonus_cd'])*1.25)
				)
				*
				0.625/(
					1+parseFloat(CHAMPION_STATS["attackspeedoffset"])
				);
				
				if((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed']))>2.5){
					$("#attackspeed").html("2.5");
				}else{
					$("#attackspeed").html((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed'])).toFixed(3));
				}
			}
			
			//Passif Diana
			if(CHAMPION_ID=="131"){
				TOTAL_STATS['bonus_attackspeed']=(
					(CHAMPION_LEVEL)
					*
					(
						parseFloat(ITEMS_STATS["rPercentAttackSpeedModPerLevel"])
						+
						parseFloat(RUNES_STATS["rPercentAttackSpeedModPerLevel"])
					)
					+
					parseFloat(ITEMS_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(RUNES_STATS["PercentAttackSpeedMod"])
					+
					parseFloat(MASTERIES_STATS["PercentAttackSpeedMod"])
					+0.2
				)
				*
				0.625/(
					1+parseFloat(CHAMPION_STATS["attackspeedoffset"])
				);
				
				if((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed']))>2.5){
					$("#attackspeed").html("2.5");
				}else{
					$("#attackspeed").html((parseFloat(TOTAL_STATS['base_attackspeed'])+parseFloat(TOTAL_STATS['bonus_attackspeed'])).toFixed(3));
				}
			}
			
			//Passif Galio
			if(CHAMPION_ID=="3"){
			TOTAL_STATS['bonus_spelldamage']=
				ITEMS_STATS['FlatMagicDamageMod']
				+RUNES_STATS['FlatMagicDamageMod']
				+MASTERIES_STATS['FlatMagicDamageMod']
				+0.5*(TOTAL_STATS['base_spellblock']+TOTAL_STATS['bonus_spellblock'])
				+(
					ITEMS_STATS['rFlatMagicDamageModPerLevel']
					+RUNES_STATS['rFlatMagicDamageModPerLevel']
					+MASTERIES_STATS['rFlatMagicDamageModPerLevel']
				)*(CHAMPION_LEVEL);
				
				$("#spelldamage").html(parseFloat(TOTAL_STATS['bonus_spelldamage']).toFixed(0));
			}
			
			//Passif Morgana
			if(CHAMPION_ID=="25"){
				var morgana=[10,10,10,10,10,10,15,15,15,15,15,15,20,20,20,20,20,20];
				
				TOTAL_STATS['bonus_spellvamp']=0
					+parseFloat(ITEMS_STATS['PercentSpellVampMod'])
					+parseFloat(RUNES_STATS['PercentSpellVampMod'])
					+parseFloat(MASTERIES_STATS['PercentSpellVampMod'])
					+parseFloat(morgana[CHAMPION_LEVEL])/100;
					
				$("#spellvamp").html((parseFloat(TOTAL_STATS['bonus_spellvamp'])*100).toFixed(1)+"%");
			}
			
			
			//Passif Nasus
			if(CHAMPION_ID=="75"){
				var nasus=[10,10,10,10,10,10,15,15,15,15,15,15,20,20,20,20,20,20];
				
				TOTAL_STATS['bonus_lifesteal']=0
					+parseFloat(ITEMS_STATS['PercentLifeStealMod'])
					+parseFloat(RUNES_STATS['PercentLifeStealMod'])
					+parseFloat(MASTERIES_STATS['PercentLifeStealMod'])
					+parseFloat(nasus[CHAMPION_LEVEL])/100;
					
				$("#lifesteal").html((parseFloat(TOTAL_STATS['bonus_lifesteal'])*100).toFixed(1)+"%");
			}
			
			//Passif Rammus
			if(CHAMPION_ID=="33"){
				
				TOTAL_STATS['bonus_attackdamage']=
					ITEMS_STATS['FlatPhysicalDamageMod']
					+RUNES_STATS['FlatPhysicalDamageMod']
					+MASTERIES_STATS['FlatPhysicalDamageMod']
					+(
						ITEMS_STATS['rFlatPhysicalDamageModPerLevel']
						+RUNES_STATS['rFlatPhysicalDamageModPerLevel']
						+MASTERIES_STATS['rFlatPhysicalDamageModPerLevel']
					)*(CHAMPION_LEVEL)
					+0.25*(parseFloat(TOTAL_STATS['base_armor'])+parseFloat(TOTAL_STATS['bonus_armor']));
			
				$("#attackdamage").html((parseFloat(TOTAL_STATS['base_attackdamage'])+parseFloat(TOTAL_STATS['bonus_attackdamage'])).toFixed(2));
			
			}
			
			//Passif Shyvana
			if(CHAMPION_ID=="102"){
				var shyvana=[5,5,5,5,5,10,10,10,10,10,15,15,15,15,15,20,20,20];
				
				TOTAL_STATS['bonus_armor']=
					(
						ITEMS_STATS['FlatArmorMod']
						+RUNES_STATS['FlatArmorMod']
						+RUNES_STATS['rFlatArmorModPerLevel']*(CHAMPION_LEVEL)
					)*(
						1
						+MASTERIES_STATS['rPercentBonusArmorMod']
					)
					+parseFloat(shyvana[CHAMPION_LEVEL]);
				
				$("#armor").html((parseFloat(TOTAL_STATS['base_armor'])+parseFloat(TOTAL_STATS['bonus_armor'])).toFixed(2));
				console:
				TOTAL_STATS['bonus_spellblock']=
					(
						ITEMS_STATS['FlatSpellBlockMod']
						+RUNES_STATS['FlatSpellBlockMod']
						+MASTERIES_STATS['FlatSpellBlockMod']
						+(
							ITEMS_STATS['rFlatSpellBlockModPerLevel']
							+RUNES_STATS['rFlatSpellBlockModPerLevel']
							+MASTERIES_STATS['rFlatSpellBlockModPerLevel']
						)*(CHAMPION_LEVEL)
					)*(
						1
						+MASTERIES_STATS['rPercentBonusSpellBlockMod']
					)
					+parseFloat(shyvana[CHAMPION_LEVEL]);
					
				$("#spellblock").html((parseFloat(TOTAL_STATS['base_spellblock'])+parseFloat(TOTAL_STATS['bonus_spellblock'])).toFixed(2));
			}
			
			//Passif Singed
			if(CHAMPION_ID=="27"){
					
				TOTAL_STATS['bonus_hp']=
					(
						ITEMS_STATS['FlatHPPoolMod']
						+RUNES_STATS['FlatHPPoolMod']
						+MASTERIES_STATS['FlatHPPoolMod']
						+(
							ITEMS_STATS['rFlatHPModPerLevel']
							+RUNES_STATS['rFlatHPModPerLevel']
						)*(CHAMPION_LEVEL)
						+0.25*(parseFloat(TOTAL_STATS['base_mp'])+parseFloat(TOTAL_STATS['bonus_mp']))
					)*(
						1
						+ITEMS_STATS['PercentHPPoolMod']
						+RUNES_STATS['PercentHPPoolMod']
						+MASTERIES_STATS['PercentHPPoolMod']
					);
					
				$("#hp").html((parseFloat(TOTAL_STATS['base_hp'])+parseFloat(TOTAL_STATS['bonus_hp'])).toFixed(0));
			}
			
			//Passif Tristana
			if(CHAMPION_ID=="18"){
				var tristana=[0,7,14,21,28,35,42,49,56,63,70,77,84,91,98,105,112,119];
				
				TOTAL_STATS['bonus_attackrange']=tristana[CHAMPION_LEVEL];
				
				
				$("#attackrange").html((parseFloat(TOTAL_STATS['base_attackrange'])+parseFloat(TOTAL_STATS['bonus_attackrange'])));
			}
			
			
			
			$(".partype").html(CHAMPION_STATS["partype"]);
			
			Canis.LoL.TheoryCrafter.Champions.updateRatios();
		}
	}
	this.updateStats=updateStats;
	
	function growthFormula(coeff){
		return coeff*((7/400)*((CHAMPION_LEVEL+1)*(CHAMPION_LEVEL+1)-1)+(267/400)*((CHAMPION_LEVEL+1)-1));
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
};
