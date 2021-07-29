const baseUrl = "https://covid-api.mmediagroup.fr/v1";
const baseUrl2 = "https://api.covid19api.com/summary";

/*
 Return country cases
*/
async function countryCovidCases(queryParam) {
  const response = await fetch(`${baseUrl}/cases?ab=${queryParam}`, {
    "Content-Type": "application/json",
  });

  const data = await response.json();

  return data;
}

/* Returns Vaccinated */
async function vaccinated() {
  const response = await fetch(`${baseUrl}/vaccines?country=Global`, {
    "Content-Type": "application/json",
  });

  const data = await response.json();

  return data;
}

/* Returns Vaccinated */
async function vaccinatedByCountry(country) {
  const response = await fetch(`${baseUrl}/vaccines?ab=${country}`, {
    "Content-Type": "application/json",
  });

  const data = await response.json();

  return data;
}

function searchCountryCases() {
  let searchCountry = document.getElementById("searchCountry");
  let searchBtn = document.getElementById("searchBtn");

  let vaccinated = 0;

  searchBtn.addEventListener("click", () => {
    let search = searchCountry.value.toLowerCase();

    // IF search box is not empty
    if (search != "") {
      document.getElementById("fa-spinner").hidden = false;
      // Disable button
      searchBtn.disabled = true;

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
      countryCovidCases(search)
        .then((data) => {
          // Do something on the data

          let result = data.All;

          // Call Another API
          vaccinatedByCountry(search)
            .then((res) => {
              vaccinated += res.All.people_vaccinated;

              // Append Data to Modal
              document.getElementById(
                "modal-title"
              ).innerHTML = `<h5> <span><img class="m-0 p-0" src="https://www.countryflags.io/${result.abbreviation}/shiny/32.png">
        </span> ${result.country}</h5>`;

              document.getElementById("modal-body").innerHTML = `
        <h5 class='text-warning'>
          Confirmed Cases <i class="fas fa-pills text-warning"></i>: <span class='text-warning'>${numberFormat(
            result.confirmed
          )}</span>
        </h5>

        <h5 class='text-success'>
          Recovered <i class="fas fa-clinic-medical text-success"></i>: <span class='text-success'>${numberFormat(
            result.recovered
          )}</span>
        </h5>

        <h5 class='text-info'>
          Vaccinated <i class="fas fa-syringe text-info"></i>: <span class='text-info'>${numberFormat(
            vaccinated
          )}</span>
        </h5>

        <h5 class='text-danger'>
        Deaths <i class="fas fa-skull-crossbones text-danger"></i>: <span class='text-danger'>${numberFormat(
          result.deaths
        )}</span>
        </h5>

        <small>Updated: ${result.updated}</small>`;

              searchCountry.value = ""; // Clear the search input
              document.getElementById("fa-spinner").hidden = true;
              searchBtn.disabled = false;

              $("#myModal").modal("show"); // Open Modal
            })
            .catch((err) => {
              console.log("Error: " + err);

              document.getElementById("fa-spinner").hidden = true;

              searchBtn.disabled = false;
              searchCountry.classList.add("is-invalid");
              searchCountry.classList.add("border");
              searchCountry.classList.add("border-danger");
            });
        })
        .catch((err) => {
          // Returns error
          console.log(err);
          document.getElementById("fa-spinner").hidden = true;
          searchBtn.disabled = false;
          searchCountry.classList.add("is-invalid");
          searchCountry.classList.add("border");
          searchCountry.classList.add("border-danger");
        });
    } else {
      console.log("No Input");
      searchCountry.classList.add("is-invalid");
      searchCountry.classList.add("border");
      searchCountry.classList.add("border-danger");
    }
  });
}

function numberFormat(n) {
  let num = String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");

  return num;
}

/* Return World Summary */
async function global() {
  const response = await fetch(`${baseUrl2}`, {
    "Content-Type": "application/json",
  });

  const data = await response.json();

  return data;
}

$(function () {
  // Loading Icon for Search
  document.getElementById("fa-spinner").hidden = true;

  let deaths = 0;
  let recovered = 0;

  global()
    .then((data) => {
      // Dashboard

      document.getElementById("total-cases").innerHTML = `<span>${numberFormat(
        data.Global.TotalConfirmed
      )}</span>`;

      /*
    document.getElementById("population").innerHTML = `<span>${numberFormat(
      data.Global.population
    )}</span>`;*/

      document.getElementById(
        "confirm-cases"
      ).innerHTML = `<span>${numberFormat(data.Global.TotalConfirmed)}</span>
    <span><small class="new text-warning">+${
      data.Global.NewConfirmed
    }</small></span>
    `;

      document.getElementById("recovered").innerHTML = `<span>${numberFormat(
        data.Global.TotalRecovered
      )}</span>
    <span><small class="new text-success">+${
      data.Global.TotalRecovered
    }</small></span>
    `;

      recovered = data.Global.TotalRecovered;

      document.getElementById("deaths").innerHTML = `<span>${numberFormat(
        data.Global.TotalDeaths
      )}</span><span><small class="new text-danger">+${
        data.Global.TotalDeaths
      }</small></span>
    `;

      deaths = data.Global.TotalDeaths;

      searchCountryCases(); // search countries

      // Datatables
      let countries = data.Countries; // Array of countries

      let tbody = "";

      countries.forEach((country) => {
        // Populate the table with data from API

        tbody += `
      <tr>  
        <td> 
        <span><img src="https://www.countryflags.io/${
          country.CountryCode
        }/flat/16.png">
        </span> ${country.Country}
        </td>
        <td>
        ${numberFormat(country.TotalConfirmed)}
        <span class="text-warning">+${country.NewConfirmed}</span>
        </td>
        <td>
        ${numberFormat(country.TotalRecovered)}
        <span class="text-success">+${country.NewRecovered}</span>
        </td>
        <td>
        ${numberFormat(country.TotalDeaths)}
        <span class="text-danger">+${country.NewDeaths}</span>
        </td>
      </tr>
      `;
      });

      document.getElementById("tbody").innerHTML = tbody; // append the tbody data

      // Datatables
      $("#example").DataTable();
    })
    .catch((err) => console.log(err));

  // Get Global Vaccinated
  vaccinated()
    .then((response) => {
      const vaccinated = response.All.people_vaccinated;
      const population = response.All.population;

      let percentage = vaccinated / population;

      let percentageOfVaccinated = percentage * 100;

      document.getElementById("vaccinated").innerHTML = `<span>${numberFormat(
        vaccinated
      )}</span>
      <span><small class="new text-success">+${percentageOfVaccinated.toFixed(
        2
      )}%</small></span>
      `;
    })
    .catch((err) => console.error(err));
});
