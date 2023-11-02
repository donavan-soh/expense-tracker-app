import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddCurrencyScreen({ navigation, route }) {

	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
	const addNewCurrency = async (newCurrency) => {
		try {
			// Retrieve group list from AsyncStorage
			const existingCurrencyListData = await AsyncStorage.getItem('currencyList');
			const currencyList = existingCurrencyListData ? JSON.parse(existingCurrencyListData) : [];

			// No group name entered
			if(newCurrency == "" || newCurrency == null) {
				Alert.alert(
					"Error",
					"Please enter a Currency",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else{
				const newCurrencyTrimmed = newCurrency.trim()
				const newCurrencyTitle = newCurrencyTrimmed.toUpperCase();
				const newCurrencyId = newCurrencyTitle.toLowerCase();
				const currencyExists = currencyList.some(item => item.id === newCurrencyId);
				
				// Check if currency exists
				if (currencyExists) {
					Alert.alert(
						"Error",
						newCurrencyTitle + " already exists",
						[
							{
								text: "Ok"
							},
						]
					);
				}
				// New currency added
				else {
					const newCurrencyData = {id: newCurrencyId, title: newCurrencyTitle};
					// Add new currency to array
					currencyList.push(newCurrencyData);

					// Save the updated array back to AsyncStorage
					await AsyncStorage.setItem('currencyList', JSON.stringify(currencyList));
					// Reset input field
					setNewCurrency();
					// Navigate back to Add Main screen
					navigation.navigate("Add Main", {openCurrencyModal: true});
					// New currency added alert
					Alert.alert(
						"New Currency added!",
						newCurrencyTitle + " has been added to Currency",
						[
							{
								text: "Ok"
							},
						]
					);
				}
			}
	
			console.log('Currency added successfully.');
		} 
		catch (error) {
			console.error('Error adding currency:', error);
		}
	};

	// ------------------------------------------------------- New currency ------------------------------------------------------- //
	const [newCurrency, setNewCurrency] = useState();

	// ------------------------------ Screen ------------------------------ //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
				{/* ------------------------------------------------------- New group name ------------------------------------------------------- */}
				<View style={[styles.newCurrencyContainer, {borderColor: "lightgrey"}]}>
					<TextInput
						// Description textInput style //
						clearButtonMode="while-editing"
            maxLength={3}
						// Description textInput keyboard style //
						keyboardAppearance="light"
						inputMode="text" 
						enterKeyHint="done"
						// Description textInput text //
						placeholder="Enter Currency"
						defaultValue={newCurrency}
						onChangeText={newCurrency => setNewCurrency(newCurrency)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => addNewCurrency(newCurrency)}
          >
            <Text style={[styles.addButtonText, {color: "black", fontSize: 14}]}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ------------------------------------------------------- Main container ------------------------------------------------------- //
	mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // ------------------------------------------------------- Details container ------------------------------------------------------- //
  detailsContainer: {
    flexDirection: "column",
    height: deviceHeight * 0.10,
    width: deviceWidth * 0.65,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // ------------------------------------------------------- New currency ------------------------------------------------------- //
  newCurrencyContainer: {
		backgroundColor: "transparent",
		flex: 1,
		justifyContent: 'center',
		borderRadius: 20,
		borderBottomWidth: 1,
	},
	// ------------------------------------------------------- Add button ------------------------------------------------------- //
	addButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  addButton: {
		flex: 1,
    justifyContent: "center",
		borderRadius: 5,
		marginVertical: deviceHeight * 0.005,
    marginHorizontal: deviceWidth * 0.034,
  },
  addButtonText: {
    textAlign: "center",
  },
});