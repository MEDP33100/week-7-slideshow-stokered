let images = [];
let currentIndex = 0;

async function fetchImages() {
  try {
    const response = await fetch('https://picsum.photos/v2/list?page=2&limit=10');
    images = await response.json();
    displayImage(currentIndex);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function displayImage(index) {
  const imgElement = document.getElementById('slide');
  imgElement.src = images[index].download_url;
}

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  displayImage(currentIndex);
});

document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  displayImage(currentIndex);
});

fetchImages();
