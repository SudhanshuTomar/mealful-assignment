import React, { useState, useEffect } from "react";
import ScheduleChart from "./ScheduleChart";

const ScheduleChartContainer = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataUrl = "/scheduling_data.json";
    fetch(dataUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        const jsonStr = JSON.stringify(jsonData);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        setData(url);
      });
  }, []);

  return <ScheduleChart dataUrl={data} />;
};

export default ScheduleChartContainer;
