
function refreshToken(){
    fetch("https://employee-webserver.herokuapp.com/auth/token", {
        method: 'POST',
        body: JSON.stringify({value: "value"}),
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(function (response) {
        if (response.ok) {
            this.startRefreshTokenTimer()
            return response.json();
        }
        // if any errors logout
        localStorage.removeItem("currentUserEX");
        localStorage.removeItem("initialTimeEX");

        return Promise.reject(response);

    }).catch(function (error) {
        // if any errors logout
        localStorage.removeItem("currentUserEX");
        localStorage.removeItem("initialTimeEX");

    });
}


var refreshTokenTimeout;
function startRefreshTokenTimer(){
    if(localStorage.getItem("currentUserEX")){
        var waitTime = 840000;
        var executionTime;
        var initialTime = localStorage.getItem("initialTimeEX");

        if (initialTime === null) {
            localStorage.setItem("initialTimeEX", new Date().getTime());
            executionTime = waitTime;
        }
        else {
            executionTime = parseInt(initialTime, 10) + waitTime - (new Date()).getTime();
            if (executionTime < 0) executionTime = 0
        }

        refreshTokenTimeout = setTimeout(() => {
            this.refreshToken()
            localStorage.removeItem("initialTimeEX")
        }, executionTime)
    }
}

function stopRefreshTokenTimer(){
    localStorage.removeItem("initialTimeEX");
    clearInterval(refreshTokenTimeout)
}




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'login'){
        fetch('https://employee-webserver.herokuapp.com/auth/signin', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(request.payload),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {

                sendResponse({
                    error: null
                });

                return response.json();
            }

            return Promise.reject(response);

        }).then(function (data) {

            var userData = JSON.stringify(data).replace(/\\/g, '');
            localStorage.setItem("currentUserEX", userData)
            localStorage.setItem("initialTimeEX", new Date().getTime());
            this.startRefreshTokenTimer()

        }).catch(function (error) {
            sendResponse({
                error: 'Incorrect user credentials!'
            });
        });

        return true;
    }
    else if(request.message === 'logout'){

        fetch('https://employee-webserver.herokuapp.com/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {
                localStorage.removeItem("currentUserEX");
                localStorage.removeItem("initialTimeEX");

                this.stopRefreshTokenTimer()
                sendResponse({
                    error: null
                });

                return response.json();
            }
            localStorage.removeItem("currentUserEX");
            localStorage.removeItem("initialTimeEX");
            return Promise.reject(response);

        }).catch(function (error) {

            sendResponse({
                error: 'error'
            });

            localStorage.removeItem("currentUserEX");
            localStorage.removeItem("initialTimeEX");

        });
        return true;

    }
    else if(request.message === "signup"){
        fetch('https://employee-webserver.herokuapp.com/auth/signup', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(request.payload),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {

                sendResponse({
                    error: null
                });

                return response.json();
            }
            return Promise.reject(response);

        }).catch(function (error) {

            sendResponse({
                error: 'User already exist'
            });

        });
        return true;
    }

    else if(request.userMessage === "user"){
        fetch('https://employee-webserver.herokuapp.com/api/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response){
            if(response.ok){

                return response.json();
            }

            return Promise.reject(response);
        }).then(function (data) {

            sendResponse({
                response: data
            });


        }).catch(function (error){

            localStorage.removeItem("currentUserEX");
            localStorage.removeItem("initialTimeEX");

            sendResponse({
                response: null
            });
        })

        return true;
    }
    else if(request.message === "vastused"){
        console.log(request.payload)
        fetch("https://employee-webserver.herokuapp.com/scraping/vastused", {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(request.payload),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {

                sendResponse({
                    vastused: null
                });

                return response.json();
            }

            return Promise.reject(response);

        }).catch(function (error) {

            sendResponse({
                vastused: 'error'
            });


        })
        return true
    }

    sendResponse({});
    return true;
})



