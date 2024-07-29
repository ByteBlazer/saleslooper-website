// Function to toggle the hamburger menu icon to an "X" and vice versa
function toggleHamburger(x) {
  x.classList.toggle("change");
}

let player; // YouTube player object
let videoObserver; // Intersection observer for video auto-play
const videoUrl = "https://www.youtube.com/embed/J6I0YVHO-hs?enablejsapi=1"; // YouTube video URL with API enabled

// Function called when the YouTube IFrame API is ready
function onYouTubeIframeAPIReady() {
  const iframe = document.getElementById("youtube-video");
  player = new YT.Player(iframe, {
    events: {
      onReady: function (event) {
        setupObserver(); // Setup intersection observer when player is ready
      },
    },
  });
}

// Function to play the video
function playVideo() {
  if (player) {
    player.playVideo();
  } else {
    console.error("Player is not ready.");
  }
}

// Function to scroll to the video section
function scrollToVideo() {
  const videoHeadingElement = document.getElementById("youtube-video-heading");
  if (videoHeadingElement) {
    const videoHeadingTop =
      videoHeadingElement.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: videoHeadingTop - 80,
      behavior: "smooth",
    });
  } else {
    console.error("Element with ID 'youtube-video-heading' not found.");
  }
}

// Function to unmute and play the video
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

// Function to setup an intersection observer for auto-playing the video
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

// Function to get the user's country using IP Geolocation
function getCountryFromIP() {
  fetch("https://ipinfo.io/json?token=efd71ebb4072bd")
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;
      handleCountrySpecificLogic(country);
    })
    .catch((error) => console.error("Error fetching country from IP:", error));
}

// Function to handle country-specific logic
function handleCountrySpecificLogic(country) {
  const currencyElements = document.querySelectorAll(".currency-symbol");
  currencyElements.forEach((element) => {
    if (country === "IN") {
      element.textContent = "₹";
    } else {
      element.textContent = "$";
    }
  });
  const currencyAmountElements = document.querySelectorAll(".currency-amount");
  currencyAmountElements.forEach((element) => {
    if (country === "IN") {
      element.textContent = element.textContent;
    } else {
      // Convert to dollar, but double it
      element.textContent = Math.round(element.textContent / 40);
    }
  });
}

// Function to open a modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  } else {
    console.error(`Modal with ID '${modalId}' not found.`);
  }
}

// Function to close a modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error(`Modal with ID '${modalId}' not found.`);
  }
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  getCountryFromIP();

  // Load the IFrame Player API code asynchronously
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  const closeCountryModalBtn = document.getElementById("close-country-modal");

  // Check if the modal has been shown before
  if (!localStorage.getItem("countryModalShown")) {
    document.getElementById("youtube-video").src = videoUrl + "&mute=0";
    openModal("country-modal");
  } else {
    closeModal("country-modal");
    document.getElementById("youtube-video").src = videoUrl + "&mute=1";
    setupObserver();
  }

  closeCountryModalBtn.onclick = function () {
    closeModal("country-modal");
    localStorage.setItem("countryModalShown", "true");
    setupObserver();
  };

  const watchOverviewBtn = document.getElementById("watch-overview-button");
  watchOverviewBtn.onclick = function () {
    unmuteAndPlayVideo();
    scrollToVideo();
  };

  const pricingFaqBtn = document.getElementById("pricing-faq-button");
  const closePricingFaqModal = document.getElementById(
    "close-pricing-faq-modal"
  );

  pricingFaqBtn.onclick = function () {
    openModal("pricing-faq-modal");
  };
  closePricingFaqModal.onclick = function () {
    closeModal("pricing-faq-modal");
  };

  const bookFreeDemoBtnList =
    document.getElementsByClassName("demo-modal-opener");

  const closeDemoModal = document.getElementById("close-demo-modal");
  closeDemoModal.onclick = function () {
    closeModal("demo-modal");
  };

  for (let i = 0; i < bookFreeDemoBtnList.length; i++) {
    const bookFreeDemoButton = bookFreeDemoBtnList[i];
    bookFreeDemoButton.onclick = function () {
      openModal("demo-modal");
    };
  }
});
