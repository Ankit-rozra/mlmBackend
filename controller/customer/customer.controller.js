const User = require('../../model/customer/customer.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const create = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    mobile,
    password,
    bv,
    pv,
    referralCode,
    sponsor,
    recruits,
  } = req.body;

  const contactUsData = new User({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    mobile: mobile,
    password: password,
    bv: bv,
    pv: pv,
    referralCode: referralCode,
    sponsor: sponsor,
    recruits: recruits,
  });

  contactUsData
    .save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json('error' + err);
    });
};

const userRegEmail = async (req, res) => {
  try {
    var emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var {
      email,
      password, referralCode, subRerralCode,
      topupAmount, adhaarNumber, mobile,
      username, question, answer, upi, address
    } = req.body;



    var directbonus = (topupAmount * 10) / 100;
    var joinnigBV = (topupAmount * 5) / 100;

    if (
      (referralCode == null ||
        subRerralCode == null ||
        password == null ||
        email == null ||
        topupAmount == null ||
        adhaarNumber == null ||
        username == null ||
        question == null ||
        answer == null ||
        upi == null ||
        address == null ||
        mobile == null)
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password length must be at least 6' });
    }

    if (email != null && !emailRegexp.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const sponsordoc = await User.findOne({ referralCode });
    if (!sponsordoc) {
      return res.status(400).json({ message: 'Invalid referral code' });
    }
    const subSponsordoc = await User.findOne({ referralCode: subRerralCode });
    const lengthsubSponsordoc = subSponsordoc.lengthSC + 1;

    if (!subSponsordoc) {
      return res.status(400).json({ message: 'Invalid SubReferral code' });
    }

    if (!subSponsordoc.searchCode.startsWith(sponsordoc.searchCode)) {
      return res.status(400).json({ message: 'Referral code not matched' });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(409).json({ message: 'UserName already registered' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const answerdata = answer.toLowerCase().replace(/\s+/g, '');
    // return console.log(answerdata);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      username: username,
      email: email,
      answer: answerdata,
      mobile: mobile,
      question: question,
      topupAmount: topupAmount,
      upi: upi,
      password: hash,
      sponsor: sponsordoc._id,
      subSponser: subSponsordoc._id,
      adhaarNumber: adhaarNumber,
      address: address

    });
    // return console.log(user)
    const sponsor = await User.findOne({ referralCode });

    if (referralCode == subRerralCode) {
      // return console.log("bloack one")
      const sponsor = await User.findOne({ referralCode });

      if (sponsor.recruits.length < 1) {
        const test = await User.findOneAndUpdate(
          { referralCode: referralCode },
          {
            $push: {
              recruits: {
                $each: [user._id],
                // , $position: 0
              },
            },
            $inc: {
              directJoinningBonus: directbonus,
              bv: joinnigBV,
              pv: 1
            },

          },
          { new: true }
        );

        user.searchCode = `${subSponsordoc.searchCode}A`;
        user.lengthSC = lengthsubSponsordoc
        await test.save();
        await user.save();
      } else if (sponsor.recruits.length < 2) {
        const test = await User.findOneAndUpdate(
          { referralCode: referralCode },
          {
            $push: {
              recruits: {
                $each: [user._id],
                // , $position: 0
              },
            },
            $inc: {
              directJoinningBonus: directbonus,
              bv: joinnigBV,
              pv: 1
            },

          },
          { new: true }
        );

        user.searchCode = `${subSponsordoc.searchCode}B`;
        user.lengthSC = lengthsubSponsordoc
        await test.save();
        await user.save();
      } else {
        return res
          .status(400)
          .json({
            message:
              'Recruits array already has more than two elements same referral.',
          });
      }
    } else {
      // if (referralCode != subRerralCode) {
      const sponsorSec = await User.findOne({ referralCode: subRerralCode });
      // return console.log("bloack two",sponsorSec )
      if (sponsorSec.recruits.length < 1) {
        const test = await User.findOneAndUpdate(
          { referralCode: subRerralCode },
          {
            $push: {
              recruits: {
                $each: [user._id],
              },
            }
          },
          { new: true }
        );

        const test2 = await User.findOneAndUpdate(
          { referralCode: referralCode }, {
          $inc: {
            directJoinningBonus: directbonus,
            bv: joinnigBV,
            pv: 1
          },
        },
          { new: true }
        )

        user.searchCode = `${subSponsordoc.searchCode}A`;
        user.lengthSC = lengthsubSponsordoc
        await test.save();
        await test2.save();
        await user.save();
      } else if (sponsorSec.recruits.length < 2) {
        const test = await User.findOneAndUpdate(
          { referralCode: subRerralCode },
          {
            $push: {
              recruits: {
                $each: [user._id],
              },
            },
            // $inc: {
            //   directJoinningBonus: directbonus,
            //   bv: joinnigBV,
            //   pv: 1
            // },

          },
          { new: true }
        );
        const test2 = await User.findOneAndUpdate(
          { referralCode: referralCode }, {
          $inc: {
            directJoinningBonus: directbonus,
            bv: joinnigBV,
            pv: 1

          },
        },
          { new: true }
        )

        user.searchCode = `${subSponsordoc.searchCode}B`;
        user.lengthSC = lengthsubSponsordoc
        await test.save();
        await test2.save();
        await user.save();
      } else {
        return res
          .status(400)
          .json({
            message:
              'Recruits array already has more than two elements. with diffrent referral',
          });
      }
    }

    const response = {};
    // Start
    try {
      var userdata = await User.findById({ _id: user._id })
      if (!userdata) {
        res.status(404).json({ error: 'Invalid user' });
      }
      const userLenghtSCOne = userdata.lengthSC;
      var allLSCUsers = await User.find({ lengthSC: userLenghtSCOne })
      var matchingUsersArray = [];
      allLSCUsers.forEach(user => {
        matchingUsersArray.push(user.topupAmount);
      });
      const lowestTopupAmount = Math.min(...matchingUsersArray);
      var topupBonus = (lowestTopupAmount * 10) / 100;
      const userLenghtSC = userdata.lengthSC;
      const sponsor = userdata.sponsor;
      const subSponser = userdata.subSponser;
      // find Sponsor
      var sponsorDoc = await User.findById({ _id: sponsor })
      const sponsorlengthSC = sponsorDoc.lengthSC;
      const sponsorSearchCode = sponsorDoc.searchCode;
      const gap = userLenghtSC - sponsorlengthSC;
      const treeheight = gap + 1;
      const nodescount = 2 ** treeheight;
      const allNodes = nodescount - 1   // all nodes of tree
      console.log(allNodes); // all nodes of tree
      var subSponsorDoc = await User.findById({ _id: subSponser })
      const subSponsorlengthSC = subSponsorDoc.lengthSC + 1;
      const presentNodes = await User.find({
        searchCode: { $regex: `^${sponsorSearchCode}`, $options: 'i' },
        lengthSC: { $gte: sponsorlengthSC, $lte: subSponsorlengthSC }
      }).select('_id searchCode');
      console.log(presentNodes);
      if (allNodes == presentNodes.length) {
        const userIds = presentNodes.filter(doc => doc.searchCode.length !== subSponsorlengthSC);
        console.log(filteredDocuments);
        if (userIds.length === 0) {
          response.error = "No users to update";
          // res.status(404).json({ error: 'No users to update' });
        } else if (userIds.length > 400) {
          response.error = "Maximun 200 pairs";
          // res.status(404).json({ error: 'Maximun 200 pairs' });
        }
        for (const userId of userIds) {
          const userToUpdate = await User.findById(userId);
          if (userToUpdate) {
            userToUpdate.pairEarning = (userToUpdate.pairEarning || 0) + topupBonus;
            await userToUpdate.save();
          }
        }
        response.message = "All user IDs are updated"
        // res.status(201).json({ message: 'All user IDs are updated' });
      }
      else if (allNodes !== presentNodes.length) {
        response.error = "pairs yet to be complete";
        // res.status(404).json({ message: 'pairs yet to be complete' });
      }
    }
    catch (err) {
      res.status(500).json(err.message);
    }

    // End

    const payload = {
      userId: user._id,
      expiresIn: '1h',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    response.token = token

    res.cookie('token', token, {
      maxAge: 3000000 * 24 * 60 * 60,
      // httpOnly: true,
      // sameSite: "strict",
    });
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const leftRightPurchaces = async (req, res) => {
  const { _id } = req.params;
  try {
    const userData = await User.findById({ _id });

    if (!userData) {
      return res.status(404).json({ error: 'Invalid user' });
    }

    const recruitsData = userData.recruits;

    if (!recruitsData || recruitsData.length !== 2) {
      return res.status(404).json({ error: "User doesn't have both left and right children" });
    }

    const leftChild = recruitsData[0];
    const rightChild = recruitsData[1];

    let totalbvSumLeft = 0;
    if (leftChild) {
      const leftUser = await User.findById(leftChild);
      if (leftUser) {
        const { searchCode, lengthSC } = leftUser;
        const presentLeftNodes = await User.find({
          searchCode: { $regex: `^${searchCode}`, $options: 'i' },
          lengthSC: { $gte: lengthSC }
        }).select('_id bv');
        for (const userToUpdate of presentLeftNodes) {
          totalbvSumLeft += userToUpdate.bv || 0;
        }
      }
    }

    let totalbvSumRight = 0;
    if (rightChild) {
      const rightUser = await User.findById(rightChild);
      if (rightUser) {
        const { searchCode, lengthSC } = rightUser;
        const presentRightNodes = await User.find({
          searchCode: { $regex: `^${searchCode}`, $options: 'i' },
          lengthSC: { $gte: lengthSC }
        }).select('_id bv');
        for (const userToUpdate of presentRightNodes) {
          totalbvSumRight += userToUpdate.bv || 0;
        }
      }
    }

    const response = {};
    if (!leftChild) {
      response.error = "User doesn't have left child";
    }
    if (!rightChild) {
      response.error = "User doesn't have right child";
    }
    response.LeftSum = totalbvSumLeft;
    response.RightSum = totalbvSumRight;

    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const frogetPass = async (req, res) => {
  const {
    email,
    question,
    answer,
    newPassword,
    confirmPassword,
  } = req.body

  try {
    const answerdata = answer.toLowerCase().replace(/\s+/g, '');
    // return console.log(answerdata)

    if (!email || !question || !answer || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Email is not registered' });
    }

    const userQuestion = existingUser.question
    const userAnswer = existingUser.answer
    if (userQuestion !== question) {
      return res.status(400).json({ message: 'Question do not match' });
    }

    if (userAnswer !== answerdata) {
      return res.status(400).json({ message: 'Answer do not match' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;
    const userName = existingUser.username
    await existingUser.save();

    return res.status(200).json({ message: 'Password reset successful',
    data : userName
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// const leftRightPurchaces = async (req, res) => {
//   const { _id } = req.params;
//   try {
//     var userdata = await User.findById({ _id })
//     if (!userdata) {
//       return res.status(404).json({ error: 'Invalid user' });
//     }
//     const recruitsdata = userdata.recruits;
//     if (recruitsdata.length == 0) {
//       return res.status(404).json({ error: "User don't have any Childrens" });
//     }

//     if (!recruitsdata[0]) {
//       res.status(404).json({ error: "User don't have any Left Child" });
//     }

//     if (!recruitsdata[1]) {
//       res.status(404).json({ error: "User don't have any Left Child" });
//    }

//     const leftChild = await User.findById({ _id: recruitsdata[0] })
//     const leftChildSearchCode = leftChild.searchCode
//     const leftChildLengthSC = leftChild.lengthSC
//     const presentLeftNodes = await User.find({
//       searchCode: { $regex: `^${leftChildSearchCode}`, $options: 'i' },
//       lengthSC: { $gte: leftChildLengthSC }
//     }).select('_id searchCode');
//     const userIds = presentLeftNodes.map(user => user._id); // Extract _id values
//     let totalbvSumLeft = 0;
//     for (const userId of userIds) {
//       const userToUpdate = await User.findById(userId);
//       if (userToUpdate) {
//         totalbvSumLeft += userToUpdate.bv || 0; // Add pv to the total sum (default to 0 if pv is not defined)
//       }
//     }
//     // console.log('Total PV Sum:',userIds ,totalPVSumLeft);
//     const rightChild = await User.findById({ _id: recruitsdata[1] })
//     const rightChildSearchCode = rightChild.searchCode
//     const rightChildLengthSC = rightChild.lengthSC
//     const presentRightNodes = await User.find({
//       searchCode: { $regex: `^${rightChildSearchCode}`, $options: 'i' },
//       lengthSC: { $gte: rightChildLengthSC }
//     }).select('_id searchCode');
//     const userIdsRight = presentRightNodes.map(user => user._id);
//     let totalbvSumRight = 0;
//     for (const userId of userIdsRight) {
//       const userToUpdate = await User.findById(userId);
//       if (userToUpdate) {
//         totalbvSumRight += userToUpdate.bv || 0; // Add pv to the total sum (default to 0 if pv is not defined)
//       }
//     }
//     // return console.log(totalPVSumLeft, "thrt", totalPVSumRight);
//     return res.status(201).json({ "LeftSum": totalbvSumLeft, "RightSum": totalbvSumRight })

//   } catch (err) {
//     return res.status(500).json(err.message);
//   }

// }

const userRegMobile = async (req, res) => {
  try {
    // var emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var phoneRegexp = /^\d{10}$/;
    var {
      firstName,
      lastName,
      mobile,
      password,
      referralCode,
      topupAmount,
      adhaarNumber,
    } = req.body;

    if (
      firstName == null ||
      lastName == null ||
      referralCode == null ||
      password == null ||
      mobile == null ||
      topupAmount == null ||
      adhaarNumber == null
    ) {
      return res.status(400).json({ Message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ Message: 'Password length must be at least 6' });
    }

    if (mobile != null && !phoneRegexp.test(mobile)) {
      return res
        .status(400)
        .json({ Message: 'Please enter a valid mobile number' });
    }

    const sponsordoc = await User.findOne({ referralCode });
    if (!sponsordoc) {
      return res.status(400).json({ Message: 'Invalid referral code' });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(409).json({ message: 'mobile already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      username: `${firstName} ${lastName}`,
      mobile: mobile,
      topupAmount: topupAmount,
      password: hash,
      sponsor: sponsordoc._id,
    });

    const sponsor = await User.findOne({ referralCode });

    if (sponsor.recruits.length < 2) {
      const test = await User.findOneAndUpdate(
        { referralCode: referralCode },
        {
          $push: {
            recruits: {
              $each: [user._id],
              // , $position: 0
            },
          },
        }
      );
      await test.save();
      await user.save();
    } else {
      return res
        .status(400)
        .json({
          message: 'Recruits array already has more than two elements.',
        });
    }

    const payload = {
      userId: user._id,
      expiresIn: '1h',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('token', token, {
      maxAge: 3000000 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'strict',
    });
    return res.status(201).json(token);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const autoPool = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalTopupSum: { $sum: '$topupAmount' }
        }
      }
    ]);
    const totalUsers = await User.countDocuments();
    const totalSum = result[0].totalTopupSum;
    const persentageSum = totalSum * 3 / 100;
    const pvvalue = persentageSum / totalUsers;
    // return console.log(pvvalue);


    res.json({ totalTopupSum: pvvalue });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }

}

const alldata = async (req, res) => {
  try {
    var data = await User.find({});
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({
      message: "error",
      err,
    });
  }

}

const pairEarning = async (req, res) => {
  const { _id } = req.params;
  //   var userdata = await User.findById({ _id })
  //   const sponsor = userdata.sponsor;
  //   var sponsorDoc = await User.findById({ _id: sponsor });
  //   const sponsorSearchCode = sponsorDoc.searchCode;
  // // return console.log(sponsorSearchCode)
  //   // const allNodes =
  //   await User.find({
  //     // searchCode: { $regex: /^AB/, $options: 'i' }, // ^ indicates starts with, 'i' for case-insensitive
  //     searchCode: { $regex: `^${sponsorSearchCode}`, $options: 'i' }, // ^ indicates starts with, 'i' for case-insensitive
  //     lengthSC: { $gte: 2, $lte: 5 } // Length between 2 and 5
  //   }).select('_id searchCode')
  //     .then(users => {
  //       // Handle the found users here
  //       console.log(users);
  //     })
  //     .catch(err => {
  //       // Handle any errors
  //       console.error(err);
  //     });


  // return

  try {
    var userdata = await User.findById({ _id })
    if (!userdata) {
      return res.status(404).json({ error: 'Invalid user' });
    }
    const userLenghtSC = userdata.lengthSC;
    var allLSCUsers = await User.find({ lengthSC: userLenghtSC })
    var matchingUsersArray = [];
    allLSCUsers.forEach(user => {
      matchingUsersArray.push(user.topupAmount);
    });
    const lowestTopupAmount = Math.min(...matchingUsersArray);

    // const topupAmount = userdata.topupAmount;
    var topupBonus = (lowestTopupAmount * 10) / 100;
    return console.log("fuiho", topupBonus);

    const sponsor = userdata.sponsor;
    const subSponser = userdata.subSponser;
    // find Sponsor
    var sponsorDoc = await User.findById({ _id: sponsor })
    const sponsorlengthSC = sponsorDoc.lengthSC;
    const sponsorSearchCode = sponsorDoc.searchCode;
    const gap = userLenghtSC - sponsorlengthSC;
    const treeheight = gap + 1;
    const nodescount = 2 ** treeheight;
    const allNodes = nodescount - 1   // all nodes of tree
    console.log(allNodes); // all nodes of tree
    var subSponsorDoc = await User.findById({ _id: subSponser })
    const subSponsorlengthSC = subSponsorDoc.lengthSC + 1;

    const presentNodes = await User.find({
      searchCode: { $regex: `^${sponsorSearchCode}`, $options: 'i' },
      lengthSC: { $gte: sponsorlengthSC, $lte: subSponsorlengthSC }
    }).select('_id searchCode');
    console.log(presentNodes.length);

    if (allNodes == presentNodes.length) {
      const userIds = presentNodes.filter(doc => doc.searchCode.length !== subSponsorlengthSC);
      console.log("dgdr", userIds);
      if (userIds.length === 0) {
        return res.status(404).json({ error: 'No users to update' });
      } else if (userIds.length > 400) {
        return res.status(404).json({ error: 'Maximun 200 pairs' });
      }
      for (const userId of userIds) {
        const userToUpdate = await User.findById(userId);
        return console.log(userToUpdate)
        if (userToUpdate) {
          userToUpdate.pairEarning = (userToUpdate.pairEarning || 0) + topupBonus;
          await userToUpdate.save();
        }
      }
      return res.status(201).json({ message: 'All user IDs are updated' });
    }
    return res.status(404).json({ message: 'pairs yet to be complete' });

  } catch (err) {
    return res.status(500).json(err.message);
  }
}

const statusUpdate = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update customerVerified to true
    user.customerVerified = true;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'User customerVerified updated to true' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// const pairEarning = async (req, res) => {
//   const { _id } = req.params;

//   // for (let i = 0; i <= 0; i++) {
//   //   console.log(i);
//   // }
//   // return
//   try {
//     // const usersWithLengthSC4 = await User.find({ "lengthSC": "3" });
//     // return console.log("irghiue", Object.keys(usersWithLengthSC4).length);

//     var userdata = await User.findById({ _id })

//     if (!userdata) {
//       res.status(404).json({ error: 'Invalid user' });
//       return;
//     }

//     const searchCode = userdata.searchCode;
//     // return console.log(userdata.lengthSC);
//     const searchCodeLength = searchCode.length;
//     let allSbilings = 2 ** (searchCodeLength - 1);
//     console.log("all siblings", allSbilings);

//     const usersWithLengthSC4 = await User.find({ "lengthSC": userdata.lengthSC });
//     const userCount = Object.keys(usersWithLengthSC4).length;

//     console.log("userCount ", userCount);

//     if (userCount == allSbilings) {

//       console.log("userCount ", "true");
//       var userdata = await User.findById({ _id })
//       const topupAmount = userdata.topupAmount;
//       var topupBonus = (topupAmount * 10) / 100;
//       // return console.log(topupBonus);

//       const sponsor = userdata.sponsor;
//       const subSponser = userdata.subSponser;
//       // find Sponsor
//       var sponsorDoc = await User.findById({ _id: sponsor })
//       const sponsorlengthSC = sponsorDoc.lengthSC
//       // find subsponsor
//       var subSponsorDoc = await User.findById({ _id: sponsor })
//       const subSponsorlengthSC = subSponsorDoc.lengthSC;

//       const loopLength = sponsorlengthSC - subSponsorlengthSC;

//       var userIds = []

//       for (let i = 0; i <= loopLength; i++) {
//         const desiredLength = sponsorlengthSC + i;
//         const usersWithDesiredLength = await User.find({ lengthSC: desiredLength })

//         const userIdsWithDesiredLength = usersWithDesiredLength.map(user => user._id);
//         userIds.push(...userIdsWithDesiredLength);
//       }
//       console.log("yregfuyewgfiuerhfiuerg", userIds);

//       if (userIds.length === 0) {
//         return res.status(404).json({ error: 'No users to update' });
//       } else if (userIds.length > 400) {
//         return res.status(404).json({ error: 'Maximun 200 pairs' });
//       }

//       for (const userId of userIds) {
//         const userToUpdate = await User.findById(userId);
//         console.log(userToUpdate)
//         if (userToUpdate) {
//           userToUpdate.pairEarning = (userToUpdate.pairEarning || 0) + topupBonus;
//           console.log(userToUpdate);
//           await userToUpdate.save();
//         }
//       }
//       return res.status(201).json({ message: 'All user IDs are updated' });
//     }

//   } catch (err) {
//     return res.status(500).json(err.message);
//   }

// }





const userInfo = async (req, res) => {
  var { _id } = req.params;
  try {
    var userdata = await User.findById({ _id });
    return res.status(201).json(userdata);
  } catch (err) {
    return res.status(500).json({
      message: 'error',
      err,
    });
  }
};

const loginWithUserName = async (req, res, next) => {
  try {
    var { username, password } = req.body;
    const time = new Date().getTime();

    if (username == null && password == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(409).json({ message: 'Invalid username' });
    }
    const payload = {
      userId: userDoc._id,
      expiresIn: 60 * 1000,
    };

    if (userDoc && (await bcrypt.compare(password, userDoc.password))) {

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.cookie('token', token, {
        maxAge: 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });

      // user
      return res.status(200).json({
        status: 200,
        message: 'user Login successfully',
        token,
      });
    }
    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
};

const deleteuser = async (req, res) => {
  const { id } = req.params;

  try {
      const deletedUser = await User.findByIdAndDelete(id).exec();

      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  userRegEmail,
  userRegMobile,
  userInfo,
  loginWithUserName,
  pairEarning,
  alldata,
  autoPool,
  leftRightPurchaces, frogetPass, statusUpdate ,deleteuser
};
