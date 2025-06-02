import { useQuery } from "@tanstack/react-query";
import userAxiosPublic from "../../Hook/userAxiosPublic";
import useAuth from "../../Home/useAuth";
import useUserData from "../useUserData/useUserData";
import useSubmission from "./useSubmission";
import { Player } from "@lottiefiles/react-lottie-player";



const WorkerHome = () => {
    const axiosPublic = userAxiosPublic();
    const {user} = useAuth();
    const [workerData] = useUserData();
    const [MySubmission] = useSubmission();
    console.log('my submission result is: ',MySubmission);
    

    const { data, isLoading, error } = useQuery({
      queryKey: ['submissions', user?.email],
      queryFn: async () => {
        const res = await axiosPublic.get(`/submission/${user?.email}`);
        return res.data;
      },
      enabled: !!user?.email,
    });

      if(isLoading) return <div>loading...</div>
      if(error) return console.error(error.message)
    //   console.log('data is', data)
  

  

      const approveData = data.filter(item => item.status === 'approved')
      console.log('approve data is',approveData);

      
    return (
        <div>


<div className="flex pl-4 mt-3 mb-10 cols-1 flex-center lg:grid-cols-3 md:grid-cols-2">
      <div className="card border-2 border-gray-300 w-80 lg:w-full bg-[#743f8f] text-[#ceedd8] shadow-xl">
        <div className="card-body">
          <div className="justify-end card-actions">
          </div>
          <h1 className="lg:text-3xl">Available Coin: {workerData.coin}</h1>
        </div>
      </div>
      <div className="card w-80 lg:w-full border-2 border-gray-300 bg-[#743f8f] text-[#ceedd8] shadow-xl">
        <div className="card-body">
          <div className="justify-end card-actions">
          </div>
          <h1 className="lg:text-3xl">Total Submission: {MySubmission.length}</h1>
        </div>
      </div>
 

      </div>



            <h1 className="mt-5 text-3xl font-semibold text-center">All Approved data: {approveData.length}</h1>
            <div className="pl-10 pr-10">
      {data && data?.length  > 0 ? (
        <div>
          <div className="flex justify-between mt-5">
            
        
          </div>
          <div className="mt-4 mb-4 overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-2 border-gray-800 lg:text-xl">
                  <th>No</th>
                  <th>Task Title</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approveData.map((approve, index) => (
                  <tr className="border-2 border-gray-900" key={approve._id}>
                    <td>{index  + 1}</td>
                    <td className="px-4 py-2 border-b">{approve.taskTitle}</td>
                    <td className="px-4 py-2 border-b">{approve.submissionDetails}</td>
                    <td className="px-4 py-2 border-b">${approve.payableAmount}</td>
                    <td className="px-4 py-2 border-b">{approve.currentDate}</td>
                    <td className="mt-2 mb-2 font-bold text-green-500 border-b">{approve.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div>
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

            
        </div>
    );
};

export default WorkerHome;