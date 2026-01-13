// Email Verification Questionnaire
class EmailQuestionnaire {
    constructor() {
        this.userEmail = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAnimations();
    }

    setupAnimations() {
        // Animate card on page load or when scrolling into view
        const card = document.querySelector('.questionnaire-card');
        if (card) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(card);
        }
    }
    
    bindEvents() {
        const form = document.getElementById('emailForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const verificationCode = document.getElementById('verificationCode').value;
        const verificationGroup = document.getElementById('verificationGroup');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitLoading = document.getElementById('submitLoading');
        
        // Hide any existing messages
        this.hideMessages();
        
        if (!verificationCode) {
            // First step: Send verification code
            this.sendVerificationCode(email, submitBtn, submitText, submitLoading, verificationGroup);
        } else {
            // Second step: Verify code
            this.verifyCode(email, verificationCode, submitBtn, submitText, submitLoading);
        }
    }
    
    async sendVerificationCode(email, submitBtn, submitText, submitLoading, verificationGroup) {
        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        
        try {
            const response = await fetch('/api/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                this.userEmail = email;
                verificationGroup.style.display = 'block';
                // Trigger slide-in animation
                setTimeout(() => {
                    verificationGroup.classList.add('slide-in');
                }, 10);
                submitText.textContent = 'Verify Code';
                submitText.style.display = 'inline';
                submitLoading.style.display = 'none';
                submitBtn.disabled = false;
                this.showMessage('Verification code sent! Please check your email.', 'success');
            } else {
                // Error
                this.showMessage(data.error || 'Failed to send verification code.', 'error');
                submitText.textContent = 'Send Verification Code';
                submitText.style.display = 'inline';
                submitLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Network error. Please try again.', 'error');
            submitText.textContent = 'Send Verification Code';
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }
    
    async verifyCode(email, code, submitBtn, submitText, submitLoading) {
        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        
        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                const card = document.querySelector('.questionnaire-card');
                if (card) {
                    card.classList.add('success-pulse');
                    setTimeout(() => {
                        card.classList.remove('success-pulse');
                    }, 1500);
                }
                this.showMessage('Email verified successfully! You\'ll receive updates soon.', 'success');
                setTimeout(() => {
                    this.resetForm();
                }, 3000);
            } else {
                // Error
                this.showMessage(data.error || 'Invalid verification code.', 'error');
                submitText.textContent = 'Verify Code';
                submitText.style.display = 'inline';
                submitLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Network error. Please try again.', 'error');
            submitText.textContent = 'Verify Code';
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');

        if (type === 'success') {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            // Add bounce-in animation
            successMessage.classList.remove('bounce-in');
            setTimeout(() => {
                successMessage.classList.add('bounce-in');
            }, 10);
        } else {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            // Add shake animation for errors
            errorMessage.classList.remove('shake');
            setTimeout(() => {
                errorMessage.classList.add('shake');
            }, 10);
        }
    }
    
    hideMessages() {
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }
    
    resetForm() {
        const form = document.getElementById('emailForm');
        const verificationGroup = document.getElementById('verificationGroup');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitLoading = document.getElementById('submitLoading');

        form.reset();
        verificationGroup.classList.remove('slide-in');
        verificationGroup.style.display = 'none';
        submitText.textContent = 'Send Verification Code';
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitBtn.disabled = false;

        this.userEmail = null;
    }
}

// Initialize the questionnaire when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailQuestionnaire();
}); 