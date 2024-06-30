// socket.js

import { ref , provide} from 'vue';

var ws_username = "cjy";
function setter(_ws_username){
  ws_username = _ws_username;
}
const base_url = 'ws://127.0.0.1:8080/websocket-server/';


class SocketManager {
  constructor() {
    this.socket = ref(null);
  }

  connect() {
    const url = base_url + ws_username;
    this.socket.value = new WebSocket(url);

    this.socket.value.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.value.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  getSocket() {
    return this.socket.value;
  }

  close() {
    this.socket.value.close();
  }
}



const socketManager = new SocketManager();

export { socketManager,setter,ws_username };

