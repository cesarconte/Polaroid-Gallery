// userService.js

import { getAuth } from 'firebase/auth';

// Obtener una referencia al servicio de autenticación de Firebase
const auth = getAuth();

export function getUserId() {
  // Obtener el usuario actualmente autenticado
  const user = auth.currentUser;

  // Verificar si hay un usuario autenticado
  if (user) {
    // Obtener el ID del usuario
    const userId = user.uid;
    return userId;
  } else {
    // Si no hay usuario autenticado, devuelve null o algún valor predeterminado
    return null;
  }
}
