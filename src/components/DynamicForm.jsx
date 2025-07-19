import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

const DynamicForm = ({ fields = [], onSubmit }) => {
  const [values, setValues] = useState({});

  const handleChange = (name, value) => {
    setFormData({ [name]: value });
  };

  const renderForm = (field) => (
    <View key={field.name} style={{ marginBottom: 12 }}>
      <Text>{field.label}</Text>
      <TextInput
        keyboardType="numeric"
        placeholder={field.label}
        value={values[field.name]?.toString() || ''}
        onChangeText={(text) => handleChange(field.name, text)}
      />
    </View>
  );

  return (
    <ScrollView>
      {renderForm}
    </ScrollView>
  );
};

export default DynamicForm;
