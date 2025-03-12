const searchInput = document.querySelector(".inputSection");
const searchBtn = document.querySelector(".btn");
const imageGallery = document.querySelector(".images");
const more = document.querySelector(".more");


const accessKey = "iIKMKOtSH7uA5Lt058lhjsb7-l6_n3o4DGdDAuAJIvA";
let page = 1;
let keyword = "";

//image clear kar diya 
function clearGallery() {
    imageGallery.innerHTML = "";
}

// loding show karne ka function
function showLoading() {
    const loading = document.createElement("div");
    loading.classList.add("loading");
    loading.textContent = "Loading...";
    imageGallery.appendChild(loading);
}

// function ka error handle karo
function handleError(error) {
    console.error("Error:", error);
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error");
    errorMessage.textContent = "Failed to load images. Please try again later.";
    imageGallery.appendChild(errorMessage);
}

async function getImages() {
    try {
        showLoading();
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const results = data.results; // result yhi aa rha hai bhai
        
        if (results.length === 0) {
            const noResults = document.createElement("div");
            noResults.textContent = "No images found. Try another search!";
            imageGallery.appendChild(noResults);
            return;
        }

        clearGallery();
        
        results.forEach((result) => {
            const li = document.createElement("li");
            li.classList.add("image");
            
            const html = `
                <img src="${result.urls.small}" 
                     class="photo" 
                     alt="${result.alt_description || 'Unsplash image'}">
                <div class="details">
                    <div class="user">
                        <img src="${result.user.profile_image.small}" 
                             alt="${result.user.name}'s profile picture">
                        <span>${result.user.name}</span>
                        <a href="${result.links.download}?force=true" 
                           class="download" 
                           aria-label="Download image"
                           target="_blank" 
                           rel="noopener noreferrer">
                            <img src="image/download.svg" alt="" aria-hidden="true">
                        </a>
                    </div>
                </div>
            `;
            
            li.innerHTML = html;
            imageGallery.appendChild(li);
        });
    } catch (error) {
        handleError(error);
    }
}

// search btn event 
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    keyword = searchInput.value.trim();
    page = 1;
    
    if (keyword) {
        getImages();
    }
});

// keyboard event
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
});

//e tav default search ahay ho
keyword = "nature";
getImages();



//more ka function yhi hai
more.addEventListener("click",()=>{
    page++;
    getImages();
})