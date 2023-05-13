// JobQueueContext.jsx
import { createContext } from 'react';
import JobQueue from '../components/JobQueue/JobQueue';

const JobQueueContext = createContext(new JobQueue());

export default JobQueueContext;
