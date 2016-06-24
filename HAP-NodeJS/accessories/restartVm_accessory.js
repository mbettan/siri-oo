var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var rest = require('rest');

//OO parameters
var centralUrl = "<central_url>";;
var flowUuid = "1d845c9e-b8e1-49c9-9689-731c218cd082";
var runName = "Restart Windows VM";
var authToken ="YWRtaW46YWRtaW4=";
var inputs ="";
var runFlowRequest = {method:"POST", 
                headers:{'Authorization': 'Basic '+authToken, 'Content-Type': 'application/json'} , 
                path: centralUrl + "/rest/latest/executions", 
                entity:"{\"flowUuid\": \""+ flowUuid +"\", \"inputs\": {"+inputs+"}, \"logLevel\": \"STANDARD\", \"runName\": \"" + runName + "\"}"};

// here's a fake hardware device that we'll expose to HomeKit
var FAKE_LIGHT = {
  powerOn: false,
  
  setPowerOn: function(on) { 
   console.log("%s the flow " + runName, on ? "Run" : "Cancel");
   if (on) {
    console.log(runFlowRequest);
      rest(runFlowRequest).then(function(response) {
        console.log('response: ', response);
      });
    }
    FAKE_LIGHT.powerOn = on;
  },
  identify: function() {
    console.log("Identify the flow accessory!");
  }
}

// Generate a consistent UUID for our flow Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "flow".
var ooFlowUUID = uuid.generate('hap-nodejs:accessories:flow');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var ooFlow = exports.accessory = new Accessory('RestartVMFlow', ooFlowUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
ooFlow.username = "1E:2B:3C:4D:5E:F1";
ooFlow.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
ooFlow
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "HPE")
  .setCharacteristic(Characteristic.Model, "Operations Orchestration");

// listen for the "identify" event for this Accessory
ooFlow.on('identify', function(paired, callback) {
  FAKE_LIGHT.identify();
  callback(); // success
});

// Add the actual Lightbulb Service and listen for change events from iOS.
ooFlow
  .addService(Service.Lightbulb, "RestartVMFlow") // services exposed to the user should have "names" like "Restart VM Flow" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FAKE_LIGHT.setPowerOn(value);
    callback(); // Our fake Light is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
// we can use this later to see if flow is still running
ooFlow
  .getService(Service.Lightbulb)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {
    
    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.
    // we can use this to make a get call to see if the flow is still running or not
    
    var err = null; // in case there were any problems
    
    if (FAKE_LIGHT.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  });
