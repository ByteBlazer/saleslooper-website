function toggleHamburger(x) {
  x.classList.toggle("change");
}

var player;
var videoObserver;

// This function is called by the YouTube IFrame API once it's ready
function onYouTubeIframeAPIReady() {
  var iframe = document.getElementById("youtube-video");
  player = new YT.Player(iframe);

  // Now that the API is ready, set up the IntersectionObserver
  setupObserver();
}

function playVideo() {
  if (player && player.playVideo) {
    player.playVideo();
  }
}

function setupObserver() {
  var options = {
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

  var videoSection = document.getElementById("video-section");
  if (videoSection) {
    videoObserver.observe(videoSection);
  } else {
    console.error("Element with ID 'video-section' not found.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Load the IFrame Player API code asynchronously
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
