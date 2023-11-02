import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@rneui/themed';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

// ---------------------------------------- Device dimensions ---------------------------------------- //
// --------------- Device width --------------- //
const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
const deviceHeight = Dimensions.get('screen').height;

// ---------------------------------------- Lists ---------------------------------------- //
// --------------- Group list --------------- //
const groupList = [
  { id: 'august', title: 'August' },
  { id: 'september', title: 'September' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
  { id: 'october', title: 'October' },
];
// --------------- Category list --------------- //
const categoryList = [
	{ id: 'red', title: 'Food'},
  { id: 'yellow', title: 'Transport' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
  { id: 'blue', title: 'Rent' },
]
// --------------- Currency list --------------- //
const currencyList = [
  { id: 'sgd', title: 'SGD'},
  { id: 'gbp', title: 'GBP' },
  { id: 'usd', title: 'USD' },
]
// ------------------------------ Main function ------------------------------ //
export function AddAccountScreen({ navigation, route }) {

  // ------------------------------ useEffects ------------------------------ //
  // --------------- Group useEffect --------------- //
  useEffect(() => {
        if (route.params?.newGroupName) {
          // Add Group to array
          groupList.push({ 
            label: route.params?.newGroupName, 
            value: route.params?.newGroupName, 
          });
          // Group added alert
          Alert.alert(
            "Account Group added!",
            route.params?.newGroupName + " has been added to Account Group",
            [
              {
                text: "Ok"
              },
            ]
          );
        }
      }, [route.params?.newGroupName]);
  // --------------- Group useEffect --------------- //
  useEffect(() => {
    if (route.params?.newCategoryName) {
      // Add Category to array
      categoryList.push({ 
        label: route.params?.newCategoryName, 
        value: route.params?.newCategoryName,
        colourValue: route.params?.colourCode,
      });
      // Category added alert
      Alert.alert(
        "Category added!",
        route.params?.newCategoryName + " has been added to Category",
        [
          {
            text: "Ok"
          },
        ]
      );
    }
  }, [route.params?.newCategoryName]);
    	
	// ------------------------------------------------------- Group select ------------------------------------------------------- //
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [selectedGroupText, setSelectedGroupText] = useState("Select Group")

  function groupTextButton(item) {
    setSelectedGroupText(item.title);
    setGroupModalVisible(false);
  };

  GroupName = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.groupSelectModalList, {borderColor: "lightgrey"}]} onPress={onPress}>
      <Text style={[styles.groupSelectModalListText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );
  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  function onChange(event, selectedDate) {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
  };
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategoryText, setSelectedCategoryText] = useState("Select Category")
  const categoryTextButton = (item) => {
    setSelectedCategoryText(item.title);
    setCategoryModalVisible(false);
  };

  CategoryName = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.categorySelectModalList, {borderColor: "lightgrey"}]} onPress={onPress}>
      <Text style={[styles.categorySelectModalListText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );
  // ------------------------------------------------------- Description ------------------------------------------------------- //
	const [useDescription, setDescription] = useState();
  // ------------------------------------------------------- Type select ------------------------------------------------------- //
  const [useType, setType] = useState();
  const [incomeButtonColour, setIncomeButtonColour] = useState("transparent");
  const [expenseButtonColour, setExpenseButtonColour] = useState("transparent");

  function incomeButtonPressed() {
    setType("+");
    setIncomeButtonColour("#F2F2F7");
    setExpenseButtonColour("transparent");
  }

  function expenseButtonPressed() {
    setType("-");
    setExpenseButtonColour("#F2F2F7");
    setIncomeButtonColour("transparent");
  }
  // ------------------------------------------------------- Currency select ------------------------------------------------------- //
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false)
  const [selectedCurrencyText, setSelectedCurrencyText] = useState("Select Currency")
  const currencyTextButton = (item) => {
    setSelectedCurrencyText(item.title);
    setCurrencyModalVisible(false);
  };

  CurrencyName = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.currencySelectModalList, {borderColor: "lightgrey"}]} onPress={onPress}>
      <Text style={[styles.currencySelectModalListText, {color: "black", fontSize: 14}]}>{title}</Text>
    </TouchableOpacity>
  );
  // --------------- Amount useState --------------- //
  const [useAmount, setAmount] = useState();

  // ------------------------------ Screen ------------------------------ //
	return(

    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
        {/* ------------------------------------------------------- Group select ------------------------------------------------------- */}
        <TouchableOpacity 
          style={[styles.groupSelectButton, {borderColor: "lightgrey"}]}
          onPress={() => setGroupModalVisible(true)}
        >
          <Text style={[styles.groupSelectButtonText, {color: "black", fontSize: 14}]}>{selectedGroupText}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={groupModalVisible}
        >
            <View style={[styles.groupSelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={[styles.groupSelectModalHeaderContainer, {backgroundColor: '#68B6EF'}]}>
                <Text style={[styles.groupSelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Group</Text>
              </View>
              <View style={styles.groupSelectModalListContainer}>
                <FlatList
                  data={groupList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <GroupName title={item.title} onPress={() => groupTextButton(item)} />
                  )}
                />
              </View>
              <View style={[styles.groupSelectModalButtonsContainer, {backgroundColor: '#68B6EF'}]}>
                <TouchableOpacity
                  style={[styles.groupSelectModalBackButton, {borderColor: "lightgrey"}]} 
                  onPress={() => setGroupModalVisible(false)}
                >
                  <Text style={[styles.groupSelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.groupSelectModalAddButton} 
                  onPress={() => navigation.navigate("Add Group")}
                >
                  <Text style={[styles.groupSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
        {/* ------------------------------------------------------- Date select ------------------------------------------------------- */}
        <TouchableOpacity 
          style={[styles.dateSelectButton, {borderColor: "lightgrey"}]}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={[styles.dateSelectButtonText, {color: "black", fontSize: 14}]}>{date.toDateString().split(' ').slice(1).join(' ')}</Text>
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
                style={[styles.dateSelectModalAddButton, {backgroundColor: '#68B6EF'}]} 
                onPress={() => setDateModalVisible(false)}
              >
                <Text style={[styles.dateSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Ok</Text>
              </TouchableOpacity>
            </View>
        </Modal>
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
        <View style={[styles.categorySelectAndDescriptionContainer, {borderColor: "lightgrey"}]}>
          {/* ------------------------------------------------------- Category select ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.categorySelectButton, {borderColor: "lightgrey"}]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={[styles.categorySelectButtonText, {color: "black", fontSize: 14}]}>{selectedCategoryText}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
          >
              <View style={[styles.categorySelectModalContainer, {backgroundColor: 'white',}]}>
                <View style={[styles.categorySelectModalHeaderContainer, {backgroundColor: '#68B6EF'}]}>
                  <Text style={[styles.categorySelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Category</Text>
                </View>
                <View style={styles.categorySelectModalListContainer}>
                  <FlatList
                    data={categoryList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <CategoryName title={item.title} onPress={() => categoryTextButton(item)} />
                    )}
                  />
                </View>
                <View style={[styles.categorySelectModalButtonsContainer, {backgroundColor: '#68B6EF'}]}>
                  <TouchableOpacity
                    style={[styles.categorySelectModalBackButton, {borderColor: "lightgrey"}]} 
                    onPress={() => setCategoryModalVisible(false)}
                  >
                    <Text style={[styles.categorySelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categorySelectModalAddButton} 
                    onPress={() => setCategoryModalVisible(!categoryModalVisible)}
                  >
                    <Text style={[styles.categorySelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </Modal>
          {/* ------------------------------------------------------- Description ------------------------------------------------------- */}
          <View style={styles.descriptionContainer}>
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
            <Text style={[styles.currencySelectButtonText, {color: "black", fontSize: 14}]}>{selectedCurrencyText}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={currencyModalVisible}
          >
              <View style={[styles.currencySelectModalContainer, {backgroundColor: 'white',}]}>
                <View style={[styles.currencySelectModalHeaderContainer, {backgroundColor: '#68B6EF'}]}>
                  <Text style={[styles.currencySelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Currency</Text>
                </View>
                <View style={styles.currencySelectModalListContainer}>
                  <FlatList
                    data={currencyList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <CurrencyName title={item.title} onPress={() => currencyTextButton(item)} />
                    )}
                  />
                </View>
                <View style={[styles.currencySelectModalButtonsContainer, {backgroundColor: '#68B6EF'}]}>
                  <TouchableOpacity
                    style={[styles.currencySelectModalBackButton, {borderColor: "lightgrey"}]} 
                    onPress={() => setCurrencyModalVisible(false)}
                  >
                    <Text style={[styles.currencySelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.currencySelectModalAddButton} 
                    onPress={() => setCurrencyModalVisible(false)}
                  >
                    <Text style={[styles.currencySelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </Modal>
          {/* ------------------------------------------------------- Amount ------------------------------------------------------- */}
          <View style={styles.amountContainer}>
            <TextInput
              // Amount textInput style //
              maxLength={11}
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
        {/* ------------------------------------------------------- Receipt and Add ------------------------------------------------------- */}
        <View style={[styles.receiptAndAddContainer, {borderColor: "lightgrey"}]}>
          {/* ------------------------------------------------------- Receipt ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.receiptButton, {borderColor: "lightgrey"}]}
            onPress={() => navigation.navigate("Add Receipt")}
          >
            <Text style={[styles.receiptButtonText, {color: "black", fontSize: 14}]}>Receipt</Text>
          </TouchableOpacity>
          {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
          <TouchableOpacity 
            style={[styles.addButton, {borderColor: "lightgrey"}]}
            onPress={() => navigation.navigate(
              "Home", { 
                screen:"Details",
                params: { 
                  detailsGroup: valueGroup,
                  detailsDate: selectedDate,
                  detailsCategory: valueCategory,
                  detailsDescription: useDescription,
                  detailsType: useType,
                  detailsCurrency: valueCurrency,
                  detailsAmount: useAmount,
                },
                merge: true,
              },
            )
          }
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
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.65,
    borderRadius: 8,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // ------------------------------------------------------- Group select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  groupSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    borderRadius: 20, 
    borderBottomWidth: 1,
  },
  groupSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  groupSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.65,
    borderRadius: 8,
  },
  groupSelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  groupSelectModalHeaderText:{
    textAlign: "center",
  },
  // List
  groupSelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  groupSelectModalList: {
    backgroundColor: "transparent",
    paddingVertical: deviceHeight * 0.017, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  groupSelectModalListText: {
    textAlign: "center",
  },
  // ---------------- Modal Buttons ---------------- //
  groupSelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Back button
  groupSelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderBottomLeftRadius: 8,
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
    borderBottomRightRadius: 8,
  },
  groupSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  dateSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    borderRadius: 20,
    borderBottomWidth: 1, 
  },
  dateSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  dateSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.65,
    borderRadius: 8,
  },
  // Date picker
  dateSelectModalPickerContainer: {
    backgroundColor: "transparent",
    flex: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  // Add button
  dateSelectModalAddButton: {
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  dateSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Type select ------------------------------------------------------- //
  typeContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    paddingLeft: deviceWidth * 0.034,
    paddingRight: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // ---------------- Income button ---------------- //
  incomeButtonContainer: {
    flex: 1,
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
    borderRightWidth: 1,
	},
  incomeButton: {
    flex: 1,
    justifyContent: "center",
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
	},
	incomeButtonText: {
    textAlign: "center",
	},
  // ---------------- Expense button ---------------- //
	expenseButtonContainer: {
    flex: 1,
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
	},
  expenseButton: {
    flex: 1,
    justifyContent: "center",
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
	},
	expenseButtonText: {
    textAlign: "center",
	},
  // ------------------------------------------------------- Category select & Description ------------------------------------------------------- //
  categorySelectAndDescriptionContainer: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    paddingRight: deviceWidth * 0.034,
    borderRadius: 20, 
    borderBottomWidth: 1,
  },
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  categorySelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
    borderRightWidth: 1,
  },
  categorySelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  categorySelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.65,
    borderRadius: 8,
  },
  categorySelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categorySelectModalHeaderText:{
    textAlign: "center",
  },
  // List
  categorySelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  categorySelectModalList: {
    backgroundColor: "transparent",
    paddingVertical: deviceHeight * 0.017, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  categorySelectModalListText: {
    textAlign: "center",
  },
  // ---------------- Modal Buttons ---------------- //
  categorySelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Back button
  categorySelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 8,
    borderRightWidth: 1,
  },
  categorySelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add button
  categorySelectModalAddButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 2,
    borderBottomRightRadius: 8,
  },
  categorySelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Description ------------------------------------------------------- //
  descriptionContainer: {
		backgroundColor: "transparent",
		flex: 4,
		justifyContent: 'center',
		borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
	},
  // ------------------------------------------------------- Currency and Amount ------------------------------------------------------- //
  typeCurrencyAndAmountContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    paddingRight: deviceWidth * 0.034,
    borderRadius: 20, 
    borderBottomWidth: 1,
  },
  // ------------------------------------------------------- Currency select ------------------------------------------------------- //
  // ---------------- Select button ---------------- //
  currencySelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
    borderRightWidth: 1,
  },
  currencySelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  currencySelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.65,
    borderRadius: 8,
  },
  currencySelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  currencySelectModalHeaderText:{
    textAlign: "center",
  },
  // List
  currencySelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  currencySelectModalList: {
    backgroundColor: "transparent",
    paddingVertical: deviceHeight * 0.017, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  currencySelectModalListText: {
    textAlign: "center",
  },
  // ---------------- Modal Buttons ---------------- //
  currencySelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Back button
  currencySelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderBottomLeftRadius: 8,
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
    borderBottomRightRadius: 8,
  },
  currencySelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Amount ------------------------------------------------------- //
  amountContainer: {
		backgroundColor: "transparent",
		flex: 4,
		justifyContent: 'center',
		borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
	},
  // ------------------------------------------------------- Receipt and add ------------------------------------------------------- //
  receiptAndAddContainer: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingLeft: deviceWidth * 0.034,
    paddingRight: deviceWidth * 0.034,
    borderRadius: 20, 
    borderBottomWidth: 1,
  },
  // ---------------- Receipt button ---------------- //
  receiptButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
    borderRightWidth: 1,
  },
  receiptButtonText: {
    textAlign: "center",
  },
  // ---------------- Add button ---------------- //
  addButton: {
    backgroundColor: "transparent",
    flex: 4,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonText: {
    textAlign: "center",
  },
});