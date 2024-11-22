document
  .getElementById("emailForm")
  .addEventListener("submit", async (event) => {
    console.log("sdfsdfds");
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const emailInputValue = emailInput.value;
    const messageElem = document.getElementById("submit-message");
    const submitButton = document.getElementById("submit-button");

    // Basic Email Regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInputValue)) {
      messageElem.textContent = "Please enter a valid email address!";
      messageElem.style.color = "red";
      return;
    }

    try {
      const response = await fetch("/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInputValue }),
      });

      const result = await response.json();
      emailInput.value = "";
      if (result.success) {
        messageElem.style.display = "block";
        messageElem.textContent = "Your email submitted successfully!";
        submitButton.disabled = true;
      }
    } catch (error) {
      console.log(error);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const openingButton = document.querySelector(".menu-button");
  const backButton = document.querySelector(".back-button");
  const sidebarNavItems = document.querySelectorAll(".sidebar-nav-item");

  sidebarNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });

  openingButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (
      !sidebar.contains(event.target) &&
      !openingButton.contains(event.target)
    ) {
      sidebar.classList.remove("open");
    }
  });

  backButton.addEventListener("click", (event) => {
    sidebar.classList.remove("open");
  });
});

document.querySelectorAll(".nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default jump to section

    // Get the target section ID from href (excluding the '#' character)
    const targetID = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetID);

    if (targetSection) {
      // Calculate the position to scroll to, 100px above the section
      const offset = window.innerWidth > 440 ? 150 : 0;
      const targetPosition =
        targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

      // Scroll to the calculated position
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const images = [
    'url("images/hero/01.jpg")',
    'url("images/hero/02.jpg")',
    'url("images/hero/03.jpg")',
    'url("images/hero/04.jpg")',
    'url("images/hero/05.jpg")',
    'url("images/hero/06.jpg")',
  ];
  let currentImageIndex = 0;
  let isZoomIn = true; // Track whether to zoom in or out

  function changeBackground() {
    // Set the background image
    hero.style.backgroundImage = images[currentImageIndex];

    // Apply the alternating zoom effect
    if (isZoomIn) {
      hero.classList.remove("zoom-out");
      hero.classList.add("zoom-in");
    } else {
      hero.classList.remove("zoom-in");
      hero.classList.add("zoom-out");
    }

    // Toggle the zoom direction for the next image
    isZoomIn = !isZoomIn;

    // Move to the next image index
    currentImageIndex = (currentImageIndex + 1) % images.length;
  }

  // Initial setup and interval to change background every 3 seconds
  changeBackground(); // Set the first image
  setInterval(changeBackground, 3000); // Change every 3 seconds
});
