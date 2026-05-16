// script.js - Dynamic Food Images (Final Working Version)
const API_BASE = 'https://foodish-api.herokuapp.com/api/';

// Fallback static images (your own)
const FALLBACK_IMAGES = {
    hero: 'background-images/3image.png',
    service1: 'background-images/pizza.png',
    service2: 'background-images/plate.png',
    service3: 'background-images/plate.png'
};

async function fetchRandomFoodImage() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const meal = data.meals[0];
        if (meal && meal.strMealThumb) {
            return `${meal.strMealThumb}?t=${new Date().getTime()}`;
        }
        throw new Error('No image found');
    } catch (error) {
        console.warn('MealDB API error:', error);
        return null;
    }
}

async function updateHeroBackground() {
    const hero = document.getElementById('home');
    if (!hero) return;
    const imgUrl = await fetchRandomFoodImage();
    if (imgUrl) {
        hero.style.backgroundImage = `url('${imgUrl}')`;
        console.log('Hero background updated');
    } else {
        hero.style.backgroundImage = `url('${FALLBACK_IMAGES.hero}')`;
        console.log('Using fallback hero image');
    }
}

async function updateServiceImages() {
    const ids = ['foodImg1', 'foodImg2', 'foodImg3'];
    for (let i = 0; i < ids.length; i++) {
        const imgElement = document.getElementById(ids[i]);
        if (imgElement) {
            const newImg = await fetchRandomFoodImage();
            if (newImg) {
                imgElement.src = newImg;
                imgElement.alt = 'Fresh food item';
            } else {
                const fallbackKey = `service${i+1}`;
                imgElement.src = FALLBACK_IMAGES[fallbackKey] || FALLBACK_IMAGES.service1;
            }
        }
    }
}

// Refresh button event (waits for DOM)
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refreshImagesBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateHeroBackground();
            updateServiceImages();
        });
    }
    // Initial load
    updateHeroBackground();
    updateServiceImages();
});