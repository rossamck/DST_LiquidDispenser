import React from "react";
import MovementControl from "../../components/MovementControl/MovementControl";


const ControlPanelDev = ({ onButtonPressCountsUpdate, onAxesNetValuesUpdate}) => {


  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full">
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs">
  
      </div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-white text-2xl mb-4">Movement Control</h2>
        <div className="flex justify-center items-center">
          <MovementControl
            onXUp={() => console.log("X up")}
            onXDown={() => console.log("X down")}
            onYUp={() => console.log("Y up")}
            onYDown={() => console.log("Y down")}
            onZUp={() => console.log("Z up")}
            onZDown={() => console.log("Z down")}
            onButtonPressCountsUpdate={onButtonPressCountsUpdate}
            onAxesNetValuesUpdate={onAxesNetValuesUpdate}

          />
        </div>
      </div>
    </aside>
  );
};

export default ControlPanelDev;
