<template>
      <p class="notice">
      usuario =  clicker1.demo<br>
      email = clicker1.demo.ikcount@iklab.cl<br>
      contrasena = TEST.2022#<br>
    </p>
  <form @submit.prevent="submitForm">
    <div>
      <label for="name">Nombre:</label>
      <input type="text" id="name" v-model="formData.name" required>
    </div>
    <div>
      <label for="password">Contraseña:</label>
      <input type="password" id="passwd" v-model="formData.passwd" required>
    </div>
     <div>
      <button type="submit" @click="login(formData.name, formData.passwd)">Ingresar</button>
    </div>
  </form>

  <div v-if="flagLogged">
    <hr>
   <form @submit.prevent="submitForm">
    <div>
      <label for="name">Contador:</label>
      <input type="number" id="counter" v-model="formCounter.counter" required>
    </div>
     <div>
      <button type="submit" @click="manualCount(formCounter.counter)">Contador</button>
    </div>
  </form>
  <div> {{counterResponse.mssg}} </div>
  </div>
</template>

<!--template>
  <div>
    <button @click="login()">Login</button>
    <button @click="manualCount()">contar</button>

    <div></div>
   </div>
</template-->

<script>
import axios from 'axios';
import io from 'socket.io-client';


  var base_API = "https://ikcount.com/iklab"
  var base_SIO = "https://ikcount.com";
  
  //var usuario =  "clicker1.demo";
  //var email = "clicker1.demo.ikcount@iklab.cl";
  //var contrasena ="TEST.2022#";
  //var clientId ="DEMO001";
  var locationId = "DEMO001A1L1";
  var deviceId= "DEMO001A1L1Z1MC1";



export default {
  data() {
    return {
      response: {},
      counterResponse: {},
       formData: {
        name: '',
        passwd: ''
      },
       formCounter: {
        counter: '',
      },
      flagLogged : false,
      socket: null
    };
  },

  methods: {
    async login(usuario, contrasena) {
      const payload = {
        auth: btoa(usuario+":"+contrasena+":IKLAB005"),
        privilegesDetail: true,
      };
      const response = await axios.post(base_API+"/api/login", payload);
      var rawResponse = JSON.parse(JSON.stringify( response.data ))
      //filtrmos la respuesta;
      if ((response.data) && ( rawResponse.cod == 200))
        this.flagLogged = true;

      console.log(rawResponse);
      this.response.cod = rawResponse.cod;
      this.response.mssg = rawResponse.msg;
      this.response.username = rawResponse.username;
      this.response.email = rawResponse.email;
      this.response.type_user = rawResponse.type_user;
      this.response.client_id = rawResponse.client_id;
      this.response.access_token = rawResponse.access_token;
      this.response.privileges = rawResponse.privileges;
      //this.posts.push(response.data);
      this.created();
      

    },

    async manualCount(counter) {
      var type = "manual-add"

      if (isNaN(counter)) {
          this.counterResponse = "Counter no es un número";
        } else {
      if (counter < 0)
        type = "manual-sub"
        
        const payload = {
          type: type,//"{manual-add or manual-sub}",
          quantity : counter,
          client: this.response.client_id,
          location: locationId,
          macaddress: deviceId,
          username: this.response.username,
          email: this.response.email
          };

        const response = await axios.post(base_SIO+"/iklab/ikcount/api/livecommand?atoken="+this.response.access_token, payload);
        this.counterResponse = response.data;
        this.beforeDestroy();

      }

     
    },

  created() {
    this.socket = io(base_SIO+"/live?atoken="+this.response.access_token);
    this.socket.on('connect', () => {
      console.log('Conectado al servidor SocketIO');
    });
    this.socket.on('manualCount', (counter) => {
      console.log("socket counter:" + counter); 
    });

  },
  beforeDestroy() {
    this.socket.disconnect();
    }

  },
};
</script>

<style lang="css">
@import url('https://unpkg.com/simpledotcss/simple.css');
</style>