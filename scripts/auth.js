//LOGOUT START//////////////////////////////////////////////////////////////
//LOGOUT SECTION CODE START////////////////////////////////////////////////////////////////
const login_btn = document.querySelector("#login-btn");
const logout_btn = document.querySelector("#logout-btn");
const header = document.querySelector(".header");
const cart = document.querySelector(".cart");
const dashboard = document.querySelector(".dashboard");

// on page load do the following
function onPageLoad() {
  const name_data_element = document.createElement("p");

  name_data_element.classList.add("session-name");

  const session_id = window.sessionStorage.getItem("id");
  const session_name = window.sessionStorage.getItem("name");
  const role = window.sessionStorage.getItem("role");
  const status = window.sessionStorage.getItem("status");

  if (status == "success") {
    if (session_name != null) {
      name_data_element.textContent = "Hi\n" + session_name.split(" ")[0];
    }
    header.appendChild(name_data_element);

    if (session_id && session_name != null) {
      login_btn.style.display = "none";
      logout_btn.style.display = "block";
    }
    if (role == "user") {
      cart.style.display = "block";
    } else if (role == "shop_keeper") {
      cart.style.display = "block";
      dashboard.style.display = "block";
    }
  } else if (status == "fail") {
    alert(" Failed to login , Invalid Username or Password.");
  }
}
window.onload = onPageLoad();

async function logOut() {
  try {
    const response = await fetch("https://shopsync.pythonanywhere.com/logout");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    alert(result["msg"]);
  } catch (error) {
    console.error("Error:", error);
    alert("Error registering user. Please check the console for details.");
  }
}

logout_btn.addEventListener("click", function (event) {
  logOut().then(clearSessionAndReload);
});

function clearSessionAndReload() {
  sessionStorage.clear();
  window.location.reload();
}
//LOGOUT SECTION CODE END//////////////////////////////////////////////////////////////////////////////////////////////

//LOGOUT END//////////////////////////////////////////////////////////////
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//LOGIN START//////////////////////////////////////////////////////////////

if (window.location.pathname.endsWith("login.html")) {
  var email = document.getElementById("uemail");
  var pass = document.getElementById("upass");
  var btn = document.getElementById("login-btn-page");

  let data = {
    email: "",
    passwd: "",
    role: "",
  };

  let res = {};

  async function loginUser(data) {
    try {
      const response = await fetch(
        "https://shopsync.pythonanywhere.com/login",
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
      //console.log(result["msg"]);
      return result;
    } catch (error) {
      console.error("Error:", error);
      alert("Error registering user. Please check the console for details.");
    }
  }

  btn.addEventListener("click", (event) => {
    var role = document.querySelector('input[name="role"]:checked');

    if (role != null) {
      data = {
        email: email.value,
        passwd: pass.value,
        role: role.value,
      };
      res = loginUser(data);
      res.then(setSessionVars);
    }
    console.log(" login page btn clicked");
  });

  function setSessionVars(res) {
    if (res.msg != "Invalid Pass/Username") {
      window.sessionStorage.setItem("role", String(data.role));
      window.sessionStorage.setItem("id", String(res.id));
      window.sessionStorage.setItem("name", String(res.name));
      window.sessionStorage.setItem("status", "success");

      a = window.sessionStorage.getItem("role");
      b = window.sessionStorage.getItem("id");
      c = window.sessionStorage.getItem("name");
      d = window.sessionStorage.getItem("status");

      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
    } else {
      window.sessionStorage.setItem("status", "fail");
      d = window.sessionStorage.getItem("status");

      console.log(d);
    }

    window.location.reload();
  }
}
//LOGIN END//////////////////////////////////////////////////////////////
