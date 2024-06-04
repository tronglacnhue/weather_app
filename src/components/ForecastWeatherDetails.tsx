import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import exp from "constants";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { converKelvintoCelsius } from "@/utils/convertKelvintoCelsius";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetails(props: ForecastWeatherDetailProps ) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description
  } = props;
  return(
    <Container className="gap-4">
      {/* left section */}
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon}/>
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {converKelvintoCelsius(temp ?? 296.3 )}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {converKelvintoCelsius(feels_like ?? 0 )}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {converKelvintoCelsius(temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {converKelvintoCelsius(temp_max ?? 0)}
                    °↑
                  </span>
                </p>
                <p className="capitalize">{description}</p>
              </div>
      </section>
      {/* right section */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}