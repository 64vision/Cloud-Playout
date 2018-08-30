<template>
  <v-container fluid style="margin: 0; padding: 0;">
    <v-slide-y-transition mode="out-in">
         <main role="main">
      <div class="container-fluid">
         <div class="row">
          <div class="col-md-3 preview-block">
             <div class="header-block">
               Channel
                <select id="ChannelDropDown" class="form-control" @change='initPlaylists'>
                   <option value="0">Select Channel</option>
                    <option v-for="channel in Channels" :value="channel.Id" :key="channel.Id">{{ channel.Name }}</option>
                </select>
             </div>
             <div id="BroadcastVideo"></div>
          </div>
          <div class="col-md-5 preview-block">
            <div class="header-block">
              Playlist
                <select id="PlaylistDropDown" class="form-control" @change='getPlaylistData'>
                     <option value="0">Select Playlist</option>
                    <option v-for="playlist in Playlists" :value="playlist.Id" :key="playlist.Id">{{ playlist.Name }}</option>
                </select>
            </div>
            <div class="listinfo">
                <div class="row">
                 <div class="col-md-4">
                  <br/>
                  Start Datetime  

                  <span v-if="PlaylistNum != 0"><datetime type="datetime"  placeholder="....." v-model="SinglePlaylist.Starttime"  format="yyyy-MM-dd HH:mm:ss"></datetime></span>
                   <strong>{{ SinglePlaylist.Starttime | moment("YYYY-MM-DD HH:mm:ss") }}</strong>
                   
                  
                  </div>
                 <div class="col-md-4">
                   <br/>
                  Duration
                  <h3>{{ PlaylistDuration }}</h3>
                </div>
                   <div class="col-md-4">
                     <br/>
                  Status
                  <h3>{{SinglePlaylist.Status}}</h3>
                </div>
                </div>
            </div>
             <div class="listaction">
       <v-dialog
        v-model="dialog1"
        width="350"
      >
        <v-btn
          slot="activator"
          color="dark lighten-2"
          dark
        >
          <i class="fas fa-plus" style="margin-right: 7px;"></i> Add Playlist
        </v-btn>
  
        <v-card>

  
          <v-card-text>
              <div class="_card">
                    <p>Add Playlist</p>
                   <div v-if="ChannelNum != 0">

                       <p>
                          <input type="text" class="form-control" v-model="NewPlaylist.Name" placeholder="Playlist Name">
                        </p>
                       
                        <button type="button" class="btn btn-success" @click="AddPlaylist">Insert</button>
                        <button type="button" class="btn btn-dark"  @click="dialog1 = false">Close</button>
                      
                        <br /><br />
                    </div>
                    <div v-else>
                         No Playlist Selected
                      </div>
                  </div>
          </v-card-text>

        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog3"
        width="350"
      >
        <v-btn
          slot="activator"
          color="dark lighten-2"
          dark
        >
          <i class="fas fa-file-import" style="margin-right: 7px;"></i> Import
        </v-btn>
  
        <v-card>

  
          <v-card-text>
              <div class="_card">
                    <p>Import Playlist</p>
                   <div v-if="PlaylistNum != 0">

                      
                    </div>
                    <div v-else>
                         No Playlist Selected
                      </div>
                  </div>
          </v-card-text>

        </v-card>
      </v-dialog>

       

 <v-dialog
        v-model="dialog2"
        width="350"
        
      >
        <v-btn
          slot="activator"
          color="dark lighten-2"
          dark
        >
          <i class="fas fa-video" style="margin-right: 7px;"></i> Add Live
        </v-btn>
  
        <v-card>
         
          <v-card-text>
                  <div class="_card">
                    <p>Insert Live source</p>
                   <div v-if="PlaylistNum != 0">

                       <p>
                         Play Duration (Format. hh:mm:ss)
                          <input type="text" class="form-control" v-model="LiveDuration" placeholder="Play Duration (Format. hh:mm:ss)">
                        </p>
                       
                        <button type="button" class="btn btn-success" @click="SavePlaylistItem('live')">Insert</button>
                        <button type="button" class="btn btn-dark"  @click="dialog2 = false">Close</button>
                      
                        <br /><br />
                    </div>
                    <div v-else>
                         No Playlist selected
                      </div>
                  </div>
          </v-card-text>
  
        </v-card>
      </v-dialog>

                  <v-btn
          slot="activator"
          color="success lighten-2"
          dark 
          @click="SavePlaylist" >
          <i class="fas fa-save" style="margin-right: 7px;"></i> Save
        </v-btn>
             
            </div>
           
          </div>
          <div class="col-md-4 preview-block">
             <div class="header-block">Preview</div>
             <div style="float: right; width: 28%;">
               In: {{ ConvertTime(Preview_in)}}<br /> 
                 <input type="text" v-model="Preview_in" @click="SeekType = 'in'" class="form-control inprev">
               Out: {{ ConvertTime(Preview_out)}} <br /> 
                 <input type="text" v-model="Preview_out" @change="calculatePlayDuration" @click="SeekType = 'out'" class="form-control inprev">
                  Play Duration: {{ ConvertTime(Play_duration)}} <br /> 
                 <input type="text" v-model="Play_duration" class="form-control inprev">
                 <button type="button" class="btn btn-info btn-sm btn-block" @click="SavePlaylistItem('file')">Save Item</button>
             </div>
              <div id="PreviewVideo" style="width: 250px;"></div>
              {{Preview_filename}}
            
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <div class="header-block">
                Media Files
                 <input type="text"  id="search" placeholder="Search File">
            </div>
            <div class="mediafiles">
              
                <ul class="list-group list-group-flush">
                    <li draggable="true" class="list-group-item" v-for="media in Medias" :key="media.id">
                     <drag class="drag" :transfer-data="{ media }"> <i class="fas fa-film"></i> {{media}}</drag>
                    </li>
                     
                </ul>
            </div>
            <a href="server:port" target="_blank" class="btn btn-dark"><i class="fas fa-cloud-upload-alt"></i> File Upload</a>
          </div>
          <div class="col-md-9">
            <drop class="drop" @drop="handleDrop">
              <div class="_tableWrap">
              <table class="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" width="280px">Name</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">In</th>
                    <th scope="col">Out</th>
                    <th scope="col">Play Duration</th>
                    <th scope="col">Status</th>
                    <th scope="col" width="30px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in PlaylistsItems" :key="item.Id">
                    <th scope="row">{{index+1}}</th>
                    <td>{{item.File_url}}</td>
                    <td>{{CalculateStartTime(index)}}</td>
                    <td>{{ ConvertTime(item.In) }}</td>
                    <td>{{ ConvertTime(item.Out) }}</td>
                    <td>{{ ConvertTime(item.Duration) }}</td>
                    <td>{{item.Status}}</td>
                    <td>  <i class="fas fa-trash-alt" @click="RemovePlaylistItem(item.Id)"></i></td>
                  </tr>
                </tbody>
              </table>
              </div>
            </drop>


    
          </div>
        </div>
      </div> <!-- /container -->

    </main>


    </v-slide-y-transition>
  </v-container>
</template>

<script>
import Vue from 'vue'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VueDragDrop from 'vue-drag-drop';
import router from '@/router'
import axios from 'axios'
import SampleVideo from '@/assets/station.mp4'
import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://server:port');
Vue.use(Datetime)
Vue.use(VueDragDrop);
Vue.use(VueMoment, {
    moment,
})

var _SetUp = {
  "file": SampleVideo,
  "controls": true,
  "repeat":true,
  "aspectratio": "16:9"
}
var _SetUpPre = {
  "file": SampleVideo,
  "controls": true,
  "width": '70%',
}

export default {
  name: 'Playout',
  data() {
      return {
        ServerApi: "http://server:port",
        MediaApi: "http://server:port",
        dialog1: false,
        dialog2: false,
        dialog3: false,
        dialog4: false,
        UserObj: '',
        Channels: '',
        ChannelNum: 0,
        SeekType: 'in',
        Playlists: '',
        SinglePlaylist: '',
        PlaylistNum: 0,
        date: '2018-05-12T00:00:00.000Z',
        datetime: '2018-05-12T17:19:06.151Z',
        datetime12: '2018-05-12T17:19:06.151Z',
        Starttime: '',
        draggable: 'Drag Me',
        Medias: '',
        Preview_filename: '',
        Preview_in: '',
        Preview_out: '',
        Preview_duration: '',
        Play_duration: '',
        Total_duration: 0,
        NewPlaylist: {},
        SelectedChannel: '',
        PlaylistsItems: '',
        PlaylistDuration: '00:00:00',
        LiveDuration:'00:00:00'
      }
  },
  created: function() {
    if(!sessionStorage.LoggedUser) {
        router.push('/')
    }
    this.UserObj  =JSON.parse(sessionStorage.LoggedUser);
      console.log(this.UserObj.userid);
    if(this.UserObj.userid == 0) {
      router.push('/')
    }
    this.getChannels()
    this.getMedias()
    setTimeout(function() {
        jwplayer("BroadcastVideo").setup(_SetUp);
        jwplayer("PreviewVideo").setup(_SetUpPre);
    }, 1200)
  },
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
    customEmit: function(val){
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  methods: {
    ConvertTime: function(_time) {
        var humanTime = moment("2015-01-01").startOf('day').seconds(_time).format('HH:mm:ss')
        return humanTime
      },
    CalculateStartTime: function(index) {
      let start_time = 0;
      
        for(var i = 0; i<index;i++) {
            start_time = Math.floor(parseFloat(start_time)) +  Math.floor(parseFloat(this.PlaylistsItems[i].Duration))
        }
       return moment("2015-01-01").startOf('day').seconds(start_time).format('HH:mm:ss')
      },
    CalculatePlaylistDuration: function() {
      let start_time = 0;
      
        for(var i = 0; i<this.PlaylistsItems.length;i++) {
            start_time = Math.floor(parseFloat(start_time)) +  Math.floor(parseFloat(this.PlaylistsItems[i].Duration))
          //console.log(start_time)
       }
       this.PlaylistDuration = moment("2015-01-01").startOf('day').seconds(start_time).format('HH:mm:ss')
       // alert(this.PlaylistDuration)
      },
    RemovePlaylistItem: function(id) {

        var r = confirm("Remove This Item?");
        if (r == false) {
          return true
        } 
            axios.post(this.ServerApi + "/api/v1/playlist/delete_item",JSON.stringify({
                Playlist: id
            }))
          .then((response)  =>  {
             alert(response.data.Remarks)
             this.GetPlaylistItems(this.SinglePlaylist.Id)
          }, (error)  =>  {
          alert("Error RemovePlaylistItem")
          })
      },
    getChannels: function() {
      axios.post(this.ServerApi + "/api/v1/channel/get",JSON.stringify({
          Owner: this.UserObj.userid,
          Type: "operator",
        }))
      .then((response)  =>  {
         this.Channels = response.data
      }, (error)  =>  {
       alert("Please check your network conection!")
      })
    },
    getChannelData: function() {
        for(var i = 0; i<this.Channels.length;i++) {
           if(this.Channels[i].Id == this.ChannelNum) {
             this.SelectedChannel = this.Channels[i]
             break
           }
        }
    },
    initPlaylists: function(e) {
        this.ChannelNum = parseInt(e.target.value)
         console.log(e.target.value)
        if(!e.target.value)
          return

        this.getPlaylists(this.ChannelNum)
        this.getChannelData()
        setTimeout( () => this.loadPreview(), 1000)
    },
    loadPreview: function() {
     // alert("loadPreview");
       jwplayer("BroadcastVideo").load([{file:"http://" + this.SelectedChannel.Playback_point + "/playlist.m3u8"}]);
       
        setTimeout( () => this.CalculatePlaylistDuration(), 1000)
       jwplayer("BroadcastVideo").on('error', () => 
              setTimeout( () =>  jwplayer("BroadcastVideo").play(), 2000)
       )
      
    },
    getPlaylists: function(id) {
      this.ChannelNum = parseInt(id)
      //alert( this.ChannelNum)
    
       axios.post(this.ServerApi + "/api/v1/playlist/get",JSON.stringify({
          Id: parseInt(id),
          By: "channel",
        }))
      .then((response)  =>  {
          this.Playlists = response.data
      }, (error)  =>  {  
       alert("Please check your network conection!")
      })
    },
    getPlaylistData: function(e) {
       console.log(e.target.value)
        if(!e.target.value)
          return
      this.PlaylistNum = e.target.value
       axios.post(this.ServerApi + "/api/v1/playlist/get",JSON.stringify({
          Id: parseInt(e.target.value),
          By: "playlist",
        }))
      .then((response)  =>  {
        console.log(response)
          this.SinglePlaylist = response.data
          this.GetPlaylistItems( this.SinglePlaylist.Id)
      }, (error)  =>  {
       alert("Please check your network conection!")
      })
    },
  getMedias: function(event) {
      axios.post(this.ServerApi + "/api/v1/media/get",JSON.stringify({}))
      .then((response)  =>  {
        console.log(response)
          this.Medias = response.data
        //console.log(this.Medias)
      }, (error)  =>  {
       alert("Please check your network conection!")
      })
    },
  GetPlaylistItems: function(id) {
    axios.post(this.ServerApi + "/api/v1/playlist/items",JSON.stringify({Playlist: id}))
      .then((response)  =>  {
        console.log(response)
          this.PlaylistsItems = response.data
          setTimeout( () => this.CalculatePlaylistDuration(), 1000)
          
      }, (error)  =>  {
       alert("Please check your network conection!")
      })
  },
  SavePlaylistItem: function(type) {
     if(this.PlaylistNum == 0) {
      alert("No playlist selected")
      return
    }
      var _start = "0"
     var params = {
      "Playlist": this.SinglePlaylist.Id,
      "File_url": this.Preview_filename,
      "Starttime": _start,
      "In":String(Math.round(this.Preview_in)).trim(),
      "Out": String(Math.round(this.Preview_out)).trim(),
      "Duration": String(Math.round(this.Play_duration)).trim(),
      "Status": "---"
    }
    if(type == 'live') {
      params.File_url = type
      params.In == 0
      params.Out == String(moment.duration(this.LiveDuration)._milliseconds/1000).trim()
      params.Duration = String(moment.duration(this.LiveDuration)._milliseconds/1000).trim()
    }
     axios.post(this.ServerApi + "/api/v1/playlist/add_item",JSON.stringify(params))
      .then((response)  =>  {
         alert(response.data.Remarks)
        this.GetPlaylistItems(this.SinglePlaylist.Id)
      }, (error)  =>  {  
       alert("Please check your network conection!")
      })

      this.dialog2 = false
  },
  SavePlaylist: function() {
    if(this.PlaylistNum == 0) {
      alert("No playlist selected")
      return
    }
     var r = confirm("Save and publish playlist?");
        if (r == false) {
          return true
        } 
    var _update = {
        "Id": this.SinglePlaylist.Id,
        "Name": this.SinglePlaylist.Name,
        "Starttime": moment(this.SinglePlaylist.Starttime).format("YYYY-MM-DD HH:mm:ss"),
        "Duration": this.SinglePlaylist.Duration.trim(),
        "Status": "active",
        "Channel": parseInt( this.ChannelNum)
    }
    console.log(_update)
    axios.post(this.ServerApi + "/api/v1/playlist/update",JSON.stringify(_update))
      .then((response)  =>  {
         alert(response.data.Remarks)
        this.SaveApplication()
      }, (error)  =>  {  
       alert("Please check your network conection!")
      })
  },
  SaveApplication: function() {
    axios.get("http://121.58.253.50:8990/playout.php?appname=" +this.SelectedChannel.Application)
      .then((response)  =>  {
         console.log(response.data)
           setTimeout( () => this.$socket.emit('reset', {data:"reset"}), 1300)
      }, (error)  =>  {  
       alert("Please check your network conection!")
      })
  },
  handleDrop(data, event) {
      console.log(data.media)
      
      jwplayer("PreviewVideo").load([{file:this.MediaApi + "/" + data.media}]);
      setTimeout( () => this.UpdatePreview(data.media), 1300)
      jwplayer("PreviewVideo").on('seeked',() => this.CalcuInOut(this.SeekType, jwplayer("PreviewVideo").getPosition()))
       
       
  },
  UpdatePreview: function(filename) {
         this.Preview_duration =  jwplayer("PreviewVideo").getDuration() //moment("2015-01-01").startOf('day').seconds(jwplayer("PreviewVideo").getDuration()).format('HH:mm:ss')
        this.Preview_out = this.Preview_duration
        this.Preview_in = "0"
        this.Preview_filename = filename
        this.Play_duration = this.Preview_duration
  },
  CalcuInOut: function(type, position) {
    position =  position //moment("2015-01-01").startOf('day').seconds(position).format('HH:mm:ss')
    if(type=="out")
      this.Preview_out =  position
    else
        this.Preview_in =  position

      this.calculatePlayDuration()
  },
  calculatePlayDuration: function() {
   
    this.Play_duration = parseFloat( this.Preview_out)  - parseFloat( this.Preview_in) 
    var check = moment("2015-01-01").startOf('day').seconds(this.Play_duration).format('HH:mm:ss')
    console.log(check)
  },
  AddPlaylist: function() {
    this.NewPlaylist.Starttime = "00:00:00"
    this.NewPlaylist.Duration = "00:00:00" 
    this.NewPlaylist.Channel  = this.ChannelNum
    this.NewPlaylist.Status = "active"
    this.NewPlaylist.Owner=this.UserObj.userid
    console.log(this.NewPlaylist)
    axios.post(this.ServerApi + "/api/v1/playlist/add",JSON.stringify(this.NewPlaylist))
      .then((response)  =>  {
         alert(response.data.Remarks)
         if(response.data.Status == 1) {
          this.getPlaylists(this.ChannelNum)
         }
      }, (error)  =>  {  
       alert("Please check your network conection!")
      })
  }
  

  }//methods
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preview-block {
	height: 260px;
	margin-bottom: 40px;
}
@media only screen and (max-width: 1366px) {
    .preview-block {
       height: 200px;
    }
}
.listinfo {
	text-align: center;
	height: 150px;
}
.listaction {
	height: 40px;
	text-align: center;
}
.listaction button {
    margin: 3px;
}

.header-block {
	background: #F68309;
	padding: 4px 10px;
	margin-bottom: 10px;
}
.header-block input, select, .inprev {
	float: right;
	width: 60%;
	border: 0;
	font-size: .9em;
	padding: 1px 10px;
	background:#D87308;
	border-radius: 3px;
	color: #fff;
}
.inprev {
  float: none;
  	background:#333;
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
}
.header-block select {
  height: 20px;
}
.mediafiles {
	background: #000;
	padding: 5px 15px;
  height: 560px;
  overflow-y: scroll;
}
.mediafiles .list-group-item {
	background: none;
	padding: 2px;
  font-size: .9em;
    cursor: move;
}
.mediafiles .list-group-item i {
	color:#F68309;
}

.table tbody tr:hover {
	background: #000;
	cursor: pointer;
}

.table tbody tr td:last-child {
	text-align: center;
	color: red;
}
.vdatetime{
  background: #343A40;
  color:#343A40;
  overflow: hidden;
  text-align: center;
  width: 20px;
  padding: 0px;
  height: 18px;
  border-radius: 3px;
  float: right;
  margin-right: 30px;
}
._card{
 /* background: #323232 !important;
  padding: 15px;*/
}
._card button {
  float: right;
  margin-left: 7px;
}
._tableWrap {
height: 600px;
  overflow-y: scroll;
}
</style>
