import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import data from "./data.json";

const ScheduleChart = (props) => {
  const [selectedDate, setSelectedDate] = useState("");

  // Filter data based on the selected date and count the number of scheduled meals for each time slot
  const counts = data.reduce((acc, { schedule_time, slot, item_date }) => {
    if (item_date === selectedDate) {
      const time = d3.timeFormat("%I %p")(new Date(schedule_time));
      acc[time] = acc[time] || { L: 0, D: 0 };
      acc[time][slot]++;
    }
    return acc;
  }, {});
  // Create a bar chart using D3.js
  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(Object.keys(counts));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(Object.values(counts).map(({ L, D }) => L + D))]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(Object.entries(counts))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", ([time]) => x(time) || 0)
      .attr("y", ([, { L, D }]) => y(L + D))
      .attr("width", x.bandwidth())
      .attr("height", ([, { L, D }]) => height - y(L + D))
      .attr("fill", ({ [1]: { L, D } }) =>
        L > 0 && D > 0 ? "orange" : L > 0 ? "green" : D > 0 ? "blue" : "gray"
      );
  }, [counts]);

  // Render a date selector and update the chart on selection change
  return (
    <>
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        <option value="">Select a date</option>
        {Array.from(new Set(data.map(({ item_date }) => item_date))).map(
          (date) => (
            <option key={date} value={date}>
              {date}
            </option>
          )
        )}
      </select>
      <div id="chart"></div>
    </>
  );
};

export default ScheduleChart;
