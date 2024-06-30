<!-- <template>
    <el-container class="admin-panel">
      <header class="header">
        <h1>用户管理系统</h1>
      </header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-button type="danger" @click="kick" class="kick-button">踢出成员</el-button>
        </el-aside>
        <el-main class="main">
          <div class="avatar-group">
            <el-avatar 
              v-for="user in userList" 
              :key="user.idx"
              size="large"
              class="avatar"
              @click="selectUser(user)"
            >
              {{ user }}
            </el-avatar>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <style scoped>
  .admin-panel {
    display: flex;
    flex-direction: column;
    height: 100vh;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
  }
  
  .header {
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #eaeaea;
  }
  
  .el-container {
    display: flex;
    flex: 1;
  }
  
  .aside {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    border-right: 1px solid #eaeaea;
    padding: 20px;
  }
  
  .kick-button {
    width: 100%;
    height: 50px;
  }
  
  .main {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  
  .avatar-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .avatar {
    cursor: pointer;
    transition: transform 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    font-weight: bold;
    color: #fff;
    width: 60px;
    height: 60px;
    background-color: rgb(40, 146, 233);
  }
  
  .avatar:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  



<script>
import { socketManager,ws_username,setter } from '../assets/socket.js';
import { onMounted, ref } from 'vue';
import {useRouter} from "vue-router";
import { ElMessageBox } from 'element-plus';
import { ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup, ElScrollbar, ElRow, ElCol, ElButton } from 'element-plus'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'

let ws;
export default {
    setup() {
        const innerRef = ref(null);
        const router = useRouter();
        setter("ADMIN");
        console.log(ws_username);
        socketManager.connect();
        ws = ref(socketManager.getSocket()).value;
        
        console.log("------------------");
        console.log(ws);
        console.log("------------------");

        return {
            innerRef,ws
        };
    },
    name: "Admin",
    components: {
        ElAvatar,
        ElIcon,
        ElMenu,
        ElMenuItem,
        ElMenuItemGroup,
        ElScrollbar,
        IconMenu,
        Message,
        Setting,
        ElRow,
        ElCol,
        ElButton
    },
    data() {
        return {
            userList: [],
            target: null
        };
    },
    mounted() {
        const handlewsOpen = (e) => {
            console.log("websocket open 连接成功");
            let obj = {
                type:"update_user"
            };
            ws.send(JSON.stringify(obj));
        };

        const handlewsClose = (e) => {
            console.log("websocket close 关闭连接");
        };

        const handlewsError = (e) => {
            console.log("websocket error 连接错误", e);
        };

        const handlewsMessage = (e) => {
            let data = JSON.parse(e.data);
            console.log("websocket message 服务器消息", data);
            if(data.type == "update_user"){
                const content = data.content;
                if(content=="^") this.userList = [];
                else this.userList = data.content.split("^");
            }
        };
        ws.addEventListener("open", handlewsOpen, false);
        ws.addEventListener("close", handlewsClose, false);
        ws.addEventListener("error", handlewsError, false);
        ws.addEventListener("message", handlewsMessage, false);
        this.chatRoom = this.$refs.chatRoom;
        console.log("this.chatRoom", this.chatRoom);
    },
    methods: {
        changeCursor(){
            document.body.style.cursor = "pointer";
        },
        selectUser(e){
            const username = e;
            this.target = username;
            console.log(this.target);
        },
        kick(){
            const username = this.target;
            if(username==null){
                ElMessageBox.alert("未选择成员","错误");
                return;
            }
            console.log(username);
            let obj = {
                type:"exile",
                target:username
            };
            ws.send(JSON.stringify(obj));
            ElMessageBox.alert('已踢出该成员','成功');
        }
    }
};
</script> -->


<template>
  <el-container class="admin-panel">
    <header class="header">
      <h1>用户管理系统</h1>
    </header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="管理成员" name="members">
        <el-container>
          <el-aside width="200px" class="aside">
            <el-button type="danger" @click="kick" class="kick-button">踢出成员</el-button>
          </el-aside>
          <el-main class="main">
            <div class="avatar-group">
              <el-avatar 
                v-for="user in userList" 
                :key="user.idx"
                size="large"
                class="avatar"
                @click="selectUser(user)"
              >
                {{ user }}
              </el-avatar>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="管理群聊" name="chat">
        <el-container>
          <el-aside width="200px" class="aside">
            <el-button type="danger" @click="dismiss" class="kick-button">解散群聊</el-button>
          </el-aside>
          <el-main class="main">
            <div class="group-list">
              <el-card
                v-for="group in groupList"
                :key="group.idx"
                class="group-card"
                @click="selectGroup(group)"
              >
              群名：{{ group }}
              </el-card>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
}

.header {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
}

.el-container {
  display: flex;
  flex: 1;
}

.aside {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-right: 1px solid #eaeaea;
  padding: 20px;
}

.kick-button{
  width: 100%;
  height: 50px;
}

.main {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.avatar-group, .chat-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.avatar {
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  width: 60px;
  height: 60px;
  background-color: rgb(40, 146, 233);
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.group-card {
  cursor: pointer;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  transition: transform 0.3s ease;
  background-color: rgb(40, 146, 233);
}

.group-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

<script>
import { socketManager, ws_username, setter } from '../assets/socket.js';
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { ElMessageBox } from 'element-plus';
import {
  ElAvatar, ElButton, ElCard, ElContainer, ElAside, ElMain, ElTabs, ElTabPane
} from 'element-plus';

let ws;
export default {
  setup() {
    const innerRef = ref(null);
    const router = useRouter();
    setter("ADMIN");
    console.log(ws_username);
    socketManager.connect();
    ws = ref(socketManager.getSocket()).value;
    
    console.log("------------------");
    console.log(ws);
    console.log("------------------");

    return {
      innerRef, ws
    };
  },
  name: "Admin",
  components: {
    ElAvatar,
    ElButton,
    ElCard,
    ElContainer,
    ElAside,
    ElMain,
    ElTabs,
    ElTabPane
  },
  data() {
    return {
      activeTab: 'members',
      userList: [],
      groupList: [],
      targetUser: null,
      targetGroup: null
    };
  },
  mounted() {
    const handlewsOpen = (e) => {
      console.log("websocket open 连接成功");
      let obj;
      // 初始化用户列表
      obj = {
        type: "update_user"
      };
      ws.send(JSON.stringify(obj));
      // 初始化群组列表
      obj = {
        type: "update_group"
      };
      ws.send(JSON.stringify(obj));
    };

    const handlewsClose = (e) => {
      console.log("websocket close 关闭连接");
    };

    const handlewsError = (e) => {
      console.log("websocket error 连接错误", e);
    };

    const handlewsMessage = (e) => {
      let data = JSON.parse(e.data);
      console.log("websocket message 服务器消息", data);
      if (data.type == "update_user") {
        const content = data.content;
        if (content == "^") this.userList = [];
        else this.userList = data.content.split("^");
      }
      if (data.type === "update_group"){
        const content = data.content;
        if (content == "^") this.groupList = [];
        else this.groupList = data.content.split("^");
      }
    };

    ws.addEventListener("open", handlewsOpen, false);
    ws.addEventListener("close", handlewsClose, false);
    ws.addEventListener("error", handlewsError, false);
    ws.addEventListener("message", handlewsMessage, false);
  },
  methods: {
    selectUser(e) {
      const username = e;
      this.targetUser = username;
      console.log(this.targetUser);
    },
    selectGroup(e) {
      const group = e;
      this.targetGroup = group;
      console.log(this.targetGroup);
    },
    kick() {
      const username = this.targetUser;
      if (username == null) {
        ElMessageBox.alert("未选择成员", "错误");
        return;
      }
      console.log(username);
      let obj = {
        type: "exile",
        target: username
      };
      ws.send(JSON.stringify(obj));
      ElMessageBox.alert('已踢出该成员', '成功');
    },
    dismiss(){
      const group = this.targetGroup;
      if (group == null) {
        ElMessageBox.alert("未选择群组", "错误");
        return;
      }
      console.log(group);
      let obj = {
        type: "dismiss",
        group_id: group
      };
      ws.send(JSON.stringify(obj));
      ElMessageBox.alert('已解散该群组', '成功');
    }
  }
};
</script>
