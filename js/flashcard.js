class FlashcardPortfolio {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 4;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        // Next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextCard());
        }
        
        // Previous button
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevCard());
        }
        
        // Indicator dots
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const cardNum = parseInt(e.target.dataset.card);
                this.goToCard(cardNum);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextCard();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevCard();
            }
        });
        
        // Touch/swipe support
        this.initTouchEvents();
        
        // Auto-advance (optional)
        // this.startAutoAdvance();
    }
    
    nextCard() {
        if (this.isAnimating) return;
        
        if (this.currentCard < this.totalCards) {
            this.goToCard(this.currentCard + 1);
        } else {
            // Loop back to first card
            this.goToCard(1);
        }
    }
    
    prevCard() {
        if (this.isAnimating) return;
        
        if (this.currentCard > 1) {
            this.goToCard(this.currentCard - 1);
        } else {
            // Loop to last card
            this.goToCard(this.totalCards);
        }
    }
    
    goToCard(cardNum) {
        if (this.isAnimating || cardNum === this.currentCard) return;
        
        this.isAnimating = true;
        
        // Remove active class from current card
        const currentFlashcard = document.querySelector('.flashcard.active');
        if (currentFlashcard) {
            currentFlashcard.classList.remove('active');
            currentFlashcard.classList.add('prev');
        }
        
        // Add active class to new card
        const newFlashcard = document.querySelector(`.flashcard[data-card="${cardNum}"]`);
        if (newFlashcard) {
            newFlashcard.classList.remove('prev');
            newFlashcard.classList.add('active');
        }
        
        this.currentCard = cardNum;
        this.updateUI();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
            // Clean up prev classes
            document.querySelectorAll('.flashcard.prev').forEach(card => {
                if (!card.classList.contains('active')) {
                    card.classList.remove('prev');
                }
            });
        }, 600);
    }
    
    updateUI() {
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progressPercent = (this.currentCard / this.totalCards) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${this.currentCard} of ${this.totalCards}`;
        }
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        const activeIndicator = document.querySelector(`.indicator[data-card="${this.currentCard}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
        
        // Update button states
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && nextBtn) {
            // Enable all buttons for looping behavior
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            
            // Update button text for better UX
            if (this.currentCard === this.totalCards) {
                nextBtn.innerHTML = '<i class="fas fa-refresh"></i> Start Over';
            } else {
                nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
            }
            
            if (this.currentCard === 1) {
                prevBtn.innerHTML = '<i class="fas fa-refresh"></i> Go to End';
            } else {
                prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
            }
        }
    }
    
    initTouchEvents() {
        const flashcardWrapper = document.querySelector('.flashcard-wrapper');
        if (!flashcardWrapper) return;
        
        let startX = 0;
        let startY = 0;
        let threshold = 50; // Minimum distance for swipe
        
        flashcardWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        flashcardWrapper.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        // Swipe left - next card
                        this.nextCard();
                    } else {
                        // Swipe right - previous card
                        this.prevCard();
                    }
                }
            }
            
            // Reset
            startX = 0;
            startY = 0;
        });
    }
    
    startAutoAdvance(interval = 5000) {
        this.autoAdvanceInterval = setInterval(() => {
            this.nextCard();
        }, interval);
        
        // Pause auto-advance on hover
        const flashcardSection = document.querySelector('.flashcard-section');
        if (flashcardSection) {
            flashcardSection.addEventListener('mouseenter', () => {
                this.pauseAutoAdvance();
            });
        }
    }
    
    pauseAutoAdvance() {
        clearInterval(this.autoAdvanceInterval);
    }
}

// Initialize the flashcard portfolio when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardPortfolio();
});