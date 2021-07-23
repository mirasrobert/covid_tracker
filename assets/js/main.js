const worldRecordAPI = "https://covid-api.mmediagroup.fr/v1";

/*
async function worldCovidRecord() {
  const response = await fetch(worldRecordAPI, { mode: "no-cors" });

  const data = await response.json();

  return data;
}


worldCovidRecord().then((data) => {
  console.log(data);
});*/

fetch(worldRecordAPI, {
  method: "GET",
  header: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
