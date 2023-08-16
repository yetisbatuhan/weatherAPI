import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// express.static middleware'ini önce eklemelisiniz

const weatherKey = "2a09ebb1f33ad2ac1877c2a1e7ad3113";
app.get("/", (req, res) => {
    res.render("index.ejs");
});



app.post("/",async (req, res) => {
    const city = req.body.city ;
    const geoMap = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${weatherKey}`)
    const cityName = geoMap.data[0].name
    const cityLon= JSON.stringify(geoMap.data[0].lon);
    const cityLat= JSON.stringify(geoMap.data[0].lat);
    const cityLatFixed = parseFloat(cityLat).toFixed(2);
    const cityLonFixed = parseFloat(cityLon).toFixed(2);
    const current = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLatFixed}&lon=${cityLonFixed}&appid=${weatherKey}`)
    const celciusNow = Math.floor(current.data.main.temp-273,15)
    console.log(current.data)
    res.render("index.ejs",{city: cityName,celcius: celciusNow,topLane: current.data,});
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});