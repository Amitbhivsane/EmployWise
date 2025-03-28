import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, setPage } from "../redux/usersSlice";
import EditUserModal from "./EditUserModal";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, page, totalPages } = useSelector(
    (state) => state.users
  );
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if not logged in
    } else {
      dispatch(fetchUsers(page));
    }
  }, [dispatch, page, token, navigate]);

  // Filter users based on search input
  const filteredUsers = data.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear auth token
    navigate("/"); // Redirect to login page
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser({ userId, token }));
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Users List</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 p-2 border rounded mb-4"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.first_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              disabled={page === 1}
              onClick={() => dispatch(setPage(page - 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => dispatch(setPage(page + 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserList;
