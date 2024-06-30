/* eslint-disable */
<template>
  <div class="about">
    <h3 style="color: #576c99">
      欢迎来到在线聊天系统!请输入用户名
    </h3>
    <van-row type="flex" justify="center">
      <van-col span="6"></van-col>
      <van-col span="6">
        <input type="text" placeholder="请输入用户名" autofocus v-model="username" />
        <van-button @click="handleEnterBtnClick" color="#576c99" size="normal"
          style="margin-top: 30px">进入聊天室</van-button></van-col>
      <van-col span="6"></van-col>
    </van-row>
  </div>
</template>

<script>
import { inject, ref } from 'vue';
import { setter,ws_username } from '../assets/socket.js';
import { onMounted  } from 'vue';
import { useRouter } from 'vue-router';

import router from "@/router/index.js";

export default {

  name: "Login",
  data() {
    return {
    };
  },
  methods: {
    handleEnterBtnClick() {
      const username = this.username.trim();

      if(username=="ADMIN"){
        router.push("/admin");
      }
      else{
        setter(username);
        router.push("/home");
      }
    }
  },
};
</script>

<style scoped lang="css">
.about {
  align-items: center;
  text-align: center;
  margin: 100px 30px;
}

.about input {
  width: 300px;
  height: 45px;
  padding: 6px 8px;
  border: 2px solid;
  border-color: #576c99;
  caret-color: #576c99;
  caret-shape: underscore;
}
</style>
