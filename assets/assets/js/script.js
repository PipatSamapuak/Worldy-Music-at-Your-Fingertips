var CountrySel = document.getElementById("format-input");
var CmbRadioStation = document.getElementById("RadioStation");
var PlayRad = document.getElementById("btnplay");
var ChangeQuote = document.getElementById("Quote"); 

var requestUrl = "https://at1.api.radio-browser.info/json/stations/search?";
//var requestUrl = "https://at1.api.radio-browser.info/json/stations/search?&limit=50&order=clickcount&reverse=true&language=english";

// No need to add more API, just find a way to change ‘Country’ as user select
fetch(requestUrl)
  .then(function (response) {
    // In order to use the data, it must first be parsed. Use .json() when the
    // API response format is JSON.
    return response.json();
  })
  .then(function (data) {
   // console.log("Fetch Response \n-------------");
   // console.log(data);

    // for (var i = 0; i < data.length; i++) {
    //        console.log(data[i].country)  ;
            
        //   }
var countrys=[];
let activities = [];

    for (var i = 0; i < data.length; i++) {
        countrys.push((data[i].country),(data[i].countrycode ))  ;
        
       
        activities .push([(data[i].country),(data[i].countrycode )]);
      }

     // console.table(activities);



      let newArray1 = [];
    
     
        let uniqueObject1 = {};
      
        for (let i in activities) {
          
      
            objTitle = activities[i]['0'];
          
      
            uniqueObject1[objTitle] = activities[i];
        }
          
        for (i in uniqueObject1) {
            newArray1.push(uniqueObject1[i]);
        }


       // console.table(newArray1);

        var select = document.getElementById("format-input");
       
        
        for(var i = 0; i < newArray1.length; i++) {
            var opt = newArray1[i][0];
            var val = newArray1[i][1];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = val;
            select.appendChild(el);
        }
      

  });


function getRadioStations( countryCode) {
    var locQueryUrl = "https://at1.api.radio-browser.info/json/stations/search?countrycode="+countryCode+"&limit=10";
    
   
    fetch(locQueryUrl)
  .then(function (response) {
    // In order to use the data, it must first be parsed. Use .json() when the
    // API response format is JSON.
    return response.json();
  })
  .then(function (data) {
    console.table(data);

    let activities = [];
    
        for (var i = 0; i < data.length; i++) {
          
            activities .push([(data[i].name),(data[i].url)]);
            

          }
    
          var select = CmbRadioStation;
       
        
          for(var i = 0; i < activities.length; i++) {
             var opt = activities[i][0];
             var val = activities[i][1];
            var el = document.createElement("option");
             el.textContent = opt;
             el.value = val;
             select.appendChild(el);
           
          }


         // console.table(activities);
  });
}

CountrySel.onchange = function() {
    
      //display correct values
      CmbRadioStation.length=1;
      var TrialRadio=this.value;
        console.log(TrialRadio)
        getRadioStations(TrialRadio);
       
    }

    async function listen(){
      var TrialRadio=CmbRadioStation.value;
      let music = document.getElementById('music')
      music.src=TrialRadio;
      //music.currentTime=5000;
      music.play()
      playQuote();
   }

   function playQuote (){
   fetch("https://type.fit/api/quotes")
   .then(function(response) {
     return response.json();
   })
   .then(function(data) {
    console.log(data[0].text);
    ChangeQuote.textContent = data[0].text;
    });
  }

   async function stop(){
      let music = document.getElementById('music')
      music.pause()
      music.src=""
   }

   function PlayFunction() {

    var TrialRadio=CmbRadioStation.value;
     var test="http://ca9.rcast.net:8014/;stream.mp3";
     playRadio(test);

  }
   
    async function playRadio(url){
      let music = document.getElementById('music')
      music.src=url;
      music.play()
   }


  
