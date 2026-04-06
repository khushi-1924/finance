import { useState } from 'react'
import type { Role } from '../types'
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
}

const Navbar = ({ role, setRole }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-(--bg-card) border-b border-(--border-color) shadow-md">

      <h1 className="text-xl font-semibold text-white tracking-wide">
        💰 Finance Dashboard
      </h1>

      <div className="relative w-40">
        <button
          onClick={() => setOpen(!open)}
          className="w-full bg-(--bg-main) border border-(--border-color) text-white rounded-lg px-4 py-2 flex justify-between items-center hover:border-gray-500 transition"
        >
          <span className="capitalize">{role}</span>
          <IoIosArrowDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-full bg-(--bg-card) border border-(--border-color) rounded-lg shadow-lg z-50 overflow-hidden">
            {["viewer", "admin"].map((r) => (
              <div
                key={r}
                onClick={() => {
                  setRole(r as Role);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer capitalize transition ${role === r
                    ? "bg-blue-500/20 text-blue-400"
                    : "hover:bg-gray-700 text-gray-200"
                  }`}
              >
                {r}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar
