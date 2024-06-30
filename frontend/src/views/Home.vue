<template>
    <el-container class="layout-container-demo" style="height: 500px">
        <el-aside width="200px">
            <el-scrollbar style="display:flex;">
                <el-menu :default-openeds="['1', '2']">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <message />
                            </el-icon>联系人
                        </template>
                        <el-menu-item-group v-for="user in filteredUserList" :key="user.idx">
                            <el-menu-item :index="String(user)" @click="handleSelectUser" style="height: 40px;">
                                {{ user }}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon><icon-menu /></el-icon>群组
                        </template>
                        <el-menu-item-group v-for="item in groupList" :key="item.idx">
                            <el-menu-item :index="String(item)" @click="handleSelectGroup">
                            {{ item}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                </el-menu>
                <div style="display:flex;margin-top:50px">
                    <el-input type="text" style="width: 100%" autofocus @keyup.enter="addGroup"
                        placeholder="输入群号" v-model="groupToAdd">
                    </el-input>
                    <el-button @click="addGroup" type="primary" align="middle" size="default" sy>
                        加入群组
                    </el-button>
                </div>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header style="font-size: 12px; display:flex; flex-direction:row; justify-content:space-between">
                <div style="margin-right: 10px; margin-left: 10px; margin-top:20px;font-size: 20px;">
                        当前聊天:{{target}}
                </div>
                <div class="toolbar">
                    <div>
                        <el-button @click="cls" size="default">
                        清空输入框
                        </el-button>
                        <span style=" margin-right: 10px;margin-left: 10px;">{{ username }}</span>
                        <el-avatar size="default" fit="fit"> {{ username }} </el-avatar>
                    </div>
                </div>
            </el-header>

            <el-main style="margin-top: 1px;">
                <el-scrollbar class="chat-room" id="chat-room" ref="chatRoom" style="margin-top: 1px" always
                    >

                    <div v-for="item in msgList" :key="item.content" ref="innerRef"
                        style="margin-top: 10px;margin-bottom: 20px;">
                        <!-- 左侧消息气泡 -->
                        <div v-if="!item.local" style="margin-left: 10px;margin-bottom: 8px;">
                            <el-row class="row-bg" type="flex" align="middle">
                                <el-avatar size="default" fit="fit">{{ item.source }}</el-avatar>
                                <span style="margin-left: 10px">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm") }}</span>
                            </el-row>
                            <el-row>
                                <el-col :span="1000" :offset="1" class="msg">
                                    {{ item.content }}
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 右侧消息气泡 -->
                        <div v-else style="margin-right: 10px;margin-bottom: 8px;">
                            <el-row class="row-bg" type="flex" justify="end" align="middle">
                                <span style="margin-right: 10px">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm")
                                }}</span>

                                <el-avatar size="default" fit="fit"> Me </el-avatar>
                            </el-row>

                            <el-row justify="end">
                                <el-col :span="1000" class="msg2" style="margin-right: 20px;">
                                    {{ item.content }}
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                </el-scrollbar>

            </el-main>
            <el-row class="row-bg" type="flex" justify="space-around" align="middle">
                <el-col :span="20">
                    <el-input :disable="1==1" type="text" style="width: 100%" autofocus @keyup.enter="handleSendBtnClick"
                        placeholder="请输入消息按Enter发送" v-model="currentMsg"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button class="sendBtn" @click="handleSendBtnClick" type="primary" size="default">
                        发送
                    </el-button>
                </el-col>
            </el-row>
        </el-container>
    </el-container>
</template>
  
<script>
import { ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup, ElScrollbar, ElRow, ElCol, ElButton } from 'element-plus'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { socketManager,ws_username } from '../assets/socket.js';
import { onMounted, ref } from 'vue';
import {useRouter} from "vue-router";
import { ElMessageBox } from 'element-plus';

let ws;
export default {
    setup() {
        const innerRef = ref(null);        
        const router = useRouter();

        socketManager.connect();
        ws = ref(socketManager.getSocket()).value;
        
        console.log("------------------");
        console.log(ws);
        console.log("------------------");

        return {
            innerRef,ws
        };
    },
    name: "Home",
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
            max: 0,
            type: "invalid",
            target : null,
            currentMsg: "",
            username: ws_username,
            groupToAdd:null,
            contentHeight: 490,
            chatRoom: null,
            userList: [],
            groupList: [],
            msgList: [],
        };
    },
    //watch 中的函数, 给一个变量发送变化的回调函数, 如果变
    mounted() {
        const handlewsOpen = (e) => {
            console.log("websocket open 连接成功");
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

            // test
            //初始化用户列表和群组列表
            if(data.type==null){
                consolo.log("valid");
            }
            else if(data.type == "dismiss_group"){
                groupId = data.content;
                groupList = groupList.filter(
                    item => item !== "groupId"
                );
            }
            else if(data.type == "update_user"){
                this.userList = data.content.split("^");
            }
            else if (data.type == "side_txt") {
                console.log("消息来自",data.source,"内容为",data.content);
                if(data.source == ws_username) return;
                this.msgList.push(data);
            }
            else if (data.type == "group_txt"){
                console.log("群聊消息来自",data.source,"内容为", data.content);
                this.msgList.push(data);
            }
            this.$nextTick(() => {
                var scrollBar = document.querySelector('#chat-room');
            });
        };

        ws.addEventListener("open", handlewsOpen, false);
        ws.addEventListener("close", handlewsClose, false);
        ws.addEventListener("error", handlewsError, false);
        ws.addEventListener("message", handlewsMessage, false);
        this.chatRoom = this.$refs.chatRoom;
        console.log("this.chatRoom", this.chatRoom);
    },
    computed: {
        filteredUserList() {
            // 使用 computed 属性过滤数组
            return this.userList;
        },
    },
    watch: {
        msgList: {
            handler() {
                this.$nextTick(() => {
                    this.updateMax();
                    // console.log("this.innerRef", this.innerRef);
                    this.scrollToBottom();
                    // console.log("this.chatRoom", this.chatRoom);
                });
            },
            deep: true,
        },
    },
    methods: {
        updateMax() {
            if (this.innerRef) {
                const arraySize = Object.keys(this.innerRef).length;
                console.log("msgList Size:", arraySize);
                this.max = arraySize * 100 + 1000;
            }
        },
        scrollToBottom() {
            const scrollbar = this.$refs.chatRoom;
            scrollbar.setScrollTop(this.max);
        },
        handleSendBtnClick() {
            const currentMsg = this.currentMsg;
            if (!currentMsg.trim().length) {
                ElMessageBox.alert("消息为空，无法发送", "错误");
                return;
            }
            if(this.type=="invalid"){
                ElMessageBox.alert("未选择联系人，无法发送", "错误");
                return;
            }
            let obj;
            if(this.type=="side_txt"){
                obj = {
                    type: this.type,
                    source: ws_username,
                    target: this.target,
                    content: currentMsg,
                    local: true
                };
            }
            else if(this.type=="group_txt"){
                obj = {
                    type: this.type,
                    group_id: this.target,
                    content: currentMsg,
                    local: true
                };
            }
            else {
                console.log("非法发送信息尝试");
                return;
            }
            ws.send(JSON.stringify(obj));
            this.msgList.push(obj);
            this.currentMsg = ""; // 清空输入框
        },
        // 选择用户标签
        handleSelectUser(item) {
            this.type = "side_txt";
            this.target = item.index;
            console.log("当前target",this.target, "当前发送类型",this.type);
        },
        // 选择群组标签
        handleSelectGroup(item) {
            this.type = "group_txt";
            this.target = item.index;
            console.log("当前target",this.target, "当前发送类型",this.type);
        },
        // 加入群组
        addGroup(){
            const grp = this.groupToAdd;
            console.log(grp);
            if(grp==null) return;
            let obj = {
                type:"add_group",
                group_id: grp
            };
            ws.send(JSON.stringify(obj));
            this.groupList.push(grp);
            this.groupToAdd = null;
        },
        cls(){
            this.msgList = [];
        }
    },
};
</script>

  
<style scoped>
.layout-container-demo .el-header {
    position: relative;
    /* background-color: var(--el-color-primary-light-7); */
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    /* background: var(--el-color-primary-light-8); */
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 5px;
}

.chat-room .msg {
    background-color: #12B7F5;
    /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
    border-radius: 4px;
    padding: 10px;
    font-size: 18px;
    line-height: 16px;
    /* width: auto; */
    /* max-width: 330px; */
    margin-top: 20px;
    color: white;
}

.msg2 {
    background-color: #12B799;
    /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
    border-radius: 4px;
    padding: 10px;
    font-size: 18px;
    line-height: 16px;
    /* width: auto; */
    /* max-width: 330px; */
    margin-top: 20px;
    color: white;
}
</style>
  