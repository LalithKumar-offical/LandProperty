import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import adminDashboardReducer from "./admin/adminDashboardSlice";
import adminUsersReducer from "./admin/adminUsersSlice";
import adminHomesReducer from "./admin/adminHomesSlice";
import adminLogsReducer from "./admin/adminLogsSlice";
import userDashboardReducer from "./user/userDashboardSlice";
import userBidsReducer from "./user/userBidsSlice";
import ownerDashboardReducer from "./owner/ownerDashboardSlice";
import homesReducer from "./homesSlice";

import profileReducer from "./profileSlice";
import propertiesReducer from "./propertiesSlice";
import fullDetailsReducer from "./fullDetailsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    adminDashboard: adminDashboardReducer,
    adminUsers: adminUsersReducer,
    adminHomes: adminHomesReducer,
    adminLogs: adminLogsReducer,
    userDashboard: userDashboardReducer,
    userBids: userBidsReducer,
    ownerDashboard: ownerDashboardReducer,
    homes: homesReducer,

    profile: profileReducer,
    properties: propertiesReducer,
    fullDetails: fullDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
