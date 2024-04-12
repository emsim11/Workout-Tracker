// Feature: Display User's Name in Heading 1
var header = document.querySelector('h1');
var userInput = document.getElementById('userInput');
var workoutPage = document.getElementById('Workout-Page');
var welcomeMessage = document.getElementById('Welcome');
var previousArrow = document.getElementById("cal-prev");
var nextArrow = document.getElementById("cal-next")
var userName = localStorage.getItem('userName'); // Check if User Name is Already Stored in Local Storage

// Function: Retrieve User Name if it's Been Submitted Before
if (userName) {
    header.textContent = `${userName}'s Workout Tracker`; // If User Name is Already Stored, Update Header With the Stored Name
    workoutPage.style.display = 'block'; // Show the Workout Page Divider
    userInput.style.display = 'none'; // Hide the User Name Form
    welcomeMessage.style.display = 'block'; // Show the Welcome Message

    // Function: Submit User Name For the First Time
} else {
    userInput.addEventListener('submit', function (event) { // Add Event Listener to Form
        event.preventDefault(); // Prevent Form Submission
        var userName = document.getElementById('User-Name').value; // Retrieve Input Value From Form Field
        header.textContent = `${userName}'s Workout Tracker`; // Update Text Content of Header with the User's Name
        localStorage.setItem('userName', userName); // Save the User's Name to Local Storage
        workoutPage.style.display = 'block'; // Show the Workout Page Divider
        userInput.style.display = 'none'; // Hide User Name Form Once Submitted
        welcomeMessage.style.display = 'none'; // Hide the Welcome Message
    });
};

// Feature: Display Random Quote (Quotable API)
var quote = 'https://api.quotable.io/random';
var options = { method: 'GET', headers: { Accept: 'application/json' } };
$.ajax({
    url: 'https://api.quotable.io/random',
    dataType: 'json',
    success: function (data) {
        var quote = data.content;
        $('#Quote').text('"' + quote + '"');
    },
    error: function () {
        $('#Quote').text("Your self-worth is determined by you. You don't have to depend on someone telling you who you are.");
    }
});

// Feature: Display Date & Time
var currentDate = dayjs().format('dddd, MMMM D, YYYY, h:mm a');
var currentTime = dayjs().hour();
console.log(currentTime);
$('#currentDate').html(currentDate); // Sets Date & Time In Dashboard Header Area

// Feature: Interactive Calendar
var date = new Date();
var calendarYear = date.getFullYear();
var calendarMonth = date.getMonth();
var calendarDay = document.querySelector('.cal-dates');
var calendarCurrentDate = document.querySelector('.cal-current-date');
var calendarIcons = document.querySelector('.cal-nav span');

// Months Array
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Function: Show Calendar
const calendarFunction = () => {
    const today = dayjs();
    var dayOne = new Date(calendarYear, calendarMonth, 1).getDay(); // Obtain First Day of the New Month
    var lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate(); // Obtain Last Day of the New Month
    var lastDayName = new Date(calendarYear, calendarMonth, lastDay).getDay(); // Obtain Day Name of the Last Day in the Month
    var monthLastDate = new Date(calendarYear, calendarMonth, 0).getDate(); // Obtain Last Date of the Previous Month
    var lit = "";
    for (let i = dayOne; i > 0; i--) { // Add Last Dates of the Previous Month
        lit += `<li class="inactive past">${monthLastDate - i}</li>`;
    };
    for (let i = 1; i <= lastDay; i++) {
        const date = dayjs(`${months[calendarMonth]} ${i}, ${calendarYear}`, 'MMMM D, YYYY'); // Add Dates of the Current Month
        const isToday = date.isSame(today, 'day') ? "active current-day" : (date.isBefore(today, 'day') ? "active past" : "active future");
        lit += `<li class="${isToday}">${i}</li>`;
    };

    for (let i = lastDayName; i < 6; i++) {
        lit += `<li class="inactive future">${i - lastDayName + 1}</li>`;
    };
    calendarCurrentDate.innerText = `${months[calendarMonth]} ${calendarYear}`;
    calendarDay.innerHTML = lit;
};
calendarFunction();

// Function: Navigation Buttons Event Listeners
const prevButton = document.getElementById('cal-prev');
const nextButton = document.getElementById('cal-next');
prevButton.addEventListener('click', function () {
    calendarMonth--; // Decrease Month By 1
    if (calendarMonth < 0) {
        calendarMonth = 11; // If Month Goes Below January, Set it to December
        calendarYear--; // Decrease Year
    };
    calendarFunction(); // Update Calendar Display
});
nextButton.addEventListener('click', function () {
    calendarMonth++; // Increase Month By 1
    if (calendarMonth > 11) {
        calendarMonth = 0; // If Month Goes Above December, Set it to January
        calendarYear++; // Increase Year
    };
    calendarFunction(); // Update Calendar Display
});
calendarFunction();

// Check if Current Month is Different From Displayed Month
function isCurrentMonth() {
    const currentMonth = dayjs().month();
    return currentMonth === calendarMonth;
};
// Event Listener for "Today" Button Click
const todayButton = document.getElementById('today-button');
todayButton.addEventListener('click', function() {
    if (!isCurrentMonth()) {
        calendarMonth = dayjs().month();
        calendarYear = dayjs().year();
        calendarFunction(); // Update Calendar Display
    }
});

// Feature: Exercise Data (WGER API)
var wgerEndpoints = { // JSON Object Containing API Endpoints
    'exercise': 'https://wger.de/api/v2/exercise/?limit=100&language=2',
    'exercisecategory': 'https://wger.de/api/v2/exercisecategory/?',
    'exerciseimage': 'https://wger.de/api/v2/exerciseimage/?',
    'exerciseinfo': 'https://wger.de/api/v2/exerciseinfo/?'
};

// Function: Fetch WGER Data Endpoints
function fetchExercises() {
    return fetchDataFromEndpoint('exercise');
};

// Function: Fetch Data From a Specific Endpoint
function fetchDataFromEndpoint(endpointKey, params) {
    var endpoint = wgerEndpoints[endpointKey];
    if (params) {
        endpoint += "&" + params;
    }
    return fetch(endpoint)
        .then(function (resp) { return resp.json() });
};

// Function: Run Console Log to Ensure API Works
fetchExercises().then(function (data) { console.log(data) });
fetch("https://wger.de/api/v2/exercisecategory/")
    .then(function (resp) { return resp.json(); })
    .then(function (data) { console.log(data); });

// Function: Display Workout Choices
var exeButton = $(".exerciseButton").on("click", function () {
    $(".workoutChoices").css("visibility", "visible")
});

{
    document.addEventListener("DOMContentLoaded", function () {
        const exerciseListButtons = document.querySelectorAll('.workoutChoices li');
        const selectWorkoutForm = document.querySelector('.selectForm');
        const exercisesCheckboxContainer = document.querySelector('.checkboxContainer');
        const exerciseList = document.querySelector("#exercise");
        const exerciseHeadingButton = document.querySelector('.Checkbox-Heading');
        const formInstructions = document.querySelector('.Form-Instructions');
        console.log(exerciseHeadingButton);

        // Function: Make "Exercises:" Heading in Checkbox Container On Click Go Back to Workout Choices
        exerciseHeadingButton.addEventListener('click', function () {
            console.log("Exercise heading button clicked.");
            selectWorkoutForm.style.display = 'block'; // Show the Select Form
            exercisesCheckboxContainer.style.display = 'none'; // Hide the Exercise List
        });
        var clonedExerciseListItem; // Declare Variable Outside Event Listener

        // Function: Display Exercise List With Checkboxes When a Workout Choice is Made in WorkoutChoices Menu
        exerciseListButtons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                console.log(event.target.dataset.category);
                document.querySelector('.workoutChoices').style.visibility = 'hidden'; // Hide the Workout Types List
                exercisesCheckboxContainer.style.visibility = 'visible'; // Show the Checkbox Container
                selectWorkoutForm.style.display = 'none'; // Hide Select Form
                exercisesCheckboxContainer.style.display = 'block'; // Show Checkbox Container
                fetchDataFromEndpoint("exercise", "category=" + event.target.dataset.category).then(function (response) { // Populate Checkbox Container With Relevant Workouts
                    var exercises = response.results;
                    console.log(exercises);
                    for (let i = 0; i < exercises.length; i += 1) {
                        let exercise = exercises[i];
                        console.log(exercise);
                        let exerciseListItem = document.createElement("li");
                        let exerciseListItemBox = document.createElement("input");
                        exerciseListItemBox.setAttribute("type", "checkbox"); // Set Type Attribute For Checkbox
                        exerciseListItemBox.setAttribute("value", exercise.name); // Set Value Attribute For Checkbox
                        exerciseListItem.appendChild(exerciseListItemBox); // Append Checkbox to List Item

                        // Function: Closure to Capture Correct Exercise Item
                        (function (exerciseItem) {
                            clonedExerciseListItem;
                            var userExerciseList = document.getElementById('exerciseList');
                            exerciseListItemBox.addEventListener('change', function () {

                                // Function: Add Selected Exercises to Workout Planner exerciseList
                                if (exerciseListItemBox.checked) {
                                    console.log(exerciseListItemBox);
                                    var exerciseListItemWithoutCheckbox = document.createElement('li');
                                    var exerciseNameWithoutCheckbox = document.createTextNode(exercise.name);
                                    exerciseListItemWithoutCheckbox.appendChild(exerciseNameWithoutCheckbox);

                                    // Function: Create a Text Input For Entering Time or Reps For Each Selected Exercise
                                    var timeRepsInput = document.createElement('input');
                                    timeRepsInput.setAttribute('type', 'text');
                                    timeRepsInput.setAttribute('placeholder', 'Time/Reps');

                                    // Function: Create a Checkbox For Completion Status For Each Selected Exercise
                                    var completionCheckbox = document.createElement('input');
                                    completionCheckbox.setAttribute('type', 'checkbox');
                                    completionCheckbox.setAttribute('id', 'completionCheckbox');
                                    var completionLabel = document.createElement('label');
                                    completionLabel.setAttribute('for', 'completionCheckbox');
                                    completionLabel.textContent = "Completed";

                                    // Functiion: Append Input and Checkbox Elements to the Workout Planner
                                    exerciseListItemWithoutCheckbox.appendChild(timeRepsInput);
                                    exerciseListItemWithoutCheckbox.appendChild(completionCheckbox);
                                    exerciseListItemWithoutCheckbox.appendChild(completionLabel);
                                    userExerciseList.appendChild(exerciseListItemWithoutCheckbox); // Append Exercise Name Without Checkbox to Workout Planner

                                } else {
                                    if (clonedExerciseListItem) {
                                        clonedExerciseListItem.remove(); // Remove exerciseListItem From the workoutPlanner if the Checkbox is Unchecked
                                    }
                                };
                            });
                        })(exercise);

                        var exerciseName = document.createTextNode(exercise.name); // Create Text Node For Exercise Name
                        exerciseListItem.appendChild(exerciseName); // Append Exercise Name to List Item
                        exerciseList.appendChild(exerciseListItem); // Append List Item to Exercise List
                    };
                    formInstructions.style.display = 'none'; // Hide Form Instructions Once the Checkbox Items Have Appeared


                });
            });
        });

        // Function: Use the "Exercise" Button to Go Back to Exercise Types
        const checkboxHeadingButton = document.getElementById('checkbox-heading-button');
        if (checkboxHeadingButton) {
            checkboxHeadingButton.addEventListener('click', () => {
                const selectWorkoutForm = document.querySelector('.selectForm');
                if (selectForm) {
                    selectWorkoutForm.scrollIntoView({ behavior: 'smooth' });
                };
            });
        }
    });
};

// Function: "Begin Workout" Button To Display Workout Planner
document.addEventListener('DOMContentLoaded', function () {
    var startWorkoutButton = document.getElementById('startWorkout');
    var mainContent = document.getElementById('mainContent');
    var workoutPlanner = document.getElementById('workoutPlanner');
    startWorkoutButton.addEventListener('click', function () {
        mainContent.style.display = 'none';
        workoutPlanner.style.display = 'block';
    });
});

// Function: Display Workout Message Based On Workout Choice Made By User
const workoutChoicesCategories = document.querySelectorAll('.workoutChoices li'); // Get List of Workout Choices
workoutChoicesCategories.forEach(item => { // Add Click Event Listener to Each List Item
    item.addEventListener('click', function () {
        const selectedCategory = item.textContent.trim(); // Get Text Content of Clicked Item
        console.log(selectedCategory);
        const workoutMessage = document.getElementById('workoutMessage'); // Update Workout Message Based On Selected Workout Category
        switch (selectedCategory) {
            case 'Complete Arm Workout':
                workoutMessage.textContent = 'Today is Arm Day - Get those biceps pumping!';
                break;
            case 'Leg Workout':
                workoutMessage.textContent = 'Today is Leg Day - Strengthen those legs!';
                break;
            case 'Calves Workout':
                workoutMessage.textContent = 'Today is Calves Day - Tone those calves!';
                break;
            case 'Upper Body Workout':
                workoutMessage.textContent = 'Today is Upper Body Day - Build a strong upper body!';
                break;
            case 'Back Workout':
                workoutMessage.textContent = 'Today is Back Day - Strengthen your back!';
                break;
            case 'Shoulder Workout':
                workoutMessage.textContent = 'Today is Shoulder Day - Bulk up your shoulders!';
                break;
            case 'Ab Workout':
                workoutMessage.textContent = 'Today is Ab Day - Work on those core muscles!';
                break;
            case 'Cardio Workout':
                workoutMessage.textContent = 'Today is Cardio Day - Get your heart pumping with these cardio workouts!';
                break;
            case 'Rest Day':
                workoutMessage.textContent = 'Today is Rest Day - Relax, recover, and reward yourself!';
                break;
            default:
                workoutMessage.textContent = 'Your Workout List:';
        };
    });
});


// Code for a timer to appear and begin counting up when the 'Begin Workout' button is pressed
var minutesLabel = document.getElementById("minutes")
var secondsLabel = document.getElementById("seconds")
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
    ++totalSeconds
    secondsLabel.innerHTML = pad(totalSeconds % 60)
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString
    }
}