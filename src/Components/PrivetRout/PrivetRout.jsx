
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Home/useAuth";
import { Player } from "@lottiefiles/react-lottie-player";
// import useAuth from "../Hook/useAuth";


const PrivetRout = ({children}) => {
    const {user,loading} = useAuth()
    const location = useLocation()
    if(loading){

      
        return <div className="flex justify-center mt-40"><span className="w-40 loading loading-spinner "></span> </div>

    }
    if(user){ 
        return children;
    }
    return <Navigate to ='/login' state={{from: location}} replace></Navigate>
};

export default PrivetRout;