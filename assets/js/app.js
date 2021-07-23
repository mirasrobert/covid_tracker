/*
$(function () {
 
});*/

const world = new World();

function showCountries() {
  let output = `
  <table class="table table-borderless">
  <thead class="table-dark">
    <tr>
      <th></th>
      <th>Country</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
  `;

  const countries = world.getCountries();

  countries.forEach((country) => {
    output += `
    <tr>
        <td>${country.flag}</td>
        <td>${country.name}</td>
        <td>${country.code}</td>
    </tr>
    `;
  });

  output += `</tbody>
  </table>;`;

  // Append to HTML
  document.getElementById("country").innerHTML = output;
}

function filterCountries() {
  let searchCountry = document.getElementById("searchCountry");

  searchCountry.addEventListener("keyup", () => {
    let search = searchCountry.value.toLowerCase();

    // IF search box is not empty
    if (search != "") {
      const results = world
        .getCountries()
        .filter(
          (country) =>
            country.name.toLowerCase() == search ||
            country.code.toLowerCase() == search ||
            country.name.toUpperCase() == search ||
            country.code.toUpperCase() == search
        );

      // Update the UI
      let output = `
      <table class="table table-borderless">
      <thead class="table-dark">
        <tr>
          <th></th>
          <th>Country</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
    `;

      if (results.length != 0) {
        results.forEach((country) => {
          output += `
        <tr>
          <td>${country.flag}</td>
          <td>${country.name}</td>
          <td>${country.code}</td>
        </tr>
        `;
        });
      } else {
        output += `
        <tr>
          <td>No Results</td>
        </tr>`;
      }

      output += `</tbody>
    </table>`;

      // Append to HTML
      document.getElementById("country").innerHTML = output;
    } else {
      showCountries();
    }
  });
}

showCountries();
filterCountries();
