// // Import the required modules
// const cron = require('node-cron');
// const Assignment = require('../../models/assignment')

// const assignmentScheduler = {
//   start: function () {
//     // Schedule the task to run every minute
//     cron.schedule('* * * * *', async () => {
//       // Your scheduled task logic here
//       // Check for assignments with expired review deadlines and stop them
//       const currentTime = new Date();
//       const assignmentsToStop = await Assignment.find({
//         status: 'Assigned', // Assuming 'Active' status for assignments
//         reviewer_deadline: { $lt: currentTime },
//       });

//       // Stop the assignments
//       assignmentsToStop.forEach(async (assignment) => {
//         assignment.status = 'Grading';
//         await assignment.save();
//         // Optionally, send notifications to users.
//       });
//     });
//   },
// };

// module.exports = assignmentScheduler;
