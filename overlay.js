function showImage(url) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create image
    const img = document.createElement('img');
    img.src = url;

    // Add image to overlay
    overlay.appendChild(img);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Close overlay on click
    overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
    });
}