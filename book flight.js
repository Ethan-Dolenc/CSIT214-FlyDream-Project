function loadFlights() {
    fetch('./available_flights.json')
        .then(response => response.json())
        .then(data => {displayFlights(data);})
        .catch(error => console.error('Error:', error));

}

function displayFlights(flight_data) {
    for (const flight of flight_data) {

        var flight_details = document.createElement("tr");
        flight_details.innerHTML = `<td class="flight">
                                        <table>
                                            <tr>
                                                <td><p><b>${flight["flight_number"]}</b></p></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>${flight["departure_time"]}</p>
                                                </td>
                                                <td>
                                                    <p>---></p>
                                                </td>
                                                <td>
                                                    <p>${flight["arrival_time"]}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>${flight["origin"]} ${flight["departure_date"]}</p>
                                                </td>
                                                <td></td>
                                                <td>
                                                    <p>${flight["destination"]} ${flight["arrival_date"]}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td>
                                        <p>Book Flight</p>
                                    </td>`;

        

        let parentElement = document.getElementById('flight_display');
        parentElement.appendChild(flight_details);
    }
}

function flight_hover() {

}