var code_length = 5; 	// set this number between 1 to 5
var num_balls = 8; 		// this number must be greater or equal to code_length
var num_attempts = 8; 	// change this number to have less or more attempts

var codes = {}; // an empty JS object, later it's going to store the code for each end-user

var express = require('express');
var app = express();
var idCounter = 0;

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New express client");
    console.log("Received: ");
    console.log(JSON.parse(req.query['data']));
    var z = JSON.parse(req.query['data']);

    // check if the request action is generateCode
    if ( z['action'] == "generateCode"/*TODO 1 ... check if the request action is generateCode*/) {
        //generate a code for this user
        idCounter++;
        var nameID = z['name'] + idCounter;
        generateCode(nameID);
        var jsontext = JSON.stringify({
            'action': 'generateCode',
            'nameID': nameID,
            'msg': 'New code generated!!!'
        });
        console.log(jsontext);
        console.log(codes);
        res.send(jsontext);
        // send the response while including the JSON text		
        /*TODO 2 ... send the response including the JSON text*/
    } else if (z['action'] == "evaluate") {
        //evaluate the attempt_code for this user
        var [num_match, num_containing, num_not_in]
            = evaluate(codes[z['name']], z['attempt_code']);

        var answer = [];
        if ((num_match == code_length) || (num_attempts == z["current_attempt_id"]))
            answer = codes[z['name']];

        var win = false;
        if (num_match == code_length) win = true;

        /* the response will have 6 parts: request action, whether won or not, number of exact matches,
        number of colors that are correct, number of wrong colors, and the answer if the game ended */
        var jsontext = JSON.stringify({
            'action': 'evaluate',
            'win': win,
            'num_match':num_match,
            'num_containing': num_containing,
            'num_not_in':num_not_in,
            'code': answer
            /*TODO 3 ... type of action */
            /*TODO 4 ... won or not */
            /*TODO 5 ... number of match*/
            /*TODO 6 ... number of correct colors*/
            /*TODO 7 ... number of wrong colors*/
            /*TODO 8 ... the answer code when the game ends*/
        });
        console.log(jsontext);
        res.send(jsontext);
    } else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running!");

/*
 * Evaluate the client's attempting code
 * @param code is the server generated code for this client
 * @param attempt_code is the client attempted code in this request
 * @return num_match, num_containing, num_not_in
 */
function evaluate(code, attempt_code) {
    var num_match = 0;   		 // number of exact matches, a good color in a right spot
    var num_containing = 0;		 // number of colors that are correct but not in right spot
    var num_not_in = 0;			 // number of wrong colors

    //calculate the result
    for (var i = 0; i < code.length; i++) {
        if (code[i] == attempt_code[i]) num_match++;
        else if (attempt_code.includes(code[i])) num_containing++;
        else num_not_in++;
    }

    return [num_match, num_containing, num_not_in];
}

/*
 * Generate a Code for this client
 * @param clientName is this client name
 */
function generateCode(clientName) {
    var code= [];
    //generate code
    /*TODO 10 ... declare and initialize the code to an empty array*/
    while (code.length < code_length) {
        var id = Math.floor(Math.random() * num_balls) + 1;
        if (code.indexOf(id) === -1) code.push(id);
    }
    //store the code for this client
    codes[clientName] = code;
}