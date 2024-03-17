//Register Start//////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  // THE MODALS////////////////////////////////////////////////////////////
  get_city_id = "";
  const shop_address = document.querySelector("#address");
  const shop_name = document.querySelector("#shop_name");
  const shop_type = document.querySelector("#shop_type");
  const rs_btn = document.querySelector(".register-s-btn");

  // location dropdowns
  const state_dd = document.querySelector("#state");
  const district_dd = document.querySelector("#district");
  const subdistrict_dd = document.querySelector("#subdistrict");
  const city_dd = document.querySelector("#city_village");

  ///////////////////////////////////////////////////////////////////////////////

  // HELPER FUNCTIONS//
  function populate_state(states) {
    states.forEach((state) => {
      const state_option = document.createElement("option");
      state_option.textContent = state.state_name;
      state_option.value = state.id;

      state_dd.appendChild(state_option);
    });
  }

  // fetch all the districts
  function populate_districts(districts) {
    districts.forEach((district) => {
      const district_option = document.createElement("option");
      district_option.textContent = district.district_name;
      district_option.value = district.id;

      district_dd.appendChild(district_option);
    });
  }

  // fetch all the subdistricts
  function populate_subdistricts(subdistricts) {
    subdistricts.forEach((subdistrict) => {
      const subdistrict_option = document.createElement("option");
      subdistrict_option.textContent = subdistrict.subdistrict_name;
      subdistrict_option.value = subdistrict.id;

      subdistrict_dd.appendChild(subdistrict_option);
    });
  }

  // fetch all the cities or villages
  function populate_cities_villages(cities) {
    cities.forEach((city) => {
      const city_option = document.createElement("option");
      city_option.textContent = city.city_or_village_name;
      city_option.value = city.id;

      city_dd.appendChild(city_option);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  // API FETCH FUNCTIONS //

  function get_states() {
    fetch(`https://shopsync.pythonanywhere.com/get/states`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        populate_state(data.states);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  function get_districts(state_id) {
    fetch(`https://shopsync.pythonanywhere.com/get/districts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sid: state_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        populate_districts(data.districts);
      })
      .catch((error) => console.error("Error:", error));
  }

  function get_subdistricts(district_id) {
    fetch(`https://shopsync.pythonanywhere.com/get/subdistricts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ did: district_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        populate_subdistricts(data.subdistricts);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  function get_cities_villages(subdistrict_id) {
    fetch(`https://shopsync.pythonanywhere.com/get/cities_villages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subdid: subdistrict_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        populate_cities_villages(data.cities_villages);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  function registerShop(data) {
    fetch(`https://shopsync.pythonanywhere.com/register/shop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert(data.msg);
      })
      .catch((error) => console.error("Error:", error));
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //initial call to fill the states dd
  get_states();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // EVENT LISTENERS //

  state_dd.addEventListener("change", (event) => {
    var state_id = event.target.value;
    console.log(state_id);
    get_districts(state_id);
    district_dd.innerHTML = "";
    subdistrict_dd.innerHTML = "";
    city_dd.innerHTML = "";

    s_placeholder_option = document.createElement("option");
    c_placeholder_option = document.createElement("option");

    s_placeholder_option.textContent = "--SubDistrict--";
    c_placeholder_option.textContent = "--City/Village--";

    subdistrict_dd.appendChild(s_placeholder_option);
    city_dd.appendChild(c_placeholder_option);
  });

  district_dd.addEventListener("change", (event) => {
    var district_id = event.target.value;
    console.log(district_id);
    get_subdistricts(district_id);
    subdistrict_dd.innerHTML = "";
    city_dd.innerHTML = "";

    c_placeholder_option = document.createElement("option");

    c_placeholder_option.textContent = "--City/Village--";

    city_dd.appendChild(c_placeholder_option);
  });

  subdistrict_dd.addEventListener("change", (event) => {
    var subdistrict_id = event.target.value;
    console.log(subdistrict_id);
    get_cities_villages(subdistrict_id);
    city_dd.innerHTML = "";
  });

  city_dd.addEventListener("change", function (event) { 
    get_city_id = event.target.value;
    selectedIndex = city_dd.selectedIndex;
    city_name = city_dd.options[selectedIndex].innerText;
    console.log(city_name," : ",get_city_id);
  });

  rs_btn.addEventListener("click", (e) => {
    if (get_city_id.length <= 0) {
      alert("Please select locations for shop.");
    } else {
      sk_id = window.sessionStorage.getItem("id");

      const data = {
        s_name: shop_name.value,
        s_type: shop_type.value,
        s_address: shop_address.value,
        s_city_id: String(get_city_id),
        sk_id: sk_id,
      };
      registerShop(data);
      console.log("Register clicked");
    }
  });
});
