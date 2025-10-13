class MainThreadOptimizer {
    constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
    }

    // Break large tasks into smaller chunks
    scheduleTask(task, priority = 'normal') {
        return new Promise((resolve) => {
            this.taskQueue.push({ task, resolve, priority });
            this.processQueue();
        });
    }

    processQueue() {
        if (this.isProcessing || this.taskQueue.length === 0) return;
        
        this.isProcessing = true;
        this.processNextTask();
    }

    processNextTask() {
        if (this.taskQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        const { task, resolve } = this.taskQueue.shift();
        
        // Use requestIdleCallback for non-critical tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback((deadline) => {
                try {
                    const result = task();
                    resolve(result);
                } catch (error) {
                    console.error('Task execution error:', error);
                    resolve(null);
                }
                
                if (deadline.timeRemaining() > 0) {
                    this.processNextTask();
                } else {
                    setTimeout(() => this.processNextTask(), 0);
                }
            });
        } else {
            setTimeout(() => {
                try {
                    const result = task();
                    resolve(result);
                } catch (error) {
                    console.error('Task execution error:', error);
                    resolve(null);
                }
                this.processNextTask();
            }, 0);
        }
    }

    // Defer heavy operations
    deferTask(callback, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.scheduleTask(callback).then(resolve);
            }, delay);
        });
    }
}

window.MainThreadOptimizer = new MainThreadOptimizer();