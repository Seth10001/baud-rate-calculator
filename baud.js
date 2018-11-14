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

  if (clockRate <= 0)
  {
    this.clockRate.classList.add("is-invalid");
    return;
  }

  if (baudRate <= 0)
  {
      this.baudRate.classList.add("is-invalid");
    return;
  }

  this.baudRate.classList.remove("is-invalid");
  this.clockRate.classList.remove("is-invalid");



  //get all bscales
  var bscales = document.getElementsByClassName("bscale");

  //define length outside of loop for efficiency
  var bscaleLength = bscales.length;

  //set
  for (var index = 0; index < bscaleLength; index++)
  {
    var bscale = bscales[index];
    var parentRow = bscale.parentElement;

    //get bscale value
    var scale = parseFloat(bscale.textContent);


    /*
    * Calculated bsel value
    */

    //get the calculated bsel value's tag
    var calcBsel = parentRow.querySelector(".calc-bsel");

    //calculate "calculated" bsel value

    var calcBselValue
    if (scale >= 0)
    {
      calcBselValue = clockRate * 1000000/(Math.pow(2, scale) * (16 - 8 * speedMode) * baudRate) - 1;
    }

    else
    {
      calcBselValue = 1/(Math.pow(2,scale))*(clockRate * 1000000/((16 - 8 * speedMode) * baudRate) - 1);
    }

    calcBselValue = calcBselValue.toFixed(2);
    calcBsel.textContent = calcBselValue;

    /*
    * bsel value
    */

    //get bsel tag
    var bsel = parentRow.querySelector(".bsel");

    var bselValue;

    //set bsel
    if (calcBselValue > 4095)
    {
      bselValue = "N/A";
    }

    else
    {
      bselValue = Math.floor(parseFloat(calcBselValue) + 0.5);
    }

    bsel.textContent = bselValue;

    /*
    * real baud rate
    */

    var baud = parentRow.querySelector(".baud-rate");
    var baudValue;

    if (bselValue == -1)
    {
      baudValue = "No!";
    }

    else
    {
      if (scale >= 0)
      {
        baudValue = clockRate * 1000000/(Math.pow(2, scale)*(16 - 8*speedMode)*(bselValue + 1));
      }

      else
      {
        baudValue = clockRate * 1000000/((16 - 8 * speedMode) * ((Math.pow(2, scale)* bselValue) + 1));
      }

      if (isNaN(baudValue) || !isFinite(baudValue))
      {
        baudValue = "No!";
      }

      else
      {
        baudValue = baudValue.toFixed(0);
      }
    }

    baud.textContent = baudValue;

    /*
    * Error [%]
    */

    var error = parentRow.querySelector(".error");

    var percentError;

    if (baudValue == "No!")
    {
      percentError = "N/A";
    }

    else
    {
      percentError = 100 - baudValue/baudRate*100;
      percentError = percentError.toFixed(2);
    }

    error.textContent = percentError;

    /*
    * abs(Error) [%]
    */

    var absErrorTag = parentRow.querySelector(".abs-error");

    var absError;

    if (baudValue == "No!")
    {
      absError = "N/A";
    }

    else
    {
      absError = Math.abs(percentError);
      absError = absError.toFixed(2);
    }

    absErrorTag.textContent = absError;

    var colorClass;


    if (absError > 6 || absError == "N/A")
    {
      //red
      colorClass = "bg-danger";
    }

    else if (absError > 3)
    {
      //yellow
      colorClass = "bg-warning";
    }

    else
    {
      //green
      colorClass = "bg-success";
    }

    //remove any previous colors
    absErrorTag.classList.remove("bg-danger");
    absErrorTag.classList.remove("bg-warning");
    absErrorTag.classList.remove("bg-success");

    absErrorTag.classList.add(colorClass);
  }

}

document.addEventListener("DOMContentLoaded", intalizeTable);
