# siri-oo
SIRI OO Trigger workflows
This is a brief guide to installing HAP-NodeJS on an Ubuntu/Debian system.

1. Install node.js, npm, node-gyp and other things we need:  
     ``sudo apt-get update``  
     ``sudo apt-get install nodejs npm git-core libnss-mdns libavahi-compat-libdnssd-dev``  
     ``sudo npm config set registry http://registry.npmjs.org/``  
     ``sudo npm install -g node-gyp``

1. Clone the HAP-NodeJS project:  
     ``git clone https://github.com/KhaosT/HAP-NodeJS.git``  

1. Go into the directory where you cloned it:  
    ``cd HAP-NodeJS``  

1. Rebuild npm:  
    ``npm rebuild``  

1. Try to run the server:  
    ``node Core.js``  

It will probably give you errors about missing modules. Install these using ``npm install <module name>``, replacing ``<module name>`` with the name of the module it is missing. After installing the module it wanted, run ``npm rebuild`` and try to run the server again with ``node Core.js``. Repeat installing missing modules until the server launches with no errors. HAP-NodeJS is now all set up.

YouTube Tutorial on Raspberry Pi (could be used for other Linux/ARM devices): https://youtu.be/93J-tavDG6o
