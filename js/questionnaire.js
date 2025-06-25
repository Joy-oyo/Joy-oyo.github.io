// Email Verification Questionnaire
class EmailQuestionnaire {
    constructor() {
        this.userEmail = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
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
                this.showMessage('Email verified successfully! You\'ll receive updates soon.', 'success');
                this.resetForm();
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
        } else {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
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