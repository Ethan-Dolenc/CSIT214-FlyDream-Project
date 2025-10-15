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
    form.reset()
    
    for (const element of elements) {
        if (displayed_popups.includes(element.id)) {
            displayPopup(element.id)
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

//Canculate price of selected items
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
    if (!meal_form.classList.contains('popup_hidden')) {
        var price_display = document.getElementById("price_display");
        price_display.innerHTML = `Total Price: $${total_price}.00`;
    }
}


function createMealForm() {
    var meal_form = document.createElement("form");
    meal_form.id = "meal_form";
    meal_form.classList.add("popup");
    meal_form.onsubmit = submitMealForm;
    meal_form.innerHTML =
    `
        <p>Please select desired meals and accompanying drinks:</p>
        <input type="checkbox" onClick="displayPopup('breakfast_options');" name="meal_selection" id="breakfast">Breakfast
        <br />
        <div class="popup_hidden selected_meal" id="breakfast_options">
            <input type="radio" name="breakfast_food" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="breakfast_food" onClick="getPrice(name);" value="pancakes" />Pancakes <br />
            <input type="radio" name="breakfast_food" onClick="getPrice(name);" value="waffles" />Waffles <br />
            ---------- <br />
            <input type="radio" name="breakfast_drink" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="breakfast_drink" onClick="getPrice(name);" value="apple_juice" />Apple Juice <br />
            <input type="radio" name="breakfast_drink" onClick="getPrice(name);" value="orange_juice" />Orange Juice
        </div>
        
        <input type="checkbox" onClick="displayPopup('lunch_options');" name="meal_selection" id="lunch">Lunch
        <br />
        <div class="popup_hidden selected_meal" id="lunch_options">
            <input type="radio" name="lunch_food" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="lunch_food" onClick="getPrice(name);" value="hamburger" />Hamburger <br />
            <input type="radio" name="lunch_food" onClick="getPrice(name);" value="salad" />Salad <br />
            ---------- <br />
            <input type="radio" name="lunch_drink" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="lunch_drink" onClick="getPrice(name);" value="coke" />Coke <br />
            <input type="radio" name="lunch_drink" onClick="getPrice(name);" value="fanta" />Fanta
        </div>
        
        <input type="checkbox" onClick="displayPopup('dinner_options');" name="meal_selection" id="dinner">Dinner
        <div class="popup_hidden selected_meal" id="dinner_options">
            <input type="radio" name="dinner_food" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="dinner_food" onClick="getPrice(name);" value="steak" />Steak <br />
            <input type="radio" name="dinner_food" onClick="getPrice(name);" value="pasta" />Pasta <br />
            ---------- <br />
            <input type="radio" name="dinner_drink" onClick="getPrice(name);" value="none" checked="true" />None <br />
            <input type="radio" name="dinner_drink" onClick="getPrice(name);" value="wine" />Wine <br />
            <input type="radio" name="dinner_drink" onClick="getPrice(name);" value="pink_lemonade" />Pink Lemonade
        </div>
        <br />
        <br />
        <p id="price_display">Total Price: $0.00</p>
        <input type="submit" /> 
        `
    document.body.appendChild(meal_form);
}

//Meal Confirmation
function submitMealForm(event) {
    event.preventDefault();
    const meal_form = document.getElementById('meal_form');
    const form_elements = meal_form.elements;
    
    var reciept_items = []
    for (const element of [
                            form_elements.breakfast_food.value, 
                            form_elements.breakfast_drink.value, 
                            form_elements.lunch_food.value, 
                            form_elements.lunch_drink.value, 
                            form_elements.dinner_food.value, 
                            form_elements.dinner_drink.value]
        ) {
        if (element != "none") {
            reciept_items.push(element);
        }
    }

    document.getElementById('price_display').innerHTML = "Total Price: $0.00";
    createReciept(reciept_items);
    displayed_popups = displayed_popups.filter(item => !["breakfast_options", "lunch_options", "dinner_option"].includes(item));
    meal_form.remove()
}



//Reciept Creation
function createReciept(reciept_items) {
    var reciept = document.createElement("div");
    reciept.id = "reciept";
    reciept.classList.add("popup");
    for (const item of reciept_items) {
        var new_line = document.createElement("p");
        new_line.innerHTML = `+ ${item}: $${price_dict[item]}.00`;
        reciept.appendChild(new_line);
    }
    var price_line = document.createElement("p");
    price_line.innerHTML = `TOTAL: $${total_price}.00`;
    reciept.appendChild(price_line);

    var close_button = document.createElement("button");
    close_button.onclick = function() {
        document.getElementById("reciept").remove();
        displayPopup("screen_lock_overlay");
        total_price = 0;
        for (const key in selected_prices) {
            selected_prices[key] = 0;
        }
    }
    close_button.innerHTML = "Close";
    reciept.appendChild(close_button);
    document.body.appendChild(reciept);
}

//////////////////////////////////////LOGIN MANAGEMENT//////////////////////////////////////
//Login Form Creation
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
    <p>Please Login:</p>
    <p class="error popup_hidden" id="no_username"><i>Please enter a username</i></p>
    Username:<input type="text" name="username" id="username" placeholder="Username"> <br />

    <p class="error popup_hidden" id="no_password"><i>Please enter a password</i></p>
    Password:<input type="text" name="password" id="password" placeholder="Password"> <br />
    <input type="submit" /> 
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
    }
    if (password == "" && !pass_error) {
        displayPopup("no_password");
        pass_error = true;
    }

    if (username != "" && password != "") {  // Also fixed: was !username == ""
        var user_dict = JSON.parse(localStorage.getItem('user_dict'))

        if (!user_dict[username+password]) {
            user = {
                'username': username,
                'password': password,
                'booked_flights': []
            };
            user_dict[username+password] = user;
            localStorage.setItem('user_dict', JSON.stringify(user_dict));
        }
        
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('current_user', username+password);
        console.log(localStorage.getItem('current_user'))
        login_form.remove()
        displayPopup("screen_lock_overlay");
        account_display = document.getElementById("account_display");
        account_display.innerHTML = username;
    }
}

function onLoad() {
    // Initialize logged_in
    if (!localStorage.getItem('logged_in')) {
        localStorage.setItem('logged_in', 'false');
    }
    var logged_in = localStorage.getItem('logged_in') === 'true';
    
    // Initialize user_dict
    if (!localStorage.getItem('user_dict')) {
        localStorage.setItem('user_dict', JSON.stringify({}));
    }
    var user_dict = JSON.parse(localStorage.getItem('user_dict'));
    
    // Initialize current_user
    if (!localStorage.getItem('current_user')) {
        localStorage.setItem('current_user', '');
    }
    var current_user = localStorage.getItem('current_user');
    
    // Update display if logged in
    if (logged_in && current_user && user_dict[current_user]) {
        var account_display = document.getElementById("account_display");
        account_display.innerHTML = user_dict[current_user]['username'];
    }
}
