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
      }}
    >
      {children}
    </div>
  );
};

export default DroppableSlot;
