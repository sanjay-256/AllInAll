import React, { useState } from 'react'
import TextInput from '../inputfields/TextInput'
import Password from '../inputfields/Password'
import axios from 'axios'
import { FaGoogle } from "react-icons/fa";


const Landing1 = () => {


    const [user, setUser] = useState({
        username: "",
        usernumber: "",
        useremail: "",
        userpassword: "",
        userotp: ""
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
        register:false,
        otpverify: false,
        setpassword: false
    })

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }) 
    }

    const handleChange1 = (e) => {
        setUserin({ ...userin, [e.target.name]: e.target.value }) 
    }
    

    const signin = () => {
        setChange({ ...change, signIn: true, register: false })
        clearForm();
    }

    const signup = () => {
        setChange({ ...change, signIn: false, register: true })
        clearForm1();
    }

    const sendotp = async (e) => {
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
                alert("OTP sent to your mail-id: " + user.useremail);
                setChange((prevstate) => ({ ...prevstate, otpverify: !change.otpverify,register : !change.register}));
            } else if (response.data === "Account already exists") {
                alert("Account already exists.");
            }
            else {
                alert(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const verifyotp = async (e) => {
        if (user.userotp === "") {
            alert("Please enter the OTP.");
            return;
        }
        e.preventDefault();
        try {
            const userData = {
                userotp: user.userotp,
                useremail: user.useremail
            };
            const response = await axios.post(`http://localhost:8080/user/verify-otp/${userData.useremail}/${userData.userotp}`);
            console.log(response);
            if (response.data === "User verified") {
                alert("User " + user.username + " verified");
                setChange((prevstate) => ({ ...prevstate, setpassword: !change.setpassword, otpverify: false }));
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
                useremail: user.useremail
            };
            const response = await axios.post(`http://localhost:8080/user/setpassword/${userData.useremail}/${userData.userpassword}`);
            console.log(response);
            if (response.data === "Password has been set successfully.") {
                alert("Signup successful!");
                setChange((prevstate) => ({
                    ...prevstate, signIn: true,
                    register: false,
                    otpverify: false,
                    setpassword: false
                }));
            } else {
                alert(response.data.message || "Signup failed. Please try again.");
            }
            setUser({
                username: "",
                usernumber: "",
                useremail: "",
                userpassword: "",
                userotp: ""
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onSignin = async (e) => {
        e.preventDefault();
        try {
            if (userin.useremail === "" || userin.userpassword === "") {
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

    const password = async (e) => {
        e.preventDefault();
        try {
            if (userin.useremail) {
                alert("mail sent");
                const response = await axios.get(`http://localhost:8080/user/forgotpass/${userin.useremail}`);
                console.log(response.data);

            } else {
                alert("enter your registered email");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center bg-cover bg-center h-screen opacity-90" style={{ backgroundImage: "url('/bg.jpg')" }}>
                <div className="bg-white opacity-90 rounded-md">
                    <div className="w-full md:w-96 m-auto">

                        {change.signIn &&
                            <div className="signin m-8">
                                <div className="">
                                    <TextInput
                                        className="w-full"
                                        name="useremail"
                                        type="email"
                                        label="Email"
                                        value={userin.useremail}
                                        onChange={handleChange1}
                                        helperText={error.useremail ? error.useremail : "enter email"}
                                    />
                                </div>

                                <div className="mt-2">
                                    <Password
                                        name="userpassword"
                                        value={userin.userpassword}
                                        className="w-full"
                                        helperText={error.userpassword ? error.userpassword : "8characters with @ or # and numbers"}
                                        onChange={handleChange1}
                                    />
                                    <p className="my-3 font-semibold text-blue-600 pl-3 text-sm cursor-pointer flex justify-between">
                                        <span onClick={password}>forget password?</span>
                                        <span onClick={signup}>SignUp account!</span>
                                    </p>
                                </div>

                                <div
                                    onClick={onSignin}
                                    className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 border-green-500 text-green-600 font-medium cursor-pointer hover:bg-green-500 hover:text-white"
                                >
                                    Sign in
                                </div>

                                {/* <div className="flex items-center my-5">
                                <hr className="flex-grow border-black" />
                                <div className="mx-3 font-semibold">Or</div>
                                <hr className="flex-grow border-black" />
                            </div>
                            
                           {/* <FaGoogle className='mx-auto text-2xl'/> */}
                                {/* <img src="google.ico" alt="logo" width={"35px"} className='mx-auto' />  */}

                            </div>
                            }

                        <div className="signup m-8">

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
                                    <p className="my-3 font-semibold text-blue-600 text-right text-sm cursor-pointer">
                                        <span onClick={signin}>SignIn account!</span>
                                    </p>
                                    <div className="my-5 w-36 mx-auto ">
                                        <div className="rounded-lg border-2 border-yellow-500 text-yellow-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-yellow-500 hover:text-white"
                                            onClick={sendotp}
                                        >
                                            Send OTP
                                        </div>
                                    </div>
                                </div>}

                            {change.otpverify &&
                                <div className="">
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
                                    <div className="mt-5 w-36 mx-auto ">
                                        <div className="rounded-lg border-2 border-blue-500 text-blue-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-blue-500 hover:text-white"
                                            onClick={verifyotp}
                                        >
                                            Verify OTP
                                        </div>
                                    </div>
                                </div>}

                            {change.setpassword &&
                                <div className="">
                                    <div className="mt-2">
                                        <Password
                                            name="userpassword"
                                            className="form-control"
                                            value={user.userpassword}
                                            helperText="8 characters with @ or # and numbers"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="w-36 mx-auto mt-4">
                                        <div className="rounded-lg border-2 border-green-500 text-green-500 font-medium w-full py-2 text-center cursor-pointer hover:bg-green-500 hover:text-white"
                                            onClick={onSignup} >
                                            Signup
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing1;
