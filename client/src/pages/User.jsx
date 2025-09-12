import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RiAdminLine, RiUserLine } from "react-icons/ri";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEvn } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { patchData } from "@/helpers/handlePatch";
import { showToast } from "@/helpers/showToast";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import React, { useState } from "react";

const User = () => {
  const [refreshData, setRefreshData] = useState(false);
  const { data, loading } = useFetch(
    `${getEvn("VITE_API_URL")}/user`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEvn("VITE_API_URL")}/user/${id}`);
    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Data deleted.");
    } else {
      showToast("error", "Data not deleted.");
    }
  };

  const handleToggleRole = async (id, name, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";

    const res = await patchData(
      `${getEvn("VITE_API_URL")}/user/role/${id}`,
      null,
      `Do you want to change role for ${name}? (${currentRole} → ${nextRole})`
    );

    if (res && res.success) {
      showToast("success", res.message);
      setRefreshData((prev) => !prev);
    } else if (res === false) {
      showToast("error", "Role not updated.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 w-full ">
      <Card className="shadow-md dark:shadow-lg dark:bg-gray-900">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            User Management
          </h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Avatar
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Dated
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.users.length > 0 ? (
                  data.users.map((user, index) => (
                    <TableRow
                      key={user._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800"
                      } hover:bg-violet-50 dark:hover:bg-gray-700 transition`}
                    >
                      <TableCell className="capitalize font-medium text-gray-800 dark:text-gray-200">
                        {user.role}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <img
                          src={user.avatar || usericon}
                          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                          alt="avatar"
                        />
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {moment(user.createdAt).format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell className="flex justify-center gap-2">
                        <Button
                          onClick={() =>
                            handleToggleRole(user._id, user.name, user.role)
                          }
                          variant="outline"
                          className="cursor-pointer rounded-full p-2 
                      text-green-600 dark:text-green-400 
                    border-gray-300 dark:border-gray-600 
               hover:bg-green-600 hover:text-white 
               dark:hover:bg-green-500 dark:hover:text-white 
               transition-all duration-200"
                          title="Toggle Role"
                        >
                          {user.role === "admin" ? (
                            <RiUserLine />
                          ) : (
                            <RiAdminLine />
                          )}
                        </Button>

                        <Button
                          onClick={() => handleDelete(user._id)}
                          variant="outline"
                          className="cursor-pointer rounded-full p-2 
               text-red-600 dark:text-red-400 
               border-gray-300 dark:border-gray-600 
               hover:bg-red-600 hover:text-white 
               dark:hover:bg-red-500 dark:hover:text-white 
               transition-all duration-200"
                          title="Delete User"
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="6"
                      className="text-center text-gray-500 dark:text-gray-400 py-5"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default User;
