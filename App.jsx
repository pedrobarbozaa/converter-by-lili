import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import forms from './src/utils/formObjects.js';
import DynamicForms from './src/components/DynamicForms.jsx';


const App = () => {
  const [fields, setFields] = useState([])

  const handleFormChange = (chosenForm) => {
    setFields([
      forms[chosenForm]
    ])
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ marginBottom: 10 }}>Selecione um tipo:</Text>

      <Picker
        onValueChange={(chosenForm) => handleFormChange(chosenForm)}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label='Raio' value= 'radius' />
        <Picker.Item label='Circunferência' value= 'circunference' />
        <Picker.Item label='Tamanho do tecido' value= 'clothSize' />
        <Picker.Item label='Gancho' value= 'hook' />
      </Picker>

      {fields !== '' && (
        <View style={{ marginTop: 20 }}>
          <DynamicForms fields={fields} />
        </View>
      )}
    </View>
  );
};

export default App;
