function getColorFromName(name) {
    // Simple hash function to convert name to a number
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash); // hash * 31 + charCode
    }
    
    // Convert hash to a color (hex)
    const color = ((hash >> 24) & 0xFF) << 16 | // red
                  ((hash >> 16) & 0xFF) << 8 |  // green
                  (hash & 0xFF);                 // blue
    
    return `#${(0x1000000 + color).toString(16).slice(1)}`; // Ensure 6 digits
}

function getFileExtension(fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1) {
      return fileName.substring(dotIndex   
   + 1).toLowerCase();
    } else {
      return ''; // File has no extension
    }
}

function getFileName(path) {
    const dotIndex = path.lastIndexOf('\\');
    if (dotIndex !== -1) {
      return path.substring(dotIndex   
   + 1);
    } else {
      return ''; // File has no extension
    }
}

function getChatId() {
  const currentTime = new Date();
  const expirationTime = localStorage.getItem('chat-id-expiration');

  // Check if there is already a chat-id and if it hasn't expired
  if (localStorage.getItem('chat-id') && expirationTime && currentTime.getTime() < parseInt(expirationTime)) {
      return localStorage.getItem('chat-id'); // Return the existing chat-id if valid
  } else {
      // Generate a new session ID
      const sessionId = generateSessionId();
      localStorage.setItem('chat-id', sessionId);

      // Set expiration time to one week from now (7 days)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Add 7 days

      // Store the expiration time in milliseconds
      localStorage.setItem('chat-id-expiration', expirationDate.getTime());

      return sessionId; // Return the new session ID
  }
}

function getUserName() {
  // Check if there is already a chat-id and if it hasn't expired
  if (localStorage.getItem('user-name')) {
    user_name = localStorage.getItem('user-name'); // Return the existing chat-id if valid
    if (user_name == 'undefined'){
        askUserForName();
      }
    
    return;
  } 
  askUserForName();
}

// Helper function to generate a random session ID
function generateSessionId() {
  return 'session-' + Math.random().toString(36).substring(2, 9);
}

function change_name(){
  askUserForName();
}

var winsize = 110;

function hideAndShow() {
  // Select all elements inside the container except the button
  const container = document.getElementById("container");
  const hideShowButton = document.getElementById("hideAndShowButton");
  const elementsToToggle = container.querySelectorAll(":scope > *:not(.Header)");
  const HeaderTitle = document.getElementById("HeaderTitle");

  const initialSpan = document.getElementById("initialSpan");
  initialSpan.style.display = (initialSpan.style.display !== 'none') ? 'none' : 'flex';
  
  const Header = document.getElementById("Header");
  Header.style.display = (Header.style.display == 'flex') ? 'none' : 'flex';

  // Toggle visibility of each element
  elementsToToggle.forEach(element => {
      if (element.style.display === "none") {
          element.style.display = "flex";  // Show element
          HeaderTitle.style.display = "inline-flex"
          resizePopUp(450)
          const chatContainer = document.getElementById('chat-container');
          const messageDiv = document.createElement('div');
          chatContainer.appendChild(messageDiv);
          chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
      } else {
          element.style.display = "none";   // Hide element
          HeaderTitle.style.display = "none"

          resizePopUp(winsize)
      }
  });
}


function resizePopUp(height){

  if(!height){
    return;
  }

  const pop = SGWorld.Window.GetPopupByCaption('Smart Kav');

  pop.Height = height;
  
  if (height == winsize){
      pop.Width = height;
  } else {
      pop.Width = 350;
  }
}