"use strict";

//Set up the tabbing, needs one per tab

$('#fullEvents a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

$('#home a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});


