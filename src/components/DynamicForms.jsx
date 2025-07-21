import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import getMultiplier from '../utils/getMultiplier';

const DynamicForms = ({ fields }) => {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null)

  const handleChange = (input, name) => {
    setFormData( {input: input, name: name} );
  };

  const handleSubmit = () => {
    const multi = getMultiplier(formData.name)

    const num = parseFloat(formData.input);

    setResult((num * multi).toFixed(2));    
  }

  //Tem um bug acontecendo quando uso a mesma medida para duas opçoes diferentes de formulário. A atualização só está acontecendo na mudança dos números.

  const renderForm = (fields) => ( //Lembrar que se houverem casos com mais de um campo, o multiplier precisa de ajustes
    fields.map((field) => (
      <View key={field.name} style={{ marginBottom: 12 }}>
        <Text>Digite a medida de: {field.label}</Text>
        <TextInput
          keyboardType={field.kbType}
          placeholder={field.label}
          value={formData.input}
          onChangeText={(input) => handleChange(input, field.name)} 
        />
      </View>
    ))
  );

  return (
    <ScrollView>
      {renderForm(fields)}
      <Button title="Calcular" onPress={handleSubmit} />
      <Text style={{fontSize: 50}} >{result} cm</Text>
    </ScrollView>
  );
};

export default DynamicForms;

