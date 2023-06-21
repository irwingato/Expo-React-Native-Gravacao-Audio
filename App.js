import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [gravando, setGravacao] = React.useState(null);
  const [resultado, setResultado] = React.useState(null);

  async function iniciarGravacao() {
    try {
      console.log('Solicitando permissões..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Iniciando gravação..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setGravacao(recording);
      console.log('Gravação iniciada');
    } catch (erro) {
      console.error('Falha ao iniciar a gravação', erro);
    }
  }

  async function pararGravacao() {
    if (!gravando) {
      return;
    }

    try {
      await gravando.stopAndUnloadAsync();
      const uri = gravando.getURI();
      setResultado({ uri });
      console.log('Gravação parada, URI:', uri);
    } catch (erro) {
      console.log('Falha ao parar a gravação:', erro);
    }
  }

  async function reproduzirGravacao() {
    if (!resultado || !resultado.uri) {
      console.log('Nenhuma gravação para reproduzir');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: resultado.uri });
      await sound.playAsync();
      console.log('Reproduzindo gravação');
    } catch (erro) {
      console.log('Falha ao reproduzir a gravação:', erro);
    }
  }

  async function escolherGravacao() {
    let resultadoTemp = await DocumentPicker.getDocumentAsync({});
    setResultado(resultadoTemp);
    console.log(resultadoTemp);
  }

  return (
    <View style={styles.container}>
      <Button title='Iniciar Gravação' onPress={iniciarGravacao} />
      <Button title='Parar Gravação' onPress={pararGravacao} color='red' />
      <Button title='Reproduzir Gravação' onPress={reproduzirGravacao} color='green' />
      <Button title='Escolher Gravação' onPress={escolherGravacao} color='blue' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
