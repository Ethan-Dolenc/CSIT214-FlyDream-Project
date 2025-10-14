//POPUPS
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

//MEAL PRICE AND SELECTED MEAL PRICE MANAGEMENT
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

    meal_form = document.getElementById('meal_form');
    if (!meal_form.classList.contains('popup_hidden')) {
        var price_display = document.getElementById("price_display");
        price_display.innerHTML = `Total Price: $${total_price}.00`;
    }
}

//MEAL CONFIRMATONS
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
    document.querySelectorAll('.selected_meal').forEach(div => div.classList.add('popup_hidden'));
    displayed_popups = displayed_popups.filter(id => id !== 'reciept');
    displayPopup('meal_form');
    createReciept(reciept_items);
    meal_form.reset();
}

//RECIEPT HANDLING
function createReciept(reciept_items) {
    reciept = document.getElementById("reciept");
    for (const item of reciept_items) {
        var new_line = document.createElement("p");
        new_line.innerHTML = `+ ${item}: $${price_dict[item]}.00`;
        let parentElement = document.getElementById('reciept');
        parentElement.appendChild(new_line);
    }
    var price_line = document.createElement("p");
    price_line.innerHTML = `TOTAL: $${total_price}.00`;
    let parentElement = document.getElementById('reciept');
    parentElement.appendChild(price_line);

    var close_button = document.createElement("button");
    close_button.onclick = function() {
        displayPopup('reciept'); 
        reciept.innerHTML = ''; 
        total_price = 0;
        for (const key in selected_prices) {
            selected_prices[key] = 0;
        }

    }
    close_button.innerHTML = "Close";
    parentElement.appendChild(close_button);

    displayPopup('reciept');
}

//////////////////////////////////////
var user_error=false;
var pass_error = false;
var username = "";
var password = "";
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

    if (!username == "" && !password == "") {
        displayPopup("login_form");
        displayPopup("screen_lock_overlay");
        if (pass_error) {displayPopup("no_password");}
        if (user_error) {displayPopup("no_username");}
        login_form.reset();
    }
}