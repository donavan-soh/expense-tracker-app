import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddGroupScreen({ navigation, route }) {

	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
	const addNewGroup = async (newGroupName) => {
		try {
			// Retrieve group list from AsyncStorage
			const existingGroupListData = await AsyncStorage.getItem('groupList');
			const groupList = existingGroupListData ? JSON.parse(existingGroupListData) : [];

			// No group name entered
			if(newGroupName == "" || newGroupName == null) {
				Alert.alert(
					"Error",
					"Please enter a Group name",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else{
				const newGroupTitle = newGroupName.trim();
				const newGroupId = newGroupTitle.toLowerCase();
				const groupNameExists = groupList.some(item => item.id === newGroupId);

				// Check if group exists
				if (groupNameExists) {
					Alert.alert(
						"Error",
						"An existing Group already has the same or similar name",
						[
							{
								text: "Ok"
							},
						]
					);
				} 
				// New group added
				else {
					const newGroupData = {id: newGroupId, title: newGroupTitle};
					// Add new group to array
					groupList.push(newGroupData);

					// Save the updated array back to AsyncStorage
					await AsyncStorage.setItem('groupList', JSON.stringify(groupList));
					// Reset input field
					setNewGroupName();
					// Navigate back to Add Main screen
					navigation.navigate("Add Main", {openGroupModal: true});
					// New group added alert
					Alert.alert(
						"New Group added!",
						newGroupTitle + " has been added to Group",
						[
							{
								text: "Ok"
							},
						]
					);
				}
			}
	
			console.log('New group added successfully.');
		} 
		catch (error) {
			console.error('Error adding new group:', error);
		}
	};

	// ------------------------------------------------------- New group name ------------------------------------------------------- //
	const [newGroupName, setNewGroupName] = useState();

	// ------------------------------ Screen ------------------------------ //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
				{/* ------------------------------------------------------- New group name ------------------------------------------------------- */}
				<View style={[styles.newGroupNameContainer, {borderColor: "lightgrey"}]}>
					<TextInput
						// Description textInput style //
						clearButtonMode="while-editing"
						// Description textInput keyboard style //
						keyboardAppearance="light"
						inputMode="text" 
						enterKeyHint="done"
						// Description textInput text //
						placeholder="Enter Group name"
						defaultValue={newGroupName}
						onChangeText={newGroupName => setNewGroupName(newGroupName)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => addNewGroup(newGroupName)}
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
  // ------------------------------------------------------- New group name ------------------------------------------------------- //
  newGroupNameContainer: {
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