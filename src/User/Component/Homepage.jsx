import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            const validationErrors = {};

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formData.email) {
                validationErrors.email = "Invalid email address";
            } else if (!emailRegex.test(formData.email)) {
                validationErrors.email = "Email not in valid format"
            }

            if (Object.keys(validationErrors).length > 0) {
                setFormErrors(validationErrors);
                return;
            }

            navigate(`/uservideocall?useremail=${formData.email}`)
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className='flex items-center justify-center h-screen'
                style={{
                    backgroundImage: `url(${'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSim4SKftI0Zi0ZGZsxREadX3rdE7Cb41AjA&usqp=CAU'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh'
                }}>
                <div className='form-overlay grid bg-blue-500 px-5 py-5'>
                    <h1 className='text-center text-slate-500 font-bold mb-3'>Video Call</h1>
                    <input
                        className='border border-slate-500 rounded px-3 py-2'
                        type="text"
                        name="email"
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && (
                        <span className="text-red-500 text-xs">
                            {formErrors.email}
                        </span>
                    )}
                    <button className='bg-buttonColor mt-3 rounded text-white px-3 py-1 hover:bg-green-500' type='submit'>Submit</button>
                </div>
            </form>
        </>

    )
}

export default Homepage
