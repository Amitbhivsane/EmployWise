import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserList from "../components/UserList";

const UsersPage = () => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6">
      <UserList />
    </div>
  );
};

export default UsersPage;
