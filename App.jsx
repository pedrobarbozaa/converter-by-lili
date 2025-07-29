"use client"

import { useState, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { useFonts, Delius_400Regular } from "@expo-google-fonts/delius"
import forms from "./src/utils/formObjects.js"
import getMultiplier from "./src/utils/getMultiplier.js"

const App = () => {
  const [fields, setFields] = useState([])
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [selectedFormType, setSelectedFormType] = useState("")

  const [fontsLoaded] = useFonts({
    Delius_400Regular,
  })

  const handleChange = useCallback((input, name) => {
    setFormData((prev) => ({ ...prev, input, name }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!formData.input || !formData.name) {
      Alert.alert("Erro", "Por favor, preencha o campo")
      return
    }

    const num = Number.parseFloat(formData.input)
    if (isNaN(num) || num <= 0) {
      Alert.alert("Erro", "Por favor, insira um número válido maior que zero")
      return
    }

    setIsCalculating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const multi = getMultiplier(formData.name)

      if (!multi) {
        throw new Error("Multiplicador não encontrado")
      }

      const baseResult = num * multi

      if (selectedFormType === "hook") {
        setResult({
          type: "hook",
          frente: baseResult.toFixed(1),
          tras: (baseResult * 2).toFixed(1),
        })
      } else {
        setResult({
          type: "single",
          value: baseResult.toFixed(1),
        })
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro no cálculo. Tente novamente.")
      console.error("Erro no cálculo:", error)
    } finally {
      setIsCalculating(false)
    }
  }, [formData.input, formData.name, selectedFormType])

  const handleFormChange = useCallback((chosenForm) => {
    setSelectedFormType(chosenForm)
    if (chosenForm && forms[chosenForm]) {
      setFields([forms[chosenForm]])
      setResult(null)
      setFormData({})
    } else {
      setFields([])
      setResult(null)
      setFormData({})
    }
  }, [])

  const renderForm = useCallback(
    (fields) =>
      fields.map((field) => (
        <View key={field.name} style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { fontFamily: "Delius_400Regular" }]}>
            Digite a medida de: {field.label} (cm)
          </Text>
          <TextInput
            style={[styles.textInput, { fontFamily: "Delius_400Regular" }]}
            keyboardType={field.kbType}
            placeholder={field.label}
            placeholderTextColor="#8B7355"
            value={formData.input || ""}
            onChangeText={(input) => handleChange(input, field.name)}
            accessibilityLabel={`Campo para ${field.label}`}
            accessibilityHint="Digite o valor da medida"
          />
        </View>
      )),
    [fields, formData.input, handleChange],
  )

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a373" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: "Delius_400Regular" }]}>Calculadora de medidas</Text>
          <Text style={[styles.subtitle, { fontFamily: "Delius_400Regular" }]}>da Ligia</Text>
        </View>

        <View style={styles.cabinetFrame}>
          <View style={styles.cabinetInner}>
            {/* Form Picker */}
            <Text style={[styles.sectionTitle, { fontFamily: "Delius_400Regular" }]}>De qual medida você precisa?</Text>

            <View style={styles.pickerContainer}>
              <Picker
                style={[styles.picker, { fontFamily: "Delius_400Regular" }]}
                onValueChange={handleFormChange}
                accessibilityLabel="Selecionar tipo de medida"
              >
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="Raio" value="radius" />
                <Picker.Item label="Cintura" value="circunference" />
                <Picker.Item label="Tamanho do tecido para pregas" value="clothSize" />
                <Picker.Item label="Gancho" value="hook" />
              </Picker>
            </View>

            {/* Form Section */}
            {fields.length > 0 && (
              <View style={styles.formSection}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  bounces={false}
                >
                  {renderForm(fields)}

                  <TouchableOpacity
                    style={[styles.calculateButton, isCalculating && styles.calculateButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isCalculating}
                    accessibilityLabel="Calcular resultado"
                    accessibilityHint="Toque para calcular a medida"
                  >
                    <Text style={[styles.calculateButtonText, { fontFamily: "Delius_400Regular" }]}>
                      {isCalculating ? "⏳ Calculando..." : "✂ Calcular"}
                    </Text>
                  </TouchableOpacity>

                  {/* Result Display */}
                  {result && (
                    <View style={styles.resultContainer}>
                      {result.type === "hook" ? (
                        <>
                          <Text style={[styles.resultLabel, { fontFamily: "Delius_400Regular" }]}>
                            Seus resultados:
                          </Text>

                          <View style={styles.hookResultsContainer}>
                            <View style={styles.hookResultItem}>
                              <Text style={[styles.hookResultLabel, { fontFamily: "Delius_400Regular" }]}>Frente:</Text>
                              <View style={styles.hookResultValueContainer}>
                                <Text style={[styles.hookResultValue, { fontFamily: "Delius_400Regular" }]}>
                                  {result.frente}
                                </Text>
                                <Text style={[styles.hookResultUnit, { fontFamily: "Delius_400Regular" }]}>
                                  {" cm"}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.hookResultDivider} />

                            <View style={styles.hookResultItem}>
                              <Text style={[styles.hookResultLabel, { fontFamily: "Delius_400Regular" }]}>Trás:</Text>
                              <View style={styles.hookResultValueContainer}>
                                <Text style={[styles.hookResultValue, { fontFamily: "Delius_400Regular" }]}>
                                  {result.tras}
                                </Text>
                                <Text style={[styles.hookResultUnit, { fontFamily: "Delius_400Regular" }]}>
                                  {" cm"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={[styles.resultLabel, { fontFamily: "Delius_400Regular" }]}>Seu resultado:</Text>
                          <Text style={[styles.resultValue, { fontFamily: "Delius_400Regular" }]}>
                            {result.value} cm
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ccd5ae",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#ccd5ae",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#8B7355",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#e9edc9",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#d4a373",
    shadowColor: "#d4a373",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: "#8B7355",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#A0826D",
    // fontStyle: "italic",
    textAlign: "center",
  },
  cabinetFrame: {
    flex: 1,
    backgroundColor: "#d4a373",
    borderRadius: 25,
    padding: 12,
    shadowColor: "#8B7355",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  cabinetInner: {
    flex: 1,
    backgroundColor: "#fefae0",
    borderRadius: 18,
    padding: 25,
    borderWidth: 2,
    borderColor: "#faedcd",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#8B7355",
    marginBottom: 18,
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: "#faedcd",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#d4a373",
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#d4a373",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  picker: {
    height: 55,
    color: "#8B7355",
  },
  formSection: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: "#e9edc9",
    borderRadius: 15,
    padding: 18,
    borderWidth: 2,
    borderColor: "#ccd5ae",
    shadowColor: "#d4a373",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#8B7355",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#fefae0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#faedcd",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#8B7355",
  },
  calculateButton: {
    backgroundColor: "#d4a373",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 35,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#A0826D",
    shadowColor: "#8B7355",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonDisabled: {
    opacity: 0.6,
  },
  calculateButtonText: {
    fontSize: 19,
    fontWeight: "400",
    color: "#fefae0",
  },
  resultContainer: {
    backgroundColor: "#faedcd",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#d4a373",
    shadowColor: "#d4a373",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: "400",
    color: "#8B7355",
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: "400",
    color: "#d4a373",
  },
  hookResultsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hookResultItem: {
    flex: 1,
    alignItems: "center",
  },
  hookResultDivider: {
    width: 2,
    height: 60,
    backgroundColor: "#d4a373",
    marginHorizontal: 15,
    borderRadius: 1,
  },
  hookResultLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#8B7355",
    marginBottom: 8,
  },
  hookResultValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  hookResultValue: {
    fontSize: 28,
    fontWeight: "400",
    color: "#d4a373",
  },
  hookResultUnit: {
    fontSize: 18,
    fontWeight: "400",
    color: "#d4a373",
  },
})

export default App
