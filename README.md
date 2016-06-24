# siri-oo
SIRI OO Trigger workflows
This project is based on HAP-NodeJS project link: https://github.com/KhaosT/HAP-NodeJS.git
The Startup script is based on node-startup project link: https://github.com/chovy/node-startup.git

1. Install node.js, npm, node-gyp and other things we need:  
     ``sudo apt-get update``  
     ``sudo apt-get install nodejs npm git-core libnss-mdns libavahi-compat-libdnssd-dev``  
     ``sudo npm config set registry http://registry.npmjs.org/``  
     ``sudo npm install -g node-gyp``
     ``ln -s /usr/bin/nodejs /usr/bin/node``

1. Clone the siri-oo project :  
     ``git clone https://github.com/mbettan/siri-oo.git``  

1. Go into the directory where you cloned it:  
    ``cd siri-oo/HAP-NodeJS``  

1. Rebuild npm:  
    ``npm rebuild``  

1. Rebuild npm:  
    ``npm install node-persist debug mdns srp ed25519 curve25519 rest``

1. Make sure that the central_url variable in accessory js contains your url:  
    check accessories in siri-oo/HAP-NodeJS/accessories

1. Try to run the server:  
    ``node Core.js``  

#node-startup#

Startup script for Linux-based systems for running a HAP-Server Node JS app when rebooting, using an **/etc/init.d** script.


##Why node-startup?##

When my VPS was rebooted occassionally by the hosting provider, my Node.js app was not coming back online after boot. This script can be used in **/etc/init.d**, which will allow rc.d to restart your app when the machine reboots without your knowledge.

##Startup Installation##

Clone the repo:

    git clone https://github.com/chovy/node-startup.git
    cd node-startup/init.d

Edit the **node-app** script with your settings from the **Configuration** section, then follow instructions in the **Running** section.

##Startup Configuration##

At the top of the **node-app** file, a few items are declared which are either passed to the Node.js app or used for general execution/management.

###Node.js Config for Startup###

The items declared and passed to the Node.js application are:

- **NODE_ENV** - the type of environment - **development**, **production**, etc. - can be read by the application to do things conditionally (defaults to **"production"**)
- **PORT** - the port that the Node.js application should listen on - should be read by the application and used when starting its server (defaults to **"3000"**)
- **CONFIG_DIR** - used for [node-config](https://github.com/lorenwest/node-config) (defaults to **"$APP_DIR"**); is required, but should be kept as the default if not needed

###Execution Config###

The items declared and used by the overall management of executing the application are:

- **NODE_EXEC** - location of the Node.js package executable - useful to set if the executable isn't on your PATH or isn't a service (defaults to `$(which node)`)
- **APP_DIR** - location of the Node.js application directory (defaults to **"/var/www/example.com"**, should be set to HAP-NodeJS path **"/home/user/siri-oo/HAP-NodeJS"**)
- **NODE_APP** - filename of the Node.js application (defaults to **"app.js"**, should be set to **"Core.js"**)
- **PID_DIR** - location of the PID directory (defaults to **"$APP_DIR/pid"**)
- **PID_FILE** - name of the PID file (defaults to **"$PID_DIR/app.pid"**)
- **LOG_DIR** - location of the log (Node.js application output) directory (defaults to **"$APP_DIR/log"**)
- **LOG_FILE** - name of the log file (defaults to **"$LOG_DIR/app.log"**)
- **APP_NAME** - name of the app for display and messaging purposes (defaults to **"Node app"**)

##Running Startup##
	
Copy the startup script **node-app** to your **/etc/init.d** directory:

    sudo bash -l
    cp ./init.d/node-app /etc/init.d/

###Available Actions###

The service exposes 4 actions:

- **start** - starts the Node.js application
- **stop** - stops the Node.js application
- **restart** - stops the Node.js application, then starts the Node.js application
- **status** - returns the current running status of the Node.js application (based on the PID file and running processes)

####Force Action####

In addition to the **start**, **stop**, and **restart** actions, a **--force** option can be added to the execution so that the following scenarios have the following outcomes:

- **start** - PID file exists but application is stopped -> removes PID file and starts the application
- **stop** - PID file exists but application is stopped -> removes PID file
- **restart** - either of the above scenarios occur

###Testing###

Test that it all works:

    /etc/init.d/node-app start
    /etc/init.d/node-app status
    /etc/init.d/node-app restart
    /etc/init.d/node-app stop

Add **node-app** to the default runlevels:

    update-rc.d node-app defaults

Finally, reboot to be sure the Node.js application starts automatically:

    sudo reboot

##Adding HomeKit to iOS##

HomeKit is actually not an app; it's a "database" similar to HealthKit and PassKit. But where HealthKit has the companion _Health_ app and PassKit has _Passbook_, Apple has supplied no app for managing your HomeKit database (at least [not yet](http://9to5mac.com/2015/05/20/apples-planned-ios-9-home-app-uses-virtual-rooms-to-manage-homekit-accessories/)). However, the HomeKit API is open for developers to write their own apps for adding devices to HomeKit.

Fortunately, there are now a few apps in the App Store that can manage your HomeKit devices. The most comprehensive one I've used is [MyTouchHome](https://itunes.apple.com/us/app/mytouchhome/id965142360?mt=8&at=11lvmd&ct=mhweb) which costs $2.

There are also some free apps that work OK. Try [Insteon+](https://itunes.apple.com/US/app/id919270334?mt=8) or [Lutron](https://itunes.apple.com/us/app/lutron-app-for-caseta-wireless/id886753021?mt=8) or a number of others.

If you are a member of the iOS developer program, I highly recommend Apple's [HomeKit Catalog](https://developer.apple.com/library/ios/samplecode/HomeKitCatalog/Introduction/Intro.html) app, as it is reliable and comprehensive and free (and open source).

Once you've gotten a HomeKit app running on your iOS device, it should "discover" the single accessory "Homebridge", assuming that you're still running Homebridge and you're on the same Wifi network. Adding this accessory will automatically add all accessories and platforms defined in `config.json`.

When you attempt to add Homebridge, it will ask for a "PIN code". The default code is `031-45-154` (but this can be changed, see `config-sample.json`).

##Interacting with your Devices##

Once your device has been added to HomeKit, you should be able to tell Siri to control your devices. However, realize that Siri is a cloud service, and iOS may need some time to synchronize your device information with iCloud.

One final thing to remember is that Siri will almost always prefer its default phrase handling over HomeKit devices. For instance, if you name your Sonos device "Radio" and try saying "Siri, turn on the Radio" then Siri will probably start playing an iTunes Radio station on your phone. Even if you name it "Sonos" and say "Siri, turn on the Sonos", Siri will probably just launch the Sonos app instead. This is why, for instance, the suggested `name` for the Sonos accessory is "Speakers".

##Startup Supported OS##

Tested with Debian 6.0, but it should work on other Linux systems that use startup scripts in **/etc/init.d** (Red Hat, CentOS, Gentoo, Ubuntu, etc.).

##LICENSE##

(The MIT License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/chovy/node-startup/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

