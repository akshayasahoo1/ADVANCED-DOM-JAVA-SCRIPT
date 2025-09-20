const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const historyDiv = document.getElementById('messageHistory');

let debounceTimer;
const debounce = (callback, delay) => {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => callback(...args), delay);
  };
};

function validateName() {
  const nameError = document.getElementById('nameError');
  if (nameInput.value.trim().length < 2) {
    nameError.textContent = 'Name must be at least 2 characters';
    return false;
  }
  nameError.textContent = '';
  return true;
}

function validateEmail() {
  const emailError = document.getElementById('emailError');
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailInput.value.trim())) {
    emailError.textContent = 'Enter a valid email';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validateMessage() {
  const messageError = document.getElementById('messageError');
  if (messageInput.value.trim().length < 10) {
    messageError.textContent = 'Message must be at least 10 characters';
    return false;
  }
  messageError.textContent = '';
  return true;
}

[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener('input', debounce(() => {
    if (input === nameInput) validateName();
    if (input === emailInput) validateEmail();
    if (input === messageInput) validateMessage();
  }, 300));
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  if (messages.length === 0) {
    historyDiv.textContent = 'No messages yet';
    return;
  }
  historyDiv.innerHTML = '';
  messages.forEach((msg, index) => {
    const div = document.createElement('div');
    div.className = 'message-item';
    div.innerHTML = \`From: \${msg.name} (\${msg.email})<br>
                     Message: \${msg.message}<br>
                     Sent: \${new Date(msg.timestamp).toLocaleString()}<br>
                     <button data-index="\${index}" class="delete-btn">Delete</button>\`;
    historyDiv.appendChild(div);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateName() || !validateEmail() || !validateMessage()) return;

  const newMessage = {
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value,
    timestamp: new Date().toISOString()
  };

  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));

  form.reset();
  loadMessages();
});

historyDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
  }
});

window.addEventListener('load', loadMessages);
