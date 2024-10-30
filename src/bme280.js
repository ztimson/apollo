import i2c from 'i2c-bus';

export async function bme(address = 0x76) {
    const i2cBus = await i2c.openPromisified(1);
    const data = await Promise.all([
        i2cBus.readByte(address, 0xFA),
        i2cBus.readByte(address, 0xFB),
        i2cBus.readByte(address, 0xFC),
        i2cBus.readByte(address, 0xF7),
        i2cBus.readByte(address, 0xF8),
        i2cBus.readByte(address, 0xF9),
        i2cBus.readByte(address, 0xFD),
        i2cBus.readByte(address, 0xFE),
    ]);

    const T1 = 27504;
    const T2 = 26435;
    const T3 = -1000;

    const rawTemp = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    let var1 = (((rawTemp >> 3) - (T1 << 1)) * T2) / 2048;
    let var2 = (((((rawTemp >> 4) - T1) * ((rawTemp >> 4) - T1)) >> 12) * T3) / 16384;
    let temp = (var1 + var2) / 5120.0;

    return {
        temperature: temp,
        pressure: ((data[3] << 12) | (data[4] << 4) | (data[5] >> 4)) / 25600,
        humidity: ((data[6] << 8) | data[7]) / 1024.0,
    };
}
