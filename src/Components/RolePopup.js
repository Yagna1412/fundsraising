import React from "react";

const RolePopup = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[320px] text-center">

        <h2 className="text-xl font-bold mb-4 text-teal-700">
          Continue As
        </h2>

        <button
          onClick={() => onSelect("USER")}
          className="w-full bg-teal-600 text-white py-2 rounded-lg my-2 hover:bg-teal-700"
        >
          User
        </button>

        <button
          onClick={() => onSelect("ADMIN")}
          className="w-full bg-gray-700 text-white py-2 rounded-lg my-2 hover:bg-gray-800"
        >
          Admin
        </button>

        <button
          onClick={onClose}
          className="text-red-500 mt-3 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RolePopup;
