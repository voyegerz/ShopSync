document.addEventListener("DOMContentLoaded", function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;

        // Make a request to BigDataCloud Reverse Geocoding API
        const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            // Extract address components from the API response
            const address = data;

            window.sessionStorage.setItem(
              "loc_string",
              `${address.principalSubdivision} ${address.city}`
            );

            c = window.sessionStorage.getItem("loc_string");
            console.log(c);
            console.log(data);
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
          });
      },
      function (error) {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported in this browser");
  }
});
