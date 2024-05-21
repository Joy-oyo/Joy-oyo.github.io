function lastItem(originalArray) {
    const sortedArray = originalArray.sort();
    const lastItemAlphabetically = sortedArray[sortedArray.length - 1];
  
    const outputDiv = document.getElementById('lastItemOutput');
    outputDiv.innerHTML = `
      <p>Original Array: ${originalArray}</p>
      <p>Last Item Alphabetically: ${lastItemAlphabetically}</p>
    `;
}


function sortItemsInput(){

    const responses = {};
    let  numItems;

    //check if input is a number and qualify  to proceed
    while(isNaN(numItems) || numItems > 4 || numItems < 2 || !(Number.isInteger(numItems))){
        numItems = Number(prompt("How many items would you like to add? (Enter 2-4 Items.)"));
    }

    //based on userinput, collect info from users
    for (let index = 0; index < numItems; index++) {
        let catInput = prompt(`Enter category ${index+1} of ${numItems}.`)
        let catItem = prompt(`Enter your ${catInput}`)
        responses[catInput] = catItem;
      };

    //sort by key
    const responseKeys = Object.keys(responses).sort();
    
    //output user responses as HTML
    let outputHTML = `<p>You entered ${Object.keys(responses).join(', ')}.</p>`;
    outputHTML += `<p>I sorted them ${responseKeys.join(', ')}.</p>`;

    for (const key of responseKeys) {
    outputHTML += `<p>Your ${key.toLowerCase()} is ${responses[key]}</p>`;
  }

  document.getElementById('outputArray').innerHTML = outputHTML;
}

document.getElementById("inputButton").addEventListener("click", sortItemsInput);
document.getElementById("sortButton").addEventListener("click", function () {
  const originalArray = ['Watermelon', 'Apple', 'Orange', 'Kiwi'];
  lastItem(originalArray);
});