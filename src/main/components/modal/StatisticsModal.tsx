import React, { ReactNode } from "react";
import Modal from "./Modal";
import { GameState } from "../../Main";
import Plot from "react-plotly.js";
import { Layout } from "plotly.js";
import { Data } from "plotly.js";
import { useTheme } from "../../../theme/Theme";

const DAY = new Date().getDay();

interface StatisticsModalProps {
  closeModal: () => void;
  blitz4x4State: GameState;
  blitz5x5State: GameState;
  marathonState: GameState;
}

const StatisticsModal = (props: StatisticsModalProps) => {
  const { closeModal, blitz4x4State, blitz5x5State, marathonState } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //Define y values for chart
  const weeklyPoints = [
    blitz4x4State.weeklyPoints,
    blitz5x5State.weeklyPoints,
    marathonState.weeklyPoints,
  ];
  const title = [1, 2, 3, 4, 5, 6, 7];
  const scoreThresholds = [
    [0, 20, 40, 75, 100, 140, 180],
    [0, 20, 40, 75, 100, 120, 150],
    [0, 50, 100, 200, 300, 400, 500],
  ];
  let weeklyStarCount = [];
  for (let i = 0; i < 3; i++) {
    let starCount = [];
    for (let j = 0; j < 7; j++) {
      let currentTitle = 0;
      for (let k = 0; k < 7; k++) {
        if ((weeklyPoints[i][j] ?? -1) >= scoreThresholds[i][k]) {
          currentTitle = title[k];
        }
      }
      starCount.push(currentTitle);
    }
    weeklyStarCount.push(starCount);
  }

  //Weekly star distribution data
  const data = {
    x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    y1: weeklyStarCount[0],
    y2: weeklyStarCount[1],
    y3: weeklyStarCount[2],
    groupName1: "4x4 Blitz ⚡",
    groupName2: "5x5 Blitz ⏰",
    groupName3: "Marathon 🏃",
  };
  const trace1: Data = {
    x: data.x,
    y: data.y1,
    hoverinfo: "none",
    name: `<span style="color:${isDark ? "#ffffff" : "#000000"}">${
      data.groupName1
    }</span>`,
    type: "bar",
    marker: {
      color: "#6fb05c",
    },
  } as Data;

  const trace2: Data = {
    x: data.x,
    y: data.y2,
    hoverinfo: "none",
    visible: "legendonly",
    name: `<span style="color:${isDark ? "#ffffff" : "#000000"}">${
      data.groupName2
    }</span>`,
    type: "bar",
    marker: {
      color: "#cfaa09", // Set the color for trace2 bars
    },
  } as Data;

  const trace3: Data = {
    x: data.x,
    y: data.y3,
    hoverinfo: "none",
    visible: "legendonly",
    name: `<span style="color:${isDark ? "#ffffff" : "#000000"}">${
      data.groupName3
    }</span>`,
    type: "bar",
    marker: {
      color: "#447adb", // Set the color for trace3 bars
    },
  } as Data;

  const layout: Partial<Layout> = {
    barmode: "group",
    margin: {
      l: 50, // Left margin
      r: 40, // Right margin
      b: 50, // Bottom margin
      t: 20, // Top margin (reduced to minimize white space)
      pad: 4, // Padding around the chart
    },
    xaxis: {
      tickfont: {
        color: isDark && "#ffffff",
      },
      fixedrange: true, // Disable zoom along x-axis
    },
    yaxis: {
      tickfont: {
        color: isDark && "#ffffff",
      },
      range: [0.5, 7.5],
      tickvals: [1, 2, 3, 4, 5, 6, 7],
      ticktext: ["1", "2", "3", "4", "5", "✨", "🌠"],
      fixedrange: true, // Disable zoom along y-axis
    },
    legend: {
      bgcolor: isDark && "#121213",
      orientation: "h",
      xanchor: "center",
      y: -0.15,
      x: 0.5,
    },
    dragmode: false, // Disable zoom by dragging
  } as Partial<Layout>;

  const config = {
    displayModeBar: false, // Disable the modebar
  };

  const todaysResults = [
    {
      mode: "4x4 Blitz",
      score: blitz4x4State.weeklyScores[DAY],
      points: blitz4x4State.weeklyPoints[DAY],
    },
    {
      mode: "5x5 Blitz",
      score: blitz5x5State.weeklyScores[DAY],
      points: blitz5x5State.weeklyPoints[DAY],
    },
    {
      mode: "Marathon",
      score: marathonState.weeklyScores[DAY],
      points: marathonState.weeklyPoints[DAY],
    },
  ];

  const StatisticsNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text text-align-center">
        <b>Today's Results:</b>
      </p>
      <div className="statistics-todays-results-container">
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {todaysResults.map(({ mode, score, points }, index) => (
              <tr key={index}>
                <td className="statistics-table-cell">{mode}</td>
                <td className="statistics-table-cell">
                  {score !== null
                    ? `${score} ${
                        score === 1 ? "word" : "words"
                      } / ${points} points`
                    : "No results today"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="modal-text text-align-center">
        <b>Weekly Star ⭐ Distribution:</b>
      </p>
      <div className="statistics-bar-chart-container">
        <div className="responsive-bar-chart-container">
          {" "}
          <Plot
            data={[trace1, trace2, trace3]}
            layout={layout}
            config={config} // Pass the config object to the Plot component
            useResizeHandler
            className={`statistics-plot ${
              isDark ? "statistics-plot-dark" : "statistics-plot-light"
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={StatisticsNode}
      modalTitle="Statistics"
    />
  );
};

export default StatisticsModal;
