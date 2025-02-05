import React, { useState,useContext } from 'react'
import { TextInput } from '../inputfields/TextInput'
import Password from '../inputfields/Password'
import axios from 'axios'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App';
import { toast } from 'react-toastify'

const Landing2 = () => {
  
  const {BASE_URL} = useContext(AppContext);
  const navigate=useNavigate();
    const [proceding, setProceding] = useState(false);
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
    register: false,
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
      if (!user.username || !user.useremail || !user.usernumber) {
        toast.error("Please fill in all details.");
        return; 
      }
      setProceding(true);
      const userData = {
        username: user.username,
        useremail: user.useremail,
        usernumber: user.usernumber ? parseInt(user.usernumber, 10) : null,
      };
      const response = await axios.post(`${BASE_URL}/user/register`, userData);
      console.log(response);
      if (response.data === "Registered successfully") {
        toast.success("OTP sent to your mail-id: " + user.useremail);
        setChange((prevstate) => ({ ...prevstate, otpverify: !change.otpverify, register: !change.register }));
        setProceding(false);
      }else if (response.data === "user not verified") {
        toast.warn("Account already exists, redirecting to verification", { duration: 3000 });
        setTimeout(()=>{
          toast.success("OTP sent to your mail-id: " + user.useremail, { duration: 5000 });
          setChange((prevstate) => ({ ...prevstate, otpverify: !change.otpverify, register: !change.register }));
        },4000);
      }
       else if (response.data === "Account already exists") {
        toast.error("Account already exists.");
      }
      else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setProceding(false);
    }
  }

  const resendOtp=async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/user/resendotp/${user.useremail}`);
      if(response.data==="otp sent"){
        toast.success("Your otp is sent to your mail "+user.useremail)
      }else{
        toast.error("check the connection");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const verifyotp = async (e) => {
    if (user.userotp === "") {
      toast.info("Please enter the OTP.");
      return;
    }
    e.preventDefault();
    try {
      const userData = {
        userotp: user.userotp,
        useremail: user.useremail
      };
      const response = await axios.post(`${BASE_URL}/user/verify-otp/${userData.useremail}/${userData.userotp}`);
      console.log(response);
      if (response.data === "User verified") {
        toast.success("User " + user.username + " verified");
        setChange((prevstate) => ({ ...prevstate, setpassword: !change.setpassword, otpverify: false }));
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
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
      const response = await axios.post(`${BASE_URL}/user/setpassword/${userData.useremail}/${userData.userpassword}`);
      console.log(response);
      if (response.data === "Password has been set successfully.") {
        toast.success("Signup successful!");
        localStorage.setItem('allinall', 'true');
        localStorage.setItem('useremail',user.useremail);
        navigate("/home");
        // setIsRegistered(true);
        setChange((prevstate) => ({
          ...prevstate, signIn: true,
          register: false,
          otpverify: false,
          setpassword: false
        }));
      } else {
        toast.error(response.data.message || "Signup failed. Please try again.");
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
        toast.warn("enter your registered email or password!");
        return;
      }
      const response = await axios.get(`${BASE_URL}/user/login/${userin.useremail}/${userin.userpassword}`);
      const message = response.data;

      if (message.startsWith("Welcome")) {
        localStorage.setItem('allinall', 'true');
        localStorage.setItem('useremail',userin.useremail);
        toast.success(message);
        navigate("/home")
        setUserin({
          useremail: "",
          userpassword: ""
        });
      } else if (message === "Invalid password") {
        toast.warn("The password entered is incorrect. Please try again.");
      } else if (message === "email not found?..") {
        toast.error("The email entered is not registered. Please sign up.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const password = async (e) => {
    e.preventDefault();
    try {
      if (userin.useremail) {
        toast.info("mail sent");
        const response = await axios.get(`${BASE_URL}/user/forgotpass/${userin.useremail}`);
        console.log(response.data);

      } else {
        toast.warn("enter your registered email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <>
      <div className="h-svh flex justify-center items-center relative">
        {/* Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/bg.mhtml')" }}
        ></div>

        {/* Foreground Container with Overlay */}
        <div
          className="w-[360px] md:h-[680px] h-full md:rounded-md shadow-2xl bg-no-repeat bg-cover relative z-10"
          style={{ backgroundImage: "url('/bg1.jpg')" }}
        >
          {/* Overlay Layer */}
          <div className="absolute inset-0 bg-black opacity-50 md:rounded-md"></div>

          {/* Text Content */}
          <div className=" relative z-20 text-white font-semibold brand text-5xl text-center mt-28">
            All in All
          </div>

          {change.signIn && <><div className=" relative z-20 text-slate-300 text-2xl text-center my-12">User Login</div>
            <div className="relative z-20 signin m-4">
              <div className="">
                <TextInput
                  className="w-full"
                  name="useremail"
                  type="email"
                  label="Email"
                  value={userin.useremail}
                  onChange={handleChange1}
                  helperText={error.username||"enter email"}
                />
              </div>

              <div className="mt-2">
                <Password
                  name="userpassword"
                  value={userin.userpassword}
                  className="w-full"
                  helperText={"8characters with @ or # and numbers"}
                  onChange={handleChange1}
                />
                <p className="my-3 font-semibold text-white pl-3 text-sm cursor-pointer flex justify-between">
                  <span onClick={password}>forget<span className="text-slate-400 pr-1"> Password?</span></span>
                  <span onClick={signup}><span className="text-slate-400 pr-1">New User</span> SignUp</span>
                </p>
              </div>

              <div
                onClick={onSignin}
                className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 bg-[#8A2BE2] border-[#8A2BE2] text-white md:bg-transparent md:text-[#8A2BE2] font-medium cursor-pointer hover:bg-[#8A2BE2] hover:text-white"
              >
                Sign In
              </div>

            </div></>}

          <div className="signup m-3 relative z-20">
            {change.register &&
              <div>
                <div className="text-slate-300 text-2xl text-center mt-12 mb-8">User Register</div>
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
                <p className="my-3 font-semibold text-white text-right text-sm cursor-pointer">
                  <span onClick={signin}><span className="text-slate-400 pr-1">User</span> SignIn</span>
                </p>
                <div className="my-5 flex justify-center ">
                  <button className={`${proceding?"bg-[#8A2BE2] border-[#8A2BE2] text-white":""} w-fit rounded-md mt-4 p-2 mx-auto text-center border-2 bg-[#8A2BE2] border-[#8A2BE2] text-white md:bg-transparent md:text-[#8A2BE2] font-medium cursor-pointer hover:bg-[#8A2BE2] hover:text-white`}
                    onClick={sendotp}
                    disabled={proceding}
                  >
                   {proceding? "Sending OTP..." :"Send OTP"}
                  </button>
                </div>
              </div>}

            {change.otpverify &&
              <div className="">
                <div className="text-center">
                  <div className="text-slate-300 text-2xl mb-5">OTP Verification</div>
                  <div className="font-medium pb-3 text-white">otp sent to your email</div>
                  <TextInput
                    className="form-control"
                    name="userotp"
                    type="text"
                    label="Verification Code..."
                    value={user.userotp}
                    onChange={handleChange}
                    helperText="enter the otp sent to your mail-id"
                  />
                  <div className="font-medium mt-2 text-slate-400">Didn't receive otp? <span className='text-white hover:cursor-pointer' onClick={resendOtp} >Resend otp</span></div>
                </div>
                <div className="mt-5 w-36 mx-auto ">
                  <div className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 bg-[#8A2BE2] border-[#8A2BE2] text-white md:bg-transparent md:text-[#8A2BE2] font-medium cursor-pointer hover:bg-[#8A2BE2] hover:text-white"
                    onClick={verifyotp}
                  >
                    Verify OTP
                  </div>
                </div>
              </div>}

            {change.setpassword &&
              <div className="">
                <div className="text-slate-300 text-2xl text-center my-12">User Password</div>
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
                  <div className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 bg-[#8A2BE2] border-[#8A2BE2] text-white md:bg-transparent md:text-[#8A2BE2] font-medium cursor-pointer hover:bg-[#8A2BE2] hover:text-white"
                    onClick={onSignup} >
                    Signup
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing2
