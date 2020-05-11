
/* ========== PŘIJÍMÁNÍ ZPRÁV ========== */

const messagesElement = document.querySelector('#messages');

const renderMessage = (name, message, date) => `
    <div class="card mt-3 mb-3">
      <div class="card-body">
        <h5 class="card-title">
          ${name}
          <small class="text-muted">${date}</small>
        </h5>
        <p class="card-text">${message}</p>
      </div>
    </div>
  `;

const renderMessages = (messages) => {
  messagesElement.innerHTML = '';

  for (let i = 0; i < messages.length; i++) {
    messagesElement.innerHTML += renderMessage(messages[i].name, messages[i].message, messages[i].date);
  }
};

let lastUpdate = 0;
const updateMessages = () => {
  fetch('https://czechichat.herokuapp.com/api/list-messages')
    .then((response) => response.json())
    .then((data) => {
      if (lastUpdate !== data.lastUpdate) {
        lastUpdate = data.lastUpdate;
        renderMessages(data.messages);
      }
    });
};

setInterval(updateMessages, 2000); // Každé dvě sekundy zavolá updateMessages

/* ========== ODESÍLÁNÍ ZPRÁV ========== */

const nameInputElement = document.querySelector('#name-input');
const messageInputElement = document.querySelector('#message-input');
const submitButtonInputElement = document.querySelector('#submit-button');

const onSubmit = (event) => {
  event.preventDefault(); // Zamezí přesměrování na jinou stránku při odesílání formuláře

  submitButtonInputElement.setAttribute('disabled', true);

  fetch('https://czechichat.herokuapp.com/api/send-message', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name: nameInputElement.value,
      message: messageInputElement.value,
    }),
  }).then(() => {
    submitButtonInputElement.removeAttribute('disabled');
  });

  messageInputElement.value = '';
};

document.querySelector('#send-form').addEventListener('submit', onSubmit);
