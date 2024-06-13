// Inject CSS to add a banner and style revealed password fields
const style = document.createElement('style');
style.textContent = `
  #password-revealer-banner-container {
    position: fixed;
    top: -100px;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 9999;
    transition: top 0.3s ease-in-out;
  }

  #password-revealer-banner {
    background-color: yellow;
    color: black;
    text-align: center;
    font-size: 16px;
    font-family: sans-serif;
    padding: 10px 0;
    margin: 10px auto;
    border-radius: 50vh;
    width: 90vw;
    max-width: 600px;
  }

  input[data-original-type="password"] {
    background-color: yellow !important;
    -webkit-box-shadow: 0 0 0 1000px yellow inset !important;
  }
`;
document.head.append(style);

// Create banner container element
const bannerContainer = document.createElement('div');
bannerContainer.id = 'password-revealer-banner-container';

// Create banner element
const banner = document.createElement('div');
banner.id = 'password-revealer-banner';
banner.innerHTML = chrome.i18n.getMessage('banner_message');

// Append banner to container
bannerContainer.appendChild(banner);

// Prepend container to body
document.body.prepend(bannerContainer);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePasswordReveal') {
    togglePasswordReveal();
  }
});

function togglePasswordReveal() {
  const bannerContainer = document.getElementById('password-revealer-banner-container');
  if (!window.passwordRevealerActive) {
    revealPasswords();
  } else {
    resetPasswordFields();
  }
}

function revealPasswords() {
  window.passwordRevealerActive = true;
  bannerContainer.style.top = '0';

  const passwordFields = document.querySelectorAll('input[type="password"]');
  passwordFields.forEach(field => {
    field.dataset.originalType = 'password';
    field.type = 'text';
    field.classList.add('password-revealer-active');
  });

  document.addEventListener('keydown', handleKeydown);
}

function resetPasswordFields() {
  window.passwordRevealerActive = false;
  bannerContainer.style.top = '-100px';

  const textFields = document.querySelectorAll('input[type="text"][data-original-type="password"]');
  textFields.forEach(field => {
    if (field.dataset.originalType === 'password') {
      field.type = 'password';
      field.classList.remove('password-revealer-active');
      delete field.dataset.originalType;
    }
  });

  document.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    togglePasswordReveal();
  }
}
