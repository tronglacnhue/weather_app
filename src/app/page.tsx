'use client'

import Navbar from "@/components/Navbar";
import axios from "axios";
import { parseISO } from "date-fns";
import Image from "next/image";
import format from "date-fns/format";
import { useQuery } from "react-query";

export default function Home() {


  interface WeatherDetail {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }
  
  interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherDetail[];
    city: {
      id: number;
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
    };
  }
  
  const { isLoading, error, data } = useQuery<WeatherData>('repoData', async () => {
    const {data} = await  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=hanoi&appid=49118bebffd3444d4479ce0ad56f6cd9&cnt=56`);
    return data;
  }
    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=49118bebffd3444d4479ce0ad56f6cd9&cnt=56').then(res =>
    //   res.json()
    // )
  )
  // console.log(process.env.NEXT_PUBLIC_WEATHER_KEY);
  // console.log(process.env.NEXT_PUBLIC_VARIABLE);

  if (isLoading) {
    return(
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce"> Loading...</p>
      </div>
    );
  }

  console.log('data', data);
  const firstData = data?.list[0];
  

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen" >
      <Navbar />
      <main className="flex-col px-3 max-w-7x1 mx-auto flex gap-9 w-full pb-10 pt-4 ">
        {/* today data */}
        <section>
          <div>
            <h2 className="flex gap-1 text-2x1 items-end">
              <p> {format(parseISO(firstData?.dt_txt?? ""), "EEEE")} </p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt?? ""), "dd.MM.yyyy")})</p>  
            </h2>
          </div>
        </section>
        {/* 7 days forecast data */}
        <section>

        </section>

      </main>
    </div>
  );
}
