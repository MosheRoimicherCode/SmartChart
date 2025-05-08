const nameProj = "ExampleProject"; // Replace this with the actual project name
const first_message_html_form = `
    <div style="direction: rtl; text-align: right;">
        <h2>שאלות</h2>
        <form>
            <label for="projConfirm">"myProject" זהו הפרויקט שלך?</label><br>
            <input type="radio" id="yes" name="projConfirm" value="yes">
            <label for="yes">כן</label><br>
            <input type="radio" id="no" name="projConfirm" value="no">
            <label for="no">לא</label><br><br>
            
            <label for="userName">מה שמך?</label><br>
            <input type="text" id="userName" name="userName"><br><br>
            
            <label for="userQuestion">הזן כאן את שאלתך ואנו נענה לך בהקדם האפשרי</label><br>
            <textarea id="userQuestion" name="userQuestion" rows="4" cols="50"></textarea><br><br>
            
            <input type="submit" value="שלח">
        </form>
    </div>
`;
//ask for user name
const user_name_collected = ` 
    <div class="message support-message name_confirmation name_confirmation_marker">
        <p>אנא הזן את שמך:</p>
        <div class="user-name-message-bar">
            <input type="text" id="user_name_input" placeholder="הזן שם כאן..." />
        </div>
        <div class="button-container">
            <button class="confirmation_message" onclick="handleNameSubmit()">המשך</button>
        </div>
    </div>
`;

// automatic first message to user - hellow msg
const hellowUserMessage = (user_name) => `
    <div class="message support-message name_confirmation hello_message">
        <b>שלום ${user_name}</b>
<p>תודה על פנייתך! כדי שנוכל לסייע לך במהירות האפשרית, אנא רשום כאן את נושא פנייתך .</p>

        <div class="button-container">
            <button class="confirmation_message" onclick="change_name()">שינוי שם</button>
        </div>

    </div>
`;




function reply_to_first_message(){

    if (typeof user_name === 'undefined' || user_name == 'undefined') {
        getUserName();
        //return;
    }
    else {
        show_hellow_message()
    }

    
}

function show_hellow_message(){

    deleteConfirmationMarkers();

    let chatContainer = document.getElementById('chat-container');

    const messageDiv = document.createElement('div');
     // Set the content and append the message to the chat container
     messageDiv.innerHTML = hellowUserMessage(user_name);
     chatContainer.appendChild(messageDiv);
     chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom

     first_message = false;
}

//Ask for name message
function askUserForName(){
    let chatContainer = document.getElementById('chat-container');

    const messageDiv2 = document.createElement('div');
    messageDiv2.innerHTML = user_name_collected;
    chatContainer.appendChild(messageDiv2);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}
//Collect for name user input value
function handleNameSubmit() {
    user_name = document.getElementById('user_name_input').value;
    // Now you can handle the userName data, such as sending it to your backend or processing it further.
    localStorage.setItem('user-name', user_name);
    // Optionally, you can perform validation or other operations here.
    reply_to_first_message();
}

function deleteConfirmationMarkers() {
    // Get the container by its ID
    const container = document.getElementById('chat-container');
    
    if (container) {
        // Find all elements with the class name 'name_confirmation_marker' inside the container
        const markers = container.getElementsByClassName('name_confirmation');
        
        // Convert the HTMLCollection to an array to safely iterate and remove elements
        const markersArray = Array.from(markers);
        
        // Loop through the array and remove each element
        markersArray.forEach(marker => {
            marker.remove();
        });
    } else {
        console.log("Container not found");
    }
}

