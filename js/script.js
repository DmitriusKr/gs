const PORT = 9999; 
const socket = new WebSocket(`ws://localhost:${PORT}`);

const generateButton = document.getElementById("generateButton");
const fileContent = document.getElementById("fileContent");
const lamp = document.getElementById("lamp");
const volume = document.getElementById("volume");
const vol = document.getElementById("vol");

volume.oninput = function (e) {
  val = e.target.value;
//  console.log (val);
  let data = JSON.stringify({
    event:'volume',
    value:val
  });
  socket.send(data);
  vol.innerHTML = val;
}

socket.onopen = function(e) {
  console.log("open"); 
  let data = JSON.stringify({
    event:"check"
  });
  socket.send(data);
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
  let volume = data.volume;
  
};
generateButton.addEventListener("click", () => {
  let data = JSON.stringify({
    event:"toggle"
  });
    socket.send(data);
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