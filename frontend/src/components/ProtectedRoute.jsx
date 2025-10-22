import {Navigate} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({children}) => {

  const {isAuthorized} = useContext(AuthContext);

  if (isAuthorized == null) {
    return <div className="w-screen h-screen felx justify-center items-center text-text/50">
      <h5>Waiting</h5>
      <h5>Please wait for a bit</h5>
    </div>
  }

  return isAuthorized ? children : <Navigate to='/login'/>;

}

export default ProtectedRoute;
