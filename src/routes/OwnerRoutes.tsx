import { Route, Routes, Navigate } from "react-router-dom"
import OwnerBidsPage from "../pages/Owner/OwnerBidsPage"
import OwnerHomesPage from "../pages/Owner/OwnerHomesPage"
import OwnerProfilePage from "../pages/Owner/OwnerProfilePage"
import OwnerLandsPage from "../pages/Owner/OwnerLandsPage"
import CreatePropertyPage from "../pages/Owner/CreatePropertyPage"
import CreateLandPage from "../pages/Owner/CreateLandPage"
import EditPropertyPage from "../pages/Owner/EditPropertyPage"
import EditLandPage from "../pages/Owner/EditLandPage"
import OwnerDashboardPage from "../pages/Dashboard/OwnerDashboardPage"

const OwnerRoutes =()=>{
    return(
        <Routes>
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboardPage/>} />
            <Route path="bids" element={<OwnerBidsPage/>} />
            <Route path="homes" element={<OwnerHomesPage/>} />
            <Route path="create-property" element={<CreatePropertyPage/>} />
            <Route path="create-land" element={<CreateLandPage/>} />
            <Route path="edit-property/:propertyId" element={<EditPropertyPage/>} />
            <Route path="edit-land/:landId" element={<EditLandPage/>} />
            <Route path="profile" element={<OwnerProfilePage/>} />
            <Route path="lands" element={<OwnerLandsPage/>} />
        </Routes>
    )
}
export default OwnerRoutes;
