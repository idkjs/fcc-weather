  function toggleTemp() {
      let script = $('#cf-data').html()
      let num = $('#temp').text()
      let cel = (num * 9 / 5 + 32).toFixed(2)
      let fht = ((num - 32) * 5 / 9).toFixed(2)
      if (script === 'C') {
          $('#cf-data').html('F')
          $('#temp').html(cel)
          $("#status").html('Click for Celsius')
      } else {
          $('#cf-data').html('C')
          $('#temp').html(fht)
          $("#status").html('Click for Fahrenheit')
      }
  }
  //  toggleTemp()
  $(document).on('click', 'button[type=button]', function() {
      toggleTemp()
  })

  function replaceImg() {
      $("#imgLink").replaceWith('☺' + "Sorry, no image");
  }
  //    go through the elements and create a node for each. this is looking for an array
  //    but we dont have to have that. lets keep it to reuse on other data.
  function createWeatherElements(createElement, createWeatherTemplate, locations) {
      return locations
          .filter(location => location.id !== null && location.city !== undefined)
          .map(createWeatherTemplate)
          .map(createElement);
  }

  function processSearchResponse(response) {
      clearElement('localWeather');
      const elements = response.length > 0 ?
          createWeatherElements(createElement, createWeatherTemplate, response) : [console.log("error in processSearchResults")];
      elements.forEach(el => appendElementToParent('localWeather', el));
  }

  //        create a template for weather data
  function createWeatherTemplate(location) {
      return `
    <div class="location Aligner-item" data-location-id="${location.id}">
    <h1>Weather App</h1>
      <p><strong>${location.city}, ${location.country}</strong></p>
      <i class="wi wi-owm-${location.iconCode}" onerror="replaceImg()"></i>
      <p>
        <span id="temp">${location.temp} </span> <span id="cf-data">C</span>&deg
      </p>
      <button type="button" id="status" value="True" class='btn js-unit'
      >click for <span id="cfbutton">Fahrenheit</span></button>

    </div>
  `;
  }

  function clearElement(id) {
      document.getElementById(id).innerHTML = '';
  }

  function appendElementToParent(parent, el) {
      document.getElementById(parent).appendChild(el.content.firstElementChild);
  }

  //      create and element for each element in returned data
  function createElement(template) {
      const el = document.createElement('template');
      el.innerHTML = template;
      return el;
  }

  function getDetails(lat, lon) {

      const APPID = `39ad5973abe6fbeb27703786bd093ae4`;
      const url =
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${APPID}`;

      axios.get(url)
          .then(res => {
              const r = res.data;
              const desc = r.weather[0].description;
              const iconStr = () => desc.split(' ').join('-')
              const details = [{
                  city: r.name,
                  country: r.sys.country,
                  temp: r.main.temp.toPrecision(3),
                  desc: desc,
                  id: r.id,
                  iconCode: r.cod,
                  iconStr: iconStr,
                  unit: `<span id='unit'>℃</span>`
              }]
              processSearchResponse(details)
          })
  }
  if (navigator.geolocation) {

      let currentPosition = {};
      // HTML5 Geo API <https://www.w3schools.com/html/html5_geolocation.asp>
      function getCurrentLocation(position) {
          //      assign passed in arg, window geo date, to data object, define lat long on object
          currentPosition = position;
          let lat = currentPosition.coords.latitude;
          let lon = currentPosition.coords.longitude;
          getDetails(lat, lon)
      }
      window.onload = function() {
          navigator.geolocation.getCurrentPosition(getCurrentLocation)
      }
  }