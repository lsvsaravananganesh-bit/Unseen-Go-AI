const CONFIG = require('./unseengo-config');
module.exports = async function handler(req,res){
  try{
    const {latitude,longitude,city}=req.query||{};
    if(!latitude||!longitude)return res.status(400).json({error:'latitude and longitude are required'});
    const url=new URL(CONFIG.weatherBaseUrl);
    url.searchParams.set('latitude',latitude); url.searchParams.set('longitude',longitude);
    url.searchParams.set('current','temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m');
    url.searchParams.set('daily','weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset');
    url.searchParams.set('forecast_days','4'); url.searchParams.set('timezone','auto');
    const r=await fetch(url); const data=await r.json();
    if(!r.ok)throw new Error(data.reason||'Weather provider error');
    res.status(200).json({city:city||null,source:'Open-Meteo',data});
  }catch(e){res.status(502).json({error:e.message});}
};
