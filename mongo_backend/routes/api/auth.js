const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { check, validationResult } = require('express-validator');

const Member = require('../../models/Member');

// @route    GET api/auth
// @desc     Get member by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.member.id).select('-password');
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate member & get token
// @access   Public
router.post(
  '/',
  async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let member = await Member.findOne({ email });

      if (!member) {
        return res
          .status(400)
          .json({ errors:  'You were not registered by Leader.' });
      }

      const isMatch = await bcrypt.compare(password, member.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors:  'Invalid Password.' });
      }

      if(member.authority=='guest'){
        return res
          .status(400)
          .json({ errors: 'The leader have to accept your request.' });
      }

      const payload = {
        member: {
          id: member._id,
          authority:member.authority
        }
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
