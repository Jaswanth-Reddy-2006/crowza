import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import StaffRootNavigator from './navigation/RootNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
            <ActivityIndicator size="large" color="#FF9800" />
          </View>
        }
        persistor={persistor}
      >
        <StaffRootNavigator />
      </PersistGate>
    </Provider>
  );
}
