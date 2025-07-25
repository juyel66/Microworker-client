import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import userAxiosPublic from "../../Hook/userAxiosPublic";
import { AuthContext } from "../../AuthProvider/AuthProvider";
// import { useNavigate } from "react-router-dom";
import useUserData from "../useUserData/useUserData";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddNewTask = () => {
  const axiosPublic = userAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  

  const [workerData, refetch] = useUserData();
  const [totalAmount, setTotalAmount] = useState(0);
  console.log('total amount is: ', totalAmount)

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const quantity = watch("quantity", 0);
  const amount = watch("amount", 0);

  useEffect(() => {
    setTotalAmount(quantity * amount);
  }, [quantity, amount]);

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
  
      const imageFile = new FormData();
      imageFile.append("image", data.image[0]);
  
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      console.log("Image upload response:", res.data);
  
      if (res.data.success) {
        const addNewTask = {
          title: data.title,
          details: data.details,
          quantity: parseFloat(data.quantity),
          totalAmount: parseFloat(totalAmount),
          amount: parseFloat(data.amount),
          completionDate: data.completionDate,
          postingDate: data.postingDate,
          SubmissionInfo: data.SubmissionInfo,
          image: res.data.data.display_url,
          name: user?.displayName || "Default Name",
          email: user?.email || "default@example.com",
          currentTime: new Date().toISOString(),
          userId: user?._id || "defaultUserId"
        };
  
        console.log("Task data to be sent:", addNewTask);
  
        const menuRes = await axiosSecure.post('/addTask', addNewTask);
        console.log("Add task response:", menuRes.data);

  
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Task added successfully",
          showConfirmButton: false,
          timer: 1500
        });
        // if(workerData.coin > 0){
        //   alert('not available coin')
        // }
  
  
        reset();
        refetch(); // Refetch user data to update the coin count
      }
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire({
        icon: "error",
        title: "Coin not available",
        text: "Please purchase coin",
        confirmButtonText: "Okay"
      });
    }
  };
  console.log('amount is',amount)

  return (
    <div  className="p-2">
      <p className="mt-5 text-4xl font-bold text-center ">Add New Task</p>
      <p className="mt-5 text-3xl font-semibold text-center">Total coin: {workerData.coin}</p>
      <div className="mt-8 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3">
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Task Title</span>
              </div>
              <input
                type="text"
                placeholder="Task Title"
                {...register("title", { required: true })}
                className="input  border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.title && <span className="text-red-700">Title is required</span>}
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Task Details</span>
              </div>
              <input
                type="text"
                placeholder="Task Details"
                {...register("details", { required: true })}
                className="input border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.details && <span className="text-red-700">Details are required</span>}
            </label>
          </div>
          <div className="flex gap-3">
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Task Quantity</span>
              </div>
              <input
                type="number"
                placeholder="Quantity"
                {...register("quantity", { required: true })}
                className="input border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.quantity && <span className="text-red-700">Quantity is required</span>}
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Payable Amount</span>
              </div>
              <input
                type="number"
                placeholder="Payable Amount"
                {...register("amount", { required: true })}
                className="input border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.amount && <span className="text-red-700">Amount is required</span>}
            </label>
          </div>
          <div className="flex gap-3">
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Posting date</span>
              </div>
              <input
                type="date"
                placeholder="Posting date"
                {...register("postingDate", { required: true })}
                className="input border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.postingDate && <span className="text-red-700">Posting date is required</span>}
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">Completion Date</span>
              </div>
              <input
                type="date"
                placeholder="Completion date"
                {...register("completionDate", { required: true })}
                className="input border-2 border-[#331B3F] input-bordered w-full"
              />
              {errors.completionDate && <span className="text-red-700">Completion date is required</span>}
            </label>
          </div>
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Submission info</span>
            </div>
            <input
              type="text"
              placeholder="Submission info"
              {...register("SubmissionInfo", { required: true })}
              className="input border-2 border-[#331B3F] input-bordered w-full"
            />
            {errors.SubmissionInfo && <span className="text-red-700">Submission info is required</span>}
          </label>
          <div className="mt-2 mb-2">
            <span className="label-text">Task Image</span> <br />
            <input {...register("image", { required: true })} type="file" className="w-full max-w-xs file-input file-input-bordered file-input-sm" />
            {errors.image && <span className="text-red-700">Image is required</span>}
          </div>
          <button className="btn bg-[#743f8f] lg:w-full text-white lg:text-xl">Add Item </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewTask;








// import { useForm } from "react-hook-form";
// import { FaUtensils } from "react-icons/fa";
// import userAxiosPublic from "../../Hook/userAxiosPublic";
// import useAxiosSecure from "../../Hook/useAxiosSecure";
// import Swal from "sweetalert2";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../../AuthProvider/AuthProvider";
// // import useAuth from "../../Home/useAuth";

// const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
// const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

// const AddNewTask = () => {
//   // const axiosPublic = userAxiosPublic();
//   const axiosSecure = useAxiosSecure();
//   const { user } = useContext(AuthContext);
//   const [availableCoins, setAvailableCoins] = useState(0);






//   const [payments, setPayments] = useState([]);
//   const axiosPublic = userAxiosPublic();
//   // const { user } = useAuth(); // Replace this with the actual user's email

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const res = await axiosPublic.get(`/users/${user?.email}`);
//         setPayments(res.data);
//       } catch (error) {
//         console.error("Error fetching payment data", error);
//       }
//     };

//     fetchPayments();
//   }, [axiosPublic, user?.email]);

//   // Calculate the total amount using reduce method
//    const totalAmount = payments.reduce((sum, payment) => sum + payment.coin, 0);
//    console.log('total amount',totalAmount)

//   console.log("Your payment history", payments);






//   useEffect(() => {
//     const fetchUserCoins = async () => {
//       const res = await axiosSecure.get(`/getUserCoins/${user?.email}`);
//       setAvailableCoins(res.data.coins);
//     };
//     fetchUserCoins();
//   }, [user, axiosSecure]);

//   const { register, handleSubmit, reset,formState: { errors }, } = useForm();

//   const onSubmit = async (data) => {
//     console.log(data);

//     const taskCost = parseFloat(data.quantity) * parseFloat(data.amount);

//     if (taskCost > availableCoins) {
//       Swal.fire({
//         icon: "error",
//         title: "Not available Coin",
//         text: "Purchase Coin",
      
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', data.image[0]);

//     const res = await axiosPublic.post(image_hosting_api, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (res.data.success) {
//       const addNewTask = {
//         title: data.title,
//         details: data.details,
//         quantity: parseFloat(data.quantity),
//         amount: parseFloat(data.amount),
//         completionDate: data.completionDate,
//         postingDate: data.postingDate,
//         SubmissionInfo: data.SubmissionInfo,
//         image: res.data.data.display_url,
//         name: user?.displayName,
//         email: user?.email,
//         createdAt: new Date().toISOString(),
//       };

//       const menuRes = await axiosSecure.post('/addTask', addNewTask);
//       if (menuRes.data.insertedId) {
//         const updateCoinsRes = await axiosSecure.post('/updateUserCoins', {
//           email: user?.email,
//           coins: availableCoins - taskCost,
//         });

//         if (updateCoinsRes.data.success) {
//           Swal.fire({
//             position: "top-center",
//             icon: "success",
//             title: "Task added successfully",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//           reset(); // Reset the form after successful submission
//           setAvailableCoins((prevCoins) => prevCoins - taskCost); // Update the available coins state
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <p className="mt-5 text-4xl font-bold text-center">Add New Task</p>
//       <p className="mt-5 text-3xl font-semibold text-center">Total Coin: {totalAmount}</p>
//       <div className="mt-8 lg:p-10">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="flex gap-3">
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Task Title</span>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Task Title"
//                 {...register("title", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.title && <span className="text-red-700">field is required</span>}
//             </label>
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Task Details</span>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Task Details"
//                 {...register("details", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.details && <span className="text-red-700">field is required</span>}
//             </label>
//           </div>
//           <div className="flex gap-3">
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Task Quantity</span>
//               </div>
//               <input
//                 type="number"
//                 placeholder="Quantity"
//                 {...register("quantity", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.quantity && <span className="text-red-700">field is required</span>}
//             </label>
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Payable Amount</span>
//               </div>
//               <input
//                 type="number"
//                 placeholder="Payable Amount"
//                 {...register("amount", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.amount && <span className="text-red-700">field is required</span>}
//             </label>
//           </div>
//           <div className="flex gap-3">
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Posting Date</span>
//               </div>
//               <input
//                 type="date"
//                 placeholder="Posting date"
//                 {...register("postingDate", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.postingDate && <span className="text-red-700">field is required</span>}
//             </label>
//             <label className="w-full form-control">
//               <div className="label">
//                 <span className="label-text">Completion Date</span>
//               </div>
//               <input
//                 type="date"
//                 placeholder="Completion date"
//                 {...register("completionDate", { required: true })}
//                 className="w-full input input-bordered"
//               />
//               {errors.completionDate && <span className="text-red-700"> field is required</span>}
//             </label>
//           </div>
//           <label className="w-full form-control">
//             <div className="label">
//               <span className="label-text">Submission Info</span>
//             </div>
//             <input
//               type="text"
//               placeholder="Submission info"
//               {...register("SubmissionInfo", { required: true })}
//               className="w-full input input-bordered"
//             />
//             {errors.SubmissionInfo && <span className="text-red-700">field is required</span>}
//           </label>
//           <div className="mt-2 mb-2">
//             <span className="label-text">Task Image</span> <br />
//             <input
//               {...register("image", { required: true })}
//               type="file"
//               className="w-full max-w-xs file-input file-input-bordered file-input-sm"
//             /> <br />
//             {errors.image && <span className="text-red-700">field is required</span>}
//           </div>
//           <button className="btn bg-[#a8d73a] lg:w-full text-white lg:text-xl">
//             Add Item <FaUtensils />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddNewTask;
