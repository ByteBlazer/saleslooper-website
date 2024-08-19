// Function to toggle the hamburger menu icon to an "X" and vice versa
const hamburger = document.querySelector(".hamburger");
const popupMenu = document.getElementById("popup-menu");
const pricingLink = document.getElementById("pricing-link");
const pricingSection = document.getElementById("pricing-section");
const pricingLinkPopup = document.getElementById("pricing-link-popup");
const clientsLink = document.getElementById("clients-link");
const clientsSection = document.getElementById("clients-section");
const clientsLinkPopup = document.getElementById("clients-link-popup");

let promoVideo; // Local video element
let videoObserver; // Intersection observer for video auto-play

document.addEventListener("click", function (event) {
  closePopupMenu();
});

function toggleHamburger() {
  hamburger.classList.toggle("change");
}

hamburger.addEventListener("click", function () {
  popupMenu.classList.toggle("show");
  toggleHamburger();
});

// Function to play the video
function playVideo() {
  if (promoVideo) {
    promoVideo.play();
  } else {
    console.error("Promo video element is not ready.");
  }
}

// Function to scroll to the video section
function scrollToVideo() {
  const videoHeadingElement = document.getElementById("video-heading");
  const header = document.querySelector("header");

  if (videoHeadingElement) {
    const videoHeadingTop =
      videoHeadingElement.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: videoHeadingTop - header.offsetHeight,
      behavior: "smooth",
    });
  } else {
    console.error("Element with ID 'video-heading' not found.");
  }
}

// Function to unmute and play the video
function unmuteAndPlayVideo() {
  if (promoVideo) {
    promoVideo.muted = false;
    promoVideo.currentTime = 0;
    promoVideo.play();
  } else {
    console.error("Promo video element is not ready.");
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
function closePopupMenu() {
  const isClickInsideMenu = popupMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (
    !isClickInsideMenu &&
    !isClickOnHamburger &&
    popupMenu.classList.contains("show")
  ) {
    popupMenu.classList.remove("show"); // Hide the popup menu after click
    hamburger.classList.toggle("change");
  }
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  getCountryFromIP();

  promoVideo = document.getElementById("promo-video");

  const closeCountryModalBtn = document.getElementById("close-country-modal");

  // Check if the modal has been shown before
  if (!localStorage.getItem("countryModalShown")) {
    promoVideo.muted = false;
    openModal("country-modal");
  } else {
    closeModal("country-modal");
    promoVideo.muted = true;
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

  const header = document.querySelector("header");

  pricingLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior

    const headerHeight = header.offsetHeight;
    const pricingSectionTop =
      pricingSection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: pricingSectionTop,
      behavior: "smooth",
    });
  });

  clientsLinkPopup.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    clientsLink.click(); // Simulate a click on the header link
  });
  clientsLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior

    const headerHeight = header.offsetHeight;
    const clientsSectionTop =
      clientsSection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: clientsSectionTop,
      behavior: "smooth",
    });
  });

  clientsLinkPopup.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    clientsLink.click(); // Simulate a click on the header link
  });
});
