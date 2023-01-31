//-----------------------------List of Global variables used within our JavaScript.
var SelectedListItemValue;
var SelectedListItemText;
var CountrySel = document.getElementById("format-input");
var CmbRadioStation = document.getElementById("RadioStation");
var PlayRad = document.getElementById("btnplay");
var ChangeQuote = document.getElementById("Quote");
var requestUrl = "https://at1.api.radio-browser.info/json/stations/search?";
var leftMenu = document.getElementById("MenuList");

//-----------------------------Function to call 1st API "Radio Station" > sends counrty list/code
fetch(requestUrl)
  .then(function (response) {
    // In order to use the data, it must first be parsed. Use .json() when the
    // API response format is JSON.
    AddPlayList();
    return response.json();
  })
  .then(function (data) {
    var countrys = [];
    let activities = [];
    for (var i = 0; i < data.length; i++) {
      countrys.push(data[i].country, data[i].countrycode);
      activities.push([data[i].country, data[i].countrycode]);
    }
    // console.table(activities);
    let newArray1 = [];
    let uniqueObject1 = {};
    for (let i in activities) {
      objTitle = activities[i]["0"];
      uniqueObject1[objTitle] = activities[i];
    }
    for (i in uniqueObject1) {
      newArray1.push(uniqueObject1[i]);
    }
    // console.table(newArray1);
    var select = document.getElementById("format-input");
    for (var i = 0; i < newArray1.length; i++) {
      var opt = newArray1[i][0];
      var val = newArray1[i][1];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = val;
      select.appendChild(el);
    }
  });
//-----------------------------Function to call 1st API Radio Station > sends radio stations beloing to the pre selected counrty code.
function getRadioStations(countryCode) {
  var locQueryUrl =
    "https://at1.api.radio-browser.info/json/stations/search?countrycode=" +
    countryCode +
    "&limit=10";
  fetch(locQueryUrl)
    .then(function (response) {
      // In order to use the data, it must first be parsed. Use .json() when the
      // API response format is JSON.
      return response.json();
    })
    .then(function (data) {
      // console.table(data);
      let activities = [];
      for (var i = 0; i < data.length; i++) {
        activities.push([data[i].name, data[i].url]);
      }
      var select = CmbRadioStation;
      for (var i = 0; i < activities.length; i++) {
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

//-----------------------------When counrty is selected it will load new radio stations to select from
CountrySel.onchange = function () {
  //display correct values
  CmbRadioStation.length = 1;
  var TrialRadio = this.value;
  // console.log(TrialRadio);
  getRadioStations(TrialRadio);
};

//-----------------------------Save Selected Radio Station to Local Storage
function SaveToLocalStorage(RadioStationName, RadioUrl) {
  if (RadioUrl == "") {
    var error = document.getElementById("Popup_DropDown")
    error.textContent = "Please select a Radio Station"
    error.classList.toggle("show");
  }
  else {
    var RadioStation = RadioStationName;
    var RadioStationLink = RadioUrl;
    let save = [];
    save = JSON.parse(localStorage.getItem('PlayList')) || [];
    console.table(save);
    save.push([RadioStation, RadioStationLink]);
    localStorage.setItem("PlayList", JSON.stringify(save));
    AddPlayList();
  }
}

//-----------------------------Add Local Storage data to Left Menu Play List (favourites)
function AddPlayList() {
  //localStorage.removeItem("PlayList");
  var ul = document.querySelector('#MenuList');
  var listLength = ul.children.length;
  if (listLength != 0) {
    for (i = 0; i < listLength; i++) {
      ul.removeChild(ul.children[0]);
    }
  }
  let LocPlaylist = [];
  LocPlaylist = JSON.parse(localStorage.getItem('PlayList'));
  if (LocPlaylist != null) {
    for (var i = 0; i < LocPlaylist.length; i++) {
      var opt = LocPlaylist[i][0];
      var val = LocPlaylist[i][1];
      var el = document.createElement('li');
      el.textContent = opt;
      el.val = val;
      leftMenu.appendChild(el);
    }
  }
}

//-----------------------------Play Radio Station 
async function listen() {
  var TrialRadio = CmbRadioStation.value;
  let music = document.getElementById("music");
  music.src = TrialRadio;
  //music.currentTime=5000;
  var sel = document.getElementById("RadioStation");
  var text = sel.options[sel.selectedIndex].text;
  music.play();
  playQuote();
}

//-----------------------------Call function for "Quotes" API (2nd API intergrated)
fetch("https://type.fit/api/quotes")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    quote_data = data;
    return quote_data;
  });

//-----------------------------When play button is clicked, new quote is generated:
function playQuote() {
  // generate a quote when a play button is clicked
  generate_random_no();
}

//-----------------------------function to generate random number; between 1 and max number of quotes within database
// It then outputs by displaying on the website the "quote - author":
function generate_random_no() {
  let random_no = Math.floor(Math.random() * quote_data.length + 1);
  console.log(random_no);
  ChangeQuote.textContent = quote_data[random_no].text + " - " + quote_data[random_no].author;
}

//-----------------------------Set the timer so that every 30s, the new quote is displayed:
async function stop() {
  let music = document.getElementById("music");
  music.pause();
  music.src = "";
}

//-----------------------------Function to play Selected Radio Station:
async function playRadio(url) {
  let music = document.getElementById("music");
  music.src = url;
  music.play();
}

//-----------------------------Event listener to add radio stations to the left hand side to be able to reselect as part of the users favourite:
leftMenu.addEventListener("click", function (e) {
  if (e.target && e.target.nodeName == "LI") {
    SelectedListItemValue = e.target.val;
    SelectedListItemText = e.target.innerText;
    console.log(e.target.val);
  }
});

//-----------------------------"Popup" that states Please select a Radio Station from the Drop Down Box
function Function_Popup_DropDown() {
  var popup = document.getElementById("Popup_DropDown");
  popup.classList.toggle("show");
}

//-----------------------------"Popup" that states Please select a Radio Station from the Play list
function Function_Popup_Playlist() {
  var popup = document.getElementById("PopupPlaylist");
  popup.classList.toggle("show");
}

//-----------------------------Add Radio Station to PlayList (favourites)
function Update_Radio_Station_PlayList() {
  var TrialRadio = CmbRadioStation.value;
  let music = document.getElementById("music");
  music.src = TrialRadio;
  var sel = document.getElementById("RadioStation");
  var text = sel.options[sel.selectedIndex].text;
  SaveToLocalStorage(text, TrialRadio);
}

//-----------------------------Play selected Radio Station From PlayList (favourites)
function Play_selected_Radio() {
  if (SelectedListItemValue === undefined || SelectedListItemValue === null) {
    var error = document.getElementById("PopupPlaylist")
    error.textContent = "Please select a Radio Station"
    error.classList.toggle("show");
  }
  else {
    playRadio(SelectedListItemValue);
    SelectedListItemValue = "";
  }
}

//-----------------------------Remove selected Radio Station From PlayList (favourites)
function RemovRadio_Station_From_PlayList() {
  if (localStorage.getItem("PlayList") === null) { } else {
    var ls_data = JSON.parse(localStorage.getItem("PlayList"));
    var index = -1;
    var localStorageRadio = ls_data.filter(item => item !== SelectedListItemText);
    for (var i = 0; i < localStorageRadio.length; i++) {
      if (localStorageRadio[i][0] == SelectedListItemText) {
        index = i;
        break;
      }
    }
    if (index == -1) {
    } else {

      ls_data.splice(index, 1);
      localStorage.setItem("PlayList", JSON.stringify(ls_data));
      console.table(ls_data);
      AddPlayList();
    }
  }
}