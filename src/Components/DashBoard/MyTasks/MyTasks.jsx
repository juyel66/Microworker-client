import { useQuery } from "@tanstack/react-query";
import userAxiosPublic from "../../Hook/userAxiosPublic";
import useAuth from "../../Home/useAuth";
import { Player } from "@lottiefiles/react-lottie-player";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { Link } from "react-router-dom";

const MyTasks = () => {
  const axiosPublic = userAxiosPublic();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()

  const {
    data: myTasks,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["addTask", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`tasks/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Only run the query if the user email exists
  });
  console.log(myTasks)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(myTasks);

  const handleDeleteUser = (myTasks) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/addTask/${myTasks._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };


  return (
    <div className="h-screen pb-3 pl-3 pr-3 lg:h-96" >
      <h1 className="mt-4 text-3xl text-center">My Task: {myTasks.length}</h1>
      {myTasks?.length ? (
        <div>
          <div className="mt-4 mb-4 overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="border-2 border-gray-800 lg:text-xl">
                  <th>No</th>
                  <th>Task Title</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myTasks?.map((task, index) => (
                  <tr className="border-2 border-gray-900" key={task._id}>
                    <td>{index + 1}</td>
                    <td className="px-4 py-2 border-b">{task.title}</td>
                    <td className="px-4 py-2 border-b">{task.quantity}</td>
                    <td className="px-4 py-2 border-b">${task.amount}</td>

                    <Link to={`/dashboard/updateTask/${task._id}`} className="btn  btn-xl bg-[#dca9f5]  hover:bg-red-500 text-2xl">
                      <MdOutlineSystemUpdateAlt />
                    </Link>
                    <button  onClick={() => handleDeleteUser(task)} className="btn btn-xl bg-[#dca9f5] hover:bg-red-500 text-2xl">
                      <AiTwotoneDelete />
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <p className="mt-5 text-center">No Task history available.</p>

          <div className="justify-center lg:flex">
            <div className="flex-1 lg:hidden">
              <Player
                autoplay
                loop
                src="https://lottie.host/d53b7a3a-8883-4460-9f16-387491682f1b/1mS2ZVJ0Zj.json"
                style={{ height: "300px", width: "200px" }}
              ></Player>
            </div>

            <div className="hidden lg:flex">
              <Player
                autoplay
                loop
                src="https://lottie.host/d53b7a3a-8883-4460-9f16-387491682f1b/1mS2ZVJ0Zj.json"
                style={{ height: "500px", width: "600px" }}
              ></Player>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
