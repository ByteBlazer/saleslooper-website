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

function scrollToVideo() {
  const videoSection = document.getElementById("youtube-video-container");
  if (videoSection) {
    const viewportHeight = window.innerHeight;
    const videoSectionTop =
      videoSection.getBoundingClientRect().top + window.scrollY;
    const videoSectionHeight = videoSection.offsetHeight;
    const bottomPosition =
      videoSectionTop - viewportHeight + videoSectionHeight;
    window.scrollTo({
      top: bottomPosition + 10,
      behavior: "smooth",
    });
  } else {
    console.error("Element with ID 'youtube-video-container' not found.");
  }
}

function unmuteAndPlayVideo() {
  if (
    player &&
    typeof player.unMute === "function" &&
    typeof player.playVideo === "function"
  ) {
    player.unMute();
    player.seekTo(0);
    player.playVideo();
  } else {
    console.error("Player is not ready or unMute/playVideo is not defined.");
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
  const modal = document.getElementById("country-modal");
  const closeModalBtn = document.getElementById("close-country-modal");

  // Check if the modal has been shown before
  if (!localStorage.getItem("countryModalShown")) {
    document.getElementById("youtube-video").src = videoUrl + "&mute=0"; // Autoplay non-muted video for first-time users
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
    document.getElementById("youtube-video").src = videoUrl + "&mute=1"; // Autoplay muted video for repeat visitors
    setupObserver(); // Set up the observer immediately if the modal was shown before
  }

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
    localStorage.setItem("countryModalShown", "true"); // Set the flag in localStorage
    setupObserver(); // Set up the observer after the user interacts
  };

  // Watch Overview button interaction
  const watchOverviewBtn = document.getElementById("watch-overview-button");
  watchOverviewBtn.onclick = function () {
    unmuteAndPlayVideo();
    scrollToVideo();
  };

  // Book Free Demo button interaction
  const bookFreeDemoBtnList =
    document.getElementsByClassName("demo-modal-opener");
  const demoModal = document.getElementById("demo-modal");

  const closeDemoModal = document.getElementById("close-demo-modal");
  closeDemoModal.onclick = function () {
    demoModal.style.display = "none";
  };

  for (let i = 0; i < bookFreeDemoBtnList.length; i++) {
    const bookFreeDemoButton = bookFreeDemoBtnList[i];
    bookFreeDemoButton.onclick = function () {
      const modal = document.getElementById("demo-modal");
      modal.style.display = "flex";
    };
  }
});
