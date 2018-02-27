#refresh
sudo apt-get update

#install required packages
sudo apt-get install curl -y
sudo apt-get install git -y 
sudo apt-get install build-essential -y


#install mongo PPA
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

#install node PPA
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

#refresh
#sudo apt-get update

# install node server
sudo apt-get install -y nodejs

# install daemon for server
sudo npm install pm2 -g

#install databases
sudo apt-get install -y mongodb-org
sudo apt-get install redis-server -y
#start mongodb with system
sudo systemctl enable mongod.service

#download and install server
cd ~
git  clone https://github.com/termitavee/chibimmo-server.git
cd ./chibimmo-server
npm install

#update ownership 
sudo chown chibimmo:chibimmo -R ./
sudo chown chibimmo:chibimmo -R ../.pm2
sudo chown chibimmo:chibimmo -R ../.npm


#monitoring and star server, not secure but itś a dummy account

pm2 link c4b6u7cvvrkkpae kummc0fvr7plq8s termitavee-virtualbox
pm2 start ./index.js  --name "chibimmo"