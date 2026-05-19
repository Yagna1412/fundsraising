import React from 'react';
import { MailIcon } from "lucide-react";

const Contact = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-[#007A8E] mb-4">Contact Us</h2>
      <p className="text-gray-600 mb-6">
        We'd love to hear from you! Reach out anytime.
      </p>

      <div className="space-y-4 text-left">
        <p className="flex items-center text-lg text-gray-800">
          <MailIcon className="text-[#007A8E] mr-3" />
          Email: <span className="ml-2 font-medium">support@myfundraiser.org</span>
        </p>

        <p className="flex items-center text-lg text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-[#007A8E] mr-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72 17.5 17.5 0 0 0 .4 2.18 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 17.5 17.5 0 0 0 2.18.4A2 2 0 0 1 22 16.92z"/>
          </svg>
          Phone: <span className="ml-2 font-medium">+1 (555) 123-4567</span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
