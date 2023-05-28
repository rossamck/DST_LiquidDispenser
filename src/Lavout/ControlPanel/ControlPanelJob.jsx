import React, { useContext, useState } from "react";
import { Modal, Button } from 'antd';
import JobQueueContext from "../../context/JobQueueContext";

const ControlPanelJob = ( { getJobTitle } ) => {
  const jobQueue = useContext(JobQueueContext);
  const [selectedJob, setSelectedJob] = useState(null);

  const onOpenModal = (job) => {
    setSelectedJob(job);
  };

  const onCloseModal = () => {
    setSelectedJob(null);
  };

  const completedJobs = jobQueue.getCompletedJobs().map((job) => {
    const title = getJobTitle(job.message);
    let completedAt = ''; // Initialize completedAt as an empty string
    
    // If job.completedAt exists, format it
    if (job.completedAt) {
      const date = new Date(job.completedAt);
      completedAt = `${date.toLocaleTimeString()} on ${date.toLocaleDateString()}`;
    }
  
    return (
      <div 
        key={job.id} 
        className="p-2 bg-gray-300 hover:bg-gray-500 transition-colors duration-200 rounded-md shadow-md my-2 cursor-pointer" 
        onClick={() => onOpenModal(job)}
      >
        <h3>Completed Job ID: {job.id}</h3>
        <p>Title: {title}</p>
        <p>Status: {job.status}</p>
        {completedAt && <p>Completed: {completedAt}</p>}
      </div>
    );
  });

  return (
    <aside id="content" className="col-span-3 bg-gray-700 p-4 h-full pb-20">
      <h2 className="text-white text-2xl font-bold underline">Completed Jobs:</h2>
      <div className="h-full overflow-y-auto">
        {completedJobs}
      </div>
      {selectedJob && (
        <JobDetailModal job={selectedJob} isVisible={Boolean(selectedJob)} onCloseModal={onCloseModal} />
      )}
    </aside>
  );
};

const JobDetailModal = ({ job, isVisible, onCloseModal }) => {
  let completedAt = ''; // Initialize completedAt as an empty string
  
  // If job.completedAt exists, format it
  if (job.completedAt) {
    const date = new Date(job.completedAt);
    completedAt = date.toString();
  }

  return (
    <Modal
      title="Job Detail"
      visible={isVisible}
      onCancel={onCloseModal}
      footer={[
        <Button key="back" onClick={onCloseModal}>
          Close
        </Button>,
      ]}
    >
      <div className="p-4 bg-white rounded-md shadow-md my-4">
        <p>ID: {job.id}</p>
        <p>Status: {job.status}</p>
        {completedAt && <p>Completed: {completedAt}</p>}
        <br></br>
        <p>Message: {job.message}</p>
      </div>
    </Modal>
  );
};

export default ControlPanelJob;
