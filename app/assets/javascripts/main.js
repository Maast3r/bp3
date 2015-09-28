var jsonData;
var instanceIDHash = {};
var assigneeHash = {};
var answers = ["Open, Closed: ", "Open, Closed: ", "Name: ", "# of Tasks: ",  "Open, Closed: "];

$.getJSON("task-2.json", function(json){
	jsonData = json;
    hashData(json);
});

function hashData(json){
	for(var data in json){
		if(!instanceIDHash[json[data].instanceId]){
			instanceIDHash[json[data].instanceId] = [];
		}
		instanceIDHash[json[data].instanceId].push(json[data]);

		if(!assigneeHash[json[data].assignee]){
			assigneeHash[json[data].assignee] = [];
		}
		assigneeHash[json[data].assignee].push(json[data]);
	}
}

/**
	Given a specific date provide the current number of open and closed 
	tasks. The date is inclusive so if we ask for midnight Oct 12, a task 
	opened or closed on midnight would count
**/
function dateOpenClosedTasks(json, date){
	var givenDate = new Date(date);
	var open = 0;
	var closed = 0;
	for(var data in json){
		var taskStart = new Date(json[data].createDate);
		var taskEnd = json[data].closeDate;
		if(taskEnd != null){
			taskEnd = new Date(taskEnd);
			if(taskStart <= givenDate && givenDate <= taskEnd){
				// Ask whether or not to include these
				// Gracelyn answered no, just add ones with null end dates
			} else if(givenDate >= taskEnd){
				closed++;
			}
		} else {
			if(taskStart <= givenDate){
				open++;
			}
		}
	}
	return [open, " " + closed];
}

/**
	Given a specific start and end date, how many tasks were opened 
	and how many were closed in that range. The start date is inclusive, 
	the end date is exclusive.
**/
function startEndOpenClosedTasks(json, start, end){
	var open = 0;
	var closed = 0;
	var givenStart = new Date(start);
	var givenEnd = new Date(end);
	for(var data in json){
		var taskStart = new Date(json[data].createDate);
		var taskEnd = json[data].closeDate;
		if(taskEnd != null){
			taskEnd = new Date(taskEnd);
			if(givenStart <= taskStart && taskStart <= givenEnd){
				open++;
			} else if(givenStart <= taskEnd && taskEnd <= givenEnd){
				closed++;
			}
		}
	}
	return [open, " " + closed];
}

/**
	Given a particular instanceId, provide the name of the most recent task.
**/
function mostRecentTask(givenInstanceID){
	var mostRecent = ['Cannot find that instance ID', "0000-01-00T00:00:00"];
	for(var task in instanceIDHash[givenInstanceID]){
		if(instanceIDHash[givenInstanceID][task].createDate >= mostRecent[1]){
			mostRecent[0] = instanceIDHash[givenInstanceID][task].name;
			mostRecent[1] = instanceIDHash[givenInstanceID][task].createDate;
		}
	}
	return mostRecent[0];
}

/**
	Given a particular instanceId, provide the count of tasks.
**/
function taskCount(givenInstanceID){
	return instanceIDHash[givenInstanceID].length
}

/**
	Given a particular assignee, provide the count of open and closed tasks 
	for that assignee.
**/
function assigneeOpenClosed(assignee){
	var openTasks = 0;
	var closedTasks = 0;
	var today = new Date();
	for(var task in assigneeHash[assignee]){
		var taskStart = new Date(assigneeHash[assignee][task].createDate);
		var taskEnd = assigneeHash[assignee][task].closeDate;
		if(taskEnd != null){
			taskEnd = new Date(taskEnd);
			if(taskStart <= today && today <= taskEnd){
				// Ask whether or not to include these
				// Gracelyn answered no, just add ones with null end dates
			} else if(today >= taskEnd){
				closedTasks++;
			}
		} else {
			if(taskStart <= today){
				openTasks++;
			}
		}
	}
	return [openTasks, " " + closedTasks];
}

function solve(buttonID){
	var result, answerSpan;
	if(buttonID != 2){
		var input = document.getElementById(buttonID + "field").value;
		if(buttonID == 1){
			result = dateOpenClosedTasks(jsonData, input);
		} else if(buttonID == 3){
			result = mostRecentTask(input);
		} else if(buttonID == 4){
			result = taskCount(input);
		} else{
			result = assigneeOpenClosed(input);
		}
	} else {
		var input1 = document.getElementById(buttonID + "field1").value;
		var input2 = document.getElementById(buttonID + "field2").value;
		result = startEndOpenClosedTasks(jsonData, input1, input2);
	}
	answerSpan = document.getElementById("answer"+buttonID);
	answerSpan.innerHTML = answers[buttonID-1] + " " + result;
}