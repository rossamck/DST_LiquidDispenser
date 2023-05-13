// movementRoutine.js
export default async function movementRoutine(updateAxesNetValues, sendMessage, setIsMoving, delay) {
    const coordinatesList = [
      { x: 2100, y: 2400 },
      { x: 2100, y: 0 },
      { x: 0, y: 2400 },
      { x: 0, y: 0},
    ];
  
    for (let coords of coordinatesList) {
      updateAxesNetValues("X", coords.x);
      updateAxesNetValues("Y", coords.y);
      sendMessage(`manualCoords:${coords.x},${coords.y}`);
      setIsMoving(true);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  