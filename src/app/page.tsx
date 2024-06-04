'use client'

import Navbar from "@/components/Navbar";
import axios from "axios";
import { fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import format from "date-fns/format";
import { useQuery } from "react-query";
import Container from "@/components/Container";
import WeatherIcon from "@/components/WeatherIcon";
import { converKelvintoCelsius } from "@/utils/convertKelvintoCelsius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import WeatherDetails from "@/components/WeatherDetails";
import { convertWindSpeed } from "@/utils/converWindSpeed";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";
import { useAtom } from "jotai";
import { placeAtom } from "./atom";
import { useEffect } from "react";

export default function Home() {
  const[place, setPlace] = useAtom(placeAtom);

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
  
  const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () => {
    const {data} = await  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=49118bebffd3444d4479ce0ad56f6cd9&cnt=56`);
    return data;
  }
    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=49118bebffd3444d4479ce0ad56f6cd9&cnt=56').then(res =>
    //   res.json()
    // )
  )
  useEffect( () => {
    refetch();
  }, [place, refetch] );
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

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen" >
      <Navbar location={data.city.name} />
      <main className="flex-col px-3 max-w-7x1 mx-auto flex gap-9 w-full pb-10 pt-4 ">
        {/* today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2x1 items-end">
              <p> {format(parseISO(firstData?.dt_txt?? ""), "EEEE")} </p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt?? ""), "dd.MM.yyyy")})</p>  
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temprature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {converKelvintoCelsius(firstData?.main.temp ?? 296.3 )}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {converKelvintoCelsius(firstData?.main.feels_like ?? 0 )}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {converKelvintoCelsius(firstData?.main.temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {converKelvintoCelsius(firstData?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map( (d, i) =>(
                  <div
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a" )}
                    </p>
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt) } />
                    <p>{converKelvintoCelsius(d?.main.temp ?? 296.3 )}°</p>
                  </div>
                ))}
              </div>
            </Container>
            <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">{firstData.weather[0].description}</p>
                  <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon, firstData?.dt_txt) } />
                </Container>

                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto ">
                  <WeatherDetails visability={metersToKilometers(firstData?.visibility ?? 1000 )}
                  airPressure={`${firstData.main.pressure} hPa`}
                  humidity={`${firstData.main.humidity}%`}
                  sunrise={format(fromUnixTime(data?.city.sunrise), "H:mm")}
                  sunset={format(fromUnixTime(data?.city.sunset), "H:mm")}
                  windSpeed={convertWindSpeed(firstData?.wind.speed)}         
                  />
                </Container>

            </div>
          </div>
        </section>
        {/* 7 days forecast data */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2x1">Forecast (7 days)</p>
          {firstDataForEachDate.map( (d, i) => (
            <ForecastWeatherDetails
            key={i}
            description={d?.weather[0].description ?? ""}
            weatherIcon={d?.weather[0].icon ?? "01d"}
            date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
            day={d ? format(parseISO(d.dt_txt), "EEEE") : "EEEE"}
            feels_like={d?.main.feels_like ?? 0}
            temp={d?.main.temp ?? 0}
            temp_max={d?.main.temp_max ?? 0}
            temp_min={d?.main.temp_min ?? 0}
            airPressure={`${d?.main.pressure} hPa `}
            humidity={`${d?.main.humidity}% `}
            sunrise={format(
              fromUnixTime(data?.city.sunrise ?? 1702517657),
              "H:mm"
            )}
            sunset={format(
              fromUnixTime(data?.city.sunset ?? 1702517657),
              "H:mm"
            )}
            visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
            windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
          />
          ) )}
        </section>

      </main>
    </div>
  );
}
