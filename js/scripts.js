function toggleHamburger(x) {
  x.classList.toggle("change");
}
function playVideo() {
  var iframe = document.getElementById("youtube-video");
  var player = new YT.Player(iframe, {
    events: {
      onReady: function (event) {
        event.target.playVideo();
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  var observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideo();
        observer.unobserve(entry.target); // Stop observing once the video has started playing
      }
    });
  }, options);

  var videoSection = document.getElementById("video-section");
  observer.observe(videoSection);
});

// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
