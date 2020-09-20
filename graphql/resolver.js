const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll();
                console.log(users)

                return users;
            }catch (err){
                console.log(err);
            }
        },
    },
    Mutation: {
        register: async (_, args) =>{
            let { username, email, password, confirmPassword } = args;
            let errors = {};

            try{
                // Validate input data
                if(email.trim() == '') errors.email = 'email must not be empty'
                if(username.trim() == '') errors.uesername = 'username must not be empty'
                if(password.trim() == '') errors.password = 'passwrod must not be empty'
                if(confirmPassword.trim() == '') errors.confirmPassword = 'repeat password must not be empty'

                if(password !== confirmPassword) errors.confirmPassword = 'password must match'

                //TODO: check if username / email exists
                const userByUsername = await User.findOne({where: { username }});
                const userByEmail = await User.findOne({where: { email }});

                if(userByUsername) errors.username = 'Username is taken'
                if(userByEmail) errors.email = 'Email is taken'

                if(Object.keys(errors).length > 0){
                    throw errors
                }

                // Hash Password
                password =  await bcrypt.hash(password,6)
                // Create user
                const user = await User.create({
                    username,email,password
                })
                // Return user
                return user;
            }catch (err){
                console.log(err)
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(e => (errors[e.path] = `${e.path} is aleardy taken`))
                }
                throw new UserInputError('Bad input', { errors });
            }
        }
    }
}
