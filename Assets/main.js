const ITEMS_STORAGE_NAME = "scheduleItems";
const DATE_STORAGE_NAME = "scheduleDate";
const NAME_HOUR_MODIFIER = 8; // row 1 is for hour 9 for first iteration. Change as necessary.

class ScheduleItem {
    constructor(hour, text) {
        this.hour = hour;
        this.content = text;
    }
}

var timeArray = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // values to compare against the Hour of current moment
var scheduleItems = []; // an array of ScheduleItem class items
var txtContent = ""; // the content of the currently selected text-area control

// see if the current day is the same as the day last saves were made and clear the storage items if it isn't
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
        var nameQuery = "[name='" + "item-text" + (i + NAME_HOUR_MODIFIER + 1) + "']";

        // set the number of hours for this array item
        hourCheck.hours(timeArray[i]);

        if (hourCheck.isBefore(now)) {
            // apply past formatting
            $(nameQuery).addClass("past");
        }
        else if (hourCheck.isAfter(now)) {
            // apply future  formatting
            $(nameQuery).addClass("future");
        }
        else {
            // apply present formatting
            $(txtCnameQueryontrolId).addClass("present");
        }
    }
} // updateTimeslotDisplay

// save the text contents to local storage
function saveItem(hour) {
    // get the text associated with this hour (text items are labeled based on hour)
    var nameQuery = "[name='" + "item-text" + hour + "']";
    // get the content for the row clicked on
    var itemText = $(nameQuery).val().trim();

    var addNew = true;
    if (scheduleItems.length > 0) {
        // see if there is content for this hour
        var thisItem = scheduleItems.find(function (item) { return item.hour === hour });
        if (thisItem) {
            // there is data for this hour so update. Note there is no check for an empty string as this
            // is how the user can delete the content.
            thisItem.content = itemText;
            addNew = false;
        }
    }

    if (addNew) {
        // no existing content for this hour so add
        var thisItem = new ScheduleItem(hour, itemText);
        scheduleItems.push(thisItem);
    }

    // and save the items
    localStorage.setItem(ITEMS_STORAGE_NAME, JSON.stringify(scheduleItems));
    // and save moment now as when the last save occured
    localStorage.setItem(DATE_STORAGE_NAME, JSON.stringify(moment()));
} // saveItem

// get items from local storage and load them into the display
function loadItems() {
    // load the items from storage
    var storedScheduleItems = localStorage.getItem(ITEMS_STORAGE_NAME);
    if (storedScheduleItems) {
        scheduleItems = JSON.parse(storedScheduleItems);
    }

    if (scheduleItems.length > 0) {
        // fill the hour content for any that exist
        for (var i = 0; i < scheduleItems.length; i++) {
            // text items are labeled based on hour
            var nameQuery = "[name='" + "item-text" + scheduleItems[i].hour + "']";
            var itemText = $(nameQuery).val(scheduleItems[i].content);
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
    // change state of button back to disabled
    $(this).prop('disabled', true);
});

// event handler change for desc text area to change state of save button so user can save
$(".desc-text").on("keydown", function () {
    // 9 chars in item-text (name of text area control) so slice it off to get the value of the button for this row
    var btnQuery = "[value='" + $(this).attr("name").slice(9) + "']";
    $(btnQuery).prop('disabled', false);
});