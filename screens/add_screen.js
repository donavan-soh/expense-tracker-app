import { createStackNavigator } from '@react-navigation/stack';
import { AddMainScreen } from './add_account_screen/add_main_screen';
import { AddGroupScreen } from './add_account_screen/add_group_screen';
import { EditGroupScreen } from './add_account_screen/edit_group_screen';
import { AddCategoryScreen } from './add_account_screen/add_category_screen.js';
import { AddCurrencyScreen } from './add_account_screen/add_currency_screen';
import { AddReceiptScreen } from './add_account_screen/add_receipt_screen.js';
import { EditCategoryScreen } from './add_account_screen/edit_category_screen';


export function AddScreen() {

  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Main" component={AddMainScreen} options={{ title: "Add Account", }}/>
      <Stack.Screen name="Add Group" component={AddGroupScreen}/>
      <Stack.Screen name="Edit Group" component={EditGroupScreen}/>
      <Stack.Screen name="Add Category" component={AddCategoryScreen}/>
      <Stack.Screen name="Edit Category" component={EditCategoryScreen}/>
      <Stack.Screen name="Add Currency" component={AddCurrencyScreen}/>
      <Stack.Screen name="Add Receipt" component={AddReceiptScreen}/>
    </Stack.Navigator>
  );
``
}