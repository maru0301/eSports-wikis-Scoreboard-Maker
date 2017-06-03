<?php

if( !isset( $_GET['func'] ) ) return;

//-------------------------------------------------

class RiotApi
{
	private $api_key = '';
	
	private function GetJson( $url )
	{
		$master_url = $url . $this->api_key;
		$json = file_get_contents($master_url, false);
		$json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
		
		return $json;
	}
	
	public function GetVersion()
	{
		$json = $this->GetJson('https://jp1.api.riotgames.com/lol/static-data/v3/realms?api_key=');
		
		return $json;
	}
	
	public function GetChampionImage()
	{
		$json = $this->GetJson('https://jp1.api.riotgames.com/lol/static-data/v3/champions?champListData=image&dataById=true&api_key=');
		
		return $json;
	}
	
	public function GetSummonerSpells()
	{
		$json = $this->GetJson('https://na1.api.riotgames.com/lol/static-data/v3/summoner-spells?spellListData=image&dataById=true&api_key=');
		
		return $json;
	}
	
	public function GetItem()
	{
		$json = $this->GetJson('https://na1.api.riotgames.com/lol/static-data/v3/items?itemListData=all&api_key=');
		
		return $json;
	}
	
	public function GetMasteryImage()
	{
		$json = $this->GetJson('https://na1.api.riotgames.com/lol/static-data/v3/masteries?masteryListData=image&ranks&tree&api_key=');
		
		return $json;
	}
}

//-------------------------------------------------

$api = new RiotApi;

$func_tbl = array(
			"GetVersion" => "GetVersion",
			"GetChampionImage" => "GetChampionImage",
			"GetSummonerSpells" => "GetSummonerSpells",
			"GetItem" => "GetItem",
			"GetMasteryImage" => "GetMasteryImage",
);

//-------------------------------------------------

$func_name = $_GET['func'];

echo $api->{$func_tbl[$func_name]}();

//-------------------------------------------------

?>