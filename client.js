/* jshint browser: true */

(function() {
	"use strict";

	var eventTable = document.getElementById("event-table");

	var viewingPeriodsTable = document.getElementById("periods-table");

	var socket = new WebSocket("ws://localhost:5000/");

	var events = [];

	socket.onmessage = function (event) {
		var parsedEvent = JSON.parse(event.data);
		events.push(parsedEvent);

		addEvent(parsedEvent);

		var combinedPeriods = combineOverlappingPeriods(eventsToPeriods(events));
		var VIDEO_LENGTH = 596;  // TODO: actually get this value
		var percentViewed = sumSecondsViewed(combinedPeriods) / VIDEO_LENGTH * 100;

		viewingPeriodsTable.innerHTML = "";
		showPeriods(combinedPeriods);
		displayPercentViewed(percentViewed);
	};

	function eventsToPeriods(events) {
		var periods = [];

		var i = 0;
		var event;
		var currentPeriod;
		while (i < events.length) {
			currentPeriod = {};

			event = events[i];

			while (event.name !== "play") {
				i++;
				event = events[i];
			}

			currentPeriod.start = new Date(event.details.time);

			i++;

			if (i >= events.length) {
				break;
			}

			event = events[i];

			while (event.name !== "pause" && event.name !== "stop") {
				i++;
				event = events[i];
			}

			currentPeriod.end = new Date(event.details.time);

			periods.push(currentPeriod);

			i++;
		}

		return periods;
	}

	function combineOverlappingPeriods(periods) {
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

	function addEvent(event) {
		var tr = document.createElement("tr");

		var timeTd = document.createElement("td");
		timeTd.textContent = event.time;
		tr.appendChild(timeTd);

		var nameTd = document.createElement("td");
		nameTd.textContent = event.name;
		tr.appendChild(nameTd);

		var detailsTd = document.createElement("td");
		detailsTd.textContent = JSON.stringify(event.details, null, 4);
		tr.appendChild(detailsTd);

		eventTable.appendChild(tr);
	}

	function showPeriods(periods) {
		periods.forEach(function(period) {
			var tr = document.createElement("tr");

			var startTd = document.createElement("td");
			startTd.textContent = period.start;
			tr.appendChild(startTd);

			var endTd = document.createElement("td");
			endTd.textContent = period.end;
			tr.appendChild(endTd);

			viewingPeriodsTable.appendChild(tr);
		});
	}

	function displayPercentViewed(percentViewed) {
		document.getElementById('percentViewed').textContent = percentViewed;
	}
})();
