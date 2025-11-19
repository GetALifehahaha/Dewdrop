import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const GoogleLoginService = ({method}) => {
    const navigate = useNavigate();

    const { googleLogin } = useAuth();

    const handleSuccess = async (credentials) => {
        try {
            const token = credentials.credential;
            await googleLogin(token);

            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }
    
    const handleError = () => console.log("Error"); 
    
    return (
        <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        />
    )
}

export default GoogleLoginService;