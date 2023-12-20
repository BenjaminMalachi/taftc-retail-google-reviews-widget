document.addEventListener('DOMContentLoaded', function() {
    fetchGoogleReviews();
});

function fetchGoogleReviews() {
    const apiURL = '/fetch-google-reviews?placeid=ChIJz4vLjywa2jER1k-mX55g_mk';

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        console.log("Data received:", data); // Add this line to log the data
        if (data && data.result && data.result.reviews) {
            const overallRating = data.result.rating;
            const totalRatings = data.result.user_ratings_total;
            displayOverallRating(overallRating, totalRatings);
            displayReviews(data.result.reviews);
            $('.reviews-container').slick({
                slidesToShow: 5,
                slidesToScroll: 1,
            });
        }
    })
    .catch(error => {
    console.error('Error fetching reviews:', error);
});

}

function displayReviews(reviewsData) {
    const reviewsContainer = document.getElementById('reviews-container');

    // Filter out reviews with less than 4 stars and then slice the array to get only the first 5 items
    const filteredReviews = reviewsData.filter(review => review.rating >= 4).slice(0, 5);

    filteredReviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review-items');
        reviewDiv.innerHTML = `
            <div class="reviewer-profile">
                <img src="${review.profile_photo_url}" alt="${review.author_name} profile picture">
            </div>
            <div class="review-content">
                <div class="reviewer-name">${review.author_name}</div>
                <div class="review-rating">${generateStars(review.rating)}</div>
                <p>${truncateReviewText(review.text, 80)}</p>
                <button class="read-more">Read more</button>
            </div>
        `;
        reviewsContainer.appendChild(reviewDiv);
    });
}

function displayOverallRating(rating, totalRatings) {
    const ratingContainer = document.getElementById('overall-rating-container');
    if (ratingContainer) {
        const starsHtml = generateStars(Math.round(rating));
        ratingContainer.innerHTML = `
            <div class="overall-rating-stars">${rating} ${starsHtml}</div>
            <div class="total-ratings">${totalRatings} reviews</div>
        `;
    }
}

function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const partialStarPercentage = (rating % 1) * 100; // Get the fractional part

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1) {
            starsHtml += `<i class="fas fa-star partial-star" style="clip-path: inset(0 ${100 - partialStarPercentage}% 0 0)"></i>`;
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
}

function truncateReviewText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
}

$('.reviews-container').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});
