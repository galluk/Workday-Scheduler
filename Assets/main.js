const ITEMS_STORAGE_NAME = "scheduleItems";
const DATE_STORAGE_NAME = "scheduleDate";

var timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // values to compare against the H of current moment

class ScheduleItem {
    constructor(hour, text) {
        this.hour = hour;
        this.content = text;
    }
}

// var Schedule = {
//     dateOf,
//     items:[]
// }

function checkCurrentDay(currentDate) {
    var lastSavedDate = moment(JSON.parse(localStorage.getItem(DATE_STORAGE_NAME)));

    if (!lastSavedDate.isSame(currentDate, "day")) {
        // clear the storage
        localStorage.removeItem(ITEMS_STORAGE_NAME);
    }
}

// show current day using moment.js
function showCurrentDay() {
    var today = moment();
    $("#currentDay").text(moment().format("dddd, MMMM Do YYYY"));
    checkCurrentDay(today);
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
} // updateTimeslotDisplay

function saveItem(hour) {
    // get the text associated with this hour
    // text items are labeled based on row number, not hour so subtract 8 (e.g. hour 9 gives row 1)
    var txtControlId = "#item-text" + (hour - 8);
    var itemText = $(txtControlId).val();

    // load the items from storage
    var scheduleItems = [];
    var storedScheduleItems = localStorage.getItem(ITEMS_STORAGE_NAME);
    if (storedScheduleItems) {
        scheduleItems = JSON.parse(storedScheduleItems);
    }

    // see if there is content for this hour
    var addNew = true;
    if (scheduleItems.length > 0) {
        var thisItem = scheduleItems.find(function (item) { return item.hour === hour });
        // data for this hour so update
        if (thisItem) {
            thisItem.content = itemText;
            addNew = false;
        }
    }

    // no data for this hour so add
    if (addNew) {
        var thisItem = new ScheduleItem(hour, itemText);
        scheduleItems.push(thisItem);
    }

    // and save
    localStorage.setItem(ITEMS_STORAGE_NAME, JSON.stringify(scheduleItems));
    localStorage.setItem(DATE_STORAGE_NAME, JSON.stringify(moment()));
} // saveItem

// get items from local storage and load them into the display
function loadItems() {
    // load the items from storage
    var scheduleItems = [];
    var storedScheduleItems = localStorage.getItem(ITEMS_STORAGE_NAME);
    if (storedScheduleItems) {
        scheduleItems = JSON.parse(storedScheduleItems);
    }

    if (scheduleItems.length > 0) {

        for (var i = 0; i < scheduleItems.length; i++) {
            // text items are labeled based on row number, not hour so subtract 8 (e.g. hour 9 gives row 1)
            var txtControlId = "#item-text" + (scheduleItems[i].hour - 8);
            var itemText = $(txtControlId).val(scheduleItems[i].content);
        }
    }
} // loadItems

function initialise() {
    showCurrentDay();
    updateTimeslotDisplay();
    loadItems();
}

initialise();

// event handler for save button
$(".saveBtn").on("click", function () {
    saveItem($(this).val());
    //$("#display").empty();
});
