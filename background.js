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
        localStorage.removeItem("currentUser");
        localStorage.removeItem("initialTime");

        return Promise.reject(response);

    }).catch(function (error) {
        // if any errors logout
        localStorage.removeItem("currentUser");
        localStorage.removeItem("initialTime");

    });
}


var refreshTokenTimeout;
function startRefreshTokenTimer(){
    if(localStorage.getItem("currentUser")){
        var waitTime = 840000;
        var executionTime;
        var initialTime = localStorage.getItem("initialTime");

        if (initialTime === null) {
            localStorage.setItem("initialTime", new Date().getTime());
            executionTime = waitTime;
        }
        else {
            executionTime = parseInt(initialTime, 10) + waitTime - (new Date()).getTime();
            if (executionTime < 0) executionTime = 0
        }

        refreshTokenTimeout = setTimeout(() => {
            this.refreshToken()
            localStorage.removeItem("initialTime")
        }, executionTime)
    }
}

function stopRefreshTokenTimer(){
    localStorage.removeItem("initialTime");
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
            localStorage.setItem("currentUser", userData)
            localStorage.setItem("initialTime", new Date().getTime());
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
                localStorage.removeItem("currentUser");
                localStorage.removeItem("initialTime");

                this.stopRefreshTokenTimer()
                sendResponse({
                    error: null
                });

                return response.json();
            }
            return Promise.reject(response);

        }).catch(function (error) {

            sendResponse({
                error: 'error'
            });

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

    sendResponse({});
    return true;
})


