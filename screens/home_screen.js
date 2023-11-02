import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
export function HomeScreen({ navigation }) {

  // ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
  const getData = async () => {
    try {
      // Retrieve data from AsyncStorage
      const existingAccountData = await AsyncStorage.getItem('accountList');
      const existingGroupListData = await AsyncStorage.getItem('groupList');

      // ------------------------------------------------------- Account List ------------------------------------------------------- //
      const accountList = existingAccountData ? JSON.parse(existingAccountData) : [];

      // Set display group list
      setAccountList(accountList);
      console.log(accountList);
      // ------------------------------------------------------- Group List ------------------------------------------------------- //
      const groupList = existingGroupListData ? JSON.parse(existingGroupListData) : [];

      // Set display group list
      setGroupList(groupList);

      // Set the selected group to the first group in the list (if it exists)
      if (groupList.length > 0) {
        setSelectedGroup(groupList[0].title);
        filterAccountListByGroup(groupList[0].title);
      }
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

  // ------------------------------------------------------- Group select ------------------------------------------------------- //
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState()

  function groupSelectModalListContent(item) {
    setSelectedGroup(item.title);
    filterAccountListByGroup(item.title);
    setGroupModalVisible(false);
  };
  
  function groupAddNewButton() {
    setGroupModalVisible(false);
    navigation.navigate("Add Group");
  };

  GroupName = ({ title, onPressList }) => (
    <TouchableOpacity style={[styles.groupSelectModalList, {borderColor: "lightgrey"}]} onPress={onPressList}>
      <Text style={[styles.groupSelectModalListContentText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );

	// ------------------------------------------------------- Account lists ------------------------------------------------------- //
  const [accountList, setAccountList] = useState([]);

  const filterAccountListByGroup = (group) => {
    // Retrieve account list from AsyncStorage
    AsyncStorage.getItem('accountList', (error, result) => {
      if (!error) {
        const accountList = JSON.parse(result);
  
        // Filter the account list by the selected group
        const filteredAccountList = accountList.filter((account) => account.group === group);
  
        // Update state with the filtered account list
        setAccountList(filteredAccountList);

        for(account in filteredAccountList) {
          if(filteredAccountList.type == "+") {
            groupAccountIncome += filteredAccountList.value;
          }
          if(filteredAccountList.type == "-") {
            groupAccountExpense += filteredAccountList.value;
          }
          groupAccountBalance = groupAccountIncome - groupAccountExpense;
        }
        
      } else {
        console.error('Error retrieving account list:', error);
      }
    });
  };

  function accountListDeleteButton(item) {
    try {
      // Retrieve account list from AsyncStorage
      AsyncStorage.getItem('accountList', (error, result) => {
        if (!error) {
          const accountList = JSON.parse(result);
  
          // Find id of account to delete
          const accountIdToDelete = accountList.findIndex(account => account.id === item.id);
  
          if (accountIdToDelete !== -1) {
            // Remove account from account list
            accountList.splice(accountIdToDelete, 1);
            // Update state
            setAccountList(accountList); 
            // Save updated account list back to AsyncStorage
            AsyncStorage.setItem('accountList', JSON.stringify(accountList));
          }
        } 
        else {
          console.error('Error retrieving account list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  function accountListEditButton(item) {
    navigation.navigate("Edit Account", {accountEdit: item});
  };

  AccountName = ({ date, description, currency, amount, colour, onPressDeleteButton}) => (
    <View style={[styles.accountList, {borderColor: "lightgrey"}]}>
      <View style={styles.accountListContent}>
        <View style={[styles.accountListContentDateContainer, {borderColor: "lightgrey"}]}>
          <Text style={[styles.accountListContentDateText, {color: "black", fontSize: 14}]}>{date}</Text>
        </View>
        <View style={styles.accountListContentCategoryContainer}>
          <View style={[styles.accountListContentCategory, {backgroundColor: colour}]}/>
        </View>
        <View style={styles.accountListContentDescriptionContainer}>
          <Text style={[styles.accountListContentDescriptionText, {color: "black", fontSize: 14}]}>{description}</Text>
        </View>
        <View style={styles.accountListContentCurrencyAndAmountContainer}>
          <View style={styles.accountListContentCurrencyContainer}>
            <Text style={[styles.accountListContentCurrencyText, {color: "black", fontSize: 14}]}>{currency}</Text>
          </View>
          <View style={styles.accountListContentAmountContainer}>
            <Text style={[styles.accountListContentAmountText, {color: "black", fontSize: 14}]}>{amount}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.accountListDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  
  // ------------------------------------------------------- Screen ------------------------------------------------------- //
  return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      {/* ------------------------------------------------------- Group select ------------------------------------------------------- */}
      <View style={[styles.groupSelectContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={styles.groupSelectButton}
            onPress={() => setGroupModalVisible(true)}
          >
            {selectedGroup == null && (
              <Text style={[styles.groupSelectButtonText, {color: "black", fontSize: 14}]}>All accounts</Text>
            )}
            {selectedGroup != null && (
              <Text style={[styles.groupSelectButtonText, {color: "black", fontSize: 14}]}>{selectedGroup}</Text>
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
      {/* ------------------------------------------------------- Account lists ------------------------------------------------------- */}
      <View style={styles.accountListsContainer}>
        <FlatList
          data={accountList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AccountName 
              date={item.date}
              description={item.description}
              colour={item.colour} 
              currency={item.currency}
              amount={item.amount}   
              onPressEditButton={() => accountListEditButton(item)}
              onPressDeleteButton={() => accountListDeleteButton(item)}
            />
          )}
        />
      </View>
      <View style={styles.summaryContentContaineer}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryContentText}>
            Income: {groupAccountIncome}
          </Text>
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryContentText}>
            Expense: {groupAccountExpense}
          </Text>
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryContentText}>
            Balance: {groupAccountBalance}
          </Text>
        </View>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  // ------------------------------------------------------- Main container ------------------------------------------------------- //
	mainContainer: {
    flex: 1,
  },
  // ------------------------------------------------------- Group select ------------------------------------------------------- //
  groupSelectContainer:{
    flex: 1,
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
    paddingVertical: deviceHeight * 0.0223,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // Content
  groupSelectModalListContent: {
    backgroundColor: "transparent",
    flex: 1,
  },
  groupSelectModalListContentText: {
    textAlign: "center",
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
  // ------------------------------------------------------- Accounts list ------------------------------------------------------- //
  // Lists
  accountListsContainer: {
    backgroundColor: "white",
    flex: 14,
  },
  // List
  accountList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1
  },
  // Contents
  accountListContent: {
    backgroundColor: "transparent",
    flex: 10,
    flexDirection: "row",
    height: deviceHeight * 0.06,
  },
  // Date
  accountListContentDateContainer: {
    backgroundColor: "transparent",
    flex: 4,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.009,
    borderRadius: 5,
    borderRightWidth: 1,
  },
  accountListContentDateText: {
    textAlign: "left",
  },
  // Category
  accountListContentCategoryContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  accountListContentCategory: {
    alignSelf: "center",
    width: deviceWidth * 0.035,
    height: deviceHeight * 0.016,
    borderRadius: 30,
  },
  // Description
  accountListContentDescriptionContainer: {
    backgroundColor: "transparent",
    flex: 6,
    justifyContent: "center",
  },
  accountListContentDescriptionText: {
    textAlign: "left",
  },
  // Currency and amount
  accountListContentCurrencyAndAmountContainer: {
    backgroundColor: "transparent",
    flex: 4,
    flexDirection: "row",
  },
  // Currency
  accountListContentCurrencyContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  accountListContentCurrencyText: {
    textAlign: "left",
  },
  // Amount
  accountListContentAmountContainer: {
    backgroundColor: "transparent",
    flex: 2,
    justifyContent: "center",
  },
  accountListContentAmountText: {
    textAlign: "left",
  },
  accountListContentText: {
    textAlign: "center",
  },
  // Delete button
  accountListDeleteButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  summaryContentContaineer: {
    backgroundColor: "red",
    flex: 4,
    flexDirection: "column",
  },
  summaryContent: {
    backgroundColor: "green",
    flex: 1,
    borderBottomWidth: 1,
  },
  summaryContentText: {
    textAlign: "center",
  },
});