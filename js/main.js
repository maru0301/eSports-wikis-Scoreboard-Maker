////////////////////////////////////////////////////////////////////////////////////
// Global

///////////////////////////////////////
var JSON_DATA_CHAMP_IMG = new Array();
var JSON_DATA_TEAM = {};
var JSON_DATA_SUMMONER_SPELL = new Array();
var JSON_DATA_ITEM = new Array();
var JSON_DATA_MASTERY_IMG = new Array();

var MATCH_HISTORY_JSON = {};

var VER_CHAMPION = "";
var VER_SN_SPELLS = "";
var VER_ITEM = "";
var VER_MASTERY = "";

var CDN_URL = "";

////////////////////////////////////////////////////////////////////////////////////
// Error Message
var ERROR_ID_VERSION_GET_ERROR 		= "バージョン情報が取得出来ませんでした";
var ERROR_ID_CHAMPION_IMG_GET_ERROR 	= "チャンピオンイメージ情報が取得出来ませんでした";
var ERROR_ID_SUMMONER_SPELL_GET_ERROR 	= "チーム情報が取得出来ませんでした";
var ERROR_ID_ITEM_IMG_GET_ERROR 	= "アイテムイメージ情報が取得出来ませんでした";
var ERROR_ID_TEAM_GET_ERROR 		= "チーム情報が取得出来ませんでした";
var ERROR_ID_MASTERY_IMG_GET_ERROR 	= "マスタリーイメージ情報が取得出来ませんでした";

/////////////////////////////////////////////////
//

function errorDlg(msg)
{
	window.alert("エラー:" + msg);
}

////////////////////////////////////////////////////////////////////////////////////
//
var request = [
	{ error_id: ERROR_ID_VERSION_GET_ERROR,			url: './php/main.php', data: { func:"GetVersion" },  }, // Version
	{ error_id: ERROR_ID_CHAMPION_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetChampionImage" },  },
	{ error_id: ERROR_ID_SUMMONER_SPELL_GET_ERROR,	url: './php/main.php', data: { func:"GetSummonerSpells" },  },
	{ error_id: ERROR_ID_ITEM_IMG_GET_ERROR,		url: './php/main.php', data: { func:"GetItem" },  },
	{ error_id: ERROR_ID_TEAM_GET_ERROR,			url: './json/team.json', data: {},  },
	{ error_id: ERROR_ID_MASTERY_IMG_GET_ERROR,		url: './php/main.php', data: { func:"GetMasteryImage"},  },
];

var jqXHRList = [];

for( var i = 0, max = request.length ; i < max ; ++i )
{
	jqXHRList.push($.ajax(
	{
		url: request[i].url,
		type: 'GET',
		dataType: 'json',
		data: request[i].data,
	}));
}

$.when.apply(null, jqXHRList).done(function ()
{
	var json = [];
	var statuses = [];
	var jqXHRResultList = [];
	
	for( var i = 0, max = arguments.length ; i < max ; ++i )
	{
		var result = arguments[i];
		json.push(result[0]);
		statuses.push(result[1]);
		jqXHRResultList.push(result[3]);
	}
	
	///////////////////////////////////////////////////////////
	// Global情報取得
	///////////////////////////////////////////////////////////
	var verJson = json[0];
	var champImgJson = json[1];
	var spellJson = json[2];
	var itemImgJson = json[3];
	var masteryImgJson = json[5];
	
	JSON_DATA_TEAM = json[4];
	
	// ソート
	for(var key in champImgJson.data)
		JSON_DATA_CHAMP_IMG.push(champImgJson.data[key]);
	
	JSON_DATA_CHAMP_IMG.sort(function(a, b)
		{
			if(a.key < b.key) return -1;
			if(a.key > b.key) return 1;
			if(a.key == b.key) return 0;
		}
	);
	
	for(var key in itemImgJson.data)
		JSON_DATA_ITEM[key] = itemImgJson.data[key];
	
	for(var key in spellJson.data)
	{
		var id = spellJson.data[key].id;
		JSON_DATA_SUMMONER_SPELL[id] = spellJson.data[key];
	}

	JSON_DATA_SUMMONER_SPELL.sort(function(a, b)
		{
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			if(a.name == b.name) return 0;
		}
	);
	
	for(var key in masteryImgJson.data)
	{
		JSON_DATA_MASTERY_IMG[key] = masteryImgJson.data[key];
	}
	JSON_DATA_MASTERY_IMG.tree = masteryImgJson.tree;
	
	JSON_DATA_MASTERY_IMG.sort(function(a, b)
		{
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			if(a.name == b.name) return 0;
		}
	);
	
	// Version
	VER_CHAMPION = verJson.n.champion;
	VER_SN_SPELLS = verJson.n.summoner;
	VER_ITEM = verJson.n.item;
	VER_MASTERY = verJson.n.mastery;
	
	CDN_URL = verJson.cdn;
	
	InitBanPick();
});

$.when.apply(null, jqXHRList).fail(function ()
{
	for( var i = 0 ; i < jqXHRList.length ; ++i )
	{
		if( jqXHRList[i].statusText === "error" )
		{
			errorDlg(request[i].error_id);
		}
	}
});

////////////////////////////////////////////////////////////////////////////////////

function InitBanPick()
{
	ReworkJson();
	
	// Region
	SetRegionForm();
	
	// Blue
	SetTeamForm($('#region_form').val(), "blue");
	SetSelected("select#blue_team_form", 0);
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		// Ban
		SetChampionForm(JSON_DATA_CHAMP_IMG, "blue_ban_" + i, "blue_ban_" + i + "_champion_form");
		ShowChampionIcon($('select#blue_ban_' + i + '_champion_form').val(), "blue_ban_" + i);
		// Champion
		SetChampionForm(JSON_DATA_CHAMP_IMG, "blue_" + i, "blue_" + i + "_champion_form");
		ShowChampionIcon($('select#blue_' + i + '_champion_form').val(), "blue_" + i);
		// Player
		SetPlayerForm(JSON_DATA_TEAM, $('#region_form').val(), $('#blue_team_form').val(),  "blue_player_" + i, "blue_" + i + "_player_form");
		// Spell
		for( var j = 1 ; j <= 2 ; ++ j )
		{
			SetSummonerSpellForm(JSON_DATA_SUMMONER_SPELL, "blue_" + i, "blue_" + i + "_summoner_spell_form_" + j, j);
			ShowSpellIcon(JSON_DATA_SUMMONER_SPELL,  $('select#blue_'+ i + '_summoner_spell_form_1').val(), "blue_" + i, "blue_" + i + "_summoner_spell_" + j);
		}
		// Mastery
		SetMasteryForm(JSON_DATA_MASTERY_IMG, "blue_" + i, "blue_" + i + "_mastery_form");
		ShowMasteryIcon(JSON_DATA_MASTERY_IMG, $('select#blue_'+ i + '_mastery_form').val(), "blue_" + i, "blue_" + i + "_mastery");
		// Item
		for( var j = 1 ; j <= 6 ; ++j )
		{
			SetItemForm(JSON_DATA_ITEM, "blue_" + i, "blue_" + i + "_item_form_"+ j, j);
			ShowItemIcon(JSON_DATA_ITEM, $('select#blue_'+ i + '_item_form_' + j).val(), "blue_" + i, "blue_" + i + "_item_" + j);
		}
		// Trinket
		SetTrinketForm(JSON_DATA_ITEM, "blue_" + i, "blue_" + i + "_trinket_form");
		ShowItemIcon(JSON_DATA_ITEM, $('select#blue_'+ i + '_trinket_form').val(), "blue_" + i, "blue_" + i + "_trinket");
	}
	
	// Red
	SetTeamForm($('#region_form').val(), "red");
	SetSelected("select#red_team_form", 1);
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		// Ban
		SetChampionForm(JSON_DATA_CHAMP_IMG, "red_ban_" + i, "red_ban_" + i + "_champion_form");
		ShowChampionIcon($('select#red_ban_' + i + '_champion_form').val(), "red_ban_" + i);
		// Champion
		SetChampionForm(JSON_DATA_CHAMP_IMG, "red_" + i, "red_" + i + "_champion_form");
		ShowChampionIcon($('select#red_' + i + '_champion_form').val(), "red_" + i);
		// Player
		SetPlayerForm(JSON_DATA_TEAM, $('#region_form').val(), $('#red_team_form').val(),  "red_player_" + i, "red_" + i + "_player_form");
		// Spell
		for( var j = 1 ; j <= 2 ; ++ j )
		{
			SetSummonerSpellForm(JSON_DATA_SUMMONER_SPELL, "red_" + i, "red_" + i + "_summoner_spell_form_" + j, j);
			ShowSpellIcon(JSON_DATA_SUMMONER_SPELL,  $('select#red_'+ i + '_summoner_spell_form_1').val(), "red_" + i, "red_" + i + "_summoner_spell_" + j);
		}
		// Mastery
		SetMasteryForm(JSON_DATA_MASTERY_IMG, "red_" + i, "red_" + i + "_mastery_form");
		ShowMasteryIcon(JSON_DATA_MASTERY_IMG, $('select#red_'+ i + '_mastery_form').val(), "red_" + i, "red_" + i + "_mastery");
		// Item
		for( var j = 1 ; j <= 6 ; ++j )
		{
			SetItemForm(JSON_DATA_ITEM, "red_" + i, "red_" + i + "_item_form_"+ j, j);
			ShowItemIcon(JSON_DATA_ITEM, $('select#blue_'+ i + '_item_form_' + j).val(), "red_" + i, "red_" + i + "_item_" + j);
		}
		// Trinket
		SetTrinketForm(JSON_DATA_ITEM, "red_" + i, "red_" + i + "_trinket_form");
		ShowItemIcon(JSON_DATA_ITEM, $('select#red_'+ i + '_trinket_form').val(), "red_" + i, "red_" + i + "_trinket");
	}
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		SetSelected("select#blue_" + i + "_player_form", (i-1));
		SetSelected("select#red_" + i + "_player_form", (i-1));
	}
}

function ReworkJson()
{
	// 不要なデータ削除
	
	var del_item_id = [
		// Golden Transcendence(Disable)
		3461,
		// Head of Kha'Zix
		3175,
		3410,
		3416,
		3422,
		3455,
		// Arcane Sweeper
		3187,
		3348,
		// Death's Daughter
		//3902,
		// Enchantment
		3671,
		3672,
		3673,
		3675,
		// Muramana
		3043,
		// Overlord's Bloodmail
		3084,
		// undefined
		3632,
		// Rod of Ages (Quick Charge)
		3029,
		// Seer Stone (Trinket)
		3645,
		// Seraph's Embrace
		3040,
		// Siege Teleport
		3633,
		3648,
		// Tear of the Goddess (Quick Charge)
		3073,
		// Total Biscuit of Rejuvenation
		2010,
	];
	// Item
	JSON_DATA_ITEM = JSON_DATA_ITEM.filter(function(v){
		var isAlive = true;
		
		for( var i = 0 ; i < del_item_id.length ; ++i )
		{
			if( del_item_id[i] == v.id )
			{
				isAlive = false;
				break;
			}
		}
		
		return isAlive;
	});
	
	// Mestery
	var mastery_id = new Array();
	
	for( var key in JSON_DATA_MASTERY_IMG.tree )
	{
		var list = JSON_DATA_MASTERY_IMG.tree[key].pop().masteryTreeItems;
		for( var i in list )
			mastery_id.push(list[i].masteryId);
	}
	
	JSON_DATA_MASTERY_IMG = JSON_DATA_MASTERY_IMG.filter(function(v)
	{
		var isAlive = true;
		
		if( $.inArray( v.id, mastery_id ) < 0 )
			isAlive = false;
		
		return isAlive;
	});
	
	// Enchantment系のアイテム名をリネーム
	for( var key in JSON_DATA_ITEM )
	{
		if( JSON_DATA_ITEM[key].name.indexOf("Enchantment") != -1 )
		{
			var base = "";
			var enchant = "";
			
			if( $.inArray( "3711", JSON_DATA_ITEM[key].from ) >= 0)
			{
				base = "Tracker's Knife";
			}
			else if( $.inArray( "3715", JSON_DATA_ITEM[key].from ) >= 0)
			{
				base = "Skirmisher's Sabre";
			}
			else if( $.inArray( "3706", JSON_DATA_ITEM[key].from ) >= 0)
			{
				base = "Stalker's Blade";
			}
			
			if( JSON_DATA_ITEM[key].name.indexOf("Warrior") != -1 )
			{
				enchant = "Warrior";
			}
			else if( JSON_DATA_ITEM[key].name.indexOf("Cinderhulk") != -1 )
			{
				enchant = "Cinderhulk";
			}
			else if( JSON_DATA_ITEM[key].name.indexOf("Runic Echoes") != -1 )
			{
				enchant = "Runic Echoes";
			}
			else if( JSON_DATA_ITEM[key].name.indexOf("Bloodrazor") != -1 )
			{
				enchant = "Bloodrazor";
			}
			
			JSON_DATA_ITEM[key].name = base + " - " + enchant;
		}
		
		if( $.inArray( "Trinket", JSON_DATA_ITEM[key].tags ) >= 0 )
			JSON_DATA_ITEM[key].name = JSON_DATA_ITEM[key].name.replace(/ \(Trinket\)/g, "" );
	}
	
	JSON_DATA_ITEM.sort(function(a, b)
		{
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			if(a.name == b.name) return 0;
		}
	);
	
	// ItemJson先頭に未選択データ追加
	JSON_DATA_ITEM.unshift({ id : -1, name : "None", tags : "Dummy"} );
}

////////////////////////////////////////////////////////////////////////////////////

function SetRegionForm()
{
	var target = document.getElementById("region");
	var newTag;
	
	newTag = document.createElement("span");
	
	var tag = new Array();
	
	tag.push("<select id='region_form' onChange='ChangeRegionFrom()'>");
	
	for( var key in JSON_DATA_TEAM )
	{
		tag.push("<option value='" + key + "' >" + key + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetTeamForm(region, getName)
{
	var name = getName + "_team";
	var target = document.getElementById(name);
	var newTag;
	
	$("#" + name).children().remove();
	
	newTag = document.createElement("span");
	
	var tag = new Array();
	
	tag.push("<select id='" + name + "_form' onChange='ChangeTeamForm(&quot;" + getName + "&quot;)'>");
	
	for( var key in JSON_DATA_TEAM[region] )
	{
		tag.push("<option value='" + JSON_DATA_TEAM[region][key].code + "' >" + key + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetChampionForm(data, getName, createName, index)
{
	var target = document.getElementById(getName);
	var newTag;
	
	if( document.getElementById(createName) == null )
	{
		newTag = document.createElement(createName);
		newTag.id = createName;
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(createName);
	
	newTag = document.createElement("champion_form");
	
	var tag = new Array();
	
	tag.push("<select id='" + createName + "' onChange='ChangeChampionForm(&quot;" + getName + "&quot;)'>");
	
	for( var i = 0 ; i < data.length ; ++i )
	{
		if( i == 0 )
		{
			tag.push("<option value='" + i + "' selected>" + data[i].key + "</option>");
		}
		else
		{
			tag.push("<option value='" + i + "'>" + data[i].key + "</option>");
		}
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetPlayerForm(data, region, team, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	$("#"+ createName).children().remove();
	
	if( document.getElementById(createName) == null )
	{
		newTag = document.createElement(createName);
		newTag.id = createName;
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(createName);
	
	newTag = document.createElement("player_form");
	
	var tag = new Array();
	
	tag.push(" <select id='" + createName + "'>");
	
	for( var key in JSON_DATA_TEAM[region] )
	{
		if( JSON_DATA_TEAM[region][key].code == team )
		{
			for( var j = 0 ; j < data[region][key].player.length ; ++j )
				tag.push("<option value='" + data[region][key].player[j] + "' >" + data[region][key].player[j] + "</option>");
		}
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetSummonerSpellForm(data, getName, createName, index)
{
	var target = document.getElementById(getName);
	var newTag;
	
	newTag = document.createElement("summoner_spell_form");
	
	var tag = new Array();
	
	tag.push(" <select id='" + createName + "' onChange='ChangeSummonerSpellForm(&quot;" + createName + "&quot;" + ", &quot;" + getName + "&quot;, " + index + ")'>");
	
	for( var key in data )
	{
		tag.push("<option value='" + key + "' >" + data[key].name + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetItemForm(data, getName, createName, index)
{
	var target = document.getElementById(getName);
	var newTag;
	
	newTag = document.createElement("item_form");
	
	var tag = new Array();
	
	if( index == 4 )
		tag.push("<br />");
	
	tag.push("<select id='" + createName + "' onChange='ChangeItemForm(&quot;" + createName + "&quot;" + ", &quot;" + getName + "&quot;, " + index + ")'>");
	
	for( var key in data )
	{
		tag.push("<option value='" + data[key].id + "' >" + data[key].name + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetTrinketForm(data, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	newTag = document.createElement("trinket_form");
	
	var tag = new Array();
	
	tag.push("<br /><select id='" + createName + "' onChange='ChangeTrinketForm(&quot;" + createName + "&quot;" + ", &quot;" + getName + "&quot;)'>");
	
	for( var key in data )
	{
		if( $.inArray( "Trinket", data[key].tags ) >= 0 )
			tag.push("<option value='" + data[key].id + "' >" + data[key].name + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

function SetMasteryForm(data, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	newTag = document.createElement("mastery_form");
	
	var tag = new Array();
	
	tag.push(" <select id='" + createName + "' onChange='ChangeMasteryForm(&quot;" + createName + "&quot;" + ", &quot;" + getName + "&quot;)'>");
	
	for( var key in data )
	{
		tag.push("<option value='" + data[key].id + "' >" + data[key].name + "</option>");
	}
	
	tag.push("</select>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

////////////////////////////////////////////////////////////////////////////////////

function ShowChampionIcon(index, getName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	$("#" + getName).children(getName + "_champion_img").children().remove();
	
	if( document.getElementById(getName + "_champion_img") == null )
	{
		newTag = document.createElement(getName + "_champion_img");
		newTag.id = getName + "_champion_img";
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(getName + "_champion_img");
	
	newTag = document.createElement("champion_img");
	
	var champ_img = JSON_DATA_CHAMP_IMG[index].image.full;
	var champ_name = JSON_DATA_CHAMP_IMG[index].name;
	
	newTag.innerHTML = "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='20' height='20' title='" + champ_name +"' class='example3'>";
	
	target.appendChild(newTag);
}

function ShowSpellIcon(data, key, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	$("#" + getName).children(createName + "_img").children().remove();
	
	if( document.getElementById(createName + "_img") == null )
	{
		newTag = document.createElement(createName + "_img");
		newTag.id = createName + "_img";
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(createName + "_img");
	
	newTag = document.createElement("summoner_spell_img");
	
	for( var i in data )
	{
		if( i == key )
		{
			var spell1_img = data[i].image.full;
			var spell1_name = data[i].name;
			
			newTag.innerHTML = "<img src='" + CDN_URL + "/" + VER_SN_SPELLS + "/img/spell/" + spell1_img + "' width='20' height='20' title='" + spell1_name +"' class='example3'>";
		}
	}
	
	target.appendChild(newTag);
}

function ShowItemIcon(data, key, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	$("#" + getName).children(createName + "_img").children().remove();
	
	if( document.getElementById(createName + "_img") == null )
	{
		newTag = document.createElement(createName + "_img");
		newTag.id = createName + "_img";
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(createName + "_img");
	
	newTag = document.createElement("summoner_spell_img");
	
	for( var i in data )
	{
		if( data[i].id == key )
		{
			if( key != -1 )
			{
				var item_img = data[i].image.full;
				var item_name = data[i].name;
				
				newTag.innerHTML = "<img src='" + CDN_URL + "/" + VER_ITEM + "/img/item/" + item_img + "' width='20' height='20' title='" + item_name +"' class='example3'> ";
			}
			else
			{
				// idが-1はNone
				newTag.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
			}
		}
	}
	
	target.appendChild(newTag);
}

function ShowMasteryIcon(data, key, getName, createName)
{
	var target = document.getElementById(getName);
	var newTag;
	
	$("#" + getName).children(createName + "_img").children().remove();
	
	if( document.getElementById(createName + "_img") == null )
	{
		newTag = document.createElement(createName + "_img");
		newTag.id = createName + "_img";
		
		target.appendChild(newTag);
	}
	
	target = document.getElementById(createName + "_img");
	
	newTag = document.createElement("mastery_img");
	
	for( var i in data )
	{
		if( data[i].id == key )
		{
			var mastery_img = data[i].image.full;
			var mastery_name = data[i].name;
			
			newTag.innerHTML = "<img src='" + CDN_URL + "/" + VER_MASTERY + "/img/mastery/" + mastery_img + "' width='20' height='20' title='" + mastery_name +"' class='example3'><br />";
		}
	}
	
	target.appendChild(newTag);
}

////////////////////////////////////////////////////////////////////////////////////

function ChangeRegionFrom()
{
	SetTeamForm($('#region_form').val(), "blue");
	SetTeamForm($('#region_form').val(), "red");
	
	ChangeTeamForm("blue");
	ChangeTeamForm("red");
}

function ChangeTeamForm(side)
{
	for( var i = 1 ; i <= 5 ; i++ )
	{
		SetPlayerForm(JSON_DATA_TEAM, $('select#region_form').val(), $("select#" + side + "_team_form").val(),  side + "_" + i, side + "_" + i + "_player_form");
	}
}

function ChangeChampionForm(name)
{
	ShowChampionIcon($("select#" + name + "_champion_form").val(), name);
}

function ChangeSummonerSpellForm(form_name, parentName, index)
{
	ShowSpellIcon(JSON_DATA_SUMMONER_SPELL,  $("select#" + form_name).val(), parentName, parentName + "_summoner_spell_" + index);
}

function ChangeItemForm(form_name, parentName, index)
{
	ShowItemIcon(JSON_DATA_ITEM, $("select#" + form_name).val(), parentName, parentName + "_item_" + index);
}

function ChangeTrinketForm(form_name, parentName)
{
	ShowItemIcon(JSON_DATA_ITEM, $("select#" + form_name).val(), parentName, parentName + "_trinket");
}

function ChangeMasteryForm(form_name, parentName)
{
	ShowMasteryIcon(JSON_DATA_MASTERY_IMG, $("select#" + form_name).val(), parentName, parentName + "_mastery");
}

////////////////////////////////////////////////////////////////////////////////////

function GetItemMasteryName(data,id)
{
	var name = " ";
	
	if(id <= -1)
		return name;
	
	for( var key in data )
	{
		if( data[key].id == id )
		{
			name = data[key].name;
			break;
		}
	}
	
	return name;
}

function SetSelected(name, index)
{
	var obj = $(name);
	obj[0].options[index].selected = true;
}

////////////////////////////////////////////////////////////////////////////////////

function GetWikisCode()
{
	var target = document.getElementById("code");
	var newTag;
	
	$("#code").children().remove();
	
	newTag = document.createElement("span");
	
	var game_name = $('#game_name').val();
	var patch = $('#patch').val();
	var tournament_name = $('#tournament_name').val();
	var date = $('#date').val();
	var time_zone = $('#time_zone').val();
	var time = $('#time').val();
	var dst = $("#dst").prop('checked') ? "yes" : "no";
	
	var game_time = $('#game_time').val();
	var blue_score = $('#blue_score').val();
	var red_score = $('#red_score').val();
	var win_team = blue_score > red_score ? 1 : 2;
	var vodlink = $('#vodlink').val();
	
	var blue_team = $('#blue_team_form').val();
	var blue_total_gold = $('#blue_total_gold').val();
	var blue_total_kill = $('#blue_total_kill').val();
	var blue_total_tower = $('#blue_total_tower').val();
	var blue_total_dragon = $('#blue_total_dragon').val();
	var blue_total_baron = $('#blue_total_baron').val();
	var blue_ban = new Array();
	var blue_pick = new Array();
	var blue_player_name = new Array();
	var blue_player_kill = new Array();
	var blue_player_death = new Array();
	var blue_player_assist = new Array();
	var blue_player_gold = new Array();
	var blue_player_cs = new Array();
	var blue_player_spell1 = new Array();
	var blue_player_spell2 = new Array();
	var blue_player_mastery = new Array();
	var blue_player_item1 = new Array();
	var blue_player_item2 = new Array();
	var blue_player_item3 = new Array();
	var blue_player_item4 = new Array();
	var blue_player_item5 = new Array();
	var blue_player_item6 = new Array();
	var blue_player_trinket = new Array();
	
	var red_team = $('#red_team_form').val();
	var red_total_gold = $('#red_total_gold').val();
	var red_total_kill = $('#red_total_kill').val();
	var red_total_tower = $('#red_total_tower').val();
	var red_total_dragon = $('#red_total_dragon').val();
	var red_total_baron = $('#red_total_baron').val();
	var red_ban = new Array();
	var red_pick = new Array();
	var red_player_name = new Array();
	var red_player_kill = new Array();
	var red_player_death = new Array();
	var red_player_assist = new Array();
	var red_player_gold = new Array();
	var red_player_cs = new Array();
	var red_player_spell1 = new Array();
	var red_player_spell2 = new Array();
	var red_player_mastery = new Array();
	var red_player_item1 = new Array();
	var red_player_item2 = new Array();
	var red_player_item3 = new Array();
	var red_player_item4 = new Array();
	var red_player_item5 = new Array();
	var red_player_item6 = new Array();
	var red_player_trinket = new Array();
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		// Blue
		var blue_ban_index = $("select#blue_ban_" + i + "_champion_form").val();
		var blue_pick_index = $("select#blue_" + i + "_champion_form").val();
		
		blue_ban.push(JSON_DATA_CHAMP_IMG[blue_ban_index].key.toLowerCase());
		blue_pick.push(JSON_DATA_CHAMP_IMG[blue_pick_index].key.toLowerCase());
		blue_player_name.push($("select#blue_" + i + "_player_form" ).val());
		blue_player_kill.push($("#blue_player" + i + "_kill").val());
		blue_player_death.push($("#blue_player" + i + "_death").val());
		blue_player_assist.push($("#blue_player" + i + "_assist").val());
		blue_player_gold.push($("#blue_player" + i + "_gold").val());
		blue_player_cs.push($("#blue_player" + i + "_cs").val());
		blue_player_spell1.push(JSON_DATA_SUMMONER_SPELL[$("#blue_" + i + "_summoner_spell_form_1").val()].name);
		blue_player_spell2.push(JSON_DATA_SUMMONER_SPELL[$("#blue_" + i + "_summoner_spell_form_2").val()].name);
		blue_player_mastery.push(GetItemMasteryName(JSON_DATA_MASTERY_IMG, $("select#blue_" + i + "_mastery_form").val()))
		blue_player_item1.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_1").val()));
		blue_player_item2.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_2").val()));
		blue_player_item3.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_3").val()));
		blue_player_item4.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_4").val()));
		blue_player_item5.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_5").val()));
		blue_player_item6.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_item_form_6").val()));
		blue_player_trinket.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#blue_" + i + "_trinket_form").val()));
		
		// Red
		var red_ban_index = $("select#red_ban_" + i + "_champion_form").val();
		var red_pick_index = $("select#red_" + i + "_champion_form").val();
		
		red_ban.push(JSON_DATA_CHAMP_IMG[red_ban_index].key.toLowerCase());
		red_pick.push(JSON_DATA_CHAMP_IMG[red_pick_index].key.toLowerCase());
		red_player_name.push($("select#red_" + i + "_player_form" ).val());
		red_player_kill.push($("#red_player" + i + "_kill").val());
		red_player_death.push($("#red_player" + i + "_death").val());
		red_player_assist.push($("#red_player" + i + "_assist").val());
		red_player_gold.push($("#red_player" + i + "_gold").val());
		red_player_cs.push($("#red_player" + i + "_cs").val());
		red_player_spell1.push(JSON_DATA_SUMMONER_SPELL[$("#red_" + i + "_summoner_spell_form_1").val()].name);
		red_player_spell2.push(JSON_DATA_SUMMONER_SPELL[$("#red_" + i + "_summoner_spell_form_2").val()].name);
		red_player_mastery.push(GetItemMasteryName(JSON_DATA_MASTERY_IMG, $("select#red_" + i + "_mastery_form").val()))
		red_player_item1.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_1").val()));
		red_player_item2.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_2").val()));
		red_player_item3.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_3").val()));
		red_player_item4.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_4").val()));
		red_player_item5.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_5").val()));
		red_player_item6.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_item_form_6").val()));
		red_player_trinket.push(GetItemMasteryName(JSON_DATA_ITEM, $("select#red_" + i + "_trinket_form").val()));
	}
	
	var tag = new Array();
	
	tag.push("<br>");
	tag.push("{{BlockBox|Start}}" + "<br>");
	tag.push("{{MatchRecapS7/Header|" + blue_team + " |" + red_team + "}}" + "<br>");
	tag.push("{{MatchRecapS7|gamename=" + game_name + " |patch=" + patch + " |team1=" + blue_team + " |team2=" + red_team + " |team1score=" + blue_score + " |team2score=" + red_score + " |winner=" + win_team + "<br>");
	tag.push("|team1ban1=" + blue_ban[0] + " |team1ban2=" + blue_ban[1] + " |team1ban3=" + blue_ban[2] + " |team1ban4=" + blue_ban[3] + " |team1ban5=" + blue_ban[4] + "<br>");
	tag.push("|team2ban1=" + red_ban[0] + " |team2ban2=" + red_ban[1] + " |team2ban3=" + red_ban[2] + " |team2ban4=" + red_ban[3] + " |team2ban5=" + red_ban[4] + "<br>");
	tag.push("|date=" + date + " |dst=" + dst + " |" + time_zone + "=" + time + " |gamelength=" + game_time + " |tournament=" + tournament_name + "<br>");
	tag.push("|team1g=" + blue_total_gold + " |team1k=" + blue_total_kill + " |team1d="+ blue_total_dragon + " |team1b=" + blue_total_baron + " |team1t=" + blue_total_tower + "<br>");
	tag.push("|team2g=" + red_total_gold + " |team2k=" + red_total_kill + " |team2d=" + red_total_dragon + " |team2b=" + red_total_baron + " |team2t=" + red_total_tower + "<br>");
	tag.push("|team1rh=  |team2rh=  |team1i=  |team2i= " + "<br>");
	tag.push("<br>");
	
	// Blue
	for( var i = 1, j = 0 ; i <= 5 ; ++i, ++j )
	{
		tag.push("|blue" + i + "={{MatchRecapS7/Player|champion=" + blue_pick[j] + " |name=" + blue_player_name[j] + " |kills=" + blue_player_kill[j] + " |deaths=" + blue_player_death[j] + " |assists=" + blue_player_assist[j] + " |gold=" + blue_player_gold[j] + " |cs=" + blue_player_cs[j] + " |summonerspell1=" + blue_player_spell1[j] + " |summonerspell2=" + blue_player_spell2[j] + "<br>");
		tag.push("|item1=" + blue_player_item1[j] + " |item2=" + blue_player_item2[j] + " |item3=" + blue_player_item3[j] + " |item4=" + blue_player_item4[j] + " |item5=" + blue_player_item5[j] + " |item6=" + blue_player_item6[j] + " |trinket=" + blue_player_trinket[j] + " |keystone=" + blue_player_mastery[j] + " }}" + "<br>");
	}
	
	tag.push("<br>");
	
	// Red
	for( var i = 1, j = 0 ; i <= 5 ; ++i, ++j )
	{
		tag.push("|red" + i + "={{MatchRecapS7/Player|champion=" + red_pick[j] + " |name=" + red_player_name[j] + " |kills=" + red_player_kill[j] + " |deaths=" + red_player_death[j] + " |assists=" + red_player_assist[j] + " |gold=" + red_player_gold[j] + " |cs=" + red_player_cs[j] + " |summonerspell1=" + red_player_spell1[j] + " |summonerspell2=" + red_player_spell2[j] + "<br>");
		tag.push("|item1=" + red_player_item1[j] + " |item2=" + red_player_item2[j] + " |item3=" + red_player_item3[j] + " |item4=" + red_player_item4[j] + " |item5=" + red_player_item5[j] + " |item6=" + red_player_item6[j] + " |trinket=" + red_player_trinket[j] + " |keystone=" + red_player_mastery[j] + " }}" + "<br>");
	}
	
	tag.push("<br>");
	
	tag.push("|vodlink=" + vodlink + " |statslink=  |picksandbanspage=  }}" + "<br>");
	tag.push("{{BlockBox|end}}" + "<br>");
	tag.push("<br>");
	
	newTag.innerHTML = tag.join("");
	
	target.appendChild(newTag);
}

////////////////////////////////////////////////////////////////////////////////////

function GetMatchDetailData(url)
{
	if(url !== "")
	{
		var index = url.search("#");
		url = url.substr(index);
		index = url.search("/");
		url = url.substr(index+1);
		index = url.search("/");

		var gameRealm = url.substr(0, index);

		url = url.substr(index+1);
		index = url.search('[\?]');

		var gameId = url.substr(0, index);

		url = url.substr(index+1);
		index = url.search('=');
		url = url.substr(index+1);
		index = url.search('&');
		
		if( index != -1)
			url = url.substr(0, index);
		
		var gameHash = url;

		url_path = "https://acs.leagueoflegends.com/v1/stats/game/" + gameRealm + "/" + gameId + "?gameHash=" + gameHash;

		$.ajax(
		{
			url: url_path,
			type: 'GET',
			dataType: 'json',
			scriptCharset: 'utf-8',
			
			success: function (data)
			{
				console.log("GetURL : Success");
				console.log(data);

				MATCH_HISTORY_JSON.game = {};

				MATCH_HISTORY_JSON.game = GetMatchData(data);
				MATCH_HISTORY_JSON.teams = [];
				MATCH_HISTORY_JSON.teams = GetTeamData(data);

				ReflectData(MATCH_HISTORY_JSON);

				console.log(MATCH_HISTORY_JSON);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown)
			{
				console.log("GetURL : Fail");
				console.log(XMLHttpRequest.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
}

function GetMatchData(data)
{
	var set_data = {};

	set_data.gameVer = data.gameVersion;
	
	return set_data;
}

function GetTeamData(data)
{
	var set_data = [];

	for( var i = 0 ; i < 2 ; ++i )
	{
		set_data[i] = {};
		set_data[i] = SetTeamDataCommon(data.teams[i]);
		set_data[i].player = [];
		set_data[i].player = GetPlayerData(data, set_data[i].teamId);

		set_data[i].kill = 0;
		set_data[i].gold = 0;
		
		for( var j = 0 ; j < set_data[i].player.length ; ++j )
		{
			set_data[i].kill += set_data[i].player[j].kill;
			set_data[i].gold += set_data[i].player[j].gold;
		}

		var tag = set_data[i].player[0].name;
		var index = tag.search(" ");
		tag = tag.substr(0, index);

		set_data[i].team_name = tag;
	}

	return set_data;
}

function SetTeamDataCommon(data)
{
	var set_data = {};

	set_data.tower = data.towerKills;
	set_data.dragon = data.dragonKills;
	set_data.baron = data.baronKills;
	set_data.rift_herald = data.riftHeraldKills;
	set_data.inhibitor = data.inhibitorKills;
	set_data.ban = data.bans;
	set_data.win = data.win === "Win" ? true : false;
	set_data.teamId = data.teamId;

	return set_data;
}

function GetPlayerData(data, teamId)
{
	var set_data = [];

	for( var i = 0, index = 0 ; i < data.participants.length ; ++i)
	{
		if( teamId == data.participants[i].teamId )
		{
			set_data[index] = {};
			set_data[index].participantId = data.participants[i].participantId;
			set_data[index].championId = data.participants[i].championId;

			set_data[index].spell = [];
			set_data[index].spell[0] = data.participants[i].spell1Id;
			set_data[index].spell[1] = data.participants[i].spell2Id;

			set_data[index].kill = data.participants[i].stats.kills;
			set_data[index].assiste = data.participants[i].stats.assists;
			set_data[index].death = data.participants[i].stats.deaths;
			set_data[index].gold = data.participants[i].stats.goldEarned;
			set_data[index].cs = data.participants[i].stats.totalMinionsKilled;

			set_data[index].items = [];
			set_data[index].items[0] = data.participants[i].stats.item0;
			set_data[index].items[1] = data.participants[i].stats.item1;
			set_data[index].items[2] = data.participants[i].stats.item2;
			set_data[index].items[3] = data.participants[i].stats.item3;
			set_data[index].items[4] = data.participants[i].stats.item4;
			set_data[index].items[5] = data.participants[i].stats.item5;
			set_data[index].trinket = data.participants[i].stats.item6;

			set_data[index].lane = data.participants[i].timeline.lane;

			for( var j = 0 ; j < data.participantIdentities.length ; ++j )
			{
				if( set_data[index].participantId == data.participantIdentities[j].participantId )
				{
					set_data[index].name = data.participantIdentities[j].player.summonerName;
					break;
				}
			}
			index++;
			continue;
		}
	}

	return set_data;
}

function ReflectData(data)
{
	// Region
	var region = "";
	for(var i in JSON_DATA_TEAM)
	{
		for(var j in JSON_DATA_TEAM[i])
		{
			if(data.teams[0].team_name == JSON_DATA_TEAM[i][j].code)
			{
				region = i;
				break;
			}
		}

		if(region != "")
			break;		
	}

	$('#region_form').val(region);
	document.getElementById('region_form').onchange();

	// Team
	var team_id = ["blue_team_form", "red_team_form"];

	for(var i = 0 ; i < data.teams.length ; ++i)
	{
		for(var key in JSON_DATA_TEAM[region])
		{
			if( data.teams[i].team_name == JSON_DATA_TEAM[region][key].code )
			{
				$('#'+team_id[i]).val(JSON_DATA_TEAM[region][key].code);
				document.getElementById(team_id[i]).onchange();
				break;
			}
		}
	}
}
