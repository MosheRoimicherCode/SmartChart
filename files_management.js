async function createDownloadLink(fileId) { // Include botToken as argument
    try {
      // Fetch file information from Telegram API
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
      const data = await response.json();
  
      // Extract file path
      const filePath = data.result.file_path;
  
      // Construct download link
      const downloadLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

      return downloadLink;
    } 
    catch (error) {
      console.error('Error fetching file information:', error);
      return 'Error fetching file information.';
    }
}

async function getThumbnailUrl(document) {
    try {
        // Check if the document has a thumbnail
        if (document.thumbnail || document.thumb) {
            let thumbFileId = document.thumbnail?.file_id || document.thumb?.file_id;

            // Fetch file details using Telegram bot API
            let response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${thumbFileId}`);
            let data = await response.json();

            if (data.ok && data.result) {
                // Get the file path from the result
                let filePath = data.result.file_path;
                let thumbUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
                return thumbUrl;
            } else {
                console.log("Failed to get file information.");
                return null;
            }
        } else {
            console.log("No thumbnail available for this document.");
            return null;
        }
    } catch (error) {
        console.error('Error getting thumbnail URL:', error);
        return null;
    }
}
