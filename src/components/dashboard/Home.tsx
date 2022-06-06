import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./Layout";
import { RootState } from "../../Store";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const { User, IsLoading } = useSelector((state: RootState) => state.auth);

  return (
    <Layout>
      <p>kjbsdfhkjs</p>
    </Layout>
  );
};

export default Home;
