const NAMESPACE = "io.github.artenes.procrastinationdo";
const TASKSKEY = NAMESPACE + ".tasks";

var inputToday = document.getElementById("inputToday");
var inputTask = document.getElementById("inputTask");
var ulTasks = document.getElementById("ulTasks");
var today = new Date();

var readTasks = function() {
    var rawTasks = window.localStorage.getItem(TASKSKEY) || "[]";
    return JSON.parse(rawTasks);
}

var writeTasks = function(tasks) {
    var json = JSON.stringify(tasks);
    window.localStorage.setItem(TASKSKEY, json);
}

var getDate = function() {
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (('0' + today.getDate()).slice(-2));
}

var howManyDaysSince = function(rawDate) {
    var dateParts = rawDate.split("-");
    var currentDays = toDays(today.getFullYear(), today.getMonth(), today.getDate());
    var taskDays = toDays(parseInt(dateParts[0]), (parseInt(dateParts[1]) - 1), parseInt(dateParts[2]));
    var difference = currentDays - taskDays;
    return difference;
}

var toDays = function(year, month, days) {
    return (year * 365) + (month * 30) + days;
}

var convertDaysToEm = function(days) {
    return 1 + (days * 0.1);
}

var createTaskFromInputs = function () {
    var task = inputTask.value;
    var date = getDate();
    var id = Date.now(); //use timestamp as an id, is unique enough
    return {
        id: id,
        name: task,
        date: date
    }
}

var addTask = function(task) {
    var tasks = readTasks();
    tasks.push(task);
    writeTasks(tasks);
    orderAndRedrawTasks(tasks);
}

var updateTask = function(taskData) {
    var tasks = readTasks();
    var task = tasks.find(item => item.id == taskData.id);
    task.name = taskData.name;
    writeTasks(tasks);
}

var orderAndRedrawTasks = function (tasks) {
    var reversedList = tasks.reverse();
    redrawTasks(reversedList);
}

var redrawTasks = function (tasks) {
    ulTasks.innerHTML = "";
    for (var index = 0; index < tasks.length; index++) {
        var task = tasks[index];
        var li = document.createElement("li");
        var inputText = document.createElement("input");
        var inputDate = document.createElement("input");
        var labelDate = document.createElement("label");
        var em = convertDaysToEm(howManyDaysSince(task.date));
        var textId = "task-" + task.id;
        var dateId = "date-" + task.id;

        inputText.setAttribute("id", textId);
        inputText.setAttribute("type", "text");
        inputText.setAttribute("value", task.name);
        inputText.setAttribute("style", "font-size: "+em+"em");
        inputText.addEventListener("input", onTaskTextChanged);

        labelDate.setAttribute("for", dateId);
        labelDate.innerHTML = "Created at";
        inputDate.setAttribute("id", dateId)
        inputDate.setAttribute("type", "date");
        inputDate.setAttribute("value", task.date);
        inputDate.setAttribute("style", "font-size: "+em+"em");
        inputDate.setAttribute("disabled", "disabled");
        
        li.appendChild(inputText);
        li.appendChild(document.createElement("br"));
        li.appendChild(labelDate);
        li.appendChild(inputDate);
        
        ulTasks.appendChild(li);
    }
}

var onEnterPressed = function (event) {
    if (event.key === "Enter" && event.target.value) {
        addTask(createTaskFromInputs())
        event.target.value = "";
    }
}

var onTaskTextChanged = function (event) {
    var taskId = event.target.id.split("-")[1];
    var newText = event.target.value;
    var taskData = {
        id: taskId,
        name: newText
    };
    updateTask(taskData);
}

var onTodayChanged = function (event) {
    var newDate = event.target.value;
    var dateParts = newDate.split("-");
    today = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
    var tasks = readTasks();
    orderAndRedrawTasks(tasks);
}

var init = function () {
    var tasks = readTasks();
    orderAndRedrawTasks(tasks);
    inputToday.value = getDate();
    inputTask.addEventListener("keyup", onEnterPressed);
    inputToday.addEventListener("change", onTodayChanged);
}

/*document.getElementById("button").addEventListener("click", function () {
    today.setDate(today.getDate() + 1);
    inputToday.value = getDate();
    var tasks = readTasks();
    orderAndRedrawTasks(tasks);  
});*/

init();
