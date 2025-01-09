// Select elements from the DOM
const readAloudButton = document.getElementById("read-aloud-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const stopButton = document.getElementById("stop-btn");
const enableSpeechCheckbox = document.getElementById("enable-speech");
const scrollableStory = document.getElementById("scrollable-story");

// Initialize the SpeechSynthesisUtterance object
let speech = null;
let scrollInterval = null;

const initializeSpeech = () => {
  const storyText = scrollableStory.innerText;
  speech = new SpeechSynthesisUtterance(storyText);
  speech.lang = "ar"; // Set language to Arabic
  speech.rate = 0.9; // Adjust speech speed

  // Synchronize scrolling with speech
  speech.onboundary = (event) => {
    const words = storyText.split(" ");
    const wordIndex = Math.floor(event.charIndex / (storyText.length / words.length));
    const scrollStep = (wordIndex / words.length) * scrollableStory.scrollHeight;

    // Clear previous interval if it exists
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }

    // Update scroll position gradually
    scrollInterval = setInterval(() => {
      if (scrollableStory.scrollTop < scrollStep) {
        scrollableStory.scrollTop += 2; // Adjust this increment for smoother scrolling
      } else {
        clearInterval(scrollInterval); // Stop scrolling once the target scroll position is reached
      }
    }, 700); // Adjust this delay for smoother scrolling speed
  };
};

// Read Aloud button click event
readAloudButton.addEventListener("click", () => {
  if (enableSpeechCheckbox.checked) {
    if (!speech) initializeSpeech();
    speechSynthesis.speak(speech);
  } else {
    alert("تم تعطيل الصوت من قبل الوالد.");
  }
});

// Pause button click event
pauseButton.addEventListener("click", () => {
  if (speechSynthesis.speaking) speechSynthesis.pause();
  clearInterval(scrollInterval); // Clear the scroll interval immediately when paused
});

// Resume button click event
resumeButton.addEventListener("click", () => {
  if (speechSynthesis.paused) speechSynthesis.resume();
});

// Stop button click event
stopButton.addEventListener("click", () => {
  speechSynthesis.cancel();
  clearInterval(scrollInterval); // Clear the scroll interval immediately when stopped
  scrollableStory.scrollTop = 0; // Reset scroll position
  speech = null; // Reset speech to reinitialize
});

///////////////////////////////////////////////Prompt/////////////////


document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.carousel-container');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-button.prev');
  const nextBtn = document.querySelector('.carousel-button.next');

  let currentIndex = 0;

  function getVisibleItems() {
      if (window.innerWidth <= 768) {
          return 1; // Mobile: show 1 item
      } else if (window.innerWidth <= 1024) {
          return 2; // Tablet: show 2 items
      }
      return 3; // Desktop: show 3 items
  }

  function updateCarousel() {
      const visibleItems = getVisibleItems();
      const totalItems = items.length;
      const maxIndex = totalItems - visibleItems;

      // Get the item width dynamically
      const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(container).gap);

      // Calculate the translation value (negative for RTL direction)
      const translateValue = currentIndex * itemWidth;
      container.style.transform = `translateX(${translateValue}px)`;

      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
      }
  });

  nextBtn.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const maxIndex = items.length - visibleItems;
      if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
      }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          // Reset position and update carousel
          currentIndex = 0;
          updateCarousel();
      }, 250);
  });

  // Initial update
  updateCarousel();
});


