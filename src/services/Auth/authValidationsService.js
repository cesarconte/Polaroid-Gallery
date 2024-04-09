// authValidations.js

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  export const isValidPassword = (password) => {
    // Longitud mínima de 8 caracteres
    const hasMinLength = password.length >= 8;

    // Al menos una letra mayúscula
    const hasUpperCase = /[A-Z]/.test(password);

    // Al menos una letra minúscula
    const hasLowerCase = /[a-z]/.test(password);

    // Al menos un número
    const hasNumber = /\d/.test(password);

    // Todas las condiciones deben cumplirse
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  };