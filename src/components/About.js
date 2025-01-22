import React, { useContext, useState } from 'react'
import "../App.css"
import { TextInput1 } from '../inputfields/TextInput'
import axios from 'axios';
import { AppContext } from '../App';

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    queries: "",
    text:""
  });

  const {BASE_URL} = useContext(AppContext);

  const [submit,setSubmit]=useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
      setSubmit(true);
    try {
      const response=await axios.post(`${BASE_URL}/user/query/${formData.email}/${formData.queries}`);
      if(response.data !=="error"){
        setFormData({ name: "", email: "", queries: "", text: "Message sent successfully..." });
        setSubmit(false);
          setTimeout(()=>{
            setFormData((prev) => ({ ...prev, text: "" }));
          },4000)
      }else if(response.data ==="error"){
        setFormData({ name: "", email: "", queries: "", text: "enter valid email address." });
        setSubmit(false);
          setTimeout(()=>{
            setFormData((prev) => ({ ...prev, text: "" }));
          },4000)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className='p-5'>
      <div className="">
        <div className="text-center mx-auto lg:w-4/6">
          <div className="1 my-10">
            <div className="brand font-semibold text-3xl md:text-4xl">- All In All -</div>
            <p className="ahead text-xl md:text-2xl font-medium">
              "Welcome to All in All! Our shop is your one-stop destination for stylish and quality attire for everyone—men, women, and kids. Whether you're dressing up for a wedding, preparing for a casual day out, or shopping for a special occasion, we have something perfect just for you."
            </p>
          </div>
          <div className="2 my-10">
            <div className="atext1 pb-5 text-3xl md:text-4xl text-right md:pr-10">Inclusivity in Fashion</div>
            <p className="ahead text-xl md:text-2xl font-medium">
              "Welcome to All in All! Our shop is your one-stop destination for stylish and quality attire for everyone—men, women, and kids. Whether you're dressing up for a wedding, preparing for a casual day out, or shopping for a special occasion, we have something perfect just for you."
            </p>
          </div>
          <div className="3 my-10">
            <div className="atext1 pb-5 text-3xl md:text-4xl text-left md:pl-10">Collection for Every Occasion</div>
            <p className="ahead text-xl md:text-2xl font-medium">
              "Our collection is as versatile as our customers. From sophisticated suits for corporate events to dazzling gowns for weddings, cute party outfits for kids, and comfortable casual wear, we truly mean it when we say 'All in All.' Whatever the occasion, we've got you covered!"
            </p>
          </div>
          <div className="4 my-10">
            <div className="atext1 pb-5 text-3xl md:text-4xl text-right md:pr-10">Craftsmanship and Quality</div>
            <p className="ahead text-xl md:text-2xl font-medium">
              "Every piece at All in All is crafted with love and care, ensuring that you receive only the finest quality. We source premium fabrics and partner with skilled designers to bring you stylish yet durable clothing that stands the test of time and trends."
            </p>
          </div>
          <div className="10 my-10">
            <div className="atext1 pb-5 text-3xl md:text-4xl text-left md:pl-10">Shopping Experience Like No Other</div>
            <p className="ahead text-xl md:text-2xl font-medium">
              "Shopping at All in All isn't just about clothes—it's about creating a memorable experience. Our friendly team is here to assist you in finding the perfect fit for every occasion. Visit our store to explore our collection in person or shop online for ultimate convenience. With us, you're always dressed to impress!"
            </p>
          </div>
          <div className="">
            <div className=" md:w-1/2 mx-auto">
              <div className="font-medium text-3xl atext1 pb-5">"We're Here to Listen"</div>
              <form onSubmit={handleSubmit} className="pb-8 md:pb-0">
                <div>
                  <TextInput1
                    className="form-control"
                    name="name"
                    type="text"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    helperText="Enter your full name"
                  />
                </div>

                <div className="mt-2">
                  <TextInput1
                    className="form-control"
                    name="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    helperText="Enter a valid email address"
                  />
                </div>

                <div className="mt-2">
                  <TextInput1
                    className="form-control"
                    name="queries"
                    type="text"
                    label="Queries"
                    value={formData.queries}
                    onChange={handleChange}
                    helperText="Write your queries or concerns"
                  />
                </div>

                <div className="mt-3">
                  <button type="submit" className="w-24 rounded-md mt-4 py-2 mx-auto text-center border-2 bg-[#E23378] border-[#E23378] font-medium cursor-pointer bg-[#E23378] text-white">
                   {!submit? "Submit":"Submiting..."}
                  </button>
                </div>
                <p className="text-[#E23378] pt-2 mb-4 text-md">{formData.text}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
