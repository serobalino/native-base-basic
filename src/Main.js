import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Link,
  Pressable,
  Text,
  useColorMode,
  VStack,
  useToast, ScrollView, Stack, View, Alert,
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView } from 'react-native';
import { conectTo, isConected, read, startScanner, stopScanner, writeCharacteristic } from './plugins/bt';
import {Buffer} from 'buffer';

const elm327ServiceUUID = '000018f0-0000-1000-8000-00805f9b34fb';
const elm327NotifyCharacteristicUUID = '00002af0-0000-1000-8000-00805f9b34fb';
const elm327WriteCharacteristicUUID = '00002af1-0000-1000-8000-00805f9b34fb';

const ELM_327_STATUS_WAITING = 'WAITING';
const ELM_327_STATUS_BATTERY_VOLTAGE_REQUEST = 'VOLT_REQ';


export default function Main() {
  const validation = useForm({ mode: 'all' });
  const { t } = useTranslation();
  const toast = useToast();
  const { handleSubmit, formState } = validation;
  const [list, setList] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [caracteristicas, setCarasteristicas] = useState([]);
  const [dev, setDev] = useState({});
  const [service, setService] = useState({});
  const [search, setSearch] = useState(false);
  const [elm327Status, setElm327Status] = useState(ELM_327_STATUS_WAITING);

  const loadBts = () => {
    setSearch(true);
    if(dev.id){
      isConected(dev.id).then(a=>{
        console.log('esta conectado');
        setSearch(false);
      }).catch(()=>{
        setDev({});
        startScanner(setList, setSearch);
      })
    }else {
      startScanner(setList, setSearch);
    }
  };

  const readDevice = () => {
    const readVoltageBytes = Buffer.from('AT RV\r').toString('base64');
    setElm327Status(ELM_327_STATUS_BATTERY_VOLTAGE_REQUEST);
    writeToElm327(readVoltageBytes);
  }

  const cancelar = () => {
    setSearch(false);
    stopScanner();
  };

  const  setupNotifications = (device) => {
    console.log('monitor set');
    device.monitorCharacteristicForService(
      elm327ServiceUUID,
      elm327NotifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('error', error);
          return;
        }
        console.log('monitor set error',error);
        updateValue(characteristic.uuid, characteristic.value);
      },
    );
  }

  const updateValue = (key, value) => {
    const readebleData = Buffer.from(value, 'base64').toString('ascii');
    console.info('update read', key,value,readebleData);
  }

  const writeToElm327 = (bytesToWrite) => {
    if (dev === null) {
      console.error('Cancelado no seteado dispositivo')
      return;
    }
    //this.elmDataQueue = new Queue();
    writeCharacteristic(dev.id,elm327ServiceUUID, elm327WriteCharacteristicUUID, bytesToWrite)
  }

  const pushItem = (item) => {
    console.log('touch:',JSON.stringify(item,null,3));
    item.connect().then((device1)=>{
      setDev(item);
      return device1.discoverAllServicesAndCharacteristics();
    }).then((device2)=>{
      return setupNotifications(device2);
    }).then((device3)=>{
      item.services().then((a)=>{
        console.log('servicios',a)
        setServicios(a);
      })
      console.log('3',device3)
    }).then(dev => {
      console.info('success to connect', dev);
      //workTheProcessQueue();
    }).catch((err)=>{
      console.error(err)
    })
  };

  return (
    <SafeAreaView pt={10} pb={10}>
      <Heading size='lg'>Welcome to OBD</Heading>
      <VStack w="100%" space={4} px="2" mt="4" alignItems="center" justifyContent="center">
        <Stack mb="2.5" mt="1.5" direction={{
          base: "row",
          md: "row"
        }} space={2} mx={{
          base: "auto",
          md: "0"
        }}>
          <Button size='md' onPress={loadBts} isLoading={search}>{t('btns.search')}</Button>
          <Button size='md' onPress={cancelar}>{t('btns.cancelar')}</Button>
          <Button size='md' onPress={readDevice} isDisabled={!dev?.id}>{t('btns.read')}</Button>
        </Stack>
      </VStack>
      <SafeAreaView nestedScrollEnabled={true}>
        <Center mt="3" mb="4">
          <Heading fontSize="xl">Bluetooth</Heading>
        </Center>
        <FlatList data={list} renderItem={({ item }) =>
          <Box pl={['1', '1']} pr={['0', '5']} py='2'>
            <Pressable onPress={() => pushItem(item)} isDisabled={search} maxW='96' shadow='3' bg={dev?.id===item.id ? 'red.200' : 'coolGray.100'} p='1'>
              <HStack space={[2, 3]} justifyContent='space-between'>
                <VStack>
                  <Text color={item.id!=='5FE195BD-D95E-2DBC-9767-65F99FDD8262' ? 'green.500' : 'red.500'} bold>
                    {item.id}
                  </Text>
                  <Text color='coolGray.600' _dark={{
                    color: 'warmGray.200',
                  }}>
                    {item.localName}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        } keyExtractor={(item) => item.id} />
        <Center mt="3" mb="4">
          <Heading fontSize="xl">Services</Heading>
        </Center>
        <FlatList data={servicios} renderItem={({ item }) =>
          <Box pl={['1', '1']} pr={['0', '5']} py='2'>
            <Pressable onPress={() => (1)} isDisabled={search} maxW='96' shadow='3' bg={elm327ServiceUUID===item.uuid ? 'red.200' : 'coolGray.100'} p='1'>
              <HStack space={[2, 3]} justifyContent='space-between'>
                <VStack>
                  <Text _dark={{
                    color: 'warmGray.50',
                  }} color='coolGray.800' bold>
                    {item.id}
                  </Text>
                  <Text color={item.uuid!==elm327ServiceUUID ? 'coolGray.600' : 'red.500'}>
                    {item.uuid}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        } keyExtractor={(item) => item.uuid} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
