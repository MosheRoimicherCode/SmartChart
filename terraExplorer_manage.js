var SGWorld = initSGWorld();

const getTerra_project_name = () => getFileName(SGWorld.Project.Name);
const getFuserName = () => SGWorld.SGServer.GetUserDisplayName();

function hideAndShow() {
    // Select all elements inside the container except the button
    const container = document.getElementById("container");
    const hideShowButton = document.getElementById("hideAndShowButton");
    const elementsToToggle = container.querySelectorAll(":scope > *:not(.hideAndShowButton)");

    // Toggle visibility of each element
    elementsToToggle.forEach(element => {
        if (element.style.display === "none") {
            element.style.display = "flex";  // Show element
            resizePopUp(450)

        } else {
            element.style.display = "none";   // Hide element
            resizePopUp(75)
        }
    });
}

function resizePopUp(height){
    var pop = SGWorld.Window.GetPopupByCaption('Smart Kav');
    pop.Height = height;
    
    if (height == 75){
        pop.Width = height;
    } else {
        pop.Width = 350;
    }
}