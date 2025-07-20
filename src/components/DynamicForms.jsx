import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

const DynamicForms = ({ fields }) => {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null)

  const handleChange = (input, type) => {
    setFormData( {input: input, type: type} );
  };

  const getMultiplier = (formType) => { //Abstrair
    switch (formType) {
      case 'Circunferência':
        return 2*Math.PI;
      case 'Raio':
        return 1/(2*Math.PI);
      case 'Tamanho do tecido': 
        return 3;
      case 'Gancho':
        return 1/16;
      default:
        return 1;
    }
  };

  const handleSubmit = () => {
    const multi = getMultiplier(formData.type)

    const num = parseFloat(formData.input);

    setResult((num * multi).toFixed(2));    
  }

  //Tem um bug acontecendo quando uso a mesma medida para duas opçoes diferentes de formulário. A atualização só está acontecendo na mudança dos números.

  const renderForm = (fields) => (
    fields.map((field) => (
      <View key={field.name} style={{ marginBottom: 12 }}>
        <Text>Digite a medida de: {field.label}</Text>
        <TextInput
          keyboardType="numeric"
          placeholder={field.label}
          value={formData.input}
          onChangeText={(input) => handleChange(input, field.key)} 
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

