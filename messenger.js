    const TELEGRAM_BOT_TOKEN = '7474603524:AAHx5PzN-RKVMqVulCAI6VFampGoRskuUAY'; 
    const SUPPORT_GROUP_CHAT_ID = '-1002421940434';
    const TELEGRAM_BOT_USERNAME = '@KavMedidaTeamBot'; 
    const TELEGRAM_SENDER_BOT_TOKEN = '8104017431:8104017431:AAE8RBlHHyYCPgmFFJTkIBwzfilx69DlmQs'
    var offset_to_search_telegram_messages = 460941682;

    const userSessions = new Map();
    let lastUpdateId = 0;
    const sessionId = getChatId();
    
    const message = document.getElementById('message-input').value;
    const fileInput = document.getElementById('file-input');

    var first_message = true; 
    var user_name;
    setInterval(getUpdatesFromBot, 2000);

