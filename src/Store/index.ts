import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import logger from 'redux-logger';
import {api} from '../Services/api';
import auth from './AuthSlice';
import dashboard from './DashboardSlice';
import device from './DeviceSlice';
import createTicket from './CreateTicketSlice';

const reducers = combineReducers({
  api: api.reducer,
  auth,
  dashboard,
  device,
  createTicket
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ALL') {
    AsyncStorage.removeItem('persist:root');
    return reducers(undefined, action);
  }

  return reducers(state, action);
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'dashboard', 'createTicket'],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware);

    // if (__DEV__ && !process.env.JEST_WORKER_ID) {
    //   const createDebugger = require("redux-flipper").default;
    //   middlewares.push(createDebugger(), logger);
    // }

    return middlewares;
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

setupListeners(store.dispatch);

export {store, persistor};
