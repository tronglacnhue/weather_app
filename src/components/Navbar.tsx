'use client'

import axios from "axios";
import React, { useState } from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useAtom } from "jotai";
import { placeAtom } from "@/app/atom";

type Props = {location?: string};
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;
 
export default function Navbar({location}: Props ) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  // console.log(API_KEY)

  const handleInputChange = async (value: string) =>  {
    setCity(value);
    if(value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=49118bebffd3444d4479ce0ad56f6cd9`);
        const suggestion = response.data.list.map( (item:any) => item.name );
        setSuggestions(suggestion);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
        setSuggestions([]);
        setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (value: string) => {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(suggestions.length === 0) {
      setError("Location not found");
    } else {
      setError("");
      setShowSuggestions(false);
      setPlace(city);
    }
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
        <p className="text-slate-900/80 text-sm">{location}</p>
        <div>
          <SearchBox value={city} onChange={(e) => handleInputChange(e.target.value)} onSubmit={(e) => handleSubmitSearch(e) }/>
          <SuggestionBox 
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error
            }}
          />
        </div>
        </section>  
      </div>
    </nav>
  );
}

function SuggestionBox ({
  showSuggestions,
  suggestions, 
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item:string) => void;
  error: string;
}) {
  return(
    <>
    { ((showSuggestions && suggestions.length > 1) || error) &&  (
      <ul className="mb-4 bg-white absolute border top-[44px] border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
        {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 "> {error}</li>
        )}
        {suggestions.map( (d, i) => (
          <li key={i} onClick={() => handleSuggestionClick(d) } className="cursor-pointer p-1 rounded hover:bg-gray-200">{d}</li>
        ) )}
        
      </ul>
    )}
    </>
  );
}