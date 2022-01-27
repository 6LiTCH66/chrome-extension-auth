const loginButton = document.getElementById("loginButton")
const registerButton = document.getElementById("registerButton")
const logoutButton = document.getElementById("logoutButton")

if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit' ,event => {
        event.preventDefault()

        const loginEmail = document.getElementById("loginName").value;
        const loginPassword = document.getElementById("loginPassword").value;


        if(loginEmail && loginPassword){
            chrome.runtime.sendMessage({message: 'login', payload: {email:loginEmail, password:loginPassword}}, function (response){
                if(!response.error){
                    document.getElementById("mainContainer").classList.add("d-none")
                    document.getElementById("logout").classList.remove("d-none")
                }
                else{

                    var text = document.createTextNode(response.error);
                    var errorMessage = document.getElementById("loginErrorMessage")
                    errorMessage.classList.remove("d-none")
                    errorMessage.innerHTML = ''
                    errorMessage.appendChild(text);

                    document.getElementById("loginForm").reset()
                }
            })

        }
    })
}

if(document.getElementById("registerForm")){
    document.getElementById('registerForm').addEventListener('submit' ,event => {
        event.preventDefault()

        const registerEmail = document.getElementById("registerEmail").value;
        const registerPassword = document.getElementById("registerPassword").value;

        const registerCountry = document.getElementById("registerCountry").value;
        const registerPhone = document.getElementById("registerPhone").value;
        const registerFirstName = document.getElementById("registerFirstName").value;
        const registerLastName = document.getElementById("registerLastName").value;


        if(registerEmail && registerPassword && registerCountry && registerPhone && registerFirstName && registerLastName){
            chrome.runtime.sendMessage({message: 'signup', payload: {email:registerEmail, password:registerPassword}}, function (response){

                if(!response.error){
                    document.getElementById("tab-login").click()
                    document.getElementById("registerForm").reset()

                }
                else{

                    var text = document.createTextNode(response.error);
                    var errorMessage = document.getElementById("registerErrorMessage")
                    errorMessage.classList.remove("d-none")
                    errorMessage.innerHTML = ''
                    errorMessage.appendChild(text);

                    document.getElementById("registerForm").reset()
                }
            })
        }


    })
}


window.onload = function() {
    var user = localStorage.getItem("currentUser")
    if(!user){
        if(document.getElementById("mainContainer")){
            document.getElementById("mainContainer").classList.remove("d-none")
            document.getElementById("logout").classList.add("d-none")
        }

    }else {
        if(document.getElementById("mainContainer")){
            document.getElementById("mainContainer").classList.add("d-none")
            document.getElementById("logout").classList.remove("d-none")
        }

    }

}


if(loginButton){
    loginButton.addEventListener('click', ()=> {

    })
}


if(registerButton){
    registerButton.addEventListener('click', ()=> {

    })
}

if(logoutButton){
    logoutButton.addEventListener('click', ()=> {
        chrome.runtime.sendMessage({message: 'logout'}, function (response){
            if(!response.error){
                document.getElementById("mainContainer").classList.remove("d-none")
                document.getElementById("logout").classList.add("d-none")

                document.getElementById("loginForm").reset()
            }
        })
    })
}

