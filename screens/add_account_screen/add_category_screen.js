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
export function AddCategoryScreen({ navigation }) {

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
      
	const addNewGroup = async (newCategoryName, selectedColourText) => {
		try {
			// Retrieve category list AsyncStorage
			const existingCategoryListData = await AsyncStorage.getItem('categoryList');
			const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];

			//No colour selected and no category name entered
      if(selectedColourText == null && (newCategoryName == "" || newCategoryName == null)) {
        Alert.alert(
          "Error",
          "Please select a Colour and enter a Category name",
          [
            {
              text: "Ok"
            },
          ]
        );
        return
      }
      // No colour selected
      if(selectedColourText == null) {
        Alert.alert(
          "Error",
          "Please select a Colour",
          [
            {
              text: "Ok"
            },
          ]
        );
        return
      }
      // No category name entered
      if(newCategoryName == "" || newCategoryName == null) {
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
			else{
        const newCategoryTitle = newCategoryName.trim();
        const newCategoryId = newCategoryTitle.toLowerCase();
        const categoryNameExists = categoryList.some(item => item.id === newCategoryId);
        const newCategoryColour = selectedColourText.toLowerCase();
  
        // Check if category exists
        if (categoryNameExists) {
          Alert.alert(
            "Error",
            "An existing Category has the same or similar name",
            [
              {
                text: "Ok"
              },
            ]
          );
        } 
        // New Category added
        else {
          const newCategoryData = {id: newCategoryId, title: newCategoryTitle, colour: newCategoryColour};
          
          // Add new category to array
          categoryList.push(newCategoryData);
          // Save the updated array back to AsyncStorage
          await AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
          // Reset input field
          setNewCategoryName();
          // Navigate back to Add Main screen
          navigation.navigate("Add Main", {openCategoryModal: true});
          // New category added alert
          Alert.alert(
            "New Category added!",
            newCategoryTitle + " has been added to Category with " + newCategoryColour + " colour code",
            [
              {
                text: "Ok"
              },
            ]
          );
        }
      }
  
      console.log('New category added successfully.');
    } 
    catch (error) {
      console.error('Error adding new category:', error);
    }
  };
  
	// ------------------------------------------------------- Colour select ------------------------------------------------------- //
  const [colourModalVisible, setColourModalVisible] = useState(false)
  const [colourList, setColourList] = useState([]);
  const [selectedColourIcon, setSelectedColourIcon] = useState()
  const [selectedColourText, setSelectedColourText] = useState()


  function colourTextButton(item) {
    setSelectedColourIcon(item.id);
    setSelectedColourText(item.title);
    setColourModalVisible(false);
  };

  ColourName = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.colourSelectModalList, {borderColor: "lightgrey"}]} onPress={onPress}>
      <Text style={[styles.colourSelectModalListText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );

	// ------------------------------------------------------- New category name ------------------------------------------------------- //
	const [newCategoryName, setNewCategoryName] = useState();

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
            {selectedColourText == null && (
              <Icon name="paint-bucket" type="foundation" size={22} color="black" />
            )}
            {selectedColourText != null && (
              <View style={[styles.colourSelectButtonIcon, {backgroundColor: selectedColourIcon}]} />
            )}
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
							defaultValue={newCategoryName}
							onChangeText={newCategoryName => setNewCategoryName(newCategoryName)}
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
            onPress={() => addNewGroup(newCategoryName, selectedColourText)}
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