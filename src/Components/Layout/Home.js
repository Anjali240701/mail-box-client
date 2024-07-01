import { useSelector } from "react-redux";
import classes from "./Home.module.css";

const Home = () => {

    const isLogin = useSelector(state => state.authentication.isLogin);

    return (
        <div>
        { isLogin ? (
        <div className={classes.home}>
        <h></h>
        <h1>Welcome to Mail-Box</h1>
        <p>....."Mail-Box@yourservices.com".....</p>
        </div>):(
            <div className={classes.details}>
                <p>Welcome to Mail-Box</p>
                <p1>
                    "Mail-Box@yourservices.com"<br/>
                   
                </p1>
            </div>
        )}
        </div>
    )
};

export default Home;