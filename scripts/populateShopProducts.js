document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and display product inventory data
  function fetchLocalProductData() {
    const loc_string = window.sessionStorage.getItem("loc_string");

    fetch(
      `https://shopsync.pythonanywhere.com/get_all_localproducts?loc_string=${loc_string}`,
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
        updateProducts(data.p_data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Function to fetch and display shop products data for shopkeeper with search
  function fetchLocalProductDataOnSearch(searchQuery = "") {
    // Include the search query in the API endpoint
    const apiUrl = `https://shopsync.pythonanywhere.com/search_products?sq=${searchQuery}`;

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
        // updateProducts(data.p_data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Function to update the product inventory table with data
  function updateProducts(p_data) {
    const p_list_cont = document.querySelector(".products-list");

    p_data.forEach((product, index) => {
      const p_card = document.createElement("div");
      p_card.className = `product-${index + 1} product`;
      p_card.innerHTML = `
              <!-- product image  -->
              <div class="product-img">
                <img src="https://shopsync.pythonanywhere.com/get_p_image?image_name=${String(product.p_image)}" alt="" />
              </div>

              <!-- product text  -->
              <div class="product-text">
                <p class="product-name">${product.p_name}</p>

                <p class="product-shop-text">
                  by <span class="product-shop-name">${product.s_name}</span>
                </p>

                <div class="pricing-n-rating">
                  <!-- product rating  -->
                  <div class="product-rating-container">
                    <img src="assets/icons/star.png" alt="" />
                    <p class="product-rating">${product.p_rating}</p>
                  </div>

                  <!-- product price -->
                  <p class="product-price"><span class="doller">₹</span>${product.p_price}</p>
                </div>

                <!-- product description  -->
                <p class="product-desc">
                  Packed with evidence-based strategies, Atomic Habits will teach you
                  how to make small changes that will transform your habits and
                  deliver amazing results.
                </p>
              </div>
            `;

      p_list_cont.appendChild(p_card);
    });
  }

  fetchLocalProductData();

  const search_inp = document.querySelector("#main-search");
  search_inp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      search_query = e.target.value.trim();
      fetchLocalProductDataOnSearch(search_query);
    }
  });
});
