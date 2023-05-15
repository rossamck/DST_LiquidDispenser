import { useDrag } from 'react-dnd';
import { useSpring, animated } from 'react-spring';

const DraggableModule = ({ id, name, isDropped }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'module',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const animationProps = useSpring({
    opacity: isDragging ? 0.5 : 1,
    padding: isDropped ? '0px' : '10px',
    margin: isDropped ? '0px' : '10px',
    backgroundColor: isDropped ? 'lightblue' : 'lightgrey',
    cursor: 'move',
    borderRadius: '10px',
    zIndex: 10,
  });

  return (
    <animated.div
      ref={drag}
      style={animationProps}
    >
      {name}
    </animated.div>
  )
}

export default DraggableModule;
