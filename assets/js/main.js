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

function numberFormat(n) {
  let num = String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");

  return num;
}

function appendDataUsingAjaxDataTable() {
  $("#tbl-posts").DataTable({
    ajax: {
      url: "data.json", // JSON Data
      dataSrc: "",
    },

    columns: [{ data: "id" }, { data: "title" }, { data: "body" }],
  });
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
  let deaths = 0;
  let recovered = 0;

  global().then((data) => {
    // Dashboard

    document.getElementById("total-cases").innerHTML = `<span>${numberFormat(
      data.Global.TotalConfirmed
    )}</span>`;

    /*
    document.getElementById("population").innerHTML = `<span>${numberFormat(
      data.Global.population
    )}</span>`;*/

    document.getElementById("confirm-cases").innerHTML = `<span>${numberFormat(
      data.Global.TotalConfirmed
    )}</span>
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
  });

  vaccinated()
    .then((response) => {
      const vaccinated = response.All.people_vaccinated;

      const data = {
        labels: ["Deaths", "Recovered", "Vaccinated"],
        datasets: [
          {
            label: "",
            data: [deaths, recovered, vaccinated],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      };

      const config = {
        type: "doughnut",
        data: data,
      };

      var myChart = new Chart(
        document.getElementById("global-cases-chart"),
        config
      );
    })
    .catch((err) => console.error(err));
});
