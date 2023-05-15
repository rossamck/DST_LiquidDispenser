import { useDrop } from 'react-dnd';

const DroppableSlot = ({ id, onDrop, children, isFilled }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'module',
    drop: (item, monitor) => {
      if (children.length === 0) {
        onDrop(item.id, id);
      }
    },
    canDrop: (item, monitor) => {
      return children.length === 0;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const isVertical = id === 0 || id === 1;
  const isTopRight = id < 2;
  const dotPosition = isTopRight ? 'right' : 'left';

  const numberStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    transformOrigin: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'darkgrey',
  };

  const moduleNameStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    transformOrigin: 'center',
    fontSize: '16px',
    color: 'black',
  };

  const dotStyle = {
    position: 'absolute',
    top: '5px', // Adjust as needed
    [dotPosition]: '5px', // Adjust as needed
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'grey',
    zIndex: 2, // To ensure dot is visible when module is dropped
  };

  return (
    <div
      ref={drop}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: isVertical ? '150px' : '200px',
        height: isVertical ? '200px' : '150px',
        border: isFilled ? 'none' : '1px dashed gray',
        backgroundColor: isFilled ? 'lightblue' : isOver ? 'lightgrey' : 'white',
        borderRadius: '8px',
        position: 'relative', // Added position relative for number and module name positioning
      }}
    >
      {!isFilled && <div style={numberStyle}>{id + 1}</div>}
      <div style={dotStyle} /> {/* Added dot */}
      <div style={moduleNameStyle}>{children}</div> {/* Rotated module name */}
    </div>
  );
};

export default DroppableSlot;
