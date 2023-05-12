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

  const numberStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'darkgrey',
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
        backgroundColor: isFilled ? 'lightblue' : (isOver ? 'lightgrey' : 'white'),
        borderRadius: '8px',
        position: 'relative', // Added position relative for number positioning
      }}
    >
      {!isFilled && (
        <div style={numberStyle}>{id + 1}</div>
      )}
      {children}
    </div>
  );
};


export default DroppableSlot;
