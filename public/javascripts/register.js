const submitButton = document.getElementById("submit");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error");

submitButton.addEventListener("click", onSubmit);

function onSubmit(event){
    event.preventDefault();
    const payload ={
    email: emailInput.value,
    password: passwordInput.value
    };
   fetch("http://localhost:3000/api/user/register/", {
    method: "POST",
    headers:{
        "Content-type": "application/json"
    },
    body: JSON.stringify(payload)
   })
   .then((response) => response.json())
   .then((data) => {
    if(data.message){
        errorMessage.innerText = data.message;
    }
    else if(data.success){
        location.href="http://localhost:3000/login.html";
    }
    else if(data.errors){
        console.log(data.errors);
    }
   });
}