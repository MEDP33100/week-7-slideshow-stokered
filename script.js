const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  function initStars(count = 150) {
    stars = [];
    for (let i = 0; i < count; i++) {
      const depth = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      // stars @ depth 1 are small+slow
      // stars @ depth 3 are bright+fast
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: depth === 1 ? 0.6 : depth === 2 ? 1.2 : 1.8, 
        //if (depth === 1) {
        //   r = 0.6;
        // } else if (depth === 2) {
        //   r = 1.2;
        // } else {
        //   r = 1.8;
        // }
        speed: depth * 0.5,
        alpha: depth === 1 ? 0.3 : depth === 2 ? 0.5 : 0.8
      });
    }
  }
  
  
  function drawStars() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    stars.forEach(star => {
      ctx.beginPath();
      ctx.globalAlpha = star.alpha; // depth-based fade
      ctx.fillStyle = star.alpha >= 0.8 ? "#ffffff" : "#00ffe7";
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0; // reset
  
      // move star down by its speed (closer = faster)
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
  
    requestAnimationFrame(drawStars);
  }
  
  
  initStars();
  drawStars();


const API_KEY = "k1JhdDIOPmjScj5Fcau5DlS5ZNLrfZQVEEjUkjYO";
const startDate = "2025-03-24";
const endDate = "2025-03-24";
const slidesContainer = document.getElementById("slides");

let currentSlide = 0;
let slides = [];

fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const neos = data.near_earth_objects[startDate];

    neos.forEach(neo => {
      const div = document.createElement("div");
      div.classList.add("slide");
      div.innerHTML = `
        <h2>${neo.name}</h2>
        <p>Hazardous? ${neo.is_potentially_hazardous_asteroid ? "🚨 Yes" : "✅ No"}</p>
        <p>Speed: ${parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h</p>
        <p>Miss distance: ${parseFloat(neo.close_approach_data[0].miss_distance.kilometers).toFixed(2)} km</p>
      `;
      slidesContainer.appendChild(div);
      slides.push(div);
    });

    showSlide(0);

    const loading = document.getElementById("loading");
    if (loading) {
      gsap.to(loading, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loading.style.display = "none";
        }
      });
    }
  });


function showSlide(index) {
  slides.forEach(slide => slide.style.display = "none");
  const current = slides[index];
  current.style.display = "block";

  gsap.fromTo(current, {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.8});
}

document.getElementById("next").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

document.getElementById("prev").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});
