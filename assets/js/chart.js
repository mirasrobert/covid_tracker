// Base URl : https://covid-api.mmediagroup.fr/v1
//history?ab=ph&status=confirmed

const base_url = "https://covid-api.mmediagroup.fr/v1";

$(function () {
  /* Return confirmed cases summary */
  async function summaryOfConfirmedCases(country) {
    const response = await fetch(
      `${base_url}/history?ab=${country}&status=confirmed`,
      {
        "Content-Type": "application/json",
      }
    );

    const data = await response.json();

    return data;
  }

  /* Return death summary */
  async function summaryOfDeaths(country) {
    const response = await fetch(
      `${base_url}/history?ab=${country}&status=deaths`,
      {
        "Content-Type": "application/json",
      }
    );

    const data = await response.json();

    return data;
  }

  let input = document.getElementById("searchCountryChart");
  let searchBtn = document.getElementById("searchChartBtn");

  // if Search is CLICKED
  searchBtn.addEventListener("click", () => {
    let search = input.value.toLowerCase();

    if (search != "") {
      // do something when search
      // validation
      if (
        input.classList.contains("is-invalid") ||
        input.classList.contains("border") ||
        input.classList.contains("border-danger")
      ) {
        input.classList.remove("is-invalid");
        input.classList.remove("border");
        input.classList.remove("border-danger");
      }

      // Call API
      summaryOfConfirmedCases(search).then((response) => {
        let result = response.All;

        const labels = Object.keys(result.dates);

        const values = Object.values(result.dates);

        const data = {
          labels: labels,
          datasets: [
            {
              label: `Summary of confirmed cases in ${result.country}`,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              data: values,
            },
          ],
        };

        let config = {
          type: "line",
          data,
          options: {},
        };

        // Check if Canvas Exist
        if (document.body.contains(document.getElementById("myChart"))) {
          document.getElementById("myChart").remove();
        }

        // Create the canvas
        document.getElementById("canvas-chart").innerHTML = `
		<canvas id="myChart"></canvas>
		`;

        // Show CHART
        let myChart = new Chart(document.getElementById("myChart"), config);
      });
    } else {
      console.log("No Input");

      input.classList.add("is-invalid");
      input.classList.add("border");
      input.classList.add("border-danger");
    }

    // Show Summary of Deaths
    summaryOfDeaths(search)
      .then((response) => {
        let result = response.All;

        const labels = Object.keys(result.dates);

        const values = Object.values(result.dates);

        if (search != "") {
          const data = {
            labels: labels,
            datasets: [
              {
                label: `Summary of deaths in ${result.country}`,
                data: values,
                backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                borderColor: ["rgb(201, 203, 207)"],
                borderWidth: 1,
              },
            ],
          };

          const config = {
            type: "bar",
            data: data,
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          };

          // Check if Canvas Exist
          if (document.body.contains(document.getElementById("myChartDeath"))) {
            document.getElementById("myChartDeath").remove();
          }

          // Create the canvas 2
          document.getElementById("canvas-chart-death").innerHTML = `
		  <canvas id="myChartDeath"></canvas>
		  `;

          // Show CHART
          let myChartDeath = new Chart(
            document.getElementById("myChartDeath"),
            config
          );

          // Clear the input
          input.value = "";
        }
      })
      .catch((err) => console.error(err));
  });
});
