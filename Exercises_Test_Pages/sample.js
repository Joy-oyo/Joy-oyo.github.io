//codeXHR
function loadXMLDoc(){
	const url = "xxx";
	//construct XHR
	let xmlhttp = new XMLHttpRequest();
	//define what the XHR will do 
	xmlhttp.onreadystatechange = function (){
        //check above

		if(this.readyState ==4 && this.status ==200){
		//invoke function and pass
		let xmlDoc = this.responseXML;

		printData(xmlDoc);
        //check above
		}
	
	//Open the XHR exchange
	xmlhttp.open("GET", url);
    //check above

	//send the XHR exchange
	xmlhttp.sent();
    //check above
	}
}

function printData(xmlDoc){
    let objectData = xmlDoc.getElementsByTagName("spatialUnit");


    for (let i = 0; i < objectData.length; i++){
        //Create a table
        let newRow = document.createElement("tr");
        newRow.id = "row" + i;
        
    }
}