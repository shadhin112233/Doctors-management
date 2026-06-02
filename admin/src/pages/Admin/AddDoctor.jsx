import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // অ্যালার্টের বদলে সুন্দর টোস্ট নোটিফিকেশনের জন্য

const AddDoctor = () => {
    const [docImage, setDocImage] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    // কনটেক্সট থেকে প্রজেক্টের নিয়ম অনুযায়ী aToken বা atoken খেয়াল রাখুন
    const { backendUrl, aToken, atoken } = useContext(AdminContext);
    
    // ব্যাকএন্ড মিডলওয়্যার সাধারণত বড় হাতের T (aToken) খোঁজে, তাই ব্যাকআপ হিসেবে দুটোই রাখলাম
    const token = aToken || atoken; 

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImage) {
                return toast.error("Please select a doctor image!");
            }

            const formData = new FormData();
            
            // ১. ফাইলটি 'image' কি-নামেই অ্যাপেন্ড করা হলো (যা ব্যাকএন্ড আশা করছে)
            formData.append('image', docImage);
            
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-doctor', 
                formData, 
                { 
                    headers: { 
                        // ২. হেডারে টোকেন পাঠানোর স্ট্যান্ডার্ড নিয়ম (aToken এবং atoken দুটোই পাঠানো হলো)
                        aToken: token,
                        atoken: token,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );

            if (data.success) {
                toast.success(data.message || "Doctor Added Successfully!");
                // ফর্ম রিসেট করা
                setDocImage(null);
                setName('');
                setEmail('');
                setPassword('');
                setFees('');
                setAbout('');
                setDegree('');
                setAddress1('');
                setAddress2('');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Axios Error Details:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img 
                            className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' 
                            src={docImage ? URL.createObjectURL(docImage) : assets.upload_area} 
                            alt="Upload area" 
                        />
                    </label>
                    <input 
                        onChange={(e) => setDocImage(e.target.files[0] || null)} 
                        type="file" 
                        id="doc-img" 
                        accept="image/*" // শুধুমাত্র ইমেজ ফাইল সিলেক্ট করার জন্য
                        hidden 
                    />
                    <p>Upload Doctor <br /> Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2'>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                                <option value="6 Year">6 Year</option>
                                <option value="7 Year">7 Year</option>
                                <option value="8 Year">8 Year</option>
                                <option value="9 Year">9 Year</option>
                                <option value="10 Year">10 Year</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='fees' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='address 2' required />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write About Doctor' rows={5} required />
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
            </div>
        </form>
    );
};

export default AddDoctor;