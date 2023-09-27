var bet = {
    "action": "play",
    "wagers": [
        {
            "stake": 1,
            "type": "exactNumber",
            "numberOfCardsStanding": 5
        },
        {
            "stake": 1,
            "type": "exactNumber",
            "numberOfCardsStanding": 2
        },
        {
            "stake": 1,
            "type": "rangeBet",
            "range": { "start": 0, "end": 27 }
        },
        {
            "stake": 1,
            "type": "rangeBet",
            "range": { "start": 31, "end": 40 }
        }
    ],
    "currency": "USD",
    "playerId": "2099925"
};

var authData = {
    "username": "studio-wozo",
    "password": "WVLH7i$rdRK5Sb88"
}
var token = "";
var url = "http://konqu-loadb-36160nxdo52a-c6fa6feae0ac8ac2.elb.us-east-1.amazonaws.com:8080";
var gameID = "643f08b880c4fa0370c14206";
var API_Login = url + "/user/login";
var API_GameInit = url + "/game/" + gameID + "/init";
var API_Play = url + "/gameplay/game/" + gameID;
var API_CloseGame = url + "/gameplay/game/" + gameID;
var API_LatesResult = url + "/gameplay/game/" + gameID + "/latestGamestate";
var API_Force = url + "/force/" + gameID;
var GET = "GET";
var POST = "POST";
var PATCH = "PATCH";

function LogIn(_callBack) {
    CallAPI(API_Login, POST, JSON.stringify(authData), (x) => {
        token = x.token;
        //console.log("Token is +" + token);
        _callBack();
        //CloseGameplay();
    });
}

function GameInit(_callBack) {
    CallAPI(API_GameInit, GET, "", (x) => {
        //console.log("Game Config is " + x);
        _callBack(x);
    })
}
function Play(_bet, _callBack) {
    var k = JSON.stringify(_bet);
    console.log(k);
    retryCounter = 0;
    CallAPI(API_Play, POST, k, (x) => {
        // console.log("AfterPlay--------------");
        // console.log(x);
        _callBack(x);
        CloseGameplay();
    });
}
function GetGameplayLatest() {
    CallAPI(API_LatesResult, GET, "", (x) => {
        console.log("Latest Result is " + x);
    })
}
function ForceOutome() {
    var k = {
        "value": {
            "windType": "veryStrong",
            "numberOfCardsStanding": 8
        }
    };
    CallAPI(API_Force, POST, JSON.stringify(k), (x) => {
        console.log("AfterOutcome--------------");
        console.log(x);
    });
}
function CloseGameplay() {
    CallAPI(API_CloseGame, PATCH, "", (x) => {
        console.log("--------CloseGameplay---");
        // console.log(x);
    })
}
var retryCounter = 0;
async function CallAPI(_url, _methodType, _data, _callBack) {
    if (_methodType == GET) {
        console.log("............GET...........");
        var myHeaders = new Headers({
            'Authorization': "Bearer " + token.toString(),
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const response = await fetch(_url, {
            method: GET,
            headers: myHeaders
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        _callBack(data);
    }
    else if (_methodType == POST) {
        console.log("............Post...........");
        const response = await fetch(_url, {
            method: POST,
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Bearer " + token.toString(),
            },
            body: _data,
        });
        console.log(response);
        if (response.status == 500 && _url == API_Play && retryCounter <= 1) {
            retryCounter++;
            setTimeout(() => {
                CallAPI(_url, _methodType, _data, _callBack);
            }, 1000);
            return;
        }
        retryCounter = 0;
        const result = await response.json();
        console.log("Success:", result);
        _callBack(result);
    }
    else if (_methodType == PATCH) {
        // console.log("............Patch...........");
        var myHeaders = new Headers({
            'Authorization': "Bearer " + token.toString(),
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const response = await fetch(_url, {
            method: PATCH,
            headers: myHeaders
        });
        //console.log(response);
        //const data = await response.json();
        //_callBack(data);
    }

}







