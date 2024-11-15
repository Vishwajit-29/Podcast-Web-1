//slidernav
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dotsContainer: document.getElementById('sliderDots'),

    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // Start auto-play
        this.startAutoPlay();
    },

    updateSlides() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            this.dotsContainer.children[index].classList.remove('active');
        });

        this.slides[this.currentSlide].classList.add('active');
        this.dotsContainer.children[this.currentSlide].classList.add('active');
    },

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    },

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    },

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
        this.resetAutoPlay();
    },

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    },

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
};

// Initialize slider
document.addEventListener('DOMContentLoaded', () => {
    slider.init();
});

// Navigation functions
function nextSlide() {
    slider.nextSlide();
    slider.resetAutoPlay();
}

function prevSlide() {
    slider.prevSlide();
    slider.resetAutoPlay();
}

// Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const body = document.body;

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.classList.toggle('menu-open');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
}

// Event Listeners
hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = navLinks.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Handle visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        heroVideo.pause();
    } else {
        heroVideo.play().catch(function(error) {
            console.log("Resume play prevented:", error);
        });
    }
});


// Video Modal
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modal-video');
const playPauseIcon = document.getElementById('playPauseIcon');
const progressFilled = document.getElementById('progressFilled');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeIcon = document.getElementById('volumeIcon');

function openModal(videoSrc) {
    modalVideo.src = videoSrc;
    videoModal.classList.add('active');
    modalVideo.play().then(() => {
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
        updateDuration();
        updateProgress();
        setInterval(updateProgress, 500);
    }).catch(error => {
        console.error("Error playing video:", error);
    });
}

function closeModal() {
    modalVideo.pause();
    videoModal.classList.remove('active');
    modalVideo.src = '';
    clearInterval(updateProgress);
}

function togglePlayPause() {
    if (modalVideo.paused) {
        modalVideo.play();
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        modalVideo.pause();
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
    }
}

function updateDuration() {
    modalVideo.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(modalVideo.duration);
    });
}

function updateProgress() {
    if (!modalVideo.paused) {
        const progress = (modalVideo.currentTime / modalVideo.duration) * 100;
        progressFilled.style.width = progress + '%';
        currentTimeDisplay.textContent = formatTime(modalVideo.currentTime);
    }
}

function seek(event) {
    const rect = event.target.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    modalVideo.currentTime = pos * modalVideo.duration;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

function toggleVolume() {
    modalVideo.muted = !modalVideo.muted;
    volumeIcon.classList.toggle('fa-volume-up');
    volumeIcon.classList.toggle('fa-volume-mute');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (modalVideo.requestFullscreen) {
            modalVideo.requestFullscreen();
        } else if (modalVideo.webkitRequestFullscreen) {
            modalVideo.webkitRequestFullscreen();
        } else if (modalVideo.msRequestFullscreen) {
            modalVideo.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}


// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
    if (videoModal.classList.contains('active')) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                togglePlayPause();
                break;
            case 'm':
                toggleVolume();
                break;
            case 'f':
                toggleFullscreen();
                break;
        }
    }
});

// Add keyboard controls for left and right arrow keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        nextSlide(); // Go to the next slide
    } else if (event.key === 'ArrowLeft') {
        prevSlide(); // Go to the previous slide
    }
});

function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ""; // Clear previous results

    if (query) {
        const filteredResults = videoData.filter(video => video.title.toLowerCase().includes(query));

        if (filteredResults.length > 0) {
            // Display filtered video results
            filteredResults.forEach(video => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="result-thumbnail">
            <div class="result-info">
                <h4>${video.title}</h4>
            </div>
        `;
                resultItem.onclick = () => openModal(video.videoUrl);
                resultsContainer.appendChild(resultItem);
            });
        } else {
            // Display "No results found" message
            const noResultMessage = document.createElement('div');
            noResultMessage.className = 'no-result';
            noResultMessage.textContent = "No results found";
            resultsContainer.appendChild(noResultMessage);
        }

        resultsContainer.classList.add('visible'); // Show results container
    } else {
        resultsContainer.classList.remove('visible'); // Hide results container if query is empty
    }
}


const videoData = [{
    title: "Tech Talks with Rishi & Elon",
    thumbnail: "/Thumbnails/Tech_Thunb.webp",
    videoUrl: "/Podcaste/Elon_pod_vid.mp4"
}, {
    title: "CarryMinati's Life Story",
    thumbnail: "/Thumbnails/Carry_pod.jpg",
    videoUrl: "/Podcaste/carry_pod_vid.mp4"
}, {
    title: "Talking Tech with Tim Cook",
    thumbnail: "/Thumbnails/Tim_cook_thumb.jpg",
    videoUrl: "/Podcaste/tim_cook_pod.mp4"
}];