import { BleManager } from 'react-native-ble-plx';
import _ from 'lodash';

export let manager = new BleManager();

let devices = [];
let devices2 = [];

export const startScanner = (setScannedDevices, setLoading) => {
  devices = [];
  setScannedDevices([]);
  manager.startDeviceScan(null, null, (error, device) => {
    if (error || !device.localName) return;
    const validateDevice = _.filter(devices, d => d.id === device.id);
    if (!validateDevice.length) devices.push((device));
  });
  stop(setScannedDevices, setLoading);
};

export const stopScanner = () => {
  manager.stopDeviceScan();
};

export const conectTo = async (device) => {
  return new Promise((resolve, reject) => {
    manager.connectToDevice(device.id, { autoConnect: true })
      .then((aux) => {
        resolve(aux.discoverAllServicesAndCharacteristics());
      })
      .then((aux) => {
        resolve(aux.discoverAllServicesAndCharacteristics());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const read = async (device) => {
  return new Promise((resolve, reject) => {
    device.readCharacteristicForService('FFF0', 'FFF1')
      .then((aux) => {
        resolve(aux);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const listConected = async () => {
  return new Promise((resolve, reject) => {
    manager.connectedDevices()
      .then((aux) => {
        resolve(aux);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const isConected = async (idDevice) => {
  return new Promise((resolve, reject) => {
    manager.isDeviceConnected(idDevice + 1)
      .then((aux) => {
        resolve(aux);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const writeCharacteristic = async (deviceID, serivce, characteristic, valueb64) => {
  return new Promise((resolve, reject) => {
    manager.writeCharacteristicWithResponseForDevice(
      deviceID,
      serivce,
      characteristic,
      valueb64,
    ).then((res) => {
      console.info('write suc', res);
    }).catch((err) => {
      console.error('write err', err);
    });
  });
};

export const readDevice = async (device) => {
  return new Promise((resolve, reject) => {
    device.readCharacteristicForService(device.id, '40E1ED56-EC4A-4DC6-A6BD-30377F186B77')
      .then((characteristic) => {
        console.log(base64.decode(characteristic.value));
        console.log(characteristic);
        resolve(characteristic);
      }).catch((error) => {
      console.log('error', error);
      reject(error);
    });
  });
};

const stop = (setScannedDevices, setLoading) => {
  setTimeout(() => {
    stopScanner();
    setScannedDevices(devices);
    setLoading(false);
  }, 8000);
};

const deviceFormat = device => ({
  id: device.id,
  name: device.name,
});
