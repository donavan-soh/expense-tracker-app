import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function EditCategoryScreen({ navigation, route }) {

  // ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
  const getData = async () => {
    try {
      const existingColourListData = await AsyncStorage.getItem('colourList');
      const colourList = existingColourListData ? JSON.parse(existingColourListData) : [ 
        {id: "red", title: "Red"}, 
        {id: "orange", title: "Orange"}, 
        {id: "yellow", title: "Yellow"},
        {id: "green", title: "Green"},
        {id: "blue", title: "Blue"},
        {id: "purple", title: "Purple"},
        {id: "pink", title: "Pink"},
      ];
      
      // Set display colour list
      setColourList(colourList);
      // Display colour list
      console.log('Colour List:', colourList);
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('colourList', JSON.stringify(colourList));

      console.log('Colour list loaded successfully.');
    } 
    catch (error) {
      console.error('Error loading colour list:', error);
    }
  } 

  useEffect(() => {
    // Retrieve data from AsyncStorage on component mount
    getData();
  }, []); 

  const { categoryEdit } = route.params;
  const [editedCategoryName, setEditedCategoryName] = useState(categoryEdit.title);

  const editCategory = async () => {
    try {
      // Retrieve cateogry list and colour list from AsyncStorage
			const existingCategoryListData = await AsyncStorage.getItem('categoryList');
			const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];

      // Find id of category to edit
			const categoryIdToEdit = categoryList.findIndex(category => category.id === categoryEdit.id);

			// No category name entered
			if(editedCategoryName == "" || editedCategoryName == null) {
				Alert.alert(
					"Error",
					"Please enter a Category name",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else {
				if (categoryIdToEdit !== -1) {
					// Update the category name
					const editedCategoryTitle = editedCategoryName.trim();
					const editedCategoryId = editedCategoryTitle.toLowerCase();
					const categoryNameExists = categoryList.some(item => item.id === editedCategoryId);
          const editedCategoryColour = selectedColourIcon;

					// Check if category exists
					if (categoryNameExists) {
						Alert.alert(
							"Error",
							"An existing Category already has the same or similar name",
							[
								{
									text: "Ok"
								},
							]
						);
					} 
					else {
						categoryList[categoryIdToEdit].title = editedCategoryTitle;
						categoryList[categoryIdToEdit].id = editedCategoryId;
            categoryList[categoryIdToEdit].colour = editedCategoryColour;
						// Save updated category list back to AsyncStorage
						await AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
						// Category edited alert
						Alert.alert(
							"Category edited!",
							categoryEdit.title + " has been changed to " + editedCategoryName + " with " + editedCategoryColour + " colour code",
							[
								{
									text: "Ok"
								},
							]
						);
						// Navigate back to Add Main screen modal
						navigation.navigate("Add Main", {openCategoryModal: true});
					}
				}
			}
    } 
		catch (error) {
      console.error('Error editing group:', error);
    }
  };
  
	// ------------------------------------------------------- Colour select ------------------------------------------------------- //
  const [colourModalVisible, setColourModalVisible] = useState(false)
  const [colourList, setColourList] = useState([]);
  const [selectedColourIcon, setSelectedColourIcon] = useState(categoryEdit.colour)


  function colourTextButton(item) {
    setSelectedColourIcon(item.id);
    setColourModalVisible(false);
  };

  ColourName = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.colourSelectModalList, {borderColor: "lightgrey"}]} onPress={onPress}>
      <Text style={[styles.colourSelectModalListText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );

	// ------------------------------ Screen ------------------------------ //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}>
				{/* ------------------------------------------------------- Colour select and new category name ------------------------------------------------------- */}
				<View style={styles.colourSelectAndNewCategoryNameContainer}>
          {/* ------------------------------------------------------- Colour select ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.colourSelectButton, {borderColor: "lightgrey"}]}
            onPress={() => setColourModalVisible(true)}
          >
            <View style={[styles.colourSelectButtonIcon, {backgroundColor: selectedColourIcon}]} />
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={colourModalVisible}
          >
              <View style={[styles.colourSelectModalContainer, {backgroundColor: 'white',}]}>
                <View style={[styles.colourSelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
                  <Text style={[styles.colourSelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Colour</Text>
                </View>
                <View style={styles.colourSelectModalListContainer}>
                  <FlatList
                    data={colourList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <ColourName title={item.title} onPress={() => colourTextButton(item)} />
                    )}
                  />
                </View>
								<TouchableOpacity
									style={[styles.colourSelectModalBackButton, {backgroundColor: "#E5E4E2"}]} 
									onPress={() => setColourModalVisible(false)}
								>
									<Text style={[styles.colourSelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
								</TouchableOpacity>
              </View>
          </Modal>
					{/* ------------------------------------------------------- New category name ------------------------------------------------------- */}
					<View style={[styles.newCategoryNameContainer, {borderColor: "lightgrey"}]}>
						<TextInput
							// Description textInput style //
							clearButtonMode="while-editing"
							// Description textInput keyboard style //
							keyboardAppearance="light"
							inputMode="text" 
							enterKeyHint="done"
							// Description textInput text //
							placeholder="Enter Category name"
							defaultValue={editedCategoryName}
							onChangeText={editedCategoryName => setEditedCategoryName(editedCategoryName)}
							// Description textInput text style //
							style={{ color: "black", fontSize: 14, }}
							textAlign="center"
						/>
					</View>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => editCategory()}
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
	// ------------------------------------------------------- Colour select & new category name ------------------------------------------------------- //
  colourSelectAndNewCategoryNameContainer: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    borderRadius: 20, 
  },
  // ------------------------------------------------------- Colour select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  colourSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  colourSelectButtonIcon: {
    flex: 1,
    alignSelf: "center",
    width: deviceWidth * 0.05,
    marginVertical: deviceHeight * 0.0085,
    borderRadius: 100,
  },
  // ---------------- Modal ---------------- //
  colourSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 8,
  },
	// Header
  colourSelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  colourSelectModalHeaderText:{
    textAlign: "center",
  },
  // List
  colourSelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  colourSelectModalList: {
    backgroundColor: "transparent",
    paddingVertical: deviceHeight * 0.0223, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  colourSelectModalListText: {
    textAlign: "center",
  },
	// Back button
  colourSelectModalBackButton: {
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  colourSelectModalBackButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- New category name ------------------------------------------------------- //
  newCategoryNameContainer: {
		backgroundColor: "transparent",
		flex: 3,
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