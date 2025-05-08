// Function to handle sending message and file
function handleSendMessage() {

    if (first_message == true){
        reply_to_first_message();
        getUpdatesFromBot();

        return;
    }

    const message = document.getElementById('message-input').value;
    const fileInput = document.getElementById('file-input');
    
    if (message || fileInput.files.length > 0) {
        sendMessageToBot(message, sessionId, fileInput.files[0]); // You need to define sendMessageToBot function
        
        // Clear the input fields after sending
        document.getElementById('message-input').value = '';
        fileInput.value = ''; // Clear file input
        document.getElementById('file-name').textContent = ''; // Clear file name display
    }
}

function sendMessageToBot(message, sessionId, file) {
        
    const sendButton = document.getElementById('send-button');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formData = new FormData();
    formData.append('chat_id', SUPPORT_GROUP_CHAT_ID);
    formData.append('parse_mode', 'HTML');

    if (file) {
        sendButton.disabled = true; // Disable the button
        loadingIndicator.style.display = 'flex'; // Show loading indicator 
        if (file.type.startsWith('image/')) {
            formData.append('photo', file);
        } else {
            formData.append('document', file);
        }
        formData.append('caption', `Support Request (Session: ${sessionId}): 
            User Name: ${user_name} 
            Fly Project: ${getTerra_project_name()}
            \nMessage: <b>${message}</b>
            \n${TELEGRAM_BOT_USERNAME}
            `);
    } else {
        // Send message with new lines instead of <br>
        formData.append('text', `Support Request (Session: ${sessionId}): 
            User Name: ${user_name} 
            Fly Project: ${getTerra_project_name()}
            \nMessage: <b>${message}</b>
            \n${TELEGRAM_BOT_USERNAME}
            `);
        // Set parse_mode to HTML to allow bold formatting
    }

    formData.append('reply_markup', JSON.stringify({
        force_reply: true,
        selective: true
    }));

    const endpoint = file ? 
        (file.type.startsWith('image/') ? 'sendPhoto' : 'sendDocument') : 
        'sendMessage';

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(async data => {
        if (data.ok) {

            let thumbnailUrl = '';

            // Check if thumbnail exists
            if (data.result.document && data.result.document.thumbnail) {
                // Get the thumbnail URL using getFile method
                thumbnailUrl = await getThumbnailUrl(data.result.document);
                message = await formatMessageWithThumbnail(message, thumbnailUrl);
            }
            userSessions.set(sessionId, 'user');
            appendMessageToLog('', message, 'user-message', file);
        } else {
            console.error("Error sending message:", data);
            alert(`Error: ${data.description || "Unknown error."}`);
        }

        sendButton.disabled = false; // Re-enable the button on error
        loadingIndicator.style.display = 'none'; // Hide loading indicator

    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert("Network error: Please check your connection.");

        sendButton.disabled = false; // Re-enable the button on error
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    });


}
//Send file from bot to support team
function sendFileToUser(fileId, userChatId, caption) {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: userChatId,
            document: fileId,
            caption: caption ? `Support Team: ${caption}` : 'Support Team sent a file'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('File sent to user:', data);
    })
    .catch(error => console.error('Error sending file to user:', error));
}

async function  formatMessageWithThumbnail(message, thumbnailUrl) {
    if (thumbnailUrl) {
        return `
        <img class='thumb' src="${thumbnailUrl}" alt="Thumbnail" >
         <br>
        ${message}
        `;
    }
    return message;
}

