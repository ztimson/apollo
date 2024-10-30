import i2c from 'i2c-bus';

export async function imu(address = 0x4A) {  // BNO080 default I2C address
    const i2cBus = await i2c.openPromisified(1);

    // Register addresses for accelerometer, gyroscope, and magnetometer data (assumes configuration is done)
    const ACCEL_X_LSB = 0x08;
    const ACCEL_X_MSB = 0x09;
    const ACCEL_Y_LSB = 0x0A;
    const ACCEL_Y_MSB = 0x0B;
    const ACCEL_Z_LSB = 0x0C;
    const ACCEL_Z_MSB = 0x0D;

    const GYRO_X_LSB = 0x10;
    const GYRO_X_MSB = 0x11;
    const GYRO_Y_LSB = 0x12;
    const GYRO_Y_MSB = 0x13;
    const GYRO_Z_LSB = 0x14;
    const GYRO_Z_MSB = 0x15;

    const MAG_X_LSB = 0x16;  // Hypothetical register for magnetometer X LSB
    const MAG_X_MSB = 0x17;  // Hypothetical register for magnetometer X MSB
    const MAG_Y_LSB = 0x18;  // Hypothetical register for magnetometer Y LSB
    const MAG_Y_MSB = 0x19;  // Hypothetical register for magnetometer Y MSB
    const MAG_Z_LSB = 0x1A;  // Hypothetical register for magnetometer Z LSB
    const MAG_Z_MSB = 0x1B;  // Hypothetical register for magnetometer Z MSB

    // Read data from the sensor registers
    const data = await Promise.all([
        i2cBus.readByte(address, ACCEL_X_LSB),
        i2cBus.readByte(address, ACCEL_X_MSB),
        i2cBus.readByte(address, ACCEL_Y_LSB),
        i2cBus.readByte(address, ACCEL_Y_MSB),
        i2cBus.readByte(address, ACCEL_Z_LSB),
        i2cBus.readByte(address, ACCEL_Z_MSB),
        i2cBus.readByte(address, GYRO_X_LSB),
        i2cBus.readByte(address, GYRO_X_MSB),
        i2cBus.readByte(address, GYRO_Y_LSB),
        i2cBus.readByte(address, GYRO_Y_MSB),
        i2cBus.readByte(address, GYRO_Z_LSB),
        i2cBus.readByte(address, GYRO_Z_MSB),
        i2cBus.readByte(address, MAG_X_LSB),
        i2cBus.readByte(address, MAG_X_MSB),
        i2cBus.readByte(address, MAG_Y_LSB),
        i2cBus.readByte(address, MAG_Y_MSB),
        i2cBus.readByte(address, MAG_Z_LSB),
        i2cBus.readByte(address, MAG_Z_MSB),
    ]);

    // Convert accelerometer data
    const accelX = ((data[1] << 8) | data[0]) / 1000;
    const accelY = ((data[3] << 8) | data[2]) / 1000;
    const accelZ = ((data[5] << 8) | data[4]) / 1000;

    // Convert gyroscope data
    const gyroX = ((data[7] << 8) | data[6]) / 1000;
    const gyroY = ((data[9] << 8) | data[8]) / 1000;
    const gyroZ = ((data[11] << 8) | data[10]) / 1000;

    // Convert magnetometer data
    const magX = ((data[13] << 8) | data[12]) / 1000;  // Hypothetical conversion factor
    const magY = ((data[15] << 8) | data[14]) / 1000;
    const magZ = ((data[17] << 8) | data[16]) / 1000;

    await i2cBus.close();
    return {
        acceleration: { x: accelX, y: accelY, z: accelZ },
        gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
        magnetometer: { x: magX, y: magY, z: magZ },
    };
}
