/* eslint-disable react/prop-types */

import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function Protected({children}) {
    const user = useSelector(state=>state.auth.loggedINUser);
    if(!user){
        return <Navigate to='/'></Navigate>
    }else{
    
        return children;
    }    
}

export default Protected