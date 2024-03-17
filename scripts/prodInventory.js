document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and display product inventory data
  //----- GLOBAL VARS-----//
  var CURR_SHOP_ID = "";
  const curr_shop_dd = document.querySelector("#curr-shop-dd");

  function get_curr_shop() {
    const sk_id = window.sessionStorage.getItem("id");

    fetch(`https://shopsync.pythonanywhere.com/get_curr_shop?sk_id=${sk_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        CURR_SHOP_ID = data.curr_shop_id;
        window.sessionStorage.setItem("curr_shop_id", CURR_SHOP_ID);
      })
      .catch((error) => console.error("Error:", error));
  }

  function get_all_shops_of_sk() {
    const sk_id = window.sessionStorage.getItem("id");

    fetch(`https://shopsync.pythonanywhere.com/get_all_shops_of_sk?sk_id=${sk_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        populate_curr_shop_dd(data.sk_shops)
      })
      .catch((error) => console.error("Error:", error));
  }

  function set_curr_shop(curr_shop_id) {
    const sk_id = window.sessionStorage.getItem("id");

    const shopData = {
      curr_s_id: curr_shop_id,
      sk_id: sk_id
    }

    fetch(`https://shopsync.pythonanywhere.com/set_curr_shop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData) 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        window.sessionStorage.setItem("curr_shop_id", data.curr_shop_id_set_to);
        window.location.reload();
      })
      .catch((error) => console.error("Error:", error));
  }

  function fetchProductInventoryData() {
    const curr_shop_id = window.sessionStorage.getItem("curr_shop_id");

    fetch(
      `https://shopsync.pythonanywhere.com/get_shop_products?curr_shop_id=${curr_shop_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        updateProductInventoryTable(data.p_data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Function to fetch and display shop products data for shopkeeper with search
  function fetchShopProducts(searchQuery = "") {
    const curr_shop_id = window.sessionStorage.getItem("curr_shop_id"); // Replace with the actual value for s_id

    // Include the search query in the API endpoint
    const apiUrl = `https://shopsync.pythonanywhere.com/search_shop_products?curr_shop_id=${curr_shop_id}&q=${searchQuery}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        updateProductInventoryTable(data.search_results);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Function to update the product inventory table with data
  function updateProductInventoryTable(inventoryData) {
    const tableBody = document.querySelector(
      ".product-inventory-container table tbody"
    );
    tableBody.innerHTML = ""; // Clear existing rows

    inventoryData.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" class="inp-prod" id="p_id" value="${
              product.p_id
            }" /></td>
            <td><input class="inp-prod" id="p_name" type="text" value="${
              product.p_name
            }" /></td>
            <td><input class="inp-prod" type="text" id="p_price" value="${
              product.p_price
            }" /></td>
            <td><input class="inp-prod" type="text" id="p_quant" value="${
              product.p_quantity
            }" /></td>
            <td><input type="text" class="inp-prod" id="lm-date" value="${
              product.lm_date
            }" /></td>
            <td><input type="text" class="inp-prod" id="p_type" value="${
              product.p_type
            }" /></td>
            <td>
              <button class="edit-prod-row-btn edit-prod-btn">
              </button>
            </td>
            <td><button class="update-prod-row-btn add-prod-row">Update ↑</button></td>
          `;

      tableBody.appendChild(row);
      disableProductRowEditing(row);
    });
  }

  get_curr_shop();

  if (CURR_SHOP_ID == "NSR") {
    alert("You have no shops registered , please register your shop first.");
  } else {
    // Fetch product inventory data on page load
    fetchProductInventoryData();
    get_all_shops_of_sk();
  }

  // Function to enable editing of the product row
  function enableProductRowEditing(row) {
    const inputFields = row.querySelectorAll(".inp-prod");
    console.log("enabling");
    inputFields.forEach((input) => {
      input.removeAttribute("readonly");
      input.style.textDecoration = "underline dashed #2b6fd5";
    });
  }

  // Function to disable editing of the product row
  function disableProductRowEditing(row) {
    const inputFields = row.querySelectorAll(".inp-prod");
    console.log("disabling");
    inputFields.forEach((input) => {
      input.setAttribute("readonly", true);
      input.style.textDecoration = "none";
    });
  }

  // Function to update product data using the API endpoint
  function updateProductData(productData) {
    fetch("https://shopsync.pythonanywhere.com/update_product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.msg);
      })
      .catch((error) => console.error("Error:", error));
  }

  function populate_curr_shop_dd(shops) {
    const curr_shop_dd_index = window.sessionStorage.getItem("curr_shop_dd_selected_index");

    shops.forEach((shop) => {
      const shop_option = document.createElement("option");      
      shop_option.textContent = shop.s_name;
      shop_option.value = shop.s_id;


      curr_shop_dd.appendChild(shop_option);
    });

    curr_shop_dd.options[curr_shop_dd_index].selected = true;
  }

  curr_shop_dd.addEventListener("change", (event) => { 
    const s_id = event.target.value;
    window.sessionStorage.setItem("curr_shop_dd_selected_index", curr_shop_dd.options.selectedIndex);
    console.log("curr_shop_id", s_id);
    set_curr_shop(s_id);
    // curr_shop_dd.innerHTML = "";
  });

  // Event delegation for "Edit" and "Update" buttons inside the table body
  const tableBody = document.querySelector(
    ".product-inventory-container table tbody"
  );
  tableBody.addEventListener("click", function (event) {
    console.log(event.target.classList);
    if (event.target.classList.contains("edit-prod-row-btn")) {
      console.log("edit click");
      const row = event.target.closest("tr");
      enableProductRowEditing(row);
    } else if (event.target.classList.contains("update-prod-row-btn")) {
      console.log("update click");
      const row = event.target.closest("tr");
      disableProductRowEditing(row);

      // TODO: Extract data from the row and update the product using the API endpoint
      const p_id = row.querySelector("#p_id").value;
      const p_name = row.querySelector("#p_name").value;
      const p_price = row.querySelector("#p_price").value;
      const p_quantity = row.querySelector("#p_quant").value;
      const p_type = row.querySelector("#p_type").value;

      const curr_shop_id = window.sessionStorage.getItem("curr_shop_id"); // Replace with the actual value for s_id

      const productData = {
        p_id: p_id,
        p_name: p_name,
        p_price: p_price,
        p_quantity: p_quantity,
        p_type: p_type,
        curr_shop_id: curr_shop_id,
      };

      updateProductData(productData);
    }
  });

  function handleSearchShopProds() {
    const searchInput = document.getElementById("search-inp-element");
    const searchQuery = searchInput.value.trim();
    if (searchQuery.length > 0) {
      fetchShopProducts(searchQuery);
      if (searchQuery == "all") {
        fetchProductInventoryData();
      }
    } else {
      alert("Please enter a search term");
    }
  }

  // Add event listener to the search button
  const searchButton = document.querySelector(".search-prod-btn");
  searchButton.addEventListener("click", handleSearchShopProds);

  // cancel search button functionality
  const cancelSearchButton = document.querySelector(".cancel-search-btn");
  const searchInput = document.getElementById("search-inp-element");
  searchInput.addEventListener("input", function (e) {
    if (e.target.value.length > 0) {
      cancelSearchButton.style.display = "block";
    } else {
      cancelSearchButton.style.display = "none";
      fetchProductInventoryData();
    }
  });
  searchInput.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      handleSearchShopProds();
    }
  });

  cancelSearchButton.addEventListener("click", function (e) {
    searchInput.value = "";
    fetchProductInventoryData();
    cancelSearchButton.style.display = "none";
  });

  // ... (Keep the other event listeners for filtering, searching, editing, and updating)

  // TODO: Add any additional event listeners or functionality as needed
});
