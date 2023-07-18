const container = document.getElementById("container");
let loggedInState;
let token;

window.onload = () =>{
    const authToken = localStorage.getItem("auth_token");
    
    if(!authToken){
        loggedInState = false;
    }
    else if(authToken){
        loggedInState = true;
        token = authToken;
    }
    init();
}

function init(){
    if(loggedInState){
        const payload = JSON.parse(atob(token.split(".")[1])); 
        container.innerHTML = "<input type='button' id='logout' value='Logout' onClick='logout()'><p id='user'></p><br><input type='text' id='add-item' placeholder='Todo' onkeydown='todoSubmit(event)'><br><ul id='todo-list'></ul>";
        document.getElementById("user").innerText = payload.email;
        getThemTodos();
    }  
    else if(!loggedInState){
        container.innerHTML = "<a href='http://localhost:3000/login.html'>Login</a><br><a href='http://localhost:3000/register.html'>Register</a>"
    }
}

function logout(){
    localStorage.removeItem("auth_token");
    window.location.href = "/";
}

function todoSubmit(event){
    const payload ={"items": [document.getElementById("add-item").value]};
    if(event.key === 'Enter'){
        fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.message){
                console.log(data.message);
            }
            else if(data.success){
                document.getElementById("add-item").value = "";
            }
        });
    }
}

function getThemTodos(){
    try{
        fetch('http://localhost:3000/api/todos', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => response.json())
        .then((data) =>{
            if(data.message){
                console.log(data.message);
            }
            else if(data.list){
                //console.log(data.list[0].items);
                for(let i = 0; i < data.list[0].items.length; i++){
                    let li = document.createElement('li');
                    li.innerText = data.list[0].items[i];
                    document.getElementById("todo-list").appendChild(li);
                }
            }
        })
    }
    catch (err){
        console.log(err);
    }
}