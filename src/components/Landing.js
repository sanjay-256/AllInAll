import React, { useState } from 'react'
import TextInput from '../inputfields/TextInput'
import Password from '../inputfields/Password'
import axios from 'axios'

const Landing = () => {


    const [user, setUser] = useState({
        username: "",
        usernumber: "",
        useremail: "",
        userpassword: "",
        userotp:""
    })

    const [userin, setUserin] = useState({
        useremail: "", userpassword: ""
    })

    const [error, setError] = useState({
        username: "",
        userpassword: ""
    })

    const [change, setChange] = useState({
        signIn: true,
        signUp: false,
        register:true,
        otpverify: false,
        setpassword: false
    })

    const handleChange = (e) => {
        { change.signUp ? setUser({ ...user, [e.target.name]: e.target.value }) : setUserin({ ...userin, [e.target.name]: e.target.value }) }
    }

    const signin = () => {
        setChange({ ...change, signIn: true, signUp: false })
        clearForm();
    }

    const signup = () => {
        setChange({ ...change, signIn: false, signUp: true })
        clearForm1();
    }

    const sendotp=async(e)=>{
        e.preventDefault();
        try {
            const userData = {
                username: user.username,
                useremail: user.useremail,
                usernumber: user.usernumber ? parseInt(user.usernumber, 10) : null,
            };
            const response = await axios.post("http://localhost:8080/user/register", userData);
            console.log(response);
            if (response.data === "Registered successfully") {
                alert("OTP sent to your mail-id: "+user.useremail);
                setChange((prevstate)=>({...prevstate,otpverify:!change.otpverify,register:false}));
            }else if(response.data === "Account already exists"){
                alert("Account already exists.");
            }
             else {
                alert(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const verifyotp=async(e)=>{
        if(user.userotp===""){
            alert("Please enter the OTP.");
            return;
        }
        e.preventDefault();
        try {
            const userData = {
                userotp: user.userotp,
                useremail:user.useremail
            };
            const response = await axios.post(`http://localhost:8080/user/verify-otp/${userData.useremail}/${userData.userotp}`);
            console.log(response);
            if (response.data === "User verified") {
                alert("User "+user.username+" verified");
                setChange((prevstate)=>({...prevstate,setpassword:!change.setpassword,otpverify:false}));
            } else {
                alert(response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const clearForm1 = () => {
        setUserin({
            useremail: '',
            userpassword: '',
        });
        setError({});
    };

    const clearForm = () => {
        setUser({
            username: '',
            usernumber: '',
            useremail: '',
            userpassword: '',
        });
        setError({});
    };


    const onSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                userpassword: user.userpassword,
                useremail:user.useremail
            };
            const response = await axios.post(`http://localhost:8080/user/setpassword/${userData.useremail}/${userData.userpassword}`);
            console.log(response);
            if (response.data === "Password has been set successfully.") {
                alert("Signup successful!");
                setChange((prevstate)=>({...prevstate,signIn: true,
                    signUp: false,
                    register:true,
                    otpverify: false,
                    setpassword: false}));
            } else {
                alert(response.data.message || "Signup failed. Please try again.");
            }
            setUser({
                username: "",
                usernumber: "",
                useremail: "",
                userpassword: "",
                userotp:""
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onSignin = async (e) => {
        e.preventDefault();
        try {
            if(userin.useremail==="" || userin.userpassword===""){
                alert("enter your registered email or password!");
                return;
            }
            const response = await axios.get(`http://localhost:8080/user/login/${userin.useremail}/${userin.userpassword}`);
            const message = response.data;

            if (message.startsWith("Welcome")) {
                alert(message);
                setUserin({
                    useremail: "",
                    userpassword: ""
                });
            } else if (message === "Invalid password") {
                alert("The password entered is incorrect. Please try again.");
            } else if (message === "email not found?..") {
                alert("The email entered is not registered. Please sign up.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const password=async(e)=>{
        e.preventDefault();
        try {
            if(userin.useremail){
                alert("mail sent");
                const response=await axios.get(`http://localhost:8080/user/forgotpass/${userin.useremail}`);
                console.log(response.data);
                
            }else{
                alert("enter your registered email");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <>
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="w-full max-w-6xl">
                    <div className="bg borde rounded-md border-ble-500 mx-3">
                        <div className="text-center">
                            <div className="flex items-center justify-center m-2">
                                <img src="logo.png" alt="logo" className="h-24 w-24 md:h-32 md:w-32" />
                                <div className="text-center text-xl font-bold capitalize">welcome to All in All</div>
                            </div>
                            <p className="text-center font-medium">Sign in to your account or Create a new one</p>
                        </div>

                        <div className="flex justify-evenly my-4 gap-2">
                            <div
                                className={`w-full md:w-36 text-center font-medium py-1 ${change.signIn ? 'border-b-4 border-yellow-500' : ''} cursor-pointer`}
                                onClick={signin}
                            >
                                SignIn
                            </div>
                            <div
                                className={`w-full md:w-36 text-center font-medium py-1 ${change.signUp ? 'border-b-4 border-yellow-500' : ''} cursor-pointer`}
                                onClick={signup}
                            >
                                SignUp
                            </div>
                        </div>
                        {/* signIn */}
                        {change.signIn &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white w-full p-4">
                                <div className="w-full md:w-96 m-auto">
                                    <div className="signin">
                                        <div className="">
                                            <TextInput
                                                className="w-full"
                                                name="useremail"
                                                type="email"
                                                label="Email"
                                                value={userin.useremail}
                                                onChange={handleChange}
                                                helperText={error.useremail ? error.useremail : "enter email"}
                                            />
                                        </div>

                                        <div className="mt-2">
                                            <Password
                                                name="userpassword"
                                                value={userin.userpassword}
                                                className="w-full"
                                                helperText={error.userpassword ? error.userpassword : "8characters with @ or # and numbers"}
                                                onChange={handleChange}
                                            />
                                            <p
                                                // onClick={forgotPass}
                                                className="font-semibold text-blue-600 pl-3 text-xs cursor-pointer"
                                            >
                                               <span onClick={password}>forget password?</span>
                                            </p>
                                        </div>

                                        <div
                                            onClick={onSignin}
                                            className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 border-green-500 text-green-600 font-medium cursor-pointer hover:bg-green-500 hover:text-white"
                                        >
                                            Sign in
                                        </div>

                                    </div>
                                </div>
                                <img src="loginss.avif" alt="logo" className="hidden md:block m-auto" />
                            </div>
                        }
                        {/* signIn */}

                        {/* signup */}
                        {change.signUp &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white w-full p-4">
                                <img src="signup.png" alt="logo" className="hidden md:block m-auto" />
                                <div className="w-full">
                                    <div className="signup">
                                        {/* register */}
                                        {change.register &&
                                        <div>
                                            <div>
                                                <TextInput
                                                    className="form-control"
                                                    name="username"
                                                    type="text"
                                                    label="Name"
                                                    value={user.username}
                                                    onChange={handleChange}
                                                    helperText="all letters without special symbols"
                                                />
                                            </div>

                                            <div className="mt-2">
                                                <TextInput
                                                    className="form-control"
                                                    name="usernumber"
                                                    type="number"
                                                    label="Number"
                                                    value={user.usernumber}
                                                    onChange={handleChange}
                                                    helperText="10 digits"
                                                />
                                            </div>

                                            <div className="mt-2">
                                                <TextInput
                                                    className="form-control"
                                                    name="useremail"
                                                    type="email"
                                                    label="Email"
                                                    value={user.useremail}
                                                    onChange={handleChange}
                                                    helperText="enter a valid email"
                                                />
                                            </div>
                                            <div className="my-5">
                                                <div className="w-36 mx-auto rounded-lg border-2 border-yellow-500 text-yellow-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-yellow-500 hover:text-white"
                                                    onClick={sendotp}
                                                     >
                                                    Send OTP
                                                </div>
                                            </div>
                                        </div>}
                                        {/* register */}

                                        {/* otpverify */}
                                        {change.otpverify && <div className="">
                                            <div className="text-center text-black">
                                                <div className="font-semibold text-xl">OTP Verification</div>
                                                <div className="font-medium pb-3">otp sent to your email</div>
                                                <TextInput
                                                    className="form-control"
                                                    name="userotp"
                                                    type="text"
                                                    label="Verification Code..."
                                                    value={user.userotp}
                                                    onChange={handleChange}
                                                    helperText="enter the otp sent to your mail-id"
                                                />
                                                <div className="font-medium mt-2">Didn't receive otp? <span className='text-blue-500 hover:cursor-pointer' onClick={sendotp} >Resend otp</span></div>
                                            </div>
                                            <div className="mt-5">
                                                <div className="w-36 mx-auto rounded-lg border-2 border-blue-500 text-blue-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-blue-500 hover:text-white"
                                                    onClick={verifyotp}
                                                     >
                                                    Verify OTP
                                                </div>
                                            </div>
                                        </div>}
                                        {/* otpverify */}

                                        {/* setpassword */}
                                       {change.setpassword && <div className="">
                                        <div className="mt-2">
                                            <Password
                                                name="userpassword"
                                                className="form-control"
                                                value={user.userpassword}
                                                helperText="8 characters with @ or # and numbers"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className=" mt-4">
                                            <div className="w-36 mx-auto rounded-lg border-2 border-green-500 text-green-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-green-500 hover:text-white"
                                                onClick={onSignup} >
                                                Signup
                                            </div>
                                        </div>
                                        </div>}
                                         {/* setpassword */}
                                    </div>
                                </div>
                            </div>
                        }
                        {/* signup */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default Landing
