class JobQueue {
  static completedCount = 0;

  constructor() {
    this.queue = [];
    this.completed = [];
    this.currentJob = null;
    this.jobId = 0;
  }

  generateJobId() {
    return this.jobId++;
  }

  addJob(job) {
    const newJob = { ...job, id: this.jobId, status: 'pending', message: job.message };
    this.queue.push(newJob);
    this.jobId += 1;
    console.log('Added job:', newJob.id);
    if (!this.currentJob) {
      console.log('Starting execution of job:', newJob.id);
      this.executeNextJob();
    }
  }

  executeNextJob() {
    if (this.queue.length === 0) {
      this.currentJob = null;
      console.log('No more jobs in the queue. Execution finished.');
      return;
    }
    this.currentJob = this.queue.shift();
    this.currentJob.status = 'active'; // update status
    console.log('Executing job:', this.currentJob.id);
    this.currentJob.action();
  }

  jobCompleted(id) {
    const numId = Number(id);
    if (this.currentJob && this.currentJob.id === numId) {
      console.log('Job', numId, 'completed.');
      this.currentJob.status = 'complete'; // update status
      this.currentJob.completedAt = new Date(); // Add a timestamp
      this.completed.push(this.currentJob);
      JobQueue.completedCount++; // Increment the counter when a job is completed
      this.executeNextJob();
    } else {
      console.log("number dont match, received:", numId);
    }
  }

  getJobList() {
    return this.queue;
  }

  getCompletedJobs() {
    return this.completed;
  }

  static getCompletedCount() { // Add a method to get the completed jobs count
    return this.completedCount;
  }
}

export default JobQueue;
