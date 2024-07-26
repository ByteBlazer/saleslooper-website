function toggleHamburger(x) {
  x.classList.toggle("change");
}

let player;
let videoObserver;
const videoUrl = "https://www.youtube.com/embed/J6I0YVHO-hs?enablejsapi=1";

function onYouTubeIframeAPIReady() {
  const iframe = document.getElementById("youtube-video");
  player = new YT.Player(iframe, {
    events: {
      onReady: function (event) {
        setupObserver();
      },
    },
  });
}

function playVideo() {
  if (player) {
    player.playVideo();
  } else {
    console.error("Player is not ready.");
  }
}

function setupObserver() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  videoObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideo();
        observer.unobserve(entry.target); // Stop observing once the video has started playing
      }
    });
  }, options);

  const videoSection = document.getElementById("video-section");
  if (videoSection) {
    videoObserver.observe(videoSection);
  } else {
    console.error("Element with ID 'video-section' not found.");
  }
}

// Reload observer when the page becomes visible again
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible" && videoObserver) {
    const videoSection = document.getElementById("video-section");
    if (videoSection) {
      videoObserver.observe(videoSection);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Load the IFrame Player API code asynchronously
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Modal interaction
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("close-modal");

  // Check if the modal has been shown before
  if (!localStorage.getItem("modalShown")) {
    document.getElementById("youtube-video").src = videoUrl + "&mute=0"; // Autoplay non-muted video for first-time users
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
    document.getElementById("youtube-video").src = videoUrl + "&mute=1"; // Autoplay muted video for repeat visitors
    setupObserver(); // Set up the observer immediately if the modal was shown before
  }

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
    localStorage.setItem("modalShown", "true"); // Set the flag in localStorage
    setupObserver(); // Set up the observer after the user interacts
  };
});
