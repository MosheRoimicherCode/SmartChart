function appendMessageToLog(sender, message, messageType, file) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', messageType);
    
    // Message content
    let content;
    const usernameColor = getColorFromName(sender); // Get color based on username
    const nameColor = getColorFromName("אני"); // Get color based on username
    if (sender != '') {
        content = `
            <div style="direction: rtl; text-align: right;">
                <strong class="username" style="color: ${usernameColor};">${sender}</strong><br>
                ${message}
            </div>`;
    } else {
        // content = `
        //     <div style="direction: rtl; text-align: right;">
        //         ${message}
        //     </div>`;

        content = `
                <strong class="username" style="color: ${nameColor};">${sender}</strong>
                ${message}
            </div>`;
    }

    // If there's a file (image or document)
    if (file) {
        if (file.type && file.type.startsWith('image/')) {
            // Handle image files
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                messageDiv.appendChild(img); // Append the image first
                
                img.onclick =  function() { showImage(img.src) };

                // Append the text message below the image
                const messageContent = document.createElement('div');
                messageContent.innerHTML = content; //+ '\n';  // Message content with the text
                //messageDiv.appendChild('</br>')
                messageDiv.appendChild(messageContent); // Append text below the image
            };
            reader.readAsDataURL(file); // Convert image to a data URL
        } 
        else if (file instanceof File) { // File sent by client user
            const fileSizeInBytes = file.size;
            const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(0);
            
            // Handle document files uploaded by user
            content = `
                <div>
                    <a href='${URL.createObjectURL(file)}' download='${file.name}'>
                        ${message}<br>${file.name}
                    </a>
                    <br><em>${fileSizeInKB} KB</em> 
                </div>`;
            messageDiv.innerHTML = content;  // Append document message
        } 
        else if (file == 'doc') { // File sent by support user
            content = `
                <div class="thumb">
                    <strong class="username" style="color: ${getColorFromName(sender)};">${sender}</strong><br>
                    ${message}
                </div>`;
            messageDiv.innerHTML = content; // Append support document message
        }
        else {
            messageDiv.innerHTML = content; //Support Send image
        }
    } else {
        // If no file, just append the content (text message)
        messageDiv.innerHTML = content;
    }

    // Append the message to the chat container
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}
// function listenForSupportReply() {
//     fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`)
//     .then(response => response.json())
//     .then(data => {
//         data.result.forEach(update => {
//             lastUpdateId = update.update_id;

//             if (checkIfMessagesAlreadyrecieved(lastUpdateId)) {
//                 console.log("Message already in array: " + lastUpdateId);
//                 return;
//             }
//             messangesIdUploaded.push(lastUpdateId);

//             if (update.message && update.message.chat.id == SUPPORT_GROUP_CHAT_ID) {
//                 const supportGuy = update.message.from.first_name;
                
//                 if (update.message.reply_to_message) {
                    
//                     //Check if the reply messaged, its send to current client user
//                     const originalMessage = update.message.reply_to_message.text || update.message.reply_to_message.caption;
//                     const sessionMatch = originalMessage.match(/Session:\s(\w+-\w+)/);

//                     if (sessionMatch && sessionMatch[1]) {
//                         const sessionId = sessionMatch[1];
//                         const originalUser = userSessions.get(sessionId);

//                         if (originalUser) {
//                             // Handling text messages
//                             if (update.message.text) {
//                                 //sendReplyToUser(update.message.text, originalUser);
//                                 appendMessageToLog(supportGuy, update.message.text, 'support-message');
//                             }
//                             // Handling images
//                             else if (update.message.sticker) {
//                                 //alert("sticker")

//                                 let fileId = update.message.sticker.file_id;
                                
//                                 getImageUrl(fileId).then(fileUrl => {   

//                                     let htmlElement = `<img src="${fileUrl}" alt="Photo from Telegram" />`;
//                                     appendMessageToLog(supportGuy, update.message.caption || htmlElement, 'support-message', { fileId });

//                                 }).catch(error => {
//                                     console.error(`Error getting Sticker URL:`, error);
//                                 });
//                             }
//                             else if (update.message.photo) {
//                                 //alert("photo")
//                                 let fileId = update.message.photo[update.message.photo.length - 1].file_id;

//                                 getImageUrl(fileId).then(fileUrl => {
                                
//                                     let htmlElement = `<img src="${fileUrl}" alt="Photo from Telegram" onclick="showImage('${fileUrl}')"/>`;

//                                     if (update.message.caption){
//                                         htmlElement = `<img src="${fileUrl}" alt="Photo from Telegram" onclick="showImage('${fileUrl}')"/> </br> <p>${update.message.caption}</p>`;
//                                     }
//                                     appendMessageToLog(supportGuy, htmlElement, 'support-message', { fileId });

//                                 }).catch(error => {
//                                 console.error(`Error getting Photo URL:`, error);
//                                 });
//                             }
//                             // Handling documents with download links
//                             else if (update.message.document) {
                                
//                                 let doc = update.message.document;
//                                 let fileId = doc.file_id;
//                                 let fileName = doc.file_name || 'document'; // Fallback to 'document' if file_name is missing

//                                 getDocumentUrl(fileId, fileName).then(async fileUrl => {
//                                     // Get the thumbnail URL if available
//                                     let thumbnailUrl = await getThumbnailUrl(doc);
                                    
//                                     console.log(thumbnailUrl)

//                                     let docLink = `<a href="${fileUrl}" download="${fileName}">${fileName}</a>`;
//                                     let caption = '';

//                                     if (update.message.caption){
//                                         caption = update.message.caption;
//                                     }

//                                     let messageContent = caption + "<br>" + docLink;
//                                     const fileSizeInKB = (update.message.document.file_size / 1024).toFixed(0);

//                                     if (thumbnailUrl) {
//                                         // Include the thumbnail image in the message
//                                         thumbnailImage = `<a  href="${fileUrl}" download="${fileName}">
//                                             <img src="${thumbnailUrl}" alt="Document Thumbnail"">
//                                         </a>`;        
//                                         docLink = `<a href="${fileUrl}" download="${fileName}">${fileName}</a>`;
                               
//                                         messageContent = thumbnailImage + "<br>" + caption  + "<br>" + docLink + "<br> <em>" + fileSizeInKB + " KB</em>";
//                                     }
                                    
//                                     // Append the message with the document link and thumbnail if available
//                                     appendMessageToLog(supportGuy, messageContent, 'support-message', 'doc');
                                
//                                 }).catch(error => {
//                                     console.error(`Error getting Document URL:`, error);
//                                 });
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error receiving updates:', error));
// }
// Function to get the file path from Telegram
function getFilePath(fileId) {
    return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
        .then(response => response.json())
        .then(data => data.result.file_path)
        .catch(error => console.error('Error getting file path:', error));
}
function getImageUrl(fileId) {
    return getFilePath(fileId)
        .then(filePath => {
            if (filePath) {
                return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
            } else {
                throw new Error('File path not found');
            }
        });
}
function getDocumentUrl(fileId, filename){
    return createDownloadLink(fileId, filename)
}