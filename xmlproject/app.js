const base_url = "https://ochre.lib.uchicago.edu/ochre?uuid=";

function loadOchreData(uuid, containerSelector) {
    //url
    const url = base_url + uuid;

    fetch(url)
        .then((response) => response.text())
        .then((xmlString) => {
            //parsexml
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlString, "application/xml");

            //extract the title
            let title;
                  // Case 1: XML structure for "RS 15.001"
            const spatialUnitTitle = xml.querySelector("spatialUnit > identification > label > content > string")?.textContent;
            if (spatialUnitTitle) {
                    title = spatialUnitTitle;
                }

            const labelText = xml.querySelector("resource > identification > label")?.textContent;
            if (labelText) {
                    title = labelText;
                }

            //extrac properties
            let properties = [];

            if (xml.querySelector("observation")) {
              // "RS 15.001" XML
              properties = extractPropertiesFromSpatialUnit(xml);
            } else if (xml.querySelector("resource")) {
              // "Luk N3635-E2882-5-2880-5" 
              properties = extractPropertiesFromResource(xml);
            }

            //build
            let html = `<h1>${title}<h1>`;
            if (properties.length >= 0) {
                html += "<h3>Properties:</h3><ul>";
                html += "<table>";
                properties.forEach((prop) => {
                        html += `<tr><td><strong>${prop.name}</strong></td><td>${prop.value}</td></tr>`;
                });
                html += "</ul>";
                html += "</table>";
            } else {
                html += "<p>No properties available.</p>";
            }
            //etract preview image URL
            const previewImage = xml.querySelector("resource[type='image']");
            if (previewImage) {
                const imageUUID = previewImage.getAttribute("uuid");
                const imageURL = `https://ochre.lib.uchicago.edu/ochre?uuid=${imageUUID}&load`; // Update the URL pattern
                html += `<img src="${imageURL}" class="img-fluid mb-4">`;
            }

            // Display the HTML in the container
            document.querySelector(containerSelector).innerHTML = html;
        })
        .catch((error) => {
            console.error("Error fetching OCHRE data:", error);
            document.querySelector(containerSelector).innerHTML = "<p>Error loading data.</p>";
        });
}


function extractPropertiesFromSpatialUnit(xml) {
    const observations = xml.querySelectorAll("observation");
    let properties = [];
  
    observations.forEach((observation) => {
      const observationProperties = observation.querySelectorAll("properties > property");
      observationProperties.forEach((property) => {
        const label = property.querySelector("label > content > string")?.textContent;
        const value = property.querySelector("value")?.textContent.trim();
  
        if (label && value) {
          properties.push({
            name: label,
            value: value,
          });
        }
      });
    });
  
    return properties;
  }

  function extractPropertiesFromResource(xml) {
    const properties = Array.from(xml.querySelectorAll("properties > property"));
    const extractedProperties = properties.map((property) => {
      const label = property.querySelector("label")?.textContent;
      const value = property.querySelector("value")?.textContent.trim();
  
      return {
        name: label || "Unknown",
        value: value || "N/A",
      };
    });
  
    return extractedProperties;
  }
