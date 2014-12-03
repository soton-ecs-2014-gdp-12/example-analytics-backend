/* jshint browser: true */
/*global angular:true */
/*global createScatter:true */
/*global createBar:true */
/*global getQuestionData:true */

(function() {
	"use strict";

	var eventTable = document.getElementById("event-table");

	var viewingPeriodsTable = document.getElementById("periods-table");
	var heatMapTable = document.getElementById("heat-map-table");
	var viewPercentageTable = document.getElementById("percentage-viewed-table");
	var questionDetails = document.getElementById("question-details");
	var questionTime = document.getElementById("question-time");

	var socket = new WebSocket("ws://localhost:5001/");

	var events = [];
	var questionData = getQuestionData();

	//does the init and creates the barebones questions
	createQuestionGraphs(questionData, {});
	//createTimeViewedScatter(questionData, {});

	socket.onmessage = function (event) {
		var parsedEvent = JSON.parse(event.data);
		events.push(parsedEvent);
		console.log(events);
		addEvent(parsedEvent);
		updateEvents();
	};

	function getVideoLength() {
		var VIDEO_LENGTH = 596;  // TODO: actually get this value
		return VIDEO_LENGTH;
	}

	function updateEvents(){
		console.log("updating");

		var eventsByUser = splitEventsByUser(events);
		var combinedPeriodsByUser = {};
		var percentViewedByUser = {};
		var heatMapByUser = {};
		var answersByUser = {};

		for(var uuid in eventsByUser) {
			var periods = eventsToPeriods(eventsByUser[uuid]);

			var combinedPeriods = combineOverlappingPeriods(periods);
			combinedPeriodsByUser[uuid] = combinedPeriods;

			var percentViewed = sumSecondsViewed(combinedPeriods) / getVideoLength() * 100;
			percentViewedByUser[uuid] = percentViewed;

			var heatMap = makeHeatMap(periods, getVideoLength());
			heatMapByUser[uuid] = heatMap;

			var questionAnswers = getQuestionAnswers(eventsByUser[uuid]);
			answersByUser[uuid] = questionAnswers;
		}

		displayPercentViewed(percentViewedByUser);
		showPeriods(combinedPeriodsByUser);
		createQuestionGraphs(questionData, answersByUser);
		//createTimeViewedScatter(questionData, answersByUser);

		var periodsAllEvents = eventsToPeriods(events);
		var heatMapAllEvents = makeHeatMap(periodsAllEvents, getVideoLength());
		showHeatMap(heatMapAllEvents);
		showHeatmapOnVideo(heatMapAllEvents);
	}

	function splitEventsByUser(eventList) {
		var groupedEvents = {};

		for(var i = 0; i < eventList.length; i++) {
			if(events[i].uuid in groupedEvents) {
				groupedEvents[events[i].uuid].push(eventList[i]);
			}else{
				groupedEvents[events[i].uuid] = [eventList[i]];
			}
		}

		return groupedEvents;
	}


	function showHeatmapOnVideo(frequencyList){
		var videoView = document.getElementById('videoView');
		var videoElementScope = angular.element(videoView).scope();
		if(videoElementScope !== null) {
			videoElementScope.$$childHead.addSections(frequencyList);
			videoElementScope.$$childHead.$apply();
		}
	}

	function getQuestionAnswers(events) {
		var i = 0;
		var answers = {};
		while(i < events.length) {
			var questionId;

			while(i < events.length && events[i].name !== 'show_question') {
				i++;
			}

			if(i < events.length && events[i].name === 'show_question') {
				var showEvent = events[i];
				questionId = showEvent.details.showQuestion.id;

				while(i < events.length && events[i].name !== 'submitted_question') {
					i++;
				}

				if(i < events.length && events[i].name === 'submitted_question') {
					console.log(events[i]);
					console.log(showEvent);
					answers[questionId] = {'answer' : events[i].details.result, 'timeTaken': (new Date(events[i].time) - new Date(showEvent.time)) / 1000};
				}else{
					return answers;
				}
			}else{
				return answers;
			}
		}
	}

	function eventsToPeriods(events) {
		var periods = [];
		var i = 0;
		var event;
		var currentPeriod;
		while (i < events.length) {
			currentPeriod = {};

			event = events[i];

			while (i < events.length && event.name !== "play") {
				i++;
				event = events[i];
			}

			if (i >= events.length) {
				break;
			}

			currentPeriod.start = new Date(event.details.time);
			i++;

			if (i >= events.length) {
				break;
			}

			event = events[i];

			while (i < events.length && event.name !== "pause" && event.name !== "stop") {
				i++;
				event = events[i];
			}

			if (i >= events.length) {
				break;
			}

			currentPeriod.end = new Date(event.details.time);

			periods.push(currentPeriod);

			i++;
		}

		return periods;
	}

	function combineOverlappingPeriods(inputPeriods) {
		var periods = inputPeriods.slice(0);
		periods.sort(function(a, b) {
			return a.end >= b.end;
		});

		var combinedPeriods = [];

		while (periods.length !== 0) {
			var last = periods.pop();

			if (periods.length === 0) {
				combinedPeriods.push(last);
				break;
			}

			var beforeLast = periods.pop();

			if (beforeLast.end < last.start) {
				combinedPeriods.push(last);

				periods.push(beforeLast);
			} else {
				if (beforeLast.start >= last.start) {
					periods.push(last);
				} else {
					periods.push({
						start: beforeLast.start,
						end: last.end
					});
				}
			}
		}

		return combinedPeriods;
	}

	function sumSecondsViewed(combinedPeriods) {
		var msSum = 0;
		for (var i = 0; i < combinedPeriods.length; i++) {
			msSum += combinedPeriods[i].end - combinedPeriods[i].start;
		}
		return msSum / 1000;
	}

	function makeHeatMap(periods, videoLength) {
		// Extract start and end times into array
		var sectionPoints = [0];
		function addSectionPoint(time) {
			if (sectionPoints.indexOf(time) === -1) {
				sectionPoints.push(time);
			}
		}
		for (var i in periods) {
			var period = periods[i];
			addSectionPoint(period.start.valueOf());
			addSectionPoint(period.end.valueOf());
		}
		addSectionPoint(videoLength * 1000);
		sectionPoints.sort();

		// Pair up into sections
		function pointsToIntervals(points) {
			var sections = [];
			for (var i = 0; i < points.length - 1; i++) {
				sections.push({
					start: points[i],
					end: points[i+1],
				});
			}
			return sections;
		}
		var sections = pointsToIntervals(sectionPoints);

		// Count periods containing each section
		function intervalContainsInterval(interval1, interval2) {
			return interval1.start <= interval2.start && interval2.end <= interval1.end;
		}
		for (var iS in sections) {
			var section = sections[iS];
			var numPeriods = 0;
			for (var iP in periods) {
				if (intervalContainsInterval(periods[iP], section)) {
					numPeriods++;
				}
			}
			section.frequency = numPeriods;
		}

		function combineSections(sections) {
			if (sections.length === 0) return [];
			var combinedSections = [];
			var nextCombinedSection = sections[0];
			for (var i = 1; i < sections.length; i++) {
				var section = sections[i];
				if (section.frequency === nextCombinedSection.frequency) {
					nextCombinedSection.end = section.end;
				} else {
					combinedSections.push(nextCombinedSection);
					nextCombinedSection = section;
				}
			}
			combinedSections.push(nextCombinedSection);
			return combinedSections;
		}

		return combineSections(sections);
	}

	function createTableRow(items) {
		var tr = document.createElement('tr');

		for (var i in items) {
			var item = items[i];
			var td = document.createElement('td');
			td.textContent = item;
			tr.appendChild(td);
		}

		return tr;
	}

	function addEvent(event) {
		var tr = createTableRow([event.time, event.uuid, event.name, JSON.stringify(event.details, null, 4)]);
		eventTable.appendChild(tr);
	}

	function showPeriods(periodsByUser) {
		viewingPeriodsTable.innerHTML = "";
		for(var uuid in periodsByUser) {
			periodsByUser[uuid].forEach(function(period) {
				var tr = createTableRow([uuid, (period.start.valueOf() / 1000).toFixed(2).toString() + " seconds", (period.end.valueOf() / 1000).toFixed(2).toString() + " seconds"]);
				viewingPeriodsTable.appendChild(tr);
			});
		}
	}

	function showHeatMap(heatMap) {
		heatMapTable.innerHTML = "";
		heatMap.forEach(function(section) {
			var tr = createTableRow([(section.start / 1000).toFixed(2).toString() + " seconds", (section.end / 1000).toFixed(2).toString() + " seconds", section.frequency]);
			heatMapTable.appendChild(tr);
		});
	}

	function displayPercentViewed(percentViewedByUser) {
		viewPercentageTable.innerHTML = "";
		var averagePercentage = 0;
		var keys = 0;
		for(var uuid in percentViewedByUser) {
			keys++;
			var tr = createTableRow([uuid, percentViewedByUser[uuid].toFixed(2).toString() + "%", ((percentViewedByUser[uuid] * getVideoLength()) / 100).toFixed(2).toString() + " seconds"] );
			viewPercentageTable.appendChild(tr);
			averagePercentage += percentViewedByUser[uuid];
		}

		averagePercentage /= keys;

		var finalTr = createTableRow(['Average', averagePercentage.toFixed(2).toString() + "%", ((averagePercentage * getVideoLength()) / 100).toFixed(2).toString() + " seconds"]);
		viewPercentageTable.appendChild(finalTr);
	}

	function createQuestionGraphs(questionData, answersByUser) {
		questionDetails.innerHTML = "";
		var dataset = getAllResults(questionData, answersByUser);

		for(var questionSet in questionData) {
			for(var item in questionData[questionSet].items) {
				var question = questionData[questionSet].items[item];

				var questionDiv = document.createElement('div');
				questionDetails.appendChild(questionDiv);

				var title = document.createElement('h3');
				questionDiv.appendChild(title);
				title.innerHTML = "Question: " + question.question;

				if(question.correctAnswer !== undefined) {
					var correctAnswerDiv = document.createElement('div');
					questionDiv.appendChild(correctAnswerDiv);
					correctAnswerDiv.innerHTML = "The correct answer was " + question.correctAnswer;
				}

				var barChart = document.createElement('div');
				questionDiv.appendChild(barChart);
				barChart.setAttribute('id', '#chart-' + question.id);

				createBar(barChart, dataset[question.id]);

			}
		}

	}

	function getAllResults(questionData, answersByUser) {
		var dataset = {};
		var questionId;
		var answer;

		for(var questionSet in questionData) {
			for(var item in questionData[questionSet].items) {
				var question = questionData[questionSet].items[item];

				if(!(question.id in dataset)) {
					dataset[question.id] = {};
				}
				for(var possibleAnswer in question.options) {
					if(!(possibleAnswer in dataset[question.id])) {
						dataset[question.id][question.options[possibleAnswer].name] = 0;
					}
				}
			}
		}

		for(var uuid in answersByUser) {
			for(questionId in answersByUser[uuid]) {
				answer = answersByUser[uuid][questionId].answer;
				dataset[questionId][answer]++;
			}
		}

		var barChartDataset = {};
		for(questionId in dataset) {
			barChartDataset[questionId] = [];
			for(answer in dataset[questionId]) {
				barChartDataset[questionId].push({'name' : answer, 'value': dataset[questionId][answer]});
			}
		}

		return barChartDataset;
	}

	function createTimeViewedScatter(questionData, answersByUser) {
		questionTime.innerHTML = '';

		var correctAnswers = {};
		for(var questionSet in questionData) {
			for (var item in questionData[questionSet].items) {
				var question = questionData[questionSet].items[item];
				correctAnswers[question.id] = question.correctAnswer;
			}
		}

		var heading = document.createElement('h3');
		questionTime.appendChild(heading);
		heading.innerHTML = 'Correlation between time taken and correctly answered questions';

		var scatter = document.createElement('div');
		questionTime.appendChild(scatter);
		scatter.setAttribute('id', '#scatter-time');

		var dataset = [];
		for(var uuid in answersByUser) {
			for(var questionId in answersByUser[uuid]) {
				var answer = answersByUser[uuid][questionId];
				var correct = (answer.answer === correctAnswers[questionId] ? 0 : 1);

				dataset.push([answer.timeTaken, correct]);
			}
		}

		createScatter(scatter, dataset);

		console.log(answersByUser);
	}

})();
