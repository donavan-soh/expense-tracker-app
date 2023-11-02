import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Icon } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddMainScreen({ navigation, route }) {

  // ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
  const getData = async () => {
    try {
      // Retrieve data from AsyncStorage
      const existingGroupListData = await AsyncStorage.getItem('groupList');
      const existingCurrencyListData = await AsyncStorage.getItem('currencyList');
      const existingCategoryListData = await AsyncStorage.getItem('categoryList');
      const existingColourListData = await AsyncStorage.getItem('colourList');

      // ------------------------------------------------------- Group List ------------------------------------------------------- //
      const groupList = existingGroupListData ? JSON.parse(existingGroupListData) : [];

      // Set display group list
      setGroupList(groupList);
      // Display group list
      console.log('Group List:', groupList);
      // ------------------------------------------------------- Currency List ------------------------------------------------------- //
      const currencyList = existingCurrencyListData ? JSON.parse(existingCurrencyListData) : [
        {id: "usd", title: "USD"}, 
        {id: "sgd", title: "SGD"}, 
        {id: "gbp", title: "GBP"}, 
      ];
       
      // Set display currency list
      setCurrencyList(currencyList);
      // Save updated array back to AsyncStorage
      await AsyncStorage.setItem('currencyList', JSON.stringify(currencyList)); 
      // Display currency list
      console.log('Currency List:', currencyList);
      // ------------------------------------------------------- Category List ------------------------------------------------------- //
      const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];

      // Set display group list
      setCategoryList(categoryList);
      // Display group list
      console.log('Category List:', categoryList); 
      // ------------------------------------------------------- Colour List  ------------------------------------------------------- //
      const colourList = existingColourListData ? JSON.parse(existingColourListData) : [ 
        {id: "red", title: "Red"}, 
        {id: "orange", title: "Orange"}, 
        {id: "yellow", title: "Yellow"},
        {id: "green", title: "Green"},
        {id: "blue", title: "Blue"},
        {id: "purple", title: "Purple"},
        {id: "pink", title: "Pink"},
      ];
      
      // Save updated array back to AsyncStorage
      await AsyncStorage.setItem('colourList', JSON.stringify(colourList)); 
    } 
    catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
  // Retrieve data from AsyncStorage on component mount
    getData();
  }, []);

  // ------------------------------------------------------- Refresh screen ------------------------------------------------------- //
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Automatically refresh data when the screen is focused
      getData();
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Retrieve data from AsyncStorage on component mount
    getData();
    // Check if we should open the modal
    if (route.params && route.params.openGroupModal) {
      setGroupModalVisible(true);
    }
    if (route.params && route.params.openCurrencyModal) {
      setCurrencyModalVisible(true);
    }
    if (route.params && route.params.openCategoryModal) {
      setCategoryModalVisible(true);
    }
  }, [navigation, route]);

  // ------------------------------------------------------- Add new account ------------------------------------------------------- //
  const addNewAccount = async () => {
		try {
      // Retrieve data from AsyncStorage
      const existingAccountData = await AsyncStorage.getItem('accountList');
      const accountList = existingAccountData ? JSON.parse(existingAccountData) : [];

      // No group name entered----------------------------------------------------------------------------------------------------------------------------------------------------------
			if(
        (selectedGroupText == "" || selectedGroupText == null) ||
        (useDescription == "" || useDescription == null) ||
        (selectedCategoryText == "" || selectedCategoryText == null) ||
        (useType == null) ||
        (selectedCurrencyText == null) ||
        (useAmount == null)
      ) {
				Alert.alert(
					"Error",
					"Please fill in all the fields",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else {
        const newAccountId = new Date().getTime() * Math.floor(Math.random() * 10000);
        const newAccountGroup = selectedGroupText;
        const newAccountDate = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
        const newAccountDescription = useDescription;
        const newAccountCategory = selectedCategoryText;
        const newAccountCategoryColour = selectedCategoryColour;
        const newAccountType = useType;
        const newAccountCurrency = selectedCurrencyText;
        const newAccountAmount = parseFloat(useAmount).toFixed(2);

        const newAccountData = {
          id: newAccountId,
          group: newAccountGroup,
          date: newAccountDate,
          description: newAccountDescription,
          category: newAccountCategory,
          colour: newAccountCategoryColour,
          type: newAccountType,
          currency: newAccountCurrency,
          amount: newAccountAmount
        };

        // Add new account to array
        accountList.push(newAccountData);
        // Save updated array back to AsyncStorage
        await AsyncStorage.setItem('accountList', JSON.stringify(accountList));
        // Reset input fields
        setSelectedGroupText();
        setDate(new Date);
        setDescription();
        setSelectedCategoryText("General");
        setType();
        setIncomeButtonColour("transparent");
        setExpenseButtonColour("transparent");
        setSelectedCurrencyText();
        setAmount();
        // Navigate to Home 
        navigation.navigate("Home");
      }
		} 
		catch(error) {
			console.error('Error adding new group:', error);
		}
  };
    	
	// ------------------------------------------------------- Group select ------------------------------------------------------- //
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [groupList, setGroupList] = useState([]);
  const [selectedGroupText, setSelectedGroupText] = useState()

  function groupSelectModalListContent(item) {
    setSelectedGroupText(item.title);
    setGroupModalVisible(false);
  };

  function groupSelectModalEditButton(item) {
    setGroupModalVisible(false);
    navigation.navigate("Edit Group", {groupEdit: item});
  };

  function groupSelectModalDeleteButton(item) {
    try {
      // Retrieve group list from AsyncStorage
      AsyncStorage.getItem('groupList', (error, result) => {
        if (!error) {
          const groupList = JSON.parse(result);
  
          // Find id of group to delete
          const groupIdToDelete = groupList.findIndex(group => group.id === item.id);
  
          if (groupIdToDelete !== -1) {
            // Remove group from group list
            groupList.splice(groupIdToDelete, 1);
            // Update state
            setGroupList(groupList); 
            // Clear selected group text
            setSelectedGroupText(); 
            // Save updated group list back to AsyncStorage
            AsyncStorage.setItem('groupList', JSON.stringify(groupList));
          }
        } 
        else {
          console.error('Error retrieving group list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting group:', error);
    }
  };
  
  function groupAddNewButton() {
    setGroupModalVisible(false);
    navigation.navigate("Add Group");
  };

  GroupName = ({ title, onPressList, onPressEditButton, onPressDeleteButton }) => (
    <View style={[styles.groupSelectModalList, {borderColor: "lightgrey"}]}>
      <TouchableOpacity style={[styles.groupSelectModalListContent, {borderColor: "lightgrey"}]} onPress={onPressList}>
        <Text style={[styles.groupSelectModalListContentText, {color: "black", fontSize: 14}]}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.groupSelectModalEditButton, {borderColor: "lightgrey"}]} onPress={onPressEditButton}>
        <Icon name="edit" type="antdesign" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.groupSelectModalDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [date, setDate] = useState(new Date());

  function onChange(event, selectedDate) {
    setDate(selectedDate);
  };
  // ------------------------------------------------------- Type select ------------------------------------------------------- //
  const [useType, setType] = useState();
  const [incomeButtonColour, setIncomeButtonColour] = useState("transparent");
  const [expenseButtonColour, setExpenseButtonColour] = useState("transparent");

  function incomeButtonPressed() {
    setType("+");
    setIncomeButtonColour("#E5E4E2");
    setExpenseButtonColour("transparent");
  }

  function expenseButtonPressed() {
    setType("-");
    setExpenseButtonColour("#E5E4E2");
    setIncomeButtonColour("transparent");
  }
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryText, setSelectedCategoryText] = useState("General")
  const [selectedCategoryColour, setSelectedCategoryColour] = useState()

  function categorySelectModalListContent(item) {
    setSelectedCategoryText(item.title);
    setSelectedCategoryColour(item.colour);
    setCategoryModalVisible(false);
  };

  function categorySelectModalEditButton(item) {
    setCategoryModalVisible(false);
    navigation.navigate("Edit Category", {categoryEdit: item});
  };

  function categorySelectModalDeleteButton(item) {
    try {
      // Retrieve category list from AsyncStorage
      AsyncStorage.getItem('categoryList', (error, result) => {
        if (!error) {
          const categoryList = JSON.parse(result);
  
          // Find id of category to delete
          const categoryIdToDelete = categoryList.findIndex(category => category.id === item.id);
  
          if (categoryIdToDelete !== -1) {
            // Remove category from group list
            categoryList.splice(categoryIdToDelete, 1);
            // Update state
            setCategoryList(categoryList); 
            // Clear selected category text
            setSelectedCategoryText("General"); 
            // Save updated category list back to AsyncStorage
            AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
          }
        } 
        else {
          console.error('Error retrieving group list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  function categoryAddNewButton() {
    setCategoryModalVisible(false);
    navigation.navigate("Add Category");
  };

  CategoryName = ({ title, colour, onPressList, onPressEditButton, onPressDeleteButton }) => (
    <View style={[styles.categorySelectModalList, {borderColor: "lightgrey"}]}>
      <View style={[styles.categorySelectModalListContentColourContainer, {borderColor: "lightgrey"}]}>
        <View style={[styles.categorySelectModalListContentColour, {backgroundColor: colour}]} />
      </View>
      <TouchableOpacity style={[styles.categorySelectModalListContent, {borderColor: "lightgrey"}]} onPress={onPressList}>
        <Text style={[styles.categorySelectModalListContentText, {color: "black", fontSize: 14}]}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.categorySelectModalEditButton, {borderColor: "lightgrey"}]} onPress={onPressEditButton}>
        <Icon name="edit" type="antdesign" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.categorySelectModalDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  // ------------------------------------------------------- Description ------------------------------------------------------- //
	const [useDescription, setDescription] = useState();
  // ------------------------------------------------------- Currency select ------------------------------------------------------- //
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false)
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrencyText, setSelectedCurrencyText] = useState()

  function currencySelectModalListContent(item) {
    setSelectedCurrencyText(item.title);
    setCurrencyModalVisible(false);
  };

  function currencySelectModalDeleteButton(item) {
    try {
      // Retrieve currency list from AsyncStorage
      AsyncStorage.getItem('currencyList', (error, result) => {
        if (!error) {
          const currencyList = JSON.parse(result);
  
          // Find id of currency to delete
          const currencyIdToDelete = currencyList.findIndex(currency => currency.id === item.id);
  
          if (currencyIdToDelete !== -1) {
            // Remove currency from currency list
            currencyList.splice(currencyIdToDelete, 1);
            // Update state
            setCurrencyList(currencyList); 
            // Clear selected currency text
            setSelectedCurrencyText(); 
            // Save updated currency list back to AsyncStorage
            AsyncStorage.setItem('currencyList', JSON.stringify(currencyList));
          }
        } 
        else {
          console.error('Error retrieving group list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  function currencyAddNewButton() {
    setCurrencyModalVisible(false);
    navigation.navigate("Add Currency");
  };

  CurrencyName = ({ title, onPressList, onPressDeleteButton }) => (
    <View style={[styles.currencySelectModalList, {borderColor: "lightgrey"}]}>
      <TouchableOpacity style={[styles.currencySelectModalListContent, {borderColor: "lightgrey"}]} onPress={onPressList}>
        <Text style={[styles.currencySelectModalListContentText, {color: "black", fontSize: 14}]}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.currencySelectModalDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  // ------------------------------------------------------- Amount ------------------------------------------------------- //
  const [useAmount, setAmount] = useState();

  // ------------------------------------------------------- Screen ------------------------------------------------------- //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
        {/* ------------------------------------------------------- Group select ------------------------------------------------------- */}
        <View style={[styles.groupSelectContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={styles.groupSelectButton}
            onPress={() => setGroupModalVisible(true)}
          >
            {selectedGroupText == null && (
              <Text style={[styles.groupSelectButtonText, {color: "black", fontSize: 14}]}>Select Group</Text>
            )}
            {selectedGroupText != null && (
              <Text style={[styles.groupSelectButtonText, {color: "black", fontSize: 14}]}>{selectedGroupText}</Text>
            )}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={groupModalVisible}
          >
            <View style={[styles.groupSelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={[styles.groupSelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
                <Text style={[styles.groupSelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Group</Text>
              </View>
              <View style={styles.groupSelectModalListContainer}>
                <FlatList
                  data={groupList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <GroupName 
                      title={item.title} 
                      onPressList={() => groupSelectModalListContent(item)}
                      onPressEditButton={() => groupSelectModalEditButton(item)}
                      onPressDeleteButton={() => groupSelectModalDeleteButton(item)}
                    />
                  )}
                />
              </View>
              <View style={[styles.groupSelectModalButtonsContainer, {backgroundColor: "#E5E4E2"}]}>
                <TouchableOpacity
                  style={[styles.groupSelectModalBackButton, {borderColor: "lightgrey"}]} 
                  onPress={() => setGroupModalVisible(false)}
                >
                  <Text style={[styles.groupSelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.groupSelectModalAddButton} 
                  onPress={() => groupAddNewButton()}
                >
                  <Text style={[styles.groupSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        {/* ------------------------------------------------------- Date select ------------------------------------------------------- */}
        <View style={[styles.dateSelectContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={styles.dateSelectButton}
            onPress={() => setDateModalVisible(true)}
          >
            <Text style={[styles.dateSelectButtonText, {color: "black", fontSize: 14}]}>
              {date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={dateModalVisible}
          >
            <View style={[styles.dateSelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={styles.dateSelectModalPickerContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display="spinner"
                  textColor="black"
                  onChange={onChange}
                />
              </View>
              <TouchableOpacity
                style={[styles.dateSelectModalAddButton, {backgroundColor: "#E5E4E2"}]} 
                onPress={() => setDateModalVisible(false)}
              >
                <Text style={[styles.dateSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Ok</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        {/* ------------------------------------------------------- Type select ------------------------------------------------------- */}
        <View style={[styles.typeContainer, {borderColor: "lightgrey"}]}>
          {/* -------------------- Income -------------------- */}
          <View style={[styles.incomeButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.incomeButton, {backgroundColor: incomeButtonColour}]}
              onPress={ () => incomeButtonPressed() }
            >
              <Text style={[styles.incomeButtonText, {color: "black", fontSize: 14}]}>Income</Text>
            </TouchableOpacity>
          </View>
          {/* -------------------- Expense -------------------- */}
          <View style={[styles.expenseButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.expenseButton, {backgroundColor: expenseButtonColour}]}
              onPress={ () => expenseButtonPressed() }
            >
              <Text style={[styles.expenseButtonText, {color: "black", fontSize: 14}]}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ------------------------------------------------------- Category select & Description ------------------------------------------------------- */}
        <View style={styles.categorySelectAndDescriptionContainer}>
          {/* ------------------------------------------------------- Category select ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.categorySelectButton, {borderColor: "lightgrey"}]}
            onPress={() => setCategoryModalVisible(true)}
          >
            {selectedCategoryText == "General" && (
              <Icon name="notebook" type="simple-line-icon" size={21} color="black" />
            )}
            {selectedCategoryText != "General" && (
              <View style={[styles.categorySelectButtonContentColour, {backgroundColor: selectedCategoryColour}]} />
            )}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
          >
            <View style={[styles.categorySelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={[styles.categorySelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
                <Text style={[styles.categorySelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Category</Text>
              </View>
              <View style={styles.categorySelectModalListContainer}>
                <FlatList
                  data={categoryList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CategoryName 
                      title={item.title}
                      colour={item.colour} 
                      onPressList={() => categorySelectModalListContent(item)}
                      onPressEditButton={() => categorySelectModalEditButton(item)}
                      onPressDeleteButton={() => categorySelectModalDeleteButton(item)}
                    />
                  )}
                />
              </View>
              <View style={[styles.categorySelectModalButtonsContainer, {backgroundColor: "#E5E4E2"}]}>
                <TouchableOpacity
                  style={[styles.categorySelectModalBackButton, {borderColor: "lightgrey"}]} 
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={[styles.categorySelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.categorySelectModalAddButton} 
                  onPress={() => categoryAddNewButton()}
                >
                  <Text style={[styles.categorySelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* ------------------------------------------------------- Description ------------------------------------------------------- */}
          <View style={[styles.descriptionContainer, {borderColor: "lightgrey"}]}>
            <TextInput
              // Description textInput style //
              clearButtonMode="while-editing"
              // Description textInput keyboard style //
              keyboardAppearance="light"
              inputMode="text" 
              enterKeyHint="done"
              // Description textInput text //
              placeholder="Enter Description"
              defaultValue={useDescription}
              onChangeText={useDescription => setDescription(useDescription)}
              // Description textInput text style //
              style={{ color: "black", fontSize: 14, }}
              textAlign="center"
            />
          </View>
        </View>
        {/* ------------------------------------------------------- Currency select and Amount ------------------------------------------------------- */}
        <View style={[styles.typeCurrencyAndAmountContainer, {borderColor: "lightgrey"}]}>
          {/* ------------------------------------------------------- Currency select ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.currencySelectButton, {borderColor: "lightgrey"}]}
            onPress={() => setCurrencyModalVisible(true)}
          >
            {selectedCurrencyText == null && (
              <Icon name="money-symbol" type="fontisto" size={23} color="black" />
            )}
            {selectedCurrencyText != null && (
              <Text style={[styles.currencySelectButtonText, {color: "black", fontSize: 14}]}>{selectedCurrencyText}</Text>
            )}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={currencyModalVisible}
          >
            <View style={[styles.currencySelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={[styles.currencySelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
                <Text style={[styles.currencySelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Currency</Text>
              </View>
              <View style={styles.currencySelectModalListContainer}>
                <FlatList
                  data={currencyList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CurrencyName 
                      title={item.title} 
                      onPressList={() => currencySelectModalListContent(item)}
                      onPressDeleteButton={() => currencySelectModalDeleteButton(item)}
                    />
                  )}
                />
              </View>
              <View style={[styles.currencySelectModalButtonsContainer, {backgroundColor: "#E5E4E2"}]}>
                <TouchableOpacity
                  style={[styles.currencySelectModalBackButton, {borderColor: "lightgrey"}]} 
                  onPress={() => setCurrencyModalVisible(false)}
                >
                  <Text style={[styles.currencySelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.currencySelectModalAddButton} 
                  onPress={() => currencyAddNewButton()}
                >
                  <Text style={[styles.currencySelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* ------------------------------------------------------- Amount ------------------------------------------------------- */}
          <View style={[styles.amountContainer, {borderColor: "lightgrey"}]}>
            <TextInput
              // Amount textInput style //
              maxLength={9}
              clearButtonMode="while-editing"
              // Amount textInput keyboard style //
              keyboardAppearance="light"
              inputMode="decimal" 
              enterKeyHint="done"
              // Amount textInput text //
              placeholder="0.00"
              defaultValue={useAmount}
              onChangeText={useAmount => setAmount(useAmount)}
              // Amount textInput text style //
              style={{ fontSize: 14, }}
              textAlign="center"
            />
          </View>
        </View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={styles.addContainer}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2",}]}
            onPress={() => addNewAccount()}
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
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // ------------------------------------------------------- Group select ------------------------------------------------------- //
  groupSelectContainer:{
    backgroundColor: "transparent",
    flex: 3,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // ---------------- Select button ---------------- //
  groupSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  groupSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  groupSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Header
  groupSelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  groupSelectModalHeaderText:{
    textAlign: "center",
  },
  // Lists
  groupSelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  // List
  groupSelectModalList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // Content
  groupSelectModalListContent: {
    backgroundColor: "transparent",
    flex: 5,
    paddingVertical: deviceHeight * 0.0223,
  },
  groupSelectModalListContentText: {
    textAlign: "center",
  },
  // Edit button
  groupSelectModalEditButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // Delete button
  groupSelectModalDeleteButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
    borderRightWidth: 1,
  },
  // ---------------- Modal Buttons ---------------- //
  groupSelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Back button
  groupSelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  groupSelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add button
  groupSelectModalAddButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
  },
  groupSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  dateSelectContainer: {
    backgroundColor: "transparent",
    flex: 3,
    borderRadius: 20,
    borderBottomWidth: 1, 
  },
  // ---------------- Select button ---------------- //
  dateSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  dateSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  dateSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Date picker
  dateSelectModalPickerContainer: {
    backgroundColor: "transparent",
    flex: 9,
  },
  // Add button
  dateSelectModalAddButton: {
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  dateSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Type select ------------------------------------------------------- //
  typeContainer:{
    backgroundColor: "transparent",
    flex: 3,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // ---------------- Income button ---------------- //
  incomeButtonContainer: {
    flex: 1,
    borderRightWidth: 1,
	},
  incomeButton: {
    flex: 1,
    justifyContent: "center",
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	incomeButtonText: {
    textAlign: "center",
	},
  // ---------------- Expense button ---------------- //
	expenseButtonContainer: {
    flex: 1,
	},
  expenseButton: {
    flex: 1,
    justifyContent: "center",
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
	expenseButtonText: {
    textAlign: "center",
	},
  // ------------------------------------------------------- Category select & Description ------------------------------------------------------- //
  categorySelectAndDescriptionContainer: {
    backgroundColor: "transparent",
    flex: 3,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    borderRadius: 20, 
  },
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  categorySelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderRadius: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  categorySelectButtonText: {
    textAlign: "center",
  },
  categorySelectButtonContentColour: {
    flex: 1,
    alignSelf: "center",
    width: deviceWidth * 0.05,
    marginVertical: deviceHeight * 0.008,
    borderRadius: 100,
  },
  // ---------------- Modal ---------------- //
  categorySelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Header
  categorySelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  categorySelectModalHeaderText:{
    textAlign: "center",
  },
  // Lists
  categorySelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  // List
  categorySelectModalList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // Colour
  categorySelectModalListContentColourContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  categorySelectModalListContentColour: {
    flex: 1,
    alignSelf: "center",
    width: deviceWidth * 0.05,
    marginVertical: deviceHeight * 0.015,
    borderRadius: 100,
  },
  // Content
  categorySelectModalListContent: {
    backgroundColor: "transparent",
    flex: 5,
    paddingVertical: deviceHeight * 0.0223,
  },
  categorySelectModalListContentText: {
    textAlign: "center",
  },
  // Edit button
  categorySelectModalEditButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // Delete button
  categorySelectModalDeleteButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
    borderRightWidth: 1,
  },
  // ---------------- Modal Buttons ---------------- //
  categorySelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Back button
  categorySelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  categorySelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add button
  categorySelectModalAddButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
  },
  categorySelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Description ------------------------------------------------------- //
  descriptionContainer: {
		backgroundColor: "transparent",
		flex: 3,
		justifyContent: 'center',
		borderRadius: 20,
    borderBottomWidth: 1,
	},
  // ------------------------------------------------------- Currency and Amount ------------------------------------------------------- //
  typeCurrencyAndAmountContainer:{
    backgroundColor: "transparent",
    flex: 3,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    borderRadius: 20, 
  },
  // ------------------------------------------------------- Currency select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  currencySelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderRadius: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  currencySelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  currencySelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Header
  currencySelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  currencySelectModalHeaderText:{
    textAlign: "center",
  },
  // Lists
  currencySelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  // List
  currencySelectModalList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // Content
  currencySelectModalListContent: {
    backgroundColor: "transparent",
    flex: 5,
    paddingVertical: deviceHeight * 0.0223,
  },
  currencySelectModalListContentText: {
    textAlign: "center",
  },
  // Delete button
  currencySelectModalDeleteButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // ---------------- Modal Buttons ---------------- //
  currencySelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Back button
  currencySelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  currencySelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add button
  currencySelectModalAddButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
  },
  currencySelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Amount ------------------------------------------------------- //
  amountContainer: {
		backgroundColor: "transparent",
		flex: 3,
		justifyContent: 'center',
		borderRadius: 20,
    borderBottomWidth: 1,
	},
  // ------------------------------------------------------- Receipt and Add ------------------------------------------------------- //
  receiptAndAddContainer:{
    backgroundColor: "transparent",
    flex: 4,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    borderRadius: 20, 
  },
  // ------------------------------------------------------- Receipt ------------------------------------------------------- //
  receiptButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.013,
    borderRadius: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  receiptButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Add ------------------------------------------------------- //
  addContainer:{
    backgroundColor: "transparent",
    flex: 3,
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