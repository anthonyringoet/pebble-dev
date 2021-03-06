var rocky = require('rocky')
var weather

function drawWeather(ctx, weather) {
  // Create a string describing the weather
  var weatherString = weather.celcius + 'ºC, ' + weather.desc;
  // var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc

  // Draw the text, top center
  ctx.fillStyle = 'lightblue'
  ctx.textAlign = 'center'
  ctx.font = '14px Gothic'
  ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, 2)
}

rocky.on('draw', function (event) {
  // Drawing canvas
  var ctx = event.context

  // Clear the canvas
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#Canvas
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

  // UnobstructedArea
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#Canvas
  var offsetY = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2
  var centerX = ctx.canvas.unobstructedWidth / 2

  // Date/Time
  // https://developer.pebble.com/docs/rockyjs/Date/
  var d = new Date()

  // Set the text formatting
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'

  // Draw the conditions (before clock hands, so it's drawn underneath them)
  if (weather) {
    drawWeather(ctx, weather);
  }

  // Time
  // https://developer.pebble.com/docs/rockyjs/CanvasRenderingContext2D/#font
  ctx.font = '26px bold Leco-numbers-am-pm'
  // Strip seconds from 01:00:00 or 1:00:00 AM
  var time = d.toLocaleTimeString().replace(/:\d+($| )/, '$1'); // 01:00 or 1:00 AM
  ctx.fillText(time, centerX, (66 - offsetY))

  // Date
  ctx.font = '18px bold Gothic'
  var day = d.toLocaleDateString(undefined, ({day: 'numeric'}))
  var month = d.toLocaleDateString(undefined, ({month: 'long'}))
  ctx.fillText(day + ' ' + month, centerX, (94 - offsetY))
})

rocky.on('message', function(event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data

  if (message.weather) {
    // Save the weather data
    weather = message.weather

    // Request a redraw so we see the information
    rocky.requestDraw()
  }
})

// Redraw every minute
// https://developer.pebble.com/docs/rockyjs/rocky/#on
rocky.on('minutechange', function (event) {
  rocky.requestDraw()
})

rocky.on('hourchange', function(event) {
  // Send a message to fetch the weather information (on startup and every hour)
  rocky.postMessage({'fetch': true})
})

// Send a single message to the Phone
// https://developer.pebble.com/docs/rockyjs/rocky/#postMessage
// rocky.postMessage('This arrives on the phone via bluetooth!')
