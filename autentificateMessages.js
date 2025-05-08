const messangesIdUploaded = [];

function checkIfMessagesAlreadyrecieved(messageId){
    return messangesIdUploaded.includes(messageId);
}