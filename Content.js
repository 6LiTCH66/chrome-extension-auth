const loginButton = document.getElementById("loginButton")
const registerButton = document.getElementById("registerButton")
const logoutButton = document.getElementById("logoutButton")

document.getElementById('loginForm').addEventListener('submit' ,event => {
    event.preventDefault()

    const loginEmail = document.getElementById("loginName").value;
    const loginPassword = document.getElementById("loginPassword").value;


    if(loginEmail && loginPassword){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.runtime.sendMessage({message: 'login', payload: {email:loginEmail, password:loginPassword}}, function (response){
                if(!response.error){
                    document.getElementById("mainContainer").classList.add("d-none")
                    document.getElementById("logout").classList.remove("d-none")
                }
                else{
                    document.getElementById("loginName").value = ''
                    document.getElementById("loginPassword").value = ''
                }
            })
        })

    }
})



window.onload = function() {
    var user = localStorage.getItem("currentUser")
    if(!user){
        document.getElementById("mainContainer").classList.remove("d-none")
        document.getElementById("logout").classList.add("d-none")
        localStorage.removeItem("currentUser");

    }else {
        document.getElementById("mainContainer").classList.add("d-none")
        document.getElementById("logout").classList.remove("d-none")
        localStorage.setItem("currentUser", JSON.stringify(user).replace(/\\/g, ''))

        //chrome.tabs.executeScript( null, {code: `localStorage.setItem("currentUser", ${JSON.stringify(result.currentUser).replace(/\\\\/g, '')})`});
    }

}



loginButton.addEventListener('click', ()=> {

})


registerButton.addEventListener('click', ()=> {

})

logoutButton.addEventListener('click', ()=> {

    document.getElementById("mainContainer").classList.remove("d-none")
    document.getElementById("logout").classList.add("d-none")

    document.getElementById("loginName").value = ""
    document.getElementById("loginPassword").value = ""
    window.localStorage.removeItem("currentUser")

    localStorage.removeItem("currentUser");


})