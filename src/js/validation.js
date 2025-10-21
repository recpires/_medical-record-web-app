// This file contains functions for validating user input on various forms across the application.

function validateRequiredFields(fields) {
    let isValid = true;
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Este campo é obrigatório.';
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        } else if (input) {
            input.classList.remove('error');
            const errorMessages = input.parentNode.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
        }
    });
    return isValid;
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhoneNumber(phone) {
    const phonePattern = /^\d{10,15}$/; // Adjust the pattern as needed
    return phonePattern.test(phone);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = ['nome', 'dataNascimento', 'cpf', 'email', 'telefone']; // Example field IDs
    const isValid = validateRequiredFields(requiredFields);

    if (isValid) {
        const email = form.email.value;
        const phone = form.telefone.value;

        if (!validateEmail(email)) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return false;
        }

        if (!validatePhoneNumber(phone)) {
            alert('Por favor, insira um número de telefone válido.');
            return false;
        }
    }

    return isValid;
}