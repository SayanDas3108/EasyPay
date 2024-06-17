
const { z } = require("zod");

const UserSignUp = z.object({
  username : z.string().email(),
  firstname: z.string(),
  lastname : z.string(),
  password : z.string()
});

const UserSignIn = z.object({
    username : z.string().email(),
    password : z.string()
  });

  const updateBody = z.object({
    password: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
  })

module.exports = { UserSignUp , UserSignIn , updateBody };