chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'login'){
        fetch('https://employee-webserver.herokuapp.com/auth/signin', {
            method: 'POST',
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
            //chrome.storage.local.set({"currentUser": JSON.stringify(data)})
            var userData = JSON.stringify(data).replace(/\\/g, '');
            localStorage.setItem("currentUser", userData)

            // chrome.tabs.executeScript(
            //     null, {code: `localStorage.setItem("currentUser", ${JSON.stringify(JSON.stringify(data))})`});
        }).catch(function (error) {
            sendResponse({
                error: 'error'
            });
            alert('Something went wrong.', error);

        });


        return true;
    }
    sendResponse({});
    return true;
})


