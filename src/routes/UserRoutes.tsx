import { Route, Routes, Navigate } from "react-router-dom";
import UserBidsPage from "../pages/User/UserBidsPage";
import UserHomesPage from "../pages/User/UserHomesPage";
import UserLandsPage from "../pages/User/UserLandsPage";
import UserProfilePage from "../pages/User/UserProfilePage";

const UserRoutes=()=>{
    return(
        <Routes>
            <Route path="" element={<Navigate to="homes" replace />} />
            <Route path="bids" element={<UserBidsPage/>}/>
            <Route path="homes" element={<UserHomesPage/>}/>
            <Route path="lands" element={<UserLandsPage/>}/>
            <Route path="profile" element={<UserProfilePage/>}/>
        </Routes>
    );
};
export default UserRoutes;
