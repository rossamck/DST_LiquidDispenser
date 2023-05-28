// ContentJob.jsx

import React, { useContext, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Modal, Button } from "antd";
import JobQueueContext from "../../context/JobQueueContext";

const ContentJob = ({ getJobTitle }) => {
  const jobQueue = useContext(JobQueueContext);
  const [currentJob, setCurrentJob] = useState(jobQueue.currentJob);
  const [selectedJob, setSelectedJob] = useState(null);

  const onOpenModal = (job) => {
    setSelectedJob(job);
  };

  const onCloseModal = () => {
    setSelectedJob(null);
  };

  const onCurrentJobClick = () => {
    if (currentJob) {
      onOpenModal(currentJob);
    }
  };

  useEffect(() => {
    setCurrentJob(jobQueue.currentJob);
  }, [jobQueue.currentJob]);
  let currentJobContent = null;
  if (currentJob) {
    const { id, message, status } = currentJob;
    const title = getJobTitle(message);
    currentJobContent = (
      <div
        className="p-4 bg-white hover:bg-blue-200 rounded-md shadow-md cursor-pointer border-4 border-black"
        onClick={onCurrentJobClick}
      >
        <h2 className="text-lg font-bold">Job ID: {id}</h2>
        <p>Status: {status}</p>
        <p>Title: {title}</p>
      </div>
    );
  } else {
    currentJobContent = <p className="text-gray-500">No active jobs</p>;
  }

  const upcomingJobs = jobQueue.getJobList();
  let upcomingJobsContent = null;
  if (upcomingJobs.length > 0) {
    upcomingJobsContent = upcomingJobs.map((job) => (
      <div
        key={job.id}
        className="p-4 bg-blue-50 hover:bg-gray-200 rounded-md shadow-md my-4 cursor-pointer"
        onClick={() => onOpenModal(job)}
      >
        <h3 className="text-md font-semibold">Upcoming Job ID: {job.id}</h3>
        <p>Status: {job.status}</p>
        <p>Title: {getJobTitle(job.message)}</p>
      </div>
    ));
  } else {
    upcomingJobsContent = <p className="text-gray-500">No upcoming jobs</p>;
  }

  return (
    <div className="content-job">
      <div className="current-job">
        <h2 className="text-lg font-bold">Active Job:</h2>
        {currentJobContent}
      </div>
      <hr className="my-4" />
      <div className="upcoming-jobs">
        <h2 className="text-lg font-bold">Upcoming Jobs:</h2>
        {upcomingJobsContent}
        </div>
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isVisible={Boolean(selectedJob)}
          onCloseModal={onCloseModal}
        />
      )}
    </div>
  );
};

const JobDetailModal = ({ job, isVisible, onCloseModal }) => {
  const [expanded, setExpanded] = useState(false);

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
        {expanded ? (
          <p>Message: {job.message}</p>
        ) : (
          <p>Message: {job.message.slice(0, 500)}</p>
        )}
        {job.message.length > 250 && (
          <button
            className="text-blue-500 underline flex items-center focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <FiChevronUp className="mr-1" />
            ) : (
              <FiChevronDown className="mr-1" />
            )}
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ContentJob;
