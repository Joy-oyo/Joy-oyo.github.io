function howdy(firstName){
    alert("Howdy " + firstName);
}

function conditional(){
    alert("Use Inspect to see the console and inspect the code.");
    var currentHour = new Date().getHours();
    if (currentHour < 10){
        alert("Good morning!");
    }else if (currentHour < 18){
        alert("Good day!");
    }else{
        alert("Good evening!")
    }
}

function addElements(){
    var valueArray = ['first', 'second', 'third'];
    for (i in valueArray){
        var newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'row');
        newDiv.setAttribute('id', 'div '+i);
        document.getElementById('addElements').appendChild(newDiv);
        newDiv.innerText = valueArray[i];
    };
}

function scopeValues(){
    if (0==0){
        var x = 0;
        var y = 1;
        //const z = x;
    }else{
        alert("why is 0 not equals to 0")
    }
    alert("Use Inspecct to see the console and inspect the code.")
    console.log("Check the sources to see this code and study the scope of the declarations.")
    console.log("Value of x as originally declared: " + x);
    console.log("Value of x as originally declared: " + y);
    var x = x+2;
    console.log("Value of x + 1: " + x)
    console.log("Value of z: " + z + " does not change.")
}

function changeTitle(){
    //finding the element that has an ID called programCard
    //Case sensitive - I,d - camel case 
    let selectedElement = document.getElementById("programCard");
    console.log(selectedElement);
    selectedElement.innerText = "BLALALA BLALALA";
    selectedElement.style.display = "none";
}