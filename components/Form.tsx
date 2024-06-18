import React, { useState, ChangeEvent, FormEvent } from 'react';
import './UserForm.css';

interface FormData {
  name: string;
  email: string;
  acceptMarketing: boolean;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    acceptMarketing: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form Data:', formData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group checkbox-group">
        <label htmlFor="acceptMarketing" className='acceptMarketing'>
          <input
          style={{marginLeft: 5}}
            type="checkbox"
            id="acceptMarketing"
            name="acceptMarketing"
            checked={formData.acceptMarketing}
            onChange={handleChange}
          />
          Accept Marketing Content
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
