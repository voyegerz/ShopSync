document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and display product inventory data
  function fetchProductInventoryData() {
    const s_id = window.sessionStorage.getItem("id"); // Replace with the actual value for s_id

    fetch(`https://shopsync.pythonanywhere.com/get_products?s_id=${s_id}`, {
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
        updateProductInventoryTable(data.p_data);
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
            <td><input type="text" class="inp-prod" id="la-date" value="${
              product.last_added_date
            }" /></td>
            <td><input type="text" class="inp-prod" id="p_type" value="${
              product.product_type
            }" /></td>
            <td>
              <button class="edit-prod-row-btn edit-prod-btn">
              </button>
            </td>
            <td><button class="update-prod-row-btn add-prod-row">Update ↑</button></td>
          `;

      tableBody.appendChild(row);
    });
  }

  // Fetch product inventory data on page load
  fetchProductInventoryData();

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

      const s_id = window.sessionStorage.getItem("id"); // Replace with the actual value for s_id

      const productData = {
        p_id: p_id,
        p_name: p_name,
        p_price: p_price,
        p_quantity: p_quantity,
        s_id: s_id,
      };

      updateProductData(productData);
    }
  });

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
        alert(data.msg); // You can use alert or any other way to notify the user
      })
      .catch((error) => console.error("Error:", error));
  }

  // ... (Keep the other event listeners for filtering, searching, editing, and updating)

  // TODO: Add any additional event listeners or functionality as needed
});
