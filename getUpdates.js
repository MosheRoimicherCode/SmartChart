var messages_recieved_previusly = [];

async function getUpdatesFromBot() {
    try {
        let response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset_to_search_telegram_messages}`);
        let data = await response.json();

        // Keep fetching until less than 100 results are returned
        while (data.result.length === 100) {
            for (let update of data.result) {
                if (isMessageInArray(update.update_id)) {
                    continue; // Skip already processed messages
                }

                if (isRelevantMessage(update)) {
                    save_message_in_array(update); // Save the message if relevant
                    await create_div(update); // Ensure the div creation is awaited
                }
            }

            // Update offset to avoid fetching the same messages again
            offset_to_search_telegram_messages = data.result[data.result.length - 1].update_id + 1;

            // Fetch the next batch of updates
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset_to_search_telegram_messages}`);
            data = await response.json();
        }

        // Handle any remaining updates (less than 100)
        for (let update of data.result) {
            if (isMessageInArray(update.update_id)) {
                continue; // Skip already processed messages
            }

            if (isRelevantMessage(update)) {
                save_message_in_array(update); // Save the message if relevant
                await create_div(update); // Ensure the div creation is awaited
            }
        }

    } catch (error) {
        console.log("Error fetching updates:", error);
    }
}
function check_messageId(id_requested, update){

    if (update.message){
        if (update.message.text){
            if(update.message.text.includes(id_requested))
                return true
        }
    }
    if (update.message){
        if (update.message.reply_to_message){
            if (update.message.reply_to_message.text) {
                if(update.message.reply_to_message.text.includes(id_requested))
                        return true
            }
        }
    }
    if (update.message){
        if (update.message.caption){
            if(update.message.caption.includes(id_requested))
                return true
        }
    }
    if (update.message){
        if (update.message.reply_to_message){
            if (update.message.reply_to_message.caption) {
                if(update.message.reply_to_message.caption.includes(id_requested))
                        return true
            }
        }
    }

    return false;
}
function get_text_message(update){
    return update.message.text;
}
async function get_image_message(update) {
    if (update.message && update.message.photo) {
        const photoArray = update.message.photo;
        const fileId = photoArray[photoArray.length - 1].file_id; // Get the largest photo
        let photoUrl;
        try {
            // Fetch the photo file
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileData = await res.json();
            const filePath = fileData.result.file_path;
            photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

        } catch (error) {
            console.error('Error fetching the photo file:', error);
        }
        
        const text_msg = update.message.caption;
        
        return {photoUrl, text_msg}
    }

    return undefined
}
function get_user_name_from_message(update){
    return `${update.message.from.first_name || ''} ${update.message.from.last_name || ''}`.trim();
}
async function get_file_message(update) {
    if (update.message && update.message.document) {
        const fileId = update.message.document.file_id; // Get the file ID of the document
        let fileUrl, thumbUrl, file_name, file_size_KB;

        try {
            // Fetch the file details
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileData = await res.json();
            const filePath = fileData.result.file_path;
            file_name = update.message.document.file_name;
            fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
            file_size_KB = (update.message.document.file_size / 1024).toFixed(0);

            // Check for thumbnail and get its URL if available
            if (update.message.document.thumb) {
                const thumbFileId = update.message.document.thumb.file_id;
                const thumbRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${thumbFileId}`);
                const thumbData = await thumbRes.json();
                const thumbPath = thumbData.result.file_path;
                thumbUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${thumbPath}`;
            }

        } catch (error) {
            console.error('Error fetching the file or thumbnail:', error);
        }

        const text_msg = update.message.caption || ''; // Default to empty string if no caption

        return { fileUrl, thumbUrl, text_msg, file_name, file_size_KB };
    }

    return undefined; // Explicitly return undefined if conditions aren't met
}
function isMessageInArray(update_id) {
    let bool = messages_recieved_previusly.some(msg => msg.update_id == update_id)
    return bool;
}
function save_message_in_array(update){ 
    // If not found, push the update to the array
    messages_recieved_previusly.push(update);
}
function isMessageRecent(messageDate) {
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6); // Subtract 6 days from the current date

    // Convert the Unix timestamp to a Date object
    const messageDateObj = new Date(messageDate * 1000); // Convert seconds to milliseconds

    // Return true if the message date is after sixDaysAgo
    return messageDateObj >= sixDaysAgo;
}
function isRelevantMessage(update){
    return (check_messageId(getChatId(), update) && isMessageRecent(update.message.date))
}
function isSupportMessage(update){
    if (update.message.reply_to_message) 
        return true
    return false
}
async function create_image_message_tag(update) {
    let html_element;
    try {
        let user_name = isSupportMessage(update) ? get_user_name_from_message(update) : "אני";
        const user_name_color = getColorFromName(user_name);

        html_element = `
            <div>
                <strong class="username" style="color: ${user_name_color};">${user_name}</strong><br>
        `;

        const { photoUrl, text_msg } = await get_image_message(update);

        if (photoUrl) {
            html_element += `<img src="${photoUrl}" alt="Photo from Telegram" onclick="showImage('${photoUrl}')"/>`;
        }
        if (text_msg) {
            html_element += `<br><span>${text_msg}</span>`;
        }

        // Close the div tag
        html_element += `</div>`;
    } catch (error) {
        console.error("Error creating image message tag:", error);
        html_element = `<div>Error loading message. Please try again later.</div>`;
    }

    return html_element;
}
async function create_document_message_tag(update) {

    let html_element;
    try {
        let user_name = isSupportMessage(update) ? get_user_name_from_message(update) : "אני";
        const user_name_color = getColorFromName(user_name);

        html_element = `
            <div>
                <strong class="username" style="color: ${user_name_color};">${user_name}</strong><br>
        `;

        const { fileUrl, thumbUrl, text_msg, file_name, file_size_KB} = await get_file_message(update);

        if (thumbUrl && fileUrl) {       
            html_element += `<a  href="${fileUrl}" download="${file_name}">
                                            <img src="${thumbUrl}" alt="Document Thumbnail"">
                                            <br><span href="${fileUrl}" download="${file_name}">${file_name}</span>
                                        </a>`;
        }
        if (!thumbUrl && fileUrl) {       
            html_element += `<a  href="${fileUrl}" download="${file_name}">
                                            <br><span href="${fileUrl}" download="${file_name}">${file_name}</span>
                                        </a>`;
        }
        if (file_size_KB){
            html_element += "<br><em>" + file_size_KB + " KB</em>"
        }
        if (text_msg) {
            html_element += `<br><span>${text_msg}</span>`;
        }

        // Close the div tag
        html_element += `</div>`;

    }
    catch (error) {
        console.error("Error creating image message tag:", error);
        html_element = `<div>Error loading message. Please try again later.</div>`;
    }

    return html_element;
}
async function create_sticker_message_tag(update){
    throw new Error("Not implemented."); 
}
function create_text_message_tag(update){
    let html_element;

    let user_name = get_user_name_from_message(update);
    if (!isSupportMessage(update))
        user_name = "אני";
    const user_name_color = getColorFromName(user_name)

    html_element = `
        <div">
            <strong class="username" style="color: ${user_name_color};">${user_name}</strong><br>
            ${get_text_message(update)}
        </div>`;
    return html_element;
}
async function create_div(update){

    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (isSupportMessage(update)){
        messageDiv.classList.add('support-message');
    }
    else {
        messageDiv.classList.add('user-message');
    }

    let html_element;



    if (update.message.photo) {
        html_element = await create_image_message_tag(update)
    } else if (update.message.document) {
        html_element = await create_document_message_tag(update)
    } else if (update.message.text) {
        html_element = create_text_message_tag(update)
    }
    // } else if (update.message.sticker) {
    //     html_element = create_sticker_message_tag (update)
    // } 

    messageDiv.innerHTML = html_element;
    // Append the message to the chat container
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}