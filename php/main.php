<?php

if( !isset( $_GET['func'] ) ) return;

//-------------------------------------------------

class RiotApi
{
	private $api_key = '561cb811-20fb-4e50-bc7f-3f3c8cd345e4';
	
	private function GetJson( $url )
	{
		$proxy = array(
			"http" => array(
					"proxy" => "proxy2.hq.scei.sony.co.jp:10080",
					'request_fulluri' => true,
				),
		);
		
		$proxy_context = stream_context_create($proxy);
		$master_url = $url . $this->api_key;
		$json = file_get_contents($master_url, false, $proxy_context );
		$json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
		
		return $json;
	}
	
	public function GetVersion()
	{
		$json = $this->GetJson('https://global.api.pvp.net/api/lol/static-data/jp/v1.2/realm?api_key=');
		
		return $json;
	}
	
	public function GetChampionImage()
	{
		$json = $this->GetJson('https://global.api.pvp.net/api/lol/static-data/jp/v1.2/champion?champData=image&api_key=');
		
		return $json;
	}
}

//-------------------------------------------------

$api = new RiotApi;

$func_tbl = array(
			"GetVersion" => "GetVersion",
			"GetChampionImage" => "GetChampionImage",
);

//-------------------------------------------------

$func_name = $_GET['func'];

echo $api->{$func_tbl[$func_name]}();

//-------------------------------------------------

?>