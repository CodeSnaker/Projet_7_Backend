const app = require("../app");
const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");

app.use(express.json());
app.post("/api/auth/signup", (req, resp, next) => {});
