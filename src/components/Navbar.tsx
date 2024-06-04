'use client'

import axios from "axios";
import React, { useState } from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";

type Props = {};
 
export default function Navbar({}: Props ) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // API_KEY = process.env.NEXT_PUBLIC_KEY;

  const handleChange = async (value: string) =>  {
    setCity(value);
    if(value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=49118bebffd3444d4479ce0ad56f6cd9`);
        const suggestions = response.data.list.map( (item:any) => item.name );
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(true)
      }
    }
  }

  const handleSubmit = () => {
    console.log(city);
  }
  return(
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white" >
      <div className="h-[80px]      w-full     flex      justify-between items-center max-w-7x1 px-3 mx-auto" >
        <p className="flex items-center justify-center gap-2 " >
          <h2 className="text-gray-500 text-3x1" > Weather</h2>
          <MdWbSunny className="text-3x1 mt-1 text-yellow-300" />
        </p>

        <section className="flex gap-2 items-center">
        <MdOutlineMyLocation className="text-2x1 text-gray-400 hover:opacity-80 cursor-pointer" />
        <MdOutlineLocationOn className="text-3x1"/>
        <p className="text-slate-900/80 text-sm">Vietnam</p>
        <div>
          <SearchBox value={city} onChange={(e) => handleChange(e.target.value)} onSubmit={handleSubmit}/>
        </div>
        </section>  
      </div>
    </nav>
  );
}