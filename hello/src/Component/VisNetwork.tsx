import { GraphCanvas } from "reagraph";
import theme from "../helper/theme";

const VisNetwork: React.FC = () => {
  const nodes = [
    {
      id: "1",
      label: "1",
    },
    {
      id: "2",
      label: "2",
    },
  ];

  const edges = [
    {
      source: "1",
      target: "2",
      id: "1-2",
      label: "Hello",
      labelVisible: true,
    },
    {
      source: "2",
      target: "1",
      id: "2-1",
      label: "Fuk",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: 400,
        width: 400,
        border: "1px solid red",
      }}
    >
      <GraphCanvas
        labelType="all"
        draggable
        nodes={nodes}
        edges={edges}
        theme={theme}
      />
    </div>
  );
};

export default VisNetwork;
