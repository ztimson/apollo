import i2c from 'i2c-bus';

export async function bme(address = 0x76) {
    const i2cBus = await i2c.openPromisified(1);
    const data = await Promise.all([
        i2cBus.readByte(address, 0xFA), // Temp MSB
        i2cBus.readByte(address, 0xFB), // Temp LSB
        i2cBus.readByte(address, 0xFC), // Temp XLSB
        i2cBus.readByte(address, 0xF7), // Pressure MSB
        i2cBus.readByte(address, 0xF8), // Pressure LSB
        i2cBus.readByte(address, 0xF9), // Pressure XLSB
        i2cBus.readByte(address, 0xFD), // Humidity MSB
        i2cBus.readByte(address, 0xFE), // Humidity LSB
    ]);

    // Calibration registers
    const CALIBRATION_LENGTH = 24;
    const calibBuffer = Buffer.alloc(CALIBRATION_LENGTH);
    await i2cBus.readI2cBlock(address, 0x88, CALIBRATION_LENGTH, calibBuffer);
    const T1 = calibBuffer.readUInt16LE(0);
    const T2 = calibBuffer.readInt16LE(2);
    const T3 = calibBuffer.readInt16LE(4);

    const rawTemp = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    const var1 = (((rawTemp >> 3) - (T1 << 1)) * T2) / 2048;
    const var2 = (((((rawTemp >> 4) - T1) * ((rawTemp >> 4) - T1)) >> 12) * T3) / 16384;
    const temp = (var1 + var2) / 5120.0;

    await i2cBus.close();
    return {
        temperature: temp,
        pressure: ((data[3] << 12) | (data[4] << 4) | (data[5] >> 4)) / 25600,
        humidity: ((data[6] << 8) | data[7]) / 1024.0,
    };
}
