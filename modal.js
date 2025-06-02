export function showModal(title, el) {
    return new Promise((resolve, reject) => {
        const modalEl = document.getElementById('modal');
        modalEl.hidden = false;
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = title;
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = ''; // Clear previous content
        modalContent.appendChild(el);
        const modalClose = document.getElementById('modal-close');
        
        modalClose.onclick = () => {
            modalEl.hidden = true;
            resolve(null); // Resolve with null when closed
        };
        
    });
}