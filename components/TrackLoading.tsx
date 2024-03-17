import * as React from "react";
import * as Progress from "@radix-ui/react-progress";

const TrackLoading = () => {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Update the progress value, resetting back to 0 when it reaches 100
      setValue((prevValue) => (prevValue >= 100 ? 0 : prevValue + 1));
    }, 50); // Adjust the interval time as needed

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <Progress.Root
      value={value}
      max={100}
      style={{ width: "100%", height: "8px" }}
    >
      <Progress.Indicator
        style={{ width: `${value}%`, height: "100%", backgroundColor: "black" }}
      />
    </Progress.Root>
  );
};

export default TrackLoading;
