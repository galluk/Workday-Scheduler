var timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // values to compare against the H of current moment

// show current day using moment.js
function showCurrentDay() {
    var today = moment();
    $("#currentDay").text(moment().format("dddd, MMMM Do YYYY"));
}

// colour each row based on if it is before, after or the same as the current hour of day
function updateTimeslotDisplay() {
    // check each timeslot against the current time and colour rows accordingly
    var now = moment();
    // get the current date with no hours,mins etc to check against
    var hourCheck = moment().startOf(now);

    // check each timeslot against the current time
    for (var i = 0; i < timeArray.length; i++) {
        // get the ID of the corresponding control
        var txtControlId = "#item-text" + (i + 1);

        // add the number of hours to the start of the day
        hourCheck.hours(timeArray[i]);

        if (hourCheck.isBefore(now)) {
            // apply past before formatting
            $(txtControlId).addClass("past");
        }
        else if (hourCheck.isAfter(now)) {
            // apply future before formatting
            $(txtControlId).addClass("future");
        }
        else {
            // apply present before formatting
            $(txtControlId).addClass("present");
        }
    }
}

function initialise() {
    showCurrentDay();
    updateTimeslotDisplay();
}

initialise();