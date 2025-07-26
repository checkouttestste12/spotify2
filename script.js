// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cancellation Wizard Functions
let currentStep = 1;

function nextStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to top of wizard
    document.querySelector('.cancellation-wizard').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to top of wizard
    document.querySelector('.cancellation-wizard').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function updateProgressBar() {
    const progressPercentage = (currentStep / 4) * 100;
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
}

// Handle reason selection in step 2
document.addEventListener('DOMContentLoaded', function() {
    const reasonInputs = document.querySelectorAll('input[name="cancellation-reason"]');
    const continueBtn = document.getElementById('continueStep2');
    
    reasonInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                continueBtn.disabled = false;
                
                // Track the selected reason
                trackEvent('cancellation_reason_selected', {
                    reason: this.value,
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
    
    // Handle terms agreement checkbox
    const agreeTerms = document.getElementById('agreeTerms');
    const confirmBtn = document.getElementById('confirmCancel');
    
    if (agreeTerms && confirmBtn) {
        agreeTerms.addEventListener('change', function() {
            confirmBtn.disabled = !this.checked;
        });
    }
});

function confirmCancellation() {
    // Show loading state
    const confirmBtn = document.getElementById('confirmCancel');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Processando...';
    confirmBtn.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Set cancellation date
        const now = new Date();
        const cancellationDate = now.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('cancellationDate').textContent = cancellationDate;
        
        // Track cancellation completion
        trackEvent('cancellation_completed', {
            fee_amount: 24.50,
            cancellation_date: cancellationDate,
            timestamp: new Date().toISOString()
        });
        
        // Move to confirmation step
        nextStep(4);
        
        // Reset button
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    }, 2000);
}

// FAQ Toggle functionality
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items and update ARIA
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const question = item.querySelector('.faq-question');
        question.setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
        element.setAttribute('aria-expanded', 'true');
    }
}

// Feedback form handling
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const reason = formData.get('reason');
    const comments = formData.get('comments');
    
    // Validate that a reason is selected
    if (!reason) {
        alert('Por favor, selecione um motivo para o cancelamento.');
        return;
    }
    
    // Simulate form submission (in a real app, this would send to a server)
    console.log('Feedback enviado:', {
        reason: reason,
        comments: comments,
        timestamp: new Date().toISOString()
    });
    
    // Track feedback submission
    trackEvent('feedback_submitted', {
        reason: reason,
        has_comments: !!comments,
        timestamp: new Date().toISOString()
    });
    
    // Show success modal
    showModal();
    
    // Reset form
    this.reset();
});

// Modal functions
function showModal() {
    document.getElementById('confirmModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('confirmModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(button => {
    if (button.getAttribute('href') && button.getAttribute('href').startsWith('http')) {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Redirecionando...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 2000);
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Add initial styles for animation
    const animatedElements = document.querySelectorAll('.info-card, .step, .alternative-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add ARIA labels where needed
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        
        const answer = question.nextElementSibling;
        answer.setAttribute('id', `faq-answer-${index}`);
    });
});

// Add hover effects for cards
document.querySelectorAll('.info-card, .alternative-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Progress indicator for multi-step process
function updateProgressIndicator(step) {
    const steps = document.querySelectorAll('.step-number');
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.style.background = '#1DB954';
            stepEl.innerHTML = '✓';
        } else if (index === step) {
            stepEl.style.background = '#1DB954';
            stepEl.style.animation = 'pulse 2s infinite';
        } else {
            stepEl.style.background = '#e0e0e0';
            stepEl.style.color = '#535353';
        }
    });
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Track user interactions for analytics (mock)
function trackEvent(eventName, eventData) {
    console.log('Analytics Event:', eventName, eventData);
    // In a real application, this would send data to an analytics service
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_class: this.className,
            timestamp: new Date().toISOString()
        });
    });
});

// Track FAQ interactions
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        trackEvent('faq_toggle', {
            question: this.querySelector('span').textContent.trim(),
            timestamp: new Date().toISOString()
        });
    });
});

// Add focus indicators for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll('button, a, input, textarea');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #1DB954';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Mobile menu toggle (if needed for smaller screens)
function createMobileMenu() {
    const nav = document.querySelector('.nav');
    const navLinks = nav.innerHTML;
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';
    mobileMenuBtn.style.background = 'none';
    mobileMenuBtn.style.border = 'none';
    mobileMenuBtn.style.color = 'white';
    mobileMenuBtn.style.fontSize = '1.5rem';
    mobileMenuBtn.style.cursor = 'pointer';
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = navLinks;
    mobileMenu.style.display = 'none';
    mobileMenu.style.position = 'absolute';
    mobileMenu.style.top = '100%';
    mobileMenu.style.left = '0';
    mobileMenu.style.right = '0';
    mobileMenu.style.background = '#191414';
    mobileMenu.style.padding = '1rem';
    mobileMenu.style.flexDirection = 'column';
    mobileMenu.style.gap = '1rem';
    
    // Add to header
    const headerContainer = document.querySelector('.header .container');
    headerContainer.style.position = 'relative';
    headerContainer.appendChild(mobileMenuBtn);
    headerContainer.appendChild(mobileMenu);
    
    // Toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = isOpen ? 'none' : 'flex';
        this.innerHTML = isOpen ? '☰' : '✕';
    });
    
    // Show/hide based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
            mobileMenuBtn.style.display = 'block';
        } else {
            nav.style.display = 'flex';
            mobileMenuBtn.style.display = 'none';
            mobileMenu.style.display = 'none';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);

// Fee calculation functions
function calculateCancellationFee() {
    const monthlyFee = 21.90;
    const daysRemaining = 19; // Days until next billing
    const daysInMonth = 30;
    
    const remainingValue = (monthlyFee / daysInMonth) * daysRemaining;
    const adminFee = 9.90;
    const totalFee = remainingValue + adminFee;
    
    return {
        remainingValue: remainingValue.toFixed(2),
        adminFee: adminFee.toFixed(2),
        totalFee: totalFee.toFixed(2)
    };
}

// Update fee display when step 3 is shown
function updateFeeDisplay() {
    const fees = calculateCancellationFee();
    
    // Update the fee breakdown in the HTML
    const feeItems = document.querySelectorAll('.fee-item .fee-value');
    if (feeItems.length >= 3) {
        feeItems[0].textContent = `R$ ${fees.remainingValue}`;
        feeItems[1].textContent = `R$ ${fees.adminFee}`;
        feeItems[2].textContent = `R$ ${fees.totalFee}`;
    }
}

// Call updateFeeDisplay when the page loads
document.addEventListener('DOMContentLoaded', updateFeeDisplay);

// Wizard step validation
function validateStep(stepNumber) {
    switch(stepNumber) {
        case 2:
            const reasonSelected = document.querySelector('input[name="cancellation-reason"]:checked');
            return !!reasonSelected;
        case 3:
            const termsAgreed = document.getElementById('agreeTerms').checked;
            return termsAgreed;
        default:
            return true;
    }
}

// Enhanced step navigation with validation
function nextStepWithValidation(step) {
    if (validateStep(currentStep)) {
        nextStep(step);
    } else {
        // Show validation message
        showValidationMessage(currentStep);
    }
}

function showValidationMessage(step) {
    let message = '';
    switch(step) {
        case 2:
            message = 'Por favor, selecione um motivo para o cancelamento.';
            break;
        case 3:
            message = 'Por favor, concorde com os termos de cancelamento.';
            break;
    }
    
    if (message) {
        alert(message);
    }
}

// Auto-save form data to localStorage
function saveFormData() {
    const formData = {
        reason: document.querySelector('input[name="cancellation-reason"]:checked')?.value,
        termsAgreed: document.getElementById('agreeTerms')?.checked,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cancellationFormData', JSON.stringify(formData));
}

// Load saved form data
function loadFormData() {
    const savedData = localStorage.getItem('cancellationFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restore reason selection
        if (data.reason) {
            const reasonInput = document.querySelector(`input[name="cancellation-reason"][value="${data.reason}"]`);
            if (reasonInput) {
                reasonInput.checked = true;
                document.getElementById('continueStep2').disabled = false;
            }
        }
        
        // Restore terms agreement
        if (data.termsAgreed) {
            const termsCheckbox = document.getElementById('agreeTerms');
            if (termsCheckbox) {
                termsCheckbox.checked = true;
                document.getElementById('confirmCancel').disabled = false;
            }
        }
    }
}

// Clear saved form data
function clearFormData() {
    localStorage.removeItem('cancellationFormData');
}

// Save form data on changes
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadFormData();
    
    // Save data on form changes
    document.addEventListener('change', function(e) {
        if (e.target.name === 'cancellation-reason' || e.target.id === 'agreeTerms') {
            saveFormData();
        }
    });
    
    // Clear data on successful completion
    const originalConfirmCancellation = confirmCancellation;
    confirmCancellation = function() {
        clearFormData();
        originalConfirmCancellation();
    };
});

// Add keyboard navigation for wizard
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' && currentStep < 4) {
        if (validateStep(currentStep)) {
            nextStep(currentStep + 1);
        }
    } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        prevStep(currentStep - 1);
    }
});

// Add tooltips for fee breakdown
function addTooltips() {
    const feeLabels = document.querySelectorAll('.fee-label');
    
    feeLabels.forEach(label => {
        label.style.cursor = 'help';
        label.addEventListener('mouseenter', function() {
            let tooltipText = '';
            
            if (this.textContent.includes('restante')) {
                tooltipText = 'Valor proporcional aos dias restantes até a próxima cobrança';
            } else if (this.textContent.includes('administrativa')) {
                tooltipText = 'Taxa fixa para processamento do cancelamento antecipado';
            }
            
            if (tooltipText) {
                showTooltip(this, tooltipText);
            }
        });
        
        label.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#191414';
    tooltip.style.color = 'white';
    tooltip.style.padding = '0.5rem';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '0.8rem';
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = '200px';
    tooltip.style.wordWrap = 'break-word';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', addTooltips);

