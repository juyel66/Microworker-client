
// import { FcGoogle } from "react-icons/fc";
// import useAuth from "../Hook/useAuth";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import userAxiosPublic from "../Hook/userAxiosPublic";

import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import userAxiosPublic from "../Hook/userAxiosPublic";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";


const SocialLogin = () => {
    // const {googleSignIn} = useAuth();
    const {googleSignIn} =  useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation()
    const axiosPublic = userAxiosPublic();

    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = ()=>{
        googleSignIn()
        .then(result =>{
            console.log(result.user);
            const userInfo = {
                email: result.user?.email,
                name: result.user?.displayName,
                photoURL: result.user?.photoURL,
                role: "worker"
            
                
            }
            console.log(userInfo)
            axiosPublic.post('/users', userInfo)
            .then(res =>{
                console.log(res.data)
            })
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Google login  successful",
                showConfirmButton: false,
                timer: 2000
              });
              navigate(from, {replace: true});
            
        })
        .catch(error =>{
            console.error(error);
        })

    }
    return (
        <div>
           <div onClick={handleGoogleSignIn} className="flex items-center h-12 gap-2 mb-2 mr-10 font-semibold border-2 border-gray-800 hover:bg-gray-300 btn lg:ml-10 ml-14 lg:text-2xl rounded-xl">
            <p className=""> <FcGoogle></FcGoogle> </p>
            <p>Sign up with google</p>
           </div>
            
        </div>
    );
};

export default SocialLogin;