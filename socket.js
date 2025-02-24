const socket = io("http://127.0.0.1:5000");

socket.on("message", (msg) => {
    console.log("Message from server:", msg);
});

function sendMessage() {
    let message = document.getElementById("message").value;
    socket.emit("message", message);
}
