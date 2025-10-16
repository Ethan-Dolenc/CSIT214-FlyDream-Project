//////////////////////////////////////GENERAL FUNCTIONS//////////////////////////////////////
var displayed_popups = [];

function displayPopup(popup_id) {
    var popup = document.getElementById(popup_id);
    
    if (displayed_popups.includes(popup_id)) {
        popup.classList.add("popup_hidden");
        displayed_popups = displayed_popups.filter(item => item !== popup_id);
    } else {
        popup.classList.remove("popup_hidden");
        displayed_popups.push(popup_id);
    }
}

function resetForm(form_id) {
    const form = document.getElementById(form_id);
    const elements = form.querySelectorAll('*');
    form.reset();
    
    for (const element of elements) {
        if (displayed_popups.includes(element.id)) {
            displayPopup(element.id);
        }
    }
}

//////////////////////////////////////INFLIGHT MEAL MANAGEMENT//////////////////////////////////////
const price_dict = {
    "none": 0,
    "pancakes": 13,
    "waffles": 15,
    "apple_juice": 5,
    "orange_juice": 5,
    "hamburger": 10,
    "salad": 8,
    "coke": 5,
    "fanta": 5,
    "steak": 20,
    "pasta": 15,
    "wine": 12,
    "pink_lemonade": 5,
};
var selected_prices = {
    "breakfast_food": 0,
    "breakfast_drink": 0,
    "lunch_food": 0,
    "lunch_drink": 0,
    "dinner_food": 0,
    "dinner_drink": 0
};
var total_price=0.00;

//Calculate price of selected items
function getPrice(radio_group) {
    var radio_buttons = document.querySelectorAll(`input[name="${radio_group}"]`);
    var selected_value;
    for (const radio of radio_buttons) {
        if (radio.checked) {
            selected_value = radio.value;
            break;
        }
    }
    total_price -= selected_prices[radio_group];
    selected_prices[radio_group] = price_dict[selected_value];
    total_price += selected_prices[radio_group];

    //update the meal form to display the current total price
    meal_form = document.getElementById('meal_form');
    if (meal_form && !meal_form.classList.contains('popup_hidden')) {
        var price_display = document.getElementById("price_display");
        price_display.innerHTML = `Total Price: $${total_price}.00`;
    }
}


function submitMealForm(event) {
    event.preventDefault();
    var reciept_items = [];
    for (const [key, value] of Object.entries(selected_prices)) {
        if (value != 0 && key != "total_price") {
            reciept_items.push(key.split('_')[0] + ': ' + key.split('_')[1] + ' - ' + document.querySelector(`input[name="${key}"][value="${Object.keys(price_dict).find(k => price_dict[k] === value)}"]`).value);
        }
    }
}

//////////////////////////////////////LOGIN MANAGEMENT//////////////////////////////////////
var user_error=false;
var pass_error = false;
var username = "";
var password = "";

function createLoginForm() {
    var login_form = document.createElement("form");
    login_form.classList.add("popup");
    login_form.id = "login_form";
    login_form.onsubmit = submitLoginForm;
    login_form.innerHTML =
    `   
    <h2 style="margin:0 0 8px 0">Login</h2>
    <p class="muted" style="margin:0 0 10px 0">Enter your credentials to access your bookings.</p>
    <div class="row">
      <div style="grid-column:span 12">
        <label class="muted">Username
          <input type="text" name="username" id="username" placeholder="Username" class="input" required>
        </label>
        <p class="error popup_hidden muted" id="no_username"><i>Please enter a username</i></p>
      </div>
      <div style="grid-column:span 12">
        <label class="muted">Password
          <input type="password" name="password" id="password" placeholder="Password" class="input" required>
        </label>
        <p class="error popup_hidden muted" id="no_password"><i>Please enter a password</i></p>
      </div>
      <div style="grid-column:span 12;display:flex;gap:8px;justify-content:flex-end">
        <button type="button" class="btn" onclick="displayPopup('screen_lock_overlay');document.getElementById('login_form').remove();">Cancel</button>
        <button type="submit" class="btn primary">Login</button>
      </div>
    </div>
    `;
    document.body.appendChild(login_form);
}

//Login Form Submission
function submitLoginForm(event) {
    event.preventDefault();
    const login_form = document.getElementById('login_form');
    const form_elements = login_form.elements;
    
    username = form_elements.username.value;
    password = form_elements.password.value;
    
    if (username == "" && !user_error) {
        displayPopup("no_username");
        user_error = true;
        return;
    }
    if (password == "" && !pass_error) {
        displayPopup("no_password");
        pass_error = true;
        return;
    }

    if (username != "" && password != "") {
        let user_dict = JSON.parse(localStorage.getItem('user_dict') || '{}');
        const userKey = username + password;
        
        if (!user_dict[userKey]) {
            user_dict[userKey] = {
                'username': username,
                'password': password,
                'booked_flights': []
            };
            localStorage.setItem('user_dict', JSON.stringify(user_dict));
        }
        
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('current_user', userKey);
        login_form.remove();
        displayPopup("screen_lock_overlay");
        
        // Dispatch event to notify login
        window.dispatchEvent(new Event('userLoggedIn'));
    }
}

function onLoad() {
    // Initialize logged_in
    if (!localStorage.getItem('logged_in')) {
        localStorage.setItem('logged_in', 'false');
    }
    
    // Initialize user_dict
    if (!localStorage.getItem('user_dict')) {
        localStorage.setItem('user_dict', JSON.stringify({}));
    }
}