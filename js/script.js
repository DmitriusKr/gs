const PORT = 9999; 
const socket = new WebSocket(`ws://localhost:${PORT}`);

const generateButton = document.getElementById("generateButton");
const fileContent = document.getElementById("fileContent");
const lamp = document.getElementById("lamp");
const volume = document.getElementById("volume");
const vol = document.getElementById("vol");
const microphone = document.getElementById("microphone");
const microStat = document.getElementById("microStat");
const volumeButton = document.getElementById("volumeButton");
const mute = document.getElementById("mute");

volume.oninput = function (e) {
  val = e.target.value;
//  console.log (val);
  let data = JSON.stringify({
    event:'volume',
    value:val
  });
  socket.send(data); 
}

socket.onopen = function(e) {
  console.log("open"); 
  let data = JSON.stringify({
    event:"check"
  });
  socket.send(data);
};

socket.onmessage = function(event) {
 // console.log(event);
  data = JSON.parse(event.data); 

  if (data.status === '1') {
    lamp.innerHTML = ("<img src = './assets/on.png'/>");
    generateButton.innerHTML = "Выключить";
  }
  else if(data.status === '0') {
    lamp.innerHTML = ("<img src = './assets/off.png'/>");
    generateButton.innerHTML = "Включить";
  }
  if (data.time) {
    fileContent.innerHTML =' Статус включения: '+ data.status+ '<br>Время чтения файла на сервере '+ data.time + ' ms'+'<br>Размер файла: '+data.size +' bytes'+ '<br>coдeржимое файла\n' + data.content;
  }
  else if(data.status) {
    fileContent.innerHTML = 'Статус включения: '+ data.status;
  }
  if (data.volume > 0) {
    volume.value = data.volume;
    vol.innerHTML = data.volume;
    if (microStat.value === '0') {
      microphone.innerHTML = ("<img src = './assets/microphoneOn.png'/>");
    }
    microStat.value = 1;
  }
  else if (data.volume === '0') {
    console.log(data);
    volume.value = data.volume;
    vol.innerHTML = data.volume;
    microphone.innerHTML = ("<img src = './assets/microphoneOff.png'/>");
    microStat.value = 0;
  }
};
volumeButton.addEventListener("click", () => {
  if (mute.value === '0') {
    mute.value = volume.value;
    volumeButton.innerHTML = 'Unmute';
    let data = JSON.stringify({
      event:'volume',
      value:'0',
    });
    socket.send(data);
  }
  else {
    volume.value =  mute.value;
    volumeButton.innerHTML = 'Mute';
    let data = JSON.stringify({
      event:'volume',
      value:volume.value,
    });
    socket.send(data);
    mute.value = 0;
  }
});
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