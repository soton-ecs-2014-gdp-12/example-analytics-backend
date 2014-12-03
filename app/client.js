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


	var staticEvents = JSON.parse('[{"time":"2014-12-03T12:29:02.409Z","name":"play","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":0}},{"time":"2014-12-03T12:29:13.414Z","name":"play","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":0}},{"time":"2014-12-03T12:29:20.175Z","name":"play","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":0}},{"time":"2014-12-03T12:29:20.732Z","name":"show_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"showQuestion":{"id":"name","type":"single","question":"The Caesar Cipher is a type of...","options":[{"name":"Substitution Cipher"},{"name":"Alphabet Code"},{"name":"Polyalphabetic Cipher"}],"correctAnswer":"Substitution Cipher"}}},{"time":"2014-12-03T12:29:20.738Z","name":"pause","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":"1970-01-01T00:00:18.224Z"}},{"time":"2014-12-03T12:29:24.641Z","name":"submitted_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"result":"Substitution Cipher"}},{"time":"2014-12-03T12:29:24.650Z","name":"end_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"endAnnotation":"first-question"}},{"time":"2014-12-03T12:29:24.664Z","name":"play","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":"1970-01-01T00:00:18.224Z"}},{"time":"2014-12-03T12:29:31.734Z","name":"show_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"showQuestion":{"id":"name","type":"single","question":"The Caesar Cipher is a type of...","options":[{"name":"Substitution Cipher"},{"name":"Alphabet Code"},{"name":"Polyalphabetic Cipher"}],"correctAnswer":"Substitution Cipher"}}},{"time":"2014-12-03T12:29:31.744Z","name":"pause","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":"1970-01-01T00:00:18.241Z"}},{"time":"2014-12-03T12:29:32.945Z","name":"submitted_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"result":"Polyalphabetic Cipher"}},{"time":"2014-12-03T12:29:32.955Z","name":"show_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"showQuestion":{"id":"check-name","type":"single","question":"Answer incorrect, do you want to review the video","options":[{"name":"Yes"},{"name":"No"}]}}},{"time":"2014-12-03T12:29:34.929Z","name":"submitted_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"result":"No"}},{"time":"2014-12-03T12:29:34.939Z","name":"end_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"endAnnotation":"first-question"}},{"time":"2014-12-03T12:29:34.946Z","name":"play","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":"1970-01-01T00:00:18.241Z"}},{"time":"2014-12-03T12:29:38.461Z","name":"show_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"showQuestion":{"id":"name","type":"single","question":"The Caesar Cipher is a type of...","options":[{"name":"Substitution Cipher"},{"name":"Alphabet Code"},{"name":"Polyalphabetic Cipher"}],"correctAnswer":"Substitution Cipher"}}},{"time":"2014-12-03T12:29:38.467Z","name":"pause","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":"1970-01-01T00:00:18.192Z"}},{"time":"2014-12-03T12:29:56.488Z","name":"show_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"showQuestion":{"id":"time","type":"single","recordsResponse":true,"question":"How long did the Caesar Cipher remain unbroken...","options":[{"name":"50 years"},{"name":"1000 years"},{"name":"800 years"}],"correctAnswer":"800 years"}}},{"time":"2014-12-03T12:29:56.514Z","name":"pause","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":"1970-01-01T00:00:50.031Z"}},{"time":"2014-12-03T12:30:00.267Z","name":"submitted_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"result":"1000 years"}},{"time":"2014-12-03T12:30:00.473Z","name":"show_results","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"showResults":{"id":"second-question-results","questionId":"time","results":{"1000 years":2,"50 years":0,"800 years":0},"type":"single"}}},{"time":"2014-12-03T12:30:02.087Z","name":"continue_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32"},{"time":"2014-12-03T12:30:02.097Z","name":"end_question","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"endAnnotation":"second-question"}},{"time":"2014-12-03T12:30:02.106Z","name":"play","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":"1970-01-01T00:00:50.031Z"}},{"time":"2014-12-03T12:30:06.079Z","name":"submitted_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"result":"Alphabet Code"}},{"time":"2014-12-03T12:30:06.090Z","name":"show_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"showQuestion":{"id":"check-name","type":"single","question":"Answer incorrect, do you want to review the video","options":[{"name":"Yes"},{"name":"No"}]}}},{"time":"2014-12-03T12:30:06.769Z","name":"show_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"showQuestion":{"id":"time","type":"single","recordsResponse":true,"question":"How long did the Caesar Cipher remain unbroken...","options":[{"name":"50 years"},{"name":"1000 years"},{"name":"800 years"}],"correctAnswer":"800 years"}}},{"time":"2014-12-03T12:30:06.786Z","name":"pause","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":"1970-01-01T00:00:50.067Z"}},{"time":"2014-12-03T12:30:07.906Z","name":"submitted_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"result":"No"}},{"time":"2014-12-03T12:30:07.917Z","name":"end_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"endAnnotation":"first-question"}},{"time":"2014-12-03T12:30:07.928Z","name":"play","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":"1970-01-01T00:00:18.192Z"}},{"time":"2014-12-03T12:30:10.947Z","name":"submitted_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"result":"50 years"}},{"time":"2014-12-03T12:30:11.145Z","name":"show_results","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"showResults":{"id":"second-question-results","questionId":"time","results":{"1000 years":2,"50 years":1,"800 years":0},"type":"single"}}},{"time":"2014-12-03T12:30:12.399Z","name":"continue_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3"},{"time":"2014-12-03T12:30:12.408Z","name":"end_question","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"endAnnotation":"second-question"}},{"time":"2014-12-03T12:30:12.421Z","name":"play","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":"1970-01-01T00:00:50.067Z"}},{"time":"2014-12-03T12:30:16.123Z","name":"pause","uuid":"3743a9a1-dcf0-4922-8b43-6f84d0ca1d32","details":{"time":"1970-01-01T00:01:04.056Z"}},{"time":"2014-12-03T12:30:21.123Z","name":"play","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"time":0}},{"time":"2014-12-03T12:30:33.006Z","name":"play","uuid":"b452f9eb-5f79-4872-86bf-7e1322e9da58","details":{"time":0}},{"time":"2014-12-03T12:30:36.035Z","name":"pause","uuid":"b452f9eb-5f79-4872-86bf-7e1322e9da58","details":{"time":"1970-01-01T00:00:02.942Z"}},{"time":"2014-12-03T12:30:39.411Z","name":"show_question","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"showQuestion":{"id":"name","type":"single","question":"The Caesar Cipher is a type of...","options":[{"name":"Substitution Cipher"},{"name":"Alphabet Code"},{"name":"Polyalphabetic Cipher"}],"correctAnswer":"Substitution Cipher"}}},{"time":"2014-12-03T12:30:39.417Z","name":"pause","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"time":"1970-01-01T00:00:18.193Z"}},{"time":"2014-12-03T12:30:39.758Z","name":"show_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"showQuestion":{"id":"time","type":"single","recordsResponse":true,"question":"How long did the Caesar Cipher remain unbroken...","options":[{"name":"50 years"},{"name":"1000 years"},{"name":"800 years"}],"correctAnswer":"800 years"}}},{"time":"2014-12-03T12:30:39.776Z","name":"pause","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":"1970-01-01T00:00:50.071Z"}},{"time":"2014-12-03T12:30:42.289Z","name":"submitted_question","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"result":"Substitution Cipher"}},{"time":"2014-12-03T12:30:42.300Z","name":"end_question","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"endAnnotation":"first-question"}},{"time":"2014-12-03T12:30:42.317Z","name":"play","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"time":"1970-01-01T00:00:18.193Z"}},{"time":"2014-12-03T12:30:44.883Z","name":"submitted_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"result":"800 years"}},{"time":"2014-12-03T12:30:45.060Z","name":"show_results","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"showResults":{"id":"second-question-results","questionId":"time","results":{"1000 years":2,"50 years":1,"800 years":1},"type":"single"}}},{"time":"2014-12-03T12:30:46.391Z","name":"continue_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51"},{"time":"2014-12-03T12:30:46.404Z","name":"end_question","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"endAnnotation":"second-question"}},{"time":"2014-12-03T12:30:46.417Z","name":"play","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":"1970-01-01T00:00:50.071Z"}},{"time":"2014-12-03T12:30:50.357Z","name":"pause","uuid":"94a28b5d-3e30-4e87-9e2e-f951fcadbf51","details":{"time":"1970-01-01T00:00:54.018Z"}},{"time":"2014-12-03T12:31:02.209Z","name":"pause","uuid":"36f66e09-8c36-4e3c-8078-b7cc5bdf1af3","details":{"time":"1970-01-01T00:01:39.871Z"}},{"time":"2014-12-03T12:31:06.226Z","name":"pause","uuid":"b3b9d48e-cc7b-4d27-acb2-6d2095ccaf74","details":{"time":"1970-01-01T00:00:42.099Z"}}]');
	console.log("Adding some static events");
	for(var i in staticEvents){
		events.push(staticEvents[i]);
		addEvent(staticEvents[i]);
	}
	updateEvents();

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
