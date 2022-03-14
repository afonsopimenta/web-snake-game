function handleKeyDown(event) {
  const keyDown = event.key;
  socket.emit("command-received", keyDown);
}
