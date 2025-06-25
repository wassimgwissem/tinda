import React from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#E9E8E8" }}>
      <div className="container py-5 min-vh-100">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-outline-dark mb-4"
        >
          ← Back Home
        </button>

        <h1 className="display-4 mb-4">Contact Us</h1>
        
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email"
                  style={{ outline: 'none', boxShadow: 'none',borderColor:"black" }}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="subject"
                  style={{ outline: 'none', boxShadow: 'none' ,borderColor:"black"}}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea 
                  className="form-control" 
                  id="message" 
                  rows="5"
                  style={{ outline: 'none', boxShadow: 'none',borderColor:"black"}}
                ></textarea>
              </div>
              
              <button onClick={()=>navigate('/')} className="btn btn-dark">
                Send Message
              </button>
            </form>
          </div>
          
          <div className="col-md-6 mt-4 mt-md-0">
            <div className="card bg-light p-4">
              <h3 className="h5">Other Ways to Reach Us</h3>
              <ul className="list-unstyled">
                <li className="mb-2">📧 email@example.com</li>
                <li className="mb-2">📞 (123) 456-7890</li>
                <li>📍 City, Country</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;