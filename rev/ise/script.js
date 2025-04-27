document.addEventListener('DOMContentLoaded', function() {
    const images = [
        { src: 'cave-1.png', caption: 'The Path Revealed', date: 'Aug 4, 2024' },
        { src: 'waves-1.png', caption: 'The Descent to Stillness', date: 'June 11, 2023' },
        { src: 'trees-1.png', caption: 'Shared Roots, Dancing Leaves' },
        { src: 'knots-1.jpeg', caption: 'Rewriting the Knots', date: 'August 18, 2024' },
        { src: 'bees-1.png', caption: 'Within the Hive', date: 'August 11, 2024' },
        { src: 'circles-1.png', caption: 'The Chronal Carousel' },
    ];

    const gallery = document.getElementById('gallery');
    
    // Update meta tags with absolute URLs for social sharing
    updateMetaTags(images[0].src, images[0].caption);

    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'flex justify-center items-center py-20';
    loadingIndicator.innerHTML = `
        <div class="text-center">
            <div class="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-600">Loading gallery...</p>
        </div>
    `;
    gallery.appendChild(loadingIndicator);

    // Load images and get their dimensions
    const imagePromises = images.map(image => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                resolve({
                    ...image,
                    width: this.width,
                    height: this.height
                });
            };
            img.onerror = reject;
            img.src = image.src;
        });
    });

    // Once all images are loaded, add them to the gallery
    Promise.all(imagePromises)
        .then(loadedImages => {
            // Remove loading indicator
            gallery.innerHTML = '';
            
            loadedImages.forEach(image => {
                const aspectRatio = image.width / image.height;
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container bg-white rounded-lg';
                imgContainer.dataset.src = image.src;
                imgContainer.dataset.caption = image.caption;
                if (image.date) {
                    imgContainer.dataset.date = image.date;
                }
                
                // Create image wrapper
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'image-wrapper relative';
                imgWrapper.style.paddingBottom = `${(1 / aspectRatio) * 100}%`;
                
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.caption;
                img.className = 'absolute top-0 left-0 w-full h-full object-cover';
                img.loading = 'lazy';
                
                imgWrapper.appendChild(img);
                imgContainer.appendChild(imgWrapper);
                
                // Create caption container below the image
                const captionContainer = document.createElement('div');
                captionContainer.className = 'caption-container';
                
                const captionText = document.createElement('h3');
                captionText.className = 'text-2xl font-serif mb-2 text-gray-800';
                captionText.textContent = image.caption;
                
                captionContainer.appendChild(captionText);
                
                // Add date if it exists
                if (image.date) {
                    const dateText = document.createElement('p');
                    dateText.className = 'text-base text-gray-600';
                    dateText.textContent = image.date;
                    captionContainer.appendChild(dateText);
                }
                
                imgContainer.appendChild(captionContainer);
                gallery.appendChild(imgContainer);
                
                // Add fade-in animation
                setTimeout(() => {
                    imgContainer.style.opacity = '1';
                }, 50);
            });
            
            // Make gallery items interactive
            addGalleryInteractivity();
        })
        .catch(error => {
            console.error('Error loading images:', error);
            gallery.innerHTML = '<p class="text-center text-red-500 py-10">Error loading images. Please refresh the page.</p>';
        });
    
    // Function to update meta tags with absolute URLs
    function updateMetaTags(imageSrc, imageCaption) {
        // Get absolute URL for the image
        const absoluteImageUrl = new URL(imageSrc, window.location.href).href;
        const pageUrl = window.location.href;
        
        // Update Open Graph meta tags
        document.querySelector('meta[property="og:image"]').setAttribute('content', absoluteImageUrl);
        document.querySelector('meta[property="og:url"]').setAttribute('content', pageUrl);
        
        // Update Twitter card meta tag
        document.querySelector('meta[name="twitter:image"]').setAttribute('content', absoluteImageUrl);
        
        // Optional: Update title and description with first image caption
        if (imageCaption) {
            const title = `${imageCaption} | Digital Paintings Gallery`;
            document.querySelector('meta[property="og:title"]').setAttribute('content', title);
            document.querySelector('meta[name="twitter:title"]').setAttribute('content', title);
        }
    }
        
    // Add gallery interactivity
    function addGalleryInteractivity() {
        const containers = document.querySelectorAll('.image-container');
        
        containers.forEach(container => {
            // Smooth appearance
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease';
            
            // Click to view full image
            container.addEventListener('click', function() {
                const imgSrc = this.dataset.src;
                const imgCaption = this.dataset.caption;
                const imgDate = this.dataset.date;
                
                // Create modal for fullscreen view
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50';
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'relative max-w-5xl mx-auto p-4';
                
                const fullImg = document.createElement('img');
                fullImg.src = imgSrc;
                fullImg.alt = imgCaption;
                fullImg.className = 'max-h-[80vh] max-w-full';
                
                // Create caption and date container for modal
                const modalCaptionContainer = document.createElement('div');
                modalCaptionContainer.className = 'text-center text-white mt-4 px-4';
                
                const modalCaption = document.createElement('h3');
                modalCaption.className = 'text-xl font-serif';
                modalCaption.textContent = imgCaption;
                modalCaptionContainer.appendChild(modalCaption);
                
                if (imgDate) {
                    const modalDate = document.createElement('p');
                    modalDate.className = 'text-base text-gray-300 mt-1';
                    modalDate.textContent = imgDate;
                    modalCaptionContainer.appendChild(modalDate);
                }
                
                modalContent.appendChild(fullImg);
                modal.appendChild(modalContent);
                modal.appendChild(modalCaptionContainer);
                
                document.body.appendChild(modal);
                
                // Modal close on click anywhere
                modal.addEventListener('click', function() {
                    modal.style.opacity = '0';
                    setTimeout(() => modal.remove(), 300);
                });
                
                // Show modal with animation
                setTimeout(() => modal.style.opacity = '1', 10);
            });
        });
    }
}); 