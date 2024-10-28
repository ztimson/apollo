# Apollo

## Setup
```sh
sudo apt update && sudo apt upgrade -y
sudo apt install htop i2c-tools
raspi-config # enable i2c
```

### MAC fix
```sh
MAC_PREFIX="80:86:00"

files=(
    "/etc/systemd/network/eth0.network"
    "/etc/systemd/network/wlan0.network"
)

for file in "${files[@]}"; do
    if [ -n "$(cat $file | grep MACAddress )" ]; then continue; fi
    mac_address=$(printf '%02X:%02X:%02X' $((RANDOM % 256)) $((RANDOM % 256)) $((RANDOM % 256)))
    cat <<EOF >> "$file"
[Link]
MACAddress=$MAC_PREFIX:$mac_address
EOF
done
```
