import { Theme } from "reagraph";
const lightTheme: Theme = {
  canvas: {
    background: "#fff",
    fog: "#fff",
  },
  node: {
    fill: "#7CA0AB",
    activeFill: "#1DE9AC",
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.2,
    label: {
      color: "#2A6475",
      stroke: "#fff",
      activeColor: "#1DE9AC",
    },
    subLabel: {
      color: "#2A6475",
      stroke: "#eee",
      activeColor: "#1DE9AC",
    },
  },
  lasso: {
    border: "1px solid #55aaff",
    background: "rgba(75, 160, 255, 0.1)",
  },
  ring: {
    fill: "#D8E6EA",
    activeFill: "#1DE9AC",
  },
  edge: {
    fill: "#D8E6EA",
    activeFill: "#1DE9AC",
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 1,
    label: {
      stroke: "#fff",
      color: "#2A6475",
      activeColor: "#1DE9AC",
    },
  },
  arrow: {
    fill: "#D8E6EA",
    activeFill: "#1DE9AC",
  },
  cluster: {
    stroke: "#D8E6EA",
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.1,
    label: {
      stroke: "#fff",
      color: "#2A6475",
    },
  },
};
export default lightTheme;
