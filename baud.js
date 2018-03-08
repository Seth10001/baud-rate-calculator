function intalizeTable()
{
  var clockRate = document.getElementById("clock-rate");
  var baudRate = document.getElementById("baud-rate");
  var speedMode = document.getElementById("speed-mode");

  //make sure all buttons exist
  if (clockRate != null && baudRate != null && speedMode != null)
  {
    new Table(clockRate, baudRate, speedMode);
  }

  else
  {
    console.error("One of the inputs is missing.")
  }
}


function Table(clockRate, baudRate, speedMode)
{
  this.clockRate = clockRate;
  this.baudRate = baudRate;
  this.speedMode = speedMode;

  //initalize update events
  clockRate.addEventListener("change", this.update.bind(this));
  baudRate.addEventListener("change", this.update.bind(this));
  speedMode.addEventListener("change", this.update.bind(this));

  //update the for the first time
  this.update();
}

Table.prototype.update = function ()
{
  var clockRate = parseFloat(this.clockRate.value);
  var baudRate = parseFloat(this.baudRate.value);
  var speedMode = parseFloat(this.speedMode.value);

  //get all bscales
  var bscales = document.getElementsByClassName("bscale");

  //define length outside of loop for efficiency
  var bscaleLength = bscales.length;

  for (var index = 0; index < bscaleLength; index++)
  {
    var bscale = bscales[index];
    var parentRow = bscale.parentElement;

    var scale = parseFloat(bscale.textContent);

    var calcBsel = parentRow.querySelector(".calc-bsel");
    var calcBselValue = clockRate * 1000000/(Math.pow(2, scale) * (16 - 8 * speedMode) * baudRate) - 1;
    calcBselValue = calcBselValue.toFixed(2);
    calcBsel.textContent = calcBselValue;

    var bsel = parentRow.querySelector(".bsel");

    if (calcBselValue > 4095)
    {
      bsel.textContent = "N/A";
    }

    else
    {
      bsel.textContent = Math.floor(parseFloat(calcBselValue) + 0.5);
    }


  }
};



document.addEventListener("DOMContentLoaded", intalizeTable);
