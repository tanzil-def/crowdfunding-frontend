import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import SideBar from "../../components/SideBar/Sidebar";
import PrivatecHeader from "../../components/Header/PrivateHeader";
import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPropertiesList } from "../../store/thunk";

const MasterLayout = () => {
  const isUserLoggedIn = useSelector((state) => state.user?.isUserLoggedIn ?? false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn ?? false) {
      navigate("/");
    } else {
      dispatch(fetchAllPropertiesList());
    }
  }, [isUserLoggedIn ?? false, navigate, dispatch]);

  return (
    <main>
      <PrivatecHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex">
        <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default memo(MasterLayout);
