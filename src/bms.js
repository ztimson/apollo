import i2c from 'i2c-bus';

export async function bms(address = 0x57) {
    const i2cBus = await i2c.openPromisified(1);
    const data = await Promise.all([
        i2cBus.readByte(address, 0x02),
        i2cBus.readByte(address, 0x04),
        i2cBus.readByte(address, 0x22),
        i2cBus.readByte(address, 0x23),
        i2cBus.readByte(address, 0x2a),
    ]);
    return {
        charging: !!((data[0] >> 7) & 1),
        percentage: data[4] / 100,
        temperature: data[1] - 40,
        voltage: ((data[2] << 8) | data[3]) / 1000,
    }
}
