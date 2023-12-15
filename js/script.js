const PORT = 9999; 
const socket = new WebSocket(`ws://localhost:${PORT}`);

const generateButton = document.getElementById("generateButton");
const fileContent = document.getElementById("fileContent");
const lamp = document.getElementById("lamp");

socket.onopen = function(e) {
  console.log("open"); 
  socket.send("check");
};

socket.onmessage = function(event) {
  console.log(event);
  data = JSON.parse(event.data);
  var status = data.status;
  if (status === '1') {
    lamp.innerHTML = ("<img src = './assets/on.png'/>");
    generateButton.innerHTML = "Выключить";
  }
  else {
    lamp.innerHTML = ("<img src = './assets/off.png'/>");
    generateButton.innerHTML = "Включить";
  }
  if (data.time) {
    fileContent.innerHTML =' Статус включения: '+ data.status+ '<br>Время чтения файла на сервере '+ data.time + ' ms'+'<br>Размер файла: '+data.size +' bytes'+ '<br>coдeржимое файла\n' + data.content;
  }
  else {
    fileContent.innerHTML = 'Статус включения: '+ data.status;
  }
};
generateButton.addEventListener("click", () => {
  socket.send("toggle");
});   
socket.addEventListener("close", (event) => {
    if (event.wasClean) {
      fileContent.textContent = "Соединение закрыто чисто";
    } else {
      fileContent.textContent = "Обрыв соединения";
    }
    fileContent.textContent +=
      "\n Код: " + event.code + " причина: " + event.reason;
  });