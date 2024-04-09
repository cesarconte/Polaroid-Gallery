// alertService.js

const showErrorAlert = (message) => {
  alert('Error: ' + message)
}

const showSuccessAlert = (message) => {
  alert('Success: ' + message)
}

const showWarningAlert = (message) => {
  alert('Warning: ' + message)
}

const showInfoAlert = (message) => {
  alert('Info: ' + message)
}

const showAlert = (message, type = 'info') => {
  switch (type) {
    case 'error':
      showErrorAlert(message)
      break
    case 'success':
      showSuccessAlert(message)
      break
    case 'warning':
      showWarningAlert(message)
      break
    default:
      showInfoAlert(message)
  }
}

export { showAlert, showErrorAlert, showSuccessAlert, showWarningAlert, showInfoAlert }
