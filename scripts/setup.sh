#!/bin/bash

sleep 30

# Update package lists
sudo apt-get update

# Install unzip
sudo apt install -y unzip nodejs npm mariadb-server

# Unzip webapp to /opt
# sudo unzip /tmp/webapp.zip -d /tmp/

# Install Node.js and npm
# sudo apt install -y nodejs npm

# Install MariaDB
# sudo apt-get purge -y mariadb-server
# sudo apt install -y mariadb-server

# Start and enable MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB installation
#sudo mysql_secure_installation

# Access MySQL shell and create database and user
sudo mysql -u root << EOF
CREATE DATABASE Demo;
GRANT ALL PRIVILEGES ON Demo.* TO 'root'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
EOF


# Create group and user
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225



# Navigate to webapp directory
cd /tmp/
echo "tmp contents: "
sudo ls -lrt

mv /tmp/webapp.tar.gz /home/admin/webapp.tar.gz
sudo mv /tmp/users.csv /opt/users.csv

cd /home/admin
echo sudo unzip webapp.zip
mkdir webapp
tar -xvf webapp.tar.gz -C webapp/

# Modify permissions for /home/admin and webapp directory
sudo chown -R csye6225:csye6225 /home/admin
sudo chown -R csye6225:csye6225 /home/admin/webapp

# Create .env file
cd /home/admin/webapp
touch .env
echo "DB_PORT=3306" >> .env
echo "DB_HOST=127.0.0.1" >> .env
echo "DB_DIALECT=mysql" >> .env
echo "DB_USER=root" >> .env
echo "DB_PASSWORD=password" >> .env
echo "DB_NAME=Demo" >> .env

# Install Node.js dependencies
npm install

# Inform user about completion
echo "Setup completed successfully!"
