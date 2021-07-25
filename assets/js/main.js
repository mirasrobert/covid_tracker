/*
 Return country cases
*/
async function countryCovidCases(queryParam) {
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

      // validation
      if (
        searchCountry.classList.contains("is-invalid") ||
        searchCountry.classList.contains("border") ||
        searchCountry.classList.contains("border-danger")
      ) {
        searchCountry.classList.remove("is-invalid");
        searchCountry.classList.remove("border");
        searchCountry.classList.remove("border-danger");
      }

      // Call to the API
      countryCovidCases(search).then((data) => {
        // Do something on the data

        let result = data.All;

        // Append Data to Modal
        document.getElementById(
          "modal-title"
        ).innerHTML = `<h5>${result.country}</h5>`;

        document.getElementById("modal-body").innerHTML = `
        <h5 class='text-muted'>
          Confirmed Cases: <span class='text-dark'>${result.confirmed}</span>
        </h5>
        <h5 class='text-muted'>
          Deaths: <span class='text-dark'>${result.deaths}</span>
        </h5>
        <h5 class='text-muted'>
          Recovered: <span class='text-dark'>${result.recovered}</span>
        </h5>

        <small>Updated: ${result.updated}</small>`;

        searchCountry.value = ""; // Clear the search input

        $("#myModal").modal("show"); // Open Modal
        
      });
    } else {

      console.log("No Input");
      searchCountry.classList.add("is-invalid");
      searchCountry.classList.add("border");
      searchCountry.classList.add("border-danger");

    }
  });
}

searchCountryCases();

/* Return World Summary */
async function global() {
  const response = await fetch(`https://api.covid19api.com/summary`, {
    "Content-Type": "application/json",
  });

  const data = await response.json();

  return data;
}

global().then((data) => {
  document.getElementById(
    "total-cases"
  ).innerHTML = `<span>${data.Global.TotalConfirmed}</span>`;
});
