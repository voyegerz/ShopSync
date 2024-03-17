//Register Start//////////////////////////////////////////////////////////////
      // make registration for user and shopkeeper

      var role_s = document.querySelector("#role-shopkeeper");
      var role_u = document.querySelector("#role-user");
      var address = document.querySelector("#address");
      var input_name = document.querySelector("#fname");
      var email = document.querySelector("#uemail");
      var mob = document.querySelector("#mob");
      var pass = document.querySelector("#upass");

      var btn = document.querySelector(".register-btn");

      var role = "";

      role_s.addEventListener("click", function () {
        role = "shop_keeper";
      });

      role_u.addEventListener("click", function () {
        role = "user";
      });

      // fetch the api and create account

      async function registerUser(data) {
        try {
          const response = await fetch(
            "https://shopsync.pythonanywhere.com/register/user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log(result);
          alert(result["msg"]);
        } catch (error) {
          console.error("Error:", error);
          alert(
            "Error registering user. Please check the console for details."
          );
        }
      }

      async function registerShopKeeper(data) {
        try {
          const response = await fetch(
            "https://shopsync.pythonanywhere.com/register/shop_keeper",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log(result);
          alert(result["msg"]);
        } catch (error) {
          console.error("Error:", error);
          alert(
            "Error registering user. Please check the console for details."
          );
        }
      }

      btn.addEventListener("click", function () {
        if (role == "user") {
          const data = {
            u_name: input_name.value,
            u_email: email.value,
            u_mob: mob.value,
            u_pass: pass.value,
            u_address: address.value,
          };
          registerUser(data);
        } else if (role == "shop_keeper") {
          const data = {
            sk_name: input_name.value,
            sk_email: email.value,
            sk_mob: mob.value,
            sk_pass: pass.value,
            sk_address: address.value,
          };
          registerShopKeeper(data);
        } else {
          alert("Please Select The Your Role");
        }
        console.log("Submit Clicked");
      });
      //Register End//////////////////////////////////////////////////////////////
