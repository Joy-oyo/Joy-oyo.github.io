function greetUser(){
    const currentHour = new Date().getHours();
    let greeting;

    if(currentHour < 12){
        greeting = "Good Morning!";
    }else if(currentHour  < 18){
        greeting = "Good Day!";
    }else{
        greeting = "Good Evening!";
    }

    alert(greeting);
}

function changePage(){
    const changeButton = document.getElementById("changeButton");
    console.log("Button before change:", changeButton.textContent);

    changeButton.textContent = "Changed!";
    changeButton.classList.remove("btn-primary");
    changeButton.classList.add("btn-success");

    console.log("Button after change:", changeButton.textContent);
}

document.getElementById("greetButton").addEventListener("click", greetUser);
document.getElementById("changeButton").addEventListener("click", changePage);


