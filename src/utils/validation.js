// Frontend validation utilities
// Это предотвращает отправку невалидных данных на сервер

// Email validation
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (!re.test(email)) {
        return 'Invalid email format';
    }
    return null;
};

// Password validation
export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    if (password.length > 100) {
        return 'Password must be less than 100 characters';
    }
    return null;
};

// Username validation
export const validateUsername = (username) => {
    if (!username) {
        return 'Username is required';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters';
    }
    if (username.length > 50) {
        return 'Username must be less than 50 characters';
    }
    return null;
};

// Game name validation
export const validateGameName = (name) => {
    if (!name) {
        return 'Game name is required';
    }
    if (name.length < 1) {
        return 'Game name must be at least 1 character';
    }
    if (name.length > 200) {
        return 'Game name must be less than 200 characters';
    }
    return null;
};

// Price validation
export const validatePrice = (price) => {
    if (!price && price !== 0) {
        return 'Price is required';
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
        return 'Price must be a number';
    }
    if (numPrice < 0) {
        return 'Price cannot be negative';
    }
    return null;
};

// Description validation
export const validateDescription = (description, maxLength = 2000) => {
    if (description && description.length > maxLength) {
        return `Description must be less than ${maxLength} characters`;
    }
    return null;
};

// Category validation
export const validateCategory = (categoryId) => {
    if (!categoryId) {
        return 'Category is required';
    }
    const numId = parseInt(categoryId);
    if (isNaN(numId) || numId < 1) {
        return 'Invalid category';
    }
    return null;
};

// Review rating validation
export const validateRating = (rating) => {
    if (!rating) {
        return 'Rating is required';
    }
    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return 'Rating must be between 1 and 5';
    }
    return null;
};

// Review comment validation
export const validateComment = (comment) => {
    if (!comment || !comment.trim()) {
        return 'Comment is required';
    }
    if (comment.length > 1000) {
        return 'Comment must be less than 1000 characters';
    }
    return null;
};

// Image file validation
export const validateImageFile = (file) => {
    if (!file) {
        return 'Image is required';
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed';
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return 'File size must be less than 10MB';
    }
    
    return null;
};

// Sanitize input (remove potentially dangerous characters)
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"]/g, '');
    
    return sanitized.trim();
};

// XSS Protection - escape HTML
export const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Validate form data object
export const validateForm = (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const value = formData[field];
        const validator = rules[field];
        
        if (typeof validator === 'function') {
            const error = validator(value);
            if (error) {
                errors[field] = error;
            }
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Example usage:
// const validation = validateForm(
//     { email: 'test@test.com', password: '123' },
//     { email: validateEmail, password: validatePassword }
// );