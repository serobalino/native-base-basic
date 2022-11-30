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
  useToast, ScrollView, Stack, View,
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView } from 'react-native';
import { conectTo, isConected, read, startScanner, stopScanner } from './plugins/bt';

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

  const errorBt = (a) => {
    console.error(a)
  }

  const readDevice = () => {
    if(dev.id){
      dev.discoverAllServicesAndCharacteristics().then(a=>{
        console.log('all',JSON.stringify(a,null,2))
      }).catch((e)=>{
        console.log(e)
      })
    }else {
      console.log("Error no existe device")
    }
  }

  const cancelar = () => {
    setSearch(false);
    stopScanner();
  };

  useEffect(()=>{
    //
  },[])

  const pushService = (service) =>{
    console.log('touch servicio:',service.uuid);
    setService(service);
    setCarasteristicas([]);
    dev.characteristicsForService(service.uuid).then(a=>{
      console.log('caracteristicas de ',service.uuid,a.length);
      setCarasteristicas(a);
    }).catch((e)=>{
      console.log('error caracteristicas de ',service.uuid,e);
    })
  }

  const pushItem = (item) => {
    console.log('touch:',item.id);
    conectTo(item).then(a=>{
      setDev(item);
      setServicios([]);
      console.log('exito en touch');
      item.services().then((a)=>{
        setServicios(a);
        console.log('servicios de ',item.id, a.length);
      }).catch((b)=>{
        console.log('error servicios de ',item.id, b);
      })
    }).catch(e=>{
      console.log('error en touch',e);
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
      <ScrollView nestedScrollEnabled={true}>
        <Center mt="3" mb="4">
          <Heading fontSize="xl">Bluetooth</Heading>
        </Center>
        <FlatList data={list} renderItem={({ item }) =>
          <Box pl={['1', '1']} pr={['0', '5']} py='2'>
            <Pressable onPress={() => pushItem(item)} isDisabled={search} maxW='96' shadow='3' bg={dev?.id===item.id ? 'red.200' : 'coolGray.100'} p='1'>
              <HStack space={[2, 3]} justifyContent='space-between'>
                <VStack>
                  <Text _dark={{
                    color: 'warmGray.50',
                  }} color='coolGray.800' bold>
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
            <Pressable onPress={() => pushService(item)} isDisabled={search} maxW='96' shadow='3' bg={service?.uuid===item.uuid ? 'red.200' : 'coolGray.100'} p='1'>
              <HStack space={[2, 3]} justifyContent='space-between'>
                <VStack>
                  <Text _dark={{
                    color: 'warmGray.50',
                  }} color='coolGray.800' bold>
                    {item.id}
                  </Text>
                  <Text color='coolGray.600' _dark={{
                    color: 'warmGray.200',
                  }}>
                    {item.uuid}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        } keyExtractor={(item) => item.uuid} />
        <Center mt="3" mb="4">
          <Heading fontSize="xl">Characteristics</Heading>
        </Center>
        <FlatList data={caracteristicas} renderItem={({ item }) =>
          <Box pl={['1', '1']} pr={['0', '5']} py='2'>
            <Pressable onPress={null} isDisabled={search} maxW='96' shadow='3' bg='coolGray.100' p='1'>
              <HStack space={[2, 3]} justifyContent='space-between'>
                <VStack>
                  <Text _dark={{
                    color: 'warmGray.50',
                  }} color='coolGray.800' bold>
                    {item.id}
                  </Text>
                  <Text color='coolGray.600' _dark={{
                    color: 'warmGray.200',
                  }}>
                    {item.uuid}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        } keyExtractor={(item) => item.id} />
      </ScrollView>
      <Box py={20}></Box>
    </SafeAreaView>
  );
}
