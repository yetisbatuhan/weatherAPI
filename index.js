import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// express.static middleware'ini önce eklemelisiniz

const weatherKey = process.env.API_KEY;
app.get("/", (req, res) => {
    res.render("index.ejs");
});
function weatherTime(x) {
        const hour = [];
    for (let i = 0; i < 6; i++) {
        const time =x[i].dt ;
        const date = new Date(time * 1000); // Unix zaman damgası saniye cinsinden olduğu için 1000 ile çarpılır
        
        const hours = date.getHours();
        const minutes = date.getMinutes();
        hour.push(`${hours}:${minutes}0`)
         
        
    }    
    
    return hour ;
}
function weatherforecast(x) {
        const newJson = [];
        for (let i = 0; i < x.list.length; i++) {
            if ( -1 !== x.list[i].dt_txt.search("12:00")) {
                newJson.push(x.list[i]);
            }
           
}

return newJson ;
}
function weatherDaysDates(x) {  // five days calc unix to string 
       const data = weatherforecast(x);
        const dates = [];    
    for (let i = 0; i < data.length; i++) {
        const time =data[i].dt ;
        const date = new Date(time * 1000);
        const f =new Intl.DateTimeFormat('tr-US').format(date) ;
        dates.push(f);
     }  
    
     return dates;
}
app.post("/",async (req, res) => {
    const city = req.body.city ;
    const geoMap = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${weatherKey}`)
    const cityName = geoMap.data[0].name // city
    const cityLon= JSON.stringify(geoMap.data[0].lon);
    const cityLat= JSON.stringify(geoMap.data[0].lat);
    const cityLatFixed = parseFloat(cityLat).toFixed(2);
    const cityLonFixed = parseFloat(cityLon).toFixed(2);
    const current = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLatFixed}&lon=${cityLonFixed}&appid=${weatherKey}`);
    const celciusNow = Math.floor(current.data.main.temp-273,15);
    // console.log(current.data); // hum temp, wind, clouds
    const weatherDays = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLatFixed}&lon=${cityLonFixed}&appid=${weatherKey}`);
   
    
    // weatherforecast(weatherDays.data)




    res.render("index.ejs",{city: cityName,celcius: celciusNow,topLane: current.data,weatherTime: weatherTime(weatherDays.data.list),weatherDays: weatherDays.data,weather5Days: weatherforecast(weatherDays.data),weatherCalender:  weatherDaysDates(weatherDays.data)});
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});