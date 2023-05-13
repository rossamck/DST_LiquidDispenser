class JobQueue {
    constructor() {
      this.queue = [];
      this.currentJob = null;
      this.jobId = 0;
    }
  
    addJob(job) {
        const newJob = { ...job, id: this.jobId };
        this.queue.push(newJob);
        this.jobId += 1; 
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
      console.log('Executing job:', this.currentJob.id);
      this.currentJob.action();
    }
  
    jobCompleted(id) {
        // convert id to number before comparing
        const numId = Number(id);
        if (this.currentJob && this.currentJob.id === numId) {
          console.log('Job', numId, 'completed.');
          this.executeNextJob();
        } else {
            console.log("number dont match, received:", numId);
        }
      }
  
    getJobList() {
      return this.queue;
    }
  }
  
  export default JobQueue;
  