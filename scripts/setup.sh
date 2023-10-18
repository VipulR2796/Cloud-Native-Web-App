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
sudo mysql_secure_installation

# Access MySQL shell and create database and user
sudo mysql -u root << EOF
CREATE DATABASE Demo;
GRANT ALL PRIVILEGES ON Demo.* TO 'root'@'localhost' IDENTIFIED BY 'password';"
FLUSH PRIVILEGES;
EOF

# Navigate to webapp directory
cd /tmp/
echo "tmp contents: "
sudo ls -lrt

mv /tmp/webapp.tar.gz /home/admin/webapp.tar.gz
sudo mv /tmp/users.csv /opt/users.csv

cd 
unzip /home/admin/webapp.tar.gz
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
