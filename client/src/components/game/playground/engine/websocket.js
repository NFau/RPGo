
class WebsocketManager {
  constructor (newMessageHandler) {
    this.newMessageHandler = newMessageHandler;
    this.socket = null;
    console.log('WebsocketManager init');
  }

  connect () {
    this.socket = new WebSocket('ws://172.30.0.12:8080/ws');
    const promise = new Promise((resolve, reject) => {
      this.socket.onopen = function(event) {
        console.log('[WebSocket] Opened');
        resolve();
      };
    })

    this.socket.onmessage = (message) => {
      const events = message.data.split('\n');
      events.forEach((message) => {
        if (message) {
          this.newMessageHandler(JSON.parse(message));
        }
      });
    }

    this.socket.onclose = function() {
      console.log('[WebSocket] Closed');
    };

    this.socket.onerror = function(event) {
      console.log('[WebSocket] Message', event);
    };

    window.onbeforeunload = function() {
        console.log('[WebSocket] Closing socket', event);
        socket.onclose = function () {};
        socket.close()
    };

    return promise;
  }

  send(eventType, data) {
    console.log('Send', eventType, data);
    this.socket.send(JSON.stringify(
      {
        event: eventType,
        data
      }
    ));
  }
}

export default WebsocketManager;
