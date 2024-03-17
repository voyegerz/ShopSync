document.addEventListener("DOMContentLoaded", function () {
  // Add More Products Section
  const addProductContainer = document.querySelector(".add-product-container");

  // Event listener for the "Add More" button
  addProductContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-prod-row")) {
      addNewProductRow();
    }
  });

  // Event listener for the "Add to Inventory" button
  const addInvBtn = document.getElementById("add-inv-btn");
  addInvBtn.addEventListener("click", function () {
    sendAllProductDataToEndpoint();
  });

  // Function to add a new row to the table
  function addNewProductRow() {
    const tableBody = document.querySelector(
      ".add-product-container table tbody"
    );
    const rows = tableBody.querySelectorAll("tr");

    // Clone the last row to avoid duplicating the "Add More" button
    const lastRow = rows[rows.length - 1];
    const newRow = lastRow.cloneNode(true);

    // Reset input values in the cloned row
    const inputFields = newRow.querySelectorAll(".inp-prod");
    const fileInput = newRow.querySelector(".inp-file-input");
    fileInput.value = "";
    inputFields.forEach((input) => {
      input.value = "";
    });

    // Update the serial number for the new row
    const serialNumberCell = newRow.querySelector("td:first-child");
    serialNumberCell.textContent = rows.length + 1;

    // Show the "Delete" button in the cloned row
    newRow.querySelector(".del-prod-row").style.display = "inline-block";

    // Add the fade-in class for smooth animation
    newRow.classList.add("fade-in");

    // Event listener for the delete button in the new row
    const deleteButton = newRow.querySelector(".del-prod-row");
    deleteButton.addEventListener("click", function () {
      tableBody.removeChild(newRow);
      updateSerialNumbers();
      showAddMoreButton();
    });

    // Append the cloned row to the table
    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Hide the "Add More" button for all rows and show only for the last row
    showAddMoreButton();
  }

  // Function to update serial numbers in the table
  function updateSerialNumbers() {
    const tableBody = document.querySelector(
      ".add-product-container table tbody"
    );
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, index) => {
      row.querySelector("td:first-child").textContent = index + 1;
    });
  }

  // Function to show "Add More" button only in the last row
  function showAddMoreButton() {
    const tableBody = document.querySelector(
      ".add-product-container table tbody"
    );
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const addMoreButton = row.querySelector(".add-prod-row");
      addMoreButton.style.display = "none";
    });

    const lastRow = rows[rows.length - 1];
    const addMoreButtonLastRow = lastRow.querySelector(".add-prod-row");
    addMoreButtonLastRow.style.display = "inline-block";
  }

  // Function to get all product data from the table
  function getAllProductData() {
    const tableBody = document.querySelector(
      ".add-product-container table tbody"
    );
    const rows = tableBody.querySelectorAll("tr");
    const formData = new FormData();

    const curr_shop_id = window.sessionStorage.getItem("curr_shop_id");

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td input");
      // Append each field to formData
      formData.append(`products[${index}][p_name]`, cells[0].value);
      formData.append(`products[${index}][p_price]`, cells[1].value);
      formData.append(`products[${index}][p_quantity]`, cells[2].value);
      formData.append(`products[${index}][p_type]`, cells[3].value);

      // Check if a file is selected before appending
      if (cells[4].type === "file" && cells[4].files.length > 0) {
        formData.append(`products[${index}][p_image]`, cells[4].files[0]);
      }

      formData.append(`products[${index}][curr_shop_id]`, curr_shop_id);
    });
    console.log("rows - ", rows.length);
    // Display the key/value pairs
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    return formData;
  }

  // Function to send all product data to the Flask API endpoint
  function sendAllProductDataToEndpoint() {
    const formData = getAllProductData();

    fetch("https://shopsync.pythonanywhere.com/add_products", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.msg);
      })
      .catch((error) => console.error("Error:", error));
  }
});
