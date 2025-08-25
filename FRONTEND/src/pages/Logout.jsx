
import API from "../api";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
const navigate = useNavigate();

const logout = async () => {
    try {
    await API.post("/auth/logout");
    alert("Logged out successfully!");
    navigate("/login"); // redirect to login page
    } catch (err) {
    alert(err.response?.data?.message || "Error logging out");
    }
};

return logout;
};

export default useLogout;
