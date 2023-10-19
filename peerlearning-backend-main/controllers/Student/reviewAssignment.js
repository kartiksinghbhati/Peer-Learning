const peerActivity = require('../../models/peerActivity');
const Assignment = require('../../models/assignment');
const Log = require('../../models/log');

exports.reviewAssignment = async (req, res) => {
  try {
    const peerActivityId = req.body.peer_activity_id;
    let title, peerAssignmentId;

    // Use async/await and try/catch to handle errors
    const peerActivityResult = await peerActivity.findById(peerActivityId);
    if (!peerActivityResult) {
      return res.status(404).json({ error: 'Peer activity not found' });
    }
    
    peerAssignmentId = peerActivityResult.peerAssignment_id;

    const assignmentResult = await Assignment.findById(peerAssignmentId);
    if (!assignmentResult) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    title = assignmentResult.assignment_title;

    // Update the peerActivity document
    const updatedPeerActivity = await peerActivity.findByIdAndUpdate(
      peerActivityId,
      {
        $set: {
          review_score: req.body.review_score,
          reviewer_comment: req.body.reviewer_comment,
        },
      },
      { new: true }
    );

    if (!updatedPeerActivity) {
      return res.status(500).json({ error: 'Failed to update peer activity' });
    }

    // Create a log entry
    const log = new Log({
      user_id: updatedPeerActivity.reviewer_id,
      event_type: 'REVIEWED_PEER_ACTIVITY',
      reference_id: peerActivityId,
      description: title,
      time_stamp: new Date(),
    });

    await log.save();

    res.status(200).json(updatedPeerActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// const peerActivity = require('../../models/peerActivity')
// const Assignment = require('../../models/assignment')
// const Log = require('../../models/log')

// exports.reviewAssignment = async (req, res) => {
//   var peerActivityId = req.body.peer_activity_id, title, peerAssignmentId

//   await peerActivity.findById(peerActivityId, async (err, result) => {
//     if(err){
//       res.json(err)
//     } else {
//       peerAssignmentId = await result.peerAssignment_id
//       console.log(peerAssignmentId)
//     }
//   })

//   await Assignment.findById(peerAssignmentId, async (err, result) => {
//     if(err){
//       res.json(err)
//     } else {
//       title = await result.assignment_title
//       console.log(result)
//     }
//   })

//   await peerActivity.findByIdAndUpdate(
//     peerActivityId,
//     {
//       $set: {
//         review_score: req.body.review_score,
//         reviewer_comment: req.body.reviewer_comment,
//       },
//     },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         res.json(err)
//       } else {
//         let log = new Log()
//         log.user_id = result.reviewer_id
//         log.event_type = 'REVIEWED_PEER_ACTIVITY'
//         log.reference_id = peerActivityId
//         log.description = title
//         log.time_stamp = new Date()
//         log.save().then(
//           (r) => {
//             console.log('Saved Log')
//             delete nowDate
//           },
//           (err) => {
//             console.log('ERROR while saving the log!')
//           }
//         )
//         res.status(200).json(result)
//       }
//     }
//   )
// }

// // add review of the reviewer on the given peer_activity_id
