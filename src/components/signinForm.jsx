import React, { useState } from 'react';
import COVERIMAGE from './2021-07-27.jpg';
import outpassListData from '../constants/fakeOutpass'
import { getFirestore, collection, doc, updateDoc, getDoc, addDoc, writeBatch} from "firebase/firestore";
import app from '../firebase'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom';

const db = getFirestore(app);

const fetchTeacherByEmail = async (email) => {
  const facultyCollection = collection(db, "faculty");

  try {
    const query = doc(facultyCollection, email);
    const docSnap = await getDoc(query);
    if (docSnap.exists()) {
      const role = docSnap.data().role;
      const teacherData = { email, role };
      return teacherData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching teacher document:", error);
    return null;
  }
};

const colors = {
  primary: "#060606",
  background: '#f5f5f5',
  disabled: "#D9D9D9"
}

function LoginForm() {
  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    fontSize: '1rem',
    fontWeight: 'normal',
    color: 'white',
  };

  const [email, setEmail] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState(['', '', '', '']);

  const [generatedOTP, setGeneratedOTP] = useState('');

  const navigate = useNavigate();

  // Function to generate a random string that matches a specific regex pattern


  const generateOTP = () => {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
  };

  const sendEmail = (templateParams) => {
    const serviceID = 'service_ia31v4m';
    const templateID = 'template_tzfu265';
    const userID = 'nCJm866AKCN_Onjn-';
    
    emailjs.send(serviceID, templateID, templateParams, userID)
      .then(response => {
        console.log('Email successfully sent!', response);
      })
      .catch(err => console.error('There has been an error. Here some thoughts on the error that occurred:', err));
  };

  const handleEmailSubmit = async () => {
    if (email.endsWith('iiitdwd.ac.in')) {
      
      const otp = generateOTP();
      setGeneratedOTP(otp.toString()); 
      let form = {
        from_name: "Project_X",
        to_name: "Aniket Raj",
        message: `Your OTP is ${otp}`,
        reply_to: email
      }

      sendEmail(form);
      console.log(otp)
      setShowOTPInput(true);
    } else {
      alert('Invalid email domain. Use an iiitdwd.ac.in email.');
    }
  };

  const handleOTPChange = (index, value) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);
  };

  const handleLogin = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP === generatedOTP) {
      const emailPattern = /^(\d{2}[a-zA-Z]{3}\d{3})@iiitdwd.ac.in$/;

      const routingPattern = /^[0-9]{2}[a-zA-Z]{3}[0-9]{3}$/;
      const generateRoutingString = (pattern) => {
        let routingString = '';
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] === '0') {
            routingString += characters[Math.floor(Math.random() * 10)];
          } else if (pattern[i] === 'a') {
            routingString += characters[Math.floor(Math.random() * 26) + 10];
          }
        }
      
        return routingString;
      };
      const routingString = generateRoutingString(routingPattern);

      if (email.match(emailPattern)) {
        // Student route
        navigate(`/${routingString}/student?`, { state: email });
      } else if (email === 'admin@example.com') { // Replace with your specific admin email
        // Admin route
        window.location.href = `/${routingString}/upload`;
      } else {
        // Faculty route
        const facultyData = await fetchTeacherByEmail(email);
        if (facultyData) {
          // Redirect to faculty page with faculty data
          navigate(`/${routingString}/faculty?`, { state: { email: email, role: facultyData.role } });
        } else {
          alert('Invalid email. Please try again.');
        }
      }

    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className='w-full h-screen flex items-start'>
      <div className='relative w-1/2 h-full flex flex-col'>
        <div className='absolute top-[76%] left-[10%] flex flex-col'>
          <h1 style={headingStyle}>Outpass Portal</h1>
          <p style={paragraphStyle}>Your accounts have already been made. Proceed with Login</p>
        </div>
        <img src={COVERIMAGE} className='w-full h-full object-cover' />
      </div>

      <div className='w-1/2 h-full bg-[#f5f5f5] flex items-center p-14'>
        <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg'>
          {showOTPInput ? (
            <>
              <h2 style={{ fontSize: '1.5rem' }} className='font-semibold mb-4 text-center'>Enter OTP</h2>
              <div className='flex mb-4'>
                {otp.map((digit, index) => (
                    <input
                    key={index}
                    type='text'
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px',
                    }}
                    className='w-12 h-12 text-center border-2 border-gray-500 rounded shadow-sm mx-2'
                    value={digit}
                    onChange={(e) => {
                        if (e.target.value.length === 1) {
                        handleOTPChange(index, e.target.value);
                        if (index < otp.length - 1) {
                            document.getElementById(`otp-input-${index + 1}`).focus();
                        }
                        }
                    }}
                    maxLength={1}
                    id={`otp-input-${index}`}
                    />
                ))}
            </div>
              <button
                className='w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none'
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem' }} className='font-semibold mb-4 text-center'>Welcome!</h2>
              <div className='mb-4'>
                <label className='text-gray-800 mb-2' htmlFor='email'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '8px',
                  }}
                  className='w-full px-4 py-2 border-4 border-gray-500 rounded shadow-sm'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className='w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none'
                onClick={handleEmailSubmit}
              >
                {email.endsWith('iiitdwd.ac.in') ? 'Generate OTP' : 'Submit Email'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
