////////////////////////////////////////////////////////////////////////////////////
// Global

///////////////////////////////////////
var JSON_DATA_CHAMP_IMG = {};
var JSON_DATA_TEAM = {};
var JSON_DATA_SUMMONER_SPELL = {};
var JSON_DATA_ITEM_IMG = {};
var JSON_DATA_MASTERY_IMG = {};

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
	{ error_id: ERROR_ID_VERSION_GET_ERROR,		url: './php/main.php', data: { func:"GetVersion" },  }, // Version
	{ error_id: ERROR_ID_CHAMPION_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetChampionImage" },  },
	{ error_id: ERROR_ID_SUMMONER_SPELL_GET_ERROR,	url: './php/main.php', data: { func:"GetSummonerSpells" },  },
	{ error_id: ERROR_ID_ITEM_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetItemTagImage" },  },
	{ error_id: ERROR_ID_TEAM_GET_ERROR,		url: './json/team.json', data: {},  },
	{ error_id: ERROR_ID_MASTERY_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetMasteryImage"},  },
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
	var champImgJson = json[1]
	
	JSON_DATA_SUMMONER_SPELL = json[2];
	JSON_DATA_ITEM_IMG = json[3];
	JSON_DATA_TEAM = json[4];
	JSON_DATA_MASTERY_IMG = json[5];
	
	JSON_DATA_CHAMP_IMG = new Array();
	
	for(var key in champImgJson.data)
		JSON_DATA_CHAMP_IMG.push(champImgJson.data[key]);
	
	JSON_DATA_CHAMP_IMG.sort(function(a, b)
		{
			if(a.key < b.key) return -1;
			if(a.key > b.key) return 1;
			if(a.key == b.key) return 0;
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
	// ItemJson先頭に未選択データ追加
	JSON_DATA_ITEM_IMG.data["0"] = { id : -1, name : "None" };
	
	// Region
	SetRegionForm();
	
	// Blue
	SetTeamForm($('#region_form').val(), "blue");
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		// Ban
		SetChampionForm(JSON_DATA_CHAMP_IMG, "blue_ban_" + i, "blue_ban_" + i + "_champion_from");
		ShowChampionIcon($('select#blue_ban_' + i + '_champion_from').val(), "blue_ban_" + i);
		// Champion
		SetChampionForm(JSON_DATA_CHAMP_IMG, "blue_" + i, "blue_" + i + "_champion_from");
		ShowChampionIcon($('select#blue_' + i + '_champion_from').val(), "blue_" + i);
		// Player
		SetPlayerForm(JSON_DATA_TEAM, $('#region_form').val(), $('#blue_team_form').val(),  "blue_player_" + i, "blue_" + i + "_player_from");
		// Spell
		for( var j = 1 ; j <= 2 ; ++ j )
		{
			SetSummonerSpellForm(JSON_DATA_SUMMONER_SPELL, "blue_" + i, "blue_" + i + "_summoner_spell_form_" + j, j);
			ShowSpellIcon(JSON_DATA_SUMMONER_SPELL.data,  $('select#blue_'+ i + '_summoner_spell_form_1').val(), "blue_" + i, "blue_" + i + "_summoner_spell_" + j);
		}
		// Mastery
		SetMasteryForm(JSON_DATA_MASTERY_IMG, "blue_" + i, "blue_" + i + "_mastery_form");
		ShowMasteryIcon(JSON_DATA_MASTERY_IMG.data, $('select#blue_'+ i + '_mastery_form').val(), "blue_" + i, "blue_" + i + "_mastery");
		// Item
		for( var j = 1 ; j <= 6 ; ++j )
		{
			SetItemForm(JSON_DATA_ITEM_IMG, "blue_" + i, "blue_" + i + "_item_form_"+ j, j);
			ShowItemIcon(JSON_DATA_ITEM_IMG.data, $('select#blue_'+ i + '_item_form_' + j).val(), "blue_" + i, "blue_" + i + "_item_" + j);
		}
		// Trinket
		SetTrinketForm(JSON_DATA_ITEM_IMG, "blue_" + i, "blue_" + i + "_trinket_form");
		ShowItemIcon(JSON_DATA_ITEM_IMG.data, $('select#blue_'+ i + '_trinket_form').val(), "blue_" + i, "blue_" + i + "_trinket");
	}
	
	// Red
	SetTeamForm($('#region_form').val(), "red");
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		// Ban
		SetChampionForm(JSON_DATA_CHAMP_IMG, "red_ban_" + i, "red_ban_" + i + "_champion_from");
		ShowChampionIcon($('select#red_ban_' + i + '_champion_from').val(), "red_ban_" + i);
		// Champion
		SetChampionForm(JSON_DATA_CHAMP_IMG, "red_" + i, "red_" + i + "_champion_from");
		ShowChampionIcon($('select#red_' + i + '_champion_from').val(), "red_" + i);
		// Player
		SetPlayerForm(JSON_DATA_TEAM, $('#region_form').val(), $('#red_team_form').val(),  "red_player_" + i, "red_" + i + "_player_from");
		// Spell
		for( var j = 1 ; j <= 2 ; ++ j )
		{
			SetSummonerSpellForm(JSON_DATA_SUMMONER_SPELL, "red_" + i, "red_" + i + "_summoner_spell_form_" + j, j);
			ShowSpellIcon(JSON_DATA_SUMMONER_SPELL.data,  $('select#red_'+ i + '_summoner_spell_form_1').val(), "red_" + i, "red_" + i + "_summoner_spell_" + j);
		}
		// Mastery
		SetMasteryForm(JSON_DATA_MASTERY_IMG, "red_" + i, "red_" + i + "_mastery_form");
		ShowMasteryIcon(JSON_DATA_MASTERY_IMG.data, $('select#red_'+ i + '_mastery_form').val(), "red_" + i, "red_" + i + "_mastery");
		// Item
		for( var j = 1 ; j <= 6 ; ++j )
		{
			SetItemForm(JSON_DATA_ITEM_IMG, "red_" + i, "red_" + i + "_item_form_"+ j, j);
			ShowItemIcon(JSON_DATA_ITEM_IMG.data, $('select#blue_'+ i + '_item_form_' + j).val(), "red_" + i, "red_" + i + "_item_" + j);
		}
		// Trinket
		SetTrinketForm(JSON_DATA_ITEM_IMG, "red_" + i, "red_" + i + "_trinket_form");
		ShowItemIcon(JSON_DATA_ITEM_IMG.data, $('select#red_'+ i + '_trinket_form').val(), "red_" + i, "red_" + i + "_trinket");
	}
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
	
	for( var key in data.data )
	{
		tag.push("<option value='" + data.data[key].key + "' >" + data.data[key].name + "</option>");
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
	
	for( var key in data.data )
	{
		tag.push("<option value='" + data.data[key].id + "' >" + data.data[key].name + "</option>");
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
	
	for( var key in data.data )
	{
		if( $.inArray( "Trinket", data.data[key].tags ) >= 0 )
			tag.push("<option value='" + data.data[key].id + "' >" + data.data[key].name + "</option>");
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
	
	for( var key in data.data )
	{
		tag.push("<option value='" + data.data[key].id + "' >" + data.data[key].name + "</option>");
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
		if( data[i].key == key )
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
		SetPlayerForm(JSON_DATA_TEAM, $('select#region_form').val(), $("select#" + side + "_team_form").val(),  side + "_" + i, side + "_" + i + "_player_from");
	}
}

function ChangeChampionForm(name)
{
	ShowChampionIcon($("select#" + name + "_champion_from").val(), name);
}

function ChangeSummonerSpellForm(form_name, parentName, index)
{
	ShowSpellIcon(JSON_DATA_SUMMONER_SPELL.data,  $("select#" + form_name).val(), parentName, parentName + "_summoner_spell_" + index);
}

function ChangeItemForm(form_name, parentName, index)
{
	ShowItemIcon(JSON_DATA_ITEM_IMG.data, $("select#" + form_name).val(), parentName, parentName + "_item_" + index);
}

function ChangeTrinketForm(form_name, parentName)
{
	ShowItemIcon(JSON_DATA_ITEM_IMG.data, $("select#" + form_name).val(), parentName, parentName + "_trinket");
}

function ChangeMasteryForm(form_name, parentName)
{
	ShowMasteryIcon(JSON_DATA_MASTERY_IMG.data, $("select#" + form_name).val(), parentName, parentName + "_mastery");
}

////////////////////////////////////////////////////////////////////////////////////

function GetWikisCode()
{
	var target = document.getElementById("code");
	var newTag;
	
	$("#code").children().remove();
	
	newTag = document.createElement("span");
	
	var blue_team = $('#blue_team_form').val();
	var blue_ban = new Array();
	var blue_pick = new Array();
	var blue_total_gold = $('#Blue Team Total Gold').val();
	var blue_total_kill = $('#Blue Team Total Kill').val();
	var blue_total_tower = $('#Blue Team Total Taken Tower').val();
	var blue_total_dragon = $('#Blue Team Total Dragon').val();
	var blue_total_baron = $('#Blue Team Total Baron').val();
	var blue_player_name = new Array();
	var blue_player_kill = new Array();
	var blue_player_death = new Array();
	var blue_player_assist = new Array();
	var blue_player_spell1 = new Array();
	var blue_player_spell2 = new Array();
	var blue_player_item1 = new Array();
	var blue_player_item2 = new Array();
	var blue_player_item3 = new Array();
	var blue_player_item4 = new Array();
	var blue_player_item5 = new Array();
	var blue_player_item6 = new Array();
	var blue_player_trincket = new Array();
	
	var red_team = $('#red_team_form').val();
	var red_ban = new Array();
	var red_pick = new Array();
	var red_total_gold = $('#Red Team Total Gold').val();
	var red_total_kill = $('#Red Team Total Kill').val();
	var red_total_tower = $('#Red Team Total Taken Tower').val();
	var red_total_dragon = $('#Red Team Total Dragon').val();
	var red_total_baron = $('#Red Team Total Baron').val();
	var red_player_name = new Array();
	var red_player_kill = new Array();
	var red_player_death = new Array();
	var red_player_assist = new Array();
	var red_player_spell1 = new Array();
	var red_player_spell2 = new Array();
	var red_player_item1 = new Array();
	var red_player_item2 = new Array();
	var red_player_item3 = new Array();
	var red_player_item4 = new Array();
	var red_player_item5 = new Array();
	var red_player_item6 = new Array();
	var red_player_trincket = new Array();
	
	for( var i = 1 ; i <= 5 ; ++i )
	{
		var blue_ban_index = $("select#blue_ban_" + i + "_champion_from").val();
		var blue_pick_index = $("select#blue_" + i + "_champion_from").val();
		
		blue_ban.push(JSON_DATA_CHAMP_IMG[blue_ban_index].key.toLowerCase());
		blue_pick.push(JSON_DATA_CHAMP_IMG[blue_pick_index].key.toLowerCase());
		
		var red_ban_index = $("select#red_ban_" + i + "_champion_from").val();
		var red_pick_index = $("select#red_" + i + "_champion_from").val();
		
		red_ban.push(JSON_DATA_CHAMP_IMG[red_ban_index].key.toLowerCase());
		red_pick.push(JSON_DATA_CHAMP_IMG[red_pick_index].key.toLowerCase());
	}
	
	newTag.innerHTML = "<br>" +
			"{{BlockBox|Start}}" + "<br>" +
			"{{MatchRecapS7/Header|" + blue_team + " |" + red_team + "}}{{MatchRecapS7|gamename= Game 1 |patch= 7.1 |team1= " + blue_team + " |team2= " + red_team + " |team1score= 0 |team2score= 1 |winner= 2 |team1ban1= " + blue_ban[0] + " |team1ban2= " + blue_ban[1] + " |team1ban3= " + blue_ban[2] + " |team1ban4= " + blue_ban[3] + " |team1ban5= " + blue_ban[4] + " |team2ban1= " + red_ban[0] + " |team2ban2= " + red_ban[1] + " |team2ban3= " + red_ban[2] + " |team2ban4= " + red_ban[3] + " |team2ban5= " + red_ban[4] + "<br>" +
			"|date= 2017-01-20 |dst= yes |KST= 20:00 |gamelength= 38:16 |tournament= LJL 2017 Spring" + "<br>" +
			"|team1g= " + blue_total_gold + " |team1k= " + blue_total_kill + " |team1d= "+ blue_total_dragon + " |team1b= " + blue_total_baron + " |team1t= " + blue_total_tower + " |team2g= " + red_total_gold + " |team2k= " + red_total_kill + " |team2d= " + red_total_dragon + " |team2b= " + red_total_baron + " |team2t= " + red_total_tower + " |team1rh=  |team2rh=  |team1i=  |team2i= " + "<br>" +
"|blue1={{MatchRecapS7/Player|champion= " + blue_pick[0] + " |name= Evi |kills= 1 |deaths= 5 |assists= 3 |gold= 12.1 |cs= 271 |summonerspell1= Teleport |summonerspell2= Flash |item1= Sunfire Cape |item2= Spirit Visage  |item3= Guardian Angel  |item4= Mercury's Treads  |item5= Doran's Ring |item6= Ruby Crystal  |trinket= Warding Totem  |keystone= Courage of the Colossus }}" + "<br>" +

/*
			"{{PicksAndBansS7|team1=" + blue_team + " |team2=" + red_team + " |team1score= |team2score= |winner= " + "<br>" +
			"|blueban1=" + blue_ban[0] + "      |redban1=" + red_ban[0] + "<br>" +
			"|blueban2=" + blue_ban[1] + "      |redban2=" + red_ban[1] + "<br>" +
			"|blueban3=" + blue_ban[2] + "      |redban3=" + red_ban[2] + "<br>" +
			"|bluepick1=" + blue_pick[0] + "     |bluepick1role=" + blue_lane[0] + "<br>" +
			"                                           |redpick1=" + red_pick[0] + "    |redpick1role=" + red_lane[0] + "<br>" +
			"                                           |redpick2=" + red_pick[1] + "    |redpick2role=" + red_lane[1] + "<br>" +
			"|bluepick2=" + blue_pick[1] + "     |bluepick2role=" + blue_lane[1] + "<br>" +
			"|bluepick3=" + blue_pick[2] + "     |bluepick3role=" + blue_lane[2] + "<br>" +
			"                                           |redpick3=" + red_pick[2] + "    |redpick3role=" + red_lane[2] + "<br>" +
			"|blueban4=" + blue_ban[3] + "     |redban4=" + red_ban[3] + "<br>" +
			"|blueban5=" + blue_ban[4] + "     |redban5=" + red_ban[4] + "<br>" +
			"                                           |redpick4=" + red_pick[3] + "    |redpick4role=" + red_lane[3] + "<br>" +
			"|bluepick4=" + blue_pick[3] + "     |bluepick4role=" + blue_lane[3] + "<br>" +
			"|bluepick5=" + blue_pick[4] + "     |bluepick5role=" + blue_lane[4] + "<br>" +
			"                                           |redpick5=" + red_pick[4] + "    |redpick5role=" + red_lane[4] + "<br>" +
			"}}" + "<br>" +
*/
			"<br>" +
			"{{BlockBox|end}}" + "<br>" +
			"<br>";
	
	target.appendChild(newTag);
}