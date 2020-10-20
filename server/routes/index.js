const express = require("express");
const User = require("../models/user");
const { Op } = require("sequelize");
const router = express.Router();

// 1. query는 클라리언트에서 GET 방식으로 전송한 요청 파라미터를 확인
// 2. body는 클라리언트에서 POST 방식으로 전송한 요청 파라미터를 확인
// 3. header 헤더 확인

router.post("/insert", async (req, res, next) => {
  try {
    const users = await User.create({
      name: req.body.name,
      contents: req.body.contents,
      writer: req.body.writer,
      date: req.body.date,
    });
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/getAll", async (req, res, next) => {
  try {
    const user = await User.findAll();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/update", async (req, res, next) => {
  try {
    const results = await User.update(
      {
        name: req.body.name,
        contents: req.body.contents,
        writer: req.body.writer,
        date: req.body.date,
      },
      { where: { id: req.body.id } }
    );
    res.json({ success: results });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// :id 이 방식으로 해당 열의 id 값을 가져오고 sequalize 조건절에 삽입
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    res.json({ success: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/search/:name", async (req, res, next) => {
  try {
    const result = await User.findAll({
      where: {
        [Op.or]: [
          { contents: req.params.name },
          { name: req.params.name },
          { writer: req.params.name },
        ],
      },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
