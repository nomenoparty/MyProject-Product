import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

//FileUploadWithPreview

const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-image", {
  multiple: true,
  maxFileCount: 6
});

//FileUploadWithPreview

//CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.elements.content.value;
    const images = upload.cachedFileArray || [];

    if (content || images.length > 0) {
      console.log(images);
      socket.emit("CLIENT_SEND_MESSAGE", content);
      event.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

//CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE

socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my_id]").getAttribute("my_id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".inner-list-typing");

  const div = document.createElement("div");

  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  // body.appendChild(div);
  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});

//SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom

const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Scroll Chat To Bottom

//Show Typing

var timeOut;

const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};

//Show Typing

//Show Popup emoji

const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

//Show Popup emoji

// Insert Icon To Input

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    const end = inputChat.value.length;
    inputChat.focus();
    inputChat.setSelectionRange(end, end);

    showTyping();
  });

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}

// Insert Icon To Input

//SERVER_RETURN_TYPING

const listTyping = document.querySelector(
  ".chat .inner-body .inner-list-typing"
);
if (listTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = listTyping.querySelector(
        `[user-id='${data.userId}']`
      );

      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");

        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        listTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = listTyping.querySelector(
        `[user-id='${data.userId}']`
      );
      if (boxTypingRemove) {
        listTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

//SERVER_RETURN_TYPING
