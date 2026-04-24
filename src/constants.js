export const PROTOCOLS = {
  zwave:  { label:"Z-Wave",   color:"#00e5ff", short:"ZW"   },
  zigbee: { label:"Zigbee",   color:"#ffb300", short:"ZB"   },
  knx:    { label:"KNX",      color:"#b388ff", short:"KNX"  },
  bacnet: { label:"BACnet",   color:"#69ff47", short:"BAC"  },
  rest:   { label:"REST API", color:"#ff6e6e", short:"REST" },
  mqtt:   { label:"MQTT",     color:"#ff9a3c", short:"MQTT" },
};

export const DEVICE_TYPES = [
  {id:"motion",   label:"Motion Sensor",   icon:"ðŸ‘",  protocol:"zwave",  category:"sensor"    },
  {id:"smoke",    label:"Smoke Detector",  icon:"ðŸ”¥",  protocol:"zwave",  category:"sensor"    },
  {id:"temp",     label:"Temp/Humidity",   icon:"ðŸŒ¡",  protocol:"zigbee", category:"sensor"    },
  {id:"door",     label:"Door/Window",     icon:"ðŸšª",  protocol:"zwave",  category:"sensor"    },
  {id:"leak",     label:"Water Leak",      icon:"ðŸ’§",  protocol:"zwave",  category:"sensor"    },
  {id:"switch",   label:"Smart Switch",    icon:"ðŸ”˜",  protocol:"zigbee", category:"control"   },
  {id:"dimmer",   label:"Dimmer",          icon:"ðŸ’¡",  protocol:"knx",    category:"control"   },
  {id:"valve",    label:"Valve Control",   icon:"ðŸ”§",  protocol:"bacnet", category:"control"   },
  {id:"hvac",     label:"HVAC",            icon:"â„ï¸",  protocol:"bacnet", category:"control"   },
  {id:"shade",    label:"Motorized Shade", icon:"ðŸªŸ",  protocol:"knx",    category:"control"   },
  {id:"cam",      label:"IP Camera",       icon:"ðŸ“·",  protocol:"rest",   category:"security"  },
  {id:"access",   label:"Access Control",  icon:"ðŸ”‘",  protocol:"rest",   category:"security"  },
  {id:"intercom", label:"Intercom",        icon:"ðŸ“ž",  protocol:"rest",   category:"security"  },
  {id:"relay",    label:"MQTT Relay",      icon:"ðŸ“¡",  protocol:"mqtt",   category:"automation"},
  {id:"hub",      label:"Gateway Hub",     icon:"ðŸ–§",  protocol:"mqtt",   category:"automation"},
  {id:"elevator", label:"Elevator I/O",    icon:"ðŸ”²",  protocol:"bacnet", category:"automation"},
];

export const FLOOR_DATA = {
  B:  {label:"Basement",    rooms:[
    {id:"mech",     label:"MECH",         x:8,  y:8,   w:120,h:100,note:'15\'Ã—13\'6"'},
    {id:"gym",      label:"GYM",          x:8,  y:116, w:150,h:120,note:'19\'4"Ã—15\'5"'},
    {id:"storage",  label:"STORAGE",      x:8,  y:244, w:110,h:65, note:'13\'4"Ã—8\'6"'},
    {id:"sauna",    label:"SAUNA",        x:8,  y:317, w:70, h:80, note:'8\'5"Ã—10\'2"'},
    {id:"elemech",  label:"ELE/MECH",     x:86, y:317, w:100,h:80, note:'11\'10"Ã—9\''},
  ]},
  G:  {label:"Garden Floor",rooms:[
    {id:"garden",   label:"GARDEN",       x:110,y:4,   w:250,h:26, note:"25'Ã—29'"},
    {id:"greatroom",label:"GREAT ROOM",   x:8,  y:34,  w:440,h:200,note:'22\'Ã—35\'6" Â· Ceil 11\'8"'},
    {id:"entry",    label:"FOYER",        x:8,  y:242, w:150,h:55, note:""},
    {id:"garage",   label:"2-CAR GARAGE", x:8,  y:305, w:320,h:170,note:'17\'Ã—30\'10"'},
  ]},
  "2":{label:"2nd Floor",   rooms:[
    {id:"terrace",  label:"TERRACE",      x:200,y:8,   w:240,h:110,note:'22\'6"Ã—28\'4"'},
    {id:"living",   label:"LIVING ROOM",  x:8,  y:126, w:400,h:140,note:'22\'7"Ã—18\'9" Â· Ceil 9\'3"'},
    {id:"kitchen",  label:"KITCHEN/DINING",x:8, y:274, w:400,h:165,note:'22\'7"Ã—20\'2"'},
  ]},
  "3":{label:"3rd Floor",   rooms:[
    {id:"master",   label:"PRIMARY BED",  x:240,y:85,  w:225,h:145,note:'13\'11"Ã—13\'8"'},
    {id:"bath1",    label:"BATH",         x:8,  y:240, w:85, h:80, note:""},
    {id:"bath2",    label:"BATH",         x:100,y:240, w:115,h:80, note:""},
    {id:"wic",      label:"WIC",          x:240,y:235, w:95, h:34, note:""},
    {id:"sitting",  label:"SITTING",      x:240,y:276, w:190,h:124,note:'14\'7"Ã—10\'2"'},
    {id:"bed2",     label:"BEDROOM",      x:8,  y:328, w:155,h:112,note:'10\'11"Ã—15\'3"'},
    {id:"bed3",     label:"BEDROOM",      x:170,y:328, w:150,h:112,note:'11\'7"Ã—15\'3"'},
  ]},
  R:  {label:"Roof",        rooms:[
    {id:"roof",     label:"ROOF TERRACE", x:25, y:45,  w:360,h:280,note:'24\'1"Ã—36\'9"'},
    {id:"rmech",    label:"MECH",         x:398,y:45,  w:70, h:60, note:""},
  ]},
};

export const FL = ["B","G","2","3","R"];
export const FLAB = {B:"Basement",G:"Garden","2":"2nd Floor","3":"3rd Floor",R:"Roof"};
export const STCOL = {online:"#69ff47",offline:"#ff6e6e",warning:"#ffb300"};

export const DEMO = [
  {id:"d1", type:"hub",      label:"Gateway Hub",     icon:"ðŸ–§", protocol:"mqtt",   floor:"B",status:"online" },
  {id:"d2", type:"hvac",     label:"HVAC",            icon:"â„ï¸", protocol:"bacnet", floor:"B",status:"online" },
  {id:"d14",type:"elevator", label:"Elevator I/O",    icon:"ðŸ”²", protocol:"bacnet", floor:"B",status:"online" },
  {id:"d15",type:"valve",    label:"Valve Control",   icon:"ðŸ”§", protocol:"bacnet", floor:"B",status:"online" },
  {id:"d3", type:"cam",      label:"IP Camera",       icon:"ðŸ“·", protocol:"rest",   floor:"G",status:"online" },
  {id:"d4", type:"access",   label:"Access Control",  icon:"ðŸ”‘", protocol:"rest",   floor:"G",status:"online" },
  {id:"d5", type:"motion",   label:"Motion Sensor",   icon:"ðŸ‘", protocol:"zwave",  floor:"G",status:"warning"},
  {id:"d6", type:"dimmer",   label:"Dimmer",          icon:"ðŸ’¡", protocol:"knx",    floor:"G",status:"online" },
  {id:"d7", type:"temp",     label:"Temp/Humidity",   icon:"ðŸŒ¡", protocol:"zigbee", floor:"2",status:"online" },
  {id:"d8", type:"shade",    label:"Motorized Shade", icon:"ðŸªŸ", protocol:"knx",    floor:"2",status:"online" },
  {id:"d9", type:"smoke",    label:"Smoke Detector",  icon:"ðŸ”¥", protocol:"zwave",  floor:"2",status:"online" },
  {id:"d10",type:"switch",   label:"Smart Switch",    icon:"ðŸ”˜", protocol:"zigbee", floor:"3",status:"online" },
  {id:"d11",type:"hvac",     label:"HVAC Thermostat", icon:"â„ï¸", protocol:"bacnet", floor:"3",status:"offline"},
  {id:"d12",type:"cam",      label:"IP Camera",       icon:"ðŸ“·", protocol:"rest",   floor:"R",status:"online" },
  {id:"d13",type:"relay",    label:"MQTT Relay",      icon:"ðŸ“¡", protocol:"mqtt",   floor:"R",status:"online" },
];
