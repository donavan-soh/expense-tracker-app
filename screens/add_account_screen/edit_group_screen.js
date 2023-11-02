import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function EditGroupScreen({ navigation, route }) {

	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
	const { groupEdit } = route.params;
	const [editedGroupName, setEditedGroupName] = useState(groupEdit.title);

  const editGroup = async () => {
    try {
      // Retrieve group list from AsyncStorage
			const existingGroupListData = await AsyncStorage.getItem('groupList');
			const groupList = existingGroupListData ? JSON.parse(existingGroupListData) : [];

      // Find id of group to edit
			const groupIdToEdit = groupList.findIndex(group => group.id === groupEdit.id);

			// No group name entered
			if(editedGroupName == "" || editedGroupName == null) {
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
			else {
				if (groupIdToEdit !== -1) {
					// Update the group name
					const editedGroupTitle = editedGroupName.trim();
					const editedGroupId = editedGroupTitle.toLowerCase();
					const groupNameExists = groupList.some(item => item.id === editedGroupId);

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
					else {
						groupList[groupIdToEdit].title = editedGroupTitle;
						groupList[groupIdToEdit].id = editedGroupId;
						// Save updated group list back to AsyncStorage
						await AsyncStorage.setItem('groupList', JSON.stringify(groupList));
						// Group edited alert
						Alert.alert(
							"Group edited!",
							groupEdit.title + " has been changed to " + editedGroupName,
							[
								{
									text: "Ok"
								},
							]
						);
						// Navigate back to Add Main screen modal
						navigation.navigate("Add Main", {openGroupModal: true});
					}
				}
			}
    } 
		catch (error) {
      console.error('Error editing group:', error);
    }
  };

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
						defaultValue={editedGroupName}
						onChangeText={editedGroupName => setEditedGroupName(editedGroupName)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => editGroup()}
          >
            <Text style={[styles.addButtonText, {color: "black", fontSize: 14}]}>Edit</Text>
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