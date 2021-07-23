async function worldCovidRecord(queryParam) {
  const response = await fetch(
    `https://covid-api.mmediagroup.fr/v1/cases?ab=${queryParam}`,
    {
      "Content-Type": "application/json",
    }
  );

  const data = await response.json();

  return data;
}

function searchCountryCases() {
  let searchCountry = document.getElementById("searchCountry");
  let searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    let search = searchCountry.value.toLowerCase();

    // IF search box is not empty
    if (search != "") {
      // Call to the API
      worldCovidRecord(search).then((data) => {
        // Do something on the data

        let result = data.All;

        // Append Data to Modal
        document.getElementById(
          "modal-title"
        ).innerHTML = `<h5>${result.country}</h5>`;

        document.getElementById("modal-body").innerHTML = `
        <h5>
          Confirmed Cases: ${result.confirmed}
        </h5>
        <h5>
          Deaths: ${result.deaths}
        </h5>
        <h5>
          Recovered: ${result.recovered}
        </h5>

        <small>Updated: ${result.updated}</small>`;

        searchCountry.value = ""; // Clear the search input

        $("#myModal").modal("show"); // Open Modal
      });
    } else {
      console.log("No Input");
    }
  });
}
searchCountryCases();

async function covid() {
  const response = await fetch(
    `https://covid-api.mmediagroup.fr/v1/history?country=Germany&status=deaths`,
    {
      "Content-Type": "application/json",
    }
  );

  const data = await response.json();

  return data;
}

covid().then((data) => {
  console.log(data);
});
