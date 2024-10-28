# Apollo

## Setup
```sh
sudo apt update && sudo apt upgrade -y
sudo apt install htop i2c-tools hwclock
raspi-config # enable i2c & UART
echo "@reboot root hwclock -s" >> /etc/crontab
```
